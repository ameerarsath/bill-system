import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut } from 'lucide-react';
import { getCurrentTime } from '../../utils/hotelHelpers';
import { useAuth } from '../../context/AuthContext';

interface WKHeaderProps {
  onMenuClick: () => void;
}

export const WKHeader = ({ onMenuClick }: WKHeaderProps) => {
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

  const getRoleDisplay = () => {
    if (user?.role === 'waiter') return 'Waiter Panel';
    if (user?.role === 'kitchen') return 'Kitchen Panel';
    return 'Staff Panel';
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>

        {/* Title */}
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800">
            {getRoleDisplay()}
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">
            {currentTime}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="food-avatar cursor-pointer hover:ring-2 hover:ring-primary-400 transition-all"
          >
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-slate-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <p className="text-xs text-primary-600 font-medium mt-1 capitalize">
                  {user?.role}
                </p>
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
