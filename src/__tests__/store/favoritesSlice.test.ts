import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer, { toggleFavorite } from '../../store/favoritesSlice';

const mockContent = {
  id: 1,
  title: 'Test Movie',
  original_title: 'Test Movie',
  synopsis: 'Test synopsis',
  year: 2024,
  images: { artwork_portrait: 'test-image-url' }
};

describe('favoritesSlice', () => {
  let store: ReturnType<typeof configureStore>;
  
  beforeEach(() => {
    localStorage.clear();
    store = configureStore({
      reducer: {
        favorites: favoritesReducer
      }
    });
  });

  it('adds item to favorites', () => {
    store.dispatch(toggleFavorite(mockContent));
    expect(store.getState().favorites.items).toHaveLength(1);
    expect(store.getState().favorites.items[0]).toEqual(mockContent);
  });

  it('removes item from favorites', () => {
    store.dispatch(toggleFavorite(mockContent));
    store.dispatch(toggleFavorite(mockContent));
    expect(store.getState().favorites.items).toHaveLength(0);
  });


});