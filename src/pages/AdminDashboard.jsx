import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaGamepad, FaChartLine, FaSignOutAlt, FaCog, FaUserCog } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AdminGameManagement from '../Components/Admin/AdminGameManagement';
import AdminUserManagement from '../Components/Admin/AdminUserManagement';
import { getActiveSessionsCount, cleanupExpiredSessions } from '../utils/sessionUtils';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('games'); // 'games' or 'users'
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [totalGamesCount, setTotalGamesCount] = useState(0);
  const [activeSessionsCount, setActiveSessionsCount] = useState(0);

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdmin');
    const adminToken = localStorage.getItem('adminToken');

    if (isAdmin === 'true' && adminToken) {
      setIsAuthenticated(true);
      
      // Fetch active users count
      const fetchActiveUsers = async () => {
        try {
          console.log('Fetching active users count...');
          const response = await fetch('https://localhost:7270/api/Auth/count');
          console.log('Response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            
            // Try different ways to extract the count
            let count = 0;
            if (typeof data === 'number') {
              count = data;
            } else if (data && typeof data === 'object') {
              // Try common property names
              count = data.count || data.total || data.activeUsers || data.totalUsers || 0;
            }
            
            console.log('Extracted count:', count);
            setActiveUsersCount(count);
          } else {
            const errorText = await response.text();
            console.error('API Error:', errorText);
          }
        } catch (error) {
          console.error('Error in fetchActiveUsers:', error);
        }
      };

      // Fetch total games count
      const fetchGamesCount = async () => {
        try {
          console.log('Fetching total games count...');
          const response = await fetch('https://localhost:7270/api/Game/all');
          console.log('Games API response status:', response.status);
          
          if (response.ok) {
            const games = await response.json();
            console.log('Games API Response:', games);
            
            // Count the games
            let count = 0;
            if (Array.isArray(games)) {
              count = games.length;
            } else if (games && typeof games === 'object') {
              // If response has a data property with array
              if (Array.isArray(games.data)) {
                count = games.data.length;
              } else if (games.count || games.total) {
                count = games.count || games.total;
              }
            }
            
            console.log('Total games count:', count);
            setTotalGamesCount(count);
          } else {
            const errorText = await response.text();
            console.error('Games API Error:', errorText);
          }
        } catch (error) {
          console.error('Error in fetchGamesCount:', error);
        }
      };
      
      // Fetch active sessions count from cookies and localStorage
      const fetchActiveSessions = () => {
        try {
          console.log('Counting active sessions from cookies/localStorage...');
          
          // Clean up any expired sessions first
          const cleanedCount = cleanupExpiredSessions();
          if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} expired sessions`);
          }
          
          // Get count of active, non-expired sessions
          const activeSessions = getActiveSessionsCount();
          console.log('Active sessions count:', activeSessions);
          setActiveSessionsCount(activeSessions);
        } catch (error) {
          console.error('Error in fetchActiveSessions:', error);
          setActiveSessionsCount(0);
        }
      };

      fetchActiveUsers();
      fetchGamesCount();
      fetchActiveSessions();
      
      // Set up interval to refresh active sessions count every 30 seconds
      const sessionInterval = setInterval(() => {
        fetchActiveSessions();
      }, 30000); // 30 seconds
      
      return () => clearInterval(sessionInterval);
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Helper to format large numbers with commas
  const formatNumber = (n) => {
    if (typeof n !== 'number' || Number.isNaN(n)) return '0';
    return n.toLocaleString();
  };

  const stats = [
    { title: 'Total Users', value: formatNumber(activeUsersCount), icon: FaUsers, color: 'cyan', bgClass: 'bg-cyan-500/20', textClass: 'text-cyan-400', iconClass: 'text-cyan-400' },
    { title: 'Total Games', value: formatNumber(totalGamesCount), icon: FaGamepad, color: 'purple', bgClass: 'bg-purple-500/20', textClass: 'text-purple-400', iconClass: 'text-purple-400' },
    { title: 'Active Sessions', value: formatNumber(activeSessionsCount), icon: FaCog, color: 'orange', bgClass: 'bg-orange-500/20', textClass: 'text-orange-400', iconClass: 'text-orange-400' },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800/90 backdrop-blur-md border-b border-gray-700 shadow-lg flex-shrink-0">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-2 rounded-lg shadow-lg">
              <FaUsers className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Welcome back, Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-red-500/25"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-6 py-3 font-medium ${activeTab === 'games' ? 'text-red-400 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              <FaGamepad className="inline mr-2" />
              Manage Games
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium ${activeTab === 'users' ? 'text-red-400 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              <FaUserCog className="inline mr-2" />
              Manage Users
            </button>
          </div>

          {activeTab === 'users' ? (
            <AdminUserManagement />
          ) : (
            <>
              {/* Existing content for games tab */}
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={stat.bgClass + " p-3 rounded-lg"}>
                  <stat.icon className={`text-2xl ${stat.iconClass}`} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-cyan-600 hover:bg-cyan-700 px-6 py-4 rounded-lg font-semibold transition-all">
              Manage Users
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-lg font-semibold transition-all">
              Manage Games
            </button>
            <button className="bg-green-600 hover:bg-green-700 px-6 py-4 rounded-lg font-semibold transition-all">
              View Reports
            </button>
          </div>
        </div> */}

        {/* Game Management Section */}
        <AdminGameManagement />

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                <div>
                  <p className="font-semibold">User Activity #{item}</p>
                  <p className="text-sm text-gray-400">Action performed 2 hours ago</p>
                </div>
                <span className="text-green-400 text-sm">Success</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Server Status</span>
                <span className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database</span>
                <span className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Connected
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Response Time</span>
                <span className="text-blue-400">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Active Users</span>
                <span className="text-purple-400">{activeUsersCount}</span>
              </div>
            </div>
          </div>
        </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
