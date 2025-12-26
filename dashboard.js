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

// Meeting History
let meetingHistory = JSON.parse(localStorage.getItem('virtualCompanyMeetingHistory') || '[]');

// Voice recognition and synthesis
let recognition = null;
let synthesis = window.speechSynthesis;
let isListening = false;

// Edit mode flag
let isEditMode = false;
let currentEditRoleId = null;

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
    
    const roleId = document.getElementById('editRoleId').value;
    const roleName = document.getElementById('roleName').value;
    const roleAvatar = document.getElementById('roleAvatar').value;
    const roleDescription = document.getElementById('roleDescription').value;
    const aiInstructions = document.getElementById('aiInstructions').value;
    
    if (isEditMode && roleId) {
        // Edit existing role
        const roleIndex = roles.findIndex(r => r.id === roleId);
        if (roleIndex !== -1) {
            roles[roleIndex] = {
                id: roleId,
                name: roleName,
                avatar: roleAvatar,
                description: roleDescription,
                aiInstructions: aiInstructions
            };
            showToast('Role updated successfully!', 'success');
        }
    } else {
        // Add new role
        const role = {
            id: Date.now().toString(),
            name: roleName,
            avatar: roleAvatar,
            description: roleDescription,
            aiInstructions: aiInstructions
        };
        roles.push(role);
        showToast('Role added successfully!', 'success');
    }
    
    localStorage.setItem('virtualCompanyRoles', JSON.stringify(roles));
    
    renderRoles();
    updateChatRoleSelector();
    
    // Reset form and close modal
    document.getElementById('addRoleForm').reset();
    document.getElementById('editRoleId').value = '';
    isEditMode = false;
    currentEditRoleId = null;
    document.getElementById('roleModalTitle').textContent = 'Add New Role';
    document.getElementById('roleSubmitBtn').textContent = 'Add Role';
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
        <div class="role-card fade-in">
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
                <button class="btn btn-secondary btn-small" onclick="deleteRole('${role.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Edit role
function editRole(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    
    isEditMode = true;
    currentEditRoleId = roleId;
    
    document.getElementById('editRoleId').value = role.id;
    document.getElementById('roleName').value = role.name;
    document.getElementById('roleAvatar').value = role.avatar;
    document.getElementById('roleDescription').value = role.description;
    document.getElementById('aiInstructions').value = role.aiInstructions;
    
    document.getElementById('roleModalTitle').textContent = 'Edit Role';
    document.getElementById('roleSubmitBtn').textContent = 'Update Role';
    
    addRoleModal.style.display = 'block';
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
        saveMeetingToHistory('Google Meet', meetLink);
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
        saveMeetingToHistory('Microsoft Teams', teamsLink);
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

// ========== ZOOM INTEGRATION ==========

// Zoom
document.getElementById('joinZoomBtn').addEventListener('click', () => {
    const zoomLink = document.getElementById('zoomLink').value.trim();
    if (zoomLink) {
        saveMeetingToHistory('Zoom', zoomLink);
        window.open(zoomLink, '_blank');
    } else {
        alert('Please enter a Zoom meeting link or ID');
    }
});

document.getElementById('createZoomBtn').addEventListener('click', () => {
    window.open('https://zoom.us/start/videomeeting', '_blank');
});

// Save meeting to history
function saveMeetingToHistory(platform, link) {
    const meeting = {
        id: Date.now().toString(),
        platform: platform,
        link: link,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    meetingHistory.unshift(meeting);
    
    // Keep only last 20 meetings
    if (meetingHistory.length > 20) {
        meetingHistory = meetingHistory.slice(0, 20);
    }
    
    localStorage.setItem('virtualCompanyMeetingHistory', JSON.stringify(meetingHistory));
}

// View meeting history
document.getElementById('viewMeetingHistoryBtn').addEventListener('click', () => {
    document.getElementById('meetingHistoryModal').style.display = 'block';
    renderMeetingHistory();
});

function closeMeetingHistory() {
    document.getElementById('meetingHistoryModal').style.display = 'none';
}

function renderMeetingHistory() {
    const historyList = document.getElementById('meetingHistoryList');
    
    if (meetingHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: var(--gray-text); padding: 20px;">No meeting history yet.</p>';
        return;
    }
    
    historyList.innerHTML = meetingHistory.map(meeting => `
        <div class="meeting-history-item">
            <div class="meeting-info">
                <h4>${meeting.platform} Meeting</h4>
                <p>${meeting.date} at ${meeting.time}</p>
                <p style="font-size: 0.8em; margin-top: 5px;">${meeting.link}</p>
            </div>
            <div class="meeting-actions">
                <button class="btn btn-primary btn-small" onclick="rejoinMeeting('${meeting.link}')">Rejoin</button>
                <button class="btn btn-secondary btn-small" onclick="deleteMeeting('${meeting.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function rejoinMeeting(link) {
    window.open(link, '_blank');
}

function deleteMeeting(id) {
    meetingHistory = meetingHistory.filter(m => m.id !== id);
    localStorage.setItem('virtualCompanyMeetingHistory', JSON.stringify(meetingHistory));
    renderMeetingHistory();
}

// ========== CHAT ENHANCEMENTS ==========

// Export chat
document.getElementById('exportChatBtn').addEventListener('click', () => {
    const chatData = JSON.stringify(chatMessages, null, 2);
    const blob = new Blob([chatData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `virtual-company-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Chat exported successfully!', 'success');
});

// Clear chat
document.getElementById('clearChatBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all chat messages? This cannot be undone.')) {
        chatMessages = [];
        localStorage.setItem('virtualCompanyChatMessages', JSON.stringify(chatMessages));
        renderChatMessages();
        showToast('Chat cleared successfully!', 'info');
    }
});

