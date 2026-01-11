const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const adminProtect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in headers
  if (req.header('x-auth-token')) {
    token = req.header('x-auth-token');
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find user and check role
    const user = await User.findById(decoded.user.id);

    if (user && user.role === 'admin') {
      req.user = user; // Pass user data to the next function
      next();
    } else {
      res.status(403).json({ message: "Access denied: Admins only" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = adminProtect;