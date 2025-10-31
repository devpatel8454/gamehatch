import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with actual admin login API call
      const response = await fetch('https://localhost:7270/api/Auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Try to parse as JSON
        const data = await response.json();
        
        // Store admin token and data
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        // Read response as text first
        const responseText = await response.text();
        console.error('Admin login failed:', responseText);
        
        // Try to parse as JSON, otherwise use text
        let errorMessage = 'Invalid admin credentials';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If not JSON, use the text directly (but make it user-friendly)
          errorMessage = responseText.includes('BCrypt') 
            ? 'Invalid username or password' 
            : responseText || errorMessage;
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-red-500/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-900 to-orange-900 p-8 text-center">
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            >
              <div className="bg-red-600 p-4 rounded-full">
                <FaUserShield className="text-3xl text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-300 text-sm">Authorized Access Only</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="admin_username"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                <FaLock />
                {isLoading ? 'Authenticating...' : 'Admin Login'}
              </button>
            </form>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            🔒 This area is restricted to authorized administrators only
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
