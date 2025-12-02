import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaGamepad, FaArrowRight, FaStar, FaRegClock, FaTag, FaChevronRight, FaPlay, FaBolt, FaTrophy } from 'react-icons/fa';
import GameCard from '../Components/GameCard/GameCard';
import NewsCard from '../Components/NewsCard/NewsCard';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import Footer from '../Components/Footer/Footer';

// Game images - using actual game cover art
const game1 = 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg';
const game2 = 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg';
const game3 = 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg';
const game4 = 'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg';
const game5 = 'https://cdn.cloudflare.steamstatic.com/steam/apps/1774580/header.jpg';
const game6 = 'https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/header.jpg';

const heroSlides = [
  {
    id: 1,
    title: 'Cyberpunk 2077: Phantom Liberty',
    description: 'The next chapter in the Cyberpunk saga. Experience an immersive open-world adventure in Night City.',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_80d5e0f4ddcfe8f7e6d0e84d5d5f4e5d5e5f4e5d.1920x1080.jpg',
    buttonText: 'Buy Now',
    buttonLink: '/game/cyberpunk-2077',
    isNew: true
  },
  {
    id: 2,
    title: 'Elden Ring: Shadow of the Erdtree',
    description: 'The highly anticipated expansion to the 2023 Game of the Year. Explore new lands and face new challenges.',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_8a8f5c4b5e5f4e5d5e5f4e5d5e5f4e5d5e5f4e5d.1920x1080.jpg',
    buttonText: 'Learn More',
    buttonLink: '/game/elden-ring',
    isNew: false
  },
  {
    id: 3,
    title: 'God of War: Ragnarök',
    description: 'Join Kratos and Atreus on an epic mythic journey through the Nine Realms to prevent Ragnarök.',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/2322010/ss_1c8e0e0e5e5f4e5d5e5f4e5d5e5f4e5d5e5f4e5d.1920x1080.jpg',
    buttonText: 'Buy Now',
    buttonLink: '/game/god-of-war-ragnarok',
    isNew: false
  },
  {
    id: 4,
    title: 'Star Wars Jedi: Survivor',
    description: 'Continue Cal Kestis\'s journey as he fights to stay one step ahead of the Empire\'s constant pursuit.',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/1774580/ss_2e5e0e5e5f4e5d5e5f4e5d5e5f4e5d5e5f4e5d.1920x1080.jpg',
    buttonText: 'Explore Now',
    buttonLink: '/game/star-wars-jedi',
    isNew: false
  },
  {
    id: 5,
    title: 'Black Myth: Wukong',
    description: 'An action RPG rooted in Chinese mythology. Experience stunning visuals and intense combat.',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/2358720/ss_3e5e0e5e5f4e5d5e5f4e5d5e5f4e5d5e5f4e5d.1920x1080.jpg',
    buttonText: 'Pre-order',
    buttonLink: '/game/black-myth-wukong',
    isNew: true
  }
];

const featuredGames = [
  {
    id: 1,
    title: 'Cyberpunk 2077',
    genre: 'RPG',
    price: 3499,
    discount: 30,
    rating: 4.5,
    platforms: ['PC', 'PS5', 'Xbox'],
    image: game1
  },
  {
    id: 2,
    title: 'Elden Ring',
    genre: 'Action RPG',
    price: 4499,
    rating: 4.8,
    platforms: ['PC', 'PS5', 'Xbox'],
    image: game2
  },
  {
    id: 3,
    title: 'God of War: Ragnarök',
    genre: 'Action-Adventure',
    price: 4999,
    rating: 4.9,
    platforms: ['PS5', 'PS4'],
    image: game3
  },
  {
    id: 4,
    title: 'Horizon Forbidden West',
    genre: 'Action RPG',
    price: 3999,
    discount: 20,
    rating: 4.7,
    platforms: ['PS5', 'PS4'],
    image: game4
  }
];

const upcomingGames = [
  {
    id: 5,
    title: 'The Legend of Zelda: Tears of the Kingdom',
    genre: 'Action-Adventure',
    releaseDate: '2025-05-12',
    platforms: ['Nintendo Switch'],
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/header.jpg',
    rating: 4.9,
    price: 5999,
    isWishlist: false
  },
  {
    id: 6,
    title: 'Final Fantasy XVI',
    genre: 'Action RPG',
    releaseDate: '2025-06-22',
    platforms: ['PS5'],
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2515020/header.jpg',
    rating: 4.8,
    price: 5499,
    isWishlist: true
  },
  {
    id: 7,
    title: 'Star Wars Jedi: Survivor',
    genre: 'Action-Adventure',
    releaseDate: '2025-03-15',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1774580/header.jpg',
    rating: 4.7,
    price: 4999,
    isWishlist: false
  }
];

