const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get AI configuration for current user
router.get('/', authenticateToken, (req, res) => {
    try {
        const config = db.prepare('SELECT * FROM ai_config WHERE user_id = ?').get(req.user.id);
        
        if (!config) {
            return res.json({
                provider: null,
                apiKey: null,
                endpoint: null,
                voiceEnabled: false
            });
        }

        res.json({
            provider: config.provider,
            apiKey: config.api_key,
            endpoint: config.endpoint,
            voiceEnabled: config.voice_enabled === 1
        });
    } catch (error) {
        console.error('Error fetching AI config:', error);
        res.status(500).json({ error: 'Server error fetching AI configuration' });
    }
});

// Update AI configuration
router.put('/', authenticateToken, (req, res) => {
    try {
        const { provider, apiKey, endpoint, voiceEnabled } = req.body;

        // Check if config exists
        const existingConfig = db.prepare('SELECT * FROM ai_config WHERE user_id = ?').get(req.user.id);

        if (existingConfig) {
            // Update existing config
            db.prepare(
                'UPDATE ai_config SET provider = ?, api_key = ?, endpoint = ?, voice_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
            ).run(provider || null, apiKey || null, endpoint || null, voiceEnabled ? 1 : 0, req.user.id);
        } else {
            // Insert new config
            db.prepare(
                'INSERT INTO ai_config (user_id, provider, api_key, endpoint, voice_enabled) VALUES (?, ?, ?, ?, ?)'
            ).run(req.user.id, provider || null, apiKey || null, endpoint || null, voiceEnabled ? 1 : 0);
        }

        res.json({ message: 'AI configuration updated successfully' });
    } catch (error) {
        console.error('Error updating AI config:', error);
        res.status(500).json({ error: 'Server error updating AI configuration' });
    }
});

module.exports = router;
