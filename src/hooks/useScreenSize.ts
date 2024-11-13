import { useState, useEffect } from 'react';

export const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getVisibleItems = () => {
    if (screenWidth >= 2560) return 24; // 4K screens
    if (screenWidth >= 1920) return 18; // Full HD
    if (screenWidth >= 1440) return 14; // Laptop L
    if (screenWidth >= 1024) return 10; // Laptop
    if (screenWidth >= 768) return 8;   // Tablet
    return 6;                           // Mobile
  };

  const getPreloadItems = () => {
    if (screenWidth >= 2560) return 12;
    if (screenWidth >= 1920) return 10;
    if (screenWidth >= 1440) return 8;
    if (screenWidth >= 1024) return 6;
    return 4;
  };

  return {
    screenWidth,
    visibleItems: getVisibleItems(),
    preloadItems: getPreloadItems()
  };
};