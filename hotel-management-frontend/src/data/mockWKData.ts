import type {
  MenuItem,
  Category,
  Order,
  KitchenOrder,
  Bill,
  OrderHistoryEntry,
  User,
  Charges,
} from '../types/waiter-kitchen.types';

// Categories
export const categories: Category[] = [
  { id: 'all', name: 'All Items', icon: '🍽️', color: '#f97316' },
  { id: 'starters', name: 'Starters', icon: '🥗', color: '#22c55e' },
  { id: 'main-course', name: 'Main Course', icon: '🍛', color: '#f97316' },
  { id: 'breads', name: 'Breads', icon: '🫓', color: '#eab308' },
  { id: 'rice', name: 'Rice & Biryani', icon: '🍚', color: '#fb923c' },
  { id: 'chinese', name: 'Chinese', icon: '🍜', color: '#ef4444' },
  { id: 'beverages', name: 'Beverages', icon: '☕', color: '#8b5cf6' },
  { id: 'desserts', name: 'Desserts', icon: '🍰', color: '#ec4899' },
];

// Menu Items
export const menuItems: MenuItem[] = [
  {
    id: 'M001',
    name: 'Paneer Tikka',
    category: 'starters',
    price: 280,
    image: '🧀',
    description: 'Marinated paneer with spices',
    available: true,
    preparationTime: 15,
    isVeg: true,
  },
  {
    id: 'M002',
    name: 'Veg Spring Roll',
    category: 'starters',
    price: 180,
    image: '🥙',
    available: true,
    preparationTime: 12,
    isVeg: true,
  },
  {
    id: 'M003',
    name: 'Butter Chicken',
    category: 'main-course',
    price: 350,
    image: '🍛',
    description: 'Creamy tomato-based curry',
    available: true,
    preparationTime: 20,
    isVeg: false,
  },
  {
    id: 'M004',
    name: 'Palak Paneer',
    category: 'main-course',
    price: 280,
    image: '🥬',
    available: true,
    preparationTime: 18,
    isVeg: true,
  },
  {
    id: 'M005',
    name: 'Dal Makhani',
    category: 'main-course',
    price: 220,
    image: '🫘',
    available: true,
    preparationTime: 15,
    isVeg: true,
  },
  {
    id: 'M006',
    name: 'Butter Naan',
    category: 'breads',
    price: 40,
    image: '🫓',
    available: true,
    preparationTime: 8,
    isVeg: true,
  },
  {
    id: 'M007',
    name: 'Garlic Naan',
    category: 'breads',
    price: 50,
    image: '🧄',
    available: true,
    preparationTime: 10,
    isVeg: true,
  },
  {
    id: 'M008',
    name: 'Veg Biryani',
    category: 'rice',
    price: 250,
    image: '🍚',
    available: true,
    preparationTime: 25,
    isVeg: true,
  },
  {
    id: 'M009',
    name: 'Chicken Biryani',
    category: 'rice',
    price: 320,
    image: '🍗',
    available: true,
    preparationTime: 30,
    isVeg: false,
  },
  {
    id: 'M010',
    name: 'Hakka Noodles',
    category: 'chinese',
    price: 180,
    image: '🍜',
    available: true,
    preparationTime: 15,
    isVeg: true,
  },
  {
    id: 'M011',
    name: 'Manchurian',
    category: 'chinese',
    price: 200,
    image: '🥟',
    available: true,
    preparationTime: 18,
    isVeg: true,
  },
  {
    id: 'M012',
    name: 'Masala Chai',
    category: 'beverages',
    price: 40,
    image: '☕',
    available: true,
    preparationTime: 5,
    isVeg: true,
  },
  {
    id: 'M013',
    name: 'Mango Lassi',
    category: 'beverages',
    price: 80,
    image: '🥤',
    available: true,
    preparationTime: 5,
    isVeg: true,
  },
  {
    id: 'M014',
    name: 'Gulab Jamun',
    category: 'desserts',
    price: 100,
    image: '🍮',
    available: true,
    preparationTime: 5,
    isVeg: true,
  },
  {
    id: 'M015',
    name: 'Ice Cream',
    category: 'desserts',
    price: 120,
    image: '🍨',
    available: true,
    preparationTime: 3,
    isVeg: true,
  },
];

