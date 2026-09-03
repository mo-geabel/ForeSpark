const express = require('express');
const router = express.Router();
const Policy = require('../Models/Policy');
const adminProtect = require('../Middleware/adminAuth');

// Helper to get or create the single policy document
const getOrCreatePolicy = async () => {
  let policy = await Policy.findOne();
  if (!policy) {
    policy = new Policy();
    await policy.save();
  }
  return policy;
};

// @route   GET /api/policies
// @desc    Get the current active terms and privacy policy (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const policy = await getOrCreatePolicy();
    res.json(policy);
  } catch (err) {
    console.error('Error fetching policy:', err.message);
    res.status(500).json({ message: 'Server error retrieving policy', error: err.message });
  }
});

// @route   PUT /api/policies
// @desc    Update the active policy (Admin only)
// @access  Private (Admin)
router.put('/', adminProtect, async (req, res) => {
  try {
    const { title, content, requireAcceptance } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Policy content cannot be empty.' });
    }

    let policy = await getOrCreatePolicy();

    if (title !== undefined) policy.title = title.trim();
    if (content !== undefined) policy.content = content.trim();
    if (requireAcceptance !== undefined) policy.requireAcceptance = Boolean(requireAcceptance);

    policy.lastUpdated = new Date();
    policy.updatedBy = req.user.fullName || req.user.email || 'Admin';

    await policy.save();

    res.json({
      message: 'Policy updated successfully.',
      policy,
    });
  } catch (err) {
    console.error('Error updating policy:', err.message);
    res.status(500).json({ message: 'Server error updating policy', error: err.message });
  }
});

// Also support PATCH
router.patch('/', adminProtect, async (req, res) => {
  try {
    const { title, content, requireAcceptance } = req.body;

    let policy = await getOrCreatePolicy();

    if (title !== undefined) policy.title = title.trim();
    if (content !== undefined) policy.content = content.trim();
    if (requireAcceptance !== undefined) policy.requireAcceptance = Boolean(requireAcceptance);

    policy.lastUpdated = new Date();
    policy.updatedBy = req.user.fullName || req.user.email || 'Admin';

    await policy.save();

    res.json({
      message: 'Policy updated successfully.',
      policy,
    });
  } catch (err) {
    console.error('Error updating policy:', err.message);
    res.status(500).json({ message: 'Server error updating policy', error: err.message });
  }
});

module.exports = router;
