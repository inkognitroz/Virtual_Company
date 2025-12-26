const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Verify JWT Token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        // Log invalid tokens in development for debugging
        if (process.env.NODE_ENV === 'development') {
            console.error('JWT verification failed:', error.message);
        }
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};
