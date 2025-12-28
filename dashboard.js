/**
 * Dashboard JavaScript - Virtual Company Application
 * 
 * Main application logic for the dashboard including:
 * - Role management (create, delete, edit)
 * - Chat functionality with AI integration
 * - Video call integrations
 * - Data export/import
 * - Voice input/output
 * 
 * @file dashboard.js
 * @version 1.0.0
 */

// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('virtualCompanyUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Display user info
document.getElementById('userName').textContent = currentUser.name || currentUser.username;

/**
 * Safely get data from localStorage with error handling
 * @param {string} key - localStorage key
 * @param {*} defaultValue - Default value if key doesn't exist or parse fails
 * @returns {*} Parsed data or default value
 */
function safeGetLocalStorage(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

/**
 * Safely set data to localStorage with error handling
 * @param {string} key - localStorage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
function safeSetLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
        if (error.name === 'QuotaExceededError') {
            alert('Storage quota exceeded. Please export your data and clear some old messages.');
        }
        return false;
    }
}

// Initialize roles from localStorage
let roles = safeGetLocalStorage('virtualCompanyRoles', []);

// Role search state
let roleSearchQuery = '';

// Initialize chat messages
let chatMessages = safeGetLocalStorage('virtualCompanyChatMessages', []);

// Search state
let chatSearchQuery = '';

// AI Configuration
let aiConfig = safeGetLocalStorage('virtualCompanyAIConfig', {});

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
    
    const form = e.target;
    const isEditMode = form.dataset.editMode === 'true';
    const editId = form.dataset.editId;
    
    const roleData = {
        name: document.getElementById('roleName').value.trim(),
        avatar: document.getElementById('roleAvatar').value,
        description: document.getElementById('roleDescription').value.trim(),
        aiInstructions: document.getElementById('aiInstructions').value.trim()
    };
    
    // Validate input
    if (!roleData.name) {
        alert('Role name is required.');
        return;
    }
    
    if (isEditMode) {
        // Update existing role
        const roleIndex = roles.findIndex(r => r.id === editId);
        if (roleIndex !== -1) {
            roles[roleIndex] = {
                ...roles[roleIndex],
                ...roleData
            };
        }
        
        // Reset edit mode
        form.dataset.editMode = 'false';
        delete form.dataset.editId;
        form.querySelector('button[type="submit"]').textContent = 'Add Role';
    } else {
        // Add new role
        const role = {
            id: Date.now().toString(),
            ...roleData
        };
        roles.push(role);
    }
    
    safeSetLocalStorage('virtualCompanyRoles', roles);
    
    renderRoles();
    updateChatRoleSelector();
    
    // Reset form and close modal
    document.getElementById('addRoleForm').reset();
    addRoleModal.style.display = 'none';
});

/**
 * Render roles with optional search filtering
 */
function renderRoles() {
    const rolesGrid = document.getElementById('rolesGrid');
    
    // Filter roles based on search query
    const filteredRoles = roleSearchQuery
        ? roles.filter(role =>
            role.name.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
            (role.description && role.description.toLowerCase().includes(roleSearchQuery.toLowerCase())) ||
            (role.aiInstructions && role.aiInstructions.toLowerCase().includes(roleSearchQuery.toLowerCase()))
          )
        : roles;
    
    if (filteredRoles.length === 0 && !roleSearchQuery) {
        rolesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray-text);">
                <p style="font-size: 1.2em; margin-bottom: 20px;">No roles created yet. Click "Add Role" to get started!</p>
                <p>Create roles for your virtual company team members and define their AI instructions.</p>
            </div>
        `;
        return;
    }
    
    if (filteredRoles.length === 0 && roleSearchQuery) {
        rolesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray-text);">
                <p style="font-size: 1.2em; margin-bottom: 20px;">No roles found matching "${roleSearchQuery}"</p>
                <p>Showing 0 of ${roles.length} roles</p>
            </div>
        `;
        return;
    }
    
    rolesGrid.innerHTML = filteredRoles.map(role => `
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
                <button class="btn btn-secondary btn-small" onclick="editRole('${role.id}')">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="duplicateRole('${role.id}')">Duplicate</button>
                <button class="btn btn-secondary btn-small" onclick="deleteRole('${role.id}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Show search result count if searching
    if (roleSearchQuery) {
        const countDiv = document.createElement('div');
        countDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 10px; color: var(--gray-text); font-size: 0.9em;';
        countDiv.textContent = `Showing ${filteredRoles.length} of ${roles.length} roles`;
        rolesGrid.insertBefore(countDiv, rolesGrid.firstChild);
    }
}

/**
 * Delete a role by ID
 * @param {string} roleId - The ID of the role to delete
 */
function deleteRole(roleId) {
    if (confirm('Are you sure you want to delete this role?')) {
        roles = roles.filter(r => r.id !== roleId);
        safeSetLocalStorage('virtualCompanyRoles', roles);
        renderRoles();
        updateChatRoleSelector();
    }
}

// Expose deleteRole to global scope for onclick handlers
window.deleteRole = deleteRole;

/**
 * Edit an existing role
 * @param {string} roleId - The ID of the role to edit
 */
function editRole(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    
    // Populate the form with existing data
    document.getElementById('roleName').value = role.name;
    document.getElementById('roleAvatar').value = role.avatar;
    document.getElementById('roleDescription').value = role.description || '';
    document.getElementById('aiInstructions').value = role.aiInstructions || '';
    
    // Change form submit to update mode
    const form = document.getElementById('addRoleForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Role';
    form.dataset.editMode = 'true';
    form.dataset.editId = roleId;
    
    // Show modal
    addRoleModal.style.display = 'block';
}

// Expose editRole to global scope for onclick handlers
window.editRole = editRole;

/**
 * Duplicate an existing role
 * @param {string} roleId - The ID of the role to duplicate
 */
function duplicateRole(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    
    const newRole = {
        id: Date.now().toString(),
        name: role.name + ' (Copy)',
        avatar: role.avatar,
        description: role.description,
        aiInstructions: role.aiInstructions
    };
    
    roles.push(newRole);
    safeSetLocalStorage('virtualCompanyRoles', roles);
    renderRoles();
    updateChatRoleSelector();
}

// Expose duplicateRole to global scope for onclick handlers
window.duplicateRole = duplicateRole;

// ========== CHAT FUNCTIONALITY ==========

/**
 * Delete a message by index
 * @param {number} messageIndex - Index of message to delete
 */
function deleteMessage(messageIndex) {
    if (confirm('Delete this message?')) {
        chatMessages.splice(messageIndex, 1);
        safeSetLocalStorage('virtualCompanyChatMessages', chatMessages);
        renderChatMessages();
    }
}

// Expose deleteMessage to global scope
window.deleteMessage = deleteMessage;

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

/**
 * Render chat messages with optional search filtering
 */
function renderChatMessages() {
    const chatMessagesContainer = document.getElementById('chatMessages');
    
    // Filter messages based on search query
    const filteredMessages = chatSearchQuery 
        ? chatMessages.filter(msg => 
            msg.content.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
            msg.senderName.toLowerCase().includes(chatSearchQuery.toLowerCase())
          )
        : chatMessages;
    
    // Keep system message and add all chat messages
    let messagesHTML = `
        <div class="system-message">
            Welcome to the Virtual Company group chat. Start collaborating with your AI team!
            ${chatSearchQuery ? `<br><br>Showing ${filteredMessages.length} of ${chatMessages.length} messages matching "${chatSearchQuery}"` : ''}
        </div>
    `;
    
    filteredMessages.forEach((msg) => {
        const messageClass = msg.sender === 'user' ? 'user' : 'role';
        // Highlight search term if present
        let content = msg.content;
        if (chatSearchQuery) {
            const regex = new RegExp(`(${chatSearchQuery})`, 'gi');
            content = content.replace(regex, '<mark>$1</mark>');
        }
        
        // Find actual index in chatMessages array
        const actualIndex = chatMessages.indexOf(msg);
        
        messagesHTML += `
            <div class="message ${messageClass}">
                <div class="message-header">
                    <span class="message-avatar">${msg.avatar}</span>
                    <span>${msg.senderName}</span>
                    <span style="margin-left: auto; font-size: 0.8em; font-weight: normal;">${msg.time}</span>
                    <button class="btn-delete-message" onclick="deleteMessage(${actualIndex})" title="Delete message">🗑️</button>
                </div>
                <div class="message-content">${content}</div>
            </div>
        `;
    });
    
    chatMessagesContainer.innerHTML = messagesHTML;
    
    // Scroll to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

/**
 * Format timestamp with date if not today
 * @param {Date} date - Date to format
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(date) {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) {
        return timeString;
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
        return `Yesterday ${timeString}`;
    }
    
    return `${date.toLocaleDateString()} ${timeString}`;
}

// Chat form handling
document.getElementById('chatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const chatInput = document.getElementById('chatInput');
    const chatRole = document.getElementById('chatRole');
    const content = chatInput.value.trim();
    
    if (!content) return;
    
    const now = new Date();
    const timeString = formatTimestamp(now);
    
    let message;
    
    if (chatRole.value === 'user') {
        message = {
            sender: 'user',
            senderName: currentUser.name || currentUser.username,
            avatar: '👤',
            content: content,
            time: timeString,
            timestamp: now.toISOString()
        };
    } else {
        const role = roles.find(r => r.id === chatRole.value);
        message = {
            sender: 'role',
            senderName: role.name,
            avatar: role.avatar,
            content: content,
            time: timeString,
            timestamp: now.toISOString(),
            roleInstructions: role.aiInstructions
        };
    }
    
    chatMessages.push(message);
    safeSetLocalStorage('virtualCompanyChatMessages', chatMessages);
    
    renderChatMessages();
    chatInput.value = '';
    
    // If user sent a message, generate AI response
    if (chatRole.value === 'user' && roles.length > 0) {
        await generateAIResponse(content);
    }
});

/**
 * Generate AI Response
 * Enhanced with better error handling and user feedback
 */
async function generateAIResponse(userMessage) {
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Select a random AI role to respond or use configured AI
        const aiRoles = roles.filter(r => r.aiInstructions);
        if (aiRoles.length === 0) {
            removeTypingIndicator();
            return;
        }
        
        // Randomly select an AI role to respond (or could be based on context)
        const respondingRole = aiRoles[Math.floor(Math.random() * aiRoles.length)];
        
        let aiResponse = '';
        
        // Check if AI API is configured
        if (aiConfig.apiKey && aiConfig.provider) {
            // Call actual AI API
            try {
                aiResponse = await callAIAPI(userMessage, respondingRole);
            } catch (apiError) {
                console.error('AI API call failed:', apiError);
                // Fallback to simulated response
                aiResponse = generateSimulatedResponse(userMessage, respondingRole);
                aiResponse = '⚠️ API Error - Using simulated response:\n\n' + aiResponse;
            }
        } else {
            // Fallback to simulated response
            aiResponse = generateSimulatedResponse(userMessage, respondingRole);
        }
        
        // Add AI response to chat
        const now = new Date();
        const timeString = formatTimestamp(now);
        
        const aiMessage = {
            sender: 'ai',
            senderName: respondingRole.name,
            avatar: respondingRole.avatar,
            content: aiResponse,
            time: timeString,
            timestamp: now.toISOString(),
            isAI: true
        };
        
        // Remove typing indicator
        removeTypingIndicator();
        
        chatMessages.push(aiMessage);
        safeSetLocalStorage('virtualCompanyChatMessages', chatMessages);
        renderChatMessages();
        
        // Speak the response if voice is enabled
        if (aiConfig.voiceEnabled) {
            speakText(aiResponse);
        }
        
    } catch (error) {
        console.error('Error generating AI response:', error);
        removeTypingIndicator();
        
        // Show error message to user
        const errorMessage = {
            sender: 'system',
            senderName: 'System',
            avatar: '⚠️',
            content: 'Failed to generate AI response. Please try again or check your AI configuration.',
            time: formatTimestamp(new Date()),
            timestamp: new Date().toISOString()
        };
        chatMessages.push(errorMessage);
        safeSetLocalStorage('virtualCompanyChatMessages', chatMessages);
        renderChatMessages();
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
            'Great point! Let\'s break this down into actionable tasks. I\'ll create a timeline and assign responsibilities.',
            'I agree. We should prioritize this and allocate resources accordingly. Let me schedule a follow-up meeting.',
            'That\'s an important consideration. I\'ll add it to our project roadmap and track the progress.',
            'Excellent suggestion! This aligns well with our current sprint goals. Let\'s implement it in the next iteration.'
        ],
        'Lead Developer': [
            'From a technical perspective, we should consider scalability and maintainability here.',
            'I recommend we implement this using best practices and add proper test coverage.',
            'Good idea. We\'ll need to refactor some code, but it will improve our architecture significantly.',
            'Let\'s review the technical requirements and ensure we have the right dependencies in place.'
        ],
        'AI Assistant': [
            'I can help with that! Based on the context, here\'s what I suggest...',
            'Let me analyze this for you. The key considerations are...',
            'That\'s an interesting question. Here\'s my recommendation based on best practices...',
            'I\'ve processed your request. Here are the main points to consider...'
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

/**
 * Initialize the application
 */
function initializeApp() {
    renderRoles();
    updateChatRoleSelector();
    renderChatMessages();
    initializeVoiceRecognition();
    setupAIConfigHandlers();
    setupExportImportHandlers();
    setupChatSearch();
    setupRolesSearch();
    setupKeyboardShortcuts();
    
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
        safeSetLocalStorage('virtualCompanyRoles', roles);
        renderRoles();
        updateChatRoleSelector();
    }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready
    initializeApp();
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

/**
 * Toggle voice input on/off
 */
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

// Expose toggleVoiceInput to global scope for onclick handlers
window.toggleVoiceInput = toggleVoiceInput;

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

// ========== CHAT SEARCH ==========

/**
 * Setup roles search functionality
 */
function setupRolesSearch() {
    const searchInput = document.getElementById('rolesSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            roleSearchQuery = e.target.value.trim();
            renderRoles();
        });
    }
}

/**
 * Setup chat search functionality
 */
function setupChatSearch() {
    const searchInput = document.getElementById('chatSearch');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            chatSearchQuery = e.target.value.trim();
            renderChatMessages();
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            chatSearchQuery = '';
            if (searchInput) {
                searchInput.value = '';
            }
            renderChatMessages();
        });
    }
}

// ========== KEYBOARD SHORTCUTS ==========

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    const chatInput = document.getElementById('chatInput');
    
    // Ctrl/Cmd + Enter to send message
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const chatForm = document.getElementById('chatForm');
                if (chatForm) {
                    chatForm.dispatchEvent(new Event('submit'));
                }
            }
        });
    }
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + / to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            const searchInput = document.getElementById('chatSearch');
            if (searchInput && document.getElementById('chat-section').classList.contains('active')) {
                searchInput.focus();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('chatSearch');
            if (searchInput && searchInput.value) {
                chatSearchQuery = '';
                searchInput.value = '';
                renderChatMessages();
            }
        }
    });
}

// ========== EXPORT/IMPORT FUNCTIONALITY ==========

// Export all data
function exportAllData() {
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        roles: roles,
        chatMessages: chatMessages,
        aiConfig: aiConfig
    };
    
    downloadJSON(exportData, 'virtual-company-backup');
}

// Export roles only
function exportRoles() {
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        roles: roles
    };
    
    downloadJSON(exportData, 'virtual-company-roles');
}

// Export chats only
function exportChats() {
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        chatMessages: chatMessages
    };
    
    downloadJSON(exportData, 'virtual-company-chats');
}

// Helper function to download JSON
function downloadJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import data
function importData(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate the data
            if (!importedData.version) {
                alert('Invalid import file format.');
                return;
            }
            
            let importedCount = 0;
            
            // Import roles if present
            if (importedData.roles && Array.isArray(importedData.roles)) {
                const existingIds = roles.map(r => r.id);
                const newRoles = importedData.roles.filter(r => !existingIds.includes(r.id));
                roles.push(...newRoles);
                safeSetLocalStorage('virtualCompanyRoles', roles);
                importedCount += newRoles.length;
                renderRoles();
                updateChatRoleSelector();
            }
            
            // Import chat messages if present
            if (importedData.chatMessages && Array.isArray(importedData.chatMessages)) {
                chatMessages.push(...importedData.chatMessages);
                safeSetLocalStorage('virtualCompanyChatMessages', chatMessages);
                renderChatMessages();
            }
            
            // Import AI config if present
            if (importedData.aiConfig) {
                aiConfig = { ...aiConfig, ...importedData.aiConfig };
                localStorage.setItem('virtualCompanyAIConfig', JSON.stringify(aiConfig));
            }
            
            alert(`Import successful! ${importedCount > 0 ? importedCount + ' new role(s) added. ' : ''}Data has been merged with existing data.`);
            
        } catch (error) {
            console.error('Import error:', error);
            alert('Error importing file. Please make sure it\'s a valid Virtual Company export file.');
        }
    };
    
    reader.readAsText(file);
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone!\n\nThis will remove:\n- All roles\n- All chat messages\n- AI configuration\n\nPlease export your data first if you want to keep it.')) {
        if (confirm('Final confirmation: This will permanently delete all your Virtual Company data. Continue?')) {
            roles = [];
            chatMessages = [];
            aiConfig = {};
            
            safeSetLocalStorage('virtualCompanyRoles', roles);
            safeSetLocalStorage('virtualCompanyChatMessages', chatMessages);
            localStorage.setItem('virtualCompanyAIConfig', JSON.stringify(aiConfig));
            
            renderRoles();
            updateChatRoleSelector();
            renderChatMessages();
            
            alert('All data has been cleared.');
        }
    }
}

// Clear chats only
function clearChats() {
    if (confirm('Are you sure you want to clear all chat messages? This action cannot be undone!')) {
        chatMessages = [];
        safeSetLocalStorage('virtualCompanyChatMessages', chatMessages);
        renderChatMessages();
        alert('Chat history has been cleared.');
    }
}

// Setup export/import handlers
function setupExportImportHandlers() {
    // Export buttons
    const exportAllBtn = document.getElementById('exportAllBtn');
    if (exportAllBtn) {
        exportAllBtn.addEventListener('click', exportAllData);
    }
    
    const exportRolesBtn = document.getElementById('exportRolesBtn');
    if (exportRolesBtn) {
        exportRolesBtn.addEventListener('click', exportRoles);
    }
    
    const exportChatsBtn = document.getElementById('exportChatsBtn');
    if (exportChatsBtn) {
        exportChatsBtn.addEventListener('click', exportChats);
    }
    
    // Import button
    const importDataBtn = document.getElementById('importDataBtn');
    const importFileInput = document.getElementById('importFileInput');
    
    if (importDataBtn && importFileInput) {
        importDataBtn.addEventListener('click', () => {
            importFileInput.click();
        });
        
        importFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                importData(file);
                e.target.value = ''; // Reset file input
            }
        });
    }
    
    // Clear data buttons
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllData);
    }
    
    const clearChatsBtn = document.getElementById('clearChatsBtn');
    if (clearChatsBtn) {
        clearChatsBtn.addEventListener('click', clearChats);
    }
}
