import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setTransitioning } from '../store/contentSlice';
import ContentCard from './ContentCard';
import ContentPopup from './ContentPopup';
import { Content } from '../types/content';
import { useContentPreload } from '../hooks/useContentPreload';

interface ContentListProps {
  contents: Content[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMoreContent?: boolean;
  focusedIndex: number;
  onFocusChange: (index: number) => void;
  className?: string;
}

const ITEM_WIDTH = 192;
const ITEM_GAP = 16;
const LEFT_PADDING = 32;

const ContentList: React.FC<ContentListProps> = ({
  contents,
  isLoading,
  onLoadMore = () => {},
  hasMoreContent = false,
  focusedIndex,
  onFocusChange,
  className = ''
}) => {
  const dispatch = useDispatch();
  const [selectedContent, setSelectedContent] = useState<number | null>(null);
  const { isPreloaded } = useContentPreload(contents, focusedIndex, onLoadMore, hasMoreContent);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedContent !== null) return;
    
    if (e.key === 'ArrowLeft' && focusedIndex > 0) {
      onFocusChange(focusedIndex - 1);
      dispatch(setTransitioning(true));
    } else if (e.key === 'ArrowRight' && focusedIndex < contents.length - 1) {
      onFocusChange(focusedIndex + 1);
      dispatch(setTransitioning(true));
    } else if (e.key === 'Enter') {
      setSelectedContent(focusedIndex);
    }
  }, [dispatch, focusedIndex, selectedContent, contents.length, onFocusChange]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading && contents.length === 0) {
    return (
      <div className="flex items-center justify-center h-72" data-testid="loading">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className={`h-72 flex flex-col items-center justify-center text-white ${className}`} data-testid="empty-state">
        <p className="text-gray-400">No items in this list yet</p>
      </div>
    );
  }

  // Calculate the translation to keep the focused item at LEFT_PADDING position
  const translateX = -focusedIndex * (ITEM_WIDTH + ITEM_GAP) + LEFT_PADDING;

  return (
    <div className={className}>
      <div className="relative h-72 flex items-center overflow-hidden" data-testid="content-list">
        <div 
          className="flex space-x-4 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {contents.map((content, index) => (
            <ContentCard
              key={`${content.id}-${content.title}`}
              content={content}
              index={index}
              isFocused={index === focusedIndex}
              onSelect={() => {
                if (index === focusedIndex) {
                  setSelectedContent(index);
                } else {
                  onFocusChange(index);
                  dispatch(setTransitioning(true));
                }
              }}
              onFocus={() => {
                onFocusChange(index);
                dispatch(setTransitioning(true));
              }}
              isPreloaded={isPreloaded(index)}
            />
          ))}
        </div>

        {focusedIndex > 0 && (
          <button
            onClick={() => {
              onFocusChange(0);
              dispatch(setTransitioning(true));
            }}
            className="absolute bottom-4 right-8 px-6 py-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-200 backdrop-blur-sm flex items-center gap-2"
            aria-label="Go to first item"
            data-testid="first-item-button"
          >
            <span className="text-white font-medium">First Movie</span>
          </button>
        )}
      </div>

      {selectedContent !== null && contents[selectedContent] && (
        <ContentPopup
          content={contents[selectedContent]}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </div>
  );
};

export default ContentList;