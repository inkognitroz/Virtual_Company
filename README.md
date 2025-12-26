# Virtual Company

Virtual Company is an AI-based Virtual Company that can be set up in minutes. The platform features the possibility to define all roles necessary to reach company goals and mission. All functions are designed to be fully automated and AI-based.

**NEW**: Now with optional backend support for secure data persistence and multi-device access! 🚀

## 🚀 Live Demo

Visit the live website: [https://inkognitroz.github.io/Virtual_Company/](https://inkognitroz.github.io/Virtual_Company/)

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get running in 5 minutes
- **[Backend Setup](BACKEND_SETUP.md)** - Set up the Node.js/Express backend
- **[API Documentation](API_DOCUMENTATION.md)** - Complete REST API reference
- **[Migration Guide](MIGRATION_GUIDE.md)** - Switch from client-only to backend mode
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production (Heroku, AWS, Docker, etc.)

## ✨ Features

### 🔐 Secure Authentication
- **Client Mode**: Simple browser-based login/registration
- **Backend Mode**: JWT authentication with password hashing
- Email or username-based authentication
- Secure session management

### 👥 Role Management
- Create custom roles for your virtual company
- Assign avatars and descriptions to each role
- Define AI instructions for each role to guide LLM behavior
- **Backend Mode**: Persistent roles across devices

### 🤖 AI Integration
- Built-in support for AI model integration
- Role-based AI prompts with custom instructions
- Easy connection to OpenAI GPT, Claude, or custom AI endpoints
- Pre-configured prompt templates for common scenarios

### 💬 Group Chat
- Common group chat for team collaboration
- Send messages as yourself or any created role
- Persistent chat history
- Role-specific AI-powered responses
- **Backend Mode**: Messages stored in database

### 📊 Data Management
- **Export/Import**: Backup and restore your entire workspace
- Export all data or specific components (roles, chats)
- Import data to merge or migrate between browsers
- One-click data clearing with confirmation
- **Backend Mode**: Automatic persistence to MongoDB

### 📹 Video Call Integration
- **Google Meet**: Create or join meetings directly
- **Microsoft Teams**: Seamless Teams integration
- **WhatsApp**: Group chat connectivity

### 🎨 Modern UI
- Clean, professional dark theme interface
- Responsive design for desktop and mobile
- Intuitive navigation and user experience

### 🔒 Backend Features (Optional)
- **Secure Authentication**: Bcrypt password hashing, JWT tokens
- **Data Persistence**: MongoDB database storage
- **Multi-Device**: Access from any browser/device
- **API-First**: RESTful API for all operations
- **Production Ready**: Rate limiting, input validation, security headers
- **Docker Support**: Easy deployment with docker-compose

## 🛠️ Setup Instructions

### Quick Start (Client-Only Mode)

The application works out-of-the-box without any backend setup:

1. **Clone the repository**
   ```bash
   git clone https://github.com/inkognitroz/Virtual_Company.git
   cd Virtual_Company
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     npm start
     # Then visit http://localhost:8000
     ```

All data is stored in your browser's localStorage. No server required!

### Full Stack Mode (With Backend)

For persistent data storage and enhanced security:

1. **Quick setup**
   ```bash
   git clone https://github.com/inkognitroz/Virtual_Company.git
   cd Virtual_Company
   npm run setup  # Installs all dependencies
   ```

2. **Configure backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB connection and secrets
   ```

3. **Start everything**
   ```bash
   npm run dev  # Runs both frontend and backend
   ```

4. **Access the application**
   - Frontend: http://localhost:8000
   - Backend API: http://localhost:5000/api

📖 **Detailed backend setup guide**: See [BACKEND_SETUP.md](BACKEND_SETUP.md)

### For GitHub Pages

1. **Fork or Clone this repository**
   ```bash
   git clone https://github.com/inkognitroz/Virtual_Company.git
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select the branch (usually `main` or `master`)
   - Set the folder to `/` (root)
   - Click "Save"

3. **Access Your Site**
   - Your site will be available at: `https://[your-username].github.io/Virtual_Company/`


## 📖 How to Use

### Quick Start Example (5 Minutes)

Get started with Virtual Company in just a few minutes:

1. **Initial Setup**
   ```
   - Open https://inkognitroz.github.io/Virtual_Company/
   - Click "Register here"
   - Fill in: Email, Username, Password, Full Name
   - Click "Register" (auto-logged in)
   ```

2. **Create Your First Role**
   ```
   - Go to "Roles & Team" section
   - Click "+ Add Role"
   - Example:
     * Role Name: "Product Manager"
     * Avatar: 👨‍💼 Manager
     * Description: "Leads product strategy and roadmap"
     * AI Instructions: "You are a strategic Product Manager. 
       Focus on user needs, market fit, and product vision. 
       Provide actionable insights for product decisions."
   - Click "Add Role"
   ```

3. **Start a Conversation**
   ```
   - Navigate to "Group Chat"
   - Select "Send as: Yourself"
   - Type: "What should our Q1 product priorities be?"
   - Send message
   - AI will respond as the Product Manager role
   ```

4. **Export Your Work**
   ```
   - Go to "Settings"
   - Click "Export All Data"
   - Save the JSON file as backup
   ```

### Detailed Usage Guide

### Getting Started

1. **Register an Account**
   - Open the website
   - Click "Register here" on the login page
   - Fill in your details and create an account

2. **Create Roles**
   - Navigate to "Roles & Team" section
   - Click "+ Add Role" button
   - Fill in:
     - Role name (e.g., "Marketing Manager")
     - Select an avatar
     - Add description
     - Write AI instructions for how this role should behave

3. **Start Chatting**
   - Go to "Group Chat" section
   - Select which role to send messages as
   - Type your message or prompt
   - Use AI instructions to guide responses

4. **Video Calls**
   - Navigate to "Video Calls" section
   - Choose your platform (Google Meet, Teams, or WhatsApp)
   - Join existing meetings or create new ones

5. **AI Integration**
   - Visit "AI Integration" section
   - Connect your preferred AI model (OpenAI, Claude, etc.)
   - Use the prompt templates as guidance
   - Leverage role-specific AI instructions for contextual responses

6. **Data Management**
   - Go to "Settings" section
   - Export your data regularly for backup
   - Import data to restore or migrate
   - Clear data when needed

## 🔧 Technical Details

### Architecture Overview

The Virtual Company platform supports both client-side and full-stack architectures:

#### Client-Only Mode (Default)
```
┌─────────────────────────────────────────────────┐
│          User Interface (HTML/CSS)              │
├─────────────────────────────────────────────────┤
│     Authentication Layer (auth.js)              │
│     - Login/Registration                        │
│     - Session Management                        │
├─────────────────────────────────────────────────┤
│     Core Application (dashboard.js)             │
│     ├── Role Management                         │
│     │   - Create/Delete Roles                   │
│     │   - AI Instructions                       │
│     ├── Chat System                             │
│     │   - Message Handling                      │
│     │   - AI Response Generation                │
│     ├── AI Integration                          │
│     │   - OpenAI/Claude/Custom APIs             │
│     │   - Voice Recognition/Synthesis           │
│     └── Data Management                         │
│         - Export/Import                         │
│         - LocalStorage Persistence              │
├─────────────────────────────────────────────────┤
│     Data Storage (LocalStorage)                 │
│     - Users, Roles, Messages, Config            │
└─────────────────────────────────────────────────┘
```

#### Full-Stack Mode (Backend Enabled)
```
┌─────────────────────────────────────────────────┐
│          User Interface (HTML/CSS)              │
├─────────────────────────────────────────────────┤
│         API Client Layer (api.js)               │
│         - HTTP Request Handling                 │
│         - JWT Token Management                  │
├─────────────────────────────────────────────────┤
│     Frontend Application (auth.js, dashboard.js)│
│     - User Interactions                         │
│     - UI Updates                                │
│     - API Integration                           │
└─────────────────────────────────────────────────┘
                        ↕ REST API
┌─────────────────────────────────────────────────┐
│        Backend Server (Express.js)              │
├─────────────────────────────────────────────────┤
│     Authentication & Authorization              │
│     - JWT Token Generation/Validation           │
│     - Password Hashing (bcrypt)                 │
│     - Session Management                        │
├─────────────────────────────────────────────────┤
│     Business Logic Controllers                  │
│     ├── Auth Controller                         │
│     ├── Role Controller                         │
│     └── Message Controller                      │
├─────────────────────────────────────────────────┤
│     Security Middleware                         │
│     - Rate Limiting                             │
│     - Input Validation                          │
│     - CORS Protection                           │
│     - Helmet Security Headers                   │
├─────────────────────────────────────────────────┤
│     Database Layer (MongoDB/Mongoose)           │
│     - User Model                                │
│     - Role Model                                │
│     - Message Model                             │
└─────────────────────────────────────────────────┘
```


**Data Flow (Client-Only Mode):**
1. User creates roles with specific AI instructions
2. Messages are sent through the chat interface
3. AI models (if configured) process messages using role-specific instructions
4. Responses are generated and displayed in real-time
5. All data persists in browser LocalStorage

**Data Flow (Backend Mode):**
1. User authenticates via backend API (JWT token issued)
2. All CRUD operations go through REST API endpoints
3. Data is validated and sanitized on the server
4. MongoDB stores all persistent data
5. Real-time updates via polling or WebSocket (future)

**Role Orchestration:**
- Each role contains AI instructions that guide LLM behavior
- Roles can be selected dynamically for message sending
- AI responses are context-aware based on role instructions
- Voice input/output supported for accessibility

### Technologies Used

**Frontend:**
- Pure HTML5, CSS3, and JavaScript (no frameworks required)
- Responsive CSS Grid and Flexbox layouts
- Modern ES6+ JavaScript features
- Fetch API for backend communication
- Web Speech API for voice capabilities

**Backend:**
- Node.js & Express.js for server
- MongoDB & Mongoose for database
- JWT for authentication
- Bcrypt for password hashing
- Express-validator for input validation
- Helmet.js for security headers
- Rate limiting for API protection

**DevOps:**
- GitHub Actions for CI/CD
- Environment-based configuration
- Modular architecture for scalability

### Data Storage

**Client-Only Mode (Default):**
All data is stored locally in your browser using LocalStorage:
- User accounts
- Created roles
- Chat messages
- Session information
- AI configuration

**Backend Mode:**
Data is stored in MongoDB with the following collections:
- `users` - User accounts with hashed passwords
- `roles` - User-created roles with AI instructions
- `messages` - Chat messages with timestamps

**Important Notes**:
- **Client-only**: Data is stored locally in your browser. Clearing browser data will reset the application.
- **Backend**: Data persists across devices and browsers. Requires MongoDB setup.

## 🔒 Security & Privacy

### Client-Only Mode

**Data Storage Security:**
- **Local Storage**: All user data, roles, and messages are stored in browser LocalStorage
- **No External Transmission**: Data never leaves your browser unless you explicitly connect an AI API
- **Password Storage**: Passwords are stored in plain text in LocalStorage - **NOT recommended for production**
- **Session Management**: Simple session tokens stored locally

### Backend Mode (When Enabled)

**Security Features:**
- ✅ **Password Hashing**: Bcrypt with salt for secure password storage
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Input Validation**: All API inputs validated and sanitized
- ✅ **Rate Limiting**: Protection against brute force attacks
- ✅ **Security Headers**: Helmet.js for HTTP header security
- ✅ **CORS Protection**: Controlled cross-origin resource sharing
- ✅ **Database Security**: MongoDB with user permissions

**Data Protection:**
- Passwords never stored in plain text
- JWT tokens with configurable expiration
- User data isolated by account
- HTTPS recommended for production
- Environment variable configuration

### AI Model Integration
- **API Keys**: If you connect AI models (OpenAI, Claude), API keys are stored in LocalStorage
- **Data Sharing**: When AI is enabled, your messages are sent to the configured AI provider
- **Privacy**: Review AI provider privacy policies before connecting

### Production Deployment Checklist

**Backend Configuration:**
1. ✅ Change `JWT_SECRET` to a strong random value
2. ✅ Use MongoDB Atlas or secure MongoDB instance
3. ✅ Set `NODE_ENV=production`
4. ✅ Update `CORS_ORIGIN` to your domain
5. ✅ Enable HTTPS (use reverse proxy like nginx)
6. ✅ Configure rate limiting appropriately
7. ✅ Set up regular database backups
8. ✅ Monitor logs and errors

**General Security:**
1. **Use HTTPS**: Always serve over secure connections
2. **API Key Security**: Store API keys in environment variables, not client-side
3. **Access Control**: Implement role-based permissions for enterprise use
4. **Regular Updates**: Keep dependencies updated

### Privacy Features
- **Export Your Data**: Download all your data anytime using Settings → Export
- **Clear Data**: Remove all stored data with one click
- **No Tracking**: No analytics or tracking scripts included
- **Offline Capable**: Works completely offline (without AI integration)
- **Data Ownership**: You control your data completely

## 🎯 Use Cases

- **Startup Teams**: Quickly set up virtual team structures
- **AI Development**: Test different AI personas and role behaviors
- **Project Management**: Organize virtual teams with defined roles
- **Learning & Training**: Experiment with AI-powered collaboration
- **Remote Work**: Coordinate distributed teams with integrated communication

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Future Enhancements

- Real-time AI model integration ✅ (Implemented)
- Persistent cloud storage option
- Advanced role permissions
- Team analytics and insights
- Export/import functionality for roles and chats ✅ (Implemented)
- Real-time collaboration features
- Multi-language support
- Mobile app version
- Plugin system for extensibility

## 🗺️ Roadmap

### Phase 1: Foundation (Current) ✅
- [x] Core role management system
- [x] Group chat functionality
- [x] AI integration (OpenAI, Claude, Custom APIs)
- [x] Video call integrations (Meet, Teams, WhatsApp)
- [x] Export/import data functionality
- [x] Voice input/output support
- [x] CI/CD pipeline setup

### Phase 2: Enhanced Collaboration (Q1 2026)
- [ ] Real-time multi-user collaboration
- [ ] Role-based permissions and access control
- [ ] Advanced chat features (threads, reactions, mentions)
- [ ] File sharing and document collaboration
- [ ] Integration with project management tools (Jira, Trello, Asana)
- [ ] Enhanced AI model support (Google Gemini, local LLMs)

### Phase 3: Analytics & Intelligence (Q2 2026)
- [ ] Team productivity analytics
- [ ] AI-powered insights and recommendations
- [ ] Conversation sentiment analysis
- [ ] Role performance metrics
- [ ] Automated meeting summaries
- [ ] Smart task extraction from conversations

### Phase 4: Enterprise Features (Q3 2026)
- [ ] Cloud storage backend option
- [ ] Enterprise SSO (SAML, OAuth)
- [ ] Audit logs and compliance features
- [ ] Custom branding and white-labeling
- [ ] API for third-party integrations
- [ ] Advanced security features (encryption, 2FA)

### Phase 5: Scale & Extend (Q4 2026)
- [ ] Mobile applications (iOS, Android)
- [ ] Desktop applications (Electron)
- [ ] Plugin marketplace
- [ ] Multi-language support (i18n)
- [ ] Workflow automation builder
- [ ] Integration marketplace

## 💡 Tips

- **AI Instructions**: Be specific and clear when writing AI instructions for roles
- **Role Creation**: Create diverse roles to simulate a complete organization
- **Prompts**: Use structured prompts for better AI responses
- **Integration**: Bookmark your frequently used video call links for quick access
- **Data Backup**: Regularly export your data to prevent loss
- **Voice Input**: Use voice input for faster message composition on mobile

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Run linter: `npm run lint`
4. Start local server: `npm start`
5. Test your changes in the browser
6. Submit a pull request

---

Built with ❤️ for the future of virtual collaboration

## 📋 Next Sprint Suggestions

Based on current implementation and user needs, here are recommended improvements for the next sprint:

### High Priority
1. **Automated Testing Suite**
   - Add unit tests for core functions (role management, data export/import, chat functionality)
   - Implement integration tests for AI API calls
   - Set up automated testing in CI/CD pipeline
   - Target: 70% code coverage

2. **Enhanced Error Handling**
   - Add comprehensive error handling for AI API failures
   - Implement retry logic with exponential backoff
   - Show user-friendly error messages
   - Add error logging and debugging tools

3. **Performance Optimization**
   - Implement pagination for chat messages (currently loads all messages)
   - Add lazy loading for roles when count exceeds 50
   - Optimize localStorage usage (compress data, cleanup old sessions)
   - Add loading indicators for async operations

### Medium Priority
4. **Search and Filter Capabilities**
   - Add search functionality for chat messages
   - Filter roles by category or tags
   - Search within role descriptions and AI instructions
   - Export filtered data subsets

5. **Notification System**
   - Browser notifications for new AI responses
   - Notification badges for unread messages
   - Configurable notification preferences
   - Sound alerts option

6. **Accessibility Improvements**
   - Full keyboard navigation support
   - Screen reader compatibility (ARIA labels)
   - High contrast mode option
   - Font size customization

### Low Priority
7. **UI/UX Enhancements**
   - Dark/light theme toggle
   - Customizable color schemes
   - Markdown support in chat messages
   - Code syntax highlighting for technical discussions

8. **Extended Analytics**
   - Message count statistics per role
   - Chat activity timeline visualization
   - Role usage analytics
   - Export analytics reports

9. **Additional Integrations**
   - Slack webhook integration
   - Discord bot integration
   - Email notifications
   - Calendar integration for scheduling

### Technical Debt
- Refactor dashboard.js into modular components
- Add JSDoc documentation for all functions
- Implement proper state management
- Add TypeScript definitions (optional migration path)
- Set up automated dependency updates (Dependabot)
