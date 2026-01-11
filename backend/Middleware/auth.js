const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../Models/User');
module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  if (!token) {
    console.log("No token, authorization denied");
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.user.id);
    
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user; // Adds { userId, role } to the request object
    next();
  } catch (err) {
    console.log("Token is not valid");
    res.status(401).json({ message: 'Token is not valid' });
  }
};