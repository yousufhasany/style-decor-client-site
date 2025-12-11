import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const DecoratorDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    if (currentUser?.uid) {
      fetchProjects();
    }
  }, [currentUser]);

  const fetchProjects = async () => {
    try {
      const response = await api.get(`/bookings/decorator/${currentUser.uid}`);
      const projectsData = response.data.bookings || response.data.data || response.data || [];
      setProjects(projectsData);

      // Calculate stats
      const totalProjects = projectsData.length;
      const activeProjects = projectsData.filter(p => p.status?.toLowerCase() === 'in-progress' || p.status?.toLowerCase() === 'confirmed').length;
      const completedProjects = projectsData.filter(p => p.status?.toLowerCase() === 'completed').length;
      const totalEarnings = projectsData
        .filter(p => p.status?.toLowerCase() === 'completed')
        .reduce((sum, p) => sum + (p.decoratorEarning || (p.totalAmount || 0) * 0.7), 0);

      setStats({ totalProjects, activeProjects, completedProjects, totalEarnings });
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Mock data
      const mockProjects = [
        {
          _id: '1',
          serviceId: { title: 'Wedding Decoration', type: 'Wedding' },
          clientName: 'John Doe',
          date: '2024-12-25',
          time: '10:00',
          status: 'in-progress',
          totalAmount: 5000,
          decoratorEarning: 3500,
          address: '123 Main St, Mumbai',
          statusSteps: [
            { step: 'Confirmed', completed: true },
            { step: 'Planning', completed: true },
            { step: 'In Progress', completed: true },
            { step: 'Completed', completed: false }
          ]
        },
        {
          _id: '2',
          serviceId: { title: 'Birthday Party Setup', type: 'Birthday' },
          clientName: 'Jane Smith',
          date: '2024-12-20',
          time: '16:00',
          status: 'confirmed',
          totalAmount: 2000,
          decoratorEarning: 1400,
          address: '456 Park Ave, Mumbai',
          statusSteps: [
            { step: 'Confirmed', completed: true },
            { step: 'Planning', completed: false },
            { step: 'In Progress', completed: false },
            { step: 'Completed', completed: false }
          ]
        }
      ];
      setProjects(mockProjects);
      setStats({ totalProjects: 2, activeProjects: 2, completedProjects: 0, totalEarnings: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (projectId, stepIndex) => {
    try {
      await api.patch(`/bookings/${projectId}/status`, { stepIndex, completed: true });
      toast.success('Status updated successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error updating status:', error?.response?.data || error);
      const message = error?.response?.data?.message || 'Failed to update status';
      toast.error(message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'projects'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">My Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('earnings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'earnings'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Earnings</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Profile</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
              {currentUser?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.displayName || 'Decorator'}
              </p>
              <p className="text-xs text-gray-500 truncate">Decorator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Decorator Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your projects and track earnings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Total Projects</span>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalProjects}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Active Projects</span>
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.activeProjects}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Completed</span>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.completedProjects}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Total Earnings</span>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">৳{stats.totalEarnings.toLocaleString()}</h3>
            </motion.div>
          </div>

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {loading ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : projects.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects assigned yet</h3>
                  <p className="text-gray-500">You'll see your assigned projects here.</p>
                </div>
              ) : (
                projects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {project.serviceId?.title || 'Service'}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">Client: {project.clientName || 'N/A'}</p>
                        <p className="text-gray-600 mb-1">Date: {project.date} at {project.time}</p>
                        <p className="text-gray-600">Location: {project.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Your Earning</p>
                        <p className="text-2xl font-bold text-purple-600">৳{project.decoratorEarning?.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Status Steps */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Project Progress</h4>
                      <div className="space-y-3">
                        {project.statusSteps?.map((step, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <button
                              onClick={() => !step.completed && handleUpdateStatus(project._id, index)}
                              disabled={step.completed}
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                step.completed
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                            >
                              {step.completed && (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <span className={`text-sm ${step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                              {step.step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Earnings Overview</h2>
              <div className="space-y-4">
                {projects.filter(p => p.status === 'completed').map((project) => (
                  <div key={project._id} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{project.serviceId?.title}</p>
                      <p className="text-sm text-gray-500">{project.date}</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">৳{project.decoratorEarning?.toLocaleString()}</p>
                  </div>
                ))}
                {projects.filter(p => p.status === 'completed').length === 0 && (
                  <p className="text-center text-gray-500 py-8">No completed projects yet</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DecoratorDashboard;
