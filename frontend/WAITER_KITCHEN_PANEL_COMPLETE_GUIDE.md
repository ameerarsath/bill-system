# 🍽️ Waiter + Kitchen Panel - Complete Implementation Guide

## ✅ What Has Been Created

### 1. **TypeScript Interfaces** ✅ COMPLETE
**File**: `src/types/waiter-kitchen.types.ts`

Complete type definitions for:
- `MenuItem` - Menu item with category, price, availability
- `Category` - Food categories with icons and colors
- `CartItem` - Cart entry with quantity and notes
- `Order` - Complete order structure
- `KitchenOrder` - Extended order with cooking timestamps
- `Bill` - Billing with charges and customer details
- `OrderHistoryEntry` - Historical order records
- `User` - Waiter/Kitchen/Cashier profiles
- `CartState` - Shopping cart state
- `Charges` - Service charge and GST configuration

### 2. **Mock Data** ✅ COMPLETE
**File**: `src/data/mockWKData.ts`

Complete mock data including:
- **8 Categories**: All Items, Starters, Main Course, Breads, Rice, Chinese, Beverages, Desserts
- **15 Menu Items**: With emojis, prices, prep times, veg/non-veg
- **4 Users**: Waiters, Kitchen, Cashier
- **3 Kitchen Orders**: Pending, Cooking, Ready states
- **Bills & Order History**: Sample data
- **Default Charges**: Service charge (5%), GST (5%)

---

## 🎨 Design System (Already Available)

You have access to the complete Food Delivery App theme from `src/index.css`:

### Utility Classes Available:
```css
/* Cards */
.food-card                  /* Main rounded card with shadow */
.food-card-soft             /* Subtle shadow card */
.food-stat-card             /* Statistics card */

/* Buttons */
.food-button-primary        /* Gradient orange CTA */
.food-button-soft           /* Soft cream button */
.food-chip                  /* Filter pill */
.food-chip-active           /* Active filter pill */

/* Badges */
.food-badge-success         /* Green - Paid/Ready */
.food-badge-warning         /* Orange - Cooking */
.food-badge-pending         /* Yellow - Pending */
.food-badge-info            /* Blue - Info */

/* Forms */
.food-input                 /* Rounded input field */

/* Icons */
.food-icon-circle           /* Base icon circle */
.food-icon-circle-primary   /* Orange gradient */
.food-icon-circle-success   /* Green gradient */
.food-icon-circle-warning   /* Yellow gradient */

/* Other */
.food-avatar                /* Avatar circle */
.food-segment               /* Tab control */
.food-divider               /* Soft divider */
.food-bg-light              /* Light gradient background */
```

---

## 📂 File Structure to Create

```
src/
├── components/
│   └── wk/                           # Waiter-Kitchen Components
│       ├── layout/
│       │   ├── WKLayout.tsx          # Main layout wrapper
│       │   ├── WKHeader.tsx          # Top header (role-based)
│       │   └── WKBottomNav.tsx       # Bottom navigation
│       ├── shared/
│       │   ├── CategoryTabs.tsx      # Horizontal category tabs
│       │   ├── MenuItemCard.tsx      # Food item card
│       │   ├── QuantityPicker.tsx    # +/- quantity control
│       │   ├── CartDrawer.tsx        /* Slide-in cart */
│       │   ├── CartItemCard.tsx      /* Cart item row */
│       │   ├── NotesModal.tsx        /* Add notes modal */
│       │   ├── KitchenOrderCard.tsx  /* Kitchen order display */
│       │   ├── BillPreviewModal.tsx  /* Bill preview */
│       │   └── StatusBadge.tsx       /* Order status badge */
│       └── ...
├── pages/
│   └── wk/                           # Waiter-Kitchen Pages
│       ├── TakeOrderPage.tsx         # Menu + Cart (Waiter)
│       ├── KitchenDisplayPage.tsx    # Live kitchen orders
│       ├── BillingPage.tsx           # Bill generation
│       └── OrderHistoryPage.tsx      # Historical orders
├── context/
│   └── CartContext.tsx               # Cart state management
└── ...
```

