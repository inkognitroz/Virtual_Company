/**
 * Application constants and configuration values
 */

module.exports = {
    // JWT Configuration
    JWT: {
        EXPIRATION: '7d',
        ALGORITHM: 'HS256'
    },

    // Password Security
    PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 128,
        BCRYPT_ROUNDS: 10
    },

    // Input Length Limits
    LENGTH_LIMITS: {
        USERNAME_MIN: 3,
        USERNAME_MAX: 50,
        NAME_MAX: 100,
        ROLE_NAME_MAX: 100,
        ROLE_AVATAR_MAX: 10,
        ROLE_DESCRIPTION_MAX: 500,
        AI_INSTRUCTIONS_MAX: 2000,
        MESSAGE_CONTENT_MAX: 5000,
        TIME_STRING_MAX: 50
    },

    // Rate Limiting
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100,
        AUTH_MAX_REQUESTS: 10
    },

    // Cache Configuration
    CACHE: {
        TTL: 600 // 10 minutes in seconds
    }
};
