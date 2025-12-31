const validator = require('validator');
const { LENGTH_LIMITS, PASSWORD } = require('../config/constants');

/**
 * Sanitizes and validates string input
 * @param {string} input - The input string to sanitize
 * @param {number} maxLength - Maximum allowed length (default: 1000)
 * @returns {string} Sanitized string
 */
function sanitizeString(input, maxLength = LENGTH_LIMITS.NAME_MAX) {
    if (typeof input !== 'string') {
        return '';
    }
    
    // Trim whitespace and limit length
    let sanitized = input.trim().substring(0, maxLength);
    
    // Escape HTML to prevent XSS
    sanitized = validator.escape(sanitized);
    
    return sanitized;
}

/**
 * Validates and sanitizes email
 * @param {string} email - Email to validate
 * @returns {string|null} Sanitized email or null if invalid
 */
function sanitizeEmail(email) {
    if (typeof email !== 'string') {
        return null;
    }
    
    // Normalize and validate email
    const normalized = validator.normalizeEmail(email);
    
    if (!normalized || !validator.isEmail(normalized)) {
        return null;
    }
    
    return normalized;
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
function validatePassword(password) {
    if (typeof password !== 'string') {
        return { isValid: false, message: 'Password must be a string' };
    }
    
    if (password.length < PASSWORD.MIN_LENGTH) {
        return { isValid: false, message: `Password must be at least ${PASSWORD.MIN_LENGTH} characters long` };
    }
    
    if (password.length > PASSWORD.MAX_LENGTH) {
        return { isValid: false, message: `Password is too long (max ${PASSWORD.MAX_LENGTH} characters)` };
    }
    
    return { isValid: true };
}

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {Object} Validation result with isValid and message
 */
function validateUsername(username) {
    if (typeof username !== 'string') {
        return { isValid: false, message: 'Username must be a string' };
    }
    
    const trimmed = username.trim();
    
    if (trimmed.length < LENGTH_LIMITS.USERNAME_MIN) {
        return { isValid: false, message: `Username must be at least ${LENGTH_LIMITS.USERNAME_MIN} characters long` };
    }
    
    if (trimmed.length > LENGTH_LIMITS.USERNAME_MAX) {
        return { isValid: false, message: `Username is too long (max ${LENGTH_LIMITS.USERNAME_MAX} characters)` };
    }
    
    // Allow alphanumeric, underscore, and hyphen
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        return { isValid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
    }
    
    return { isValid: true };
}

/**
 * Sanitizes text content (for messages, descriptions, etc.)
 * @param {string} text - Text to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized text
 */
function sanitizeText(text, maxLength = LENGTH_LIMITS.MESSAGE_CONTENT_MAX) {
    if (typeof text !== 'string') {
        return '';
    }
    
    // Trim and limit length
    return text.trim().substring(0, maxLength);
}

module.exports = {
    sanitizeString,
    sanitizeEmail,
    validatePassword,
    validateUsername,
    sanitizeText
};