// Search chat (basic implementation)
document.getElementById('searchChatBtn').addEventListener('click', () => {
    const searchTerm = prompt('Enter search term:');
    if (searchTerm) {
        const results = chatMessages.filter(msg => 
            msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (results.length > 0) {
            alert(`Found ${results.length} message(s) containing "${searchTerm}"`);
        } else {
            alert(`No messages found containing "${searchTerm}"`);
        }
    }
});

// Emoji picker
function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    if (emojiPicker.style.display === 'none' || !emojiPicker.style.display) {
        emojiPicker.style.display = 'block';
        initializeEmojiPicker();
    } else {
        emojiPicker.style.display = 'none';
    }
}

function initializeEmojiPicker() {
    const emojiGrid = document.getElementById('emojiGrid');
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👏', '🙌', '👐', '🤝', '🙏', '✨', '💡', '💯', '🔥', '⭐', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '⚡', '💪', '🧠', '❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎'];
    
    emojiGrid.innerHTML = emojis.map(emoji => 
        `<span onclick="insertEmoji('${emoji}')">${emoji}</span>`
    ).join('');
}

function insertEmoji(emoji) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value += emoji;
    chatInput.focus();
}

// Export roles
document.getElementById('exportRolesBtn').addEventListener('click', () => {
    const rolesData = JSON.stringify(roles, null, 2);
    const blob = new Blob([rolesData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `virtual-company-roles-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Roles exported successfully!', 'success');
});

// Import roles
document.getElementById('importRolesBtn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedRoles = JSON.parse(event.target.result);
                    if (Array.isArray(importedRoles)) {
                        roles = importedRoles;
                        localStorage.setItem('virtualCompanyRoles', JSON.stringify(roles));
                        renderRoles();
                        updateChatRoleSelector();
                        showToast('Roles imported successfully!', 'success');
                    } else {
                        showToast('Invalid roles file format', 'error');
                    }
                } catch (error) {
                    showToast('Error importing roles: ' + error.message, 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
});

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// ========== INITIALIZATION ==========

// Initialize on page load
renderRoles();
updateChatRoleSelector();
renderChatMessages();
initializeVoiceRecognition();
setupAIConfigHandlers();

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
