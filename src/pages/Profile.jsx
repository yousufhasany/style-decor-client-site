import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';

const Profile = () => {
  const { currentUser, userProfile } = useAuth();
  const [profile, setProfile] = useState(userProfile);
  const [loading, setLoading] = useState(!userProfile);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser || userProfile) return;
      try {
        setLoading(true);
        const res = await usersAPI.getById(currentUser.uid);
        setProfile(res.data.user || res.data.data || null);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, userProfile]);

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      <div className="bg-white shadow-md rounded-xl p-6 flex gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.name || profile.email}
                className="w-full h-full object-cover"
              />
            ) : (
              (profile.name || profile.email || 'U')[0].toUpperCase()
            )}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-base font-semibold text-gray-900">{profile.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-base text-gray-800">{profile.email}</p>
          </div>
          {profile.phoneNumber && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base text-gray-800">{profile.phoneNumber}</p>
            </div>
          )}
          {profile.role && (
            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 capitalize">
                {profile.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
