import React, { useState, useEffect } from 'react';
import { kitchenApi } from '../api/kitchen';
import type { KitchenOrder } from '../types/index';
import { formatTime, getStatusColor } from '../utils/format';
import { Clock, ChefHat, CheckCircle, PlayCircle } from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const [pendingOrders, setPendingOrders] = useState<KitchenOrder[]>([]);
  const [cookingOrders, setCookingOrders] = useState<KitchenOrder[]>([]);
  const [readyOrders, setReadyOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadOrders();

    // Auto-refresh every 3 seconds
    const interval = setInterval(() => {
      loadOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const [pending, cooking, ready] = await Promise.all([
        kitchenApi.getPendingOrders(),
        kitchenApi.getCookingOrders(),
        kitchenApi.getReadyOrders(),
      ]);

      setPendingOrders(pending);
      setCookingOrders(cooking);
      setReadyOrders(ready);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleStartCooking = async (orderId: number) => {
    setLoading(true);
    try {
      await kitchenApi.startCookingOrder(orderId);
      await loadOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to start cooking');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReady = async (orderId: number) => {
    setLoading(true);
    try {
      await kitchenApi.markOrderReady(orderId);
      await loadOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to mark ready');
    } finally {
      setLoading(false);
    }
  };

  const handleItemStatusUpdate = async (itemId: number, status: string) => {
    setLoading(true);
    try {
      await kitchenApi.updateItemStatus(itemId, status);
      await loadOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const OrderCard: React.FC<{ order: KitchenOrder; section: 'pending' | 'cooking' | 'ready' }> = ({
    order,
    section,
  }) => (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{order.orderNumber}</h3>
          <p className="text-sm text-gray-600">
            {order.tableNumber} • {formatTime(order.createdAt)}
          </p>
        </div>
        <span className="text-xs text-gray-500">
          <Clock className="w-4 h-4 inline" /> {formatTime(order.createdAt)}
        </span>
      </div>

      {order.specialInstructions && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <span className="font-semibold">Note:</span> {order.specialInstructions}
        </div>
      )}

      <div className="space-y-2 mb-4">
        {order.items.map((item) => (
          <div key={item.itemId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{item.quantity}x</span>
                <span>{item.itemName}</span>
                {item.isVeg ? (
                  <span className="text-green-600 text-xs">●</span>
                ) : (
                  <span className="text-red-600 text-xs">●</span>
                )}
              </div>
              {item.specialNotes && (
                <p className="text-xs text-gray-600 italic mt-1">{item.specialNotes}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {section === 'cooking' && item.status !== 'READY' && (
                <button
                  onClick={() => handleItemStatusUpdate(item.itemId, 'READY')}
                  disabled={loading}
                  className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                >
                  Ready
                </button>
              )}
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {section === 'pending' && (
        <button
          onClick={() => handleStartCooking(order.orderId)}
          disabled={loading}
          className="w-full btn btn-primary flex items-center justify-center space-x-2"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Start Cooking</span>
        </button>
      )}

      {section === 'cooking' && (
        <button
          onClick={() => handleMarkReady(order.orderId)}
          disabled={loading}
          className="w-full btn btn-success flex items-center justify-center space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Mark All Ready</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold">Kitchen Display System</h1>
            </div>
            <div className="text-sm text-gray-600">
              Last update: {formatTime(lastUpdate.toISOString())} • Auto-refresh: 3s
            </div>
          </div>
        </div>
      </div>

      {/* Orders Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Column */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Pending ({pendingOrders.length})</span>
              </h2>
            </div>
            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <div className="card text-center text-gray-500 py-8">
                  No pending orders
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <OrderCard key={order.orderId} order={order} section="pending" />
                ))
              )}
            </div>
          </div>

          {/* Cooking Column */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Cooking ({cookingOrders.length})</span>
              </h2>
            </div>
            <div className="space-y-4">
              {cookingOrders.length === 0 ? (
                <div className="card text-center text-gray-500 py-8">
                  No orders cooking
                </div>
              ) : (
                cookingOrders.map((order) => (
                  <OrderCard key={order.orderId} order={order} section="cooking" />
                ))
              )}
            </div>
          </div>

          {/* Ready Column */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Ready ({readyOrders.length})</span>
              </h2>
            </div>
            <div className="space-y-4">
              {readyOrders.length === 0 ? (
                <div className="card text-center text-gray-500 py-8">
                  No ready orders
                </div>
              ) : (
                readyOrders.map((order) => (
                  <OrderCard key={order.orderId} order={order} section="ready" />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
