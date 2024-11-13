import { useEffect, useRef, useCallback } from 'react';
import { Content } from '../types/content';

const PRELOAD_AHEAD = 20;  
const PRELOAD_BEHIND = 5;
const LOAD_MORE_THRESHOLD = 15;
const PRELOAD_BATCH_SIZE = 8;
const PRELOAD_DELAY = 30;  

export const useContentPreload = (
  contents: Content[],
  focusedIndex: number,
  onLoadMore?: () => void,
  hasMoreContent?: boolean
) => {
  const preloadedImages = useRef<Set<number>>(new Set());
  const isLoadingMore = useRef(false);
  const loadMoreTimeout = useRef<NodeJS.Timeout>();
  const preloadQueue = useRef<number[]>([]);
  const abortController = useRef<AbortController>(new AbortController());

  const preloadImage = useCallback((content: Content, index: number): Promise<void> => {
    if (!preloadedImages.current.has(index) && content?.images?.artwork_portrait) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          preloadedImages.current.add(index);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = content.images.artwork_portrait;
      });
    }
    return Promise.resolve();
  }, []);

  const processPreloadQueue = useCallback(async () => {
    if (preloadQueue.current.length === 0) return;

    const signal = abortController.current.signal;
    
    try {
      while (preloadQueue.current.length > 0 && !signal.aborted) {
        const batch = preloadQueue.current.splice(0, PRELOAD_BATCH_SIZE);
        await Promise.all(
          batch.map(index => {
            if (index >= 0 && index < contents.length) {
              return preloadImage(contents[index], index);
            }
            return Promise.resolve();
          })
        );
        await new Promise(resolve => setTimeout(resolve, PRELOAD_DELAY));
      }
    } catch (error) {
      //@ts-ignore
      if (error.name === 'AbortError') return;
      console.error('Error processing preload queue:', error);
    }
  }, [contents, preloadImage]);

  const preloadChunk = useCallback((startIndex: number, endIndex: number, priority = false) => {
    const indices = Array.from(
      { length: endIndex - startIndex },
      (_, i) => startIndex + i
    ).filter(index => !preloadedImages.current.has(index));

    if (priority) {
      preloadQueue.current.unshift(...indices);
    } else {
      preloadQueue.current.push(...indices);
    }

    requestIdleCallback(() => processPreloadQueue());
  }, [processPreloadQueue]);

  useEffect(() => {
    abortController.current.abort();
    abortController.current = new AbortController();

    const preloadStart = Math.max(0, focusedIndex - PRELOAD_BEHIND);
    const preloadEnd = Math.min(contents.length, focusedIndex + PRELOAD_AHEAD);
    
    const immediatePriorityStart = Math.max(0, focusedIndex - 2);
    const immediatePriorityEnd = Math.min(contents.length, focusedIndex + 5);
    preloadChunk(immediatePriorityStart, immediatePriorityEnd, true);
    
    preloadChunk(preloadStart, preloadEnd);

    if (onLoadMore && hasMoreContent && !isLoadingMore.current) {
      const remainingItems = contents.length - (focusedIndex + 1);
      
      if (remainingItems <= LOAD_MORE_THRESHOLD) {
        isLoadingMore.current = true;
        
        if (loadMoreTimeout.current) {
          clearTimeout(loadMoreTimeout.current);
        }
        
        loadMoreTimeout.current = setTimeout(() => {
          onLoadMore();
          isLoadingMore.current = false;
        }, 50); 
      }
    }

    return () => {
      if (loadMoreTimeout.current) {
        clearTimeout(loadMoreTimeout.current);
      }
      abortController.current.abort();
    };
  }, [focusedIndex, contents, preloadChunk, onLoadMore, hasMoreContent]);

  useEffect(() => {
    if (contents.length > 0) {
      const initialPreloadEnd = Math.min(contents.length, PRELOAD_AHEAD * 2);
      preloadChunk(0, initialPreloadEnd, true);
    }
  }, [contents.length, preloadChunk]);

  return {
    isPreloaded: (index: number) => preloadedImages.current.has(index)
  };
};