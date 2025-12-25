# Virtual Company - Architecture Overview

## System Architecture

Virtual Company is a client-side web application built with vanilla JavaScript, HTML5, and CSS3. The application uses browser LocalStorage for data persistence and provides a framework for AI-driven virtual team collaboration.

## Core Components

### 1. Authentication System (`auth.js`)
- **Purpose**: Manages user registration and login
- **Data Storage**: User credentials stored in `virtualCompanyUsers` localStorage key
- **Security Note**: Currently stores passwords in plain text (for demo purposes only - should use proper hashing in production)

### 2. Dashboard System (`dashboard.js`)
- **Purpose**: Main application logic and UI management
- **Key Features**:
  - Navigation between sections (Roles, Chat, Video, AI Integration)
  - Role management (CRUD operations)
  - Group chat functionality with AI responses
  - Video conferencing integrations
  - AI model configuration

### 3. User Interface (`dashboard.html`, `index.html`, `styles.css`)
- **Login/Registration**: Clean authentication interface
- **Dashboard**: Multi-section interface with sidebar navigation
- **Responsive Design**: Mobile and desktop optimized

## Data Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Browser (Client-Side Application)      │
│  ┌───────────────────────────────────┐  │
│  │  UI Layer (HTML/CSS)              │  │
│  └────────────┬──────────────────────┘  │
│               ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Application Logic (JavaScript)   │  │
│  │  - Authentication                 │  │
│  │  - Role Management                │  │
│  │  - Chat System                    │  │
│  │  - AI Integration                 │  │
│  │  - Video Call Links               │  │
│  └────────────┬──────────────────────┘  │
│               ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  LocalStorage (Data Persistence)  │  │
│  │  - virtualCompanyUsers            │  │
│  │  - virtualCompanyUser (session)   │  │
│  │  - virtualCompanyRoles            │  │
│  │  - virtualCompanyChatMessages     │  │
│  │  - virtualCompanyAIConfig         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
       │                      │
       ▼                      ▼
┌─────────────┐      ┌────────────────┐
│ External AI │      │ Video Platforms│
│ APIs        │      │ (Meet, Teams,  │
│ (Optional)  │      │  WhatsApp)     │
└─────────────┘      └────────────────┘
```

## Data Models

### User Object
```javascript
{
  email: String,
  username: String,
  password: String,  // Plain text (demo only)
  name: String
}
```

### Role Object
```javascript
{
  id: String,        // Timestamp-based unique ID
  name: String,
  avatar: String,    // Emoji character
  description: String,
  aiInstructions: String  // Instructions for AI behavior
}
```

### Chat Message Object
```javascript
{
  sender: String,         // 'user', 'role', or 'ai'
  senderName: String,
  avatar: String,
  content: String,
  time: String,          // Formatted time string
  roleInstructions: String (optional),
  isAI: Boolean (optional)
}
```

### AI Configuration Object
```javascript
{
  provider: String,      // 'openai', 'claude', or 'custom'
  apiKey: String,        // API key for provider
  endpoint: String,      // For custom AI endpoints
  voiceEnabled: Boolean  // Text-to-speech toggle
}
```

## Role Orchestration

### Role Creation Flow
1. User clicks "Add Role" button
2. Modal form opens with fields:
   - Role name
   - Avatar selection
   - Description
   - AI instructions
3. Form submission creates role object
4. Role stored in localStorage
5. UI updates to display new role
6. Role added to chat selector dropdown

### AI Response Generation
1. User sends message in group chat
2. System checks for configured AI:
   - If API configured: Call external AI service
   - If no API: Generate simulated response
3. Random AI role selected (or context-based)
4. Role's AI instructions used as system prompt
5. Response generated and displayed
6. If voice enabled: Text-to-speech activated

### Voice Interaction Flow
1. **Voice Input (Speech-to-Text)**:
   - User clicks voice button
   - Browser's Speech Recognition API activated
   - Transcript populated in chat input
   
2. **Voice Output (Text-to-Speech)**:
   - AI response received
   - If voice toggle enabled
   - Browser's Speech Synthesis API speaks response

## Integration Points

### AI Model Integration
- **Supported Providers**:
  - OpenAI GPT (via official API)
  - Anthropic Claude (via official API)
  - Custom endpoints (flexible integration)
  
- **Authentication**: API keys stored in localStorage
- **Request Flow**: System prompt (role instructions) + user message

### Video Conferencing
- **Google Meet**: Link generation and joining
- **Microsoft Teams**: Direct link integration
- **WhatsApp**: Group chat linking

## Security Considerations

### Current Implementation
- Client-side only (no server)
- LocalStorage for all data
- No password hashing (demo mode)
- API keys stored in localStorage

### Production Recommendations
1. Implement server-side authentication
2. Use bcrypt/argon2 for password hashing
3. Secure API key storage (environment variables, secrets manager)
4. Implement HTTPS
5. Add CSRF protection
6. Sanitize user inputs
7. Implement rate limiting
8. Add session management with tokens

## Scalability Considerations

### Current Limitations
- LocalStorage size limit (~5-10MB)
- No multi-device sync
- No real-time collaboration
- Client-side only

### Future Enhancements
1. Backend API for data persistence
2. Database integration (PostgreSQL, MongoDB)
3. WebSocket for real-time updates
4. User authentication with JWT
5. Cloud storage for chat history
6. Role-based access control (RBAC)
7. Team collaboration features

## Browser Compatibility

### Required Features
- LocalStorage API
- ES6+ JavaScript
- CSS Grid and Flexbox
- Speech Recognition API (optional, for voice input)
- Speech Synthesis API (optional, for voice output)

### Recommended Browsers
- Chrome/Edge (full support including voice features)
- Firefox (partial voice support)
- Safari (partial voice support)

## Development Guidelines

### Code Organization
- `auth.js`: Authentication logic only
- `dashboard.js`: All dashboard functionality
- `styles.css`: All styling (no inline styles)
- HTML files: Semantic structure, no inline scripts

### Naming Conventions
- LocalStorage keys: `virtualCompany[Feature]` pattern
- Function names: camelCase, descriptive
- CSS classes: kebab-case, BEM-like structure
- Element IDs: camelCase

### Best Practices
1. Always validate user input
2. Use meaningful variable names
3. Keep functions focused and small
4. Add error handling for async operations
5. Maintain separation of concerns
6. Comment complex logic
7. Use consistent formatting

## Monitoring and Debugging

### Available Tools
- Browser Developer Console
- LocalStorage Inspector
- Network Tab (for AI API calls)
- Application Tab (for storage inspection)

### Common Issues
1. **Login fails**: Check localStorage for user data
2. **AI not responding**: Verify API key configuration
3. **Voice not working**: Check browser compatibility and permissions
4. **Data loss**: LocalStorage cleared or browser data deleted

## Future Architecture Considerations

### Microservices Approach
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Auth        │  │  Role        │  │  Chat        │
│  Service     │  │  Service     │  │  Service     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       └─────────────────┴──────────────────┘
                         │
                ┌────────▼─────────┐
                │  API Gateway     │
                └────────┬─────────┘
                         │
                ┌────────▼─────────┐
                │  Frontend (SPA)  │
                └──────────────────┘
```

### Event-Driven Architecture
- Message queues for chat
- Event bus for role updates
- Webhooks for AI integrations
- Real-time sync with WebSockets
