import apiClient from './client';
import type { Payment, CreatePaymentRequest } from '../types/index';

export const paymentsApi = {
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>('/payments');
    return response.data;
  },

  getPaymentById: async (id: number): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  getPaymentsByBillId: async (billId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/payments/bill/${billId}`);
    return response.data;
  },

  getTotalPaidAmount: async (billId: number): Promise<number> => {
    const response = await apiClient.get<number>(`/payments/bill/${billId}/total`);
    return response.data;
  },

  createPayment: async (data: CreatePaymentRequest): Promise<Payment> => {
    const response = await apiClient.post<Payment>('/payments', data);
    return response.data;
  },
};
