import { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart, FaStar, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../Context/Authcontext';
import { useWishlist } from '../Context/WishlistContext';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/Slice/Cart/cartSlice';
import { showSuccess, showError } from '../utils/toast';
import GameCardSkeleton from '../Components/Skeleton/GameCardSkeleton';
import LazyImage from '../Components/LazyImage/LazyImage';
import SEO from '../Components/SEO/SEO';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { EmptyWishlist } from '../Components/EmptyState/EmptyState';
import ConfirmDialog from '../Components/ConfirmDialog/ConfirmDialog';
import WishlistExport from '../Components/WishlistExport/WishlistExport';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer/Footer';

const Wishlist = () => {
  const { isAuthenticated, user, token } = useAuth();
  const { fetchWishlist } = useWishlist();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, game: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Helper to construct a proper image URL
  const getImageUrl = (imageUrl) => {
    const FALLBACK = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center";
    if (!imageUrl || typeof imageUrl !== 'string') return FALLBACK;

    // If already an absolute URL
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

    let url = imageUrl.trim();
    // Handle leading slash
    if (url.startsWith('/')) url = url.slice(1);

    // Common backend patterns
    if (url.toLowerCase().startsWith('uploads/')) {
      const filename = url.slice('uploads/'.length);
      return `https://localhost:7270/uploads/${encodeURIComponent(filename)}`;
    }

    // Fallback to serving from backend root
    return `https://localhost:7270/${encodeURIComponent(url)}`;
  };

  // Helper: decode JWT payload safely
  const decodeJwtPayload = (jwt) => {
    try {
      const base64Url = jwt?.split?.('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.warn('[Wishlist Debug] Failed to decode JWT:', e);
      return null;
    }
  };

  // Fetch wishlist from backend API
  useEffect(() => {
    const fetchWishlist = async () => {
      console.log('[Wishlist Debug] useEffect triggered');
      console.log('[Wishlist Debug] user:', user);
      console.log('[Wishlist Debug] token:', token);
      console.log('[Wishlist Debug] isAuthenticated:', isAuthenticated);

      // Try to get userId from user object or token claims
      const tokenPayload = decodeJwtPayload(token) || {};
      const userId = (
        user?.id || user?.userId || user?.UserId || user?.Id ||
        tokenPayload.sub || tokenPayload.nameid || tokenPayload.userId || tokenPayload.UserId || tokenPayload.uid || tokenPayload.id || tokenPayload.Id
      );
      const effectiveToken = token || null;

      console.log('[Wishlist Debug] Extracted userId:', userId);
      console.log('[Wishlist Debug] Extracted token:', effectiveToken ? 'exists' : 'missing');

      if (!userId) {
        console.log('Wishlist: No userId available, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching wishlist for userId:', userId);

        const response = await fetch(`https://localhost:7270/api/UserGame/wishlist/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {}),
          },
        });

        console.log('Wishlist API response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Wishlist API error:', errorText);
          throw new Error(`Failed to fetch wishlist: ${response.status}`);
        }

        const data = await response.json();
        console.log('Wishlist API response data:', data);
        console.log('Response type:', typeof data);
        console.log('Is array?', Array.isArray(data));

        // Handle different response structures
        let wishlistData = [];

        if (Array.isArray(data)) {
          wishlistData = data;
        } else if (data?.data && Array.isArray(data.data)) {
          wishlistData = data.data;
        } else if (data?.games && Array.isArray(data.games)) {
          wishlistData = data.games;
        } else if (data?.wishlist && Array.isArray(data.wishlist)) {
          wishlistData = data.wishlist;
        } else if (typeof data === 'object' && data !== null) {
          // If it's a single object, wrap it in an array
          wishlistData = [data];
        }

        // Normalize items: if backend returns wishlist entries with nested game property, unwrap it
        const normalized = wishlistData.map(item => {
          // Common shapes: { id, userId, gameId, addedAt }, { id, userId, game: {...} }, or direct game object
          if (item.game) return { ...item.game };
          if (item.Game) return { ...item.Game };
          // If only IDs are present, keep as-is; UI will show fallback image/title
          return item;
        });

        console.log('Parsed wishlist data:', wishlistData);
        console.log('Normalized wishlist data:', normalized);
        console.log('Number of items:', wishlistData.length);
        setWishlist(normalized);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError(err.message);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, token]); // Trigger on any user/token change

  // Handle adding to cart
  const handleAddToCart = (game) => {
    const cartItem = {
      id: game.id || game.Id,
      name: game.title || game.Title || 'Unknown Game',
      price: game.price || game.Price || 0,
      image: getImageUrl(game.imageUrl || game.ImageUrl),
      category: game.category || game.Category || 'Action'
    };
    dispatch(addToCart(cartItem));
    showSuccess('Added to cart!');
  };

  // Open confirmation dialog
  const openRemoveConfirmation = (game) => {
    setConfirmDialog({ isOpen: true, game });
  };

  // Handle removing items from wishlist
  const handleRemoveFromWishlist = async (itemOrGameId) => {
    try {
      // Resolve userId from user or token claims
      const tokenPayload = decodeJwtPayload(token) || {};
      const userId = (
        user?.id || user?.userId || user?.UserId || user?.Id ||
        tokenPayload.sub || tokenPayload.nameid || tokenPayload.userId || tokenPayload.UserId || tokenPayload.uid || tokenPayload.id || tokenPayload.Id
      );

      // Determine the actual gameId present in the entry
      console.log('[Wishlist Debug] Item passed to remove:', itemOrGameId);
      console.log('[Wishlist Debug] Item structure:', JSON.stringify(itemOrGameId, null, 2));

      // Backend returns Game objects with Id (capital I) from GetWishlist endpoint
      const gameId = typeof itemOrGameId === 'object'
        ? (itemOrGameId.id || itemOrGameId.Id || itemOrGameId.gameId || itemOrGameId.GameId)
        : itemOrGameId;

      if (!userId || !gameId) {
        console.warn('[Wishlist Debug] Missing userId or gameId for removal', { userId, gameId });
        return;
      }

      const url = 'https://localhost:7270/api/UserGame/wishlist/remove';
      const payload = { UserId: userId, GameId: gameId };
      console.log('[Wishlist Debug] Removing via POST:', url);
      console.log('[Wishlist Debug] Payload:', payload);
      console.log('[Wishlist Debug] Payload JSON:', JSON.stringify(payload));
      console.log('[Wishlist Debug] userId type:', typeof userId, 'value:', userId);
      console.log('[Wishlist Debug] gameId type:', typeof gameId, 'value:', gameId);
      console.log('[Wishlist Debug] Current wishlist items:', wishlist.map(w => ({ id: w.id, Id: w.Id, gameId: w.gameId, GameId: w.GameId })));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log('[Wishlist Debug] Remove API response (POST):', response.status, text);
      if (!response.ok) {
        throw new Error(text || `Remove failed (${response.status})`);
      }

      // Only update UI state after successful API removal
      // Filter by Id/id since backend returns Game objects with Id property
      setWishlist(prevWishlist =>
        prevWishlist.filter(item => {
          const itemGameId = item.id || item.Id || item.gameId || item.GameId;
          return itemGameId !== gameId;
        })
      );

      // Dispatch custom event to update navbar count
      window.dispatchEvent(new Event('wishlistUpdated'));

      // Refresh global wishlist context so other components update
      if (typeof fetchWishlist === 'function') {
        try {
          await fetchWishlist();
        } catch (e) {
          console.warn('Wishlist: fetch refresh failed:', e);
        }
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      showError('Failed to remove from wishlist. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900">
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="h-10 bg-gray-800 rounded w-64 mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-800 rounded w-48 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(6)].map((_, index) => (
                <GameCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please login to view your wishlist</p>
          <a
            href="/login"
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="My Wishlist - GameHatch | Your Saved Games"
        description="View and manage your wishlist of favorite games. Keep track of games you want to play and purchase them when ready."
        keywords="wishlist, saved games, favorite games, game collection"
      />
      <div className="min-h-screen flex flex-col bg-gray-900">
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
                <FaHeart className="text-red-500 mr-3" />
                My Wishlist
              </h1>
              <p className="text-gray-400 text-lg">
                {wishlist.length} {wishlist.length === 1 ? 'game' : 'games'} in your wishlist
              </p>
            </div>

            {/* Export Section - Only show if wishlist has items */}
            {wishlist.length > 0 && <WishlistExport wishlist={wishlist} />}

            {/* Wishlist Grid */}
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {wishlist.map((game, index) => (
                  <motion.div
                    key={game.id}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Game Image */}
                    <div className="relative">
                      <LazyImage
                        src={getImageUrl(
                          game.image || game.imageUrl || game.posterUrl || game.thumbnail || game.coverImage || game.imagePath
                        )}
                        alt={game.title || game.name || 'Game'}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => openRemoveConfirmation(game)}
                          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
                          title="Remove from wishlist"
                          aria-label={`Remove ${game.title || 'game'} from wishlist`}
                        >
                          <FaHeart aria-hidden="true" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <button
                          onClick={() => openRemoveConfirmation(game)}
                          className="p-2 rounded-full bg-gray-900/70 text-white hover:bg-red-500 transition-all"
                          title="Remove from wishlist"
                          aria-label={`Delete ${game.title || 'game'} from wishlist`}
                        >
                          <FaTrash className="text-sm" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Game Details */}
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                        {game.title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-2">
                        {game.category || 'Action'}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2" role="img" aria-label="Rating">
                          <FaStar className="text-yellow-400" aria-hidden="true" />
                          <span className="text-gray-300 text-sm">4.5</span>
                        </div>
                        <span className="text-green-400 font-semibold" aria-label="Price">
                          ₹{typeof game.price === 'number' ? game.price.toFixed(2) : parseFloat(game.price || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(game)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-2 px-3 rounded-md font-medium transition-all flex items-center justify-center space-x-1"
                          aria-label={`Add ${game.title || 'game'} to cart`}
                        >
                          <FaShoppingCart className="text-sm" aria-hidden="true" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Empty Wishlist */
              <EmptyWishlist onBrowseGames={() => navigate('/games')} />
            )}
          </div>
        </div>
        <Footer />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, game: null })}
        onConfirm={() => handleRemoveFromWishlist(confirmDialog.game)}
        title="Remove from Wishlist"
        message={`Are you sure you want to remove "${confirmDialog.game?.title || 'this game'}" from your wishlist?`}
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default Wishlist;
