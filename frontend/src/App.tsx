import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import pages
import { ServantDashboard } from './pages/ServantDashboard';
import { KitchenDisplay } from './pages/KitchenDisplay';
import { CashierDashboard } from './pages/CashierDashboard';
import { InvoicePage } from './pages/InvoicePage';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const { loadUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/invoice/:qrToken" element={<InvoicePage />} />

        {/* Protected Routes */}
        <Route
          path="/servant/*"
          element={
            <ProtectedRoute roles={['SERVANT', 'ADMIN']}>
              <Layout>
                <ServantDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/kitchen"
          element={
            <ProtectedRoute roles={['KITCHEN', 'ADMIN']}>
              <Layout>
                <KitchenDisplay />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cashier"
          element={
            <ProtectedRoute roles={['CASHIER', 'ADMIN']}>
              <Layout>
                <CashierDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/servant" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
