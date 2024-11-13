import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './contentSlice';
import favoritesReducer from './favoritesSlice';
import { api } from '../services/api';

export const store = configureStore({
  reducer: {
    content: contentReducer,
    favorites: favoritesReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;