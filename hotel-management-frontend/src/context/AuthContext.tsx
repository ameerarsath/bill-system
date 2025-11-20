import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginCredentials, AuthState } from '../types/auth.types';

// Hardcoded credentials for each role
const CREDENTIALS = {
  admin: {
    username: 'admin',
    password: 'admin123',
    user: {
      id: 'admin-001',
      username: 'admin',
      name: 'Hotel Owner',
      role: 'admin' as const,
      email: 'owner@hotel.com',
    },
  },
  waiter: {
    username: 'waiter',
    password: 'waiter123',
    user: {
      id: 'waiter-001',
      username: 'waiter',
      name: 'Rahul Sharma',
      role: 'waiter' as const,
      email: 'rahul@hotel.com',
    },
  },
  kitchen: {
    username: 'kitchen',
    password: 'kitchen123',
    user: {
      id: 'kitchen-001',
      username: 'kitchen',
      name: 'Chef Kumar',
      role: 'kitchen' as const,
      email: 'chef@hotel.com',
    },
  },
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hotel_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('hotel_user');
      }
    }
  }, []);

  const login = (credentials: LoginCredentials): boolean => {
    const { identifier, password } = credentials;

    // Check against hardcoded credentials
    const matchedRole = Object.entries(CREDENTIALS).find(
      ([_, cred]) =>
        cred.username === identifier.toLowerCase() && cred.password === password
    );

    if (matchedRole) {
      const [_, credData] = matchedRole;
      setUser(credData.user);
      setIsAuthenticated(true);
      localStorage.setItem('hotel_user', JSON.stringify(credData.user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hotel_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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

// Export credentials for display on login page
export const getLoginHints = () => ({
  admin: { username: 'admin', password: 'admin123', label: 'Hotel Owner / Admin' },
  waiter: { username: 'waiter', password: 'waiter123', label: 'Waiter' },
  kitchen: { username: 'kitchen', password: 'kitchen123', label: 'Kitchen / Chef' },
});
