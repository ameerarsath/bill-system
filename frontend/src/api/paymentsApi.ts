import apiClient from './client';
import type { Payment, CreatePaymentRequest } from '../types/backend.types';

export const paymentsApi = {
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>('/payments');
    return response.data;
  },

  getPaymentById: async (id: number): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  getPaymentsByBill: async (billId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/payments/bill/${billId}`);
    return response.data;
  },

  // CRITICAL: Get total paid amount for a bill (needed for partial payment calculations)
  getTotalPaidAmount: async (billId: number): Promise<number> => {
    const response = await apiClient.get<number>(`/payments/bill/${billId}/total`);
    return response.data;
  },

  recordPayment: async (data: CreatePaymentRequest): Promise<Payment> => {
    const response = await apiClient.post<Payment>('/payments', data);
    return response.data;
  },
};
