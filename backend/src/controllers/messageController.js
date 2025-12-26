const Message = require('../models/Message');

// @desc    Get all messages for current user
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ userId: req.user._id })
            .populate('roleId', 'name avatar')
            .sort({ timestamp: 1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Create new message
// @route   POST /api/messages
// @access  Private
const createMessage = async (req, res) => {
    try {
        const { sender, senderType, roleId, content } = req.body;

        const message = await Message.create({
            userId: req.user._id,
            sender,
            senderType,
            roleId: roleId || null,
            content,
            timestamp: new Date()
        });

        // Populate role if exists
        if (roleId) {
            await message.populate('roleId', 'name avatar');
        }

        res.status(201).json({
            success: true,
            message: 'Message created successfully',
            data: message
        });
    } catch (error) {
        console.error('Create message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Make sure user owns the message
        if (message.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this message'
            });
        }

        await message.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete all messages for current user
// @route   DELETE /api/messages
// @access  Private
const deleteAllMessages = async (req, res) => {
    try {
        await Message.deleteMany({ userId: req.user._id });

        res.status(200).json({
            success: true,
            message: 'All messages deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Delete all messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getMessages,
    createMessage,
    deleteMessage,
    deleteAllMessages
};
