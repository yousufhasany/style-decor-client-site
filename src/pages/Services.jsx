import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 50000 });

  const serviceTypes = ['all', 'home', 'wedding', 'office', 'seminar', 'meeting', 'birthday', 'corporate'];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedType, budgetRange, services]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      const servicesData = response.data.data || [];
      setServices(servicesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = services;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(service => service.category === selectedType);
    }

    // Budget filter
    filtered = filtered.filter(service =>
      service.cost >= budgetRange.min && service.cost <= budgetRange.max
    );

    setFilteredServices(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setBudgetRange({ min: 0, max: 50000 });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our wide range of decoration and smart home services. 
            Find the perfect solution for your needs.
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-300"
        >
          <div className="grid md:grid-cols-12 gap-6">
            {/* Search Bar */}
            <div className="md:col-span-5">
              <label className="label">
                <span className="label-text font-semibold">Search Services</span>
              </label>
              <input
                type="text"
                placeholder="Search by name or description..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="md:col-span-3">
              <label className="label">
                <span className="label-text font-semibold">Service Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {serviceTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div className="md:col-span-4">
              <label className="label">
                <span className="label-text font-semibold">
                  Budget Range: ৳{budgetRange.min} - ৳{budgetRange.max}
                </span>
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  className="range range-primary range-sm"
                  value={budgetRange.max}
                  onChange={(e) => setBudgetRange({ ...budgetRange, max: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>৳0</span>
                <span>৳50k</span>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-purple-600">{filteredServices.length}</span> of {services.length} services
            </div>
            <button
              onClick={resetFilters}
              className="btn btn-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
          </div>
        ) : filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Services Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
            <button onClick={resetFilters} className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0">
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-400 overflow-hidden"
              >
                <figure className="relative h-56 overflow-hidden">
                  <img
                    src={service.image || 'https://via.placeholder.com/500'}
                    alt={service.service_name || service.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                    <div className="absolute top-4 right-4">
                      <span className="badge bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 shadow-lg capitalize">{service.category}</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <button className="btn btn-circle btn-sm bg-gradient-to-r from-pink-200 to-red-200 hover:from-pink-300 hover:to-red-300 border-0 shadow-lg">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-gray-900">{service.service_name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {service.description || 'Professional decoration service for your special moments'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">{service.rating || '4.8'}</span>
                    </div>
                    <span className="text-sm text-gray-500">({service.reviews || '120'} reviews)</span>
                  </div>
                  <div className="card-actions justify-between items-center mt-4">
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">৳{service.cost}</span>
                      <span className="text-sm text-gray-500 ml-1">/{service.unit}</span>
                    </div>
                    <Link
                      to={`/services/${service._id}`}
                      className="btn btn-sm bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;