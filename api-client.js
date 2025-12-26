// API Configuration for Virtual Company
// This file provides helper functions to interact with the backend API

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://your-production-api-url.com/api'; // Update with your production API URL

class APIClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('virtualCompanyToken');
    }

    // Helper method to make authenticated requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add auth token if available
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Set auth token
    setToken(token) {
        this.token = token;
        localStorage.setItem('virtualCompanyToken', token);
    }

    // Clear auth token
    clearToken() {
        this.token = null;
        localStorage.removeItem('virtualCompanyToken');
    }

    // Auth endpoints
    async register(email, username, password, name) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, username, password, name })
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    async login(username, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    // User endpoints
    async getCurrentUser() {
        return await this.request('/users/me');
    }

    async updateProfile(name) {
        return await this.request('/users/me', {
            method: 'PUT',
            body: JSON.stringify({ name })
        });
    }

    // Role endpoints
    async getRoles() {
        return await this.request('/roles');
    }

    async createRole(role) {
        return await this.request('/roles', {
            method: 'POST',
            body: JSON.stringify(role)
        });
    }

    async getRole(id) {
        return await this.request(`/roles/${id}`);
    }

    async updateRole(id, role) {
        return await this.request(`/roles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(role)
        });
    }

    async deleteRole(id) {
        return await this.request(`/roles/${id}`, {
            method: 'DELETE'
        });
    }

    // Message endpoints
    async getMessages(limit = 100, skip = 0) {
        return await this.request(`/messages?limit=${limit}&skip=${skip}`);
    }

    async createMessage(message) {
        return await this.request('/messages', {
            method: 'POST',
            body: JSON.stringify(message)
        });
    }

    async deleteMessage(id) {
        return await this.request(`/messages/${id}`, {
            method: 'DELETE'
        });
    }

    async clearMessages() {
        return await this.request('/messages', {
            method: 'DELETE'
        });
    }

    // AI endpoints
    async chat(message, provider, roleInstructions, endpoint) {
        return await this.request('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message, provider, roleInstructions, endpoint })
        });
    }

    // Health check
    async health() {
        return await this.request('/health');
    }
}

// Create a singleton instance
const apiClient = new APIClient();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = apiClient;
}
