# 🚀 Hardcoded Values Removal - Implementation Guide

## 📊 Summary

**Total Files to Modify**: 10 files
**Total Lines of Code to Remove**: ~600 lines of hardcoded data
**Total Lines of Code to Add**: ~200 lines of API integration
**Net Code Reduction**: ~400 lines (66% reduction)

---

## 🎯 COMPLETE FILE CHANGES

### ✅ FILE 1: `src/pages/wk/TakeOrderPage.tsx`

**REMOVE** (Lines 6-70):
```typescript
// Mock menu data
const MENU_ITEMS: MenuItem[] = [ ... 62 lines ... ];
const CATEGORIES = ['All', 'Starter', 'Main Course', 'Rice', 'Breakfast', 'Dessert'];
```

**ADD** (After imports):
```typescript
import { useEffect } from 'react';
import { menuApi } from '../../api/menuApi';
import type { MenuItem as BackendMenuItem, Category } from '../../types/backend.types';

// Convert backend MenuItem to component MenuItem
const convertMenuItem = (item: BackendMenuItem): MenuItem => ({
  id: String(item.id),
  name: item.name,
  category: item.category.name,
  price: item.price,
  image: '🍽️', // Use default or map from description
  available: item.available,
  preparationTime: 20, // Default value
  isVeg: item.vegetarian || true,
});
```

**REPLACE** (Inside component):
```typescript
// OLD:
export const TakeOrderPage = () => {
  const [selected Category, setSelectedCategory] = useState('All');

// NEW:
export const TakeOrderPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch menu data on mount
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [items, cats] = await Promise.all([
          menuApi.getAvailableMenuItems(),
          menuApi.getAllCategories()
        ]);

        // Convert backend data to component format
        const convertedItems = items.map(convertMenuItem);
        const categoryNames = ['All', ...cats.map(c => c.name)];

        setMenuItems(convertedItems);
        setCategories(categoryNames);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
        setError('Failed to load menu. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Replace MENU_ITEMS with menuItems everywhere
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });
```

**ADD** (Loading/Error States in JSX):
```typescript
// After <div className="max-w-7xl mx-auto space-y-6">
{loading && (
  <div className="text-center py-12">
    <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
    <p className="mt-4 text-slate-600">Loading menu...</p>
  </div>
)}

{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
    {error}
  </div>
)}

{!loading && !error && (
  {/* Existing content */}
)}
```

**UPDATE** `handlePlaceOrder` (Lines 125-136):
```typescript
const handlePlaceOrder = async () => {
  if (cart.length === 0 || !tableNumber) return;

  try {
    // Create order via API
    const orderData = {
      tableId: parseInt(tableNumber), // Or lookup table by number
      items: cart.map(item => ({
        menuItemId: parseInt(item.menuItem.id),
        quantity: item.quantity,
        notes: ''
      }))
    };

    await ordersApi.createOrder(orderData);

    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setTableNumber('');
      setOrderPlaced(false);
      setShowCart(false);
    }, 2000);
  } catch (err) {
    console.error('Failed to place order:', err);
    alert('Failed to place order. Please try again.');
  }
};
```

---

### ✅ FILE 2: `src/pages/hotel/MenuManagementPage.tsx`

**FIND** (Line ~193):
```typescript
const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenu);
```

**REPLACE WITH**:
```typescript
const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await menuApi.getAllMenuItems();
      setMenuItems(data);
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchMenu();
}, []);
```

**ADD** Import:
```typescript
import { useEffect } from 'react';
import { menuApi } from '../../api/menuApi';
```

---

### ✅ FILE 3: `src/pages/hotel/BillingPage.tsx`

**FIND** (Line ~9):
```typescript
const [bills, setBills] = useState<Bill[]>(mockBills);
```

**REPLACE WITH**:
```typescript
const [bills, setBills] = useState<Bill[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await billsApi.getAllBills();
      setBills(data);
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchBills();
}, []);
```

**ADD** Import:
```typescript
import { useEffect } from 'react';
import { billsApi } from '../../api/billsApi';
```

---

### ✅ FILE 4: `src/pages/hotel/LiveOrdersPage.tsx`

**FIND** (Lines ~6-10):
```typescript
const pendingOrders = mockOrders.filter((o) => o.status === 'pending');
const cookingOrders = mockOrders.filter((o) => o.status === 'cooking');
const readyOrders = mockOrders.filter((o) => o.status === 'ready');
```

**REPLACE WITH**:
```typescript
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchOrders();

  // Auto-refresh every 30 seconds
  const interval = setInterval(fetchOrders, 30000);
  return () => clearInterval(interval);
}, []);

const pendingOrders = orders.filter((o) => o.status === 'PENDING');
const cookingOrders = orders.filter((o) => o.status === 'COOKING');
const readyOrders = orders.filter((o) => o.status === 'READY');
```

