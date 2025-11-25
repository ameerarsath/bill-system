export interface LoginCredentials {
  identifier: string; // Email or Phone or Username
  password: string;
}

export interface LoginFormErrors {
  identifier?: string;
  password?: string;
}

export type UserRole = 'admin' | 'waiter' | 'kitchen' | 'cashier';

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

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  emailOrUsername: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MessageResponse {
  message: string;
}
