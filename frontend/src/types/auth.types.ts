export interface LoginCredentials {
  identifier: string; // Email or Phone or Username
  password: string;
}

export interface LoginFormErrors {
  identifier?: string;
  password?: string;
}

export type UserRole = 'admin' | 'waiter' | 'kitchen';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
