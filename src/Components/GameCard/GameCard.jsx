import { FaStar, FaGamepad, FaImage, FaDownload, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { downloadGameCard } from '../../utils/gameExport';
import { useWishlist } from '../../Context/WishlistContext';
import { useAuth } from '../../Context/Authcontext';
import { toast } from 'react-toastify';

const GameCard = ({ game, index = 0 }) => {
  const [imgError, setImgError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('pdf');

  // Wishlist functionality
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading, getWishlistItem } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Helper function to get image URL from various possible properties
  const getImageUrl = (game) => {
    const imageUrl = game.image || game.imageUrl || game.ImageUrl || game.posterUrl || game.thumbnail || game.coverImage || game.imagePath;

    if (!imageUrl) return null;

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
  };

  const gameImageUrl = getImageUrl(game);

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    console.log('GameCard: Wishlist button clicked');
    console.log('GameCard: isAuthenticated:', isAuthenticated);
    console.log('GameCard: game.id:', game.id);
    console.log('GameCard: isInWishlist:', isInWishlist(game.id));

    if (!isAuthenticated) {
      console.log('GameCard: User not authenticated, showing login prompt');
      toast.error('🔐 Please login to add games to your wishlist');
      return;
    }

    console.log('GameCard: User authenticated, proceeding with wishlist operation');

    try {
      if (isInWishlist(game.id)) {
        console.log('GameCard: Removing from wishlist');
        await removeFromWishlist(game.id);
        toast.success('💔 Game removed from wishlist');
      } else {
        console.log('GameCard: Adding to wishlist');
        await addToWishlist(game.id);
        toast.success('❤️ Game added to wishlist!');
      }
    } catch (error) {
      console.error('GameCard: Wishlist operation failed:', error);
      toast.error(`❌ ${error.message || 'Something went wrong'}`);
    }
  };

  // Handle download functionality
  const handleDownload = async (format) => {
    setIsDownloading(true);
    try {
      // Get wishlist data if the game is in wishlist
      const wishlistItem = isInWishlist(game.id) ? getWishlistItem(game.id) : null;
      await downloadGameCard(game, format, wishlistItem);
    } catch (error) {
      console.error('Download failed:', error);
      // You could add toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

  // Animation variants for scroll reveal
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative group"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={{
        scale: 1.02,
        y: -8,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
        initial={false}
        animate={{
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative flex-1 flex items-center justify-center bg-gray-700 min-h-[256px] overflow-hidden">
        {imgError || !gameImageUrl ? (
          <motion.div
            className="w-full h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FaImage className="text-4xl mb-2" />
            </motion.div>
            <span>Game Artwork</span>
          </motion.div>
        ) : (
          <motion.img
            src={gameImageUrl}
            alt={game.title}
            className="w-full h-64 object-cover transition-transform duration-700"
            onError={() => setImgError(true)}
            loading="lazy"
            whileHover={{
              scale: 1.1,
              rotate: 1,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut"
            }}
          />
        )}

        {/* Enhanced discount badge */}
        {game.discount && (
          <motion.div
            className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              delay: index * 0.1 + 0.2
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 20px rgba(220, 38, 38, 0.8)"
            }}
          >
            -{game.discount}%
          </motion.div>
        )}

        {/* Wishlist button */}
        <motion.button
          className={`absolute top-2 ${game.discount ? 'right-16' : 'right-2'} p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isInWishlist(game.id)
              ? 'bg-red-500/90 text-white hover:bg-red-600'
              : 'bg-black/50 text-white hover:bg-red-500/70 hover:text-white'
            }`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            delay: index * 0.1 + 0.4
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 15px rgba(239, 68, 68, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          title={isInWishlist(game.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlistLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            </motion.div>
          ) : (
            <motion.div
              animate={isInWishlist(game.id) ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FaHeart className={`text-sm ${isInWishlist(game.id) ? 'fill-current' : ''}`} />
            </motion.div>
          )}
        </motion.button>
        <motion.div
          className="absolute top-2 left-2 flex items-center bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-yellow-400/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <FaStar className="text-yellow-400 mr-1 text-xs" />
          </motion.div>
          {game.rating}
        </motion.div>
      </div>

      <div className="p-4 relative z-10">
        <motion.div
          className="flex justify-between items-start mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          <motion.h3
            className="text-xl font-bold text-white font-heading group-hover:neon-glow-cyan transition-all duration-300"
            whileHover={{
              scale: 1.02,
              textShadow: "0 0 10px rgba(6, 182, 212, 0.5)"
            }}
          >
            {game.title}
          </motion.h3>
        </motion.div>

        <motion.p
          className="text-gray-400 text-sm mb-3 font-rajdhani"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {game.genre}
        </motion.p>

        {/* Enhanced platform badges */}
        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.6 }}
        >
          {game.platforms && game.platforms.map((platform, idx) => (
            <motion.span
              key={idx}
              className="text-xs bg-gray-700 px-2 py-1 rounded flex items-center border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.7 + idx * 0.05 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FaGamepad className="mr-1 text-blue-400" />
              </motion.div>
              {platform}
            </motion.span>
          ))}
        </motion.div>

        {/* Enhanced price and button section */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.8 }}
        >
          <div>
            {game.discount ? (
              <motion.div
                className="flex items-baseline"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.span
                  className="line-through text-gray-500 text-sm"
                  initial={{ opacity: 0.5 }}
                  whileHover={{ opacity: 1 }}
                >
                  ₹{typeof game.price === 'number' ? game.price.toFixed(2) : parseFloat(game.price || 0).toFixed(2)}
                </motion.span>
                <motion.span
                  className="ml-2 text-xl font-bold text-white font-orbitron"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(255,255,255,0)",
                      "0 0 10px rgba(255,255,255,0.3)",
                      "0 0 0px rgba(255,255,255,0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ₹{typeof game.price === 'number' ? (game.price * (1 - game.discount / 100)).toFixed(2) : parseFloat((game.price || 0) * (1 - game.discount / 100)).toFixed(2)}
                </motion.span>
              </motion.div>
            ) : (
              <motion.span
                className="text-xl font-bold text-white font-orbitron"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(255,255,255,0)",
                    "0 0 10px rgba(255,255,255,0.3)",
                    "0 0 0px rgba(255,255,255,0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ₹{typeof game.price === 'number' ? game.price.toFixed(2) : parseFloat(game.price || 0).toFixed(2)}
              </motion.span>
            )}
          </div>
          {/* 
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.8 }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={`/game/${game.id}`}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg border border-blue-500/50 hover:border-blue-400"
              >
                <motion.span
                  className="inline-block"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  View Details
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 shadow-lg border border-green-500/50 hover:border-green-400 appearance-none cursor-pointer"
                  disabled={isDownloading}
                >
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                </select>
                <button
                  onClick={() => handleDownload(downloadFormat)}
                  disabled={isDownloading}
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent border-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <FaDownload className="mr-1" />
                      <span className="hidden sm:inline">Download</span>
                    </motion.div>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div> */}
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{
          duration: 0.8,
          delay: index * 0.1 + 1.0,
          ease: "easeOut"
        }}
        viewport={{ once: true }}
      />
    </motion.div>
  );
};

export default GameCard;
