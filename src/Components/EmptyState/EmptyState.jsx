import { motion } from 'framer-motion';
import { FaGamepad, FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';

const EmptyState = ({ 
  icon: Icon = FaGamepad, 
  title = 'No items found', 
  message = 'There are no items to display at the moment.',
  actionLabel,
  onAction,
  actionIcon: ActionIcon
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <div className="bg-gray-800 rounded-full p-8">
          <Icon className="text-6xl text-gray-600" />
        </div>
      </motion.div>
      
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-center max-w-md mb-6">{message}</p>
      
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2"
        >
          {ActionIcon && <ActionIcon />}
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export const EmptyWishlist = ({ onBrowseGames }) => (
  <EmptyState
    icon={FaHeart}
    title="Your Wishlist is Empty"
    message="Start adding games to your wishlist to keep track of what you want to play!"
    actionLabel="Browse Games"
    onAction={onBrowseGames}
    actionIcon={FaGamepad}
  />
);

export const EmptyCart = ({ onBrowseGames }) => (
  <EmptyState
    icon={FaShoppingCart}
    title="Your Cart is Empty"
    message="Add some awesome games to your cart and start your gaming adventure!"
    actionLabel="Browse Games"
    onAction={onBrowseGames}
    actionIcon={FaGamepad}
  />
);

export const NoSearchResults = ({ onClearSearch }) => (
  <EmptyState
    icon={FaSearch}
    title="No Games Found"
    message="We couldn't find any games matching your search. Try different keywords or browse all games."
    actionLabel="Clear Search"
    onAction={onClearSearch}
  />
);

export default EmptyState;
