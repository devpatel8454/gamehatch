const GameCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-700"></div>

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title */}
        <div className="h-6 bg-gray-700 rounded mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>

        {/* Category */}
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-700 rounded w-16"></div>
          <div className="h-4 bg-gray-700 rounded w-20"></div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <div className="flex-1 h-10 bg-gray-700 rounded"></div>
          <div className="flex-1 h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default GameCardSkeleton;
