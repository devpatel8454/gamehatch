import { useEffect } from 'react';

const SEO = ({ 
  title = 'GameHatch - Your Ultimate Gaming Platform',
  description = 'Discover, download, and play the best games. Browse our extensive collection of games across all genres.',
  keywords = 'games, gaming, download games, buy games, game store, pc games, video games',
  author = 'GameHatch',
  ogImage = '/images/og-image.png',
  ogUrl = window.location.href,
  twitterCard = 'summary_large_image'
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('robots', 'index, follow');

    // Open Graph meta tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', ogUrl, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'GameHatch', true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Additional SEO tags
    updateMetaTag('theme-color', '#1f2937'); // gray-800
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');

  }, [title, description, keywords, author, ogImage, ogUrl, twitterCard]);

  return null;
};

export default SEO;
