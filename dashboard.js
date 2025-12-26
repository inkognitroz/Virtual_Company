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
    
    // Get MCP context if available
    let mcpContext = '';
    if (mcpClient) {
        const context = await mcpClient.getContextForAI(role.aiInstructions, userMessage);
        mcpContext = context.contextString;
    }
    
    // Combine role instructions with MCP context
    const systemPrompt = role.aiInstructions + mcpContext;
    
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
                        { role: 'system', content: systemPrompt },
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
                        { role: 'user', content: `${systemPrompt}\n\n${userMessage}` }
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
                    instructions: systemPrompt
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

// Initialize MCP Client
let mcpClient = null;

// Initialize on page load
renderRoles();
updateChatRoleSelector();
renderChatMessages();
initializeVoiceRecognition();
setupAIConfigHandlers();
initializeMCP();

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

// ========== MCP SERVER MANAGEMENT ==========

// Initialize MCP
function initializeMCP() {
    if (typeof MCPClient === 'undefined') {
        console.warn('MCP Client not loaded');
        return;
    }
    
    mcpClient = new MCPClient();
    renderMCPServers();
    updateMCPToolsAndResources();
    setupMCPHandlers();
}

// Render MCP servers
function renderMCPServers() {
    if (!mcpClient) return;
    
    const mcpServersGrid = document.getElementById('mcpServersGrid');
    const servers = mcpClient.getServers();
    
    if (servers.length === 0) {
        mcpServersGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray-text);">
                <p style="font-size: 1.2em; margin-bottom: 20px;">No MCP servers configured yet.</p>
                <p>Click "Add Custom Server" to create your own MCP server integration.</p>
            </div>
        `;
        return;
    }
    
    mcpServersGrid.innerHTML = servers.map(server => {
        const isConnected = mcpClient.isConnected(server.id);
        const statusClass = server.enabled ? (isConnected ? 'connected' : 'connecting') : 'disabled';
        const statusText = server.enabled ? (isConnected ? 'Connected' : 'Connecting...') : 'Disabled';
        
        return `
            <div class="mcp-server-card ${statusClass}">
                <div class="mcp-server-header">
                    <h3>${server.name}</h3>
                    <span class="mcp-status ${statusClass}">${statusText}</span>
                </div>
                <p class="mcp-server-type">Type: ${server.type}</p>
                <p class="mcp-server-description">${server.description || 'No description provided'}</p>
                
                <div class="mcp-server-details">
                    <div class="mcp-detail-item">
                        <strong>Tools:</strong> ${server.tools.length}
                    </div>
                    <div class="mcp-detail-item">
                        <strong>Resources:</strong> ${server.resources.length}
                    </div>
                </div>
                
                <div class="mcp-server-tools-list">
                    <strong>Available Tools:</strong>
                    <div class="tool-tags">
                        ${server.tools.slice(0, 3).map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
                        ${server.tools.length > 3 ? `<span class="tool-tag">+${server.tools.length - 3} more</span>` : ''}
                    </div>
                </div>
                
                <div class="mcp-server-actions">
                    <label class="toggle-switch">
                        <input type="checkbox" ${server.enabled ? 'checked' : ''} 
                               onchange="toggleMCPServer('${server.id}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                    <button class="btn btn-small btn-secondary" onclick="configureMCPServer('${server.id}')">
                        ⚙️ Configure
                    </button>
                    ${!['filesystem', 'database', 'web-search', 'github', 'calendar'].includes(server.type) ? `
                        <button class="btn btn-small btn-danger" onclick="deleteMCPServer('${server.id}')">Delete</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Update MCP tools and resources display
function updateMCPToolsAndResources() {
    if (!mcpClient) return;
    
    const tools = mcpClient.getAvailableTools();
    const resources = mcpClient.getAvailableResources();
    
    const toolsList = document.getElementById('mcpToolsList');
    const resourcesList = document.getElementById('mcpResourcesList');
    
    if (tools.length === 0) {
        toolsList.innerHTML = '<p class="empty-state">No tools available. Enable MCP servers to add tools.</p>';
    } else {
        toolsList.innerHTML = tools.map(tool => `
            <div class="mcp-item">
                <span class="mcp-item-name">${tool.name}</span>
                <span class="mcp-item-server">${tool.server}</span>
            </div>
        `).join('');
    }
    
    if (resources.length === 0) {
        resourcesList.innerHTML = '<p class="empty-state">No resources available. Enable MCP servers to add resources.</p>';
    } else {
        resourcesList.innerHTML = resources.map(resource => `
            <div class="mcp-item">
                <span class="mcp-item-name">${resource.name}</span>
                <span class="mcp-item-server">${resource.server}</span>
            </div>
        `).join('');
    }
}

// Toggle MCP server
function toggleMCPServer(serverId, enabled) {
    if (!mcpClient) return;
    
    mcpClient.toggleServer(serverId, enabled);
    renderMCPServers();
    updateMCPToolsAndResources();
    
    const server = mcpClient.getServer(serverId);
    if (server) {
        const status = enabled ? 'enabled' : 'disabled';
        console.log(`MCP Server "${server.name}" ${status}`);
    }
}

// Configure MCP server
function configureMCPServer(serverId) {
    if (!mcpClient) return;
    
    const server = mcpClient.getServer(serverId);
    if (!server) return;
    
    const modal = document.getElementById('configureMCPServerModal');
    const content = document.getElementById('mcpServerConfigContent');
    
    // Build configuration form based on server type
    let configHTML = `
        <h3>${server.name} Configuration</h3>
        <form id="mcpServerConfigForm" onsubmit="saveMCPServerConfig(event, '${serverId}')">
    `;
    
    // Add configuration fields based on server type
    switch (server.type) {
        case 'filesystem':
            configHTML += `
                <div class="form-group">
                    <label>Allowed Paths (comma-separated)</label>
                    <input type="text" id="allowedPaths" value="${(server.config.allowedPaths || []).join(', ')}" placeholder="/documents, /projects">
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="readOnly" ${server.config.readOnly ? 'checked' : ''}>
                        Read-only mode
                    </label>
                </div>
            `;
            break;
        case 'database':
            configHTML += `
                <div class="form-group">
                    <label>Database Type</label>
                    <select id="dbType">
                        <option value="sqlite" ${server.config.type === 'sqlite' ? 'selected' : ''}>SQLite</option>
                        <option value="postgres" ${server.config.type === 'postgres' ? 'selected' : ''}>PostgreSQL</option>
                        <option value="mysql" ${server.config.type === 'mysql' ? 'selected' : ''}>MySQL</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Connection String</label>
                    <input type="text" id="connectionString" value="${server.config.connectionString}" placeholder="Database connection string">
                </div>
            `;
            break;
        case 'web-search':
            configHTML += `
                <div class="form-group">
                    <label>Search Provider</label>
                    <select id="provider">
                        <option value="google" ${server.config.provider === 'google' ? 'selected' : ''}>Google</option>
                        <option value="bing" ${server.config.provider === 'bing' ? 'selected' : ''}>Bing</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>API Key</label>
                    <input type="password" id="apiKey" value="${server.config.apiKey}" placeholder="API Key">
                </div>
            `;
            break;
        case 'github':
            configHTML += `
                <div class="form-group">
                    <label>GitHub API Token</label>
                    <input type="password" id="apiToken" value="${server.config.apiToken}" placeholder="GitHub Personal Access Token">
                </div>
                <div class="form-group">
                    <label>Default Repository</label>
                    <input type="text" id="defaultRepo" value="${server.config.defaultRepo}" placeholder="owner/repo">
                </div>
            `;
            break;
        case 'calendar':
            configHTML += `
                <div class="form-group">
                    <label>Calendar Provider</label>
                    <select id="provider">
                        <option value="google" ${server.config.provider === 'google' ? 'selected' : ''}>Google Calendar</option>
                        <option value="outlook" ${server.config.provider === 'outlook' ? 'selected' : ''}>Outlook</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>API Key</label>
                    <input type="password" id="apiKey" value="${server.config.apiKey}" placeholder="API Key">
                </div>
            `;
            break;
        default:
            configHTML += `
                <div class="form-group">
                    <label>Configuration (JSON)</label>
                    <textarea id="customConfig" rows="6">${JSON.stringify(server.config, null, 2)}</textarea>
                </div>
            `;
    }
    
    configHTML += `
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save Configuration</button>
                <button type="button" class="btn btn-secondary" onclick="closeConfigureMCPModal()">Cancel</button>
            </div>
        </form>
    `;
    
    content.innerHTML = configHTML;
    modal.style.display = 'block';
}

// Save MCP server configuration
function saveMCPServerConfig(event, serverId) {
    event.preventDefault();
    if (!mcpClient) return;
    
    const server = mcpClient.getServer(serverId);
    if (!server) return;
    
    const updates = { config: { ...server.config } };
    
    // Get configuration values based on server type
    switch (server.type) {
        case 'filesystem':
            const allowedPaths = document.getElementById('allowedPaths').value.split(',').map(p => p.trim());
            const readOnly = document.getElementById('readOnly').checked;
            updates.config = { allowedPaths, readOnly };
            break;
        case 'database':
            updates.config = {
                type: document.getElementById('dbType').value,
                connectionString: document.getElementById('connectionString').value
            };
            break;
        case 'web-search':
            updates.config = {
                provider: document.getElementById('provider').value,
                apiKey: document.getElementById('apiKey').value
            };
            break;
        case 'github':
            updates.config = {
                apiToken: document.getElementById('apiToken').value,
                defaultRepo: document.getElementById('defaultRepo').value
            };
            break;
        case 'calendar':
            updates.config = {
                provider: document.getElementById('provider').value,
                apiKey: document.getElementById('apiKey').value
            };
            break;
        default:
            try {
                updates.config = JSON.parse(document.getElementById('customConfig').value);
            } catch (e) {
                alert('Invalid JSON configuration');
                return;
            }
    }
    
    mcpClient.updateServer(serverId, updates);
    closeConfigureMCPModal();
    renderMCPServers();
    alert('Configuration saved successfully!');
}

// Delete MCP server
function deleteMCPServer(serverId) {
    if (!mcpClient) return;
    
    const server = mcpClient.getServer(serverId);
    if (!server) return;
    
    if (confirm(`Are you sure you want to delete the "${server.name}" MCP server?`)) {
        mcpClient.deleteServer(serverId);
        renderMCPServers();
        updateMCPToolsAndResources();
    }
}

// Close configure modal
function closeConfigureMCPModal() {
    document.getElementById('configureMCPServerModal').style.display = 'none';
}

// Setup MCP handlers
function setupMCPHandlers() {
    // Add custom server button
    const addMCPServerBtn = document.getElementById('addMCPServerBtn');
    if (addMCPServerBtn) {
        addMCPServerBtn.addEventListener('click', () => {
            document.getElementById('addMCPServerModal').style.display = 'block';
        });
    }
    
    // Close MCP modal
    const closeMCPModal = document.getElementById('closeMCPModal');
    if (closeMCPModal) {
        closeMCPModal.addEventListener('click', () => {
            document.getElementById('addMCPServerModal').style.display = 'none';
        });
    }
    
    // Close configure modal
    const closeConfigureMCPModal = document.getElementById('closeConfigureMCPModal');
    if (closeConfigureMCPModal) {
        closeConfigureMCPModal.addEventListener('click', () => {
            document.getElementById('configureMCPServerModal').style.display = 'none';
        });
    }
    
    // Add MCP server form
    const addMCPServerForm = document.getElementById('addMCPServerForm');
    if (addMCPServerForm) {
        addMCPServerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('mcpServerName').value;
            const type = document.getElementById('mcpServerType').value;
            const description = document.getElementById('mcpServerDescription').value;
            const tools = document.getElementById('mcpServerTools').value.split(',').map(t => t.trim()).filter(t => t);
            const resources = document.getElementById('mcpServerResources').value.split(',').map(r => r.trim()).filter(r => r);
            
            const serverConfig = {
                name,
                type,
                description,
                tools,
                resources,
                config: {}
            };
            
            mcpClient.addServer(serverConfig);
            renderMCPServers();
            updateMCPToolsAndResources();
            
            // Reset form and close modal
            addMCPServerForm.reset();
            document.getElementById('addMCPServerModal').style.display = 'none';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        const addModal = document.getElementById('addMCPServerModal');
        const configModal = document.getElementById('configureMCPServerModal');
        
        if (e.target === addModal) {
            addModal.style.display = 'none';
        }
        if (e.target === configModal) {
            configModal.style.display = 'none';
        }
    });
}

// Make functions globally available
window.toggleMCPServer = toggleMCPServer;
window.configureMCPServer = configureMCPServer;
window.deleteMCPServer = deleteMCPServer;
window.saveMCPServerConfig = saveMCPServerConfig;
window.closeConfigureMCPModal = closeConfigureMCPModal;
