import { motion } from 'framer-motion';
import { mockOrders } from '../../data/mockHotelData';
import { getStatusBadgeClass } from '../../utils/hotelHelpers';

export const LiveOrdersPage = () => {
  const pendingOrders = mockOrders.filter((o) => o.status === 'pending');
  const cookingOrders = mockOrders.filter((o) => o.status === 'cooking');
  const readyOrders = mockOrders.filter((o) => o.status === 'ready');

  const OrderCard = ({ order }: { order: typeof mockOrders[0] }) => (
    <motion.div
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-gray-900">{order.id}</p>
          <p className="text-sm text-gray-600">
            {order.tableNo} • {order.waiter}
          </p>
        </div>
        <span className="text-xs text-gray-500">{order.time}</span>
      </div>
      <div className="space-y-1 mb-3">
        {order.items.map((item, idx) => (
          <p key={idx} className="text-sm text-gray-700">
            • {item}
          </p>
        ))}
      </div>
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
          order.status
        )}`}
      >
        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
      </span>
    </motion.div>
  );

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
