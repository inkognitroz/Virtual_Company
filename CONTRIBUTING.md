# Contributing to Virtual Company

Thank you for your interest in contributing to Virtual Company! We welcome contributions from everyone. This document provides guidelines to help you contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Community](#community)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion, or sexual identity and orientation

### Our Standards

**Examples of positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Project maintainers are responsible for clarifying standards and taking appropriate action in response to unacceptable behavior.

---

## Getting Started

### Prerequisites

- **Git**: Version control system
- **Text Editor**: VS Code, Sublime Text, or your preferred editor
- **Web Browser**: Chrome, Firefox, Edge, or Safari (latest version)
- **Basic Knowledge**: HTML, CSS, JavaScript (ES6+)

### Setting Up Your Development Environment

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Virtual_Company.git
   cd Virtual_Company
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/inkognitroz/Virtual_Company.git
   ```

4. **Open in Browser**
   ```bash
   # Simply open index.html in your browser
   # OR use a local server:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

5. **Test the Application**
   - Register a new account
   - Create some roles
   - Send chat messages
   - Verify all features work

---

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Bug Fixes**: Fix issues and improve stability
2. **New Features**: Add new functionality
3. **Documentation**: Improve or add documentation
4. **UI/UX Improvements**: Enhance the user interface
5. **Performance**: Optimize code for better performance
6. **Tests**: Add or improve test coverage
7. **Security**: Fix security vulnerabilities
8. **Accessibility**: Improve accessibility features

### First Time Contributors

Look for issues labeled:
- `good first issue`: Easy issues for newcomers
- `help wanted`: Issues where we need help
- `documentation`: Documentation improvements

### Workflow

1. **Check Existing Issues**: Before starting, check if an issue exists
2. **Create Issue**: If not, create a new issue describing what you want to do
3. **Discuss**: Wait for feedback from maintainers
4. **Create Branch**: Create a feature branch
5. **Make Changes**: Implement your changes
6. **Test**: Test thoroughly
7. **Submit PR**: Create a pull request
8. **Review**: Address review feedback
9. **Merge**: Maintainer will merge when approved

---

## Development Guidelines

### Code Style

#### JavaScript
- Use ES6+ features (const/let, arrow functions, template literals)
- Use meaningful variable and function names
- Use camelCase for variables and functions
- Add comments for complex logic
- Keep functions small and focused (single responsibility)
- Avoid global variables

**Example:**
```javascript
// Good
function calculateRoleStatistics(roles) {
  const totalRoles = roles.length;
  const activeRoles = roles.filter(r => r.isActive).length;
  return { total: totalRoles, active: activeRoles };
}

// Avoid
function calc(r) {
  var t = r.length;
  var a = 0;
  for (var i = 0; i < r.length; i++) {
    if (r[i].isActive) a++;
  }
  return { total: t, active: a };
}
```

#### HTML
- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Use kebab-case for IDs and classes
- Indent consistently (2 spaces)
- Keep structure clean and logical

**Example:**
```html
<!-- Good -->
<section id="chat-section" class="content-section" role="region" aria-label="Chat">
  <h2>Group Chat</h2>
  <div class="chat-container">
    <!-- content -->
  </div>
</section>

<!-- Avoid -->
<div id="chatSection">
  <p style="font-size: 24px; font-weight: bold;">Group Chat</p>
  <div class="container">
    <!-- content -->
  </div>
</div>
```

#### CSS
- Use CSS custom properties (variables) for colors and common values
- Follow BEM-like naming convention
- Mobile-first responsive design
- Avoid !important unless absolutely necessary
- Group related styles together

**Example:**
```css
/* Good */
.role-card {
  background: var(--dark-secondary);
  border-radius: var(--border-radius);
  padding: 20px;
  transition: var(--transition);
}

.role-card__header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.role-card--featured {
  border: 2px solid var(--primary-color);
}

/* Avoid */
.rolecard {
  background: #16213e !important;
  border-radius: 8px;
  padding: 20px;
}
```

### File Organization

```
Virtual_Company/
├── index.html          # Login page
├── dashboard.html      # Main dashboard
├── auth.js            # Authentication logic
├── dashboard.js       # Dashboard functionality
├── styles.css         # All styles
├── ARCHITECTURE.md    # Architecture docs
├── ROADMAP.md         # Product roadmap
├── SECURITY.md        # Security policy
├── CONTRIBUTING.md    # This file
└── README.md          # Main documentation
```

### Naming Conventions

#### LocalStorage Keys
Pattern: `virtualCompany[Feature]`
```javascript
// Good
localStorage.setItem('virtualCompanyUsers', JSON.stringify(users));
localStorage.setItem('virtualCompanyRoles', JSON.stringify(roles));

// Avoid
localStorage.setItem('users', JSON.stringify(users));
localStorage.setItem('vc_roles', JSON.stringify(roles));
```

#### Functions
Use descriptive, action-oriented names
```javascript
// Good
function renderChatMessages() { }
function updateChatRoleSelector() { }
function deleteRole(roleId) { }

// Avoid
function render() { }
function update() { }
function delete(id) { }
```

#### Variables
Use descriptive nouns
```javascript
// Good
const currentUser = JSON.parse(localStorage.getItem('virtualCompanyUser'));
const chatMessages = [];
const isListening = false;

// Avoid
const user = JSON.parse(localStorage.getItem('virtualCompanyUser'));
const msgs = [];
const flag = false;
```

### Security Considerations

1. **Input Validation**: Always validate user input
2. **XSS Prevention**: Sanitize content before displaying
3. **API Keys**: Never commit API keys
4. **Dependencies**: Keep dependencies updated
5. **Error Handling**: Don't expose sensitive info in errors

### Accessibility

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Add labels for screen readers
3. **Keyboard Navigation**: Ensure all features accessible via keyboard
4. **Color Contrast**: Maintain WCAG AA contrast ratios
5. **Alt Text**: Provide alt text for images

### Performance

1. **Minimize DOM Manipulation**: Batch updates
2. **Event Delegation**: Use event delegation where possible
3. **Debounce/Throttle**: For frequent events
4. **Lazy Loading**: Load content as needed
5. **LocalStorage Limits**: Be mindful of storage size

---

## Pull Request Process

### Before Submitting

- [ ] Test your changes thoroughly
- [ ] Ensure no console errors
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Update documentation if needed
- [ ] Follow code style guidelines
- [ ] No linting errors (if linter is configured)

### Creating a Pull Request

1. **Update Your Fork**
   ```bash
   git checkout main
   git fetch upstream
   git merge upstream/main
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Changes**
   - Write clear, focused commits
   - Follow commit message guidelines

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: Add role filtering feature"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Link related issues

### Commit Message Guidelines

Use conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(chat): Add message search functionality

Implemented search feature that allows users to search
through chat history using keywords.

Closes #123

---

fix(auth): Fix password validation bug

Password validation was not checking minimum length correctly.
Now properly validates minimum 8 characters.

---

docs(readme): Update installation instructions

Added steps for using local Python server and clarified
browser requirements.
```

### PR Review Process

1. **Automated Checks**: CI will run (when configured)
2. **Code Review**: Maintainer reviews your code
3. **Feedback**: Address any requested changes
4. **Approval**: PR approved by maintainer
5. **Merge**: Maintainer merges PR

### After Your PR is Merged

1. **Delete Branch**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update Your Fork**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

---

## Reporting Bugs

### Before Reporting

1. **Check Existing Issues**: Search for similar issues
2. **Try Latest Version**: Ensure bug exists in latest code
3. **Reproduce**: Confirm you can reproduce the bug
4. **Collect Info**: Gather browser version, OS, steps to reproduce

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11, macOS 14]
- Version: [e.g., commit hash or version]

