import { NavLink } from 'react-router-dom';
import { X, UtensilsCrossed, ChefHat, Receipt, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PremiumLogo } from '../shared/PremiumLogo';

interface WKSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WKSidebar = ({ isOpen, onClose }: WKSidebarProps) => {
  const { user } = useAuth();

  const waiterLinks = [
    { to: '/wk/take-order', icon: UtensilsCrossed, label: 'Take Order' },
    { to: '/wk/billing', icon: Receipt, label: 'Billing' },
    { to: '/wk/order-history', icon: History, label: 'Order History' },
  ];

  const kitchenLinks = [
    { to: '/wk/kitchen', icon: ChefHat, label: 'Kitchen Display' },
    { to: '/wk/order-history', icon: History, label: 'Order History' },
  ];

  const links = user?.role === 'waiter' ? waiterLinks : kitchenLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-slate-900 to-slate-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <PremiumLogo variant="white" />
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="food-card p-4 bg-white/5 backdrop-blur-sm">
            <p className="text-white/90 text-sm font-semibold">{user?.name}</p>
            <p className="text-white/60 text-xs mt-1 capitalize">{user?.role}</p>
          </div>
        </div>
      </aside>
    </>
  );
};
