import apiClient from './client';
import type { Payment, CreatePaymentRequest } from '../types/backend.types';

export const paymentsApi = {
  getPaymentsByBill: async (billId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/payments/bill/${billId}`);
    return response.data;
  },

  recordPayment: async (data: CreatePaymentRequest): Promise<Payment> => {
    const response = await apiClient.post<Payment>('/payments', data);
    return response.data;
  },
};
