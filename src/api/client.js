// API Configuration with multiple fallbacks
const getApiUrl = () => {
  // Check environment variable first
  if (import.meta.env.VITE_API_URL) {
    console.log('📍 Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
    // Production - use environment variable or fallback
  if (window.location.hostname.includes('ondigitalocean.app') || 
      window.location.hostname.includes('netlify.app') ||
      window.location.hostname.includes('vercel.app')) {
    
    // Priority: environment variable (set during build)
    const envUrl = 'https://tellyousomeday-backend-xxxxx.ondigitalocean.app/api';
    console.log('🌐 Using production backend URL:', envUrl);
    return envUrl;
  }
  
  // Final fallback
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiUrl();

console.log('🔧 Final API Configuration:', {
  API_BASE_URL,
  currentOrigin: window.location.origin,
  currentHostname: window.location.hostname,
  env: import.meta.env.MODE
});

// API Client
class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      baseURL: this.baseURL
    });
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API Error Response:', data);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ API Success:', data);
      return data;
    } catch (error) {
      console.error('💥 API request failed:', {
        error: error.message,
        url,
        endpoint,
        baseURL: this.baseURL
      });
      throw error;
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

const apiClient = new APIClient();

// Message API functions
export const messageAPI = {
  // Create a new message
  async createMessage(messageData) {
    return apiClient.post('/messages', messageData);
  },

  // Search messages by sender name
  async searchMessages(senderName) {
    return apiClient.get(`/messages/search/${encodeURIComponent(senderName)}`);
  },

  // Read a specific message (with password if needed)
  async readMessage(messageId, password = null) {
    return apiClient.post(`/messages/read/${messageId}`, { password });
  },

  // Get statistics
  async getStats() {
    return apiClient.get('/messages/stats');
  },

  // Health check
  async healthCheck() {
    return apiClient.get('/health');
  }
};

export default apiClient;
