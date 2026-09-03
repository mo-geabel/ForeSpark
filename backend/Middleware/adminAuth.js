const auth = require('./auth');

const adminProtect = (req, res, next) => {
  auth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    if (req.user.isPaused) {
      return res.status(403).json({ message: "Your account is paused. Please contact an administrator." });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  });
};

module.exports = adminProtect;