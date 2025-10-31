import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaNewspaper,
  FaSpinner,
  FaExclamationTriangle,
  FaFire,
  FaTrophy,
  FaGamepad
} from 'react-icons/fa';
import NewsCard from '../Components/NewsCard/NewsCard';
import SEO from '../Components/SEO/SEO';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import GameCardSkeleton from '../Components/Skeleton/GameCardSkeleton';
import { showError, showSuccess } from '../utils/toast';
import Footer from '../Components/Footer/Footer';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  // News categories
  const categories = [
    { id: 'all', name: 'All News', query: 'gaming' },
    { id: 'trending', name: 'Trending', query: 'gaming' },
    { id: 'esports', name: 'Esports', query: 'esports' },
    { id: 'releases', name: 'New Releases', query: 'game releases' },
    { id: 'reviews', name: 'Reviews', query: 'game reviews' },
    { id: 'industry', name: 'Industry', query: 'gaming industry' }
  ];

  const CUSTOM_NEWS_API_URL = 'https://localhost:7270/api/News/gaming';

  // Fetch news from API
  const fetchNews = async (category = 'gaming') => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔍 Fetching news for category: "${category}"`);

      const response = await fetch(CUSTOM_NEWS_API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      console.log(`📊 API response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        let articles = [];

        if (Array.isArray(data)) {
          articles = data;
        } else if (data.articles) {
          articles = data.articles;
        } else if (data.news) {
          articles = data.news;
        } else {
          console.warn('⚠️ Unexpected API response format');
        }

        const formatted = articles.map((article, index) => ({
          id: index + 1,
          title: article.title || `News ${index + 1}`,
          description: article.description || article.content || 'No description available',
          imageUrl:
            article.imageUrl ||
            article.image ||
            article.urlToImage ||
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop',
          publishedAt: article.publishedAt || new Date().toISOString()
        }));

        setNews(formatted);
      } else {
        console.warn(`⚠️ API returned ${response.status}`);
        throw new Error(`API error: ${response.status}`);
      }
    } catch (err) {
      console.error('🚨 API error:', err);
      setError('Unable to load news from server.');
      showError('Failed to load latest news. Showing sample data.');
      setNews(getMockNewsByCategory(category));
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  // Mock data fallback
  const getMockNewsByCategory = (category) => {
    const mockNews = {
      gaming: [
        {
          id: 1,
          title: 'Cyberpunk 2077 Phantom Liberty Expansion Launches',
          description:
            'The highly anticipated expansion brings new storylines, characters, and gameplay mechanics to Night City.',
          imageUrl:
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop',
          publishedAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Gaming Industry Reaches Record Revenue',
          description:
            'Global gaming market hits new highs with strong performance in mobile and PC segments.',
          imageUrl:
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop',
          publishedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      esports: [
        {
          id: 3,
          title: 'ESL Pro League Season 18 Announced',
          description:
            'Top Counter-Strike teams will compete for a $1M prize pool in the upcoming tournament.',
          imageUrl:
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop',
          publishedAt: new Date().toISOString()
        }
      ]
    };

    return mockNews[category] || mockNews.gaming;
  };

  // Initial load
  useEffect(() => {
    fetchNews('gaming');
  }, []);

  // Handle category change
  useEffect(() => {
    if (selectedCategory !== 'all') {
      setNews(getMockNewsByCategory(selectedCategory));
    }
    const category = categories.find((cat) => cat.id === selectedCategory);
    fetchNews(category?.query || 'gaming');
  }, [selectedCategory]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const category = categories.find((cat) => cat.id === selectedCategory);
      fetchNews(category?.query || 'gaming');
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <SEO 
        title="Gaming News - GameHatch | Latest Gaming Updates"
        description="Stay updated with the latest gaming news, esports tournaments, game releases, and industry updates. Your source for gaming news."
        keywords="gaming news, esports, game releases, gaming industry, game reviews"
      />
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
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
                <FaNewspaper className="text-4xl text-red-500" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Gaming News
                </h1>
              </div>
              <p className="text-gray-400 text-lg">
                Stay updated with the latest gaming news, tournaments, and releases.
              </p>
              {lastUpdated && (
                <div className="flex items-center space-x-2 mt-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-500 text-sm">
                    Last updated: {new Date(lastUpdated).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Category Buttons */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                  const icons = {
                    all: FaNewspaper,
                    trending: FaFire,
                    esports: FaTrophy,
                    releases: FaGamepad,
                    reviews: FaNewspaper,
                    industry: FaNewspaper
                  };
                  const Icon = icons[category.id] || FaNewspaper;
                  
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="text-sm" />
                      <span>{category.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* News List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <GameCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-gray-800 rounded-lg"
              >
                <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Unable to Load News</h3>
                <p className="text-gray-400 mb-6 text-center max-w-md">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchNews(selectedCategory)}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : news.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="bg-gray-800 rounded-full p-8 inline-block mb-6">
                  <FaNewspaper className="text-6xl text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No News Available</h3>
                <p className="text-gray-400 text-lg">Check back later for the latest gaming news</p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {news.map((article) => (
                  <motion.div key={article.id} variants={itemVariants}>
                    <NewsCard
                      news={{
                        id: article.id,
                        title: article.title,
                        excerpt: article.description,
                        image: article.imageUrl,
                        date: article.publishedAt,
                        category:
                          selectedCategory === 'all'
                            ? 'Gaming'
                            : categories.find((c) => c.id === selectedCategory)?.name
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default NewsPage;
