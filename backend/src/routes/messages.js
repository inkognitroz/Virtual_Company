const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { sanitizeString, sanitizeText } = require('../utils/validation');
const { LENGTH_LIMITS } = require('../config/constants');

const router = express.Router();

// Get all messages for current user
router.get('/', authenticateToken, (req, res) => {
    try {
        const messages = db.prepare('SELECT * FROM messages WHERE user_id = ? ORDER BY created_at ASC').all(req.user.id);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error fetching messages' });
    }
});

// Create new message
router.post('/', authenticateToken, (req, res) => {
    try {
        const { sender, senderName, avatar, content, time, roleInstructions, isAI } = req.body;

        // Validate input
        if (!sender || !senderName || !avatar || !content || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Sanitize inputs
        const sanitizedSender = sanitizeString(sender, LENGTH_LIMITS.NAME_MAX);
        const sanitizedSenderName = sanitizeString(senderName, LENGTH_LIMITS.NAME_MAX);
        const sanitizedAvatar = sanitizeString(avatar, LENGTH_LIMITS.ROLE_AVATAR_MAX);
        const sanitizedContent = sanitizeText(content, LENGTH_LIMITS.MESSAGE_CONTENT_MAX);
        const sanitizedTime = sanitizeString(time, LENGTH_LIMITS.TIME_STRING_MAX);
        const sanitizedInstructions = sanitizeText(roleInstructions || '', LENGTH_LIMITS.AI_INSTRUCTIONS_MAX);

        if (!sanitizedSender || !sanitizedSenderName || !sanitizedAvatar || !sanitizedContent) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        // Insert message
        const result = db.prepare(
            'INSERT INTO messages (user_id, sender, sender_name, avatar, content, time, role_instructions, is_ai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(req.user.id, sanitizedSender, sanitizedSenderName, sanitizedAvatar, sanitizedContent, sanitizedTime, sanitizedInstructions || null, isAI ? 1 : 0);

        res.status(201).json({
            message: 'Message created successfully',
            id: result.lastInsertRowid
        });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Server error creating message' });
    }
});

// Clear all messages for current user
router.delete('/', authenticateToken, (req, res) => {
    try {
        db.prepare('DELETE FROM messages WHERE user_id = ?').run(req.user.id);
        res.json({ message: 'All messages cleared successfully' });
    } catch (error) {
        console.error('Error clearing messages:', error);
        res.status(500).json({ error: 'Server error clearing messages' });
    }
});

module.exports = router;
