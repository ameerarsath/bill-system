import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

const getPageTitle = (pathname: string): string => {
  const pathMap: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/tenants': 'Tenant Management',
    '/admin/subscriptions': 'Subscriptions',
    '/admin/users': 'Tenant Users',
    '/admin/features': 'Feature Flags',
    '/admin/monitoring': 'System Monitoring',
  };

  return pathMap[pathname] || 'Admin Panel';
};

export const AdminLayout = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col ml-64">
        <AdminHeader title={pageTitle} />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
