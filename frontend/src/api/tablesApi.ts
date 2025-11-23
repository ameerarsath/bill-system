import apiClient from './client';
import type { RestaurantTable, CreateTableRequest } from '../types/backend.types';

export const tablesApi = {
  getAllTables: async (): Promise<RestaurantTable[]> => {
    const response = await apiClient.get<RestaurantTable[]>('/tables');
    return response.data;
  },

  getTableById: async (id: number): Promise<RestaurantTable> => {
    const response = await apiClient.get<RestaurantTable>(`/tables/${id}`);
    return response.data;
  },

  getAvailableTables: async (): Promise<RestaurantTable[]> => {
    const response = await apiClient.get<RestaurantTable[]>('/tables/available');
    return response.data;
  },

  createTable: async (data: CreateTableRequest): Promise<RestaurantTable> => {
    const response = await apiClient.post<RestaurantTable>('/tables', data);
    return response.data;
  },

  updateTable: async (id: number, data: CreateTableRequest): Promise<RestaurantTable> => {
    const response = await apiClient.put<RestaurantTable>(`/tables/${id}`, data);
    return response.data;
  },

  deleteTable: async (id: number): Promise<void> => {
    await apiClient.delete(`/tables/${id}`);
  },
};
