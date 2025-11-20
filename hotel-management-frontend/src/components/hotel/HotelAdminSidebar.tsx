import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Clock,
  History,
  UtensilsCrossed,
  Users,
  Settings,
} from 'lucide-react';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'Dashboard',
    path: '/hotel',
  },
  {
    id: 'billing',
    icon: <Receipt className="w-5 h-5" />,
    label: 'Billing',
    path: '/hotel/billing',
  },
  {
    id: 'live-orders',
    icon: <Clock className="w-5 h-5" />,
    label: 'Live Orders',
    path: '/hotel/live-orders',
  },
  {
    id: 'order-history',
    icon: <History className="w-5 h-5" />,
    label: 'Order History',
    path: '/hotel/order-history',
  },
  {
    id: 'menu',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    label: 'Menu Management',
    path: '/hotel/menu',
  },
  {
    id: 'staff',
    icon: <Users className="w-5 h-5" />,
    label: 'Staff Management',
    path: '/hotel/staff',
  },
  {
    id: 'settings',
    icon: <Settings className="w-5 h-5" />,
    label: 'Settings',
    path: '/hotel/settings',
  },
];

export const HotelAdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white h-screen flex flex-col fixed left-0 top-0 z-50 border-r border-slate-200">
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="food-icon-circle food-icon-circle-primary text-2xl">
            🏨
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Hotel Admin</h1>
            <p className="text-xs text-slate-500">Owner Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'text-slate-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-200">
        <div className="food-card-soft p-3 flex items-center gap-3">
          <div className="food-avatar text-sm">
            HO
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-slate-800 truncate">Hotel Owner</p>
            <p className="text-xs text-slate-500 truncate">owner@hotel.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
