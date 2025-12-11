import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    profileImage: null,
    accountType: 'user' // user | decorator (request)
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'style_decor'); // You need to create this in Cloudinary
    formData.append('cloud_name', 'your_cloud_name'); // Replace with your Cloudinary cloud name

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Replace with your cloud name
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      // Fallback to ImgBB
      return uploadImageToImgBB(file);
    }
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY || 'your_imgbb_api_key'}`,
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      }
      throw new Error('ImgBB upload failed');
    } catch (error) {
      console.error('Error uploading to ImgBB:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      let photoURL = null;

      // Upload profile image if provided
      if (formData.profileImage) {
        toast.loading('Uploading profile image...');
        photoURL = await uploadImageToImgBB(formData.profileImage);
        toast.dismiss();
      }

      // Register user with Firebase
      const user = await registerUser(
        formData.email,
        formData.password,
        formData.name,
        photoURL
      );

      // Create user record in backend (and request role)
      try {
        await api.post('/users', {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          photoURL: photoURL,
          requestedRole: formData.accountType
        });
      } catch (apiError) {
        console.error('Error creating user record:', apiError);
        // Don't block registration if API call fails
      }

      // Redirect based on requested account type
      if (formData.accountType === 'decorator') {
        navigate('/dashboard/decorator');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Error is already handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      
      // Create user record in backend
      try {
        await api.post('/users', {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          requestedRole: 'user'
        });
      } catch (apiError) {
        console.error('Error creating user record:', apiError);
      }

      navigate('/');
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
            backgroundImage: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(59,130,246,0.7)), url("https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80")'
      }}
    >
      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl shadow-2xl p-4 md:p-8 border-4 border-transparent bg-clip-padding backdrop-blur-sm"
          style={{ backgroundImage: 'linear-gradient(135deg, #f3e8ff 0%, #ffe4e6 50%, #ffedd5 100%)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}
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
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold text-black">Create Account</h2>
            <p className="text-black mt-2">Join us and start decorating!</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="btn w-full mb-6 gap-2 bg-black text-white font-bold shadow-lg hover:bg-gray-900 hover:scale-105 transition-all"
            type="button"
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.22-1.39 3.59-5.27 3.59-3.17 0-5.76-2.63-5.76-5.87s2.59-5.87 5.76-5.87c1.81 0 3.02.77 3.72 1.43l2.54-2.47C16.44 3.99 14.56 3 12.18 3 6.98 3 2.82 7.16 2.82 12.36s4.16 9.36 9.36 9.36c5.39 0 8.96-3.78 8.96-9.09 0-.61-.07-1.07-.15-1.53z" fill="#fff"/>
            </svg>
            Continue with Google
          </button>

          <div className="divider text-xs text-gray-400">OR</div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Profile Picture (Optional)</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-20 h-20 rounded-full ring ring-purple-600 ring-offset-2">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" />
                    ) : (
                      <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                        <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input input-bordered bg-white/80 text-black border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>

            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Full Name *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered bg-white/80 text-black placeholder-gray-700 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Email *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered bg-white/80 text-black placeholder-gray-700 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Phone Number *</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input input-bordered bg-white/80 text-black placeholder-gray-700 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="+91 1234567890"
                required
              />
            </div>

            {/* Account Type (request) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Account Type</span>
              </label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="select select-bordered bg-white/80 text-black border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                required
              >
                <option value="user">User (Book decoration services)</option>
                <option value="decorator">Decorator (I want to work as decorator)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 leading-snug">
                Note: Admin will review and approve decorator accounts. Selecting "Decorator" here does
                not immediately give decorator access.
              </p>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Password *</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-bordered bg-white/80 text-black placeholder-gray-700 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Confirm Password *</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input input-bordered bg-white/80 text-black placeholder-gray-700 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-full bg-black text-white font-bold shadow-lg hover:bg-gray-900 hover:scale-105 transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;