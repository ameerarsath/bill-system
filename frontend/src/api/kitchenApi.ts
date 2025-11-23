import apiClient from './client';
import type { KitchenOrder, UpdateItemStatusRequest } from '../types/backend.types';

export const kitchenApi = {
  getPendingOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/pending');
    return response.data;
  },

  getCookingOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/cooking');
    return response.data;
  },

  getReadyOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/ready');
    return response.data;
  },

  updateItemStatus: async (orderId: number, itemId: number, data: UpdateItemStatusRequest): Promise<void> => {
    await apiClient.put(`/kitchen/orders/${orderId}/items/${itemId}/status`, data);
  },

  markAllItemsReady: async (orderId: number): Promise<void> => {
    await apiClient.put(`/kitchen/orders/${orderId}/ready`);
  },
};
