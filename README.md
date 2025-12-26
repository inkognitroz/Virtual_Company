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

### Option 1: Client-Side Only (GitHub Pages)

Perfect for quick demos and personal use without server infrastructure.

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

### Option 2: Full-Stack with Backend (Production)

Recommended for production use with persistent storage, multi-user support, and advanced features.

#### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/inkognitroz/Virtual_Company.git
   cd Virtual_Company
   ```

2. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and set your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the services**
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - Frontend: Open index.html in browser (configure to point to localhost:8000)

#### Manual Setup

1. **Backend Setup**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment
   cp .env.example .env
   # Edit .env with your configuration
   
   # Run the server
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup**
   - Update frontend configuration to point to your backend URL
   - See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed integration steps

#### Deployment to Cloud

**Railway / Render / Fly.io:**
1. Connect your GitHub repository
2. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SECRET_KEY` - Random secret for JWT
   - `OPENAI_API_KEY` (optional)
   - `ALLOWED_ORIGINS` - Your frontend URL
3. Deploy from `backend` directory
4. Update frontend to use your backend URL

**Detailed documentation:**
- Backend: [backend/README.md](backend/README.md)
- Integration: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

### Local Development (Client-Side)

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

The Virtual Company platform now supports **two deployment modes**:

#### 1. Client-Side Mode (Current - GitHub Pages)
A fully client-side application using localStorage:

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

#### 2. Full-Stack Mode (New - FastAPI Backend)
Production-ready architecture with backend services:

```
┌──────────────────┐     HTTP/WebSockets       ┌──────────────────┐
│     Client       │ ─────────────────────────▶ │    FastAPI       │
│ (VirtualCompany  │ ◀────────────────────────── │    Backend       │
│  UI)             │       Real-time updates    │ (REST, WS, DB)   │
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
                                                          │
                                                          ▼
                                                  ┌───────────────┐
                                                  │  PostgreSQL   │
                                                  │   Database    │
                                                  └───────────────┘
```

**Backend Features:**
- **Authentication**: JWT-based secure authentication
- **Database**: PostgreSQL/SQLite for persistent storage
- **Real-time**: WebSocket support for live chat
- **WebRTC**: Voice and video call signaling
- **LLM Integration**: Multi-provider support (OpenAI, Anthropic, OpenRouter)
- **Scalable**: Docker-ready with horizontal scaling support

**Data Flow:**
1. User creates roles with specific AI instructions
2. Messages are sent through the chat interface (localStorage or WebSocket)
3. AI models process messages using role-specific instructions
4. Responses are generated and displayed in real-time
5. Data persists in localStorage (client-side) or database (full-stack)

**Role Orchestration:**
- Each role contains AI instructions that guide LLM behavior
- Roles can be selected dynamically for message sending
- AI responses are context-aware based on role instructions
- Voice input/output supported for accessibility

### Technologies Used

**Frontend:**
- Pure HTML5, CSS3, and JavaScript (no frameworks required)
- LocalStorage for data persistence (client-side mode)
- Responsive CSS Grid and Flexbox layouts
- Modern ES6+ JavaScript features
- Web Speech API for voice capabilities
- WebSocket and WebRTC for real-time communication

**Backend (Optional - Full-Stack Mode):**
- FastAPI (Python) - Modern async web framework
- SQLModel - SQL database with Python type hints
- PostgreSQL - Production database (SQLite for development)
- JWT - Secure authentication
- WebSocket - Real-time bidirectional communication
- Docker - Containerization and deployment
- GitHub Actions for CI/CD

### Data Storage

**Client-Side Mode:**
All data is stored locally in your browser using LocalStorage:
- User accounts
- Created roles
- Chat messages
- Session information
- AI configuration

**Full-Stack Mode:**
Data is stored in a PostgreSQL database:
- User profiles with hashed passwords
- Roles and AI instructions
- Chat rooms and message history
- API keys (encrypted)
- Session management via JWT tokens

