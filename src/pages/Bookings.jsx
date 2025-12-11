import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bookingsAPI, paymentsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Bookings = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Use user email to fetch bookings
      const userEmail = currentUser.email;
      const response = await bookingsAPI.getByUserId(userEmail);
      const fetchedBookings = response.data.bookings || response.data.data || response.data || [];
      
      if (Array.isArray(fetchedBookings)) {
        setBookings(fetchedBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const handlePayNow = async (bookingId) => {
    try {
      const response = await paymentsAPI.createCheckoutSessionForBooking(bookingId);
      const { url } = response.data || {};

      if (url) {
        window.location.href = url;
      } else {
        toast.error('Failed to start payment session');
      }
    } catch (error) {
      console.error('Error starting payment session:', error);
      toast.error('Failed to start payment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'badge-warning',
      confirmed: 'badge-info',
      'in-progress': 'badge-primary',
      completed: 'badge-success',
      cancelled: 'badge-error'
    };
    return colors[status?.toLowerCase()] || 'badge-ghost';
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status?.toLowerCase() === filter.toLowerCase();
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <span className="loading loading-spinner loading-lg text-purple-600"></span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to view your bookings</h2>
          <Link to="/login" className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white border-0">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            My Bookings
          </h1>
          <p className="text-gray-600 text-lg">
            View and manage all your service bookings
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn btn-sm ${
                filter === status
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white border-0'
                  : 'btn-outline'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't made any bookings yet. Explore our services to get started!"
                : `No ${filter} bookings found.`
              }
            </p>
            <Link to="/services" className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white border-0">
              Browse Services
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking._id}
                variants={itemVariants}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="card-body">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-2xl text-gray-900">
                            {booking.serviceId?.service_name || booking.serviceName || 'Service Booking'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Booking ID: {booking._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <span className={`badge ${getStatusColor(booking.status)} badge-lg`}>
                          {booking.status || 'Pending'}
                        </span>
                      </div>

                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span><strong>Name:</strong> {booking.userInfo?.name || booking.userName || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span><strong>Email:</strong> {booking.userInfo?.email || booking.userEmail || 'N/A'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span><strong>Phone:</strong> {booking.userInfo?.phone || booking.phone || 'N/A'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span><strong>Date:</strong> {new Date(booking.serviceDate || booking.date).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span><strong>Time:</strong> {booking.serviceTime || booking.time || 'N/A'}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span><strong>Address:</strong> {booking.location?.address || booking.address || 'N/A'}</span>
                        </div>

                        {booking.specialRequests && (
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span><strong>Notes:</strong> {booking.specialRequests}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span><strong>Payment:</strong> 
                            <span className={`ml-2 badge badge-sm ${booking.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                              {booking.paymentStatus || 'Pending'}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      {booking.serviceId && (
                        <Link
                          to={`/services/${booking.serviceId}`}
                          className="btn btn-sm btn-outline"
                        >
                          View Service
                        </Link>
                      )}
                      {booking.paymentStatus !== 'paid' && booking.status?.toLowerCase() !== 'cancelled' && (
                        <button
                          onClick={() => handlePayNow(booking._id)}
                          className="btn btn-sm bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white border-0"
                        >
                          Pay Now
                        </button>
                      )}
                      
                      {booking.status?.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-sm btn-error btn-outline"
                        >
                          Cancel Booking
                        </button>
                      )}

                      <div className="text-xs text-gray-500 mt-2">
                        Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Summary */}
        {!loading && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center p-4">
                <div className="text-3xl font-bold text-gray-800">{bookings.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center p-4">
                <div className="text-3xl font-bold text-warning">{bookings.filter(b => b.status?.toLowerCase() === 'pending').length}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center p-4">
                <div className="text-3xl font-bold text-info">{bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}</div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
            </div>
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center p-4">
                <div className="text-3xl font-bold text-success">{bookings.filter(b => b.status?.toLowerCase() === 'completed').length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center p-4">
                <div className="text-3xl font-bold text-error">{bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length}</div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
