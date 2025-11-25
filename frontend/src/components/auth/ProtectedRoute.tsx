import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

/**
 * ProtectedRoute Component
 *
 * This component protects routes that require authentication.
 * IMPORTANT: It waits for auth initialization before making decisions
 * to prevent flickering/redirects during page refresh.
 */
export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isInitialized } = useAuth();

  // CRITICAL: Wait for auth initialization before making any decisions
  // This prevents redirecting during page refresh when token/user are being restored
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-opacity-60">Loading...</p>
        </div>
      </div>
    );
  }

  // Now that we're initialized, check authentication
  if (!isAuthenticated || !user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (!allowedRoles.includes(user.role)) {
    // Wrong role, redirect to appropriate dashboard
    const redirectPath = getRoleDefaultPath(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

// Helper to get default path for each role
const getRoleDefaultPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/hotel';
    case 'waiter':
      return '/wk/take-order';
    case 'kitchen':
      return '/wk/kitchen';
    default:
      return '/login';
  }
};