**ADD** Import:
```typescript
import { useState, useEffect } from 'react';
import { ordersApi } from '../../api/ordersApi';
```

---

### ✅ FILE 5: `src/pages/wk/KitchenPage.tsx`

**READ FILE FIRST** to see current structure, then:

**ADD** (Top of component):
```typescript
const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await kitchenApi.getOrders();
      setKitchenOrders(data);
    } catch (err) {
      console.error('Failed to load kitchen orders:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();

  // Auto-refresh every 10 seconds for real-time updates
  const interval = setInterval(fetchOrders, 10000);
  return () => clearInterval(interval);
}, []);
```

**UPDATE** Status Change Functions:
```typescript
const handleStatusChange = async (orderId: number, newStatus: string) => {
  try {
    await kitchenApi.updateOrderStatus(orderId, newStatus);
    // Refresh orders
    const data = await kitchenApi.getOrders();
    setKitchenOrders(data);
  } catch (err) {
    console.error('Failed to update order status:', err);
  }
};
```

---

### ✅ FILE 6: `src/pages/wk/WKBillingPage.tsx`

**FIND** mock data usage

**REPLACE WITH**:
```typescript
const [bills, setBills] = useState<Bill[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await billsApi.getAllBills();
      setBills(data);
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchBills();
}, []);
```

---

## 🗑️ FILES TO DELETE

After all components are refactored:

```bash
rm src/data/mockWKData.ts
rm src/data/mockHotelData.ts
# Keep mockAdminData.ts until backend implements tenant management
```

---

## ✅ VERIFICATION CHECKLIST

### Before Starting:
- [ ] Backend is running on http://localhost:8080
- [ ] Frontend is running on http://localhost:5174
- [ ] PostgreSQL database has seed data

### After Each Component:
- [ ] No TypeScript errors
- [ ] Component loads without crashes
- [ ] Loading state displays correctly
- [ ] Data fetches and displays
- [ ] Error handling works (test by stopping backend)

### Final Testing:
- [ ] Search `import.*mock` returns zero results
- [ ] Search `const.*MENU_ITEMS\|CATEGORIES` returns zero results in pages
- [ ] All components use API calls
- [ ] Loading states work throughout app
- [ ] Error handling displays user-friendly messages
- [ ] Real-time updates work (Kitchen Display)

---

## 🎯 PRIORITY ORDER

1. **TakeOrderPage** (Most critical - waiter workflow) ⭐⭐⭐
2. **KitchenPage** (Real-time kitchen display) ⭐⭐⭐
3. **MenuManagementPage** (Admin menu CRUD) ⭐⭐
4. **BillingPage** (Bill management) ⭐⭐
5. **LiveOrdersPage** (Order monitoring) ⭐
6. **WKBillingPage** (Waiter billing) ⭐

---

## 🚨 IMPORTANT NOTES

### Type Mismatches
Backend and frontend types may differ. Create adapter functions:

```typescript
// src/utils/apiAdapters.ts
export const adaptBackendMenuItem = (item: BackendMenuItem): FrontendMenuItem => ({
  id: String(item.id),
  name: item.name,
  category: item.category.name,
  price: item.price,
  image: '🍽️',
  available: item.available,
  preparationTime: 20,
  isVeg: item.vegetarian || false,
});
```

### Error Handling Pattern
Use consistent error handling:

```typescript
try {
  setLoading(true);
  setError(null);
  const data = await api.fetch();
  setState(data);
} catch (err) {
  const message = err instanceof Error ? err.message : 'Unknown error';
  setError(`Failed to load data: ${message}`);
  console.error('API Error:', err);
} finally {
  setLoading(false);
}
```

### Loading States
Use consistent loading UI:

```typescript
{loading && (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
)}
```

---

## 📝 IMPLEMENTATION SCRIPT

```bash
# 1. Start backend
cd backend
./mvnw spring-boot:run

# 2. Start frontend (separate terminal)
cd frontend
npm run dev

# 3. Refactor files one by one
# 4. Test each change immediately
# 5. Commit after each successful component

# 6. Final cleanup
git add .
git commit -m "feat: Replace all hardcoded data with API calls"
```

---

## 🎉 EXPECTED OUTCOME

After implementation:
- ✅ Zero hardcoded menu items, bills, orders
- ✅ All data fetched from backend APIs
- ✅ Real-time updates work (kitchen display)
- ✅ Loading states provide feedback
- ✅ Error handling prevents crashes
- ✅ ~400 lines of code removed
- ✅ Application is fully dynamic
- ✅ Ready for production deployment

---

**Ready to start?** Begin with `TakeOrderPage.tsx` as it's the most critical component.
