import type { Tenant, TenantUser, Feature, PlanDetails } from '../types/admin.types';
import { TenantStatus, SubscriptionPlan, UserRole } from '../types/admin.types';

export const mockTenants: Tenant[] = [
  {
    id: '1',
    hotelName: 'Grand Plaza Hotel',
    ownerName: 'John Smith',
    email: 'john@grandplaza.com',
    phone: '+1-555-0101',
    plan: SubscriptionPlan.ENTERPRISE,
    expiryDate: '2024-12-31',
    status: TenantStatus.ACTIVE,
    createdAt: '2024-01-15',
    usersCount: 25,
    featuresEnabled: ['analytics', 'kitchen_display', 'multi_language', 'discount_system'],
  },
  {
    id: '2',
    hotelName: 'Seaside Resort & Spa',
    ownerName: 'Emma Johnson',
    email: 'emma@seasideresort.com',
    phone: '+1-555-0102',
    plan: SubscriptionPlan.PROFESSIONAL,
    expiryDate: '2024-06-30',
    status: TenantStatus.ACTIVE,
    createdAt: '2024-02-20',
    usersCount: 15,
    featuresEnabled: ['analytics', 'kitchen_display', 'multi_language'],
  },
  {
    id: '3',
    hotelName: 'Mountain View Inn',
    ownerName: 'Michael Brown',
    email: 'michael@mountainview.com',
    phone: '+1-555-0103',
    plan: SubscriptionPlan.BASIC,
    expiryDate: '2024-03-15',
    status: TenantStatus.EXPIRED,
    createdAt: '2023-09-10',
    usersCount: 8,
    featuresEnabled: ['kitchen_display'],
  },
  {
    id: '4',
    hotelName: 'City Center Business Hotel',
    ownerName: 'Sarah Davis',
    email: 'sarah@citycenter.com',
    phone: '+1-555-0104',
    plan: SubscriptionPlan.PROFESSIONAL,
    expiryDate: '2024-09-30',
    status: TenantStatus.ACTIVE,
    createdAt: '2024-03-05',
    usersCount: 12,
    featuresEnabled: ['analytics', 'kitchen_display', 'discount_system'],
  },
  {
    id: '5',
    hotelName: 'Luxury Palace Resort',
    ownerName: 'David Wilson',
    email: 'david@luxurypalace.com',
    phone: '+1-555-0105',
    plan: SubscriptionPlan.ENTERPRISE,
    expiryDate: '2025-02-28',
    status: TenantStatus.ACTIVE,
    createdAt: '2024-01-01',
    usersCount: 35,
    featuresEnabled: ['analytics', 'kitchen_display', 'multi_language', 'discount_system'],
  },
];

export const mockUsers: TenantUser[] = [
  { id: '1', tenantId: '1', name: 'Alice Manager', email: 'alice@grandplaza.com', role: UserRole.MANAGER, status: 'active' },
  { id: '2', tenantId: '1', name: 'Bob Waiter', email: 'bob@grandplaza.com', role: UserRole.WAITER, status: 'active' },
  { id: '3', tenantId: '1', name: 'Charlie Chef', email: 'charlie@grandplaza.com', role: UserRole.KITCHEN, status: 'active' },
  { id: '4', tenantId: '2', name: 'Diana Host', email: 'diana@seasideresort.com', role: UserRole.MANAGER, status: 'active' },
  { id: '5', tenantId: '2', name: 'Eve Server', email: 'eve@seasideresort.com', role: UserRole.WAITER, status: 'active' },
];

export const availableFeatures: Feature[] = [
  { id: 'analytics', name: 'Advanced Analytics', description: 'Detailed reports and insights' },
  { id: 'kitchen_display', name: 'Kitchen Display System', description: 'Real-time order management' },
  { id: 'multi_language', name: 'Multi-Language Support', description: 'Support for multiple languages' },
  { id: 'discount_system', name: 'Discount & Promotions', description: 'Advanced discount management' },
  { id: 'offline_mode', name: 'Offline Mode', description: 'Work without internet connection' },
];

export const subscriptionPlans: PlanDetails[] = [
  { name: SubscriptionPlan.BASIC, price: 49, features: ['Kitchen Display', 'Up to 10 users', 'Email support'] },
  { name: SubscriptionPlan.PROFESSIONAL, price: 99, features: ['All Basic features', 'Analytics', 'Up to 20 users', 'Priority support'] },
  { name: SubscriptionPlan.ENTERPRISE, price: 199, features: ['All Professional features', 'Unlimited users', 'Custom features', '24/7 phone support'] },
];
