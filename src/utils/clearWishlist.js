// Utility to manually clear wishlist data
// Run this in browser console: clearWishlistData()

export const clearWishlistData = () => {
  console.log('🧹 Clearing all wishlist data...');
  
  // Clear localStorage
  localStorage.removeItem('userWishlist');
  
  // Force reload the page to reset React state
  console.log('✅ Wishlist data cleared! Reloading page...');
  window.location.reload();
};

// Make it available globally in browser console
if (typeof window !== 'undefined') {
  window.clearWishlistData = clearWishlistData;
}
