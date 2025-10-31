import { useState, useEffect } from 'react';
import { FaChartLine, FaChartBar, FaChartPie, FaDownload, FaCalendar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalGames: 0,
    totalRevenue: 0,
    totalOrders: 0,
    monthlyGrowth: 0,
    popularGames: [],
    recentOrders: [],
    userActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Fetch multiple analytics endpoints
      const [usersRes, gamesRes, ordersRes] = await Promise.all([
        fetch('https://localhost:7270/api/Analytics/users'),
        fetch('https://localhost:7270/api/Analytics/games'),
        fetch('https://localhost:7270/api/Analytics/orders')
      ]);

      if (usersRes.ok && gamesRes.ok && ordersRes.ok) {
        const [usersData, gamesData, ordersData] = await Promise.all([
          usersRes.json(),
          gamesRes.json(),
          ordersRes.json()
        ]);

        setAnalytics({
          totalUsers: usersData.total || 0,
          totalGames: gamesData.total || 0,
          totalRevenue: ordersData.totalRevenue || 0,
          totalOrders: ordersData.total || 0,
          monthlyGrowth: usersData.growth || 0,
          popularGames: gamesData.popular || [],
          recentOrders: ordersData.recent || [],
          userActivity: usersData.activity || []
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const data = JSON.stringify(analytics, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
          <p className="text-gray-400">Platform insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={exportReport}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
          >
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <FaChartLine className="text-2xl text-blue-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">
              +{analytics.monthlyGrowth}%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Users</h3>
          <p className="text-3xl font-bold text-white">{analytics.totalUsers.toLocaleString()}</p>
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <FaChartBar className="text-2xl text-purple-400" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Games</h3>
          <p className="text-3xl font-bold text-white">{analytics.totalGames.toLocaleString()}</p>
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <FaChartPie className="text-2xl text-green-400" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-400">${analytics.totalRevenue.toLocaleString()}</p>
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500/20 p-3 rounded-lg">
              <FaCalendar className="text-2xl text-orange-400" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Orders</h3>
          <p className="text-3xl font-bold text-white">{analytics.totalOrders.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Popular Games */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Popular Games</h3>
          <div className="space-y-3">
            {analytics.popularGames.slice(0, 5).map((game, index) => (
              <div key={game.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="font-semibold text-white">{game.title}</p>
                    <p className="text-sm text-gray-400">{game.genre}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">{game.sales} sales</p>
                  <p className="text-sm text-gray-400">${game.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {analytics.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-semibold text-white">Order #{order.id}</p>
                  <p className="text-sm text-gray-400">{order.user}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">${order.amount}</p>
                  <p className="text-sm text-gray-400">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User Activity Chart Placeholder */}
      <motion.div
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">User Activity Overview</h3>
        <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FaChartLine className="text-4xl mx-auto mb-2" />
            <p>Chart visualization would go here</p>
            <p className="text-sm">Integration with charting library needed</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
