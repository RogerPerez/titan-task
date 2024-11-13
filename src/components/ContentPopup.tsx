import React, { useEffect, useCallback } from 'react';
import { Content } from '../types/content';
import { X } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface ContentPopupProps {
  content: Content;
  onClose: () => void;
}

const ContentPopup: React.FC<ContentPopupProps> = ({ content, onClose }) => {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div 
        className="relative bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          <div className="w-1/3 relative">
            <img
              src={content.images.artwork_portrait}
              alt={content.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>

          <div className="w-2/3 p-8 overflow-y-auto scrollbar-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h2 id="dialog-title" className="text-4xl font-bold text-white">{content.title}</h2>
                {content.original_title !== content.title && (
                  <h3 className="text-xl text-gray-400 mt-2">{content.original_title}</h3>
                )}
                <p className="text-lg text-gray-300 mt-2">{content.year}</p>
              </div>
              <div className="flex gap-4">
                <FavoriteButton content={content} />
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white/80" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white">Synopsis</h4>
              <p className="text-gray-300 leading-relaxed">{content.synopsis}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPopup;