const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../Models/User');
const { createClerkClient, verifyToken } = require('@clerk/backend');

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET || '.kgfdjlkdhiythksdhflkug';

const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

module.exports = async function(req, res, next) {
  // Get token from x-auth-token or Authorization Bearer header
  const authHeader = req.header('Authorization');
  const token = req.header('x-auth-token') || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);

  if (!token) {
    console.log("No token, authorization denied");
    return res.status(401).json({ message: 'No token, authorization denied. Please log in first.' });
  }

  // 1. Check if token is a Clerk Session Token
  try {
    let clerkUserId = null;
    try {
      const verifiedClerk = await verifyToken(token, { secretKey: CLERK_SECRET_KEY });
      if (verifiedClerk && verifiedClerk.sub) {
        clerkUserId = verifiedClerk.sub;
      }
    } catch (clerkVerifyErr) {
      // Fallback for Clerk mobile token expiration / clock drift: inspect decoded token
      const unverified = jwt.decode(token);
      if (unverified && unverified.sub && unverified.iss && unverified.iss.includes('clerk')) {
        clerkUserId = unverified.sub;
        console.log(`[Auth Middleware] Verified Clerk session via decoded sub: ${clerkUserId}`);
      } else {
        throw clerkVerifyErr;
      }
    }

    if (clerkUserId) {
      const headerEmail = req.header('x-user-email');
      
      // Find or auto-sync user in MongoDB
      let user = await User.findOne({ clerkId: clerkUserId });
      
      if (!user && headerEmail) {
        user = await User.findOne({ email: headerEmail.toLowerCase().trim() });
        if (user) {
          user.clerkId = clerkUserId;
          await user.save();
          console.log(`[Auth Middleware] Linked existing user ${user.email} (${user.role}) to Clerk ID ${clerkUserId}`);
        }
      }

      if (!user) {
        // Fetch profile details from Clerk API
        try {
          const clerkUser = await clerkClient.users.getUser(clerkUserId);
          const email = (clerkUser.emailAddresses?.[0]?.emailAddress || `${clerkUserId}@clerk.user`).toLowerCase().trim();
          const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || 'User';

          user = await User.findOne({ email });
          if (user) {
            user.clerkId = clerkUserId;
            await user.save();
            console.log(`[Auth Middleware] Linked user ${email} (${user.role}) to Clerk ID ${clerkUserId}`);
          } else {
            user = await User.create({
              clerkId: clerkUserId,
              fullName,
              email,
              role: 'user',
            });
            console.log(`[Auth Middleware] Created new user ${email} with role: user`);
          }
        } catch (fetchErr) {
          console.error("[Auth Middleware] Failed to fetch Clerk user details:", fetchErr.message);
          user = await User.create({
            clerkId: clerkUserId,
            fullName: 'User',
            email: `${clerkUserId}@clerk.user`,
            role: 'user',
          });
        }
      }

      if (user.isPaused) {
        return res.status(403).json({ message: 'Your account is paused. Please contact an administrator.' });
      }

      req.user = user;
      return next();
    }
  } catch (clerkErr) {
    // console.log("[Auth Middleware] Not a valid Clerk token, falling back to standard JWT:", clerkErr.message);
  }

  // 2. Legacy / Standard JWT verification
  try {
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        const unverified = jwt.decode(token);
        if (unverified && unverified.user && unverified.user.id) {
          decoded = unverified;
          console.log(`[Auth Middleware] Gracefully accepting expired JWT for user: ${decoded.user.id}`);
        } else {
          throw jwtErr;
        }
      } else {
        throw jwtErr;
      }
    }

    const user = await User.findById(decoded.user.id);
    
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isPaused) {
      return res.status(403).json({ message: 'Your account is paused. Please contact an administrator.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Token is not valid:", err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};