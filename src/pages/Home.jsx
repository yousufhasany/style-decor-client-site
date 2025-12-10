import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api, { servicesAPI, decoratorsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const [services, setServices] = useState([]);
  const [topDecorators, setTopDecorators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchTopDecorators();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getFeatured(6);
      // Backend returns { success: true, data: [...] }
      const fetchedServices = response.data.data || [];
      
      // Ensure services is always an array
      if (Array.isArray(fetchedServices)) {
        setServices(fetchedServices);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Use mock data for development
      setServices([
        { _id: '1', title: 'Wedding Decoration', type: 'Wedding', price: 5000, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500' },
        { _id: '2', title: 'Birthday Party Setup', type: 'Birthday', price: 2000, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500' },
        { _id: '3', title: 'Corporate Event', type: 'Corporate', price: 8000, image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500' },
        { _id: '4', title: 'Home Interior Design', type: 'Interior', price: 15000, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500' },
        { _id: '5', title: 'Garden Party Decor', type: 'Outdoor', price: 3500, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500' },
        { _id: '6', title: 'Anniversary Celebration', type: 'Anniversary', price: 4000, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopDecorators = async () => {
    try {
      const response = await decoratorsAPI.getTop();
      const fetchedDecorators = response.data.decorators || response.data || [];
      
      // Ensure decorators is always an array
      if (Array.isArray(fetchedDecorators)) {
        setTopDecorators(fetchedDecorators);
      } else {
        setTopDecorators([]);
      }
    } catch (error) {
      console.error('Error fetching decorators:', error);
      // Use mock data for development (backend endpoint not created yet)
      setTopDecorators([
        { _id: '1', name: 'Sarah Johnson', rating: 4.9, projects: 150, image: 'https://randomuser.me/api/portraits/women/1.jpg', specialty: 'Wedding Specialist' },
        { _id: '2', name: 'Michael Chen', rating: 4.8, projects: 120, image: 'https://randomuser.me/api/portraits/men/2.jpg', specialty: 'Corporate Events' },
        { _id: '3', name: 'Emily Williams', rating: 4.9, projects: 180, image: 'https://randomuser.me/api/portraits/women/3.jpg', specialty: 'Interior Design' },
        { _id: '4', name: 'David Brown', rating: 4.7, projects: 95, image: 'https://randomuser.me/api/portraits/men/4.jpg', specialty: 'Outdoor Events' },
      ]);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 px-4 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Dive Into The World of{' '}
                <span className="text-yellow-300 drop-shadow-xl">
                  Smart Home Automation
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-white/90 mb-8 leading-relaxed drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover the perfect synergy of innovation and comfort as your home effortlessly adjusts to meet your needs, 
                providing a living environment that's personalized to your unique lifestyle and preferences.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link to="/services" className="btn bg-white hover:bg-gray-100 text-purple-600 border-0 rounded-full px-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all font-bold">
                  Explore Services
                </Link>
                <Link to="/about" className="btn bg-white/20 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-purple-600 rounded-full px-8 shadow-lg hover:scale-105 transition-all font-bold">
                  Learn More
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-6 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-yellow-300 drop-shadow-lg">500+</div>
                  <div className="text-sm text-white/90 drop-shadow-md">Projects Done</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-yellow-300 drop-shadow-lg">98%</div>
                  <div className="text-sm text-white/90 drop-shadow-md">Client Satisfaction</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-yellow-300 drop-shadow-lg">50+</div>
                  <div className="text-sm text-white/90 drop-shadow-md">Expert Decorators</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400" 
                    alt="Smart Lamp"
                    className="w-full h-48 object-cover rounded-2xl mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Smart Lamp</h3>
                      <p className="text-sm text-gray-600">Xiaomi</p>
                    </div>
                    <div className="badge badge-success gap-2">
                      <span className="text-xs">30-60m</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all mt-8"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1558002038-1055907df827?w=400" 
                    alt="AI Technology"
                    className="w-full h-48 object-cover rounded-2xl mb-4"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">AI Modern Technology</h3>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all col-span-2"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Security Guarantee</h3>
                      <p className="text-sm text-gray-300">Your security is our top priority.</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    We always protecting your home, family, and privacy.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all col-span-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Total Energy Usage</p>
                      <h2 className="text-3xl font-bold">10,346 kWh</h2>
                    </div>
                    <div className="w-16 h-16">
                      <svg viewBox="0 0 100 100" className="text-white opacity-90">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.3"/>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset="70" transform="rotate(-90 50 50)"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </section>

      {/* Brand Partners Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-center text-white text-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Collaborating with Several Smart Device Brands
          </motion.h2>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-70"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-white text-3xl font-bold">PHILIPS</motion.div>
            <motion.div variants={itemVariants} className="text-white text-3xl">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
            </motion.div>
            <motion.div variants={itemVariants} className="text-white text-3xl font-bold">XIAOMI</motion.div>
            <motion.div variants={itemVariants} className="text-white text-3xl font-bold">HUAWEI</motion.div>
            <motion.div variants={itemVariants} className="text-white text-3xl font-bold">SAMSUNG</motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Our Featured Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of decoration and smart home services tailored to transform your space
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-purple-600"></span>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No services available at the moment. Check back soon!</p>
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {Array.isArray(services) && services.map((service) => (
                <motion.div
                  key={service._id}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-400 overflow-hidden"
                >
                  <figure className="relative h-56 overflow-hidden">
                    <img 
                      src={service.image || 'https://via.placeholder.com/500'} 
                      alt={service.service_name || service.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="badge bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white border-0 shadow-lg font-bold">{service.category || service.type}</span>
                    </div>
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-gray-900">{service.service_name || service.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{service.description || 'Professional decoration service for your special moments'}</p>
                    <div className="card-actions justify-between items-center mt-4">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">৳{service.cost || service.price}/{service.unit || 'service'}</span>
                      <Link to={`/services/${service._id}`} className="btn btn-sm bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/services" className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 rounded-full px-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all font-bold">
              View All Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Top Decorators Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Meet Our Top Decorators
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Work with experienced professionals who bring creativity and excellence to every project
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {topDecorators.map((decorator) => (
              <motion.div
                key={decorator._id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-400 overflow-hidden"
              >
                <figure className="px-6 pt-6">
                  <div className="avatar">
                    <div className="w-32 rounded-full ring-4 ring-purple-500 hover:ring-pink-500 transition-all ring-offset-4">
                      <img src={decorator.image} alt={decorator.name} />
                    </div>
                  </div>
                </figure>
                <div className="card-body items-center text-center">
                  <h3 className="card-title text-gray-900">{decorator.name}</h3>
                  <p className="text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent font-bold">{decorator.specialty}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span className="font-semibold">{decorator.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {decorator.projects}+ projects
                    </div>
                  </div>
                  <button className="btn btn-sm bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 mt-4 w-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold">
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div 
          className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-12 text-center text-white shadow-2xl hover:shadow-3xl transition-all border-4 border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of satisfied customers and experience the magic of professional decoration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services" className="btn bg-white text-purple-600 hover:bg-gray-100 border-0 rounded-full px-8 shadow-xl hover:shadow-2xl hover:scale-110 transition-all font-bold">
              Browse Services
            </Link>
            <Link to="/contact" className="btn bg-white/20 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-purple-600 rounded-full px-8 shadow-lg hover:scale-110 transition-all font-bold">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
