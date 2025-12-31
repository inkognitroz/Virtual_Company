const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');
const { 
    sanitizeString, 
    sanitizeEmail, 
    validatePassword, 
    validateUsername 
} = require('../utils/validation');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, username, password, name } = req.body;

        // Validate input
        if (!email || !username || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Sanitize and validate email
        const sanitizedEmail = sanitizeEmail(email);
        if (!sanitizedEmail) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            return res.status(400).json({ error: usernameValidation.message });
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ error: passwordValidation.message });
        }

        // Sanitize name
        const sanitizedName = sanitizeString(name, 100);
        if (!sanitizedName) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // Check if user already exists
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(sanitizedEmail, username.trim());
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = db.prepare('INSERT INTO users (email, username, password, name) VALUES (?, ?, ?, ?)').run(sanitizedEmail, username.trim(), hashedPassword, sanitizedName);

        // Generate JWT token
        const token = jwt.sign(
            { id: result.lastInsertRowid, username: username.trim(), email: sanitizedEmail },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: result.lastInsertRowid, username: username.trim(), email: sanitizedEmail, name: sanitizedName }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user by username or email
        const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Logout (client-side token removal, but we can track this if needed)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

module.exports = router;
