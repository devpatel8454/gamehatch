import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../Context/ThemeContext';
import Tooltip from '../Tooltip/Tooltip';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tooltip content={`Switch to ${isDark ? 'light' : 'dark'} mode`} position="bottom">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="relative w-16 h-8 bg-gray-700 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Track */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            backgroundColor: isDark ? '#374151' : '#FCD34D'
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Slider */}
        <motion.div
          className="relative w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
          animate={{
            x: isDark ? 32 : 0
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {isDark ? (
            <FaMoon className="text-gray-800 text-xs" />
          ) : (
            <FaSun className="text-yellow-500 text-xs" />
          )}
        </motion.div>
      </motion.button>
    </Tooltip>
  );
};

export default ThemeToggle;
