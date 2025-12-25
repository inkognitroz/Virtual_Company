// Dashboard JavaScript

// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('virtualCompanyUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Display user info
document.getElementById('userName').textContent = currentUser.name || currentUser.username;

// Initialize roles from localStorage
let roles = JSON.parse(localStorage.getItem('virtualCompanyRoles') || '[]');

// Initialize chat messages
let chatMessages = JSON.parse(localStorage.getItem('virtualCompanyChatMessages') || '[]');

// Navigation handling
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all nav items and sections
        navItems.forEach(nav => nav.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Show corresponding section
        const sectionId = item.dataset.section + '-section';
        document.getElementById(sectionId).classList.add('active');
    });
});

// Logout handling
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('virtualCompanyUser');
    window.location.href = 'index.html';
});

// ========== ROLES MANAGEMENT ==========

// Modal handling
const addRoleModal = document.getElementById('addRoleModal');
const addRoleBtn = document.getElementById('addRoleBtn');
const closeModal = document.querySelector('.close');

addRoleBtn.addEventListener('click', () => {
    addRoleModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    addRoleModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === addRoleModal) {
        addRoleModal.style.display = 'none';
    }
});

// Add role form handling
document.getElementById('addRoleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const role = {
        id: Date.now().toString(),
        name: document.getElementById('roleName').value,
        avatar: document.getElementById('roleAvatar').value,
        description: document.getElementById('roleDescription').value,
        aiInstructions: document.getElementById('aiInstructions').value
    };
    
    roles.push(role);
    localStorage.setItem('virtualCompanyRoles', JSON.stringify(roles));
    
    renderRoles();
    updateChatRoleSelector();
    
    // Reset form and close modal
    document.getElementById('addRoleForm').reset();
    addRoleModal.style.display = 'none';
});

// Render roles
function renderRoles() {
    const rolesGrid = document.getElementById('rolesGrid');
    
    if (roles.length === 0) {
        rolesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray-text);">
                <p style="font-size: 1.2em; margin-bottom: 20px;">No roles created yet. Click "Add Role" to get started!</p>
                <p>Create roles for your virtual company team members and define their AI instructions.</p>
            </div>
        `;
        return;
    }
    
    rolesGrid.innerHTML = roles.map(role => `
        <div class="role-card">
            <div class="role-card-header">
                <div class="role-avatar">${role.avatar}</div>
                <div>
                    <h3>${role.name}</h3>
                </div>
            </div>
            <p>${role.description || 'No description provided'}</p>
            ${role.aiInstructions ? `
                <div class="ai-instructions">
                    <strong>AI Instructions:</strong><br>
                    ${role.aiInstructions}
                </div>
            ` : ''}
            <div class="role-actions">
                <button class="btn btn-secondary btn-small" onclick="deleteRole('${role.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Delete role
function deleteRole(roleId) {
    if (confirm('Are you sure you want to delete this role?')) {
        roles = roles.filter(r => r.id !== roleId);
        localStorage.setItem('virtualCompanyRoles', JSON.stringify(roles));
        renderRoles();
        updateChatRoleSelector();
    }
}

// ========== CHAT FUNCTIONALITY ==========

// Update chat role selector
function updateChatRoleSelector() {
    const chatRole = document.getElementById('chatRole');
    chatRole.innerHTML = '<option value="user">Yourself</option>';
    
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = `${role.avatar} ${role.name}`;
        chatRole.appendChild(option);
    });
}

