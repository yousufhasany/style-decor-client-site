import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/smarthome.png';
const Navbar = () => {
  const { currentUser, userRole, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Log auth state for debugging
  React.useEffect(() => {
    console.log('=== NAVBAR v4: Auth State ===', { 
      user: currentUser?.email || 'none', 
      loading,
      hasToken: !!localStorage.getItem('token')
    });
  }, [currentUser, loading]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
              <img
                src={logo}
                alt="SmartDecor logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">SmartDecor</span>
            <span className="text-xs text-gray-400 ml-2">v4</span>
          </Link>

          {/* Center Navigation (desktop) */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-10">
            <Link 
              to="/" 
              className="text-[15px] font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              Home
            </Link>
            {(!currentUser || userRole !== 'decorator') && (
              <Link 
                to="/services" 
                className="text-[15px] font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                Services
              </Link>
            )}
            <Link 
              to="/about" 
              className="text-[15px] font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="text-[15px] font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 mr-1"
              onClick={() => setIsMenuOpen(prev => !prev)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-[15px] font-medium text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Dashboard
                </Link>

                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="w-11 h-11 rounded-full border-2 border-purple-500 cursor-pointer flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold transition-transform hover:scale-105">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      currentUser.email?.[0].toUpperCase() || 'U'
                    )}
                  </div>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-white rounded-lg w-52 border border-gray-200">
                    <li className="menu-title px-4 py-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {currentUser.displayName || 'User'}
                      </span>
                      <span className="text-xs text-gray-500">{currentUser.email}</span>
                    </li>
                    <li><Link to="/profile">Profile Settings</Link></li>
                    <li>
                      {userRole === 'decorator' ? (
                        <Link to="/dashboard/decorator">Decorator Dashboard</Link>
                      ) : userRole === 'admin' ? (
                        <Link to="/dashboard/admin">Admin Dashboard</Link>
                      ) : (
                        <Link to="/dashboard/user">My Bookings</Link>
                      )}
                    </li>
                    <div className="divider my-0"></div>
                    <li><button onClick={handleLogout} className="text-red-600">Logout</button></li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-[15px] font-medium text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2.5 text-[15px] font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-3 pb-4 space-y-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block text-[15px] font-medium text-gray-700 hover:text-purple-600"
              >
                Home
              </Link>
              {(!currentUser || userRole !== 'decorator') && (
                <Link
                  to="/services"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-[15px] font-medium text-gray-700 hover:text-purple-600"
                >
                  Services
                </Link>
              )}
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block text-[15px] font-medium text-gray-700 hover:text-purple-600"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block text-[15px] font-medium text-gray-700 hover:text-purple-600"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