**Important Notes**:
- **Client-side**: Data is stored locally in your browser. Clearing browser data will reset the application.
- **Full-stack**: Data persists in the database and is accessible from any device.
- For production use, the full-stack mode provides secure authentication and data persistence.
- See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for backend integration instructions.

## 🔒 Security & Privacy

### Data Storage Security
- **Local Storage**: All user data, roles, and messages are stored in browser LocalStorage
- **No External Transmission**: Data never leaves your browser unless you explicitly connect an AI API
- **Password Storage**: Passwords are stored in plain text in LocalStorage - **NOT recommended for production**
- **Session Management**: Simple session tokens stored locally

### AI Model Integration
- **API Keys**: If you connect AI models (OpenAI, Claude), API keys are stored in LocalStorage
- **Data Sharing**: When AI is enabled, your messages are sent to the configured AI provider
- **Privacy**: Review AI provider privacy policies before connecting

### Recommendations for Production Use
1. **Implement Server-Side Authentication**: Use secure backend authentication (OAuth, JWT)
2. **Encrypt Sensitive Data**: Hash passwords with bcrypt or similar
3. **Use HTTPS**: Always serve over secure connections
4. **API Key Security**: Store API keys in environment variables, not client-side
5. **Data Backup**: Implement regular backups using the export functionality
6. **Access Control**: Add role-based permissions for enterprise use

### Privacy Features
- **Export Your Data**: Download all your data anytime using Settings → Export
- **Clear Data**: Remove all stored data with one click
- **No Tracking**: No analytics or tracking scripts included
- **Offline Capable**: Works completely offline (without AI integration)

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
- Persistent cloud storage option ✅ (Backend implemented)
- Advanced role permissions
- Team analytics and insights
- Export/import functionality for roles and chats ✅ (Implemented)
- Real-time collaboration features ✅ (WebSocket support added)
- Multi-language support
- Mobile app version
- Plugin system for extensibility

## 🗺️ Roadmap

### Phase 1: Foundation ✅ (Completed)
- [x] Core role management system
- [x] Group chat functionality
- [x] AI integration (OpenAI, Claude, Custom APIs)
- [x] Video call integrations (Meet, Teams, WhatsApp)
- [x] Export/import data functionality
- [x] Voice input/output support
- [x] CI/CD pipeline setup
- [x] **FastAPI backend with database persistence**
- [x] **JWT authentication system**
- [x] **WebSocket real-time chat**
- [x] **Multi-provider LLM integration**
- [x] **WebRTC signaling infrastructure**
- [x] **Docker deployment support**

### Phase 2: Frontend-Backend Integration (Q1 2024)
- [ ] Migrate frontend to use backend APIs
- [ ] Implement WebSocket chat in UI
- [ ] Add WebRTC voice/video UI controls
- [ ] User profile management interface
- [ ] Real-time multi-user collaboration
- [ ] Role-based permissions and access control
- [ ] Advanced chat features (threads, reactions, mentions)
- [ ] File sharing and document collaboration
- [ ] Integration with project management tools (Jira, Trello, Asana)
- [ ] Enhanced AI model support (Google Gemini, local LLMs)

### Phase 3: Analytics & Intelligence (Q2 2024)
- [ ] Team productivity analytics
- [ ] AI-powered insights and recommendations
- [ ] Conversation sentiment analysis
- [ ] Role performance metrics
- [ ] Automated meeting summaries
- [ ] Smart task extraction from conversations

### Phase 4: Enterprise Features (Q3 2024)
- [x] Cloud storage backend option (FastAPI backend ready)
- [ ] Enterprise SSO (SAML, OAuth)
- [ ] Audit logs and compliance features
- [ ] Custom branding and white-labeling
- [ ] API for third-party integrations
- [ ] Advanced security features (encryption, 2FA)

### Phase 5: Scale & Extend (Q4 2024)
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
