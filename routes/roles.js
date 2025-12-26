const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Role = require('../models/Role');

// Validation rules
const roleValidation = [
    body('name').trim().notEmpty().isLength({ max: 100 }),
    body('avatar').trim().notEmpty(),
    body('description').optional().trim(),
    body('aiInstructions').optional().trim()
];

// Get all roles for current user
router.get('/', auth, async (req, res) => {
    try {
        const roles = await Role.find({ userId: req.userId })
            .sort({ createdAt: -1 });
        
        res.json(roles);
    } catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({ error: { message: 'Failed to get roles' } });
    }
});

// Create a new role
router.post('/', auth, roleValidation, async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
        }
        
        const { name, avatar, description, aiInstructions } = req.body;
        
        const role = new Role({
            userId: req.userId,
            name,
            avatar,
            description,
            aiInstructions
        });
        
        await role.save();
        
        res.status(201).json({
            message: 'Role created successfully',
            role
        });
    } catch (error) {
        console.error('Create role error:', error);
        res.status(500).json({ error: { message: 'Failed to create role' } });
    }
});

// Get a specific role
router.get('/:id', auth, async (req, res) => {
    try {
        const role = await Role.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!role) {
            return res.status(404).json({ error: { message: 'Role not found' } });
        }
        
        res.json(role);
    } catch (error) {
        console.error('Get role error:', error);
        res.status(500).json({ error: { message: 'Failed to get role' } });
    }
});

// Update a role
router.put('/:id', auth, roleValidation, async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
        }
        
        const { name, avatar, description, aiInstructions } = req.body;
        
        const role = await Role.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!role) {
            return res.status(404).json({ error: { message: 'Role not found' } });
        }
        
        role.name = name;
        role.avatar = avatar;
        role.description = description;
        role.aiInstructions = aiInstructions;
        
        await role.save();
        
        res.json({
            message: 'Role updated successfully',
            role
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ error: { message: 'Failed to update role' } });
    }
});

// Delete a role
router.delete('/:id', auth, async (req, res) => {
    try {
        const role = await Role.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!role) {
            return res.status(404).json({ error: { message: 'Role not found' } });
        }
        
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Delete role error:', error);
        res.status(500).json({ error: { message: 'Failed to delete role' } });
    }
});

module.exports = router;
