import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const from = location.state?.from || null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);

      // If we were redirected here from a protected page, go back there.
      // Otherwise, send the user to the generic dashboard, which
      // will route them to the correct dashboard based on role.
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();

      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 flex items-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(59,130,246,0.7)), url("https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80")'
      }}
    >
      <div className="max-w-5xl mx-auto w-full grid gap-10 md:grid-cols-2 items-center">
        {/* Left panel: brand copy */}
        <div className="hidden md:block space-y-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          <h1 className="text-4xl font-extrabold leading-tight">
            Welcome back to
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              StyleDecor
            </span>
          </h1>
          <p className="text-base leading-relaxed md:text-lg text-purple-50">
            Sign in to manage your bookings, decorator projects, and admin
            tools in one place. Continue where you left off in just a few
            seconds.
          </p>
          <ul className="text-base md:text-lg text-purple-50 space-y-2 list-disc list-inside">
            <li>Track upcoming events and bookings</li>
            <li>Coordinate with decorators in real time</li>
            <li>Secure, role-based access for admins and staff</li>
          </ul>
        </div>

        {/* Right panel: login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-transparent bg-clip-padding"
          style={{
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box'
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600 mt-2 text-sm">Login to continue to your dashboard</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn btn-outline w-full mb-6 gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="divider text-xs text-gray-400">OR continue with email</div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Email */}
            <div className="form-control w-full">
              <label className="label px-0 pb-1">
                <span className="label-text text-sm font-semibold text-gray-700">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label className="label px-0 pb-1">
                <span className="label-text text-sm font-semibold text-gray-700">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="••••••••"
                required
              />
              <label className="label px-0 pt-1">
                <Link
                  to="/forgot-password"
                  className="label-text-alt link link-hover text-purple-600 text-xs"
                >
                  Forgot password?
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 w-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold mt-2"
            >
              {loading ? <span className="loading loading-spinner"></span> : 'Login'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-600 mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;