export interface Content {
  id: number;
  title: string;
  original_title: string;
  synopsis: string;
  year: number;
  images: {
    artwork_portrait: string;
  };
}

export interface ContentState {
  items: Content[];
  focusedIndex: number;
  isTransitioning: boolean;
  currentPage: number;
  totalPages: number;
  isLoadingMore: boolean;
}