const latestNews = [
  {
    id: 1,
    title: 'New DLC Announced for Cyberpunk 2077',
    excerpt: 'CD Projekt Red reveals Phantom Liberty expansion with Keanu Reeves returning as Johnny Silverhand.',
    date: '2025-10-10',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    category: 'News',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Elden Ring Wins Game of the Year',
    excerpt: 'FromSoftware\'s epic fantasy RPG takes home the top prize at The Game Awards 2023.',
    date: '2025-12-08',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    category: 'Awards',
    readTime: '3 min read'
  },
  {
    id: 3,
    title: 'Upcoming Game Releases in 2025',
    excerpt: 'A look at the most anticipated games coming in the next year, from indies to AAA titles.',
    date: '2025-10-05',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg',
    category: 'Preview',
    readTime: '7 min read'
  }
];

const gameCategories = [
  { id: 1, name: 'Action', count: 124, icon: '🎮' },
  { id: 2, name: 'Adventure', count: 89, icon: '🗺️' },
  { id: 3, name: 'RPG', count: 76, icon: '⚔️' },
  { id: 4, name: 'Strategy', count: 52, icon: '♟️' },
  { id: 5, name: 'Sports', count: 43, icon: '⚽' },
  { id: 6, name: 'Racing', count: 37, icon: '🏎️' },
];

