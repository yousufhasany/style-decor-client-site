import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { paymentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PaymentSuccess = () => {
  const query = useQuery();
  const sessionId = query.get('session_id');
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError('Missing session ID');
        setLoading(false);
        return;
      }

      try {
        const response = await paymentsAPI.confirmFromSession(sessionId);
        const { payment: paymentData, booking: bookingData } = response.data || {};
        setPayment(paymentData || null);
        setBooking(bookingData || null);
        toast.success('Payment confirmed successfully');
      } catch (err) {
        console.error('Error confirming payment:', err);
        setError('Failed to confirm payment');
        toast.error('Failed to confirm payment');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <span className="loading loading-spinner loading-lg text-purple-600"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link to="/dashboard/user" className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white border-0">
            Back to My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center border-2 border-purple-300"
        >
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">
              Thank you {currentUser?.displayName || currentUser?.email || ''}. Your payment has been processed successfully.
            </p>
          </div>

          {booking && (
            <div className="mt-6 text-left bg-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              <p className="text-gray-700"><strong>Service:</strong> {booking.serviceId?.service_name || 'Service Booking'}</p>
              <p className="text-gray-700"><strong>Date:</strong> {new Date(booking.serviceDate || booking.date).toLocaleDateString()}</p>
              <p className="text-gray-700"><strong>Status:</strong> {booking.status}</p>
              <p className="text-gray-700"><strong>Payment Status:</strong> {booking.paymentStatus}</p>
            </div>
          )}

          {payment && (
            <div className="mt-6 text-left bg-green-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
              <p className="text-gray-700"><strong>Amount:</strong> ৳{payment.amount}</p>
              <p className="text-gray-700"><strong>Currency:</strong> {payment.currency}</p>
              <p className="text-gray-700"><strong>Status:</strong> {payment.status}</p>
              {payment.receiptUrl && (
                <p className="text-gray-700 mt-2">
                  <a
                    href={payment.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                  >
                    View Receipt
                  </a>
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/dashboard/user" className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white border-0">
              Go to My Dashboard
            </Link>
            <Link to="/services" className="btn btn-outline">
              Book Another Service
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
