import { create } from 'zustand';
import { authApi } from '../api/authApi';
import type { BackendUser, Role } from '../types/backend.types';
import {
  getToken,
  setToken,
  clearAuthStorage,
  getStoredUser,
  setStoredUser,
  hasToken,
} from '../utils/tokenStorage';

interface AuthState {
  user: BackendUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // NEW: Track if auth state has been initialized
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  initializeAuth: () => Promise<void>; // NEW: Initialize auth from storage
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: getToken(),
  isAuthenticated: hasToken(),
  isLoading: false,
  isInitialized: false, // Start as not initialized
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ username, password });

      // Store JWT token using utility
      setToken(response.token);

      // Get user details
      const user = await authApi.getCurrentUser();

      // Store user in localStorage for persistence
      setStoredUser({
        id: user.id.toString(),
        username: user.username,
        name: user.fullName,
        role: mapBackendRoleToFrontend(user.role),
        email: user.phone || '',
      });

      set({
        user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } catch (error: any) {
      // Enhanced error handling with specific error types
      let errorMessage = 'Login failed. Please try again.';
      let errorCode = 'UNKNOWN_ERROR';

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
        errorCode = 'TIMEOUT_ERROR';
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
        errorCode = 'NETWORK_ERROR';
      } else if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 400:
            errorMessage = data?.message || 'Invalid request. Please check your credentials.';
            errorCode = 'INVALID_REQUEST';
            break;
          case 401:
            errorMessage = data?.message || 'Invalid username or password.';
            errorCode = 'INVALID_CREDENTIALS';
            break;
          case 403:
            errorMessage = data?.message || 'Access denied. Your account may be locked.';
            errorCode = 'ACCESS_DENIED';
            break;
          case 404:
            errorMessage = 'Authentication service not found. Please contact support.';
            errorCode = 'SERVICE_NOT_FOUND';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again later.';
            errorCode = 'RATE_LIMIT_EXCEEDED';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server error. Please try again in a few moments.';
            errorCode = 'SERVER_ERROR';
            break;
          default:
            errorMessage = data?.message || `Unexpected error (${status}). Please try again.`;
            errorCode = 'UNKNOWN_ERROR';
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'No response from server. Please check your connection.';
        errorCode = 'NO_RESPONSE';
      }

      // Log error for debugging (in development)
      if (import.meta.env.DEV) {
        console.error('Login error:', {
          code: errorCode,
          message: errorMessage,
          originalError: error,
          response: error.response?.data,
          status: error.response?.status,
        });
      }

      set({
        error: errorMessage,
        isLoading: false,
      });

      // Throw enhanced error with code
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).code = errorCode;
      (enhancedError as any).originalError = error;
      throw enhancedError;
    }
  },

  logout: () => {
    // Clear all auth data using utility
    clearAuthStorage();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: true,
      error: null,
    });
  },

  loadUser: async () => {
    const token = getToken();
    if (!token) {
      set({ isAuthenticated: false, isInitialized: true });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser();

      // Update stored user data
      setStoredUser({
        id: user.id.toString(),
        username: user.username,
        name: user.fullName,
        role: mapBackendRoleToFrontend(user.role),
        email: user.phone || '',
      });

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } catch (error) {
      // Token invalid or expired
      clearAuthStorage();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  // NEW: Initialize auth state from storage on app load
  initializeAuth: async () => {
    const token = getToken();

    if (!token) {
      // No token, mark as initialized but not authenticated
      set({
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
      return;
    }

    // Try to restore user from storage first (fast)
    const storedUser = getStoredUser();

    if (storedUser) {
      // We have both token and user in storage - restore immediately
      set({
        user: storedUser,
        token,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });

      // Optionally: validate token in background and update if needed
      // This prevents blocking the UI
      try {
        const freshUser = await authApi.getCurrentUser();
        set({ user: freshUser });
        setStoredUser({
          id: freshUser.id.toString(),
          username: freshUser.username,
          name: freshUser.fullName,
          role: mapBackendRoleToFrontend(freshUser.role),
          email: freshUser.phone || '',
        });
      } catch (error) {
        // Token is invalid, clear everything
        clearAuthStorage();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      }
    } else {
      // We have token but no user - need to fetch
      await get().loadUser();
    }
  },

  clearError: () => set({ error: null }),
}));

// Map backend roles to frontend roles
function mapBackendRoleToFrontend(backendRole: Role): 'admin' | 'waiter' | 'kitchen' | 'cashier' {
  const roleMap: Record<Role, 'admin' | 'waiter' | 'kitchen' | 'cashier'> = {
    'ADMIN': 'admin',
    'SERVANT': 'waiter',
    'KITCHEN': 'kitchen',
    'CASHIER': 'cashier',
  };
  return roleMap[backendRole] || 'waiter';
}
