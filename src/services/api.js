import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      // Note: we no longer force a redirect to /login here on 401.
      // Protected routes and components should handle auth/role issues
      // so that admin/decorator dashboards are not bounced back to login
      // just because one API call failed.
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods for services
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getFeatured: (limit = 6) => api.get('/services/featured', { params: { limit } }),
  getCategories: () => api.get('/services/categories'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`)
};

// API methods for bookings
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getByUserId: (userId) => api.get(`/bookings/user/${userId}`),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  cancel: (id) => api.delete(`/bookings/${id}`),
  rate: (id, data) => api.patch(`/bookings/${id}/rating`, data)
};

// API methods for payments
export const paymentsAPI = {
  createCheckoutSessionForBooking: (bookingId) =>
    api.post('/payments/create-checkout-session', { bookingId }),
  confirmFromSession: (sessionId) =>
    api.post('/payments/confirm', { sessionId }),
  getByUserEmail: (email) =>
    api.get(`/payments/user/${email}`)
};

// API methods for users
export const usersAPI = {
  create: (data) => api.post('/users', data),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

// API methods for decorators
export const decoratorsAPI = {
  getAll: () => api.get('/decorators'),
  getTop: () => api.get('/decorators/top'),
  getById: (id) => api.get(`/decorators/${id}`)
};

// API methods for contact
export const contactAPI = {
  send: (data) => api.post('/contact', data)
};

export default api;
