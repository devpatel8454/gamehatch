import React, { useState, useEffect, useRef } from 'react';
import { useGames } from '../../Context/GamesContext';
import { FaSearch, FaFilter, FaTimes, FaStar, FaDollarSign } from 'react-icons/fa';
import { useAuth } from '../../Context/Authcontext';
import { motion, AnimatePresence } from 'framer-motion';
import SearchResults from './SearchResults';

const EnhancedSearch = () => {
  const { searchValue, setSearchValue } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const { games } = useGames();
  const [adminGames, setAdminGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    rating: 'all'
  });
  const searchRef = useRef(null);

  // Game categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'action', label: 'Action' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'rpg', label: 'RPG' },
    { value: 'strategy', label: 'Strategy' },
    { value: 'sports', label: 'Sports' },
    { value: 'racing', label: 'Racing' },
    { value: 'simulation', label: 'Simulation' },
    { value: 'puzzle', label: 'Puzzle' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-500', label: '$100 - $500' },
    { value: '500+', label: 'Over $500' }
  ];

  const ratings = [
    { value: 'all', label: 'All Ratings' },
    { value: '4+', label: '4+ Stars' },
    { value: '3+', label: '3+ Stars' },
    { value: '2+', label: '2+ Stars' },
    { value: '1+', label: '1+ Stars' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch admin games from API
  useEffect(() => {
    const fetchAdminGames = async () => {
      try {
        const response = await fetch('https://localhost:7270/api/Game/all');
        if (response.ok) {
          const data = await response.json();
          setAdminGames(data);
        }
      } catch (error) {
        console.error('Error fetching admin games:', error);
        setAdminGames([]);
      }
    };

    fetchAdminGames();
  }, []);

  // Combine static and admin games
  useEffect(() => {
    const combinedGames = [...(games || []), ...adminGames];
    setAllGames(combinedGames);
  }, [games, adminGames]);

  // Update global search value when local search changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchValue(localSearch);
    }, 300); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [localSearch, setSearchValue]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setShowResults(true);
    }
  };

  // Show results automatically when user starts typing
  useEffect(() => {
    if (localSearch && localSearch.trim()) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [localSearch]);

  // Debug logging
  useEffect(() => {
    console.log('Search Debug:', {
      localSearch,
      showResults,
      gamesCount: games?.length || 0,
      searchValue
    });
  }, [localSearch, showResults, games, searchValue]);

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      rating: 'all'
    });
    setLocalSearch('');
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== 'all').length +
           (localSearch ? 1 : 0);
  };

  return (
    <>
      <div className="relative" ref={searchRef}>
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search games by title, genre, platform..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full px-4 py-2 pl-10 pr-20 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-2 top-2 p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Search Filters"
            >
              <FaFilter className={`text-sm ${getActiveFiltersCount() > 0 ? 'text-blue-400' : 'text-gray-400'}`} />
              {getActiveFiltersCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>

            {/* Search Button */}
            <button
              type="submit"
              className="absolute right-10 top-2 p-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
              title="Search"
            >
              <FaSearch className="text-sm text-white" />
            </button>
          </div>
        </form>

        {/* Filter Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-white font-medium">Search Filters</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Search Input in Dropdown */}
              <div className="p-4 border-b border-gray-700">
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Filter Sections */}
              <div className="p-4 max-h-64 overflow-y-auto">
                {/* Category Filter */}
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <FaDollarSign className="inline mr-1" />
                    Price Range
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <FaStar className="inline mr-1" />
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {ratings.map(rating => (
                      <option key={rating.value} value={rating.value}>
                        {rating.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between p-4 border-t border-gray-700">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear All
                </button>
                <div className="text-xs text-gray-500">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results Modal */}
      <SearchResults
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        products={allGames}
      />
    </>
  );
};

export default EnhancedSearch;
