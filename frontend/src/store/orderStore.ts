import { create } from 'zustand';
import { Order, OrderItemRequest, MenuItem } from '../types';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialNotes?: string;
}

interface OrderState {
  currentOrder: Order | null;
  cartItems: CartItem[];
  selectedTable: number | null;
  orderType: 'DINE_IN' | 'PARCEL' | 'TAKEAWAY';
  specialInstructions: string;

  // Cart management
  addToCart: (menuItem: MenuItem, quantity?: number) => void;
  removeFromCart: (menuItemId: number) => void;
  updateCartItemQuantity: (menuItemId: number, quantity: number) => void;
  updateCartItemNotes: (menuItemId: number, notes: string) => void;
  clearCart: () => void;

  // Order settings
  setSelectedTable: (tableId: number | null) => void;
  setOrderType: (type: 'DINE_IN' | 'PARCEL' | 'TAKEAWAY') => void;
  setSpecialInstructions: (instructions: string) => void;

  // Current order
  setCurrentOrder: (order: Order | null) => void;

  // Get cart as order items
  getCartAsOrderItems: () => OrderItemRequest[];
  getCartTotal: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  currentOrder: null,
  cartItems: [],
  selectedTable: null,
  orderType: 'DINE_IN',
  specialInstructions: '',

  addToCart: (menuItem, quantity = 1) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(item => item.menuItem.id === menuItem.id);

    if (existingItem) {
      set({
        cartItems: cartItems.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({
        cartItems: [...cartItems, { menuItem, quantity, specialNotes: '' }],
      });
    }
  },

  removeFromCart: (menuItemId) => {
    set(state => ({
      cartItems: state.cartItems.filter(item => item.menuItem.id !== menuItemId),
    }));
  },

  updateCartItemQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(menuItemId);
      return;
    }

    set(state => ({
      cartItems: state.cartItems.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  updateCartItemNotes: (menuItemId, notes) => {
    set(state => ({
      cartItems: state.cartItems.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, specialNotes: notes }
          : item
      ),
    }));
  },

  clearCart: () => {
    set({
      cartItems: [],
      selectedTable: null,
      specialInstructions: '',
      currentOrder: null,
    });
  },

  setSelectedTable: (tableId) => {
    set({ selectedTable: tableId });
    if (tableId) {
      set({ orderType: 'DINE_IN' });
    }
  },

  setOrderType: (type) => {
    set({ orderType: type });
    if (type !== 'DINE_IN') {
      set({ selectedTable: null });
    }
  },

  setSpecialInstructions: (instructions) => {
    set({ specialInstructions: instructions });
  },

  setCurrentOrder: (order) => {
    set({ currentOrder: order });
  },

  getCartAsOrderItems: () => {
    const { cartItems } = get();
    return cartItems.map(item => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
      specialNotes: item.specialNotes,
    }));
  },

  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => {
      return total + (item.menuItem.price * item.quantity);
    }, 0);
  },
}));
