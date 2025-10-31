import { FaCalendarAlt, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NewsCard = ({ news }) => {
  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to handle image URLs
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === undefined || imageUrl === null || imageUrl === '') {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    }

    // If it's already a full URL (http/https), use it directly
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If it's a relative path from backend, construct full URL
    if (imageUrl.startsWith('/')) {
      // Handle paths like /uploads/filename with spaces
      if (imageUrl.startsWith('/uploads/')) {
        const filename = imageUrl.substring('/uploads/'.length);
        return `https://localhost:7270/uploads/${encodeURIComponent(filename)}`;
      } else {
        // For other relative paths, encode the entire path
        return `https://localhost:7270${encodeURIComponent(imageUrl)}`;
      }
    }

    // If it's just a filename/path, assume it's from backend uploads
    return `https://localhost:7270/uploads/${imageUrl}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(news.image)}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            console.error('News image failed to load:', news.image, '->', e.target.src);
            // Prevent infinite error loops - only set placeholder if not already a data URL
            if (e.target.src.includes('data:image')) return;

            // Use data URL placeholder as final fallback
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDQ1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
          }}
          onLoad={(e) => {
            console.log('News image loaded successfully:', e.target.src);
          }}
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
          {news.category}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-gray-400 text-sm mb-3">
          <FaCalendarAlt className="mr-2" />
          <span>{formatDate(news.date)}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
          {news.title}
        </h3>

        <p className="text-gray-300 mb-4 flex-grow line-clamp-3">
          {news.excerpt}
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center text-sm text-blue-400">
            <FaTag className="mr-1" />
            <span>{news.category}</span>
          </div>

          <Link
            to={`/news/${news.id}`}
            className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center"
          >
            Read More
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