function Home() {
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Refs for scroll animations
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const categoriesRef = useRef(null);
  const upcomingRef = useRef(null);
  const ctaRef = useRef(null);

  // Scroll-based parallax hooks
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, -300]);
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -150]);
  const particlesY = useTransform(scrollY, [0, 1000], [0, -200]);
  const glowY = useTransform(scrollY, [0, 1000], [0, -100]);

  // Mouse tracking with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    // Simulate API call
    const fetchTrendingGames = async () => {
      setTimeout(() => {
        setTrendingGames([...featuredGames].sort(() => 0.5 - Math.random()).slice(0, 3));
        setLoading(false);
      }, 1000);
    };

    fetchTrendingGames();

    // Auto-rotate hero slides
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const daysUntilRelease = (dateString) => {
    const today = new Date();
    const releaseDate = new Date(dateString);
    const diffTime = releaseDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <main className="flex-grow w-full flex flex-col">
        <div className="flex-grow">
          {/* Epic Gaming Hero Poster */}
          <section className="relative h-screen overflow-hidden bg-black" ref={heroRef}>
            {/* Parallax Background Layers with Video */}
            <motion.div
              className="absolute inset-0"
              style={{ y: backgroundY }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/video/home_page_video.mp4" type="video/mp4" />
                {/* Fallback image if video doesn't load */}
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80"
                  alt="Gaming Background"
                  className="w-full h-full object-cover"
                />
              </video>
              {/* Lighter overlay to keep video visible */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
            </motion.div>

            {/* Main Content with Enhanced Parallax */}
            <motion.div
              className="relative z-10 container mx-auto h-full flex items-center px-4 py-8"
              style={{ y: heroY }}
            >
              <div className="w-full max-w-6xl mx-auto">
                {/* Top Badge */}
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-md opacity-60"></div>
                    <div className="relative flex items-center gap-2 bg-black px-5 py-2 rounded-full border-2 border-cyan-400">
                      <FaBolt className="text-yellow-400 animate-pulse" />
                      <span className="text-white font-bold text-xs tracking-wider">ELITE GAMING HUB</span>
                    </div>
                  </div>
                </motion.div>

                {/* Main Title with Advanced Text Animation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-center"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
                    <motion.span
                      className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      UNLEASH THE GAMER
                    </motion.span>
                    <motion.span
                      className="block text-white mt-1"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.4,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      IN YOU
                    </motion.span>
                  </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 font-light max-w-2xl mx-auto text-center px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Join the <span className="text-cyan-400 font-semibold">ultimate gaming revolution</span>.
                  Compete, conquer, and claim your throne.
                </motion.p>

                {/* Feature Pills with Enhanced Animations */}
                <motion.div
                  className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 px-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 sm:px-6 py-3 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer"
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-xl sm:text-2xl font-bold text-cyan-400">1000+</div>
                    <div className="text-xs sm:text-sm text-gray-400">Games</div>
                  </motion.div>
                  <motion.div
                    className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 sm:px-6 py-3 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-xl sm:text-2xl font-bold text-purple-400">10M+</div>
                    <div className="text-xs sm:text-sm text-gray-400">Players</div>
                  </motion.div>
                  <motion.div
                    className="bg-gray-800/50 backdrop-blur-sm border border-pink-500/30 rounded-lg px-4 sm:px-6 py-3 hover:border-pink-500/60 hover:shadow-lg hover:shadow-pink-500/20 transition-all cursor-pointer"
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-xl sm:text-2xl font-bold text-pink-400">24/7</div>
                    <div className="text-xs sm:text-sm text-gray-400">Support</div>
                  </motion.div>
                </motion.div>

                {/* Enhanced CTA Buttons */}
                <motion.div
                  className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 25px 50px rgba(6, 182, 212, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/games"
                      className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-lg text-base sm:text-lg transition-all transform flex items-center gap-2 shadow-lg"
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FaGamepad className="text-xl sm:text-2xl" />
                      </motion.div>
                      START GAMING
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <FaChevronRight className="transition-transform" />
                      </motion.div>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 25px 50px rgba(255, 255, 255, 0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/signup"
                      className="bg-transparent hover:bg-white/10 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 border-2 border-white/50 hover:border-white rounded-lg text-base sm:text-lg transition-all flex items-center gap-2"
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <FaTrophy className="text-yellow-400" />
                      </motion.div>
                      JOIN NOW
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Corner Tech Elements with Parallax */}
            <motion.div
              className="absolute top-0 left-0 w-48 h-48 border-t-4 border-l-4 border-cyan-500 opacity-30"
              style={{ y: particlesY }}
            >
              <div className="absolute top-4 left-4 w-4 h-4 bg-cyan-500 rounded-full animate-ping"></div>
            </motion.div>
            <motion.div
              className="absolute top-0 right-0 w-48 h-48 border-t-4 border-r-4 border-purple-500 opacity-30"
              style={{ y: particlesY }}
            >
              <div className="absolute top-4 right-4 w-4 h-4 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 w-48 h-48 border-b-4 border-l-4 border-pink-500 opacity-30"
              style={{ y: particlesY }}
            >
              <div className="absolute bottom-4 left-4 w-4 h-4 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-0 w-48 h-48 border-b-4 border-r-4 border-red-500 opacity-30"
              style={{ y: particlesY }}
            >
              <div className="absolute bottom-4 right-4 w-4 h-4 bg-red-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
            </motion.div>
          </section>

          <style>{`
          @keyframes slideRight {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
          }
          @keyframes slideLeft {
            0%, 100% { transform: translateX(100%); }
            50% { transform: translateX(-100%); }
          }
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) translateX(0px);
              opacity: 0.4;
            }
            25% {
              transform: translateY(-20px) translateX(10px);
              opacity: 0.6;
            }
            50% { 
              transform: translateY(-40px) translateX(-10px);
              opacity: 0.8;
            }
            75% {
              transform: translateY(-20px) translateX(-15px);
              opacity: 0.6;
            }
          }
        `}</style>

          {/* Featured Games */}
          <motion.section
            ref={featuredRef}
            className="py-16 bg-gray-900 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Section background effects */}
            <motion.div
              className="absolute inset-0 opacity-5"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)"
                ]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            <div className="container mx-auto px-4 relative z-10">
              <div className="flex justify-between items-center mb-8">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold mb-6 text-white font-heading border-b border-gray-700 pb-2"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    textShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                  }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Featured Games</span>
                </motion.h2>
                <motion.div variants={itemVariants}>
                  <Link to="/games" className="text-blue-400 hover:text-blue-300 flex items-center group">
                    View All <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
              >
                {featuredGames.map((game, index) => (
                  <GameCard key={game.id} game={game} index={index} />
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Game Categories */}
          <motion.section
            ref={categoriesRef}
            className="py-16 bg-gray-800"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="container mx-auto px-4">
              <motion.h2
                className="text-2xl md:text-3xl font-bold mb-6 text-white font-heading border-b border-gray-700 pb-2"
                variants={itemVariants}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Game Categories</span>
              </motion.h2>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
                variants={containerVariants}
              >
                {gameCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 15,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Link
                      to="/games"
                      className="bg-gray-700 hover:bg-gray-600 rounded-lg p-6 text-center transition-all duration-300 group block relative overflow-hidden"
                    >
                      {/* Animated background gradient */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={{
                          background: [
                            "linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))",
                            "linear-gradient(225deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.1))",
                            "linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))"
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />

                      <motion.span
                        className="text-3xl mb-2 inline-block relative z-10"
                        animate={{
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      >
                        {category.icon}
                      </motion.span>
                      <motion.h3
                        className="font-bold text-lg relative z-10"
                        animate={{
                          textShadow: [
                            "0 0 0px rgba(255,255,255,0)",
                            "0 0 10px rgba(255,255,255,0.5)",
                            "0 0 0px rgba(255,255,255,0)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      >
                        {category.name}
                      </motion.h3>
                      <motion.p
                        className="text-gray-400 text-sm relative z-10"
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: index * 0.1,
                        }}
                      >
                        {category.count} Games
                      </motion.p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Upcoming Releases */}
          <motion.section
            ref={upcomingRef}
            className="py-16 bg-gray-900"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold mb-6 text-white font-heading border-b border-gray-700 pb-2"
                  variants={itemVariants}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Upcoming Releases</span>
                </motion.h2>
                <motion.div variants={itemVariants}>
                  <Link to="/upcoming" className="text-blue-400 hover:text-blue-300 flex items-center group">
                    View All <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                {upcomingGames.slice(0, 3).map((game, index) => (
                  <motion.div
                    key={game.id}
                    className="bg-gray-800 rounded-xl overflow-hidden group cursor-pointer"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    style={{ transformOrigin: 'center' }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-700"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                      {/* Countdown Badge */}
                      <motion.div
                        className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                        animate={{
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            "0 0 0px rgba(249, 115, 22, 0.5)",
                            "0 0 20px rgba(249, 115, 22, 0.8)",
                            "0 0 0px rgba(249, 115, 22, 0.5)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {daysUntilRelease(game.releaseDate)} days
                      </motion.div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <motion.div
                          className="flex justify-between items-end"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <div>
                            <motion.h3
                              className="text-xl font-bold text-white mb-1"
                              animate={{
                                textShadow: [
                                  "0 0 0px rgba(255,255,255,0)",
                                  "0 0 5px rgba(255,255,255,0.3)",
                                  "0 0 0px rgba(255,255,255,0)"
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {game.title}
                            </motion.h3>
                            <p className="text-gray-300">{game.genre}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-yellow-400 flex items-center justify-end mb-1">
                              <FaStar className="mr-1" />
                              <span>{game.rating}/5.0</span>
                            </div>
                            <motion.div
                              className="text-sm text-gray-400"
                              animate={{
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: index * 0.3,
                              }}
                            >
                              {daysUntilRelease(game.releaseDate)} days to go
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                    <motion.div
                      className="p-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.3 }}
                    >
                      <motion.div
                        className="flex justify-between items-center"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div>
                          {game.discount ? (
                            <div className="flex items-center">
                              <span className="text-gray-400 line-through mr-2">₹{game.price}</span>
                              <span className="text-white font-bold">
                                ₹{(game.price * (100 - game.discount) / 100).toFixed(2)}
                              </span>
                              <motion.span
                                className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded ml-2"
                                animate={{
                                  backgroundColor: [
                                    "rgb(220, 38, 38)",
                                    "rgb(239, 68, 68)",
                                    "rgb(220, 38, 38)"
                                  ]
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                -{game.discount}%
                              </motion.span>
                            </div>
                          ) : (
                            <span className="text-white font-bold">₹{game.price}</span>
                          )}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            to={`/game/${game.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all shadow-lg hover:shadow-blue-500/25"
                          >
                            Pre-order Now
                          </Link>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            ref={ctaRef}
            className="py-20 bg-gradient-to-r from-blue-900 to-purple-900"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div
              className="text-center py-16 px-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mx-4 md:mx-0 relative overflow-hidden"
              variants={itemVariants}
            >
              {/* Animated background elements */}
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-white font-heading relative z-10"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-[length:200%_auto]">
                  Ready to Start Gaming?
                </span>
              </motion.h2>

              <motion.p
                className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed relative z-10"
                variants={itemVariants}
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Join thousands of gamers and discover your next favorite game today. Experience the best in gaming with exclusive deals and early access to new releases.
              </motion.p>

              <motion.div
                className="flex flex-wrap justify-center gap-4 relative z-10"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <Link
                    to="/signup"
                    className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl group relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                    <span className="relative z-10">Create Free Account</span>
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link
                    to="/games"
                    className="bg-transparent hover:bg-white/10 text-white font-bold py-4 px-10 border-2 border-white/50 hover:border-white rounded-full text-lg transition-all shadow-lg hover:shadow-xl group relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="relative z-10">Browse Games</span>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-8 flex flex-wrap justify-center gap-6 text-gray-300 text-sm relative z-10"
                variants={containerVariants}
              >
                {[
                  { icon: '🎮', text: '1000+ Games', color: 'green' },
                  { icon: '🏢', text: '50+ Publishers', color: 'blue' },
                  { icon: '🕒', text: '24/7 Support', color: 'purple' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center"
                    variants={itemVariants}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    <motion.div
                      className={`bg-${stat.color}-500 w-3 h-3 rounded-full mr-2`}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                    <span>{stat.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Floating particles around CTA */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full pointer-events-none"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${10 + (i % 3) * 30}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
