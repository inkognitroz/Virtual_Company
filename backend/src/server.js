require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { RATE_LIMIT } = require('./config/constants');

const authRoutes = require('./routes/auth');
const rolesRoutes = require('./routes/roles');
const messagesRoutes = require('./routes/messages');
const aiConfigRoutes = require('./routes/aiConfig');

const app = express();
const PORT = process.env.PORT || 3000;

// Request logging - use 'combined' format in production, 'dev' in development
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// Security middleware - helmet for secure headers
app.use(helmet());

// Compression middleware - reduces response size
app.use(compression());

// Rate limiting - prevents abuse
const apiLimiter = rateLimit({
    windowMs: RATE_LIMIT.WINDOW_MS,
    max: RATE_LIMIT.MAX_REQUESTS,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: RATE_LIMIT.WINDOW_MS,
    max: RATE_LIMIT.AUTH_MAX_REQUESTS,
    message: { error: 'Too many authentication attempts, please try again later' }
});

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',') 
    : ['http://localhost:8000', 'http://127.0.0.1:8000'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // In development, allow localhost origins
        if (process.env.NODE_ENV === 'development') {
            const isLocalhost = origin.startsWith('http://localhost:') || 
                              origin.startsWith('http://127.0.0.1:');
            if (isLocalhost) {
                return callback(null, true);
            }
        }
        
        // Check if origin exactly matches allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/ai-config', aiConfigRoutes);

// Health check endpoint with detailed status
app.get('/api/health', (req, res) => {
    const healthcheck = {
        status: 'ok',
        message: 'Virtual Company API is running',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    };
    res.json(healthcheck);
});

// 404 handler - must be after all other routes
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: 'The requested resource was not found',
        path: req.path
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    // Log error details
    console.error('Unhandled error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });
    
    // Don't leak error details in production
    const errorMessage = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;
    
    res.status(err.status || 500).json({ 
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Virtual Company API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
