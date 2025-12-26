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

// Initialize projects
let projects = JSON.parse(localStorage.getItem('virtualCompanyProjects') || '[]');

// Configuration constants
const ARTIFACT_PREVIEW_LENGTH = 200;

// Initialize chat messages
let chatMessages = JSON.parse(localStorage.getItem('virtualCompanyChatMessages') || '[]');

// AI Configuration
let aiConfig = JSON.parse(localStorage.getItem('virtualCompanyAIConfig') || '{}');

// Voice recognition and synthesis
let recognition = null;
let synthesis = window.speechSynthesis;
let isListening = false;

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
    
    const capabilitiesInput = document.getElementById('roleCapabilities').value;
    const capabilities = capabilitiesInput ? capabilitiesInput.split(',').map(c => c.trim()) : [];
    
    const role = {
        id: Date.now().toString(),
        name: document.getElementById('roleName').value,
        avatar: document.getElementById('roleAvatar').value,
        description: document.getElementById('roleDescription').value,
        aiInstructions: document.getElementById('aiInstructions').value,
        capabilities: capabilities
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
            ${role.capabilities && role.capabilities.length > 0 ? `
                <div class="role-capabilities">
                    <strong style="font-size: 0.85em; color: var(--primary-color);">Capabilities:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
                        ${role.capabilities.map(cap => `<span class="capability-badge">${cap}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
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
document.getElementById('chatForm').addEventListener('submit', async (e) => {
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
    
    // If user sent a message, generate AI response
    if (chatRole.value === 'user' && roles.length > 0) {
        await generateAIResponse(content);
    }
});

// Generate AI Response
async function generateAIResponse(userMessage) {
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Select a random AI role to respond or use configured AI
        const aiRoles = roles.filter(r => r.aiInstructions);
        if (aiRoles.length === 0) return;
        
        // Randomly select an AI role to respond (or could be based on context)
        const respondingRole = aiRoles[Math.floor(Math.random() * aiRoles.length)];
        
        let aiResponse = '';
        
        // Check if AI API is configured
        if (aiConfig.apiKey && aiConfig.provider) {
            // Call actual AI API
            aiResponse = await callAIAPI(userMessage, respondingRole);
        } else {
            // Fallback to simulated response
            aiResponse = generateSimulatedResponse(userMessage, respondingRole);
        }
        
        // Add AI response to chat
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const aiMessage = {
            sender: 'ai',
            senderName: respondingRole.name,
            avatar: respondingRole.avatar,
            content: aiResponse,
            time: timeString,
            isAI: true
        };
        
        // Remove typing indicator
        removeTypingIndicator();
        
        chatMessages.push(aiMessage);
        localStorage.setItem('virtualCompanyChatMessages', JSON.stringify(chatMessages));
        renderChatMessages();
        
        // Speak the response if voice is enabled
        if (aiConfig.voiceEnabled) {
            speakText(aiResponse);
        }
        
    } catch (error) {
        console.error('Error generating AI response:', error);
        removeTypingIndicator();
    }
}

// Call AI API (OpenAI, Claude, or custom)
async function callAIAPI(userMessage, role) {
    const provider = aiConfig.provider;
    const apiKey = aiConfig.apiKey;
    
    try {
        if (provider === 'openai') {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: role.aiInstructions },
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 500
                })
            });
            
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } else if (provider === 'claude') {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: 500,
                    messages: [
                        { role: 'user', content: `${role.aiInstructions}\n\n${userMessage}` }
                    ]
                })
            });
            
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            return data.content[0].text;
            
        } else if (provider === 'custom' && aiConfig.endpoint) {
            const response = await fetch(aiConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: userMessage,
                    role: role.name,
                    instructions: role.aiInstructions
                })
            });
            
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            return data.response || data.message || data.text;
        }
    } catch (error) {
        console.error('AI API Error:', error);
        return generateSimulatedResponse(userMessage, role);
    }
    
    return generateSimulatedResponse(userMessage, role);
}

