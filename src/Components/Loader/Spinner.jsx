import { motion } from 'framer-motion';

const Spinner = ({ size = 'md', color = 'red' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colorClasses = {
    red: 'border-red-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[color]} border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4"
      >
        <Spinner size="xl" color="red" />
        <p className="text-white text-lg font-medium">{message}</p>
      </motion.div>
    </div>
  );
};

export default Spinner;
