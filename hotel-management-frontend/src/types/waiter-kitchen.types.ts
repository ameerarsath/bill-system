// Waiter + Kitchen Panel Type Definitions

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'served';
export type BillStatus = 'draft' | 'generated' | 'paid';
export type UserRole = 'waiter' | 'kitchen' | 'cashier';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string; // emoji or image URL
  description?: string;
  available: boolean;
  preparationTime?: number; // in minutes
  isVeg: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  tableNo: string;
  waiterName: string;
  waiterId: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  totalAmount: number;
}

export interface KitchenOrder extends Order {
  startedCookingAt?: string;
  markedReadyAt?: string;
  timeElapsed: number; // in minutes
  priority: 'normal' | 'urgent';
}

export interface Bill {
  id: string;
  orderId: string;
  tableNo: string;
  waiterName: string;
  items: CartItem[];
  subtotal: number;
  serviceCharge: number;
  gst: number;
  discount: number;
  totalAmount: number;
  customerPhone: string;
  status: BillStatus;
  createdAt: string;
  paidAt?: string;
}

export interface OrderHistoryEntry {
  id: string;
  orderId: string;
  billId: string;
  tableNo: string;
  waiterName: string;
  totalAmount: number;
  itemCount: number;
  status: OrderStatus;
  timestamp: string;
  customerPhone?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface CartState {
  items: CartItem[];
  tableNo: string;
  notes: string;
}

export interface Charges {
  serviceChargePercent: number;
  gstPercent: number;
}
