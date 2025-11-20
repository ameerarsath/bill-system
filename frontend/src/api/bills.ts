import apiClient from './client';
import type { Bill, CreateBillRequest } from '../types/index';

export const billsApi = {
  getAllBills: async (): Promise<Bill[]> => {
    const response = await apiClient.get<Bill[]>('/bills');
    return response.data;
  },

  getBillById: async (id: number): Promise<Bill> => {
    const response = await apiClient.get<Bill>(`/bills/${id}`);
    return response.data;
  },

  getBillByNumber: async (billNumber: string): Promise<Bill> => {
    const response = await apiClient.get<Bill>(`/bills/number/${billNumber}`);
    return response.data;
  },

  getBillByOrderId: async (orderId: number): Promise<Bill> => {
    const response = await apiClient.get<Bill>(`/bills/order/${orderId}`);
    return response.data;
  },

  getBillsByPhone: async (phone: string): Promise<Bill[]> => {
    const response = await apiClient.get<Bill[]>(`/bills/phone/${phone}`);
    return response.data;
  },

  getBillsByPaymentStatus: async (status: string): Promise<Bill[]> => {
    const response = await apiClient.get<Bill[]>(`/bills/status/${status}`);
    return response.data;
  },

  createBill: async (data: CreateBillRequest): Promise<Bill> => {
    const response = await apiClient.post<Bill>('/bills', data);
    return response.data;
  },

  updateBill: async (id: number, data: CreateBillRequest): Promise<Bill> => {
    const response = await apiClient.put<Bill>(`/bills/${id}`, data);
    return response.data;
  },

  // Public invoice endpoint (no auth required)
  getInvoiceByToken: async (qrToken: string): Promise<Bill> => {
    const response = await apiClient.get<Bill>(`/invoice/${qrToken}`);
    return response.data;
  },
};
