import { useState, useEffect, useMemo, useCallback } from 'react';
import { FaHeart, FaShoppingCart, FaStar, FaComment, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../Context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/Slice/Cart/cartSlice';
import { showSuccess, showError, showInfo } from '../utils/toast';
import GameCardSkeleton from '../Components/Skeleton/GameCardSkeleton';
import LazyImage from '../Components/LazyImage/LazyImage';
import SEO from '../Components/SEO/SEO';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Footer from '../Components/Footer/Footer';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [authError, setAuthError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Safely get token and user from AuthContext with error handling
  let token, user;
  try {
    const authContext = useAuth();
    token = authContext?.token || null;
    user = authContext?.user || null;
  } catch (error) {
    console.error('AuthContext error:', error);
    setAuthError(true);
    token = null;
    user = null;
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchGames();
    // Load wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');
    setWishlist(savedWishlist);
  }, []); // Remove token dependency to prevent issues

  const fetchGames = async () => {
    try {
      console.log('🔍 Fetching games from API...');
      setLoading(true);

      // Immediately set sample games as fallback
      setGames(getSampleGames());

      // Try to fetch from backend (but don't fail if it doesn't work)
      try {
        const response = await fetch('https://localhost:7270/api/Game/all', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        console.log('📡 Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Games loaded:', data.length || data?.data?.length || 0, 'games');

          // Handle different response structures
          const gamesData = data?.data || data || [];
          if (gamesData.length > 0) {
            setGames(gamesData);
          }
        } else {
          console.warn('⚠️ Backend API not available, using sample data');
          // Sample games already set above
        }
      } catch (fetchError) {
        console.error('🚨 API fetch failed:', fetchError.message);
        console.log('💡 Using sample games for demo');
        // Sample games already set above as fallback
      }
    } catch (error) {
      console.error('🚨 Unexpected error in fetchGames:', error.message);
      // Ensure sample games are set even on unexpected errors
      setGames(getSampleGames());
    } finally {
      setLoading(false);
    }
  };

  // Sample games for testing when API is not available
  const getSampleGames = () => {
    return [
      {
        id: 1,
        title: "Cyberpunk 2077",
        category: "RPG",
        price: 59.99,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 2,
        title: "The Witcher 3",
        category: "RPG",
        price: 39.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 3,
        title: "Grand Theft Auto V",
        category: "Action",
        price: 29.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 4,
        title: "Call of Duty: Modern Warfare",
        category: "Action",
        price: 49.99,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 5,
        title: "The Legend of Zelda",
        category: "Adventure",
        price: 59.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 6,
        title: "Minecraft",
        category: "Adventure",
        price: 26.95,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 7,
        title: "FIFA 24",
        category: "Sports",
        price: 69.99,
        rating: 4.1,
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 8,
        title: "Need for Speed",
        category: "Racing",
        price: 39.99,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=300&fit=crop&crop=center"
      }
    ];
  };

  // Helper: decode JWT payload safely (no secret needed)
  const decodeJwtPayload = (jwt) => {
    try {
      const base64Url = jwt.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.warn('Failed to decode JWT payload:', e);
      return null;
    }
  };

  // Helper: extract likely user identifiers from token claims
  const getUserInfoFromToken = (jwt) => {
    const payload = decodeJwtPayload(jwt) || {};
    const userId = payload.sub || payload.nameid || payload.userId || payload.UserId || payload.uid || payload.Id || payload.id;
    const username = payload.unique_name || payload.preferred_username || payload.username || payload.name || payload.given_name || null;
    const email = payload.email || payload.Email || null;
    return { userId, username, email, payload };
  };

  const addToWishlist = async (game) => {
    console.log('=== CURRENT LOGGED-IN USER ===');
    console.log('User object:', user);
    console.log('Token present:', !!token);
    console.log('User username:', user?.username);
    console.log('User email:', user?.email);
    console.log('==============================');

    try {
      // Prefer extracting the user from the JWT token claims
      const { userId: tokenUserId, username: tokenUsername, email: tokenEmail, payload } = getUserInfoFromToken(token);
      console.log('JWT payload:', payload);
      let resolvedUserId = tokenUserId;

      // Determine identifiers to match if we need to fall back
      const candidateUsername = (user?.username || user?.Username || tokenUsername || '').toLowerCase();
      const candidateEmail = (user?.email || user?.Email || tokenEmail || '').toLowerCase();

      // If no userId in token, fall back to fetching all users and matching by username/email
      if (!resolvedUserId) {
        console.log('UserId not present in token. Fetching users to resolve by username/email...');
        const usersResponse = await fetch('https://localhost:7270/api/Auth/all-users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const allUsers = await usersResponse.json();
        console.log('All users from API:', allUsers);
        console.log('Stored user object:', user);
        console.log('Match username:', candidateUsername);
        console.log('Match email:', candidateEmail);

        const currentUser = allUsers.find(u => {
          const uName = (u.username || u.Username || '').toLowerCase();
          const uEmail = (u.email || u.Email || '').toLowerCase();
          const match = (!!candidateUsername && uName === candidateUsername) || (!!candidateEmail && uEmail === candidateEmail);
          if (match) console.log('Matched user record:', u);
          return match;
        });

        if (!currentUser) {
          showError('Could not find your user ID. Please login again.');
          return;
        }
        resolvedUserId = currentUser.id || currentUser.Id || currentUser.userId || currentUser.UserId;
      }

      const userId = resolvedUserId;
      const gameId = game.id || game.gameId || game.GameId || game.ID;

      console.log('Resolved UserId:', userId);
      console.log('Resolved GameId:', gameId);

      if (!userId) {
        showError('User ID not found. Please login again.');
        return;
      }

      if (!gameId) {
        showError('Game ID not found.');
        return;
      }

      // Check if the game already exists in wishlist
      const existingIndex = wishlist.findIndex(item => item.id === gameId);
      if (existingIndex !== -1) {
        showInfo('Game is already in your wishlist');
        return;
      }

      // Create wishlist entry with required fields (userId, gameId, addedAt)
      const wishlistItem = {
        userId: userId,
        gameId: gameId,
        addedAt: new Date().toISOString()
      };

      console.log('📤 Sending to API:', wishlistItem);

      // Call your backend API
      const response = await fetch("https://localhost:7270/api/UserGame/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(wishlistItem)
      });

      const responseText = await response.text();
      console.log('API Response Status:', response.status);
      console.log('API Response Text:', responseText);
      console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        // Update frontend wishlist
        const newWishlist = [...wishlist, game];
        setWishlist(newWishlist);
        localStorage.setItem("userWishlist", JSON.stringify(newWishlist));

        // Dispatch custom event to update navbar count
        window.dispatchEvent(new Event('wishlistUpdated'));

        showSuccess("Added to wishlist!");
      } else {
        const errorMsg = responseText || `HTTP ${response.status}: ${response.statusText}`;
        console.error("Error adding to wishlist:", errorMsg);
        console.error("Response status:", response.status);
        console.error("Response statusText:", response.statusText);
        showError(`Failed to add game to wishlist. ${errorMsg.substring(0, 100)}`);
      }
    } catch (error) {
      console.error("Error:", error);
      showError(`Something went wrong: ${error.message}`);
    }
  };


  // Memoize getImageUrl to avoid recalculating on every render
  const getImageUrl = useCallback((imageUrl) => {
    if (!imageUrl) {
      return "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center";
    }

    // If it's already a full URL
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If backend sends path like "/uploads/filename.jpg"
    if (imageUrl.startsWith('/uploads/')) {
      const filename = imageUrl.substring('/uploads/'.length);
      const encodedFilename = encodeURIComponent(filename);
      return `https://localhost:7270/uploads/${encodedFilename}`;
    }

    // If it's just a filename
    const encodedFilename = encodeURIComponent(imageUrl.trim());
    return `https://localhost:7270/uploads/${encodedFilename}`;
  }, []);

  // Memoize wishlist check
  const isInWishlist = useCallback((gameId) => {
    return wishlist.some(item => item.id === gameId);
  }, [wishlist]);

  // Extract unique categories from games
  const categories = useMemo(() => {
    const uniqueCategories = ['All', ...new Set(games.map(game => game.category || 'Uncategorized'))];
    return uniqueCategories;
  }, [games]);

  // Filter games based on selected category
  const filteredGames = useMemo(() => {
    if (selectedCategory === 'All') {
      return games;
    }
    return games.filter(game => game.category === selectedCategory);
  }, [games, selectedCategory]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleAddToCart = useCallback((game) => {
    const cartItem = {
      id: game.id,
      name: game.title || game.name || 'Unknown Game',
      price: game.price || 0,
      image: getImageUrl(game.imageUrl),
      category: game.category || 'Action'
    };
    dispatch(addToCart(cartItem));
    showSuccess('Added to cart!');
  }, [dispatch, getImageUrl]);

  const handleAddReview = useCallback((game) => {
    if (!token) {
      showInfo('Please login to add a review');
      return;
    }
    // Navigate to the reviews page with game information
    navigate('/reviews', {
      state: {
        gameName: game.title || game.name || 'Unknown Game',
        gameId: game.id
      }
    });
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900">
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="h-10 bg-gray-800 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-800 rounded w-96 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <GameCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Ensure we always render the main content even if there are errors
  return (
    <>
      <SEO
        title="All Games - GameHatch | Browse Our Gaming Collection"
        description="Explore our extensive collection of games across all genres. Find action, RPG, adventure, and more. Download and play the best games today!"
        keywords="games, browse games, download games, pc games, action games, rpg games, adventure games"
      />
      <div className="min-h-screen flex flex-col bg-gray-900">
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">All Games</h1>
              <p className="text-gray-400 text-lg">Discover amazing games from our collection</p>
              {authError && (
                <p className="text-yellow-400 text-sm mt-2">⚠️ Authentication context unavailable - some features may not work properly</p>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 text-cyan-400">
                  <FaFilter className="text-lg" />
                  <span className="font-semibold">Filter by Category:</span>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 max-w-xs bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer hover:bg-gray-600"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category} {category === 'All' ? `(${games.length})` : `(${games.filter(g => g.category === category).length})`}
                    </option>
                  ))}
                </select>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </motion.div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id || index}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Game Image */}
                  <div className="relative">
                    <LazyImage
                      src={getImageUrl(game.imageUrl)}
                      alt={game.title || 'Game'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => addToWishlist(game)}
                        className={`p-2 rounded-full transition-all ${isInWishlist(game.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-900/70 text-white hover:bg-red-500'
                          }`}
                        title={isInWishlist(game.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        aria-label={isInWishlist(game.id) ? `Remove ${game.title || 'game'} from wishlist` : `Add ${game.title || 'game'} to wishlist`}
                        aria-pressed={isInWishlist(game.id)}
                      >
                        <FaHeart className={isInWishlist(game.id) ? 'text-white' : 'text-gray-300'} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Game Details */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                      {game.title || 'Untitled Game'}
                    </h3>

                    <p className="text-gray-400 text-sm mb-2">
                      {game.category || 'Action'}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2" role="img" aria-label="Rating">
                        <FaStar className="text-yellow-400" aria-hidden="true" />
                        <span className="text-gray-300 text-sm">{game.rating || 4.5}</span>
                      </div>
                      <span className="text-green-400 font-semibold" aria-label="Price">
                        ₹{(game.price || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(game)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-2 px-3 rounded-md font-medium transition-all flex items-center justify-center space-x-1"
                        aria-label={`Add ${game.title || 'game'} to cart`}
                      >
                        <FaShoppingCart className="text-sm" aria-hidden="true" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => handleAddReview(game)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-3 rounded-md font-medium transition-all flex items-center justify-center space-x-1"
                        aria-label={`Add review for ${game.title || 'game'}`}
                      >
                        <FaComment className="text-sm" aria-hidden="true" />
                        <span>Add Review</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Games Found or Error State */}
            {games.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-red-400 text-lg mb-4">Unable to load games</div>
                <p className="text-gray-500 mb-4">Please try refreshing the page</p>
                <button
                  onClick={() => {
                    setLoading(true);
                    fetchGames();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Retry Loading
                </button>
              </div>
            )}

            {/* No Games in Selected Category */}
            {games.length > 0 && filteredGames.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-cyan-400 text-lg mb-4">No games found in "{selectedCategory}" category</div>
                <p className="text-gray-500 mb-4">Try selecting a different category</p>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  View All Games
                </button>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Games;
