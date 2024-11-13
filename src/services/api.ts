import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Content } from '../types/content';

interface ApiResponse {
  collection: Content[];
  pagination: {
    count: number;
    per_page: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_count: number;
    total_pages: number;
  };
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://acc01.titanos.tv/v1/',
    cache: 'no-store'
  }),
  endpoints: (builder) => ({
    getContents: builder.query<ApiResponse, { page: number; perPage: number }>({
      query: ({ page, perPage }) => 
        `genres/14/contents?market=es&device=tv&locale=es&page=${page}&per_page=${perPage}`,
      keepUnusedDataFor: 0,
      merge(currentCache, newItems) {
        if (!currentCache) return newItems;
        return {
          ...newItems,
          collection: [...currentCache.collection, ...newItems.collection].filter(
            (item, index, self) => index === self.findIndex((t) => t.id === item.id)
          )
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      }
    }),
  }),
});

export const { useGetContentsQuery } = api;