// Generate simulated AI response (fallback)
function generateSimulatedResponse(userMessage, role) {
    const responses = {
        'Project Manager': [
            `Great point! Let's break this down into actionable tasks. I'll create a timeline and assign responsibilities.`,
            `I agree. We should prioritize this and allocate resources accordingly. Let me schedule a follow-up meeting.`,
            `That's an important consideration. I'll add it to our project roadmap and track the progress.`,
            `Excellent suggestion! This aligns well with our current sprint goals. Let's implement it in the next iteration.`
        ],
        'Lead Developer': [
            `From a technical perspective, we should consider scalability and maintainability here.`,
            `I recommend we implement this using best practices and add proper test coverage.`,
            `Good idea. We'll need to refactor some code, but it will improve our architecture significantly.`,
            `Let's review the technical requirements and ensure we have the right dependencies in place.`
        ],
        'AI Assistant': [
            `I can help with that! Based on the context, here's what I suggest...`,
            `Let me analyze this for you. The key considerations are...`,
            `That's an interesting question. Here's my recommendation based on best practices...`,
            `I've processed your request. Here are the main points to consider...`
        ]
    };
    
    const roleResponses = responses[role.name] || responses['AI Assistant'];
    const randomResponse = roleResponses[Math.floor(Math.random() * roleResponses.length)];
    
    return randomResponse;
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message role typing';
    typingDiv.innerHTML = `
        <div class="message-header">
            <span class="message-avatar">🤖</span>
            <span>AI is typing...</span>
        </div>
        <div class="typing-dots">
            <span></span><span></span><span></span>
        </div>
    `;
    chatMessagesContainer.appendChild(typingDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

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

// ========== PROJECTS & WORKFLOWS MANAGEMENT ==========

// Workflow templates based on MetaGPT SOPs
const workflowTemplates = {
    'software-dev': {
        name: 'Software Development',
        description: 'Complete software development workflow from requirements to deployment',
        stages: [
            { id: 1, name: 'Requirements Analysis', role: 'Product Manager', action: 'write_prd', output: 'Product Requirements Document' },
            { id: 2, name: 'Architecture Design', role: 'Architect', action: 'design_architecture', output: 'System Architecture Document' },
            { id: 3, name: 'Implementation', role: 'Lead Developer', action: 'write_code', output: 'Source Code' },
            { id: 4, name: 'Testing', role: 'QA Engineer', action: 'write_tests', output: 'Test Plan & Results' },
            { id: 5, name: 'Review & Deploy', role: 'Project Manager', action: 'coordination', output: 'Deployment Plan' }
        ]
    },
    'research': {
        name: 'Research & Analysis',
        description: 'Comprehensive research and analysis workflow',
        stages: [
            { id: 1, name: 'Research Planning', role: 'Researcher', action: 'research', output: 'Research Plan' },
            { id: 2, name: 'Data Collection', role: 'Researcher', action: 'data_analysis', output: 'Collected Data' },
            { id: 3, name: 'Analysis', role: 'Researcher', action: 'data_analysis', output: 'Analysis Report' },
            { id: 4, name: 'Insights & Recommendations', role: 'Product Manager', action: 'analyze_requirements', output: 'Action Items' }
        ]
    },
    'content-creation': {
        name: 'Content Creation',
        description: 'Create and publish content workflow',
        stages: [
            { id: 1, name: 'Content Planning', role: 'Product Manager', action: 'prioritize_features', output: 'Content Plan' },
            { id: 2, name: 'Content Creation', role: 'Lead Developer', action: 'write_code', output: 'Draft Content' },
            { id: 3, name: 'Review & Edit', role: 'QA Engineer', action: 'quality_assurance', output: 'Edited Content' },
            { id: 4, name: 'Publish', role: 'Project Manager', action: 'coordination', output: 'Published Content' }
        ]
    },
    'data-analysis': {
        name: 'Data Analysis',
        description: 'Data analysis and insights workflow',
        stages: [
            { id: 1, name: 'Data Collection', role: 'Researcher', action: 'research', output: 'Raw Data' },
            { id: 2, name: 'Data Processing', role: 'Lead Developer', action: 'write_code', output: 'Processed Data' },
            { id: 3, name: 'Analysis', role: 'Researcher', action: 'data_analysis', output: 'Analysis Results' },
            { id: 4, name: 'Reporting', role: 'Researcher', action: 'reporting', output: 'Final Report' }
        ]
    },
    'custom': {
        name: 'Custom Workflow',
        description: 'Create your own custom workflow',
        stages: [
            { id: 1, name: 'Planning', role: 'Project Manager', action: 'project_planning', output: 'Project Plan' },
            { id: 2, name: 'Execution', role: 'Lead Developer', action: 'write_code', output: 'Deliverables' },
            { id: 3, name: 'Review', role: 'QA Engineer', action: 'quality_assurance', output: 'Quality Report' }
        ]
    }
};

// Project modal handling
const addProjectModal = document.getElementById('addProjectModal');
const addProjectBtn = document.getElementById('addProjectBtn');
const closeProjectModal = document.getElementById('closeProjectModal');
const projectDetailModal = document.getElementById('projectDetailModal');
const closeDetailModal = document.getElementById('closeDetailModal');

if (addProjectBtn) {
    addProjectBtn.addEventListener('click', () => {
        updateRoleCheckboxes();
        addProjectModal.style.display = 'block';
    });
}

if (closeProjectModal) {
    closeProjectModal.addEventListener('click', () => {
        addProjectModal.style.display = 'none';
    });
}

if (closeDetailModal) {
    closeDetailModal.addEventListener('click', () => {
        projectDetailModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === addProjectModal) {
        addProjectModal.style.display = 'none';
    }
    if (e.target === projectDetailModal) {
        projectDetailModal.style.display = 'none';
    }
});

// Update role checkboxes in project form
function updateRoleCheckboxes() {
    const container = document.getElementById('roleCheckboxes');
    if (!container) return;
    
    container.innerHTML = roles.map(role => `
        <label class="checkbox-label">
            <input type="checkbox" name="projectRoles" value="${role.id}">
            <span>${role.avatar} ${role.name}</span>
        </label>
    `).join('');
}

// Add project form handling
const addProjectForm = document.getElementById('addProjectForm');
if (addProjectForm) {
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const selectedRoles = Array.from(document.querySelectorAll('input[name="projectRoles"]:checked'))
            .map(cb => cb.value);
        
        const workflowType = document.getElementById('workflowType').value;
        const workflow = workflowTemplates[workflowType];
        
        const project = {
            id: Date.now().toString(),
            name: document.getElementById('projectName').value,
            description: document.getElementById('projectDescription').value,
            workflowType: workflowType,
            workflow: workflow,
            assignedRoles: selectedRoles,
            status: 'active',
            currentStage: 1,
            artifacts: [],
            createdAt: new Date().toISOString()
        };
        
        projects.push(project);
        localStorage.setItem('virtualCompanyProjects', JSON.stringify(projects));
        
        renderProjects();
        
        // Reset form and close modal
        addProjectForm.reset();
        addProjectModal.style.display = 'none';
        
        // Auto-open project detail
        showProjectDetail(project.id);
    });
}

