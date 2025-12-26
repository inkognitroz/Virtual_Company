// API Configuration and Utilities

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('virtualCompanyUser') || '{}');
    return user.token || null;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
const authAPI = {
    register: async (userData) => {
        return await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    login: async (credentials) => {
        return await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    getMe: async () => {
        return await apiRequest('/auth/me');
    }
};

// Roles API
const rolesAPI = {
    getAll: async () => {
        return await apiRequest('/roles');
    },

    getOne: async (id) => {
        return await apiRequest(`/roles/${id}`);
    },

    create: async (roleData) => {
        return await apiRequest('/roles', {
            method: 'POST',
            body: JSON.stringify(roleData)
        });
    },

    update: async (id, roleData) => {
        return await apiRequest(`/roles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(roleData)
        });
    },

    delete: async (id) => {
        return await apiRequest(`/roles/${id}`, {
            method: 'DELETE'
        });
    }
};

// Messages API
const messagesAPI = {
    getAll: async () => {
        return await apiRequest('/messages');
    },

    create: async (messageData) => {
        return await apiRequest('/messages', {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
    },

    delete: async (id) => {
        return await apiRequest(`/messages/${id}`, {
            method: 'DELETE'
        });
    },

    deleteAll: async () => {
        return await apiRequest('/messages', {
            method: 'DELETE'
        });
    }
};

// Export API
window.API = {
    auth: authAPI,
    roles: rolesAPI,
    messages: messagesAPI
};
