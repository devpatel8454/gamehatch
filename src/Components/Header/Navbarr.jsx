import React, { useState, useEffect } from "react";
import { FaGamepad, FaSearch, FaShoppingCart, FaUserAlt, FaSignInAlt, FaSignOutAlt, FaHeart, FaThLarge, FaBars, FaTimes, FaNewspaper } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Authcontext";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedSearch from "../Search/EnhancedSearch";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Tooltip from "../Tooltip/Tooltip";

function Navbarr() {
  const { token, logout, setSearchValue } = useAuth();
  const navigate = useNavigate();
  const { totalQuantity } = useSelector((state) => state.cart);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load wishlist count from localStorage
  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const savedWishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');
        setWishlistCount(savedWishlist.length);
      } catch (error) {
        console.error('Error loading wishlist count:', error);
        setWishlistCount(0);
      }
    };

    updateWishlistCount();
    window.addEventListener('storage', updateWishlistCount);
    window.addEventListener('wishlistUpdated', updateWishlistCount);

    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-[#0a0e27] via-[#0f172a] to-[#0a0e27] text-white shadow-[0_4px_30px_rgba(6,182,212,0.3)] sticky top-0 z-50 border-b-2 border-cyan-500/30">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo and Brand */}
          <NavLink to="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
            <div className="relative">
              <img
                src="/images/Gemini_Generated_Image_655v1w655v1w655v-removebg-preview.png"
                alt="GameHatch"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300 ring-2 ring-cyan-500/50"
              />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]"></div>
            </div>
            <span className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent font-orbitron tracking-wide">
              GameHatch
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <NavLink
              to="/news"
              className={({ isActive }) => `flex items-center space-x-2 hover:text-cyan-400 transition-all duration-300 relative group font-medium ${isActive ? 'text-cyan-400' : 'text-gray-300'}`}
            >
              <FaNewspaper className="text-lg" />
              <span>News</span>
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </NavLink>

            <NavLink
              to="/games"
              className={({ isActive }) => `flex items-center space-x-2 hover:text-cyan-400 transition-all duration-300 relative group font-medium ${isActive ? 'text-cyan-400' : 'text-gray-300'}`}
            >
              <FaGamepad className="text-lg" />
              <span>Games</span>
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </NavLink>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Search Icon - Desktop shows full search, Mobile shows icon */}
            <div className="hidden lg:block w-64">
              <EnhancedSearch />
            </div>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden text-gray-300 hover:text-cyan-400 transition-colors p-2"
              aria-label="Search"
            >
              <FaSearch className="text-lg sm:text-xl" />
            </button>

            {/* Cart */}
            <Tooltip content={`${totalQuantity} items`} position="bottom">
              <NavLink to="/cart" className="relative text-gray-300 hover:text-cyan-400 transition-colors p-2">
                <FaShoppingCart className="text-lg sm:text-xl" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </NavLink>
            </Tooltip>

            {/* Wishlist - Desktop Only */}
            {token && (
              <Tooltip content={`${wishlistCount} saved`} position="bottom">
                <NavLink to="/wishlist" className="hidden md:block relative text-gray-300 hover:text-cyan-400 transition-colors p-2">
                  <FaHeart className="text-lg sm:text-xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                      {wishlistCount}
                    </span>
                  )}
                </NavLink>
              </Tooltip>
            )}

            {/* Theme Toggle - Desktop Only */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* User Profile - Desktop */}
            {token ? (
              <div className="hidden lg:flex items-center space-x-2">
                <Tooltip content="Profile" position="bottom">
                  <NavLink to="/profile" className="text-gray-300 hover:text-cyan-400 transition-colors p-2">
                    <FaUserAlt className="text-lg" />
                  </NavLink>
                </Tooltip>
                <Tooltip content="Logout" position="bottom">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
                  >
                    <FaSignOutAlt className="text-lg" />
                  </button>
                </Tooltip>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] font-medium"
              >
                <FaSignInAlt />
                <span>Login</span>
              </NavLink>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-cyan-400 transition-colors p-2 relative z-50"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden pb-3 overflow-hidden"
            >
              <EnhancedSearch />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 sm:w-80 bg-gradient-to-b from-[#0a0e27] to-[#0f172a] border-l-2 border-cyan-500/30 shadow-[-10px_0_50px_rgba(6,182,212,0.4)] z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6 pt-20">
                <div className="flex flex-col space-y-4">

                  {/* Navigation Links */}
                  <NavLink
                    to="/news"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `flex items-center space-x-3 text-base font-medium hover:text-cyan-400 transition-colors py-3 px-4 rounded-lg hover:bg-cyan-500/10 ${isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-300'}`}
                  >
                    <FaNewspaper className="text-xl" />
                    <span>News</span>
                  </NavLink>

                  <NavLink
                    to="/games"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `flex items-center space-x-3 text-base font-medium hover:text-cyan-400 transition-colors py-3 px-4 rounded-lg hover:bg-cyan-500/10 ${isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-300'}`}
                  >
                    <FaGamepad className="text-xl" />
                    <span>Games</span>
                  </NavLink>

                  <div className="border-t border-gray-700 my-2"></div>

                  <NavLink
                    to="/cart"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between text-base font-medium hover:text-cyan-400 transition-colors py-3 px-4 rounded-lg hover:bg-cyan-500/10 text-gray-300"
                  >
                    <div className="flex items-center space-x-3">
                      <FaShoppingCart className="text-xl" />
                      <span>Cart</span>
                    </div>
                    {totalQuantity > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                        {totalQuantity}
                      </span>
                    )}
                  </NavLink>

                  {token && (
                    <NavLink
                      to="/wishlist"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between text-base font-medium hover:text-cyan-400 transition-colors py-3 px-4 rounded-lg hover:bg-cyan-500/10 text-gray-300"
                    >
                      <div className="flex items-center space-x-3">
                        <FaHeart className="text-xl" />
                        <span>Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                          {wishlistCount}
                        </span>
                      )}
                    </NavLink>
                  )}

                  {token && (
                    <NavLink
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 text-base font-medium hover:text-cyan-400 transition-colors py-3 px-4 rounded-lg hover:bg-cyan-500/10 text-gray-300"
                    >
                      <FaUserAlt className="text-xl" />
                      <span>Profile</span>
                    </NavLink>
                  )}

                  <div className="border-t border-gray-700 my-2"></div>

                  {/* Theme Toggle Mobile */}
                  <div className="flex items-center justify-between py-3 px-4">
                    <span className="text-base font-medium text-gray-300">Theme</span>
                    <ThemeToggle />
                  </div>

                  <div className="border-t border-gray-700 my-2"></div>

                  {/* Auth Button */}
                  {token ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-base font-medium text-red-400 hover:text-red-300 transition-colors py-3 px-4 rounded-lg hover:bg-red-500/10"
                    >
                      <FaSignOutAlt className="text-xl" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <NavLink
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] font-medium"
                    >
                      <FaSignInAlt />
                      <span>Login</span>
                    </NavLink>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbarr;
