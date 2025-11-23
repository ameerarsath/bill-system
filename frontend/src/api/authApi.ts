import apiClient from './client';
import type { LoginRequest, AuthResponse, BackendUser, RegisterRequest } from '../types/backend.types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<BackendUser> => {
    const response = await apiClient.post<BackendUser>('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<BackendUser> => {
    const response = await apiClient.get<BackendUser>('/auth/me');
    return response.data;
  },
};
