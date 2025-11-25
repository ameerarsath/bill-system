import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Loader2 } from 'lucide-react';
import { ordersApi } from '../../api/ordersApi';
import { billsApi } from '../../api/billsApi';
import { formatCurrency } from '../../utils/hotelHelpers';

interface DashboardData {
  todayRevenue: number;
  totalOrders: number;
  totalBills: number;
  activeOrders: number;
}

export const HotelDashboard = () => {
  // Data state
  const [data, setData] = useState<DashboardData>({
    todayRevenue: 0,
    totalOrders: 0,
    totalBills: 0,
    activeOrders: 0,
  });

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orders, bills] = await Promise.all([
        ordersApi.getAllOrders(),
        billsApi.getAllBills()
      ]);

      // Calculate today's revenue (from paid bills today)
      const today = new Date().toDateString();
      const todayRevenue = bills
        .filter(bill => {
          const billDate = new Date(bill.createdAt || '').toDateString();
          return billDate === today && bill.paymentStatus === 'PAID';
        })
        .reduce((sum, bill) => sum + bill.totalAmount, 0);

      // Calculate active orders (orders with items not all READY)
      const activeOrders = orders.filter(order => {
        const items = order.items || [];
        return items.length > 0 && !items.every(item => item.status === 'READY');
      }).length;

      setData({
        todayRevenue,
        totalOrders: orders.length,
        totalBills: bills.length,
        activeOrders,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
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
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 food-page-enter">
        <div className="max-w-2xl mx-auto mt-12">
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => fetchDashboardData()}
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
    <div className="space-y-6 food-page-enter">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Track your restaurant's performance and key metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Revenue Card */}
        <motion.div
          className="food-stat-card group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-medium mb-1">
                Today's Revenue
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                {formatCurrency(data.todayRevenue)}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Today's total revenue
              </p>
            </div>
            <div className="food-icon-circle food-icon-circle-primary">
              💰
            </div>
          </div>
        </motion.div>

        {/* Orders Card */}
        <motion.div
          className="food-stat-card group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-medium mb-1">Total Orders</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                {data.totalOrders}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                All time orders
              </p>
            </div>
            <div className="food-icon-circle food-icon-circle-success">
              🛍️
            </div>
          </div>
        </motion.div>

        {/* Bills Card */}
        <motion.div
          className="food-stat-card group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-medium mb-1">Total Bills</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                {data.totalBills}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                All time bills
              </p>
            </div>
            <div className="food-icon-circle food-icon-circle-warning">
              📦
            </div>
          </div>
        </motion.div>

        {/* Active Orders Card */}
        <motion.div
          className="food-stat-card group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -4 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-medium mb-1">
                Active Orders
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                {data.activeOrders}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Currently in progress
              </p>
            </div>
            <div className="food-icon-circle food-icon-circle-primary">
              👨‍🍳
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info Section */}
      <motion.div
        className="food-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center py-8">
          <div className="food-icon-circle food-icon-circle-primary text-3xl mx-auto mb-4">
            📊
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Dashboard Overview</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your hotel's key performance metrics are displayed above. Use the navigation menu to access detailed reports and management features.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
