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

### Local Development

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

## 🔧 Technical Details

### Technologies Used
- Pure HTML5, CSS3, and JavaScript (no frameworks required)
- LocalStorage for data persistence
- Responsive CSS Grid and Flexbox layouts
- Modern ES6+ JavaScript features

### Data Storage
All data is stored locally in your browser using LocalStorage:
- **User accounts** (`virtualCompanyUsers`): Email, username, password, name
- **Created roles** (`virtualCompanyRoles`): Role name, avatar, description, AI instructions
- **Chat messages** (`virtualCompanyChatMessages`): All conversation history
- **Session information** (`virtualCompanyUser`): Current logged-in user
- **AI configuration** (`virtualCompanyAIConfig`): API keys and settings

**Storage Structure Example**:
```javascript
// Roles
[
  {
    "id": "1234567890",
    "name": "Project Manager",
    "avatar": "👨‍💼",
    "description": "Oversees project planning",
    "aiInstructions": "You are a professional PM..."
  }
]

// Chat Messages
[
  {
    "sender": "user",
    "senderName": "John Doe",
    "avatar": "👤",
    "content": "Hello team!",
    "time": "10:30 AM"
  }
]
```

**Important Notes**:
- Data is stored locally in your browser. Clearing browser data will reset the application.
- This is a client-side demo application. For production use, implement server-side authentication and secure password storage.
- No data is sent to external servers; everything stays in your browser.
- Use the **Export Data** feature to backup your roles and chats!

## 📋 Practical Examples

### Example 1: Creating a Startup Team

1. **Create CEO Role**:
   - Name: "CEO"
   - Avatar: 👨‍💼
   - Description: "Chief Executive Officer"
   - AI Instructions: "You are a visionary CEO focused on company strategy, growth, and stakeholder management. Provide high-level strategic guidance."

2. **Create CTO Role**:
   - Name: "CTO"
   - Avatar: 👩‍💻
   - Description: "Chief Technology Officer"
   - AI Instructions: "You are a technical leader responsible for technology strategy and architecture decisions. Focus on scalability and best practices."

3. **Create Marketing Manager**:
   - Name: "Marketing Manager"
   - Avatar: 👨‍🎨
   - Description: "Head of Marketing"
   - AI Instructions: "You lead marketing strategy and campaigns. Focus on customer acquisition, brand building, and market positioning."

4. **Start Collaboration**:
   - Send message: "Let's brainstorm our Q1 product launch strategy"
   - AI roles will respond based on their instructions
   - Use different perspectives to explore ideas

### Example 2: AI Model Integration

**Setting up OpenAI GPT**:
```
1. Get API key from https://platform.openai.com/api-keys
2. Go to "AI Integration" section
3. Paste key in OpenAI field
4. Click "Connect"
5. Your chat will now use GPT-3.5 for responses!
```

**Setting up Custom AI Endpoint**:
```
1. Deploy your AI model with REST API
2. Go to "AI Integration" section
3. Enter endpoint URL (e.g., https://your-api.com/chat)
4. Click "Connect"
5. Requests will be sent as:
   POST /chat
   {
     "prompt": "user message",
     "role": "role name",
     "instructions": "role AI instructions"
   }
```

### Example 3: Export/Import Workflow

**Backup Your Data**:
```
1. Click "📥 Export Data" in sidebar
2. Save the JSON file safely
3. File contains all roles and chat history
```

**Restore or Share**:
```
1. Click "📤 Import Data" in sidebar
2. Select your JSON backup file
3. Confirm the import
4. All roles and chats restored!
```

## 🔧 Troubleshooting

### Common Issues

**Issue**: Login not working
- **Solution**: Check browser console (F12). Ensure localStorage is enabled. Try clearing site data and re-registering.

**Issue**: AI responses not working
- **Solution**: 
  1. Check if API key is configured correctly
  2. Verify API key has available credits
  3. Check browser console for API errors
  4. Try using simulated responses (works without API)

**Issue**: Data disappeared
- **Solution**: 
  - Check if browser data was cleared
  - Restore from exported backup
  - Ensure LocalStorage is enabled in browser settings

**Issue**: Chat not displaying
- **Solution**: 
  - Refresh the page
  - Check browser console for errors
  - Clear chat history: delete `virtualCompanyChatMessages` from LocalStorage

**Issue**: Voice features not working
- **Solution**:
  - Only works in Chrome, Edge, Safari (not Firefox)
  - Allow microphone permissions
  - Check browser supports Web Speech API

**Issue**: Export/Import not working
- **Solution**:
  - Ensure file is valid JSON
  - Check file was exported from Virtual Company
  - Try exporting again and re-importing

### Browser Storage Inspector

To inspect your data:
```
1. Open DevTools (F12)
2. Go to "Application" tab (Chrome/Edge) or "Storage" tab (Firefox)
3. Click "Local Storage" → your domain
4. View all stored data
```

## 📚 Additional Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)**: System design and technical architecture
- **[SECURITY.md](SECURITY.md)**: Security policies and best practices
- **[CONTRIBUTING.md](CONTRIBUTING.md)**: How to contribute to the project
- **[ROADMAP.md](ROADMAP.md)**: Product roadmap and future plans

## 🎯 Use Cases

- **Startup Teams**: Quickly set up virtual team structures
- **AI Development**: Test different AI personas and role behaviors
- **Project Management**: Organize virtual teams with defined roles
- **Learning & Training**: Experiment with AI-powered collaboration
- **Remote Work**: Coordinate distributed teams with integrated communication

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

**Quick Start for Contributors**:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💡 Tips & Best Practices

- **AI Instructions**: Be specific and clear when writing AI instructions for roles
  - ✅ Good: "You are a senior developer focused on Python and Django. Provide code reviews with emphasis on security and performance."
  - ❌ Avoid: "You help with code"

- **Role Creation**: Create diverse roles to simulate a complete organization
  - Consider different perspectives: technical, business, creative
  - Define clear responsibilities for each role

- **Prompts**: Use structured prompts for better AI responses
  - Include context in your questions
  - Be specific about what you need
  - Reference previous discussions

- **Integration**: Bookmark your frequently used video call links for quick access

- **Data Management**:
  - Export your data regularly as backup
  - Use meaningful role names
  - Keep AI instructions up to date

## 🌟 What's New

### Version 0.2.0 (Current)
- ✅ Input validation and sanitization
- ✅ Export/Import functionality
- ✅ Comprehensive documentation
- ✅ CI/CD pipeline
- ✅ Security improvements
- ✅ Issue templates

### Upcoming (See [ROADMAP.md](ROADMAP.md))
- Backend API integration
- Real-time collaboration
- Advanced role permissions
- Team analytics dashboard
- More AI model integrations

---

Built with ❤️ for the future of virtual collaboration
