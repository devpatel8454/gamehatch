import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useAuth } from '../../Context/Authcontext';
import GameCard from '../GameCard/GameCard';

const SearchResults = ({ isOpen, onClose, products }) => {
  const { searchValue, setSearchValue } = useAuth();
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Filter products based on search value and applied filters
  useEffect(() => {
    if (!products) return;

    let filtered = [...products];

    // Text search filter
    if (searchValue && searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(game =>
        game.title?.toLowerCase().includes(searchLower) ||
        game.genre?.toLowerCase().includes(searchLower) ||
        game.platforms?.some(platform => platform.toLowerCase().includes(searchLower)) ||
        game.description?.toLowerCase().includes(searchLower) ||
        game.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        game.developer?.toLowerCase().includes(searchLower) ||
        game.publisher?.toLowerCase().includes(searchLower)
      );
    }

    // Apply advanced filters if needed
    // Note: For now, we're focusing on text search. Category/price filters would need to be implemented
    // based on the actual game data structure and filter props passed from parent component

    setFilteredProducts(filtered);
  }, [products, searchValue, sortBy]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 pb-8 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <FaSearch className="text-blue-400 text-xl" />
            <div>
              <h2 className="text-xl font-bold text-white">
                Search Results
              </h2>
              <p className="text-gray-400 text-sm">
                {filteredProducts.length} game{filteredProducts.length !== 1 ? 's' : ''} found
                {searchValue && ` for "${searchValue}"`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-700 rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                List
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <FaSearch className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No games found</h3>
              <p className="text-gray-400">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GameCard game={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-900">
          <p className="text-gray-400 text-sm">
            Showing {filteredProducts.length} of {products?.length || 0} games
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchResults;
