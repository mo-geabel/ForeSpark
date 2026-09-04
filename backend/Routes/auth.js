const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User'); // Ensure this path matches your User model
const auth = require('../Middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// @route   POST api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // 1. Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create a new user instance
    // Note: Mongoose only applies the schema fields. Any "ghost" fields 
    // like 'username' will be null by default, triggering that index error.
    user = new User({
      fullName,
      email,
      password,
    });

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save to MongoDB (FIXED SYNTAX)
    // Use user.save() NOT User.save(user)
    await user.save();

    // 5. Create and return JWT
    const payload = {
      user: {
        id: user._id,
        role: user.role || 'user'
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        // Don't send the password back to the frontend for security
        const userResponse = {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isPaused: user.isPaused || false
        };
        res.json({ token, user: userResponse });
      }
    );

  } catch (err) {
    console.error("Registration Error:", err.message);
    
    // Catch the specific Duplicate Key error to give a better hint
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Database Conflict: A ghost index (username) is likely blocking this. Please drop the 'username_1' index in MongoDB." 
      });
    }
    
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check if account is paused
    if (user.isPaused) {
      return res.status(403).json({ message: 'Your account is paused. Please contact an administrator.' });
    }

    // 2. Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 3. Create and return JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        // Return token and basic user info (excluding password)
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            fullName: user.fullName, 
            email: user.email, 
            role: user.role,
            isPaused: user.isPaused
          } 
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      role: user.role,
      isPaused: user.isPaused || false,
      date: user.date
    });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile (fullName, phoneNumber)
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;
    const userId = req.user._id || req.user.id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName !== undefined && fullName.trim() !== '') {
      user.fullName = fullName.trim();
    }
    if (phoneNumber !== undefined) {
      user.phoneNumber = phoneNumber.trim();
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        role: user.role,
        isPaused: user.isPaused || false,
        date: user.date
      }
    });
  } catch (err) {
    console.error("Error updating user profile:", err.message);
    res.status(500).json({ message: 'Server error updating profile', error: err.message });
  }
});


router.post('/google', async (req, res) => {
    // 1. Add a log to see if the request even reaches here
    console.log("Google Login request received");

    try {
        const { idToken } = req.body;
        if (!idToken) {
            console.log("No idToken provided");
            return res.status(400).json({ message: "No token provided" });
        }

        // 2. Verify with Google
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        console.log("Google payload verified for:", payload.email);

        const { email, name, sub } = payload;

        // 3. Find or Create User
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                fullName: name || email.split('@')[0], // Fallback to email prefix if name is missing
                email: email,
                password: `google_${sub}`, // Secure placeholder
                role: 'user'
            });
            await user.save();
        }

        // Check if account is paused
        if (user.isPaused) {
          return res.status(403).json({ message: "Your account is paused. Please contact an administrator." });
        }

        // 4. Generate JWT
        const myPayload = { user: { id: user._id, role: user.role } };
        const token = jwt.sign(myPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

        // 5. SEND THE RESPONSE (Crucial!)
        // Format the user response EXACTLY like normal login to avoid frontend state issues
        const userResponse = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isPaused: user.isPaused || false
        };
        
        return res.status(200).json({ token, user: userResponse });

    } catch (error) {
        // This is where most "empty responses" happen
        console.error("DETAILED GOOGLE ERROR:", error.message);
        return res.status(401).json({ 
            message: "Google verification failed", 
            error: error.message 
        });
    }
});


module.exports = router;