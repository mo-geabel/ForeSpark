const express = require('express');
const router = express.Router();
const Scan = require('../Models/Scan');
const User = require('../Models/User');
const adminProtect = require('../Middleware/adminAuth');

// GET all scans with user details (Master History)
router.get('/master-history', adminProtect, async (req, res) => {
  try {
    // 1. Fetch all scans with user details
    console.log("Fetching master history...");
    const history = await Scan.find()
      .populate('userId', 'fullName email') 
      .sort({ 'prediction.timestamp': -1 });

    // 2. Calculate Admin Statistics
    const stats = {
      total: history.length,
      likes: history.filter(s => s.userFeedback?.isCorrect === true).length,
      dislikes: history.filter(s => s.userFeedback?.isCorrect === false).length,
      unreviewed: history.filter(s => s.userFeedback?.isCorrect === null).length
    };

    // Calculate Accuracy Percentage based on user feedback
    const accuracyRate = stats.total > 0 
      ? ((stats.likes / (stats.likes + stats.dislikes || 1)) * 100).toFixed(1) 
      : 0;

    res.json({
      summary: {
        ...stats,
        accuracyRate: `${accuracyRate}%`
      },
      data: history
    });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching master history", error: err.message });
  }
});

// GET only scans where the AI might have been wrong (for retraining)
router.get('/rl-training-data', async (req, res) => {
  try {
    const mistakes = await Scan.find({ 'userFeedback.isCorrect': false })
      .populate('userId', 'fullName');
    res.json(mistakes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching training data" });
  }
});

// ─── USER MANAGEMENT ENDPOINTS ────────────────────────────────────────────────

// GET all users with metrics summary
router.get('/users', adminProtect, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ date: -1 });

    const summary = {
      totalUsers: users.length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role !== 'admin').length,
      activeUsers: users.filter(u => !u.isPaused).length,
      pausedUsers: users.filter(u => u.isPaused).length,
    };

    res.json({
      summary,
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Server error fetching users", error: err.message });
  }
});

// PATCH change user role ('admin' <-> 'user')
router.patch('/users/:id/role', adminProtect, async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Role must be 'admin' or 'user'." });
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found." });
    }

    // Safeguard: Prevent admin from revoking their own admin role
    if (req.user._id.toString() === id && role !== 'admin') {
      return res.status(400).json({ message: "You cannot demote your own admin account." });
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    res.json({
      message: `User role successfully updated to ${role}.`,
      user: {
        _id: userToUpdate._id,
        fullName: userToUpdate.fullName,
        email: userToUpdate.email,
        role: userToUpdate.role,
        isPaused: userToUpdate.isPaused,
        date: userToUpdate.date,
      },
    });
  } catch (err) {
    console.error("Error updating user role:", err.message);
    res.status(500).json({ message: "Server error updating user role", error: err.message });
  }
});

// PATCH pause / resume user account
router.patch('/users/:id/status', adminProtect, async (req, res) => {
  try {
    const { isPaused } = req.body;
    const { id } = req.params;

    if (typeof isPaused !== 'boolean') {
      return res.status(400).json({ message: "isPaused must be a boolean." });
    }

    // Safeguard: Prevent admin from pausing their own account
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot pause your own account." });
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found." });
    }

    userToUpdate.isPaused = isPaused;
    await userToUpdate.save();

    res.json({
      message: `User account has been ${isPaused ? 'paused' : 'activated'} successfully.`,
      user: {
        _id: userToUpdate._id,
        fullName: userToUpdate.fullName,
        email: userToUpdate.email,
        role: userToUpdate.role,
        isPaused: userToUpdate.isPaused,
        date: userToUpdate.date,
      },
    });
  } catch (err) {
    console.error("Error updating user status:", err.message);
    res.status(500).json({ message: "Server error updating user status", error: err.message });
  }
});

// DELETE user account
router.delete('/users/:id', adminProtect, async (req, res) => {
  try {
    const { id } = req.params;

    // Safeguard: Prevent admin from deleting their own account
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete user's scans as cleanup
    await Scan.deleteMany({ userId: id });

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({ message: `User ${userToDelete.fullName} (${userToDelete.email}) deleted successfully.` });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ message: "Server error deleting user", error: err.message });
  }
});

// ─── POLICY MANAGEMENT ENDPOINTS ──────────────────────────────────────────────

const Policy = require('../Models/Policy');

// GET policies for admin
router.get('/policies', adminProtect, async (req, res) => {
  try {
    let policy = await Policy.findOne();
    if (!policy) {
      policy = new Policy();
      await policy.save();
    }
    res.json(policy);
  } catch (err) {
    console.error("Error fetching admin policy:", err.message);
    res.status(500).json({ message: "Server error fetching policy", error: err.message });
  }
});

// PUT update policies for admin
router.put('/policies', adminProtect, async (req, res) => {
  try {
    const { title, content, requireAcceptance } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Policy content cannot be empty." });
    }

    let policy = await Policy.findOne();
    if (!policy) {
      policy = new Policy();
    }

    if (title !== undefined) policy.title = title.trim();
    if (content !== undefined) policy.content = content.trim();
    if (requireAcceptance !== undefined) policy.requireAcceptance = Boolean(requireAcceptance);

    policy.lastUpdated = new Date();
    policy.updatedBy = req.user.fullName || req.user.email || 'Admin';

    await policy.save();

    res.json({
      message: "Policies updated successfully.",
      policy,
    });
  } catch (err) {
    console.error("Error updating policy:", err.message);
    res.status(500).json({ message: "Server error updating policy", error: err.message });
  }
});

module.exports = router;