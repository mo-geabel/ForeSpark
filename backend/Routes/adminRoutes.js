const express = require('express');
const router = express.Router();
const Scan = require('../Models/Scan');
const User = require('../Models/User');
const adminProtect = require('../Middleware/adminAuth');

// GET all scans with user details (Master History)
router.get('/master-history', adminProtect, async (req, res) => {
  try {
    // 1. Fetch all scans with user details
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

module.exports = router;