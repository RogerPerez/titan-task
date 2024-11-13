import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Navigation = () => {
  const location = useLocation();
  const favoritesCount = useSelector((state: RootState) => state.favorites.items.length);

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 p-2 rounded-full bg-gray-800/80 backdrop-blur-sm">
      <Link
        to="/"
        className={`p-3 rounded-full transition-colors duration-200 ${
          location.pathname === '/' ? 'bg-white/20' : 'hover:bg-white/10'
        }`}
        aria-label="Home"
      >
        <Home className="w-6 h-6 text-white" />
      </Link>
      <Link
        to="/favorites"
        className={`p-3 rounded-full transition-colors duration-200 relative ${
          location.pathname === '/favorites' ? 'bg-white/20' : 'hover:bg-white/10'
        }`}
        aria-label="Favorites"
      >
        <Heart className="w-6 h-6 text-white" />
        {favoritesCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {favoritesCount}
          </span>
        )}
      </Link>
    </nav>
  );
};

export default Navigation;