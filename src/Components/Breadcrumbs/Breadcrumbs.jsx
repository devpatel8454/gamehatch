import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Parse pathname into breadcrumb items
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Map route names to display names
  const routeNameMap = {
    'home': 'Home',
    'games': 'Games',
    'wishlist': 'Wishlist',
    'cart': 'Cart',
    'checkout': 'Checkout',
    'profile': 'Profile',
    'reviews': 'Reviews',
    'admin': 'Admin Dashboard'
  };

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'home')) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {/* Home Link */}
        <motion.li
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <Link
            to="/"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
            aria-label="Home"
          >
            <FaHome className="text-base" />
          </Link>
        </motion.li>

        {/* Dynamic Breadcrumb Items */}
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeNameMap[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <motion.li
              key={routeTo}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <FaChevronRight className="text-gray-600 text-xs" aria-hidden="true" />
              {isLast ? (
                <span className="text-white font-medium" aria-current="page">
                  {displayName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {displayName}
                </Link>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
