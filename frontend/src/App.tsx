import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TenantsPage } from './pages/admin/TenantsPage';
import { PlaceholderPage } from './pages/admin/PlaceholderPage';
import { HotelAdminLayout } from './components/hotel/HotelAdminLayout';
import { HotelDashboard } from './pages/hotel/HotelDashboard';
import { BillingPage } from './pages/hotel/BillingPage';
import { LiveOrdersPage } from './pages/hotel/LiveOrdersPage';
import { OrderHistoryPage } from './pages/hotel/OrderHistoryPage';
import { MenuManagementPage } from './pages/hotel/MenuManagementPage';
import { StaffManagementPage } from './pages/hotel/StaffManagementPage';
import { SettingsPage } from './pages/hotel/SettingsPage';
import { TableManagementPage } from './pages/hotel/TableManagementPage';
import { CategoryManagementPage } from './pages/hotel/CategoryManagementPage';
import { WKLayout } from './components/wk/WKLayout';
import { TakeOrderPage } from './pages/wk/TakeOrderPage';
import { KitchenPage } from './pages/wk/KitchenPage';
import { WKBillingPage } from './pages/wk/WKBillingPage';
import { WKOrderHistoryPage } from './pages/wk/WKOrderHistoryPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route
              path="subscriptions"
              element={
                <PlaceholderPage
                  title="Subscriptions Management"
                  description="Manage subscription plans, renewals, and billing"
                  icon="💳"
                />
              }
            />
            <Route
              path="users"
              element={
                <PlaceholderPage
                  title="Tenant Users"
                  description="Manage users across all tenants"
                  icon="👥"
                />
              }
            />
            <Route
              path="features"
              element={
                <PlaceholderPage
                  title="Feature Flags"
                  description="Control feature access for each tenant"
                  icon="⚙️"
                />
              }
            />
            <Route
              path="monitoring"
              element={
                <PlaceholderPage
                  title="System Monitoring"
                  description="Monitor system health, API usage, and performance"
                  icon="📈"
                />
              }
            />
          </Route>

          {/* Hotel Admin Routes - Protected for 'admin' role only */}
          <Route
            path="/hotel"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <HotelAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HotelDashboard />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="live-orders" element={<LiveOrdersPage />} />
            <Route path="order-history" element={<OrderHistoryPage />} />
            <Route path="menu" element={<MenuManagementPage />} />
            <Route path="tables" element={<TableManagementPage />} />
            <Route path="categories" element={<CategoryManagementPage />} />
            <Route path="staff" element={<StaffManagementPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Waiter & Kitchen Routes - Protected for 'waiter' and 'kitchen' roles */}
          <Route
            path="/wk"
            element={
              <ProtectedRoute allowedRoles={['waiter', 'kitchen']}>
                <WKLayout />
              </ProtectedRoute>
            }
          >
            <Route path="take-order" element={<TakeOrderPage />} />
            <Route path="kitchen" element={<KitchenPage />} />
            <Route path="billing" element={<WKBillingPage />} />
            <Route path="order-history" element={<WKOrderHistoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
