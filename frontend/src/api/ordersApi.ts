import apiClient from './client';
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  UpdateItemStatusRequest,
} from '../types/backend.types';

export const ordersApi = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  },

  getActiveOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders/active');
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  },

  getOrdersByStatus: async (status: string): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(`/orders/status/${status}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data;
  },

  updateOrder: async (id: number, data: any): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${id}`, data);
    return response.data;
  },

  // Fixed: Changed from PUT to PATCH to match backend
  updateOrderStatus: async (id: number, data: UpdateOrderStatusRequest): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  // Add customer phone to order
  addCustomerPhone: async (id: number, phone: string): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}/phone`, { phone });
    return response.data;
  },

  // Fixed: Changed from PUT to DELETE to match backend
  cancelOrder: async (id: number): Promise<void> => {
    await apiClient.delete(`/orders/${id}`);
  },

  // Get daily order count for current user
  getDailyOrderCount: async (): Promise<number> => {
    const response = await apiClient.get<number>('/orders/daily-count');
    return response.data;
  },

  // Mark individual order item as delivered
  markItemAsDelivered: async (orderId: number, itemId: number): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${orderId}/items/${itemId}/delivered`);
    return response.data;
  },
};
