import React, { useState, useEffect } from "react";
import { FaGamepad, FaSearch, FaShoppingCart, FaUserAlt, FaSignInAlt, FaSignOutAlt, FaHeart, FaThLarge } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Authcontext";
import { useSelector } from "react-redux";
import EnhancedSearch from "../Search/EnhancedSearch";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Tooltip from "../Tooltip/Tooltip";

function Navbarr() {
  const { token, logout, setSearchValue } = useAuth();
  const navigate = useNavigate();
  const { totalQuantity } = useSelector((state) => state.cart);
  const [wishlistCount, setWishlistCount] = useState(0);

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

    // Initial load
    updateWishlistCount();

    // Listen for storage changes (when wishlist is updated in other tabs/components)
    window.addEventListener('storage', updateWishlistCount);
    
    // Custom event for same-tab updates
    window.addEventListener('wishlistUpdated', updateWishlistCount);

    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0 relative">
          <NavLink to="/">
            <img
              src="/images/Gemini_Generated_Image_655v1w655v1w655v-removebg-preview.png"
              alt="GameHatch Logo"
              className="w-10 h-10 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
            />
          </NavLink>
          <NavLink to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            GameHatch
          </NavLink>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <EnhancedSearch />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Dynamic Game Navigation - Temporarily commented out */}
          {/* <DynamicGameNavigation /> */}

          {/* <NavLink
            to="/genres"
            className={({ isActive }) => `hover:text-blue-400 transition-colors ${isActive ? 'text-blue-400' : ''}`}
          >
            Genres
          </NavLink> */}

          {/* <NavLink
            to="/platforms"
            className={({ isActive }) => `hover:text-blue-400 transition-colors hidden md:block ${isActive ? 'text-blue-400' : ''}`}
          >
            Platforms
          </NavLink> */}

          {/* <NavLink
            to="/deals"
            className={({ isActive }) => `hover:text-blue-400 transition-colors hidden md:block ${isActive ? 'text-blue-400' : ''}`}
          >
            Deals
          </NavLink> */}

          <NavLink
            to="/news"
            className={({ isActive }) => `hover:text-blue-400 transition-colors hidden md:block ${isActive ? 'text-blue-400' : ''}`}
          >
            News
          </NavLink>

          <NavLink
            to="/games"
            className={({ isActive }) => `hover:text-blue-400 transition-colors ${isActive ? 'text-blue-400' : ''}`}
          >
            {/* <FaThLarge className="text-xl" /> */}
            Games
          </NavLink>

          {/* Cart */}
          <Tooltip content={`${totalQuantity} items in cart`} position="bottom">
            <div className="relative">
              <NavLink to="/cart" className="text-white hover:text-blue-400 transition-colors">
                <FaShoppingCart className="text-xl" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </NavLink>
            </div>
          </Tooltip>

          {/* Wishlist - Only show for logged-in users */}
          {token && (
            <Tooltip content={`${wishlistCount} items in wishlist`} position="bottom">
              <div className="relative">
                <NavLink to="/wishlist" className="text-white hover:text-blue-400 transition-colors">
                  <FaHeart className="text-xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </NavLink>
              </div>
            </Tooltip>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Auth */}
          {token ? (
            <div className="flex items-center space-x-2">
              <Tooltip content="My Profile" position="bottom">
                <NavLink to="/profile" className="text-white hover:text-blue-400 transition-colors">
                  <FaUserAlt className="text-xl" />
                </NavLink>
              </Tooltip>
              <Tooltip content="Logout" position="bottom">
                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors"
                  aria-label="Logout"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </Tooltip>
            </div>
          ) : (
            <NavLink 
              to="/login" 
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FaSignInAlt />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbarr;
