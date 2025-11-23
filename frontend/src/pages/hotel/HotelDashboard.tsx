import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { mockDashboardData } from '../../data/mockHotelData';
import { formatCurrency } from '../../utils/hotelHelpers';

export const HotelDashboard = () => {
  const data = mockDashboardData;
  const maxRevenue = Math.max(...data.salesChart.map((d) => d.revenue));

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
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-success-600" />
                <p className="text-xs text-success-600 font-semibold">
                  +12.5% from yesterday
                </p>
              </div>
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
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-success-600" />
                <p className="text-xs text-success-600 font-semibold">
                  +8.2% from yesterday
                </p>
              </div>
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
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-success-600" />
                <p className="text-xs text-success-600 font-semibold">
                  +5.4% from yesterday
                </p>
              </div>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sales */}
        <motion.div
          className="food-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Weekly Sales</h3>
              <p className="text-sm text-slate-500 mt-0.5">Revenue breakdown by day</p>
            </div>
            <div className="food-icon-circle food-icon-circle-primary text-lg">
              📊
            </div>
          </div>
          <div className="space-y-4">
            {data.salesChart.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {item.day}
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.6 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Items */}
        <motion.div
          className="food-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Top Selling Items</h3>
              <p className="text-sm text-slate-500 mt-0.5">Best performers this week</p>
            </div>
            <div className="food-icon-circle food-icon-circle-primary text-lg">
              🏆
            </div>
          </div>
          <div className="space-y-3">
            {data.topItems.map((item, index) => (
              <motion.div
                key={item.name}
                className="food-card-soft p-4 hover:shadow-md transition-all cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary-500/25">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.orders} orders</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800">
                    {formatCurrency(item.revenue)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
