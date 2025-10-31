import { useState, Link, useLocation } from 'react-router-dom';
import { FaGamepad, FaBars, FaTimes } from 'react-icons/fa';

const DynamicGameNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-1">
        <Link
          to="/games"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isActive('/games')
              ? 'bg-cyan-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <FaGamepad />
          Games
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-300 hover:text-white"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-lg md:hidden z-50">
          <div className="p-4 space-y-2">
            <Link
              to="/games"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/games')
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <FaGamepad />
              Games
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicGameNavigation;
