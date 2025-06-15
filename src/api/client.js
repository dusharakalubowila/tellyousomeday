// API Configuration
// Try to use backend service directly if routing doesn't work
const getApiUrl = () => {
  // In production, if we're on DigitalOcean, try to use the backend service directly
  if (window.location.hostname.includes('ondigitalocean.app')) {
    // Try different potential backend URLs
    const possibleUrls = [
      'https://tellyousomeday-5r77f.ondigitalocean.app/api',
      'https://backend-tellyousomeday-5r77f.ondigitalocean.app/api',
      'https://tellyousomeday-backend-5r77f.ondigitalocean.app/api'
    ];
    // For now, let's try the main one and see what happens
    return possibleUrls[0];
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiUrl();

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  origin: window.location.origin,
  hostname: window.location.hostname
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
