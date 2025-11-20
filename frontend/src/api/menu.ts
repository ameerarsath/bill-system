import apiClient from './client';
import type { MenuItem, CreateMenuItemRequest, Category, CreateCategoryRequest } from '../types/index';

export const menuApi = {
  // Menu Items
  getAllMenuItems: async (): Promise<MenuItem[]> => {
    const response = await apiClient.get<MenuItem[]>('/menu');
    return response.data;
  },

  getAvailableMenuItems: async (): Promise<MenuItem[]> => {
    const response = await apiClient.get<MenuItem[]>('/menu/available');
    return response.data;
  },

  getMenuItemsByCategory: async (categoryId: number): Promise<MenuItem[]> => {
    const response = await apiClient.get<MenuItem[]>(`/menu/category/${categoryId}/available`);
    return response.data;
  },

  createMenuItem: async (data: CreateMenuItemRequest): Promise<MenuItem> => {
    const response = await apiClient.post<MenuItem>('/menu', data);
    return response.data;
  },

  updateMenuItem: async (id: number, data: CreateMenuItemRequest): Promise<MenuItem> => {
    const response = await apiClient.put<MenuItem>(`/menu/${id}`, data);
    return response.data;
  },

  deleteMenuItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/menu/${id}`);
  },

  toggleMenuItemAvailability: async (id: number): Promise<MenuItem> => {
    const response = await apiClient.patch<MenuItem>(`/menu/${id}/toggle`);
    return response.data;
  },

  // Categories
  getAllCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  getActiveCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories/active');
    return response.data;
  },

  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
