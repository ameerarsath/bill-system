import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import type { User, LoginCredentials, AuthState } from '../types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isInitialized: boolean; // NEW: Track initialization state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authStore = useAuthStore();

  // Initialize auth state from storage on mount
  useEffect(() => {
    authStore.initializeAuth();
  }, [authStore.initializeAuth]);

  // Map backend user to frontend User type
  const getMappedUser = (): User | null => {
    if (!authStore.user) return null;

    // Map backend role to frontend role
    const roleMap: Record<string, 'admin' | 'waiter' | 'kitchen' | 'cashier'> = {
      'ADMIN': 'admin',
      'SERVANT': 'waiter',
      'KITCHEN': 'kitchen',
      'CASHIER': 'cashier',
    };

    return {
      id: authStore.user.id.toString(),
      username: authStore.user.username,
      name: authStore.user.fullName,
      role: roleMap[authStore.user.role] || 'waiter',
      email: authStore.user.phone || '',
    };
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      await authStore.login(credentials.identifier, credentials.password);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    authStore.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user: getMappedUser(),
        isAuthenticated: authStore.isAuthenticated,
        isInitialized: authStore.isInitialized,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export credentials for display on login page (backend demo users)
export const getLoginHints = () => ({
  admin: { username: 'admin', password: 'admin123', label: 'Hotel Owner / Admin' },
  waiter: { username: 'servant1', password: 'servant123', label: 'Waiter / Servant' },
  kitchen: { username: 'kitchen1', password: 'kitchen123', label: 'Kitchen / Chef' },
  cashier: { username: 'cashier1', password: 'cashier123', label: 'Cashier' },
});