// Users
export const mockUsers: User[] = [
  { id: 'W001', name: 'Rahul Sharma', role: 'waiter' },
  { id: 'W002', name: 'Priya Singh', role: 'waiter' },
  { id: 'K001', name: 'Chef Kumar', role: 'kitchen' },
  { id: 'C001', name: 'Anjali Patel', role: 'cashier' },
];

// Kitchen Orders (Live)
export const mockKitchenOrders: KitchenOrder[] = [
  {
    id: 'O001',
    tableNo: 'T5',
    waiterName: 'Rahul Sharma',
    waiterId: 'W001',
    items: [
      {
        menuItem: menuItems[2], // Butter Chicken
        quantity: 2,
        notes: 'Extra gravy',
        subtotal: 700,
      },
      {
        menuItem: menuItems[5], // Butter Naan
        quantity: 4,
        subtotal: 160,
      },
    ],
    status: 'pending',
    createdAt: '2025-11-20T10:30:00Z',
    updatedAt: '2025-11-20T10:30:00Z',
    totalAmount: 860,
    timeElapsed: 5,
    priority: 'urgent',
  },
  {
    id: 'O002',
    tableNo: 'T3',
    waiterName: 'Priya Singh',
    waiterId: 'W002',
    items: [
      {
        menuItem: menuItems[7], // Veg Biryani
        quantity: 1,
        subtotal: 250,
      },
      {
        menuItem: menuItems[12], // Mango Lassi
        quantity: 2,
        subtotal: 160,
      },
    ],
    status: 'cooking',
    createdAt: '2025-11-20T10:20:00Z',
    updatedAt: '2025-11-20T10:25:00Z',
    startedCookingAt: '2025-11-20T10:25:00Z',
    totalAmount: 410,
    timeElapsed: 15,
    priority: 'normal',
  },
  {
    id: 'O003',
    tableNo: 'T8',
    waiterName: 'Rahul Sharma',
    waiterId: 'W001',
    items: [
      {
        menuItem: menuItems[0], // Paneer Tikka
        quantity: 1,
        subtotal: 280,
      },
      {
        menuItem: menuItems[10], // Manchurian
        quantity: 1,
        notes: 'Less spicy',
        subtotal: 200,
      },
    ],
    status: 'ready',
    createdAt: '2025-11-20T10:10:00Z',
    updatedAt: '2025-11-20T10:30:00Z',
    startedCookingAt: '2025-11-20T10:15:00Z',
    markedReadyAt: '2025-11-20T10:30:00Z',
    totalAmount: 480,
    timeElapsed: 25,
    priority: 'normal',
  },
];

// Bills
export const mockBills: Bill[] = [
  {
    id: 'B001',
    orderId: 'O003',
    tableNo: 'T8',
    waiterName: 'Rahul Sharma',
    items: mockKitchenOrders[2].items,
    subtotal: 480,
    serviceCharge: 24,
    gst: 25.2,
    discount: 0,
    totalAmount: 529.2,
    customerPhone: '+91 98765 43210',
    status: 'generated',
    createdAt: '2025-11-20T10:35:00Z',
  },
];

// Order History
export const mockOrderHistory: OrderHistoryEntry[] = [
  {
    id: 'H001',
    orderId: 'O003',
    billId: 'B001',
    tableNo: 'T8',
    waiterName: 'Rahul Sharma',
    totalAmount: 529.2,
    itemCount: 2,
    status: 'served',
    timestamp: '2025-11-20T10:35:00Z',
    customerPhone: '+91 98765 43210',
  },
  {
    id: 'H002',
    orderId: 'O004',
    billId: 'B002',
    tableNo: 'T2',
    waiterName: 'Priya Singh',
    totalAmount: 890,
    itemCount: 4,
    status: 'served',
    timestamp: '2025-11-20T09:45:00Z',
    customerPhone: '+91 98765 11111',
  },
  {
    id: 'H003',
    orderId: 'O005',
    billId: 'B003',
    tableNo: 'T6',
    waiterName: 'Rahul Sharma',
    totalAmount: 1250,
    itemCount: 6,
    status: 'served',
    timestamp: '2025-11-20T09:15:00Z',
  },
];

// Charges Configuration
export const defaultCharges: Charges = {
  serviceChargePercent: 5,
  gstPercent: 5,
};
