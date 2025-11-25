import apiClient from './client';
import type { KitchenOrder, UpdateItemStatusRequest } from '../types/backend.types';

export const kitchenApi = {
  // Get all kitchen orders
  getKitchenOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/orders');
    return response.data;
  },

  // Get pending orders (fixed path)
  getPendingOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/orders/pending');
    return response.data;
  },

  // Get cooking orders (fixed path)
  getCookingOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/orders/cooking');
    return response.data;
  },

  // Get ready orders (fixed path)
  getReadyOrders: async (): Promise<KitchenOrder[]> => {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/orders/ready');
    return response.data;
  },

  // Update individual item status (fixed to match backend structure)
  updateItemStatus: async (itemId: number, status: string): Promise<void> => {
    await apiClient.patch(`/kitchen/items/${itemId}/status`, { status });
  },

  // Start cooking individual item
  startCookingItem: async (itemId: number): Promise<void> => {
    await apiClient.patch(`/kitchen/items/${itemId}/cooking`);
  },

  // Mark individual item as ready
  markItemReady: async (itemId: number): Promise<void> => {
    await apiClient.patch(`/kitchen/items/${itemId}/ready`);
  },

  // Start cooking entire order
  startCookingOrder: async (orderId: number): Promise<void> => {
    await apiClient.patch(`/kitchen/orders/${orderId}/cooking`);
  },

  // Mark entire order as ready (fixed HTTP method from PUT to PATCH)
  markAllItemsReady: async (orderId: number): Promise<void> => {
    await apiClient.patch(`/kitchen/orders/${orderId}/ready`);
  },
};
