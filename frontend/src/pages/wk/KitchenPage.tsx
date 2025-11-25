import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, ChefHat, RotateCcw, Loader2 } from 'lucide-react';
import { kitchenApi } from '../../api/kitchenApi';
import type { KitchenOrder as BackendKitchenOrder, OrderItemStatus } from '../../types/backend.types';

export const KitchenPage = () => {
  // Data state
  const [orders, setOrders] = useState<BackendKitchenOrder[]>([]);
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'COOKING' | 'READY'>('all');

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch kitchen orders
  useEffect(() => {
    fetchOrders();

    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      if (!loading) setUpdating(true); // Show updating indicator for subsequent fetches
      setError(null);

      const [pending, cooking, ready] = await Promise.all([
        kitchenApi.getPendingOrders(),
        kitchenApi.getCookingOrders(),
        kitchenApi.getReadyOrders()
      ]);

      setOrders([...pending, ...cooking, ...ready]);
    } catch (err) {
      console.error('Failed to fetch kitchen orders:', err);
      setError('Failed to load kitchen orders. Please refresh the page.');
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  // Helper: Determine order status from items
  const getOrderStatus = (order: BackendKitchenOrder): 'PENDING' | 'COOKING' | 'READY' => {
    const items = order.items || [];
    if (items.length === 0) return 'PENDING';

    const allReady = items.every(item => item.status === 'READY');
    const someCooking = items.some(item => item.status === 'COOKING');

    if (allReady) return 'READY';
    if (someCooking) return 'COOKING';
    return 'PENDING';
  };

  // Filter orders based on status
  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => getOrderStatus(o) === filter);

  // Update item status via API
  const updateOrderStatus = async (orderId: number, newStatus: OrderItemStatus) => {
    try {
      // Mark all items in the order with the new status
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      if (newStatus === 'READY') {
        await kitchenApi.markAllItemsReady(orderId);
      } else {
        // Update each item individually
        for (const item of order.items) {
          await kitchenApi.updateItemStatus(orderId, item.id, { status: newStatus });
        }
      }

      // Refresh orders
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'COOKING':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'READY':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  // Calculate time elapsed
  const getTimeElapsed = (createdAt: string): number => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60)); // minutes
  };

  const pendingCount = orders.filter((o) => getOrderStatus(o) === 'PENDING').length;
  const cookingCount = orders.filter((o) => getOrderStatus(o) === 'COOKING').length;
  const readyCount = orders.filter((o) => getOrderStatus(o) === 'READY').length;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading kitchen orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => fetchOrders()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        {(['all', 'PENDING', 'COOKING', 'READY'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all capitalize ${
              filter === status
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.map((order) => {
          const orderStatus = getOrderStatus(order);
          const timeElapsed = getTimeElapsed(order.createdAt);

          return (
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
                  <p className="text-xs text-slate-500">Order #{order.orderNumber}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-700">{item.menuItemName}</span>
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg text-xs">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize ${getStatusColor(orderStatus)}`}>
                  {orderStatus}
                </span>
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {timeElapsed} min
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {orderStatus === 'PENDING' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'COOKING')}
                    className="w-full px-4 py-2.5 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors"
                  >
                    Start Cooking
                  </button>
                )}

                {orderStatus === 'COOKING' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'READY')}
                      className="w-full px-4 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
                    >
                      Mark Ready
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'PENDING')}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Back to Pending
                    </button>
                  </>
                )}

                {orderStatus === 'READY' && (
                  <>
                    <div className="w-full px-4 py-2.5 rounded-xl bg-green-100 text-green-700 font-semibold text-sm text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Ready to Serve
                    </div>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'COOKING')}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Back to Cooking
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
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
