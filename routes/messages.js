const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// Validation rules
const messageValidation = [
    body('sender').isIn(['user', 'role', 'ai']),
    body('senderName').trim().notEmpty(),
    body('avatar').trim().notEmpty(),
    body('content').trim().notEmpty().isLength({ max: 5000 })
];

// Get all messages for current user
router.get('/', auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const skip = parseInt(req.query.skip) || 0;
        
        const messages = await Message.find({ userId: req.userId })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);
        
        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: { message: 'Failed to get messages' } });
    }
});

// Create a new message
router.post('/', auth, messageValidation, async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
        }
        
        const { sender, senderName, avatar, content, roleId, roleInstructions, isAI } = req.body;
        
        const message = new Message({
            userId: req.userId,
            sender,
            senderName,
            avatar,
            content,
            roleId,
            roleInstructions,
            isAI: isAI || false
        });
        
        await message.save();
        
        res.status(201).json({
            message: 'Message created successfully',
            data: message
        });
    } catch (error) {
        console.error('Create message error:', error);
        res.status(500).json({ error: { message: 'Failed to create message' } });
    }
});

// Delete a message
router.delete('/:id', auth, async (req, res) => {
    try {
        const message = await Message.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!message) {
            return res.status(404).json({ error: { message: 'Message not found' } });
        }
        
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ error: { message: 'Failed to delete message' } });
    }
});

// Clear all messages
router.delete('/', auth, async (req, res) => {
    try {
        await Message.deleteMany({ userId: req.userId });
        
        res.json({ message: 'All messages cleared successfully' });
    } catch (error) {
        console.error('Clear messages error:', error);
        res.status(500).json({ error: { message: 'Failed to clear messages' } });
    }
});

module.exports = router;
