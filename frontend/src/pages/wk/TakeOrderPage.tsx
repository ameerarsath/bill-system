import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Search, ShoppingCart, X, CheckCircle, Loader2 } from 'lucide-react';
import { menuApi } from '../../api/menuApi';
import { tablesApi } from '../../api/tablesApi';
import { ordersApi } from '../../api/ordersApi';
import type { MenuItem as BackendMenuItem, Category, RestaurantTable } from '../../types/backend.types';

// Frontend CartItem type
interface CartItem {
  menuItem: BackendMenuItem;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export const TakeOrderPage = () => {
  // Data state
  const [menuItems, setMenuItems] = useState<BackendMenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showCart, setShowCart] = useState(false);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Fetch menu data and tables on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [items, cats, availableTables] = await Promise.all([
          menuApi.getAvailableMenuItems(),
          menuApi.getAllCategories(),
          tablesApi.getAvailableTables()
        ]);

        setMenuItems(items);
        setCategories(cats);
        setTables(availableTables);
      } catch (err) {
        console.error('Failed to fetch menu data:', err);
        setError('Failed to load menu. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  // Cart operations
  const addToCart = (menuItem: BackendMenuItem) => {
    const existingItem = cart.find((item) => item.menuItem.id === menuItem.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * menuItem.price }
            : item
        )
      );
    } else {
      setCart([...cart, { menuItem, quantity: 1, subtotal: menuItem.price }]);
    }
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.menuItem.id === itemId
            ? {
                ...item,
                quantity: item.quantity + delta,
                subtotal: (item.quantity + delta) * item.menuItem.price,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((item) => item.menuItem.id !== itemId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Place order via API
  const handlePlaceOrder = async () => {
    if (cart.length === 0 || !selectedTable) return;

    try {
      setPlacingOrder(true);

      const orderData = {
        tableId: selectedTable,
        orderType: 'DINE_IN' as const,
        items: cart.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          notes: item.notes || ''
        }))
      };

      await ordersApi.createOrder(orderData);

      setOrderPlaced(true);
      setTimeout(() => {
        setCart([]);
        setSelectedTable(null);
        setOrderPlaced(false);
        setShowCart(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Menu</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Take Order</h1>
          <p className="text-slate-500 text-sm mt-1">Select items and place order</p>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setShowCart(true)}
          className="food-button-primary relative flex items-center gap-2 justify-center"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>View Cart ({totalItems})</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="food-card p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 food-card">
          <p className="text-slate-500">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              className="food-card p-4 hover:shadow-xl transition-all cursor-pointer"
              whileHover={{ y: -4 }}
              onClick={() => addToCart(item)}
            >
              <div className="flex items-start gap-4">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-3xl flex-shrink-0">
                  {item.imageUrl || '🍽️'}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.categoryName}</p>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-primary-600">₹{item.price}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                  className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors flex-shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col">
            {/* Cart Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Your Order</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Table Selection */}
            <div className="p-6 border-b border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Table *
              </label>
              <select
                value={selectedTable || ''}
                onChange={(e) => setSelectedTable(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              >
                <option value="">Choose a table...</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    Table {table.tableNumber} (Capacity: {table.capacity})
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.menuItem.id} className="food-card p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl">
                        {item.menuItem.imageUrl || '🍽️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 text-sm truncate">
                          {item.menuItem.name}
                        </h4>
                        <p className="text-primary-600 font-bold text-sm">
                          ₹{item.subtotal}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="p-1 rounded-lg hover:bg-red-50 text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, -1)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, 1)}
                        className="w-8 h-8 rounded-lg bg-primary-500 text-white hover:bg-primary-600 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-slate-800">Total</span>
                  <span className="text-primary-600">₹{totalAmount}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedTable || orderPlaced || placingOrder}
                  className="food-button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placingOrder ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : orderPlaced ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Order Placed!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Place Order</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
