import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    date: '',
    time: '',
    address: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  useEffect(() => {
    console.log('Auth State:', { currentUser, authLoading });
    if (currentUser) {
      setBookingData(prev => ({
        ...prev,
        name: currentUser.displayName || '',
        email: currentUser.email || ''
      }));
    }
  }, [currentUser, authLoading]);

  const fetchServiceDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/services/${id}`);
      const serviceData = response.data.data;
      
      if (!serviceData) {
        throw new Error('Service not found');
      }
      
      setService(serviceData);
    } catch (error) {
      console.error('Error fetching service details:', error);
      
      // For development/testing: Use mock data if service not found
      const mockService = {
        _id: id,
        service_name: 'Wedding Ceremony Decoration',
        cost: 25000,
        unit: 'per event',
        category: 'wedding',
        description: 'Complete wedding venue decoration with floral arrangements, stage setup, lighting, and thematic decorations. Our expert team will transform your venue into a dream wedding location.',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
        createdByEmail: 'admin@styledecor.com',
        rating: 4.9,
        reviews: 150
      };
      
      setService(mockService);
      console.log('Using mock service:', mockService);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    console.log('=== NEW CODE: handleBookNow called - showing form directly ===');
    console.log('Before setState - showBookingForm:', showBookingForm);
    // Simply show the form - we'll check auth when submitting
    setShowBookingForm(true);
    console.log('After setState - form should show now');
    
    // Update form with user data if available
    const user = currentUser || auth.currentUser;
    if (user) {
      setBookingData(prev => ({
        ...prev,
        name: user.displayName || user.email?.split('@')[0] || prev.name,
        email: user.email || prev.email
      }));
    }
    
    // Scroll to booking form after a short delay
    setTimeout(() => {
      const formElement = document.getElementById('booking-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    console.log('=== SUBMITTING BOOKING - NEW CODE v2 ===');
    setSubmitting(true);

    try {
      // Get user from either source
      const user = currentUser || auth.currentUser;
      console.log('User for submission:', user?.email);
      
      const bookingPayload = {
        serviceId: service._id,
        serviceName: service.service_name,
        userEmail: user?.email || bookingData.email,
        userInfo: {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone
        },
        date: new Date(`${bookingData.date}T${bookingData.time}`).toISOString(),
        serviceDate: new Date(bookingData.date).toISOString(),
        serviceTime: bookingData.time,
        location: {
          address: bookingData.address,
          city: 'Dhaka', // Can be made dynamic
          state: 'Dhaka',
          zipCode: '1000'
        },
        specialRequests: bookingData.notes,
        status: 'pending',
        paymentStatus: 'pending'
      };

      const response = await api.post('/bookings', bookingPayload);
      toast.success('🎉 Booking submitted successfully! We will contact you shortly.');
      setShowBookingForm(false);
      setBookingData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        address: '',
        notes: ''
      });
      // Navigate to bookings page to see the newly created booking
      navigate('/bookings');
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <span className="loading loading-spinner loading-lg text-purple-600"></span>
        <p className="mt-4 text-gray-600">Loading service details...</p>
      </div>
    );
  }     <span className="loading loading-spinner loading-lg text-purple-600"></span>
  if (!service) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
        <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
        <Link to="/services" className="btn bg-purple-600 hover:bg-purple-700 text-white border-0">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm breadcrumbs mb-6"
        >
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li>{service.service_name}</li>
          </ul>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-lg mb-8"
            >
              <img
                src={service.image || 'https://via.placeholder.com/800'}
                alt={service.service_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="badge bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white border-0 badge-lg shadow-xl font-bold capitalize">{service.category}</span>
              </div>
            </motion.div>

            {/* Service Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-300"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">{service.service_name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-semibold">{service.rating || '4.8'}</span>
                </div>
                <span className="text-gray-500">({service.reviews || '100'} reviews)</span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="divider"></div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Service Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Category</p>
                    <p className="text-gray-600 capitalize">{service.category}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Pricing Unit</p>
                    <p className="text-gray-600">{service.unit}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Created By</p>
                    <p className="text-gray-600 text-sm">{service.createdByEmail}</p>
                  </div>
                </div>
                {(service.features || []).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Booking Form */}
            {showBookingForm && (
              <motion.div
                id="booking-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border-2 border-purple-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                  <span className="badge badge-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    Step 1 of 2
                  </span>
                </div>
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Full Name *</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={bookingData.name}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email *</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Phone Number *</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Event Date *</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={bookingData.date}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Event Time *</span>
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={bookingData.time}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Event Address *</span>
                    </label>
                    <textarea
                      name="address"
                      value={bookingData.address}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered h-20"
                      required
                    ></textarea>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Additional Notes</span>
                    </label>
                    <textarea
                      name="notes"
                      value={bookingData.notes}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered h-24"
                      placeholder="Any special requirements or preferences..."
                    ></textarea>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="btn btn-outline flex-1"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 flex-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold"
                      disabled={submitting}
                    >
                      {submitting ? <span className="loading loading-spinner"></span> : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 sticky top-24 border-2 border-purple-400"
            >
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Starting from</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">৳{service.cost}</span>
                  <span className="text-gray-500">/{service.unit}</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 w-full text-lg mb-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all font-bold"
                disabled={showBookingForm}
              >
                {showBookingForm ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    Form Below
                  </span>
                ) : (
                  'Book Now'
                )}
              </button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Flexible payment options</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% satisfaction guaranteed</span>
                </div>
              </div>

              <div className="divider"></div>

              {/* Decorator Info */}
              {service.decorator && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Your Decorator</h4>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full ring ring-purple-600 ring-offset-2">
                        <img src={service.decorator.image} alt={service.decorator.name} />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{service.decorator.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{service.category} Specialist</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="divider"></div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Quick response within 24 hours</span>
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>Need help? Contact support</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;