// API Configuration
const API_CONFIG = {
    // Change this to your backend URL in production
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://your-backend-url.com',
    
    ENDPOINTS: {
        // Auth
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        
        // Roles
        ROLES: '/api/roles',
        
        // Messages
        MESSAGES: '/api/messages',
        
        // AI Config
        AI_CONFIG: '/api/ai-config',
        
        // Health
        HEALTH: '/api/health'
    }
};

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Helper function to get auth headers
function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

// API Client
const API = {
    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },
    
    // Auth methods
    auth: {
        async register(email, username, password, name) {
            return await API.request(API_CONFIG.ENDPOINTS.REGISTER, {
                method: 'POST',
                body: JSON.stringify({ email, username, password, name })
            });
        },
        
        async login(username, password) {
            return await API.request(API_CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
        },
        
        async logout() {
            return await API.request(API_CONFIG.ENDPOINTS.LOGOUT, {
                method: 'POST'
            });
        }
    },
    
    // Roles methods
    roles: {
        async getAll() {
            return await API.request(API_CONFIG.ENDPOINTS.ROLES);
        },
        
        async create(role) {
            return await API.request(API_CONFIG.ENDPOINTS.ROLES, {
                method: 'POST',
                body: JSON.stringify(role)
            });
        },
        
        async update(id, role) {
            return await API.request(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(role)
            });
        },
        
        async delete(id) {
            return await API.request(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
                method: 'DELETE'
            });
        }
    },
    
    // Messages methods
    messages: {
        async getAll() {
            return await API.request(API_CONFIG.ENDPOINTS.MESSAGES);
        },
        
        async create(message) {
            return await API.request(API_CONFIG.ENDPOINTS.MESSAGES, {
                method: 'POST',
                body: JSON.stringify(message)
            });
        },
        
        async clearAll() {
            return await API.request(API_CONFIG.ENDPOINTS.MESSAGES, {
                method: 'DELETE'
            });
        }
    },
    
    // AI Config methods
    aiConfig: {
        async get() {
            return await API.request(API_CONFIG.ENDPOINTS.AI_CONFIG);
        },
        
        async update(config) {
            return await API.request(API_CONFIG.ENDPOINTS.AI_CONFIG, {
                method: 'PUT',
                body: JSON.stringify(config)
            });
        }
    }
};
