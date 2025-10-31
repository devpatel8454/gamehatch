import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaDiscord, FaGamepad } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-8 py-12 mt-20 relative z-10 border-t border-gray-700">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* GameHatch Brand */}
        <div>
          <div className="flex items-center space-x-2 mb-4 relative">
            <img
              src="/images/Gemini_Generated_Image_655v1w655v1w655v-removebg-preview.png"
              alt="GameHatch Logo"
              className="w-10 h-10 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
            />
            
            <h3 className="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              GameHatch
            </h3>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <p className="mb-4 text-sm text-gray-300">
            Your ultimate gaming destination. Discover, play, and conquer the digital realm.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
              <FaYoutube />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
              <FaDiscord />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/games" className="text-gray-300 hover:text-white transition-colors">
                All Games
              </Link>
            </li>
            <li>
              <Link to="/categories" className="text-gray-300 hover:text-white transition-colors">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="text-gray-300 hover:text-white transition-colors">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/deals" className="text-gray-300 hover:text-white transition-colors">
                Deals
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold text-lg mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
          <p className="mb-4 text-sm text-gray-300">
            Subscribe to get notified about new games and exclusive deals.
          </p>
          <div className="flex items-center bg-gray-800 rounded-md overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent px-3 py-2 text-white flex-1 focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-400 mb-4 md:mb-0">
          © 2024 GameHatch. All rights reserved.
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>🎮 Level up your gaming experience</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
