// Admin Type Definitions - Last updated: 2025-11-19
// Status and Plan Constants
export const TenantStatus = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
} as const;

export type TenantStatus = typeof TenantStatus[keyof typeof TenantStatus];

export const SubscriptionPlan = {
  BASIC: 'Basic',
  PROFESSIONAL: 'Professional',
  ENTERPRISE: 'Enterprise',
} as const;

export type SubscriptionPlan = typeof SubscriptionPlan[keyof typeof SubscriptionPlan];

export const UserRole = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  WAITER: 'Waiter',
  KITCHEN: 'Kitchen Staff',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Interfaces
export interface Tenant {
  id: string;
  hotelName: string;
  ownerName: string;
  email: string;
  phone: string;
  plan: SubscriptionPlan;
  expiryDate: string;
  status: TenantStatus;
  createdAt: string;
  usersCount: number;
  featuresEnabled: string[];
}

export interface TenantUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
}

export interface Feature {
  id: string;
  name: string;
  description: string;
}

export interface PlanDetails {
  name: SubscriptionPlan;
  price: number;
  features: string[];
}

export interface Stats {
  total: number;
  active: number;
  expired: number;
  totalUsers: number;
}