// Render projects
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray-text);">
                <p style="font-size: 1.2em; margin-bottom: 20px;">No projects created yet. Click "New Project" to get started!</p>
                <p>Create projects with workflows to organize your AI team's collaborative work.</p>
            </div>
        `;
        return;
    }
    
    projectsGrid.innerHTML = projects.map(project => {
        const progress = (project.currentStage / project.workflow.stages.length) * 100;
        const statusColor = project.status === 'active' ? 'var(--success-color)' : 
                           project.status === 'completed' ? 'var(--primary-color)' : 
                           'var(--warning-color)';
        
        return `
            <div class="project-card" onclick="showProjectDetail('${project.id}')">
                <div class="project-card-header">
                    <h3>${project.name}</h3>
                    <span class="status-badge" style="background: ${statusColor}">${project.status}</span>
                </div>
                <p>${project.description || 'No description provided'}</p>
                <div class="project-meta">
                    <span>📋 ${project.workflow.name}</span>
                    <span>👥 ${project.assignedRoles.length} roles</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <p class="progress-text">Stage ${project.currentStage} of ${project.workflow.stages.length}</p>
            </div>
        `;
    }).join('');
}

// Show project detail
function showProjectDetail(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const detailContent = document.getElementById('projectDetailContent');
    
    detailContent.innerHTML = `
        <div class="project-detail">
            <div class="project-detail-header">
                <h2>${project.name}</h2>
                <button class="btn btn-danger" onclick="deleteProject('${project.id}')">Delete Project</button>
            </div>
            <p>${project.description}</p>
            
            <div class="workflow-visualization">
                <h3>Workflow: ${project.workflow.name}</h3>
                <div class="workflow-stages">
                    ${project.workflow.stages.map((stage, index) => {
                        const isComplete = index + 1 < project.currentStage;
                        const isCurrent = index + 1 === project.currentStage;
                        const stageClass = isComplete ? 'stage-complete' : isCurrent ? 'stage-current' : 'stage-pending';
                        
                        return `
                            <div class="workflow-stage ${stageClass}">
                                <div class="stage-number">${stage.id}</div>
                                <div class="stage-info">
                                    <h4>${stage.name}</h4>
                                    <p>👤 ${stage.role}</p>
                                    <p>📄 ${stage.output}</p>
                                </div>
                                ${isCurrent ? `
                                    <button class="btn btn-primary btn-small" onclick="executeStage('${project.id}', ${stage.id})">
                                        Execute Stage
                                    </button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <div class="project-artifacts">
                <h3>Generated Artifacts</h3>
                <div class="artifacts-list" id="artifacts-${project.id}">
                    ${project.artifacts.length === 0 ? 
                        '<p style="color: var(--gray-text);">No artifacts generated yet.</p>' :
                        project.artifacts.map(artifact => `
                            <div class="artifact-item">
                                <strong>${artifact.name}</strong>
                                <p>${artifact.content.substring(0, ARTIFACT_PREVIEW_LENGTH)}...</p>
                                <small>Generated by ${artifact.role} on ${new Date(artifact.createdAt).toLocaleString()}</small>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
            
            <div class="assigned-roles">
                <h3>Assigned Team</h3>
                <div class="roles-list">
                    ${project.assignedRoles.map(roleId => {
                        const role = roles.find(r => r.id === roleId);
                        return role ? `<span class="role-badge">${role.avatar} ${role.name}</span>` : '';
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    projectDetailModal.style.display = 'block';
}

// Execute workflow stage
async function executeStage(projectId, stageId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const stage = project.workflow.stages.find(s => s.id === stageId);
    if (!stage) return;
    
    // Find the role for this stage
    const stageRole = roles.find(r => r.name === stage.role);
    if (!stageRole) {
        alert(`Role "${stage.role}" not found. Please create this role first.`);
        return;
    }
    
    // Create a prompt for the AI based on the stage
    const prompt = `As ${stage.role}, execute the following task:
    
Task: ${stage.name}
Expected Output: ${stage.output}
Project: ${project.name}
Project Description: ${project.description}

Please provide a detailed ${stage.output} for this project.`;
    
    // Generate AI response
    const artifact = await generateStageArtifact(prompt, stageRole, stage);
    
    // Add artifact to project
    project.artifacts.push({
        id: Date.now().toString(),
        name: stage.output,
        stageId: stage.id,
        role: stageRole.name,
        content: artifact,
        createdAt: new Date().toISOString()
    });
    
    // Move to next stage
    if (project.currentStage === stageId) {
        project.currentStage = Math.min(stageId + 1, project.workflow.stages.length);
        
        if (project.currentStage > project.workflow.stages.length) {
            project.status = 'completed';
        }
    }
    
    // Save updates
    localStorage.setItem('virtualCompanyProjects', JSON.stringify(projects));
    
    // Refresh view
    renderProjects();
    showProjectDetail(projectId);
}

// Generate artifact for a workflow stage
async function generateStageArtifact(prompt, role, stage) {
    try {
        let response = '';
        
        // Check if AI API is configured
        if (aiConfig.apiKey && aiConfig.provider) {
            response = await callAIAPI(prompt, role);
        } else {
            // Fallback to template-based generation
            response = generateTemplateArtifact(stage, role);
        }
        
        return response;
    } catch (error) {
        console.error('Error generating artifact:', error);
        return generateTemplateArtifact(stage, role);
    }
}

// Generate template-based artifact
function generateTemplateArtifact(stage, role) {
    const templates = {
        'Product Requirements Document': `# Product Requirements Document

## Overview
[Product vision and objectives]

## User Stories
1. As a user, I want to... so that...
2. As a user, I want to... so that...

## Functional Requirements
- Requirement 1
- Requirement 2
- Requirement 3

## Non-Functional Requirements
- Performance: [specs]
- Security: [requirements]
- Scalability: [requirements]

## Success Metrics
- Metric 1
- Metric 2

## Timeline
- Phase 1: [duration]
- Phase 2: [duration]`,
        
        'System Architecture Document': `# System Architecture Document

## Architecture Overview
[High-level architecture description]

## Components
1. Frontend Layer
   - Technology: [stack]
   - Responsibilities: [list]

2. Backend Layer
   - Technology: [stack]
   - Responsibilities: [list]

3. Database Layer
   - Technology: [database]
   - Schema: [overview]

## API Design
- Endpoint 1: GET /api/...
- Endpoint 2: POST /api/...

## Data Flow
[Description of data flow]

## Security Considerations
- Authentication: [method]
- Authorization: [approach]
- Data encryption: [strategy]

## Scalability
[Scalability strategy]`,
        
        'Test Plan & Results': `# Test Plan & Results

## Test Strategy
[Overall testing approach]

## Test Cases
1. Test Case 1
   - Description: [what to test]
   - Steps: [test steps]
   - Expected Result: [expected outcome]

2. Test Case 2
   - Description: [what to test]
   - Steps: [test steps]
   - Expected Result: [expected outcome]

## Test Coverage
- Unit Tests: [coverage %]
- Integration Tests: [coverage %]
- E2E Tests: [coverage %]

## Results
- Tests Passed: X
- Tests Failed: Y
- Issues Found: Z

## Quality Assessment
[Overall quality assessment]`
    };
    
    return templates[stage.output] || `# ${stage.output}\n\n[Generated content for ${stage.output}]\n\nThis is a template artifact. Configure AI integration for dynamic generation.`;
}

// Delete project
function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('virtualCompanyProjects', JSON.stringify(projects));
        renderProjects();
        projectDetailModal.style.display = 'none';
    }
}

// ========== INITIALIZATION ==========

// Initialize on page load
renderRoles();
updateChatRoleSelector();
renderChatMessages();
renderProjects();
initializeVoiceRecognition();
setupAIConfigHandlers();

// Add some default roles if none exist
if (roles.length === 0) {
    const defaultRoles = [
        {
            id: 'role-1',
            name: 'Product Manager',
            avatar: '👨‍💼',
            description: 'Defines product vision, requirements, and roadmap',
            aiInstructions: 'You are a Product Manager. Your role is to:\n- Define product vision and strategy\n- Write clear Product Requirements Documents (PRDs)\n- Conduct competitive analysis\n- Prioritize features based on business value\n- Ensure alignment with user needs and business goals\nProvide structured, actionable insights with clear priorities.',
            capabilities: ['write_prd', 'analyze_requirements', 'prioritize_features']
        },
        {
            id: 'role-2',
            name: 'Architect',
            avatar: '🏗️',
            description: 'Designs system architecture and technical solutions',
            aiInstructions: 'You are a Software Architect. Your role is to:\n- Design scalable system architectures\n- Create technical specifications and diagrams\n- Make technology stack decisions\n- Define API contracts and data models\n- Ensure security and performance requirements are met\nProvide detailed technical designs with rationale.',
            capabilities: ['design_architecture', 'create_diagrams', 'technical_specs']
        },
        {
            id: 'role-3',
            name: 'Lead Developer',
            avatar: '👩‍💻',
            description: 'Implements features and writes high-quality code',
            aiInstructions: 'You are a Lead Developer. Your role is to:\n- Write clean, maintainable code\n- Implement features according to specifications\n- Conduct code reviews\n- Debug and optimize performance\n- Follow best practices and coding standards\nProvide code solutions with explanations and best practices.',
            capabilities: ['write_code', 'code_review', 'debug']
        },
        {
            id: 'role-4',
            name: 'QA Engineer',
            avatar: '👨‍🔬',
            description: 'Ensures quality through testing and validation',
            aiInstructions: 'You are a QA Engineer. Your role is to:\n- Create comprehensive test plans\n- Write test cases and scenarios\n- Identify bugs and edge cases\n- Validate requirements are met\n- Ensure quality standards\nProvide thorough test coverage and quality assessments.',
            capabilities: ['write_tests', 'bug_reports', 'quality_assurance']
        },
        {
            id: 'role-5',
            name: 'Project Manager',
            avatar: '📊',
            description: 'Coordinates team and manages project execution',
            aiInstructions: 'You are a Project Manager. Your role is to:\n- Create project plans and timelines\n- Coordinate team activities\n- Track progress and milestones\n- Manage risks and dependencies\n- Ensure timely delivery\nProvide clear action items with deadlines and ownership.',
            capabilities: ['project_planning', 'task_management', 'coordination']
        },
        {
            id: 'role-6',
            name: 'Researcher',
            avatar: '🔍',
            description: 'Conducts research and provides data-driven insights',
            aiInstructions: 'You are a Researcher. Your role is to:\n- Conduct market and user research\n- Analyze data and trends\n- Provide evidence-based recommendations\n- Create research reports\n- Validate assumptions\nProvide well-researched insights with citations and data.',
            capabilities: ['research', 'data_analysis', 'reporting']
        }
    ];
    
    roles = defaultRoles;
    localStorage.setItem('virtualCompanyRoles', JSON.stringify(roles));
    renderRoles();
    updateChatRoleSelector();
}

// ========== VOICE CAPABILITIES ==========

// Initialize speech recognition
function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatInput').value = transcript;
            isListening = false;
            updateVoiceButton();
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            updateVoiceButton();
        };
        
        recognition.onend = () => {
            isListening = false;
            updateVoiceButton();
        };
    }
}

