import React from 'react';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/favoritesSlice';
import { Content } from '../types/content';
import { RootState } from '../store/store';

interface FavoriteButtonProps {
  content: Content;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ content, className = '' }) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector((state: RootState) => 
    state.favorites.items.some(item => item.id === content.id)
  );

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        dispatch(toggleFavorite(content));
      }}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isFavorite 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-gray-800/80 text-white hover:bg-gray-700/80'
      } ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
};

export default FavoriteButton;