**Additional Context**
Any other relevant information.
```

### Severity Labels

- `critical`: App is unusable, data loss possible
- `high`: Major feature broken
- `medium`: Feature partially broken
- `low`: Minor issue, workaround exists

---

## Suggesting Features

### Before Suggesting

1. **Check Roadmap**: See if feature is already planned (ROADMAP.md)
2. **Search Issues**: Check if someone already suggested it
3. **Validate Need**: Ensure it benefits most users
4. **Consider Scope**: Keep it aligned with project goals

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature.

**Problem It Solves**
What user problem does this address?

**Proposed Solution**
How you envision this working.

**Alternatives Considered**
Other ways to solve this problem.

**Additional Context**
Mockups, examples, or references.

**Priority**
- [ ] Critical
- [ ] High
- [ ] Medium
- [ ] Low
```

---

## Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and community chat
- **Documentation**: Check README, ARCHITECTURE, and other docs

### Staying Updated

- **Watch Repository**: Get notifications for updates
- **Star Repository**: Show your support
- **Follow Project**: Keep up with releases

### Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes
- Special thanks in documentation

---

## Questions?

If you have questions about contributing, please:
1. Check this guide and other documentation
2. Search existing issues and discussions
3. Create a new discussion or issue

Thank you for contributing to Virtual Company! 🚀

---

**Note**: These guidelines may evolve. Check back periodically for updates.
