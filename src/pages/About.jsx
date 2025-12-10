import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6">
            About StyleDecor
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Transforming spaces into extraordinary experiences with our creative decoration and smart home solutions
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 mb-12 border-2 border-purple-200"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Our Story
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            StyleDecor was born from a passion for creating memorable moments through exceptional decoration. 
            We believe that every celebration deserves to be special, and every space has the potential to be extraordinary.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            With years of experience and a team of creative professionals, we've transformed thousands of venues 
            into magical spaces that tell unique stories and create lasting memories.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Creative Design</h3>
            <p className="text-gray-700">
              Innovative and personalized decoration concepts tailored to your vision and style preferences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Quick Setup</h3>
            <p className="text-gray-700">
              Professional and efficient installation process ensuring your event runs smoothly on schedule.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Quality</h3>
            <p className="text-gray-700">
              High-quality materials and attention to detail in every element of our decoration services.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Expert Team</h3>
            <p className="text-gray-700">
              Experienced professionals dedicated to bringing your celebration dreams to life with excellence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Best Value</h3>
            <p className="text-gray-700">
              Competitive pricing with transparent quotes and flexible packages to suit every budget.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-pink-100 to-red-100 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Award Winning</h3>
            <p className="text-gray-700">
              Recognized for excellence in decoration and customer satisfaction across multiple events.
            </p>
          </motion.div>
        </div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border-2 border-purple-200"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-6 text-center">
            Powered by Modern Technology
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="text-3xl">⚛️</div>
              <div>
                <div className="font-bold text-gray-900">React 19</div>
                <div className="text-sm text-gray-600">Modern UI Framework</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl">
              <div className="text-3xl">🎨</div>
              <div>
                <div className="font-bold text-gray-900">Tailwind CSS</div>
                <div className="text-sm text-gray-600">Beautiful Styling</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
              <div className="text-3xl">🔥</div>
              <div>
                <div className="font-bold text-gray-900">Firebase</div>
                <div className="text-sm text-gray-600">Secure Authentication</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="text-3xl">🚀</div>
              <div>
                <div className="font-bold text-gray-900">Vite</div>
                <div className="text-sm text-gray-600">Lightning Fast</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
              <div className="text-3xl">📊</div>
              <div>
                <div className="font-bold text-gray-900">Recharts</div>
                <div className="text-sm text-gray-600">Data Visualization</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl">
              <div className="text-3xl">✨</div>
              <div>
                <div className="font-bold text-gray-900">Framer Motion</div>
                <div className="text-sm text-gray-600">Smooth Animations</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
