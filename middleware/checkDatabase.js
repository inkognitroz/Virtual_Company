const mongoose = require('mongoose');

const checkDatabase = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            error: {
                message: 'Database not available',
                details: 'MongoDB is not connected. Please configure and connect to MongoDB or use the frontend in localStorage mode.',
                hint: 'See BACKEND_SETUP.md for database setup instructions'
            }
        });
    }
    next();
};

module.exports = checkDatabase;
