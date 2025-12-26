const express = require('express');
const { body } = require('express-validator');
const {
    getMessages,
    createMessage,
    deleteMessage,
    deleteAllMessages
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validator');

const router = express.Router();

// Validation rules
const messageValidation = [
    body('sender').notEmpty().withMessage('Sender is required'),
    body('content').notEmpty().withMessage('Message content is required')
];

// Routes
router.route('/')
    .get(protect, getMessages)
    .post(protect, messageValidation, validate, createMessage)
    .delete(protect, deleteAllMessages);

router.route('/:id')
    .delete(protect, deleteMessage);

module.exports = router;
