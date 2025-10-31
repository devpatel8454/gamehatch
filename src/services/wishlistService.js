// Wishlist LocalStorage Service Functions
const WISHLIST_STORAGE_KEY = 'userWishlist';

// Helper function to get wishlist from localStorage
const getWishlistFromStorage = () => {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
};

// Helper function to save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    return true;
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
    throw error;
  }
};

// Fetch user's wishlist from localStorage
export const fetchUserWishlist = async (userId, token) => {
  try {
    console.log('Wishlist: Fetching from localStorage for user:', userId);
    const wishlist = getWishlistFromStorage();
    console.log('Wishlist: Found items:', wishlist.length);
    return wishlist;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Add game to wishlist in localStorage
export const addGameToWishlist = async (userId, gameId, token) => {
  try {
    console.log('Wishlist(API): Adding game to wishlist');
    console.log('Wishlist(API): userId:', userId, 'gameId:', gameId);
    
    // Validate that we have valid UUIDs
    if (!userId || userId === 'undefined' || userId === 'null') {
      throw new Error('Invalid User ID. Please login again.');
    }
    
    if (!gameId || gameId === 'undefined' || gameId === 'null') {
      throw new Error('Invalid Game ID.');
    }

    // Call backend API with required fields (UserId, GameId, AddedAt)
    const payload = { 
      UserId: userId, 
      GameId: gameId,
      AddedAt: new Date().toISOString()
    };
    
    console.log('📤 Wishlist API Payload:', payload);
    
    const response = await fetch('https://localhost:7270/api/UserGame/wishlist/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      const msg = data?.message || data?.error || `Wishlist add failed (${response.status})`;
      console.error('Wishlist(API): Server error:', msg);
      throw new Error(msg);
    }

    // Optionally cache locally so UI reflects immediately
    const wishlist = getWishlistFromStorage();
    const exists = wishlist.some(item => item.gameId === gameId);
    if (!exists) {
      wishlist.push({
        id: data?.id || crypto.randomUUID(),
        userId,
        gameId,
        addedAt: new Date().toISOString(),
      });
      saveWishlistToStorage(wishlist);
    }

    console.log('Wishlist(API): Added successfully');
    return { success: true, message: data?.message || 'Added to wishlist' };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    // Provide more specific error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Remove game from wishlist in localStorage
export const removeGameFromWishlist = async (wishlistId, token) => {
  try {
    console.log('Wishlist: Removing from localStorage, wishlistId:', wishlistId);

    const wishlist = getWishlistFromStorage();
    const updatedWishlist = wishlist.filter(item => item.id !== wishlistId);

    saveWishlistToStorage(updatedWishlist);

    console.log('Wishlist: Removed successfully');
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Check if game is in wishlist
export const checkGameInWishlist = async (userId, gameId, token) => {
  try {
    const wishlist = getWishlistFromStorage();
    return wishlist.some(item => item.gameId === gameId);
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

// Get specific wishlist item by ID
export const getWishlistItemById = async (wishlistId, token) => {
  try {
    const wishlist = getWishlistFromStorage();
    return wishlist.find(item => item.id === wishlistId) || null;
  } catch (error) {
    console.error('Error finding wishlist item:', error);
    return null;
  }
};

// Get wishlist item by game ID for a specific user
export const getWishlistItemByGameId = async (userId, gameId, token) => {
  try {
    const wishlist = getWishlistFromStorage();
    return wishlist.find(item => item.gameId === gameId) || null;
  } catch (error) {
    console.error('Error finding wishlist item by game ID:', error);
    return null;
  }
};
