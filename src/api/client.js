// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Client
class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
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
