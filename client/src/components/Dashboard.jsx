import React, { useContext, useEffect, useState } from 'react';
import api from '../utils/api.js';
import ApplicationList from './ApplicationList.jsx';
import AddApplication from './AddApplication.jsx';
import StatsCard from './StatsCard.jsx';
import ProfileModal from './ProfileModal.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/applications');
      const appData = res.data.applications || res.data;
      setApplications(Array.isArray(appData) ? appData : []);
    } catch (error) {
      console.error('Error in Fetching Applications', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/v1/applications/stats');
      const statsData = response.data.stats || response.data;
      setStats(Array.isArray(statsData) ? statsData : []);
    } catch (error) {
      console.error('Error in Fetching Stats', error);
      setStats([]);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const chartData =
    Array.isArray(stats) && stats.length > 0
      ? stats.map((stat) => ({
          status: stat._id || stat.status || 'Unknown',
          count: stat.count || 0,
        }))
      : [
          { status: 'Applied', count: 0 },
          { status: 'Interview', count: 0 },
          { status: 'Offer', count: 0 },
          { status: 'Rejected', count: 0 },
        ];

  // console.log('Chart data:', chartData); // Debug log

  return (
    <div className="min-h-screen bg-slate-600">
      <nav className="bg-slate-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Job Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Keep the link to full page profile */}
              <Link
                to="/profile"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 hover:text-white transition duration-200"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats and Chart */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Applications"
                value={applications?.length || 0}
                color="blue"
              />
              <StatsCard
                title="Interviews"
                value={
                  applications?.filter((app) => app.status === 'Interview')
                    ?.length || 0
                }
                color="green"
              />
              <StatsCard
                title="Offers"
                value={
                  applications?.filter((app) => app.status === 'Offer')
                    ?.length || 0
                }
                color="purple"
              />
              <StatsCard
                title="Rejected"
                value={
                  applications?.filter((app) => app.status === 'Rejected')
                    ?.length || 0
                }
                color="red"
              />
            </div>

            {/* Chart */}
            <div className="bg-slate-100 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Application Status Distribution
              </h2>
              {chartData && chartData.length > 0 ? (
                <div
                  className="relative"
                  style={{ width: '100%', height: '320px', minHeight: '320px' }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minHeight={320}
                    minWidth={300}
                    debounce={1}
                  >
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="status"
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 bg-gray-50 rounded">
                  <p className="text-gray-500">
                    {applications.length === 0
                      ? 'No applications yet. Add some to see the chart.'
                      : 'Loading chart data...'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Add Application */}
          <div>
            <AddApplication onAdd={fetchApplications} />
          </div>
        </div>

        {/* Application List */}
        <div className="mt-8">
          <ApplicationList
            applications={applications || []}
            loading={loading}
            onUpdate={fetchApplications}
          />
        </div>
      </div>
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}

export default Dashboard;
