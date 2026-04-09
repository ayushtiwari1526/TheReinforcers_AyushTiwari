// ============================================
// API CONFIGURATION - CENTRALIZED
// ============================================
// This file handles local, Render, and Vercel deployment
// No need to change code - just update the config!

// Auto-detect environment
const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || 
                    hostname === '127.0.0.1' ||
                    hostname === '';
const isVercel = hostname.includes('vercel.app') || 
                 hostname.includes('now.sh') ||
                 process.env.PLATFORM === 'vercel';
const isRender = hostname.includes('onrender.com');

// API URLs - Change these for cloud deployment
const API_CONFIG = {
    // Local Development
    local: {
        BACKEND_URL: 'http://localhost:8080/api',
        AI_SERVICE_URL: 'http://localhost:5000'
    },
    
    // Cloud Deployment (Update these after deploying)
    cloud: {
        // Replace with your actual deployed URLs
        BACKEND_URL: 'https://trading-signal-backend.onrender.com/api',
        AI_SERVICE_URL: 'https://trading-ai-service.onrender.com'
    },
    
    // Vercel Environment Variables (if deployed on Vercel)
    vercel: {
        BACKEND_URL: (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL) || 
                     'https://trading-signal-backend.onrender.com/api',
        AI_SERVICE_URL: (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_AI_SERVICE_URL) || 
                        'https://trading-ai-service.onrender.com'
    },
    
    // Current environment (auto-detected)
    get BACKEND_URL() {
        if (isLocalhost) return this.local.BACKEND_URL;
        if (isVercel) return this.vercel.BACKEND_URL;
        return this.cloud.BACKEND_URL;
    },
    
    get AI_SERVICE_URL() {
        if (isLocalhost) return this.local.AI_SERVICE_URL;
        if (isVercel) return this.vercel.AI_SERVICE_URL;
        return this.cloud.AI_SERVICE_URL;
    },
    
    // Helper to detect current environment
    get environment() {
        if (isLocalhost) return 'LOCAL (Development)';
        if (isVercel) return 'VERCEL (Production)';
        if (isRender) return 'RENDER (Production)';
        return 'CLOUD (Production)';
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}

// Log which environment is active
console.log(`🌍 Environment: ${API_CONFIG.environment}`);
console.log(`📡 Backend URL: ${API_CONFIG.BACKEND_URL}`);
console.log(`🤖 AI Service URL: ${API_CONFIG.AI_SERVICE_URL}`);
console.log(`🔗 Full Backend Health: ${API_CONFIG.BACKEND_URL.replace('/api', '/api/health')}`);

// Make globally available
window.API_CONFIG = API_CONFIG;
