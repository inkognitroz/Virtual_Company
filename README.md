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
- User accounts
- Created roles
- Chat messages
- Session information

**Important Notes**:
- Data is stored locally in your browser. Clearing browser data will reset the application.
- This is a client-side demo application. For production use, implement server-side authentication and secure password storage.
- No data is sent to external servers; everything stays in your browser.

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

- Real-time AI model integration
- Persistent cloud storage option
- Advanced role permissions
- Team analytics and insights
- Export/import functionality for roles and chats
- Real-time collaboration features

## 💡 Tips

- **AI Instructions**: Be specific and clear when writing AI instructions for roles
- **Role Creation**: Create diverse roles to simulate a complete organization
- **Prompts**: Use structured prompts for better AI responses
- **Integration**: Bookmark your frequently used video call links for quick access

---

Built with ❤️ for the future of virtual collaboration 
# Virtual_Company
Virtual Company is an AI-based virtual company that can be set up in minutes. The platform lets you define every role needed to achieve your company goals and mission, then orchestrates those roles with AI-driven automation.

## Architecture at a glance
- **Role Registry**: Stores the catalog of roles, required skills, and responsibilities.
- **Goal Orchestrator**: Breaks company goals into tasks, assigns them to roles, and tracks completion.
- **Automation Engine**: Executes AI workflows (content, analysis, comms) and escalates when human review is required.
- **Data Layer**: Persists configurations, run history, and artifacts; exposes audit trails for compliance.
- **Interfaces**: CLI/API hooks to trigger runs, inject context, and retrieve deliverables.

## Quick start (minimal example)
1) **Define mission & goals**  
   ```bash
   vc init --mission "Launch Q1 marketing campaign" --goal "Generate 200 Sales Qualified Leads (SQLs)"
   ```
2) **Create roles** (examples)  
   ```bash
   vc role add strategist --skills "go-to-market, segmentation" --owner you@example.com
   vc role add copywriter --skills "short-form, brand-voice" --owner content@example.com
   vc role add analyst    --skills "sql, dashboards" --owner data@example.com
   ```
3) **Trigger automation**  
   ```bash
   vc run --goal "Generate campaign brief" --deadline "2025-02-01"
   ```
4) **Review outputs**  
   ```bash
   vc artifacts list
   vc artifacts get campaign-brief.md
   ```

## Quality gates
- **Lint/tests:** Add a basic CI workflow (e.g., GitHub Actions) that runs formatting/lint and unit tests on PRs.
- **Sample tests to add when extending the suite:**
  - Validate role assignment logic (e.g., ensuring required skills are present before task assignment).
  - Validate goal decomposition so tasks are created for each milestone.
- **Definition of done:** CI green, documentation updated, and security checks pass.

## Security & privacy notes
- Store secrets (API keys, model credentials) in a secrets manager; never commit them to the repo.
- Restrict data access by role; prefer scoped tokens for automation.
- Log and audit AI actions (inputs/outputs) to detect misuse; redact PII before persistence.
- Document what data is sent to third-party models and provide an opt-out for sensitive content.

## Roadmap (draft)
- MVP: Implement role registry, goal orchestrator, and CLI/API triggers.
- Integrations: Connect to task trackers (Jira/Linear) and comms (Slack/Email).
- Observability: Add run dashboards, alerts on failures, and cost tracking for AI calls.
- Governance: Add approval steps, retention policies, and redaction pipelines.
- Extensibility: Plugin system for custom tools and models.

## Development notes
- The quick-start commands reflect the target CLI interface. For partial implementations, follow the same sequence by: (1) setting mission/goals in config files or environment, (2) registering roles in the role registry file or database seeding script, and (3) invoking the orchestration script/API to run goals.
