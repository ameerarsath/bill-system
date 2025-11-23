import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, User } from 'lucide-react';
import { getCurrentTime } from '../../utils/hotelHelpers';
import { useAuth } from '../../context/AuthContext';

export const HotelAdminHeader = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-4 flex items-center justify-between flex-shrink-0">
      {/* Welcome Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span>Welcome Back, {user?.name}!</span>
          <span className="text-2xl">👋</span>
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">
          {currentTime} • Manage your hotel operations
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
          <Search className="w-4 h-4" />
          <span className="text-sm">Search</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="food-avatar cursor-pointer hover:ring-2 hover:ring-primary-400 transition-all"
          >
            {user?.name.charAt(0).toUpperCase() || 'HO'}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-slate-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors text-slate-700"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
