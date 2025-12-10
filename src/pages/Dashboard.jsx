import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        console.log('=== DASHBOARD: Waiting for auth to load ===');
        return;
      }

      if (!currentUser) {
        console.log('=== DASHBOARD: No user found ===');
        setLoading(false);
        return;
      }

      try {
        console.log('=== DASHBOARD: Fetching role for', currentUser.email, '===');
        const response = await api.get(`/users/${currentUser.uid}`);
        const role = response.data.user?.role || response.data.role || 'user';
        console.log('=== DASHBOARD: Role is', role, '===');
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        // Default to user dashboard if fetch fails
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [currentUser, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ProtectedRoute handles auth redirect
  if (!currentUser) {
    return null;
  }

  // Redirect based on user role
  if (userRole === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  } else if (userRole === 'decorator') {
    return <Navigate to="/dashboard/decorator" replace />;
  } else {
    return <Navigate to="/dashboard/user" replace />;
  }
};

export default Dashboard;
