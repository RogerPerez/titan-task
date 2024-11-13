import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Content } from '../types/content';

interface FavoritesState {
  items: Content[];
}

// Load favorites from localStorage
const loadFavorites = (): Content[] => {
  try {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: FavoritesState = {
  items: loadFavorites()
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Content>) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      // Save to localStorage
      try {
        localStorage.setItem('favorites', JSON.stringify(state.items));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }
    }
  }
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;