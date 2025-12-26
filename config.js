// Configuration for Virtual Company
// Toggle between localStorage (client-only) and backend API modes

const CONFIG = {
    // Set to 'backend' to use the backend API, or 'localStorage' for client-only mode
    mode: 'localStorage', // Change this to 'backend' when backend is running
    
    // Backend API URL (only used when mode is 'backend')
    apiBaseUrl: 'http://localhost:5000/api',
    
    // Feature flags
    features: {
        realTimeChat: false, // Enable when WebSocket is implemented
        aiIntegration: true,
        videoCall: true
    }
};

// Export configuration
window.CONFIG = CONFIG;
