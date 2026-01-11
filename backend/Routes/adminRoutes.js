const express = require('express');
const router = express.Router();
const Scan = require('../Models/Scan');
const User = require('../Models/User');
const adminProtect = require('../Middleware/adminAuth');

// GET all scans with user details (Master History)
router.get('/master-history', adminProtect, async (req, res) => {
  try {
    // 1. Find all scans
    // 2. 'populate' replaces the userId with the actual User object
    // 3. We only select fullName and email for security
    const history = await Scan.find()
      .populate('userId', 'fullName email') 
      .sort({ 'prediction.timestamp': -1 }); // Newest scans first

    res.json({
      totalScans: history.length,
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

module.exports = router;