// Text to speech
function speakText(text) {
    if (!synthesis) return;
    
    // Cancel any ongoing speech
    synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    synthesis.speak(utterance);
}

// Toggle voice input
function toggleVoiceInput() {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
    }
    
    if (isListening) {
        recognition.stop();
        isListening = false;
    } else {
        recognition.start();
        isListening = true;
    }
    
    updateVoiceButton();
}

// Update voice button appearance
function updateVoiceButton() {
    const voiceBtn = document.getElementById('voiceInputBtn');
    if (voiceBtn) {
        if (isListening) {
            voiceBtn.textContent = '🎤 Listening...';
            voiceBtn.classList.add('listening');
        } else {
            voiceBtn.textContent = '🎤 Voice';
            voiceBtn.classList.remove('listening');
        }
    }
}

// ========== AI CONFIGURATION ==========

// Setup AI configuration handlers
function setupAIConfigHandlers() {
    // OpenAI Connect
    const openaiConnectBtn = document.querySelector('.ai-model-card:nth-child(1) button');
    if (openaiConnectBtn) {
        openaiConnectBtn.addEventListener('click', () => {
            const apiKeyInput = document.querySelector('.ai-model-card:nth-child(1) input');
            const apiKey = apiKeyInput.value.trim();
            
            if (apiKey) {
                aiConfig.provider = 'openai';
                aiConfig.apiKey = apiKey;
                localStorage.setItem('virtualCompanyAIConfig', JSON.stringify(aiConfig));
                alert('OpenAI connected successfully! AI responses will now use GPT-3.5.');
                apiKeyInput.value = '';
            } else {
                alert('Please enter your OpenAI API key');
            }
        });
    }
    
    // Claude Connect
    const claudeConnectBtn = document.querySelector('.ai-model-card:nth-child(2) button');
    if (claudeConnectBtn) {
        claudeConnectBtn.addEventListener('click', () => {
            const apiKeyInput = document.querySelector('.ai-model-card:nth-child(2) input');
            const apiKey = apiKeyInput.value.trim();
            
            if (apiKey) {
                aiConfig.provider = 'claude';
                aiConfig.apiKey = apiKey;
                localStorage.setItem('virtualCompanyAIConfig', JSON.stringify(aiConfig));
                alert('Claude connected successfully! AI responses will now use Claude.');
                apiKeyInput.value = '';
            } else {
                alert('Please enter your Claude API key');
            }
        });
    }
    
    // Custom API Connect
    const customConnectBtn = document.querySelector('.ai-model-card:nth-child(3) button');
    if (customConnectBtn) {
        customConnectBtn.addEventListener('click', () => {
            const endpointInput = document.querySelector('.ai-model-card:nth-child(3) input');
            const endpoint = endpointInput.value.trim();
            
            if (endpoint) {
                aiConfig.provider = 'custom';
                aiConfig.endpoint = endpoint;
                localStorage.setItem('virtualCompanyAIConfig', JSON.stringify(aiConfig));
                alert('Custom API connected successfully!');
                endpointInput.value = '';
            } else {
                alert('Please enter your API endpoint');
            }
        });
    }
    
    // Toggle voice output
    const voiceToggle = document.getElementById('voiceToggle');
    if (voiceToggle) {
        voiceToggle.checked = aiConfig.voiceEnabled || false;
        voiceToggle.addEventListener('change', (e) => {
            aiConfig.voiceEnabled = e.target.checked;
            localStorage.setItem('virtualCompanyAIConfig', JSON.stringify(aiConfig));
        });
    }
}
