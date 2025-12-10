import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set auth persistence to local storage
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Error setting persistence:', error);
    });
  }, []);

  // Register user
  const register = async (email, password, displayName, photoURL) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name and photo
      if (displayName || photoURL) {
        await updateProfile(userCredential.user, {
          displayName: displayName || '',
          photoURL: photoURL || ''
        });
      }
      
      toast.success('Registration successful!');
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Get Firebase ID token and store it
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      toast.success('Login successful!');
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Get Firebase ID token and store it
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      toast.success('Google sign-in successful!');
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error(error.message || 'Google sign-in failed');
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    console.log('=== AUTH CONTEXT v4: Setting up listener ===');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('=== AUTH CONTEXT v4: State changed ===', user ? `User: ${user.email}` : 'No user');
      if (user) {
        // Update token when user is authenticated
        try {
          const token = await user.getIdToken();
          localStorage.setItem('token', token);
          console.log('=== AUTH CONTEXT v4: Token stored ===');
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        // No user, remove token
        localStorage.removeItem('token');
        console.log('=== AUTH CONTEXT v4: Token removed, no user ===');
      }
      setCurrentUser(user);
      setLoading(false);
      console.log('=== AUTH CONTEXT v4: Loading complete ===', { 
        hasUser: !!user, 
        email: user?.email 
      });
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
