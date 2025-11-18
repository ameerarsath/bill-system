import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, Home, UtensilsCrossed, ChefHat, CreditCard, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <>{children}</>;

  const getNavLinks = () => {
    switch (user.role) {
      case 'ADMIN':
        return [
          { to: '/admin', label: 'Dashboard', icon: Home },
          { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
          { to: '/admin/tables', label: 'Tables', icon: Settings },
        ];
      case 'SERVANT':
        return [
          { to: '/servant', label: 'Tables', icon: Home },
          { to: '/servant/orders', label: 'Orders', icon: UtensilsCrossed },
        ];
      case 'KITCHEN':
        return [
          { to: '/kitchen', label: 'Kitchen Display', icon: ChefHat },
        ];
      case 'CASHIER':
        return [
          { to: '/cashier', label: 'Cashier', icon: CreditCard },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-primary-600">
                Hotel Billing System
              </h1>

              <nav className="hidden md:flex space-x-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-gray-500 text-xs">{user.role}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
