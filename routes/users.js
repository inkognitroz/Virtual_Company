const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        res.json(req.user.toJSON());
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: { message: 'Failed to get user' } });
    }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
    try {
        const { name } = req.body;
        
        if (name) {
            req.user.name = name;
            await req.user.save();
        }
        
        res.json({
            message: 'Profile updated successfully',
            user: req.user.toJSON()
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: { message: 'Failed to update profile' } });
    }
});

module.exports = router;
