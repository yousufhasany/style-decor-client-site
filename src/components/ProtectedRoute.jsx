import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ProtectedRoute
// - Always checks Firebase auth
// - Optionally checks role ONLY when requiredRole is provided
// - Never sends you to /login because of role; only because of auth
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, userRole, loading: authLoading } = useAuth();
  const location = useLocation();

  console.log('=== PROTECTED ROUTE SIMPLE+ROLE ===', {
    path: location.pathname,
    hasUser: !!currentUser,
    authLoading,
    requiredRole,
    userRole
  });

  // 1) Auth check
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    console.log('=== PROTECTED ROUTE: redirecting to login (no user) ===');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 2) If no specific role required, allow access
  if (!requiredRole) {
    return children;
  }
  // 3) When a specific role is required (admin/decorator),
  //    rely on userRole from AuthContext (already loaded there)
  if (!userRole) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (userRole !== requiredRole) {
    // Show a simple 403 page instead of redirecting to login
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="text-center max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-red-100">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-700 mb-4">You don&apos;t have permission to view this page.</p>
          <p className="text-sm text-gray-500">Required role: <span className="font-semibold">{requiredRole}</span></p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;