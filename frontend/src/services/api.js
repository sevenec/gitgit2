import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// User Management APIs
export const userAPI = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  
  updateUser: async (userId, updateData) => {
    const response = await api.put(`/users/${userId}`, updateData);
    return response.data;
  },
  
  submitScore: async (userId, scoreData) => {
    const response = await api.post(`/users/${userId}/score`, scoreData);
    return response.data;
  },
  
  getLeaderboard: async (userId, limit = 50) => {
    const response = await api.get(`/users/${userId}/leaderboard?limit=${limit}`);
    return response.data;
  },
  
  unlockFlutterer: async (userId, fluttererId) => {
    const response = await api.post(`/users/${userId}/flutterer/unlock?flutterer_id=${fluttererId}`);
    return response.data;
  },
  
  getDailyChallenges: async (userId) => {
    const response = await api.get(`/users/${userId}/daily-challenges`);
    return response.data;
  }
};

// Game APIs
export const gameAPI = {
  getConfig: async () => {
    const response = await api.get('/game/config');
    return response.data;
  },
  
  getFlutterers: async () => {
    const response = await api.get('/game/flutterers');
    return response.data;
  },
  
  getEvents: async () => {
    const response = await api.get('/game/events');
    return response.data;
  },
  
  watchRewardedAd: async (userId, adType = 'coins') => {
    const response = await api.post(`/game/ad/rewarded?user_id=${userId}&ad_type=${adType}`);
    return response.data;
  },
  
  shareScore: async (userId, score, platform) => {
    const response = await api.post('/game/share-score', {
      user_id: userId,
      score,
      platform
    });
    return response.data;
  },
  
  verifyPurchase: async (purchaseData) => {
    const response = await api.post('/game/purchase/verify', purchaseData);
    return response.data;
  },
  
  trackAnalytics: async (analyticsData) => {
    const response = await api.post('/game/analytics', analyticsData);
    return response.data;
  }
};

// Helper functions
export const generateDeviceId = () => {
  return `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getCurrentPlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('android')) return 'android';
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
  return 'web';
};

// Local Storage helpers
export const storage = {
  getUser: () => {
    const userData = localStorage.getItem('butterfly_user');
    return userData ? JSON.parse(userData) : null;
  },
  
  setUser: (user) => {
    localStorage.setItem('butterfly_user', JSON.stringify(user));
  },
  
  removeUser: () => {
    localStorage.removeItem('butterfly_user');
  },
  
  getDeviceId: () => {
    let deviceId = localStorage.getItem('butterfly_device_id');
    if (!deviceId) {
      deviceId = generateDeviceId();
      localStorage.setItem('butterfly_device_id', deviceId);
    }
    return deviceId;
  }
};

export default api;