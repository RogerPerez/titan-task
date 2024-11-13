import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import contentReducer, {
  moveFocus,
  setFocusedIndex,
  setTransitioning,
  setItems,
  appendItems,
  setCurrentPage,
  setTotalPages,
  setLoadingMore,
  resetState
} from '../../store/contentSlice';

const mockContent = {
  id: 1,
  title: 'Test Movie',
  original_title: 'Test Movie',
  synopsis: 'Test synopsis',
  year: 2024,
  images: { artwork_portrait: 'test-image-url' }
};

describe('contentSlice', () => {
  let store: ReturnType<typeof configureStore>;
  
  beforeEach(() => {
    store = configureStore({
      reducer: {
        content: contentReducer
      }
    });
  });

  it('handles moveFocus action', () => {
    store.dispatch(setItems([mockContent, mockContent]));
    store.dispatch(moveFocus('right'));
    expect(store.getState().content.focusedIndex).toBe(1);
    store.dispatch(moveFocus('left'));
    expect(store.getState().content.focusedIndex).toBe(0);
  });

  it('handles setFocusedIndex action', () => {
    store.dispatch(setFocusedIndex(5));
    expect(store.getState().content.focusedIndex).toBe(5);
  });

  it('handles setTransitioning action', () => {
    store.dispatch(setTransitioning(true));
    expect(store.getState().content.isTransitioning).toBe(true);
  });

  it('handles setItems action', () => {
    store.dispatch(setItems([mockContent]));
    expect(store.getState().content.items).toHaveLength(1);
    expect(store.getState().content.focusedIndex).toBe(0);
  });

  it('handles appendItems action', () => {
    store.dispatch(setItems([mockContent]));
    store.dispatch(appendItems([{ ...mockContent, id: 2 }]));
    expect(store.getState().content.items).toHaveLength(2);
  });

  it('handles pagination actions', () => {
    store.dispatch(setCurrentPage(2));
    expect(store.getState().content.currentPage).toBe(2);

    store.dispatch(setTotalPages(5));
    expect(store.getState().content.totalPages).toBe(5);

    store.dispatch(setLoadingMore(true));
    expect(store.getState().content.isLoadingMore).toBe(true);
  });

  it('handles resetState action', () => {
    store.dispatch(setItems([mockContent]));
    store.dispatch(setCurrentPage(2));
    store.dispatch(setTotalPages(5));
    store.dispatch(setLoadingMore(true));
    store.dispatch(setFocusedIndex(3));

    store.dispatch(resetState());

    const state = store.getState().content;
    expect(state.items).toHaveLength(0);
    expect(state.focusedIndex).toBe(0);
    expect(state.currentPage).toBe(1);
    expect(state.totalPages).toBe(1);
    expect(state.isLoadingMore).toBe(false);
    expect(state.isTransitioning).toBe(false);
  });
});