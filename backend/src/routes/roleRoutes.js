const express = require('express');
const { body } = require('express-validator');
const {
    getRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole
} = require('../controllers/roleController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validator');

const router = express.Router();

// Validation rules
const roleValidation = [
    body('name').notEmpty().withMessage('Role name is required'),
    body('avatar').notEmpty().withMessage('Avatar is required')
];

// Routes
router.route('/')
    .get(protect, getRoles)
    .post(protect, roleValidation, validate, createRole);

router.route('/:id')
    .get(protect, getRole)
    .put(protect, updateRole)
    .delete(protect, deleteRole);

module.exports = router;
