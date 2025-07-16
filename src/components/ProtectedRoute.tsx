import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { admin, isAuthenticated, isLoading } = useAdminAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-casino-gold mx-auto mb-4" />
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check role-based access if required
  if (requiredRole && admin) {
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.includes(admin.role)
      : admin.role === requiredRole;

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-casino-red mb-4">Access Denied</h1>
            <p className="text-white mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-gray-400">
              Required role: {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}
            </p>
            <p className="text-gray-400">
              Your role: {admin.role}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
