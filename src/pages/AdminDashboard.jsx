import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDecoratorModal, setShowDecoratorModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingDecorator, setEditingDecorator] = useState(null);

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    service_name: '',
    cost: '',
    unit: '',
    category: '',
    description: '',
    image: ''
  });

  // Decorator form state
  const [decoratorEmail, setDecoratorEmail] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalServices: 0,
    totalDecorators: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [serviceTypeData, setServiceTypeData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, decoratorsRes, bookingsRes, summaryRes, trendRes, revenueByCategoryRes] = await Promise.all([
        api.get('/services'),
        api.get('/decorators'),
        api.get('/bookings'),
        api.get('/analytics/summary'),
        api.get('/analytics/bookings-trend?days=30'),
        api.get('/analytics/revenue-by-category')
      ]);
      
      // getAllServices returns { success, count, data: [...] }
      setServices(servicesRes.data.data || servicesRes.data.services || servicesRes.data || []);
      // getAllDecorators returns { success, count, data: [...] }
      setDecorators(decoratorsRes.data.data || decoratorsRes.data.decorators || decoratorsRes.data || []);
      // For admin, getAllBookings returns { success, count, data: [...] }
      setBookings(bookingsRes.data.data || bookingsRes.data.bookings || bookingsRes.data || []);

      const summary = summaryRes.data?.data || {};
      setStats({
        totalRevenue: summary.totalRevenue || 0,
        totalBookings: summary.totalBookings || 0,
        totalServices: summary.totalServices || (servicesRes.data.data?.length || servicesRes.data.services?.length || servicesRes.data?.length || 0),
        totalDecorators: summary.totalDecorators || (decoratorsRes.data.data?.length || decoratorsRes.data.decorators?.length || decoratorsRes.data?.length || 0)
      });

      const trendData = trendRes.data?.data || [];
      setRevenueData(trendData.map(item => ({
        month: item.date,
        revenue: item.bookings
      })));

      const categoryData = revenueByCategoryRes.data?.data || [];
      const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];
      setServiceTypeData(categoryData.map((item, index) => ({
        name: item.category,
        value: item.revenue,
        color: colors[index % colors.length]
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
      // Mock data
      setServices([
        { _id: '1', title: 'Wedding Decoration', type: 'Wedding', price: 5000, status: 'active' },
        { _id: '2', title: 'Birthday Party', type: 'Birthday', price: 2000, status: 'active' }
      ]);
      setDecorators([
        { _id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', rating: 4.9, projects: 150, status: 'active' },
        { _id: '2', name: 'Michael Chen', email: 'michael@example.com', rating: 4.8, projects: 120, status: 'active' }
      ]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Service CRUD handlers
  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceForm(prev => ({ ...prev, [name]: value }));
  };

  const resetServiceForm = () => {
    setServiceForm({
      service_name: '',
      cost: '',
      unit: '',
      category: '',
      description: '',
      image: ''
    });
    setEditingService(null);
  };

  const openCreateServiceModal = () => {
    resetServiceForm();
    setShowServiceModal(true);
  };

  const openEditServiceModal = (service) => {
    setServiceForm({
      service_name: service.service_name || service.title || '',
      cost: service.cost || service.price || '',
      unit: service.unit || '',
      category: service.category || service.type || '',
      description: service.description || '',
      image: service.image || ''
    });
    setEditingService(service);
    setShowServiceModal(true);
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const serviceData = {
        ...serviceForm,
        cost: parseFloat(serviceForm.cost),
        createdByEmail: currentUser.email
      };

      if (editingService) {
        await api.put(`/services/${editingService._id}`, serviceData);
        toast.success('Service updated successfully!');
      } else {
        await api.post('/services', serviceData);
        toast.success('Service created successfully!');
      }

      setShowServiceModal(false);
      resetServiceForm();
      fetchData();
    } catch (error) {
      console.error('Error submitting service:', error);
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await api.delete(`/services/${serviceId}`);
      toast.success('Service deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  // Decorator management handlers
  const searchUserByEmail = async () => {
    if (!decoratorEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.get(`/users/search?email=${decoratorEmail}`);
      setSearchedUser(response.data.data);
      toast.success('User found!');
    } catch (error) {
      console.error('Error searching user:', error);
      toast.error('User not found');
      setSearchedUser(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMakeDecorator = async () => {
    if (!searchedUser) {
      toast.error('Please search for a user first');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/decorators/make', { userId: searchedUser._id });
      toast.success('User converted to decorator successfully!');
      setShowDecoratorModal(false);
      setDecoratorEmail('');
      setSearchedUser(null);
      fetchData();
    } catch (error) {
      console.error('Error making decorator:', error);
      toast.error(error.response?.data?.message || 'Failed to make decorator');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleDecoratorApproval = async (decoratorId, currentStatus) => {
    try {
      await api.patch(`/decorators/${decoratorId}/approval`, { 
        isApproved: !currentStatus 
      });
      toast.success(`Decorator ${!currentStatus ? 'approved' : 'disabled'} successfully!`);
      fetchData();
    } catch (error) {
      console.error('Error toggling decorator approval:', error);
      toast.error('Failed to update decorator status');
    }
  };

  const handleDeleteDecorator = async (decoratorId) => {
    if (!window.confirm('Are you sure you want to delete this decorator?')) return;
    
    try {
      await api.delete(`/decorators/${decoratorId}`);
      toast.success('Decorator deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete decorator');
    }
  };

  const handleAssignDecorator = async (bookingId, decoratorId) => {
    try {
      await api.patch(`/bookings/${bookingId}/assign`, { decoratorId });
      toast.success('Decorator assigned successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to assign decorator');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SmartDecor</span>
          </div>

          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Management</p>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'services' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-medium">Services</span>
              </button>

              <button
                onClick={() => setActiveTab('decorators')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'decorators' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Decorators</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'bookings' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">Bookings</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
              {currentUser?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.displayName || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">Admin Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your business metrics</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Total Revenue</span>
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <h3 className="text-3xl font-bold text-gray-900">৳{stats.totalRevenue.toLocaleString()}</h3>
                    <span className="ml-2 text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      0.6%
                    </span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Total Bookings</span>
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalBookings}</h3>
                    <span className="ml-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      0.2%
                    </span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Total Services</span>
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{services.length}</h3>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Total Decorators</span>
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{decorators.length}</h3>
                </motion.div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Bookings Trend (Last 30 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by Service Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={serviceTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {serviceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {serviceTypeData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-600">{item.name} - ৳{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Services</h1>
                  <p className="text-gray-500 mt-1">Manage your service offerings</p>
                </div>
                <button 
                  onClick={openCreateServiceModal}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Service</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {service.service_name || service.title || 'Untitled Service'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {service.category || service.type || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ৳{(service.cost ?? service.price ?? 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {service.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => openEditServiceModal(service)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteService(service._id)} 
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Decorators Tab */}
          {activeTab === 'decorators' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Decorators</h1>
                  <p className="text-gray-500 mt-1">Manage your decorator team</p>
                </div>
                <button 
                  onClick={() => setShowDecoratorModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Make Decorator</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {decorators.map((decorator) => (
                      <tr key={decorator._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{decorator.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{decorator.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">⭐ {decorator.rating}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{decorator.projects}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {decorator.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => handleToggleDecoratorApproval(decorator._id, decorator.isApproved)}
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                decorator.isApproved 
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {decorator.isApproved ? 'Disable' : 'Approve'}
                            </button>
                            <button 
                              onClick={() => handleDeleteDecorator(decorator._id)} 
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                  <p className="text-gray-500 mt-1">Manage and assign bookings to decorators</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {bookings.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No bookings found yet.
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decorator</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((booking) => {
                        const service = booking.serviceId || {};
                        const customer = booking.userInfo || {};
                        const bookingDate = booking.serviceDate || booking.date;
                        const decoratorId = booking.assignedDecorator;
                        const assignedDecorator = decorators.find(d => String(d._id) === String(decoratorId));

                        return (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {service.service_name || 'Service'}
                              {service.category && (
                                <span className="ml-2 text-xs text-gray-500 capitalize">({service.category})</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              <div className="text-xs text-gray-500">{customer.email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {bookingDate ? new Date(bookingDate).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              ৳{(service.cost || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 capitalize">
                                {booking.status || booking.bookingStatus || 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {assignedDecorator ? (
                                <>
                                  <div className="font-medium text-gray-900">{assignedDecorator.name}</div>
                                  <div className="text-xs text-gray-500">{assignedDecorator.email}</div>
                                </>
                              ) : (
                                <span className="text-xs text-gray-400">Not assigned</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <select
                                  className="select select-xs select-bordered"
                                  defaultValue=""
                                  onChange={(e) => {
                                    const id = e.target.value;
                                    if (!id) return;
                                    handleAssignDecorator(booking._id, id);
                                    e.target.value = '';
                                  }}
                                >
                                  <option value="" disabled>
                                    Assign decorator
                                  </option>
                                  {decorators.map((decorator) => (
                                    <option key={decorator._id} value={decorator._id}>
                                      {decorator.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Service Create/Edit Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingService ? 'Edit Service' : 'Create New Service'}
                </h2>
                <button 
                  onClick={() => {
                    setShowServiceModal(false);
                    resetServiceForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitService} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="service_name"
                  value={serviceForm.service_name}
                  onChange={handleServiceFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Premium Wedding Decoration"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={serviceForm.cost}
                    onChange={handleServiceFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 5000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={serviceForm.unit}
                    onChange={handleServiceFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., per event, per sqft"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={serviceForm.category}
                  onChange={handleServiceFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="home">Home</option>
                  <option value="wedding">Wedding</option>
                  <option value="office">Office</option>
                  <option value="seminar">Seminar</option>
                  <option value="meeting">Meeting</option>
                  <option value="birthday">Birthday</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={serviceForm.image}
                  onChange={handleServiceFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {serviceForm.image && (
                  <div className="mt-2">
                    <img 
                      src={serviceForm.image} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={serviceForm.description}
                  onChange={handleServiceFormChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe the service in detail..."
                  maxLength="1000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {serviceForm.description.length}/1000 characters
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceModal(false);
                    resetServiceForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingService ? 'Update Service' : 'Create Service')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Decorator Creation Modal */}
      {showDecoratorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Make User a Decorator</h2>
                <button 
                  onClick={() => {
                    setShowDecoratorModal(false);
                    setDecoratorEmail('');
                    setSearchedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Email <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={decoratorEmail}
                    onChange={(e) => setDecoratorEmail(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="user@example.com"
                  />
                  <button
                    onClick={searchUserByEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>

              {searchedUser && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">User Found:</h3>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Name:</span> {searchedUser.name}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {searchedUser.email}</p>
                    <p className="text-sm"><span className="font-medium">Current Role:</span> {searchedUser.role}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDecoratorModal(false);
                    setDecoratorEmail('');
                    setSearchedUser(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleMakeDecorator}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting || !searchedUser}
                >
                  {submitting ? 'Converting...' : 'Make Decorator'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
