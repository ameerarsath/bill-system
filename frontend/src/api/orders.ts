import apiClient from './client';
import type { Order, CreateOrderRequest, UpdateOrderRequest } from '../types/index';

export const ordersApi = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  },

  getActiveOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders/active');
    return response.data;
  },

  getOrdersByStatus: async (status: string): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(`/orders/status/${status}`);
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data;
  },

  updateOrder: async (id: number, data: UpdateOrderRequest): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${id}`, data);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  addCustomerPhone: async (id: number, phone: string): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}/phone`, { phone });
    return response.data;
  },

  cancelOrder: async (id: number): Promise<void> => {
    await apiClient.delete(`/orders/${id}`);
  },

  getDailyOrderCount: async (): Promise<number> => {
    const response = await apiClient.get<number>('/orders/daily-count');
    return response.data;
  },

  markItemAsDelivered: async (orderId: number, itemId: number): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${orderId}/items/${itemId}/delivered`);
    return response.data;
  },
};
