const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Validate required environment variables
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error('❌ FATAL ERROR: JWT_SECRET is not set in production!');
    console.error('Please set JWT_SECRET environment variable to a secure random string.');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.warn('⚠ WARNING: JWT_SECRET not set. Using fallback (NOT FOR PRODUCTION!)');
    process.env.JWT_SECRET = 'dev-secret-change-in-production-' + Date.now();
}

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Serve static files
app.use(express.static('./', {
    index: 'index.html',
    extensions: ['html']
}));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual-company';

// Track database status
let isDatabaseConnected = false;

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000
})
    .then(() => {
        console.log('✓ Connected to MongoDB');
        isDatabaseConnected = true;
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        console.log('⚠ Running without database - API endpoints will return errors');
        console.log('⚠ Use the frontend in localStorage mode instead');
        isDatabaseConnected = false;
    });

// Make database status available to routes
app.use((req, res, next) => {
    req.isDatabaseConnected = isDatabaseConnected;
    next();
});

// Routes
const checkDatabase = require('./middleware/checkDatabase');

// Apply database check to all API routes except health check
app.use('/api/auth', checkDatabase, require('./routes/auth'));
app.use('/api/users', checkDatabase, require('./routes/users'));
app.use('/api/roles', checkDatabase, require('./routes/roles'));
app.use('/api/messages', checkDatabase, require('./routes/messages'));
app.use('/api/ai', checkDatabase, require('./routes/ai'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        message: mongoose.connection.readyState === 1 
            ? 'Backend fully operational' 
            : 'Backend running without database - use frontend localStorage mode'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: { message: 'API endpoint not found' } });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ Frontend: http://localhost:${PORT}`);
    console.log(`✓ API: http://localhost:${PORT}/api`);
});
