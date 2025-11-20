// Import types and constants from the central types file
import type { Tenant, Stats, TenantStatus as TenantStatusType } from '../types/admin.types';
import { TenantStatus } from '../types/admin.types';

// Re-export TenantStatus for backward compatibility
export { TenantStatus };

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getStatusBadgeClass(status: TenantStatusType): string {
  switch (status) {
    case TenantStatus.ACTIVE:
      return 'bg-green-100 text-green-800';
    case TenantStatus.EXPIRED:
      return 'bg-red-100 text-red-800';
    case TenantStatus.SUSPENDED:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function calculateStats(tenants: Tenant[]): Stats {
  const total = tenants.length;
  const active = tenants.filter((t) => t.status === TenantStatus.ACTIVE).length;
  const expired = tenants.filter((t) => t.status === TenantStatus.EXPIRED).length;
  const totalUsers = tenants.reduce((sum, t) => sum + t.usersCount, 0);

  return { total, active, expired, totalUsers };
}

