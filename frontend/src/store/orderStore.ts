import { create } from 'zustand';
import type { MenuItem, OrderType, CreateOrderItemRequest } from '../types/backend.types';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialNotes?: string;
  subtotal: number;
}

interface OrderState {
  cart: CartItem[];
  orderType: OrderType;
  selectedTableId: number | null;
  customerPhone: string;
  specialInstructions: string;

  // Actions
  addToCart: (menuItem: MenuItem, quantity?: number, notes?: string) => void;
  removeFromCart: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  updateNotes: (menuItemId: number, notes: string) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setSelectedTable: (tableId: number | null) => void;
  setCustomerPhone: (phone: string) => void;
  setSpecialInstructions: (instructions: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getCartAsOrderItems: () => CreateOrderItemRequest[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  cart: [],
  orderType: 'DINE_IN',
  selectedTableId: null,
  customerPhone: '',
  specialInstructions: '',

  addToCart: (menuItem, quantity = 1, notes = '') => {
    const { cart } = get();
    const existingItem = cart.find(item => item.menuItem.id === menuItem.id);

    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.menuItem.id === menuItem.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * menuItem.price,
              }
            : item
        ),
      });
    } else {
      set({
        cart: [
          ...cart,
          {
            menuItem,
            quantity,
            specialNotes: notes,
            subtotal: quantity * menuItem.price,
          },
        ],
      });
    }
  },

  removeFromCart: (menuItemId) => {
    set(state => ({
      cart: state.cart.filter(item => item.menuItem.id !== menuItemId),
    }));
  },

  updateQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(menuItemId);
      return;
    }

    set(state => ({
      cart: state.cart.map(item =>
        item.menuItem.id === menuItemId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.menuItem.price,
            }
          : item
      ),
    }));
  },

  updateNotes: (menuItemId, notes) => {
    set(state => ({
      cart: state.cart.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, specialNotes: notes }
          : item
      ),
    }));
  },

  clearCart: () => {
    set({
      cart: [],
      selectedTableId: null,
      customerPhone: '',
      specialInstructions: '',
    });
  },

  setOrderType: (type) => set({ orderType: type }),
  setSelectedTable: (tableId) => set({ selectedTableId: tableId }),
  setCustomerPhone: (phone) => set({ customerPhone: phone }),
  setSpecialInstructions: (instructions) => set({ specialInstructions: instructions }),

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.subtotal, 0);
  },

  getCartCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  getCartAsOrderItems: () => {
    const { cart } = get();
    return cart.map(item => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
      specialNotes: item.specialNotes,
    }));
  },
}));
