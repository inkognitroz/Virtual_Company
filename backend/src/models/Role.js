const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Role name is required'],
        trim: true
    },
    avatar: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    aiInstructions: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
roleSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Role', roleSchema);
