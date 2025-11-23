// Backend API Types matching Spring Boot entities

export type Role = 'ADMIN' | 'SERVANT' | 'KITCHEN' | 'CASHIER';
export type OrderType = 'DINE_IN' | 'PARCEL' | 'TAKEAWAY';
export type OrderStatus = 'PENDING' | 'COOKING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type ItemStatus = 'PENDING' | 'COOKING' | 'READY';
export type TableStatus = 'FREE' | 'OCCUPIED' | 'RESERVED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';
export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'WALLET' | 'CREDIT';

// User & Auth
export interface BackendUser {
  id: number;
  username: string;
  fullName: string;
  phone?: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  role: Role;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  phone?: string;
  role: Role;
}

// Category
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

// Menu Item
export interface MenuItem {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  description?: string;
  price: number;
  isVeg: boolean;
  available: boolean;
  imageUrl?: string;
}

export interface CreateMenuItemRequest {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  isVeg: boolean;
  available: boolean;
  imageUrl?: string;
}

// Restaurant Table
export interface RestaurantTable {
  id: number;
  tableNumber: string;
  capacity: number;
  location?: string;
  status: TableStatus;
}

export interface CreateTableRequest {
  tableNumber: string;
  capacity: number;
  location?: string;
}

// Order Item
export interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  isVeg: boolean;
  quantity: number;
  price: number;
  totalPrice: number;
  status: ItemStatus;
  specialNotes?: string;
}

export interface CreateOrderItemRequest {
  menuItemId: number;
  quantity: number;
  specialNotes?: string;
}

// Order
export interface Order {
  id: number;
  orderNumber: string;
  tableId?: number;
  tableNumber?: string;
  orderType: OrderType;
  status: OrderStatus;
  createdBy: string;
  customerPhone?: string;
  specialInstructions?: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  tableId?: number;
  orderType: OrderType;
  customerPhone?: string;
  specialInstructions?: string;
  items: CreateOrderItemRequest[];
}

export interface UpdateItemStatusRequest {
  status: ItemStatus;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// Bill
export interface Payment {
  id: number;
  billId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  transactionReference?: string;
  notes?: string;
  paymentDate: string;
}

export interface Bill {
  id: number;
  billNumber: string;
  orderId: number;
  order: Order;
  customerPhone?: string;
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  qrToken: string;
  invoiceUrl: string;
  qrCodeBase64?: string;
  payments: Payment[];
  paidAmount: number;
  remainingAmount: number;
  createdAt: string;
}

export interface CreateBillRequest {
  orderId: number;
  customerPhone?: string;
  discountPercentage?: number;
}

// Payment
export interface CreatePaymentRequest {
  billId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  transactionReference?: string;
  notes?: string;
}

// Kitchen Display
export interface KitchenOrder {
  id: number;
  orderNumber: string;
  tableNumber?: string;
  orderType: OrderType;
  items: OrderItem[];
  specialInstructions?: string;
  createdAt: string;
}
