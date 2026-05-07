const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { ActivityLog, User } = require('../models');

// Get recent activities (Admin only or user's own activities)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let whereCondition = {};
    
    // If not admin, only show user's own activities
    if (req.user.role !== 'Admin') {
      whereCondition.userId = req.user.id;
    }
    
    const activities = await ActivityLog.findAll({
      where: whereCondition,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

module.exports = router;