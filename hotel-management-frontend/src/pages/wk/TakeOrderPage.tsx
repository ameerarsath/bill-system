import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Search, ShoppingCart, X, CheckCircle } from 'lucide-react';
import type { MenuItem, CartItem } from '../../types/waiter-kitchen.types';

// Mock menu data
const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    price: 280,
    image: '🧈',
    available: true,
    preparationTime: 20,
    isVeg: true,
  },
  {
    id: '2',
    name: 'Chicken Biryani',
    category: 'Main Course',
    price: 320,
    image: '🍛',
    available: true,
    preparationTime: 25,
    isVeg: false,
  },
  {
    id: '3',
    name: 'Veg Fried Rice',
    category: 'Rice',
    price: 180,
    image: '🍚',
    available: true,
    preparationTime: 15,
    isVeg: true,
  },
  {
    id: '4',
    name: 'Chicken Tikka',
    category: 'Starter',
    price: 260,
    image: '🍗',
    available: true,
    preparationTime: 18,
    isVeg: false,
  },
  {
    id: '5',
    name: 'Gulab Jamun',
    category: 'Dessert',
    price: 80,
    image: '🍮',
    available: true,
    preparationTime: 5,
    isVeg: true,
  },
  {
    id: '6',
    name: 'Masala Dosa',
    category: 'Breakfast',
    price: 120,
    image: '🥞',
    available: true,
    preparationTime: 12,
    isVeg: true,
  },
];

const CATEGORIES = ['All', 'Starter', 'Main Course', 'Rice', 'Breakfast', 'Dessert'];

export const TakeOrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const addToCart = (menuItem: MenuItem) => {
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

  const updateQuantity = (itemId: string, delta: number) => {
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

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.menuItem.id !== itemId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0 || !tableNumber) return;

    // Simulate order placement
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setTableNumber('');
      setOrderPlaced(false);
      setShowCart(false);
    }, 2000);
  };

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
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
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
                {item.image}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
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

            {/* Table Number */}
            <div className="p-6 border-b border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Table Number *
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Enter table number"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
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
                        {item.menuItem.image}
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
                  disabled={!tableNumber || orderPlaced}
                  className="food-button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {orderPlaced ? (
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
