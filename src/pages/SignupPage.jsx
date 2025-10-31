import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash, FaGamepad } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../Context/Authcontext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../Components/Footer/Footer';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password')
    }),
    onSubmit: async (values, { resetForm, setFieldError }) => {
      setIsLoading(true);
      try {
        console.log('Attempting to signup with:', values);
        
        let signupSuccess = false;
        
        const response = await signup({
          endpoint: 'localhost:7270/api/Auth/signup',
          payload: {
            username: values.username,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword
          },
          onSuccess: () => {
            console.log('Signup successful! onSuccess callback triggered');
            // Navigate to login page after successful signup
            navigate('/login');
          }
        });
        
        console.log('SignupPage - Full response object:', JSON.stringify(response, null, 2));
        console.log('SignupPage - response.error:', response?.error);
        console.log('SignupPage - response.data:', response?.data);

        // Check for errors
        if (response?.error) {
          console.error('SignupPage - Error detected in response');
          const errorMessage = response.error.message || 'Signup failed. Please try again.';
          throw new Error(errorMessage);
        }

        // If we get here, signup was successful
        console.log('SignupPage - Signup completed successfully!');
        resetForm();

        // Ensure navigation to login page after successful signup
        setTimeout(() => {
          navigate('/login');
        }, 100);
        
      } catch (error) {
        console.error('SignupPage - Caught error:', error);
        const errorMessage = error?.message || 'Signup failed. Please try again.';
        setFieldError('confirmPassword', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <main className="flex-grow flex items-center p-0 bg-gray-900">
        {/* Left Side - Gaming Image */}
        <div className="hidden md:flex flex-1 h-full min-h-[600px] bg-cover bg-center" 
             style={{ 
               backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)' 
             }}>
          <div className="w-full h-full bg-gradient-to-r from-black/80 to-transparent flex items-center pl-16">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold text-white mb-4">Join the Ultimate Gaming Experience</h2>
              <p className="text-gray-300 text-lg">Connect with gamers worldwide and discover amazing games</p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Signup Form */}
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
                Create Your Account
              </motion.h1>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-sm"
              >
                Join our gaming community today
              </motion.p>
            </div>

            {/* Form */}
            <div className="p-6 bg-gray-800">
              <form onSubmit={formik.handleSubmit} className="space-y-6 p-8">
                {/* Username Input */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      className={`w-full px-4 py-3 bg-gray-700 border ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      placeholder="johndoe"
                    />
                  </div>
                  {formik.touched.username && formik.errors.username ? (
                    <p className="mt-1 text-sm text-red-400">{formik.errors.username}</p>
                  ) : null}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 bg-gray-700 border ${
                      formik.touched.email && formik.errors.email
                        ? 'border-red-500'
                        : 'border-gray-600 hover:border-gray-500'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter your email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-xs text-red-400">{formik.errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className={`w-full px-4 py-3 bg-gray-700 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12`}
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
                  {formik.touched.password && formik.errors.password ? (
                    <p className="mt-1 text-sm text-red-400">{formik.errors.password}</p>
                  ) : null}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      className={`w-full px-4 py-3 bg-gray-700 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                    <p className="mt-1 text-sm text-red-400">{formik.errors.confirmPassword}</p>
                  ) : null}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-colors ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full flex items-center justify-center py-2.5 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <FcGoogle className="text-lg mr-2" />
                  <span>Google</span>
                </button>

                <p className="text-center text-sm text-gray-400 mt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign in
                  </Link>
                </p>

              </form>
            </div>
          </motion.div>
        </div>
      </main>
      
      <footer className="w-full bg-gray-900 border-t border-gray-800 py-4 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-1">
              <FaGamepad className="text-blue-500" />
              <span className="text-white font-semibold">GameHub</span>
            </div>
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} GameHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <Footer />
    </div>
  );
};

export default SignupPage;
