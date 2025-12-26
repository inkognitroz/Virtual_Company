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

### 📹 Video Call Integration
- **Google Meet**: Create or join meetings directly
- **Microsoft Teams**: Seamless Teams integration
- **WhatsApp**: Group chat connectivity

### 🎨 Modern UI
- Clean, professional dark theme interface
- Responsive design for desktop and mobile
- Intuitive navigation and user experience

## 🛠️ Setup Instructions

### Option 1: Frontend Only (GitHub Pages)

Perfect for quick demos and testing without backend infrastructure.

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
   - Data is stored in browser localStorage (local to your device)

### Option 2: Full Stack with Backend (Recommended for Production)

For persistent data storage, secure authentication, and API key protection.

1. **Clone the repository**
   ```bash
   git clone https://github.com/inkognitroz/Virtual_Company.git
   cd Virtual_Company
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB** (optional, app works without it)
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or install MongoDB locally
   ```

5. **Run the Server**
   ```bash
   npm start
   # Or for development with auto-restart:
   npm run dev
   ```

6. **Access the Application**
   - Open `http://localhost:3000` in your browser
   - Data is stored in MongoDB database

📚 **Detailed backend setup guide**: See [BACKEND_SETUP.md](BACKEND_SETUP.md)

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

## 🔌 Backend API (Optional)

The Virtual Company provides a RESTful API for backend integration. This is optional but recommended for production deployments.

### API Features
- **Secure Authentication**: JWT-based with bcrypt password hashing
- **User Management**: Registration, login, profile updates
- **Role Management**: CRUD operations for virtual company roles
- **Message History**: Persistent chat message storage
- **AI Proxy**: Server-side API calls to hide API keys from frontend
- **Rate Limiting**: Protection against abuse (100 req/15min)
- **CORS Support**: Configurable cross-origin access
- **Input Validation**: All inputs validated and sanitized

### Quick API Example

```javascript
// Register a new user
const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'user@example.com',
        username: 'username',
        password: 'secure-password',
        name: 'John Doe'
    })
});

const { token, user } = await response.json();
// Use token for authenticated requests
```

### API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/users/me` - Get current user profile
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create new role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role
- `GET /api/messages` - Get chat messages
- `POST /api/messages` - Create new message
- `POST /api/ai/chat` - Proxy AI requests (hides API keys)
- `GET /api/health` - Health check endpoint

📚 **Complete API Documentation**: See [BACKEND_SETUP.md](BACKEND_SETUP.md)

## 🔧 Technical Details

### Architecture

The Virtual Company supports two deployment modes:

#### 1. **Frontend-Only Mode** (Default)
- Pure HTML5, CSS3, and JavaScript
- LocalStorage for data persistence
- No server required - perfect for GitHub Pages
- AI API keys are stored in browser (less secure)

#### 2. **Full-Stack Mode** (Recommended for Production)
- **Backend**: Node.js + Express server
- **Database**: MongoDB for persistent storage
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: API keys stored server-side, rate limiting, CORS, Helmet
- **API**: RESTful endpoints for all resources

### Technologies Used

**Frontend:**
- Pure HTML5, CSS3, and JavaScript (no frameworks required)
- LocalStorage for client-side data persistence
- Responsive CSS Grid and Flexbox layouts
- Modern ES6+ JavaScript features
- Web Speech API for voice features

**Backend (Optional):**
- Node.js v16+
- Express.js web framework
- MongoDB database with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- express-validator for input validation
- Helmet for security headers
- Rate limiting for API protection

### Data Storage

**Frontend-Only Mode:**
All data is stored locally in your browser using LocalStorage:
- User accounts
- Created roles
- Chat messages
- Session information

**Full-Stack Mode:**
All data is stored in MongoDB database:
- User accounts (with hashed passwords)
- Roles (linked to user accounts)
- Chat messages (with full history)
- Secure session management via JWT

**Important Notes**:
- Frontend-only: Data is stored locally in your browser. Clearing browser data will reset the application.
- Full-stack: Data persists in the database and is accessible from any device after login.
- Frontend-only: No data is sent to external servers; everything stays in your browser.
- Full-stack: Secure server-side data storage with proper authentication and encryption.

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

- ✅ Backend API with persistent database storage
- ✅ Secure JWT-based authentication
- ✅ Server-side API key protection
- Real-time AI model integration with streaming responses
- WebSocket support for real-time collaboration
- Advanced role permissions and access control
- Team analytics and insights
- Export/import functionality for roles and chats
- Multi-user real-time chat with presence indicators
- File sharing and document collaboration
- Calendar integration for scheduling
- Task management and project tracking

## 💡 Tips

- **AI Instructions**: Be specific and clear when writing AI instructions for roles
- **Role Creation**: Create diverse roles to simulate a complete organization
- **Prompts**: Use structured prompts for better AI responses
- **Integration**: Bookmark your frequently used video call links for quick access

---

Built with ❤️ for the future of virtual collaboration 
# Virtual_Company
Virtual Company is an AI-based virtual company that can be set up in minutes. The company features the possibility to define all roles necessary to reach company goals and mission. All functions are fully automated and AI-based. 

## Suggested improvements
- Add a short architecture overview (core services, data flow, and role orchestration) so contributors know how the AI-driven automation is structured.
- Document a minimal setup/usage example (how to define roles, configure goals/mission, and trigger automation) to make the value proposition tangible.
- Establish basic quality gates (CI workflow with linting/tests) and a small test suite that validates the automated role assignment logic.
- Include security and privacy notes (data storage, model usage, and access control) since automation likely handles sensitive business data.
- Provide a roadmap with 3–5 upcoming milestones (MVP scope, integrations, monitoring/observability) to guide contributions and prioritization.
