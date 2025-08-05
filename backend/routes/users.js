const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: req.user.toPublicJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { language } = req.body;
    const updates = {};

    if (language && ['english', 'hindi', 'marathi', 'tamil'].includes(language)) {
      updates.language = language;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error during profile update' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const Incident = require('../models/Incident');
    const Evidence = require('../models/Evidence');
    
    const [incidentStats, evidenceStats] = await Promise.all([
      Incident.getStats(req.user._id),
      Evidence.getStats(req.user._id)
    ]);
    
    const stats = {
      incidents: incidentStats.length > 0 ? incidentStats[0] : { total: 0, bySeverity: [], byStatus: [], byCategory: [] },
      evidence: evidenceStats.length > 0 ? evidenceStats[0] : { totalFiles: 0, totalSize: 0, byType: [] }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error while fetching statistics' });
  }
});

// Delete user account
router.delete('/account', auth, async (req, res) => {
  try {
    // In a real application, you might want to implement soft delete
    // For now, we'll just mark the user as inactive
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    
    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error while deleting account' });
  }
});

module.exports = router; 