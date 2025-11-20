import React, { useState, useEffect } from 'react';
import { tablesApi } from '../api/tables';
import { menuApi } from '../api/menu';
import { ordersApi } from '../api/orders';
import { billsApi } from '../api/bills';
import type { RestaurantTable, MenuItem, Category, Order, OrderItem } from '../types/index';
import { useOrderStore } from '../store/orderStore';
import { formatCurrency, getStatusColor } from '../utils/format';
import { ShoppingCart, Plus, Minus, Trash2, Send, Clock, CheckCircle, Receipt, X, TrendingUp, Package, Table } from 'lucide-react';
import apiClient from '../api/client';

export const ServantDashboard: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'tables' | 'menu' | 'orders'>('dashboard');
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [dailyOrderCount, setDailyOrderCount] = useState(0);
  const [deliveredItems, setDeliveredItems] = useState<Set<number>>(new Set());

  const {
    cartItems,
    selectedTable,
    orderType,
    specialInstructions,
    setSelectedTable,
    setOrderType,
    setSpecialInstructions,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartAsOrderItems,
    getCartTotal,
  } = useOrderStore();

  useEffect(() => {
    loadTables();
    loadCategories();
    loadActiveOrders();
    loadDailyStats();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadMenuItems(selectedCategory);
    }
  }, [selectedCategory]);

  const loadTables = async () => {
    try {
      const data = await tablesApi.getAllTables();
      setTables(data);
    } catch (error) {
      console.error('Failed to load tables:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await menuApi.getActiveCategories();
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadMenuItems = async (categoryId: number) => {
    try {
      const data = await menuApi.getMenuItemsByCategory(categoryId);
      setMenuItems(data);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  };

  const loadActiveOrders = async () => {
    try {
      const data = await ordersApi.getActiveOrders();
      setActiveOrders(data);
    } catch (error) {
      console.error('Failed to load active orders:', error);
    }
  };

  const loadDailyStats = async () => {
    try {
      // Get today's orders - filtering active orders for today
      const allOrders = await ordersApi.getActiveOrders();
      const today = new Date().toDateString();
      const todayOrders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt).toDateString();
        return orderDate === today;
      });
      setDailyOrderCount(todayOrders.length);
    } catch (error) {
      console.error('Failed to load daily stats:', error);
    }
  };

  const handleTableSelect = (table: RestaurantTable) => {
    if (table.status === 'FREE') {
      setSelectedTable(table.id);
      setOrderType('DINE_IN');
      setView('menu');
      setShowCart(true);
    }
  };

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      await ordersApi.createOrder({
        tableId: orderType === 'DINE_IN' ? selectedTable || undefined : undefined,
        orderType,
        items: getCartAsOrderItems(),
        specialInstructions,
      });

      clearCart();
      setShowCart(false);
      setView('orders');
      loadActiveOrders();
      loadTables();
      loadDailyStats();
      alert('Order submitted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    if (!selectedOrder || !customerPhone) {
      alert('Please enter customer phone number');
      return;
    }

    setLoading(true);
    try {
      await ordersApi.addCustomerPhone(selectedOrder.id, customerPhone);
      const bill = await billsApi.createBill({
        orderId: selectedOrder.id,
        customerPhone,
      });

      alert(`Bill generated! Bill Number: ${bill.billNumber}`);
      setShowBillModal(false);
      setSelectedOrder(null);
      setCustomerPhone('');
      loadActiveOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate bill');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkItemDelivered = async (orderId: number, itemId: number) => {
    setLoading(true);
    try {
      await apiClient.patch(`/orders/${orderId}/items/${itemId}/delivered`);
      setDeliveredItems(prev => new Set(prev).add(itemId));
      loadActiveOrders();
      alert('Item marked as delivered!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to mark item as delivered');
    } finally {
      setLoading(false);
    }
  };

  const handleClearTable = async (tableId: number) => {
    if (!confirm('Are you sure you want to clear this table?')) {
      return;
    }

    setLoading(true);
    try {
      await tablesApi.updateTableStatus(tableId, 'FREE');
      loadTables();
      loadActiveOrders();
      alert('Table cleared successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to clear table');
    } finally {
      setLoading(false);
    }
  };

  const freeTablesCount = tables.filter(t => t.status === 'FREE').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 py-4">
            <button
              onClick={() => {
                setView('dashboard');
                loadDailyStats();
                loadActiveOrders();
                loadTables();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'dashboard'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setView('tables')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'tables'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tables
            </button>
            <button
              onClick={() => setView('menu')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'menu'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => {
                setView('orders');
                loadActiveOrders();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'orders'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active Orders ({activeOrders.length})
            </button>

            {cartItems.length > 0 && (
              <button
                onClick={() => setShowCart(!showCart)}
                className="ml-auto flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({cartItems.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className={`flex-1 ${showCart ? 'lg:mr-96' : ''}`}>
            {view === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="card bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Today's Orders</p>
                        <p className="text-3xl font-bold text-blue-600">{dailyOrderCount}</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>

                  <div className="card bg-green-50 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Available Tables</p>
                        <p className="text-3xl font-bold text-green-600">{freeTablesCount}</p>
                      </div>
                      <Table className="w-12 h-12 text-green-600" />
                    </div>
                  </div>

                  <div className="card bg-orange-50 border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Orders</p>
                        <p className="text-3xl font-bold text-orange-600">{activeOrders.length}</p>
                      </div>
                      <Package className="w-12 h-12 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* All Orders List */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">All Orders</h3>
                  <div className="space-y-4">
                    {activeOrders.map((order) => (
                      <div key={order.id} className="card">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{order.orderNumber}</h4>
                            <p className="text-sm text-gray-600">
                              {order.tableNumber ? `Table: ${order.tableNumber}` : order.orderType}
                            </p>
                          </div>
                          <span className={`badge ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Items: {order.items.length} | Total: {formatCurrency(order.totalAmount)}
                        </div>
                      </div>
                    ))}
                    {activeOrders.length === 0 && (
                      <p className="text-gray-500 text-center py-8">No active orders</p>
                    )}
                  </div>
                </div>

                {/* Available Tables */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Available Tables ({freeTablesCount})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tables
                      .filter(table => table.status === 'FREE')
                      .map((table) => (
                        <div
                          key={table.id}
                          className="p-4 rounded-lg border-2 border-green-300 bg-green-50"
                        >
                          <div className="text-xl font-bold text-green-700">{table.tableNumber}</div>
                          <div className="text-sm text-gray-600">Capacity: {table.capacity}</div>
                        </div>
                      ))}
                    {freeTablesCount === 0 && (
                      <p className="text-gray-500 col-span-full text-center py-8">No available tables</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {view === 'tables' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Select Table</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tables.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => handleTableSelect(table)}
                      disabled={table.status !== 'FREE'}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        table.status === 'FREE'
                          ? 'border-green-300 bg-green-50 hover:border-green-500 hover:shadow-md cursor-pointer'
                          : 'border-red-300 bg-red-50 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="text-2xl font-bold mb-2">{table.tableNumber}</div>
                      <div className="text-sm text-gray-600">Capacity: {table.capacity}</div>
                      <div className={`mt-2 text-xs font-medium ${getStatusColor(table.status)}`}>
                        {table.status}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Or select order type:</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setOrderType('PARCEL');
                        setSelectedTable(null);
                        setView('menu');
                        setShowCart(true);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Parcel Order
                    </button>
                    <button
                      onClick={() => {
                        setOrderType('TAKEAWAY');
                        setSelectedTable(null);
                        setView('menu');
                        setShowCart(true);
                      }}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Takeaway Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {view === 'menu' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Menu</h2>

                {/* Category Tabs */}
                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        {item.isVeg ? (
                          <span className="text-green-600 text-xs">● VEG</span>
                        ) : (
                          <span className="text-red-600 text-xs">● NON-VEG</span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary-600">
                          {formatCurrency(item.price)}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="btn btn-primary btn-sm flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Active Orders</h2>
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="card">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600">
                            {order.tableNumber || order.orderType} • {order.createdBy}
                          </p>
                        </div>
                        <span className={`badge ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Item-by-Item Display with Delivery Tracking */}
                      <div className="space-y-3 mb-4">
                        {order.items.map((item) => {
                          const isDelivered = deliveredItems.has(item.id);
                          return (
                            <div key={item.id} className="flex justify-between items-center border-b pb-2">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">
                                    {item.quantity}x {item.menuItemName}
                                  </span>
                                  {isDelivered && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Status: {item.itemStatus} {isDelivered && '• Delivered'}
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-sm">{formatCurrency(item.totalPrice)}</span>
                                {order.status === 'READY' && !isDelivered && (
                                  <button
                                    onClick={() => handleMarkItemDelivered(order.id, item.id)}
                                    disabled={loading}
                                    className="btn btn-success btn-sm flex items-center space-x-1"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Delivered</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="font-bold">Total: {formatCurrency(order.totalAmount)}</span>
                        <div className="flex space-x-2">
                          {order.status === 'READY' && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowBillModal(true);
                              }}
                              className="btn btn-success btn-sm flex items-center space-x-1"
                            >
                              <Receipt className="w-4 h-4" />
                              <span>Generate Bill</span>
                            </button>
                          )}
                          {order.status === 'COMPLETED' && order.tableId && (
                            <button
                              onClick={() => handleClearTable(order.tableId!)}
                              disabled={loading}
                              className="btn btn-primary btn-sm flex items-center space-x-1"
                            >
                              <Table className="w-4 h-4" />
                              <span>Clear Table</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Shopping Cart Sidebar */}
          {showCart && (
            <div className="fixed lg:static right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl lg:shadow-none overflow-y-auto z-50">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Order Cart</h2>
                  <button onClick={() => setShowCart(false)} className="lg:hidden">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.menuItem.id} className="border-b pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{item.menuItem.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  updateCartItemQuantity(item.menuItem.id, item.quantity - 1)
                                }
                                className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateCartItemQuantity(item.menuItem.id, item.quantity + 1)
                                }
                                className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="font-bold">
                              {formatCurrency(item.menuItem.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <label className="label">Special Instructions</label>
                      <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="input"
                        rows={3}
                        placeholder="Any special requests..."
                      />
                    </div>

                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary-600">{formatCurrency(getCartTotal())}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      className="w-full btn btn-primary flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>{loading ? 'Submitting...' : 'Submit Order'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bill Generation Modal */}
      {showBillModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Generate Bill</h3>
            <p className="text-gray-600 mb-4">
              Order: {selectedOrder.orderNumber}
            </p>
            <div className="mb-4">
              <label className="label">Customer Phone Number *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="input"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowBillModal(false);
                  setSelectedOrder(null);
                  setCustomerPhone('');
                }}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateBill}
                disabled={loading || !customerPhone}
                className="flex-1 btn btn-primary"
              >
                {loading ? 'Generating...' : 'Generate Bill'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