// Render chat messages
function renderChatMessages() {
    const chatMessagesContainer = document.getElementById('chatMessages');
    
    // Keep system message and add all chat messages
    let messagesHTML = `
        <div class="system-message">
            Welcome to the Virtual Company group chat. Start collaborating with your AI team!
        </div>
    `;
    
    chatMessages.forEach(msg => {
        const messageClass = msg.sender === 'user' ? 'user' : 'role';
        messagesHTML += `
            <div class="message ${messageClass}">
                <div class="message-header">
                    <span class="message-avatar">${msg.avatar}</span>
                    <span>${msg.senderName}</span>
                    <span style="margin-left: auto; font-size: 0.8em; font-weight: normal;">${msg.time}</span>
                </div>
                <div class="message-content">${msg.content}</div>
            </div>
        `;
    });
    
    chatMessagesContainer.innerHTML = messagesHTML;
    
    // Scroll to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Chat form handling
document.getElementById('chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const chatInput = document.getElementById('chatInput');
    const chatRole = document.getElementById('chatRole');
    const content = chatInput.value.trim();
    
    if (!content) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let message;
    
    if (chatRole.value === 'user') {
        message = {
            sender: 'user',
            senderName: currentUser.name || currentUser.username,
            avatar: '👤',
            content: content,
            time: timeString
        };
    } else {
        const role = roles.find(r => r.id === chatRole.value);
        message = {
            sender: 'role',
            senderName: role.name,
            avatar: role.avatar,
            content: content,
            time: timeString,
            roleInstructions: role.aiInstructions
        };
    }
    
    chatMessages.push(message);
    localStorage.setItem('virtualCompanyChatMessages', JSON.stringify(chatMessages));
    
    renderChatMessages();
    chatInput.value = '';
});

// ========== VIDEO CALL INTEGRATIONS ==========

// Google Meet
document.getElementById('joinMeetBtn').addEventListener('click', () => {
    const meetLink = document.getElementById('meetLink').value.trim();
    if (meetLink) {
        window.open(meetLink, '_blank');
    } else {
        alert('Please enter a Google Meet link');
    }
});

document.getElementById('createMeetBtn').addEventListener('click', () => {
    window.open('https://meet.google.com/new', '_blank');
});

// Microsoft Teams
document.getElementById('joinTeamsBtn').addEventListener('click', () => {
    const teamsLink = document.getElementById('teamsLink').value.trim();
    if (teamsLink) {
        window.open(teamsLink, '_blank');
    } else {
        alert('Please enter a Teams meeting link');
    }
});

document.getElementById('createTeamsBtn').addEventListener('click', () => {
    window.open('https://teams.microsoft.com', '_blank');
});

// WhatsApp
document.getElementById('joinWhatsAppBtn').addEventListener('click', () => {
    const whatsappLink = document.getElementById('whatsappLink').value.trim();
    if (whatsappLink) {
        window.open(whatsappLink, '_blank');
    } else {
        alert('Please enter a WhatsApp group link');
    }
});

document.getElementById('createWhatsAppBtn').addEventListener('click', () => {
    window.open('https://web.whatsapp.com', '_blank');
});

// ========== INITIALIZATION ==========

// Initialize on page load
renderRoles();
updateChatRoleSelector();
renderChatMessages();

// Add some default roles if none exist
if (roles.length === 0) {
    const defaultRoles = [
        {
            id: 'role-1',
            name: 'Project Manager',
            avatar: '👨‍💼',
            description: 'Oversees project planning, execution, and delivery',
            aiInstructions: 'You are a professional Project Manager. Focus on planning, organizing tasks, managing timelines, and ensuring team coordination. Provide structured responses with clear action items and deadlines.'
        },
        {
            id: 'role-2',
            name: 'Lead Developer',
            avatar: '👩‍💻',
            description: 'Technical lead responsible for code quality and architecture',
            aiInstructions: 'You are an experienced Lead Developer. Provide technical insights, code reviews, architectural decisions, and best practices. Focus on scalability, maintainability, and code quality.'
        },
        {
            id: 'role-3',
            name: 'AI Assistant',
            avatar: '🤖',
            description: 'General purpose AI assistant for various tasks',
            aiInstructions: 'You are a helpful AI Assistant. Provide clear, concise, and accurate information. Be friendly and professional. Help with research, analysis, and problem-solving.'
        }
    ];
    
    roles = defaultRoles;
    localStorage.setItem('virtualCompanyRoles', JSON.stringify(roles));
    renderRoles();
    updateChatRoleSelector();
}
