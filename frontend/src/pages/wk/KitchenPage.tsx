import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, ChefHat, RotateCcw } from 'lucide-react';

interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

interface KitchenOrder {
  id: string;
  tableNumber: string;
  items: KitchenOrderItem[];
  status: 'pending' | 'cooking' | 'ready';
  timeElapsed: number;
  priority: 'normal' | 'urgent';
  timestamp: string;
}

// Mock kitchen orders
const MOCK_ORDERS: KitchenOrder[] = [
  {
    id: 'KOT-001',
    tableNumber: '12',
    items: [
      { id: '1', name: 'Paneer Butter Masala', quantity: 2 },
      { id: '2', name: 'Naan', quantity: 4 },
    ],
    status: 'pending',
    timeElapsed: 5,
    priority: 'urgent',
    timestamp: '10:30 AM',
  },
  {
    id: 'KOT-002',
    tableNumber: '8',
    items: [
      { id: '3', name: 'Chicken Biryani', quantity: 1 },
      { id: '4', name: 'Raita', quantity: 1 },
    ],
    status: 'cooking',
    timeElapsed: 12,
    priority: 'normal',
    timestamp: '10:23 AM',
  },
  {
    id: 'KOT-003',
    tableNumber: '5',
    items: [
      { id: '5', name: 'Veg Fried Rice', quantity: 2 },
      { id: '6', name: 'Manchurian', quantity: 1 },
    ],
    status: 'ready',
    timeElapsed: 18,
    priority: 'normal',
    timestamp: '10:17 AM',
  },
];

export const KitchenPage = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'cooking' | 'ready'>('all');

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'cooking' | 'ready') => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'cooking':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'ready':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
          <AlertCircle className="w-3 h-3" />
          Urgent
        </span>
      );
    }
    return null;
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const cookingCount = orders.filter((o) => o.status === 'cooking').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Kitchen Display</h1>
        <p className="text-slate-500 text-sm mt-1">Manage incoming orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="food-card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500 bg-opacity-20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
              <p className="text-sm text-yellow-600">Pending Orders</p>
            </div>
          </div>
        </div>

        <div className="food-card p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{cookingCount}</p>
              <p className="text-sm text-blue-600">Cooking</p>
            </div>
          </div>
        </div>

        <div className="food-card p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500 bg-opacity-20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{readyCount}</p>
              <p className="text-sm text-green-600">Ready to Serve</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'cooking', 'ready'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all capitalize ${
              filter === status
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            className="food-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            layout
          >
            {/* Order Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Table {order.tableNumber}</h3>
                <p className="text-xs text-slate-500">{order.id} • {order.timestamp}</p>
              </div>
              {getPriorityBadge(order.priority)}
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-700">{item.name}</span>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg text-xs">
                    x{item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className="text-sm text-slate-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {order.timeElapsed} min
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {order.status === 'pending' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'cooking')}
                  className="w-full px-4 py-2.5 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors"
                >
                  Start Cooking
                </button>
              )}

              {order.status === 'cooking' && (
                <>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="w-full px-4 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
                  >
                    Mark Ready
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'pending')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Back to Pending
                  </button>
                </>
              )}

              {order.status === 'ready' && (
                <>
                  <div className="w-full px-4 py-2.5 rounded-xl bg-green-100 text-green-700 font-semibold text-sm text-center flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Ready to Serve
                  </div>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'cooking')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Back to Cooking
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No orders in this category</p>
        </div>
      )}
    </div>
  );
};
