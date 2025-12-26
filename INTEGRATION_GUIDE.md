# Frontend-Backend Integration Guide

This guide explains how to integrate the existing Virtual Company frontend with the new FastAPI backend.

## Overview

The new architecture adds a FastAPI backend that provides:
- User authentication with JWT tokens
- Persistent storage for users, roles, and messages
- LLM API integration (OpenAI, Anthropic, OpenRouter)
- WebSocket support for real-time chat
- WebRTC signaling for voice/video

## Architecture Diagram

```
┌──────────────────┐     HTTP/WebSockets       ┌──────────────────┐
│     Client       │ ─────────────────────────▶ │    FastAPI       │
│ (VirtualCompany  │ ◀────────────────────────── │    Backend       │
│  UI / Next.js)   │       event streaming      │ (REST, WS, DB)   │
└──────────────────┘                            └──────────────────┘
         │                                                │
         │ WebRTC (voice/video)                           │
         │                                                │
         ▼                                                ▼
  ┌─────────────┐                                 ┌───────────────┐
  │  WebRTC     │                                 │ LLM Providers │
  │  PeerConn   │◀──Ephemeral tokens─────────────▶│  (OpenAI,     │
  │  (browser)  │                                 │  Anthropic,   │
  └─────────────┘                                 │  OpenRouter)  │
                                                  └───────────────┘
```

## Integration Steps

### 1. Update Authentication (auth.js)

Replace localStorage-based auth with backend API calls:

```javascript
// Register new user
async function register(email, username, name, password) {
    const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, name, password })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail);
    }
    
    return await response.json();
}

// Login
async function login(username, password) {
    const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
        throw new Error('Invalid credentials');
    }
    
    const data = await response.json();
    // Store JWT token
    localStorage.setItem('token', data.access_token);
    return data;
}

// Get current user
async function getCurrentUser() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
        localStorage.removeItem('token');
        throw new Error('Not authenticated');
    }
    
    return await response.json();
}
```

### 2. Update Role Management (dashboard.js)

Replace localStorage with API calls:

```javascript
// Create role
async function createRole(name, avatar, description, aiInstructions) {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/roles/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            avatar,
            description,
            ai_instructions: aiInstructions
        })
    });
    
    return await response.json();
}

// Get all roles
async function getRoles() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/roles/', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    return await response.json();
}

// Delete role
async function deleteRole(roleId) {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8000/api/roles/${roleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
}
```

### 3. Add WebSocket Chat (dashboard.js)

Replace static chat with WebSocket connection:

```javascript
let chatSocket = null;
let currentRoomId = 1; // Default room

// Connect to chat WebSocket
function connectChatWebSocket() {
    const token = localStorage.getItem('token');
    chatSocket = new WebSocket(
        `ws://localhost:8000/ws/chat/${currentRoomId}?token=${token}`
    );
    
    chatSocket.onopen = () => {
        console.log('Connected to chat');
    };
    
    chatSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
            displayMessage(data);
        } else if (data.type === 'join') {
            showNotification(`${data.user} joined the chat`);
        } else if (data.type === 'leave') {
            showNotification(`${data.user} left the chat`);
        }
    };
    
    chatSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    chatSocket.onclose = () => {
        console.log('Disconnected from chat');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectChatWebSocket, 5000);
    };
}

// Send message
function sendMessage(content, roleId = null, model = 'gpt-3.5-turbo') {
    if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket not connected');
        return;
    }
    
    const message = {
        content,
        role_id: roleId,
        message_type: 'text',
        model: model
    };
    
    chatSocket.send(JSON.stringify(message));
}

// Display message in UI
function displayMessage(data) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = data.message_type === 'ai_response' ? 
        'message ai-message' : 'message user-message';
    
    messageEl.innerHTML = `
        <div class="message-header">
            <strong>${data.user}</strong>
            <span class="timestamp">${new Date(data.timestamp).toLocaleTimeString()}</span>
        </div>
        <div class="message-content">${escapeHtml(data.content)}</div>
    `;
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    connectChatWebSocket();
});
```

### 4. Add WebRTC Voice/Video

Create WebRTC connection for voice chat:

```javascript
let peerConnection = null;
let signalingSocket = null;
const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Connect to signaling WebSocket
function connectSignaling() {
    const token = localStorage.getItem('token');
    signalingSocket = new WebSocket(
        `ws://localhost:8000/ws/signaling/${currentRoomId}?token=${token}`
    );
    
    signalingSocket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'offer') {
            await handleOffer(message.data);
        } else if (message.type === 'answer') {
            await handleAnswer(message.data);
        } else if (message.type === 'ice_candidate') {
            await handleIceCandidate(message.data);
        }
    };
}

