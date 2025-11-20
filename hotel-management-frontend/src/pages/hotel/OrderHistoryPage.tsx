import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export const OrderHistoryPage = () => {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <p className="text-gray-600 mt-1">View all completed orders</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center py-12">
          <span className="text-6xl">📜</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
            Order History
          </h3>
          <p className="text-gray-600">
            Complete order history with filters coming soon
          </p>
        </div>
      </motion.div>
    </div>
  );
};
