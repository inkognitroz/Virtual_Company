# Virtual Company

Virtual Company is an AI-based Virtual Company that can be set up in minutes. The platform features the possibility to define all roles necessary to reach company goals and mission. All functions are designed to be fully automated and AI-based.

## 🚀 Live Demo

Visit the live website: [https://inkognitroz.github.io/Virtual_Company/](https://inkognitroz.github.io/Virtual_Company/)

## ✨ Features

### 🔐 Easy Authentication
- Simple login/registration system
- Email or username-based authentication
- Secure session management

### 👥 Role Management
- Create custom roles for your virtual company
- Assign avatars and descriptions to each role
- Define AI instructions for each role to guide LLM behavior

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

### 📊 Data Management
- **Export/Import**: Backup and restore your entire workspace
- Export all data or specific components (roles, chats)
- Import data to merge or migrate between browsers
- One-click data clearing with confirmation

### 📹 Video Call Integration
- **Google Meet**: Create or join meetings directly
- **Microsoft Teams**: Seamless Teams integration
- **WhatsApp**: Group chat connectivity

### 🎨 Modern UI
- Clean, professional dark theme interface
- Responsive design for desktop and mobile
- Intuitive navigation and user experience

## 🛠️ Setup Instructions

### Option 1: Client-Only Mode (GitHub Pages)

The application can run entirely in the browser using LocalStorage (no backend needed).

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

### Option 2: Full Stack Mode (With Backend)

For a production-ready deployment with persistent data storage and multi-user support.

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set your configuration (especially JWT_SECRET)
   ```

4. **Start the backend server**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   The backend API will be available at `http://localhost:3000`

#### Frontend Setup

1. **Update API configuration**
   - Edit `api-client.js` and set `BASE_URL` to your backend URL
   - For local development, it defaults to `http://localhost:3000`
   - For production, set it to your deployed backend URL

2. **Serve the frontend**
   ```bash
   # From the root directory
   python -m http.server 8000
   # Or use any web server
   ```

3. **Access the application**
   - Open `http://localhost:8000` in your browser
   - The frontend will now use the backend API for data storage

For detailed backend documentation, see [backend/README.md](backend/README.md)

### Local Development (Frontend Only)

1. **Clone the repository**
   ```bash
   git clone https://github.com/inkognitroz/Virtual_Company.git
   cd Virtual_Company
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

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

The Virtual Company platform supports two deployment modes:

#### Client-Side Mode (Default)
A fully client-side application using LocalStorage for data persistence:

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

#### Full Stack Mode (With Backend)
A production-ready architecture with backend API and database:

```
┌──────────────────────────────────────────────────────────┐
│                 Frontend (Browser)                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │  User Interface (HTML/CSS/JavaScript)              │  │
│  │  - auth.js (Authentication UI)                     │  │
│  │  - dashboard.js (Main Application)                 │  │
│  │  - api-client.js (API Communication)               │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST API
┌──────────────────────────────────────────────────────────┐
│              Backend Server (Node.js/Express)            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  API Routes                                        │  │
│  │  - /api/auth (Register, Login, Logout)            │  │
│  │  - /api/roles (CRUD Operations)                   │  │
│  │  - /api/messages (Send, Get, Clear)               │  │
│  │  - /api/ai-config (Get, Update)                   │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Middleware                                        │  │
│  │  - JWT Authentication                              │  │
│  │  - CORS Configuration                              │  │
│  │  - Error Handling                                  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                          ↕ SQL Queries
┌──────────────────────────────────────────────────────────┐
│                SQLite Database                           │
│  - users (Authentication & Profiles)                     │
│  - roles (Virtual Company Roles)                         │
│  - messages (Chat History)                               │
│  - ai_config (AI Settings per User)                      │
└──────────────────────────────────────────────────────────┘
```
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

**Data Flow (Client-Side Mode):**
1. User creates roles with specific AI instructions
2. Messages are sent through the chat interface
3. AI models (if configured) process messages using role-specific instructions
4. Responses are generated and displayed in real-time
5. All data persists in browser LocalStorage

**Data Flow (Full Stack Mode):**
1. User authentication via JWT tokens
2. Frontend sends API requests to backend server
3. Backend validates tokens and processes requests
4. Data is stored in SQLite database
5. Responses are returned to frontend
6. UI updates with real-time data
7. AI integration works same as client-side mode

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
- Web Speech API for voice capabilities
- Fetch API for backend communication

**Backend (Optional):**
- Node.js with Express.js framework
- SQLite database (better-sqlite3)
- JWT for authentication
- bcrypt for password hashing
- CORS middleware for cross-origin requests

**DevOps:**
- GitHub Actions for CI/CD
- npm for package management

### Data Storage

The application supports two storage modes:

**Client-Side Mode (LocalStorage):**
All data is stored locally in your browser:
- User accounts
- Created roles
- Chat messages
- Session information
- AI configuration

**Full Stack Mode (Database):**
Data is stored in SQLite database on the server:
- User accounts with hashed passwords
- Role definitions per user
- Chat message history
- AI configuration per user
- Persistent across devices and sessions

**Important Notes**:
- **Client-Side Mode**: Data is stored locally in your browser. Clearing browser data will reset the application.
- **Full Stack Mode**: Data is stored in the backend database with proper security measures.
- **AI APIs**: When AI integration is enabled, messages are sent to the configured AI provider.

## 🔒 Security & Privacy

### Client-Side Mode Security
- **Local Storage**: All user data, roles, and messages are stored in browser LocalStorage
- **No External Transmission**: Data never leaves your browser unless you explicitly connect an AI API
- **Password Storage**: Passwords are stored in plain text in LocalStorage - **NOT recommended for production**
- **Session Management**: Simple session tokens stored locally
- **Use Case**: Development, demos, personal use, or single-user scenarios

### Full Stack Mode Security (Backend Enabled)
- **Database Storage**: All data stored in SQLite database on the server
- **Password Security**: Passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication with expiration
- **Session Management**: Server-side session validation
- **SQL Injection Protection**: Parameterized queries prevent SQL injection attacks
- **CORS Configuration**: Cross-origin requests properly configured
- **Data Isolation**: Each user's data is isolated by user_id with foreign key constraints
- **Use Case**: Production deployments, multi-user scenarios, team collaboration

### AI Model Integration
- **API Keys**: 
  - Client-Side Mode: Stored in LocalStorage (not secure for production)
  - Full Stack Mode: Stored in database (more secure, but still consider using environment variables)
- **Data Sharing**: When AI is enabled, your messages are sent to the configured AI provider
- **Privacy**: Review AI provider privacy policies before connecting

### Security Best Practices (Production Deployment)
1. **Use Full Stack Mode**: Enable the backend for production deployments
2. **HTTPS Only**: Always serve over secure HTTPS connections
3. **Strong JWT Secret**: Use a strong, random JWT secret in production
4. **API Key Management**: Store AI API keys in server-side environment variables
5. **Regular Updates**: Keep dependencies updated to patch security vulnerabilities
6. **Input Validation**: Backend validates all user inputs
7. **Rate Limiting**: Consider adding rate limiting for API endpoints
8. **Backup Strategy**: Implement regular database backups
9. **Environment Variables**: Never commit sensitive data to version control

### Privacy Features
- **Export Your Data**: Download all your data anytime using Settings → Export
- **Clear Data**: Remove all stored data with one click
- **No Tracking**: No analytics or tracking scripts included
- **Offline Capable**: Client-side mode works completely offline (without AI integration)
- **User Isolation**: In full stack mode, each user's data is completely isolated

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