// Start voice call
async function startVoiceCall() {
    // Get microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Create peer connection
    peerConnection = new RTCPeerConnection(configuration);
    
    // Add local stream
    stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
    });
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            signalingSocket.send(JSON.stringify({
                type: 'ice_candidate',
                data: event.candidate
            }));
        }
    };
    
    // Handle remote stream
    peerConnection.ontrack = (event) => {
        const audioEl = document.getElementById('remoteAudio');
        audioEl.srcObject = event.streams[0];
        audioEl.play();
    };
    
    // Create and send offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    signalingSocket.send(JSON.stringify({
        type: 'offer',
        data: offer
    }));
}

async function handleOffer(offer) {
    peerConnection = new RTCPeerConnection(configuration);
    
    // Set up similar to startVoiceCall
    // ... (add tracks, handle candidates, etc.)
    
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    signalingSocket.send(JSON.stringify({
        type: 'answer',
        data: answer
    }));
}

async function handleAnswer(answer) {
    await peerConnection.setRemoteDescription(answer);
}

async function handleIceCandidate(candidate) {
    await peerConnection.addIceCandidate(candidate);
}
```

### 5. Update Configuration

Add configuration for backend URL:

```javascript
// config.js
const CONFIG = {
    API_BASE_URL: process.env.API_URL || 'http://localhost:8000',
    WS_BASE_URL: process.env.WS_URL || 'ws://localhost:8000',
    DEFAULT_MODEL: 'gpt-3.5-turbo'
};
```

### 6. Load Chat History

Fetch existing messages when joining a room:

```javascript
async function loadChatHistory(roomId) {
    const token = localStorage.getItem('token');
    const response = await fetch(
        `http://localhost:8000/api/rooms/${roomId}/messages?limit=50`,
        {
            headers: { 'Authorization': `Bearer ${token}` }
        }
    );
    
    const messages = await response.json();
    messages.forEach(msg => displayMessage(msg));
}
```

### 7. Get Available Models

Allow users to select AI models:

```javascript
async function loadAvailableModels() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/llm/models', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const models = await response.json();
    const select = document.getElementById('modelSelect');
    
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = `${model.name} (${model.provider})`;
        select.appendChild(option);
    });
}
```

## Environment Setup

### Development

1. Start backend:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. Update frontend to point to `http://localhost:8000`

3. Open frontend in browser

### Production

1. Deploy backend to hosting service (Railway, Render, Fly.io)

2. Update frontend environment variables:
```javascript
const API_BASE_URL = 'https://your-backend.railway.app';
const WS_BASE_URL = 'wss://your-backend.railway.app';
```

3. Configure CORS in backend to allow frontend domain

## Migration Strategy

### Gradual Migration

1. **Phase 1**: Keep localStorage for backwards compatibility
   - Add backend integration alongside existing code
   - Use feature flags to enable backend features

2. **Phase 2**: Migrate users to backend
   - Provide import/export to transfer localStorage data to backend
   - Display migration prompt to users

3. **Phase 3**: Remove localStorage code
   - Once all users migrated, remove old code
   - Rely entirely on backend

### Data Migration Tool

```javascript
async function migrateToBackend() {
    const token = localStorage.getItem('token');
    
    // Get localStorage data
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    
    // Upload to backend
    for (const role of roles) {
        await fetch('http://localhost:8000/api/roles/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(role)
        });
    }
    
    console.log('Migration complete!');
}
```

## Testing

### Manual Testing

1. Register new user via frontend
2. Create roles via frontend
3. Send messages in chat
4. Verify messages persist across page refresh
5. Test AI responses with role instructions
6. Test voice call functionality

### API Testing

Use the interactive docs at `http://localhost:8000/docs` to:
- Test endpoints directly
- View request/response schemas
- Generate code examples

## Troubleshooting

### CORS Issues

If you see CORS errors, update `backend/core/config.py`:
```python
allowed_origins: List[str] = [
    "http://localhost:8000",
    "http://localhost:3000",  # Add your frontend URL
    "https://your-frontend.github.io"
]
```

### WebSocket Connection Fails

- Check token is valid and not expired
- Verify WebSocket URL is correct (ws:// for http, wss:// for https)
- Check browser console for error messages

### Database Issues

- Ensure database is accessible
- Check DATABASE_URL in .env
- Run migrations if needed: `alembic upgrade head`

## Next Steps

1. Implement error handling and retry logic
2. Add loading states for async operations
3. Implement offline support with service workers
4. Add rate limiting awareness in frontend
5. Implement reconnection logic for WebSockets
6. Add end-to-end encryption for sensitive messages
7. Implement file upload for avatars
8. Add user profile settings page
