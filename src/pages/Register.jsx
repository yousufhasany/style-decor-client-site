import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    profileImage: null
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

      // Create user record in backend
      try {
        await api.post('/users', {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          photoURL: photoURL,
          role: 'user'
        });
      } catch (apiError) {
        console.error('Error creating user record:', apiError);
        // Don't block registration if API call fails
      }

      navigate('/');
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
          role: 'user'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-transparent bg-clip-padding backdrop-blur-sm"
          style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}
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
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join us and start decorating!</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn btn-outline w-full mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="divider">OR</div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Profile Picture (Optional)</span>
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
                  className="file-input file-input-bordered file-input-sm flex-1"
                />
              </div>
            </div>

            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Phone Number</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="+91 1234567890"
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password *</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Confirm Password *</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 w-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold"
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