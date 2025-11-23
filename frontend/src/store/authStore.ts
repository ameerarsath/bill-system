import { create } from 'zustand';
import { authApi } from '../api/authApi';
import type { BackendUser, Role } from '../types/backend.types';

interface AuthState {
  user: BackendUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('jwt_token'),
  isAuthenticated: !!localStorage.getItem('jwt_token'),
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ username, password });

      // Store JWT token
      localStorage.setItem('jwt_token', response.token);

      // Get user details
      const user = await authApi.getCurrentUser();

      // Store user in localStorage for persistence
      localStorage.setItem('hotel_user', JSON.stringify({
        id: user.id.toString(),
        username: user.username,
        name: user.fullName,
        role: mapBackendRoleToFrontend(user.role),
        email: user.phone || '',
      }));

      set({
        user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('hotel_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadUser: async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser();
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('hotel_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
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
