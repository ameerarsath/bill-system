import apiClient from './client';

export interface User {
  id: number;
  username: string;
  fullName: string;
  phone?: string;
  email?: string;
  role: 'ADMIN' | 'SERVANT' | 'KITCHEN' | 'CASHIER';
  active: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  phone?: string;
  email?: string;
  role: string;
  active?: boolean;
}

export interface UpdateUserRequest {
  fullName: string;
  phone?: string;
  email?: string;
  role: string;
  active?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const usersApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await apiClient.get<User[]>(`/users/role/${role}`);
    return response.data;
  },

  getActiveUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users/active');
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  changePassword: async (id: number, data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put(`/users/${id}/password`, data);
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  toggleUserStatus: async (id: number): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}/toggle`);
    return response.data;
  },
};
