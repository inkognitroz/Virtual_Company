// Dashboard JavaScript

// ========== UTILITY FUNCTIONS ==========

// Safe localStorage wrapper with error handling
function saveToLocalStorage(key, value) {
    try {
        const jsonString = JSON.stringify(value);
        localStorage.setItem(key, jsonString);
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            alert('Storage quota exceeded. Please export your data and clear old messages.');
        } else {
            console.error('Error saving to localStorage:', error);
            alert('Failed to save data. Please try again.');
        }
        return false;
    }
}

// Safe localStorage getter
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Validate and sanitize text input
function sanitizeInput(input, maxLength = 1000) {
    if (!input || typeof input !== 'string') return '';
    return sanitizeHTML(input.trim().substring(0, maxLength));
}

// Check if user is logged in
const currentUser = getFromLocalStorage('virtualCompanyUser');
if (!currentUser) {
    window.location.href = 'index.html';
}

// Display user info
document.getElementById('userName').textContent = currentUser.name || currentUser.username;

// Initialize roles from localStorage
let roles = getFromLocalStorage('virtualCompanyRoles', []);

// Initialize chat messages
let chatMessages = getFromLocalStorage('virtualCompanyChatMessages', []);

// AI Configuration
let aiConfig = getFromLocalStorage('virtualCompanyAIConfig', {});

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
    
    // Get and sanitize inputs
    const roleName = sanitizeInput(document.getElementById('roleName').value, 100);
    const roleAvatar = document.getElementById('roleAvatar').value;
    const roleDescription = sanitizeInput(document.getElementById('roleDescription').value, 500);
    const aiInstructions = sanitizeInput(document.getElementById('aiInstructions').value, 2000);
    
    // Validation
    if (!roleName) {
        alert('Please enter a role name.');
        return;
    }
    
    const role = {
        id: Date.now().toString(),
        name: roleName,
        avatar: roleAvatar,
        description: roleDescription,
        aiInstructions: aiInstructions
    };
    
    roles.push(role);
    if (!saveToLocalStorage('virtualCompanyRoles', roles)) {
        // Rollback on save failure
        roles.pop();
        return;
    }
    
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
    
    rolesGrid.innerHTML = roles.map(role => {
        const safeName = sanitizeHTML(role.name);
        const safeDescription = sanitizeHTML(role.description || 'No description provided');
        const safeInstructions = sanitizeHTML(role.aiInstructions || '');
        
        return `
        <div class="role-card">
            <div class="role-card-header">
                <div class="role-avatar">${role.avatar}</div>
                <div>
                    <h3>${safeName}</h3>
                </div>
            </div>
            <p>${safeDescription}</p>
            ${safeInstructions ? `
                <div class="ai-instructions">
                    <strong>AI Instructions:</strong><br>
                    ${safeInstructions}
                </div>
            ` : ''}
            <div class="role-actions">
                <button class="btn btn-secondary btn-small" onclick="deleteRole('${role.id}')">Delete</button>
            </div>
        </div>
    `;
    }).join('');
}

// Delete role
// eslint-disable-next-line no-unused-vars
function deleteRole(roleId) {
    if (confirm('Are you sure you want to delete this role?')) {
        roles = roles.filter(r => r.id !== roleId);
        saveToLocalStorage('virtualCompanyRoles', roles);
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
        const safeSenderName = sanitizeHTML(msg.senderName);
        const safeContent = sanitizeHTML(msg.content);
        const safeTime = sanitizeHTML(msg.time);
        
        messagesHTML += `
            <div class="message ${messageClass}">
                <div class="message-header">
                    <span class="message-avatar">${msg.avatar}</span>
                    <span>${safeSenderName}</span>
                    <span style="margin-left: auto; font-size: 0.8em; font-weight: normal;">${safeTime}</span>
                </div>
                <div class="message-content">${safeContent}</div>
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
    const content = sanitizeInput(chatInput.value, 5000);
    
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
        if (!role) return;
        
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
    if (!saveToLocalStorage('virtualCompanyChatMessages', chatMessages)) {
        // Rollback on save failure
        chatMessages.pop();
        return;
    }
    
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
        saveToLocalStorage('virtualCompanyChatMessages', chatMessages);
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

// Initialize on page load
function initializeApp() {
    renderRoles();
    updateChatRoleSelector();
    renderChatMessages();
    initializeVoiceRecognition();
    setupAIConfigHandlers();
    setupExportImportHandlers();
    
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
        saveToLocalStorage('virtualCompanyRoles', roles);
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

// Toggle voice input
// eslint-disable-next-line no-unused-vars
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
                saveToLocalStorage('virtualCompanyAIConfig', aiConfig);
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
                saveToLocalStorage('virtualCompanyAIConfig', aiConfig);
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
                saveToLocalStorage('virtualCompanyAIConfig', aiConfig);
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
            saveToLocalStorage('virtualCompanyAIConfig', aiConfig);
        });
    }
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
                saveToLocalStorage('virtualCompanyRoles', roles);
                importedCount += newRoles.length;
                renderRoles();
                updateChatRoleSelector();
            }
            
            // Import chat messages if present
            if (importedData.chatMessages && Array.isArray(importedData.chatMessages)) {
                chatMessages.push(...importedData.chatMessages);
                saveToLocalStorage('virtualCompanyChatMessages', chatMessages);
                renderChatMessages();
            }
            
            // Import AI config if present
            if (importedData.aiConfig) {
                aiConfig = { ...aiConfig, ...importedData.aiConfig };
                saveToLocalStorage('virtualCompanyAIConfig', aiConfig);
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
            
            saveToLocalStorage('virtualCompanyRoles', roles);
            saveToLocalStorage('virtualCompanyChatMessages', chatMessages);
            saveToLocalStorage('virtualCompanyAIConfig', aiConfig);
            
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
        saveToLocalStorage('virtualCompanyChatMessages', chatMessages);
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
