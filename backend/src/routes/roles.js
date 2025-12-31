const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { sanitizeString, sanitizeText } = require('../utils/validation');

const router = express.Router();

// Get all roles for current user
router.get('/', authenticateToken, (req, res) => {
    try {
        const roles = db.prepare('SELECT * FROM roles WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Server error fetching roles' });
    }
});

// Create new role
router.post('/', authenticateToken, (req, res) => {
    try {
        const { id, name, avatar, description, aiInstructions } = req.body;

        // Validate input
        if (!id || !name || !avatar) {
            return res.status(400).json({ error: 'Role ID, name, and avatar are required' });
        }

        // Sanitize inputs
        const sanitizedName = sanitizeString(name, 100);
        const sanitizedAvatar = sanitizeString(avatar, 10);
        const sanitizedDescription = sanitizeText(description || '', 500);
        const sanitizedInstructions = sanitizeText(aiInstructions || '', 2000);

        if (!sanitizedName || !sanitizedAvatar) {
            return res.status(400).json({ error: 'Invalid name or avatar' });
        }

        // Insert role
        const result = db.prepare(
            'INSERT INTO roles (id, user_id, name, avatar, description, ai_instructions) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(id, req.user.id, sanitizedName, sanitizedAvatar, sanitizedDescription, sanitizedInstructions);

        res.status(201).json({
            message: 'Role created successfully',
            role: { id, name: sanitizedName, avatar: sanitizedAvatar, description: sanitizedDescription, aiInstructions: sanitizedInstructions }
        });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Server error creating role' });
    }
});

// Update role
router.put('/:id', authenticateToken, (req, res) => {
    try {
        const { name, avatar, description, aiInstructions } = req.body;
        const roleId = req.params.id;

        // Check if role exists and belongs to user
        const role = db.prepare('SELECT * FROM roles WHERE id = ? AND user_id = ?').get(roleId, req.user.id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        // Update role
        db.prepare(
            'UPDATE roles SET name = ?, avatar = ?, description = ?, ai_instructions = ? WHERE id = ? AND user_id = ?'
        ).run(name, avatar, description, aiInstructions, roleId, req.user.id);

        res.json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Server error updating role' });
    }
});

// Delete role
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const roleId = req.params.id;

        // Check if role exists and belongs to user
        const role = db.prepare('SELECT * FROM roles WHERE id = ? AND user_id = ?').get(roleId, req.user.id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        // Delete role
        db.prepare('DELETE FROM roles WHERE id = ? AND user_id = ?').run(roleId, req.user.id);

        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ error: 'Server error deleting role' });
    }
});

module.exports = router;
