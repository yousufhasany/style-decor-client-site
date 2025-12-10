import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  console.log('=== PROTECTED ROUTE v4 RENDER ===', { 
    currentUser: currentUser?.email || 'none', 
    authLoading, 
    roleLoading,
    requiredRole,
    hasToken: !!localStorage.getItem('token')
  });

  useEffect(() => {
    const verifyTokenAndRole = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        console.log('=== PROTECTED ROUTE v4: Auth still loading, waiting... ===');
        return;
      }

      // No user after auth loaded
      if (!currentUser) {
        console.log('=== PROTECTED ROUTE v4: No user after auth loaded ===');
        setRoleLoading(false);
        return;
      }

      console.log('=== PROTECTED ROUTE v4: User found, fetching role ===', currentUser.email);

      try {
        // Get JWT token from Firebase
        const token = await currentUser.getIdToken(true);
        localStorage.setItem('token', token);
        
        // Verify token and get user data with role
        const response = await api.get(`/users/${currentUser.uid}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const role = response.data.user?.role || response.data.role || 'user';
        console.log('=== PROTECTED ROUTE v4: Role fetched ===', role);
        setUserRole(role);

        // Check if user has required role
        if (requiredRole) {
          if (role === requiredRole) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            toast.error(`Access denied. This page requires ${requiredRole} role.`);
          }
        } else {
          // No specific role required, just authenticated
          setIsAuthorized(true);
        }

      } catch (error) {
        console.error('=== PROTECTED ROUTE v4: Error fetching role ===', error);
        
        // Handle different error types
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          setIsAuthorized(false);
        } else if (error.response?.status === 403) {
          toast.error('Access forbidden. Insufficient permissions.');
          setIsAuthorized(false);
        } else {
          // Network or other errors - default to user role
          console.log('=== PROTECTED ROUTE v4: Network error, defaulting to user role ===');
          setUserRole('user');
          setIsAuthorized(!requiredRole || requiredRole === 'user');
        }
      } finally {
        setRoleLoading(false);
      }
    };

    verifyTokenAndRole();
  }, [currentUser, authLoading, requiredRole]);

  // CRITICAL: Wait for auth to finish loading
  if (authLoading) {
    console.log('=== PROTECTED ROUTE v4: Showing auth loading spinner ===');
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth finished loading, but no user found
  if (!currentUser) {
    console.log('=== PROTECTED ROUTE v4: Redirecting to login - no user ===');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Wait for role to be fetched
  if (roleLoading) {
    console.log('=== PROTECTED ROUTE v4: Showing role loading spinner ===');
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check role authorization
  if (requiredRole && !isAuthorized) {
    console.log('=== PROTECTED ROUTE v4: Not authorized for role ===', { requiredRole, userRole });
    return <Navigate to="/dashboard" replace />;
  }

  console.log('=== PROTECTED ROUTE v4: Access granted ===');
  return children;
};

export default ProtectedRoute;