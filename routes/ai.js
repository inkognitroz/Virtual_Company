const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Validation rules
const aiRequestValidation = [
    body('message').trim().notEmpty().isLength({ max: 5000 }),
    body('provider').optional().isIn(['openai', 'claude', 'custom']),
    body('roleInstructions').optional().trim()
];

// Proxy AI request (to hide API keys from frontend)
router.post('/chat', auth, aiRequestValidation, async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
        }
        
        const { message, provider, roleInstructions, endpoint } = req.body;
        
        // Get API key from environment (server-side only)
        let apiKey;
        let apiUrl;
        
        if (provider === 'openai') {
            apiKey = process.env.OPENAI_API_KEY;
            apiUrl = 'https://api.openai.com/v1/chat/completions';
            
            if (!apiKey) {
                return res.status(400).json({
                    error: { message: 'OpenAI API key not configured on server' }
                });
            }
            
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            ...(roleInstructions ? [{ role: 'system', content: roleInstructions }] : []),
                            { role: 'user', content: message }
                        ],
                        max_tokens: 500
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || 'API request failed');
                }
                
                const data = await response.json();
                return res.json({
                    response: data.choices[0].message.content,
                    provider: 'openai'
                });
            } catch (error) {
                console.error('OpenAI API error:', error);
                return res.status(500).json({
                    error: { message: 'AI request failed', details: error.message }
                });
            }
            
        } else if (provider === 'claude') {
            apiKey = process.env.CLAUDE_API_KEY;
            apiUrl = 'https://api.anthropic.com/v1/messages';
            
            if (!apiKey) {
                return res.status(400).json({
                    error: { message: 'Claude API key not configured on server' }
                });
            }
            
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-sonnet-20240229',
                        max_tokens: 500,
                        messages: [
                            {
                                role: 'user',
                                content: roleInstructions
                                    ? `${roleInstructions}\n\n${message}`
                                    : message
                            }
                        ]
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || 'API request failed');
                }
                
                const data = await response.json();
                return res.json({
                    response: data.content[0].text,
                    provider: 'claude'
                });
            } catch (error) {
                console.error('Claude API error:', error);
                return res.status(500).json({
                    error: { message: 'AI request failed', details: error.message }
                });
            }
            
        } else if (provider === 'custom' && endpoint) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: message,
                        instructions: roleInstructions
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Custom API request failed');
                }
                
                const data = await response.json();
                return res.json({
                    response: data.response || data.message || data.text,
                    provider: 'custom'
                });
            } catch (error) {
                console.error('Custom API error:', error);
                return res.status(500).json({
                    error: { message: 'AI request failed', details: error.message }
                });
            }
        } else {
            return res.status(400).json({
                error: { message: 'Invalid or missing AI provider' }
            });
        }
    } catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({ error: { message: 'AI request failed' } });
    }
});

module.exports = router;