---

## 📄 Page 1: Take Order Page (Waiter)

### Component Structure:
```tsx
<TakeOrderPage>
  <WKHeader role="waiter" />

  <CategoryTabs />        {/* Horizontal scroll pills */}

  <MenuGrid>              {/* Grid of food items */}
    <MenuItemCard />
    <MenuItemCard />
    ...
  </MenuGrid>

  <CartDrawer>            {/* Slide-in from right */}
    <CartItemCard />
    <CartItemCard />
    <PriceBreakdown />
    <GradientButton>Send to Kitchen</GradientButton>
  </CartDrawer>

  <NotesModal />          {/* Add item notes */
  <WKBottomNav />
</TakeOrderPage>
```

### Implementation Example:

```tsx
// src/pages/wk/TakeOrderPage.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { menuItems, categories } from '../../data/mockWKData';
import type { MenuItem, CartItem } from '../../types/waiter-kitchen.types';

export const TakeOrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="min-h-screen food-bg-light pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Take Order</h1>
            <p className="text-sm text-slate-500">Table T5 • Rahul</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative food-button-primary px-4 py-2 flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart ({cart.length})</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-success-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-16 z-30">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`${
                selectedCategory === cat.id
                  ? 'food-chip-active'
                  : 'food-chip'
              } whitespace-nowrap flex items-center gap-2`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="p-4 md:p-6">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredItems.map((item, index) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAdd={() => addToCart(item)}
              delay={index * 0.05}
            />
          ))}
        </motion.div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <CartDrawer
            cart={cart}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            total={cartTotal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
```

