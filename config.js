// Configuration for Virtual Company
// Allows switching between backend API and localStorage modes

const VirtualCompanyConfig = {
    // Set to 'api' to use backend server, or 'localStorage' for client-side only
    storageMode: 'localStorage', // Change to 'api' when backend is available
    
    // API configuration (only used when storageMode is 'api')
    apiBaseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://your-production-api-url.com/api',
    
    // Feature flags
    features: {
        backendAuth: false, // Set to true when using backend
        persistentStorage: true,
        aiProxy: false, // Set to true to use backend AI proxy (hides API keys)
    },
    
    // Auto-detect if backend is available
    async detectBackend() {
        if (this.storageMode === 'localStorage') {
            return false;
        }
        
        try {
            const response = await fetch(`${this.apiBaseURL}/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✓ Backend detected:', data);
                this.features.backendAuth = true;
                this.features.aiProxy = true;
                return true;
            }
        } catch (error) {
            console.log('⚠ Backend not available, using localStorage mode');
        }
        
        this.storageMode = 'localStorage';
        this.features.backendAuth = false;
        this.features.aiProxy = false;
        return false;
    },
    
    // Initialize configuration
    async init() {
        console.log('🚀 Initializing Virtual Company...');
        console.log('Storage Mode:', this.storageMode);
        
        if (this.storageMode === 'api') {
            await this.detectBackend();
        }
        
        console.log('Configuration:', {
            storageMode: this.storageMode,
            features: this.features
        });
        
        return this;
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VirtualCompanyConfig;
}
