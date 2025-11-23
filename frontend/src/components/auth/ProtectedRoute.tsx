import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Wrong role, redirect to appropriate dashboard
    const redirectPath = getRoleDefaultPath(user.role);
    return <Navigate to={redirectPath} replace />;
  }

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
