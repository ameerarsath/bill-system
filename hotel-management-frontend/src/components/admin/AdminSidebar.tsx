import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Hotel, CreditCard, Users, Settings, BarChart3 } from 'lucide-react';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/admin' },
  { id: 'tenants', icon: <Hotel className="w-5 h-5" />, label: 'Tenants', path: '/admin/tenants' },
  { id: 'subscriptions', icon: <CreditCard className="w-5 h-5" />, label: 'Subscriptions', path: '/admin/subscriptions' },
  { id: 'users', icon: <Users className="w-5 h-5" />, label: 'Tenant Users', path: '/admin/users' },
  { id: 'features', icon: <Settings className="w-5 h-5" />, label: 'Feature Flags', path: '/admin/features' },
  { id: 'monitoring', icon: <BarChart3 className="w-5 h-5" />, label: 'System Monitor', path: '/admin/monitoring' },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">HotelOS</h1>
        <p className="text-sm text-slate-300 mt-1">Super Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-slate-700 border-l-4 border-indigo-500'
                  : 'hover:bg-slate-700 hover:translate-x-1'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-lg">
            👤
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Platform Administrator</p>
            <p className="text-xs text-slate-300">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
