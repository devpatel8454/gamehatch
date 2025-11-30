import { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className, fallback, onError }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef();

  const defaultFallback = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center";

  useEffect(() => {
    let observer;

    if (imgRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before image enters viewport
        }
      );

      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const handleError = (e) => {
    setImageError(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      ref={imgRef}
      src={imageError ? (fallback || defaultFallback) : (imageSrc || '')}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      style={{
        backgroundColor: imageSrc ? 'transparent' : '#374151', // gray-700
        minHeight: imageSrc ? 'auto' : '192px', // h-48
      }}
    />
  );
};

export default LazyImage;
