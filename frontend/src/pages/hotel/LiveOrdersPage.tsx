import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ordersApi } from '../../api/ordersApi';
import type { Order as BackendOrder } from '../../types/backend.types';
import { getStatusBadgeClass } from '../../utils/hotelHelpers';

export const LiveOrdersPage = () => {
  // Data state
  const [orders, setOrders] = useState<BackendOrder[]>([]);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch orders on mount and auto-refresh
  useEffect(() => {
    fetchOrders();

    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      if (!loading) setUpdating(true);
      setError(null);

      const data = await ordersApi.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please refresh the page.');
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  // Helper: Determine order status from items
  const getOrderStatus = (order: BackendOrder): 'PENDING' | 'COOKING' | 'READY' | 'SERVED' => {
    const items = order.items || [];
    if (items.length === 0) return 'PENDING';

    const allReady = items.every(item => item.status === 'READY');
    const someCooking = items.some(item => item.status === 'COOKING');

    if (allReady) return 'READY';
    if (someCooking) return 'COOKING';
    return 'PENDING';
  };

  // Filter orders by status
  const pendingOrders = orders.filter((o) => getOrderStatus(o) === 'PENDING');
  const cookingOrders = orders.filter((o) => getOrderStatus(o) === 'COOKING');
  const readyOrders = orders.filter((o) => getOrderStatus(o) === 'READY');

  const OrderCard = ({ order }: { order: BackendOrder }) => {
    const orderStatus = getOrderStatus(order);
    const statusClass = getStatusBadgeClass(orderStatus.toLowerCase());

    return (
      <motion.div
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold text-gray-900">Order #{order.orderNumber}</p>
            <p className="text-sm text-gray-600">
              Table {order.table?.tableNumber || 'N/A'} • {order.waiterName || 'N/A'}
            </p>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        </div>
        <div className="space-y-1 mb-3">
          {order.items.map((item) => (
            <p key={item.id} className="text-sm text-gray-700">
              • {item.menuItemName} x{item.quantity}
            </p>
          ))}
        </div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
        >
          {orderStatus}
        </span>
      </motion.div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading live orders...</p>
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
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Live Orders Tracking
          </h2>
          <p className="text-gray-600 mt-1">Real-time order status updates</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-yellow-900 flex items-center gap-2">
              <span>⏰</span> Pending ({pendingOrders.length})
            </h3>
          </div>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        {/* Cooking Column */}
        <div>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-orange-900 flex items-center gap-2">
              <span>👨‍🍳</span> Cooking ({cookingOrders.length})
            </h3>
          </div>
          <div className="space-y-3">
            {cookingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        {/* Ready Column */}
        <div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <span>✅</span> Ready ({readyOrders.length})
            </h3>
          </div>
          <div className="space-y-3">
            {readyOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
