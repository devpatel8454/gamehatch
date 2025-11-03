import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './Authcontext';
import { useGames } from './GamesContext';
import { fetchUserWishlist, addGameToWishlist, removeGameFromWishlist, getWishlistItemByGameId } from '../services/wishlistService';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token, isAuthenticated } = useAuth();
  const { games } = useGames();

  // Fetch user's wishlist from API and sync with localStorage
  const fetchWishlist = async () => {
    const userId = user?.id || user?.userId || user?.UserId || user?.ID;
    
    if (!isAuthenticated || !userId) {
      if (import.meta.env.DEV) {
        console.log('Wishlist: User not authenticated or no user ID');
      }
      setWishlist([]);
      // Clear localStorage when user is not authenticated
      localStorage.removeItem('userWishlist');
      return;
    }

    if (import.meta.env.DEV) {
      console.log('Wishlist: Fetching wishlist for user:', userId);
      console.log('Wishlist: Games loaded:', games.length);
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch from API
      const response = await fetch(`https://localhost:7270/api/UserGame/wishlist/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      let wishlistData = [];
      
      if (response.ok) {
        const data = await response.json();
        if (import.meta.env.DEV) {
          console.log('Wishlist: API Response:', data);
        }
        
        // Handle different response structures
        if (Array.isArray(data)) {
          wishlistData = data;
        } else if (data?.data && Array.isArray(data.data)) {
          wishlistData = data.data;
        } else if (data?.games && Array.isArray(data.games)) {
          wishlistData = data.games;
        }
      } else {
        if (import.meta.env.DEV) {
          console.warn('Wishlist: API returned error, using empty wishlist');
        }
      }

      // Sync localStorage with API response (clear if empty)
      if (wishlistData.length === 0) {
        localStorage.removeItem('userWishlist');
        if (import.meta.env.DEV) {
          console.log('Wishlist: Cleared localStorage - wishlist is empty');
        }
      } else {
        localStorage.setItem('userWishlist', JSON.stringify(wishlistData));
      }

      // Merge wishlist data with full game data
      const enrichedWishlist = wishlistData.map(wishlistItem => {
        if (import.meta.env.DEV) {
          console.log('Wishlist: Processing wishlist item:', wishlistItem);
        }

        // Extract gameId from various possible fields
        const gameId = wishlistItem.gameId || wishlistItem.GameId || wishlistItem.id;

        // Check if wishlistItem already contains full game data
        if (wishlistItem.title && wishlistItem.image) {
          if (import.meta.env.DEV) {
            console.log('Wishlist: Item already contains full game data');
          }
          return { ...wishlistItem, id: gameId };
        }

        // Otherwise, find the game in the games array
        const fullGame = games.find(game => game.id === gameId);
        if (import.meta.env.DEV) {
          console.log('Wishlist: Found game:', fullGame?.title || 'Not found');
        }

        if (fullGame) {
          return { ...fullGame, wishlistId: wishlistItem.id, addedAt: wishlistItem.addedAt };
        } else {
          if (import.meta.env.DEV) {
            console.log('Wishlist: Game not found in games array, skipping');
          }
          return null;
        }
      }).filter(Boolean); // Remove null items (games not found)

      if (import.meta.env.DEV) {
        console.log('Wishlist: Enriched wishlist:', enrichedWishlist);
      }
      setWishlist(enrichedWishlist);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Wishlist: Error fetching wishlist:', error);
      }
      setError(error.message);
      // Fallback to empty wishlist on error
      setWishlist([]);
      localStorage.removeItem('userWishlist');
    } finally {
      setLoading(false);
    }
  };

  // Add game to wishlist
  const addToWishlist = async (gameId) => {
    // Get user ID from various possible field names
    const userId = user?.id || user?.userId || user?.UserId || user?.ID;
    
    if (!isAuthenticated || !userId) {
      if (import.meta.env.DEV) {
        console.log('Wishlist: Cannot add - user not authenticated');
        console.log('Wishlist: isAuthenticated:', isAuthenticated);
        console.log('Wishlist: user:', user);
        console.log('Wishlist: userId:', userId);
      }
      throw new Error('Please login to add items to wishlist');
    }

    if (import.meta.env.DEV) {
      console.log('Wishlist: Adding game to wishlist:', gameId);
      console.log('Wishlist: userId:', userId);
    }

    setLoading(true);
    setError(null);

    try {
      await addGameToWishlist(userId, gameId, token);
      if (import.meta.env.DEV) {
        console.log('Wishlist: Successfully added game, refreshing wishlist...');
      }
      // Refresh wishlist after adding
      await fetchWishlist();
      return true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Wishlist: Error adding to wishlist:', error);
      }
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove game from wishlist
  const removeFromWishlist = async (gameId) => {
    const userId = user?.id || user?.userId || user?.UserId || user?.ID;
    
    if (!isAuthenticated || !userId) {
      if (import.meta.env.DEV) {
        console.log('Wishlist: Cannot remove - user not authenticated');
      }
      throw new Error('Please login to manage wishlist');
    }

    if (import.meta.env.DEV) {
      console.log('Wishlist: Removing game from wishlist:', gameId);
    }

    setLoading(true);
    setError(null);

    try {
      // Call backend API to remove from wishlist
      const response = await fetch('https://localhost:7270/api/UserGame/wishlist/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          UserId: userId,
          GameId: gameId
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to remove from wishlist (${response.status})`);
      }

      if (import.meta.env.DEV) {
        console.log('Wishlist: Successfully removed game from API');
      }
      
      // Immediately update local state for instant UI feedback
      setWishlist(prevWishlist => {
        const updated = prevWishlist.filter(item => item.id !== gameId);
        if (import.meta.env.DEV) {
          console.log('Wishlist: Updated local state, new count:', updated.length);
        }
        return updated;
      });
      
      // Update localStorage to reflect the removal
      const WISHLIST_STORAGE_KEY = 'userWishlist';
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const wishlistData = JSON.parse(stored);
          const updatedWishlist = wishlistData.filter(item => 
            item.gameId !== gameId && item.GameId !== gameId && item.id !== gameId
          );
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedWishlist));
          if (import.meta.env.DEV) {
            console.log('Wishlist: Updated localStorage after removal');
          }
        }
      } catch (e) {
        if (import.meta.env.DEV) {
          console.warn('Wishlist: Failed to update localStorage:', e);
        }
      }
      
      // Refresh wishlist from API to ensure consistency
      await fetchWishlist();
      return true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Wishlist: Error removing from wishlist:', error);
      }
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if a game is in wishlist
  const isInWishlist = (gameId) => {
    if (!wishlist || wishlist.length === 0) {
      return false;
    }
    const inWishlist = wishlist.some(item => item.id === gameId);
    if (import.meta.env.DEV) {
      console.log(`Wishlist: Checking if game ${gameId} is in wishlist:`, inWishlist);
      console.log('Wishlist: Current wishlist:', wishlist.map(item => item.id));
    }
    return inWishlist;
  };

  // Get wishlist item by game ID
  const getWishlistItem = (gameId) => {
    return wishlist.find(item => item.id === gameId);
  };

  // Load wishlist when user authentication or games data changes
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Wishlist: useEffect triggered');
      console.log('Wishlist: isAuthenticated:', isAuthenticated);
      console.log('Wishlist: user:', user);
      console.log('Wishlist: games count:', games.length);
    }

    if (isAuthenticated && user?.id && games.length > 0) {
      if (import.meta.env.DEV) {
        console.log('Wishlist: All conditions met, fetching wishlist...');
      }
      fetchWishlist();
    } else {
      if (import.meta.env.DEV) {
        console.log('Wishlist: Conditions not met, clearing wishlist');
      }
      setWishlist([]);
      // Clear localStorage when conditions are not met
      localStorage.removeItem('userWishlist');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id, games.length]);

  // Force clear wishlist (for debugging/manual clearing)
  const clearWishlist = () => {
    if (import.meta.env.DEV) {
      console.log('Wishlist: Force clearing wishlist');
    }
    setWishlist([]);
    localStorage.removeItem('userWishlist');
  };

  const contextValue = {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    isInWishlist,
    getWishlistItem,
    clearWishlist,
    clearError: () => setError(null),
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
