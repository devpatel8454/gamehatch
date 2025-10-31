import { useCallback, useEffect, useState } from "react";
import { useLazyGetQuery } from "../../Redux/Slice/Api";
import { propertyType } from "../../tagTypes";
import ProductCard from "../Product/Productcard";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../Context/Authcontext";
import { motion } from "framer-motion";

function Ourproducts() {
  const { token, searchValue } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [getProducts, { isLoading: isProductsLoading, isFetching: isProductsFetching }] =
    useLazyGetQuery();

  const handleGetProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API first
      try {
        const response = await getProducts({
          endpoint: `fakestoreapi.com/products`,
          tags: [propertyType.GET_PRODUCTS],
        });

        if (response?.data?.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
          return;
        }
      } catch (apiError) {
        console.log('API failed, using mock data');
      }

      // Always set mock data as reliable fallback
      setProducts([
        {
          id: 1,
          title: "Gaming Mouse",
          price: 59.99,
          category: "electronics",
          image: "https://via.placeholder.com/300x300/4f46e5/ffffff?text=Gaming+Mouse",
          rating: { rate: 4.5, count: 120 },
          description: "High-precision gaming mouse with RGB lighting and ergonomic design"
        },
        {
          id: 2,
          title: "Mechanical Keyboard",
          price: 129.99,
          category: "electronics",
          image: "https://via.placeholder.com/300x300/10b981/ffffff?text=Keyboard",
          rating: { rate: 4.8, count: 89 },
          description: "RGB mechanical keyboard with blue switches and customizable keys"
        },
        {
          id: 3,
          title: "Gaming Headset",
          price: 89.99,
          category: "electronics",
          image: "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Headset",
          rating: { rate: 4.3, count: 156 },
          description: "Surround sound gaming headset with noise-cancelling microphone"
        },
        {
          id: 4,
          title: "Gaming Monitor",
          price: 299.99,
          category: "electronics",
          image: "https://via.placeholder.com/300x300/f59e0b/ffffff?text=Monitor",
          rating: { rate: 4.7, count: 203 },
          description: "144Hz gaming monitor with 1ms response time and HDR support"
        },
        {
          id: 5,
          title: "Gaming Chair",
          price: 199.99,
          category: "furniture",
          image: "https://via.placeholder.com/300x300/ef4444/ffffff?text=Gaming+Chair",
          rating: { rate: 4.4, count: 78 },
          description: "Ergonomic gaming chair with lumbar support and adjustable armrests"
        },
        {
          id: 6,
          title: "Graphics Card",
          price: 499.99,
          category: "electronics",
          image: "https://via.placeholder.com/300x300/06b6d4/ffffff?text=GPU",
          rating: { rate: 4.9, count: 145 },
          description: "High-performance graphics card for smooth 4K gaming"
        }
      ]);

    } catch (error) {
      console.error('Error in handleGetProducts:', error);
      setError('Failed to load products');

      // Always set mock data even on error
      setProducts([
        {
          id: 1,
          title: "Gaming Mouse",
          price: 59.99,
          category: "electronics",
          image: "https://via.placeholder.com/300x300/4f46e5/ffffff?text=Gaming+Mouse",
          rating: { rate: 4.5, count: 120 },
          description: "High-precision gaming mouse with RGB lighting"
        },
        {
          id: 2,
          title: "Mechanical Keyboard",
          price: 129.99,
          category: "electronics",
          image: "https://via.placeholder.com/300x300/10b981/ffffff?text=Keyboard",
          rating: { rate: 4.8, count: 89 },
          description: "RGB mechanical keyboard with blue switches"
        },
        {
          id: 3,
          title: "Gaming Headset",
          price: 89.99,
          category: "electronics",
          image: "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Headset",
          rating: { rate: 4.3, count: 156 },
          description: "Surround sound gaming headset with microphone"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [getProducts]);

  useEffect(() => {
    handleGetProducts();
  }, [handleGetProducts]);

  // Filter products based on search and maintain the filtered list
  useEffect(() => {
    if (!products.length) return;

    let filtered = [...products];

    // Apply search filter - more flexible search
    if (searchValue && searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim();

      filtered = filtered.filter(product => {
        // Search in title (most important)
        if (product.title?.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Search in description
        if (product.description?.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Search in category
        if (product.category?.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Partial word matching for more flexible search
        const titleWords = product.title?.toLowerCase().split(' ') || [];
        const searchWords = searchLower.split(' ');

        return searchWords.some(searchWord =>
          titleWords.some(titleWord => titleWord.includes(searchWord))
        );
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchValue]);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="flex flex-col justify-center items-center mt-3 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {loading || isProductsLoading || isProductsFetching ? (
        <div className="h-64 flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={handleGetProducts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="w-full max-w-4xl mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {searchValue ? `Search Results for "${searchValue}"` : 'Explore our products'}
            </h2>
            <p className="text-gray-400">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              {searchValue && ` matching "${searchValue}"`}
            </p>
          </div>

          {/* Products Grid */}
          <div className="flex flex-wrap gap-4 p-3 justify-center w-full max-w-6xl">
            {filteredProducts.length === 0 ? (
              <motion.div
                className="text-center py-12 col-span-full"
                variants={itemVariants}
              >
                <p className="text-gray-400 text-lg mb-2">No products found</p>
                <p className="text-gray-500">
                  {searchValue ? `Try searching for something else` : 'Products will appear here'}
                </p>
              </motion.div>
            ) : (
              filteredProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <ProductCard product={item} />
                </motion.div>
              ))
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default Ourproducts;
