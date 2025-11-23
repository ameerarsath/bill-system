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

  getOrdersByTable: async (tableId: number): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(`/orders/table/${tableId}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data;
  },

  updateOrderStatus: async (id: number, data: UpdateOrderStatusRequest): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  updateItemStatus: async (orderId: number, itemId: number, data: UpdateItemStatusRequest): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${orderId}/items/${itemId}/status`, data);
    return response.data;
  },

  cancelOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${id}/cancel`);
    return response.data;
  },
};