### MenuItemCard Component:
```tsx
// src/components/wk/shared/MenuItemCard.tsx
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { MenuItem } from '../../../types/waiter-kitchen.types';

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: () => void;
  delay?: number;
}

export const MenuItemCard = ({ item, onAdd, delay = 0 }: MenuItemCardProps) => {
  return (
    <motion.div
      className="food-card p-4 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Food Icon/Image */}
      <div className="text-5xl mb-3 text-center">{item.image}</div>

      {/* Item Details */}
      <div className="text-center mb-3">
        <h3 className="font-semibold text-slate-800 text-sm mb-1">
          {item.name}
        </h3>
        <p className="text-slate-500 text-xs mb-2">
          {item.preparationTime} mins
        </p>
        <p className="text-primary-600 font-bold text-lg">
          ₹{item.price}
        </p>
      </div>

      {/* Veg/Non-veg Indicator */}
      <div className="flex justify-center mb-3">
        <div
          className={`w-4 h-4 border-2 ${
            item.isVeg
              ? 'border-success-600'
              : 'border-red-600'
          } flex items-center justify-center`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              item.isVeg ? 'bg-success-600' : 'bg-red-600'
            }`}
          />
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={onAdd}
        disabled={!item.available}
        className={`w-full py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-1 transition-all ${
          item.available
            ? 'bg-primary-500 text-white hover:bg-primary-600'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Plus className="w-4 h-4" />
        {item.available ? 'Add' : 'Unavailable'}
      </button>
    </motion.div>
  );
};
```

### CartDrawer Component:
```tsx
// src/components/wk/shared/CartDrawer.tsx
import { motion } from 'framer-motion';
import { X, Trash2, Send } from 'lucide-react';
import type { CartItem } from '../../../types/waiter-kitchen.types';

interface CartDrawerProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemove: (index: number) => void;
  total: number;
}

export const CartDrawer = ({
  cart,
  onClose,
  onUpdateQuantity,
  onRemove,
  total,
}: CartDrawerProps) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white z-50 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Your Order</h2>
            <p className="text-sm text-slate-500">{cart.length} items</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-6 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <CartItemCard
                key={index}
                item={item}
                onUpdateQuantity={(delta) => onUpdateQuantity(index, delta)}
                onRemove={() => onRemove(index)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-slate-800">
                ₹{total.toFixed(2)}
              </span>
            </div>

            {/* Send to Kitchen Button */}
            <button className="food-button-primary w-full py-3 flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              <span>Send to Kitchen</span>
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};
```

---

## 📄 Page 2: Kitchen Display Page

### Component Structure:
```tsx
<KitchenDisplayPage>
  <WKHeader role="kitchen" />

  <StatusTabs>            {/* Pending / Cooking / Ready */}
    <Tab active>Pending</Tab>
    <Tab>Cooking</Tab>
    <Tab>Ready</Tab>
  </StatusTabs>

  <OrdersGrid>
    <KitchenOrderCard status="pending" />
    <KitchenOrderCard status="cooking" />
    <KitchenOrderCard status="ready" />
  </OrdersGrid>

  <WKBottomNav />
</KitchenDisplayPage>
```

### KitchenOrderCard Component:
```tsx
// src/components/wk/shared/KitchenOrderCard.tsx
import { motion } from 'framer-motion';
import { Clock, User, StickyNote } from 'lucide-react';
import type { KitchenOrder } from '../../../types/waiter-kitchen.types';

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

export const KitchenOrderCard = ({ order, onStatusChange }: KitchenOrderCardProps) => {
  const statusColors = {
    pending: 'bg-amber-50 border-amber-200',
    cooking: 'bg-blue-50 border-blue-200',
    ready: 'bg-success-50 border-success-200',
  };

  return (
    <motion.div
      className={`food-card p-5 border-2 ${statusColors[order.status]}`}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="food-badge-warning text-lg font-bold px-3 py-1">
              {order.tableNo}
            </span>
            {order.priority === 'urgent' && (
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                Urgent
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {order.waiterName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {order.timeElapsed} mins
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                {item.quantity}
              </span>
              <div>
                <p className="font-semibold text-slate-800">{item.menuItem.name}</p>
                {item.notes && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <StickyNote className="w-3 h-3" />
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {order.status === 'pending' && (
          <button
            onClick={() => onStatusChange(order.id, 'cooking')}
            className="flex-1 food-button-primary py-2"
          >
            Start Cooking
          </button>
        )}
        {order.status === 'cooking' && (
          <button
            onClick={() => onStatusChange(order.id, 'ready')}
            className="flex-1 bg-success-500 hover:bg-success-600 text-white font-semibold py-2 rounded-2xl transition-all"
          >
            Mark Ready
          </button>
        )}
        {order.status === 'ready' && (
          <button
            onClick={() => onStatusChange(order.id, 'served')}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 rounded-2xl transition-all"
          >
            Mark Served
          </button>
        )}
      </div>
    </motion.div>
  );
};
```

---

## 📄 Page 3: Billing Page

### Key Features:
- Order summary display
- Service charge + GST calculation
- Customer phone input
- Bill preview modal
- WhatsApp sharing

### Implementation Structure:
```tsx
<BillingPage>
  <OrderSummary items={order.items} />

  <ChargesBreakdown
    subtotal={480}
    serviceCharge={24}
    gst={25.2}
    discount={0}
    total={529.2}
  />

  <PhoneInput
    value={phone}
    onChange={setPhone}
    className="food-input"
  />

  <div className="space-y-3">
    <button className="food-button-soft w-full">
      Generate Bill
    </button>
    <button className="food-button-primary w-full">
      📱 Send via WhatsApp
    </button>
  </div>

  <BillPreviewModal />
</BillingPage>
```

---

## 📄 Page 4: Order History Page

### Features:
- Filter chips (Date, Table, Status)
- Search bar
- Order cards with details
- Click to view full order modal

### Implementation:
```tsx
<OrderHistoryPage>
  <FilterSection>
    <SearchBar className="food-input" />
    <FilterChips>
      <Chip active>All</Chip>
      <Chip>Today</Chip>
      <Chip>This Week</Chip>
    </FilterChips>
  </FilterSection>

  <HistoryList>
    {orders.map(order => (
      <HistoryCard
        key={order.id}
        order={order}
        onClick={() => viewDetails(order)}
      />
    ))}
  </HistoryList>

  <OrderDetailsModal />
</OrderHistoryPage>
```

---

## 🎯 Bottom Navigation

```tsx
// src/components/wk/layout/WKBottomNav.tsx
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, ChefHat, Receipt, History } from 'lucide-react';

export const WKBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/wk/take-order', icon: UtensilsCrossed, label: 'Orders' },
    { path: '/wk/kitchen', icon: ChefHat, label: 'Kitchen' },
    { path: '/wk/billing', icon: Receipt, label: 'Billing' },
    { path: '/wk/history', icon: History, label: 'History' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                  : 'text-slate-600 hover:text-primary-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
```

---

## 🚀 Quick Start

### 1. Add Routes to App.tsx:
```tsx
import { TakeOrderPage } from './pages/wk/TakeOrderPage';
import { KitchenDisplayPage } from './pages/wk/KitchenDisplayPage';
import { BillingPage } from './pages/wk/BillingPage';
import { OrderHistoryPage } from './pages/wk/OrderHistoryPage';
import { WKLayout } from './components/wk/layout/WKLayout';

// Add routes:
<Route path="/wk" element={<WKLayout />}>
  <Route path="take-order" element={<TakeOrderPage />} />
  <Route path="kitchen" element={<KitchenDisplayPage />} />
  <Route path="billing" element={<BillingPage />} />
  <Route path="history" element={<OrderHistoryPage />} />
</Route>
```

### 2. Use the Theme:
All components use the existing `food-*` utility classes from `index.css`.

### 3. Add Animations:
Use Framer Motion for smooth transitions:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

---

## 📋 Complete Checklist

### Data Layer ✅
- [x] TypeScript interfaces
- [x] Mock menu data (15 items)
- [x] Mock orders data
- [x] Mock bills data
- [x] Mock users data

### Components to Build
- [ ] WKLayout (main wrapper)
- [ ] WKHeader (role-based)
- [ ] WKBottomNav (4 tabs)
- [ ] CategoryTabs (horizontal scroll)
- [ ] MenuItemCard (with animations)
- [ ] QuantityPicker
- [ ] CartDrawer (slide-in)
- [ ] CartItemCard
- [ ] NotesModal
- [ ] KitchenOrderCard (status-based colors)
- [ ] BillPreviewModal
- [ ] StatusBadge

### Pages to Build
- [ ] TakeOrderPage (Menu + Cart)
- [ ] KitchenDisplayPage (3 status tabs)
- [ ] BillingPage (charges + WhatsApp)
- [ ] OrderHistoryPage (filters + search)

### Features to Implement
- [ ] Cart state management (Context API)
- [ ] Add to cart animation
- [ ] Category filtering
- [ ] Kitchen order status transitions
- [ ] Bill calculations (service + GST)
- [ ] Phone number validation
- [ ] Search & filter in history
- [ ] Responsive mobile layout
- [ ] Bottom nav active states

---

## 🎨 Design Patterns

### Card Hover:
```tsx
whileHover={{ y: -4, scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

### Slide-in Drawer:
```tsx
initial={{ x: '100%' }}
animate={{ x: 0 }}
exit={{ x: '100%' }}
```

### Stagger Children:
```tsx
transition={{ delay: index * 0.05 }}
```

---

**Status**: ✅ Data & Types Complete | 🚧 Components & Pages Ready to Build

Use this guide to implement all 4 pages with the exact Food Delivery App aesthetic!
