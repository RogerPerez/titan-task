import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Content } from '../types/content';

interface ContentState {
  items: Content[];
  focusedIndex: number;
  isTransitioning: boolean;
  currentPage: number;
  totalPages: number;
  isLoadingMore: boolean;
}

const initialState: ContentState = {
  items: [],
  focusedIndex: 0,
  isTransitioning: false,
  currentPage: 1,
  totalPages: 1,
  isLoadingMore: false
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    moveFocus: (state, action: PayloadAction<'left' | 'right'>) => {
      const direction = action.payload;
      if (direction === 'left' && state.focusedIndex > 0) {
        state.focusedIndex -= 1;
        state.isTransitioning = true;
      } else if (direction === 'right' && state.focusedIndex < state.items.length - 1) {
        state.focusedIndex += 1;
        state.isTransitioning = true;
      }
    },
    setFocusedIndex: (state, action: PayloadAction<number>) => {
      state.focusedIndex = action.payload;
      state.isTransitioning = true;
    },
    setTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isTransitioning = action.payload;
    },
    setItems: (state, action: PayloadAction<Content[]>) => {
      state.items = action.payload;
      state.focusedIndex = 0;
    },
    appendItems: (state, action: PayloadAction<Content[]>) => {
      const newItems = action.payload.filter(
        newItem => !state.items.some(existingItem => existingItem.id === newItem.id)
      );
      state.items = [...state.items, ...newItems];
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMore = action.payload;
    },
    resetState: (state) => {
      state.items = [];
      state.focusedIndex = 0;
      state.isTransitioning = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.isLoadingMore = false;
    }
  }
});

export const {
  moveFocus,
  setFocusedIndex,
  setTransitioning,
  setItems,
  appendItems,
  setCurrentPage,
  setTotalPages,
  setLoadingMore,
  resetState
} = contentSlice.actions;

export default contentSlice.reducer;