import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, UtensilsCrossed, Users, Receipt, TrendingUp } from 'lucide-react';
import { menuApi } from '../../api/menuApi';
import { ordersApi } from '../../api/ordersApi';
import { billsApi } from '../../api/billsApi';

interface DashboardStats {
  totalMenuItems: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export const AdminDashboard = () => {
  // Data state
  const [stats, setStats] = useState<DashboardStats>({
    totalMenuItems: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard statistics
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [menuItems, orders, bills] = await Promise.all([
        menuApi.getAllMenuItems(),
        ordersApi.getAllOrders(),
        billsApi.getAllBills()
      ]);

      // Calculate pending orders (orders with items not all READY)
      const pendingCount = orders.filter(order => {
        const items = order.items || [];
        return !items.every(item => item.status === 'READY');
      }).length;

      // Calculate total revenue from paid bills
      const totalRevenue = bills
        .filter(bill => bill.paymentStatus === 'PAID')
        .reduce((sum, bill) => sum + bill.totalAmount, 0);

      setStats({
        totalMenuItems: menuItems.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders: pendingCount,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => fetchStats()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hotel Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your hotel operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Menu Items</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalMenuItems}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Available menu items</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Orders</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">All time orders</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Orders</p>
              <p className="text-3xl font-bold text-rose-600 mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-rose-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">In progress</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-3xl font-bold text-violet-600 mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-violet-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">From paid bills</p>
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <UtensilsCrossed className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Manage Menu</h4>
              <p className="text-sm text-gray-600">Add, edit, or remove menu items</p>
            </button>

            <button className="p-4 bg-gradient-to-r from-emerald-50 to-white rounded-lg border border-emerald-100 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">View Orders</h4>
              <p className="text-sm text-gray-600">Monitor live orders and status</p>
            </button>

            <button className="p-4 bg-gradient-to-r from-violet-50 to-white rounded-lg border border-violet-100 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                <Receipt className="w-5 h-5 text-violet-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Billing</h4>
              <p className="text-sm text-gray-600">Manage bills and payments</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
