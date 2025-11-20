// User & Auth Types
export interface User {
  id: number;
  username: string;
  fullName: string;
  phone?: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export type Role = 'ADMIN' | 'SERVANT' | 'KITCHEN' | 'CASHIER';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  fullName: string;
  role: Role;
  userId: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  active?: boolean;
}

// Menu Item Types
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
  isVeg?: boolean;
  available?: boolean;
  imageUrl?: string;
}

// Table Types
export interface RestaurantTable {
  id: number;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
}

export type TableStatus = 'FREE' | 'OCCUPIED' | 'RESERVED';

export interface CreateTableRequest {
  tableNumber: string;
  capacity: number;
}

// Order Types
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

export type OrderType = 'DINE_IN' | 'PARCEL' | 'TAKEAWAY';
export type OrderStatus = 'PENDING' | 'COOKING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
export type ItemStatus = 'PENDING' | 'COOKING' | 'READY';

export interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemStatus: ItemStatus;
  specialNotes?: string;
  isVeg: boolean;
}

export interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
  specialNotes?: string;
}

export interface CreateOrderRequest {
  tableId?: number;
  orderType: OrderType;
  items: OrderItemRequest[];
  specialInstructions?: string;
}

export interface UpdateOrderRequest {
  items?: OrderItemRequest[];
  specialInstructions?: string;
  customerPhone?: string;
}

// Kitchen Types
export interface KitchenOrder {
  orderId: number;
  orderNumber: string;
  tableNumber: string;
  orderType: OrderType;
  specialInstructions?: string;
  items: KitchenItem[];
  createdAt: string;
}

export interface KitchenItem {
  itemId: number;
  itemName: string;
  quantity: number;
  status: ItemStatus;
  specialNotes?: string;
  isVeg: boolean;
}

// Bill Types
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

export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';
export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'WALLET' | 'CREDIT';

export interface CreateBillRequest {
  orderId: number;
  customerPhone?: string;
  taxPercentage?: number;
  discountPercentage?: number;
  discountAmount?: number;
}

export interface Payment {
  id: number;
  billId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  transactionReference?: string;
  processedBy: string;
  paymentDate: string;
  notes?: string;
}

export interface CreatePaymentRequest {
  billId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  transactionReference?: string;
  notes?: string;
}

// API Error Type
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}
