import apiClient from './client';
import { KitchenOrder, KitchenItem } from '../types';

export const kitchenApi = {
  getKitchenOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/orders');
    return response.data;
  },

  getPendingOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/orders/pending');
    return response.data;
  },

  getCookingOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/orders/cooking');
    return response.data;
  },

  getReadyOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/orders/ready');
    return response.data;
  },

  updateItemStatus: async (itemId: number, status: string): Promise<KitchenItem> => {
    const response = await apiClient.patch<KitchenItem>(`/kitchen/items/${itemId}/status`, { status });
    return response.data;
  },

  startCooking: async (itemId: number): Promise<KitchenItem> => {
    const response = await apiClient.patch<KitchenItem>(`/kitchen/items/${itemId}/cooking`);
    return response.data;
  },

  markItemReady: async (itemId: number): Promise<KitchenItem> => {
    const response = await apiClient.patch<KitchenItem>(`/kitchen/items/${itemId}/ready`);
    return response.data;
  },

  startCookingOrder: async (orderId: number): Promise<KitchenOrder> => {
    const response = await apiClient.patch<KitchenOrder>(`/kitchen/orders/${orderId}/cooking`);
    return response.data;
  },

  markOrderReady: async (orderId: number): Promise<KitchenOrder> => {
    const response = await apiClient.patch<KitchenOrder>(`/kitchen/orders/${orderId}/ready`);
    return response.data;
  },
};
