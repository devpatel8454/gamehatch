import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaShieldAlt, FaGamepad, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../Context/Authcontext';
import { useNavigate } from 'react-router-dom';
import SEO from '../Components/SEO/SEO';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Footer from '../Components/Footer/Footer';
import { showError } from '../utils/toast';

const Profile = () => {
  const { user: authUser, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  // Decode JWT token to get user ID
  const decodeJwtPayload = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // Fetch user details from API
  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        
        // Decode token to get user ID
        const tokenPayload = decodeJwtPayload(token);
        console.log('Token payload:', tokenPayload);
        
        // Extract user ID from token (try different claim names)
        const userId = tokenPayload?.sub || 
                      tokenPayload?.nameid || 
                      tokenPayload?.userId || 
                      tokenPayload?.UserId || 
                      tokenPayload?.uid || 
                      tokenPayload?.id;
        
        console.log('Extracted userId from token:', userId);
        
        const response = await fetch('https://localhost:7270/api/Auth/all-users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const users = await response.json();
          console.log('All users:', users);
          
          // Find current user by matching ID from token
          let currentUser = null;
          
          if (userId) {
            currentUser = users.find(u => 
              u.id === userId || 
              u.id === parseInt(userId) ||
              u.userId === userId ||
              u.userId === parseInt(userId)
            );
            console.log('Found user by ID:', currentUser);
          }
          
          // Fallback: try to match by email or username
          if (!currentUser) {
            currentUser = users.find(u => 
              u.email === authUser?.email || 
              u.email === tokenPayload?.email ||
              u.userName === authUser?.userName ||
              u.userName === authUser?.username ||
              u.userName === tokenPayload?.unique_name
            );
            console.log('Found user by email/username:', currentUser);
          }

          if (currentUser) {
            setUserDetails(currentUser);
          } else {
            console.warn('Could not find matching user, using auth context');
            setUserDetails(authUser);
          }
        } else {
          console.error('Failed to fetch users:', response.status);
          showError('Failed to load user details');
          setUserDetails(authUser);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        showError('Error loading user details');
        setUserDetails(authUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [isAuthenticated, token, navigate, authUser]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="text-4xl text-blue-500 animate-spin" />
          <div className="text-white text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  const user = userDetails || authUser;

  return (
    <>
      <SEO 
        title="My Profile - GameHatch | User Account"
        description="View and manage your GameHatch profile, account details, and gaming preferences."
        keywords="profile, user account, gaming profile"
      />
      <div className="min-h-screen flex flex-col bg-gray-900">
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <Breadcrumbs />
            
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <FaUser className="text-4xl text-blue-500" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  My Profile
                </h1>
              </div>
              <p className="text-gray-400 text-lg">
                Manage your account information and preferences
              </p>
            </motion.div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <FaUser className="text-6xl text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {user?.username || user?.userName || user?.name || 'User'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {user?.email || 'No email provided'}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-3 border-t border-gray-700 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center space-x-2">
                        <FaGamepad className="text-sm" />
                        <span>Member Since</span>
                      </span>
                      <span className="text-white font-medium">
                        {formatDate(user?.createdAt || user?.CreatedAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center space-x-2">
                        <FaShieldAlt className="text-sm" />
                        <span>Account Status</span>
                      </span>
                      <span className="text-green-400 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Account Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Account Details</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaEdit />
                      <span>Edit Profile</span>
                    </motion.button>
                  </div>

                  <div className="space-y-6">
                    {/* Username */}
                    <div className="border-b border-gray-700 pb-4">
                      <label className="text-gray-400 text-sm mb-2 flex items-center space-x-2">
                        <FaUser />
                        <span>Username</span>
                      </label>
                      <p className="text-white text-lg font-medium">
                        {user?.username || user?.userName || user?.name || 'Not provided'}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="border-b border-gray-700 pb-4">
                      <label className="text-gray-400 text-sm mb-2 flex items-center space-x-2">
                        <FaEnvelope />
                        <span>Email Address</span>
                      </label>
                      <p className="text-white text-lg font-medium">
                        {user?.email || 'Not provided'}
                      </p>
                    </div>

                    {/* User ID */}
                    <div className="border-b border-gray-700 pb-4">
                      <label className="text-gray-400 text-sm mb-2 flex items-center space-x-2">
                        <FaShieldAlt />
                        <span>User ID</span>
                      </label>
                      <p className="text-white text-lg font-medium font-mono">
                        {user?.id || user?.userId || user?.Id || 'N/A'}
                      </p>
                    </div>

                    {/* Account Created */}
                    <div className="pb-4">
                      <label className="text-gray-400 text-sm mb-2 flex items-center space-x-2">
                        <FaCalendarAlt />
                        <span>Account Created</span>
                      </label>
                      <p className="text-white text-lg font-medium">
                        {formatDate(user?.createdAt || user?.CreatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-800 rounded-lg p-6 shadow-lg mt-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/wishlist')}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <FaGamepad className="text-xl text-red-500" />
                        <div>
                          <p className="font-medium">My Wishlist</p>
                          <p className="text-sm text-gray-400">View saved games</p>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/cart')}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <FaGamepad className="text-xl text-blue-500" />
                        <div>
                          <p className="font-medium">My Cart</p>
                          <p className="text-sm text-gray-400">View cart items</p>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
