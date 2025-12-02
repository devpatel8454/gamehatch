import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../Context/Authcontext';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash, FaGamepad } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Footer from '../Components/Footer/Footer';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username or email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
    }),
    onSubmit: async (values, { setFieldError }) => {
      setIsLoading(true);
      try {
        console.log('Attempting to login with:', values);
        console.log('Sending login request...');
        const response = await login({
          endpoint: 'localhost:7270/api/Auth/login',
          payload: {
            username: values.username,
            password: values.password
          },
          onSuccess: () => {
            console.log('Login successful!');
            navigate('/home');
          }
        });

        console.log('Login response:', response);

        if (!response) {
          throw new Error('No response received from server');
        }

        if (response.error) {
          const errorMessage = response.error.message || 'Invalid credentials';
          setFieldError('password', errorMessage);
          return;
        }

        // Success is handled by onSuccess callback
        console.log('Login successful! Redirecting...');
      } catch (error) {
        console.error('Login error details:', error);
        const errorMessage = error?.message || 'Login failed. Please try again.';
        setFieldError('password', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <main className="flex-grow flex items-center p-0 bg-gray-900">
        {/* Left Side - Gaming Entrance Image */}
        <div className="hidden md:flex flex-1 h-full min-h-[600px] bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80)'
          }}>
          <div className="w-full h-full bg-gradient-to-r from-black/90 via-black/70 to-transparent flex items-center pl-16">
            <div className="max-w-md">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl font-bold text-white mb-4 leading-tight"
              >
                Enter the <span className="text-blue-400">Game World</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-300 text-lg mb-6"
              >
                Your next adventure awaits
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center space-x-4"
              >
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm font-mono">Connected to GameHub Servers</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md bg-gray-900 p-8 h-screen overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-8 text-center border-b border-gray-800">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                className="flex justify-center mb-4"
              >
                <div className="bg-blue-600 p-3 rounded-full transform transition-transform duration-300 hover:scale-110">
                  <FaGamepad className="text-2xl text-white" />
                </div>
              </motion.div>
              <motion.h1
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-1"
              >
                Welcome Back
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-sm"
              >
                Sign in to your account
              </motion.p>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        className={`w-full px-4 py-2 bg-gray-800 border ${formik.touched.username && formik.errors.username
                            ? 'border-red-500'
                            : 'border-gray-700'
                          } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter your username"
                      />
                      {formik.touched.username && formik.errors.username && (
                        <p className="mt-1 text-sm text-red-500">{formik.errors.username}</p>
                      )}
                    </div>
                    <div className="text-right mt-1">
                      <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className={`w-full px-4 py-3 bg-gray-700 border ${formik.touched.password && formik.errors.password
                          ? 'border-red-500'
                          : 'border-gray-600 hover:border-gray-500'
                        } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all pr-12`}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-xs text-red-400">{formik.errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              </form>

              <motion.div
                className="mt-6 p-5 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30 rounded-xl backdrop-blur-sm shadow-lg"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-sm font-semibold text-blue-300 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clipRule="evenodd" />
                  </svg>
                  Demo Account
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="text-blue-200 w-20">Username:</span>
                    <code className="text-white font-mono bg-blue-900/50 px-3 py-1.5 rounded-lg text-sm flex-1">
                      mor_2314
                    </code>
                    <button
                      onClick={() => {
                        formik.setFieldValue('username', 'mor_2314');
                        formik.setFieldValue('password', '83r5^_');
                      }}
                      className="ml-3 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-all flex items-center"
                    >
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Auto-fill
                    </button>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-blue-200 w-20">Password:</span>
                    <code className="text-white font-mono bg-blue-900/50 px-3 py-1.5 rounded-lg text-sm flex-1">
                      83r5^_
                    </code>
                  </div>
                </div>
              </motion.div>

              <div className="mt-6 text-center px-6">
                <p className="text-sm text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full bg-gray-900 border-t border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-1">
              <FaGamepad className="text-blue-500" />
              <span className="text-white font-semibold">GameHub</span>
            </div>
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} GameHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <Footer />
    </div>
  );
};

export default LoginPage;
