export interface Bill {
  id: string;
  tableNo: string;
  waiter: string;
  amount: number;
  items: number;
  customerPhone: string;
  status: 'paid' | 'pending';
  date: string;
}

export interface Order {
  id: string;
  tableNo: string;
  waiter: string;
  items: string[];
  status: 'pending' | 'cooking' | 'ready';
  time: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface DashboardData {
  todayRevenue: number;
  totalOrders: number;
  totalBills: number;
  activeOrders: number;
  topItems: {
    name: string;
    orders: number;
    revenue: number;
  }[];
  salesChart: {
    day: string;
    revenue: number;
  }[];
}

export const mockBills: Bill[] = [
  {
    id: 'B001',
    tableNo: 'T5',
    waiter: 'Rahul Sharma',
    amount: 1250,
    items: 5,
    customerPhone: '+91 98765 43210',
    status: 'paid',
    date: '2024-01-15 14:30',
  },
  {
    id: 'B002',
    tableNo: 'T12',
    waiter: 'Priya Singh',
    amount: 2340,
    items: 8,
    customerPhone: '+91 98765 43211',
    status: 'paid',
    date: '2024-01-15 15:45',
  },
  {
    id: 'B003',
    tableNo: 'T3',
    waiter: 'Amit Kumar',
    amount: 890,
    items: 3,
    customerPhone: '+91 98765 43212',
    status: 'pending',
    date: '2024-01-15 16:20',
  },
  {
    id: 'B004',
    tableNo: 'T8',
    waiter: 'Rahul Sharma',
    amount: 3200,
    items: 12,
    customerPhone: '+91 98765 43213',
    status: 'paid',
    date: '2024-01-15 17:10',
  },
  {
    id: 'B005',
    tableNo: 'T15',
    waiter: 'Sneha Patel',
    amount: 1680,
    items: 6,
    customerPhone: '+91 98765 43214',
    status: 'paid',
    date: '2024-01-15 18:00',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'O001',
    tableNo: 'T5',
    waiter: 'Rahul Sharma',
    items: ['Butter Chicken', 'Naan (2)'],
    status: 'cooking',
    time: '5 min ago',
  },
  {
    id: 'O002',
    tableNo: 'T12',
    waiter: 'Priya Singh',
    items: ['Paneer Tikka', 'Dal Makhani', 'Roti (4)'],
    status: 'pending',
    time: '2 min ago',
  },
  {
    id: 'O003',
    tableNo: 'T8',
    waiter: 'Amit Kumar',
    items: ['Biryani', 'Raita'],
    status: 'ready',
    time: '1 min ago',
  },
  {
    id: 'O004',
    tableNo: 'T3',
    waiter: 'Sneha Patel',
    items: ['Masala Dosa', 'Coffee (2)'],
    status: 'cooking',
    time: '8 min ago',
  },
];

export const mockMenu: MenuItem[] = [
  {
    id: 'M001',
    name: 'Butter Chicken',
    category: 'Main Course',
    price: 320,
    available: true,
    image: '🍛',
  },
  {
    id: 'M002',
    name: 'Paneer Tikka',
    category: 'Starters',
    price: 280,
    available: true,
    image: '🧀',
  },
  {
    id: 'M003',
    name: 'Biryani',
    category: 'Main Course',
    price: 300,
    available: true,
    image: '🍚',
  },
  {
    id: 'M004',
    name: 'Dal Makhani',
    category: 'Main Course',
    price: 200,
    available: true,
    image: '🥘',
  },
  {
    id: 'M005',
    name: 'Naan',
    category: 'Breads',
    price: 40,
    available: true,
    image: '🫓',
  },
  {
    id: 'M006',
    name: 'Masala Dosa',
    category: 'South Indian',
    price: 150,
    available: false,
    image: '🥞',
  },
];

export const mockStaff: StaffMember[] = [
  {
    id: 'S001',
    name: 'Rahul Sharma',
    role: 'Waiter',
    phone: '+91 98765 43210',
    status: 'active',
    joinDate: '2023-05-10',
  },
  {
    id: 'S002',
    name: 'Priya Singh',
    role: 'Waiter',
    phone: '+91 98765 43211',
    status: 'active',
    joinDate: '2023-06-15',
  },
  {
    id: 'S003',
    name: 'Amit Kumar',
    role: 'Cashier',
    phone: '+91 98765 43212',
    status: 'active',
    joinDate: '2023-04-20',
  },
  {
    id: 'S004',
    name: 'Sneha Patel',
    role: 'Waiter',
    phone: '+91 98765 43213',
    status: 'active',
    joinDate: '2023-07-01',
  },
  {
    id: 'S005',
    name: 'Vikram Singh',
    role: 'Kitchen',
    phone: '+91 98765 43214',
    status: 'active',
    joinDate: '2023-03-12',
  },
];

export const mockDashboardData: DashboardData = {
  todayRevenue: 45780,
  totalOrders: 156,
  totalBills: 142,
  activeOrders: 12,
  topItems: [
    { name: 'Butter Chicken', orders: 45, revenue: 13500 },
    { name: 'Paneer Tikka', orders: 38, revenue: 9500 },
    { name: 'Biryani', orders: 32, revenue: 9600 },
    { name: 'Dal Makhani', orders: 28, revenue: 5600 },
  ],
  salesChart: [
    { day: 'Mon', revenue: 38000 },
    { day: 'Tue', revenue: 42000 },
    { day: 'Wed', revenue: 39000 },
    { day: 'Thu', revenue: 45000 },
    { day: 'Fri', revenue: 48000 },
    { day: 'Sat', revenue: 52000 },
    { day: 'Sun', revenue: 45780 },
  ],
};
