import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import ContentList from "../components/ContentList";
import { useGetContentsQuery } from "../services/api";
import {
  setFocusedIndex,
  setItems,
  appendItems,
  setTotalPages,
  setCurrentPage,
  setLoadingMore,
} from "../store/contentSlice";

const ITEMS_PER_PAGE = 20;
const PREFETCH_THRESHOLD = 15;

const MoviesPage = () => {
  const dispatch = useDispatch();
  const {
    focusedIndex,
    items: contents,
    currentPage,
    totalPages,
    isLoadingMore,
  } = useSelector((state: RootState) => state.content);

  const { data, isLoading, isFetching } = useGetContentsQuery(
    { page: currentPage, perPage: ITEMS_PER_PAGE },
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 0,
    }
  );

  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages && !isLoadingMore && !isFetching) {
      dispatch(setLoadingMore(true));
      dispatch(setCurrentPage(currentPage + 1));
    }
  }, [currentPage, totalPages, isLoadingMore, isFetching, dispatch]);

  useEffect(() => {
    if (data) {
      if (currentPage === 1) {
        dispatch(setItems(data.collection));
      } else {
        dispatch(appendItems(data.collection));
      }
      dispatch(setTotalPages(data.pagination.total_pages));
      dispatch(setLoadingMore(false));
    }
  }, [data, currentPage, dispatch]);

  useEffect(() => {
    if (contents.length > 0 && !isLoadingMore && !isFetching) {
      const remainingItems = contents.length - (focusedIndex + 1);
      if (remainingItems <= PREFETCH_THRESHOLD) {
        handleLoadMore();
      }
    }
  }, [
    focusedIndex,
    contents.length,
    handleLoadMore,
    isLoadingMore,
    isFetching,
  ]);

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <h2 className="text-2xl font-bold text-white px-8 mb-6">Movies</h2>
      <ContentList
        contents={contents}
        isLoading={isLoading && contents.length === 0}
        onLoadMore={handleLoadMore}
        hasMoreContent={currentPage < totalPages}
        focusedIndex={focusedIndex}
        onFocusChange={(index) => dispatch(setFocusedIndex(index))}
      />
    </div>
  );
};

export default MoviesPage;
