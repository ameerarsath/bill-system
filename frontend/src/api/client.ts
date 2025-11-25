import axios from 'axios';
import { getToken, clearAuthStorage } from '../utils/tokenStorage';

// API base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with enhanced configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for requests
  timeoutErrorMessage: 'Request timeout. Please try again.',
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Use centralized token getter
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error handling with detailed logging
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized (except for login endpoint)
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      // Token expired or invalid - clear auth and redirect to login
      clearAuthStorage();

      // Show user-friendly message
      if (window.location.pathname !== '/login') {
        // Store intended destination for redirect after login
        sessionStorage.setItem('redirect_after_login', window.location.pathname);
        window.location.href = '/login?session=expired';
      }
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check your internet connection.';
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. The server is taking too long to respond.';
    }

    // Handle server errors (500+)
    if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
