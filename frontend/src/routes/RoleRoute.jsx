import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RoleRoute Component
 * Gates routes by user role (e.g., admin-only)
 * Usage: <RoleRoute requiredRole="admin"><AdminPage /></RoleRoute>
 */
const RoleRoute = ({ children, requiredRole = 'admin' }) => {
  const { isAuthenticated, user } = useAuth();

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role → redirect to dashboard
  if (user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // All checks passed → render protected content
  return children;
};

export default RoleRoute;
