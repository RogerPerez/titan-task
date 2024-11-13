import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "../../store/contentSlice";
import favoritesReducer from "../../store/favoritesSlice";
import ContentList from "../../components/ContentList";

const mockContent = (id: number) => ({
  id,
  title: `Movie ${id}`,
  original_title: `Movie ${id}`,
  synopsis: "Test synopsis",
  year: 2024,
  images: { artwork_portrait: `test-image-${id}` },
});

const createStore = () =>
  configureStore({
    reducer: {
      content: contentReducer,
      favorites: favoritesReducer,
    },
  });

const renderContentList = (props: any) => {
  return render(
    <Provider store={createStore()}>
      <ContentList {...props} />
    </Provider>
  );
};

describe("ContentList", () => {
  const defaultProps = {
    title: "Test Movies",
    contents: Array.from({ length: 5 }, (_, i) => mockContent(i)),
    focusedIndex: 0,
    onFocusChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    renderContentList({ ...defaultProps, isLoading: true, contents: [] });
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    renderContentList({ ...defaultProps, contents: [] });
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows first item button when not at start", () => {
    renderContentList({ ...defaultProps, focusedIndex: 2 });
    expect(screen.getByTestId("first-item-button")).toBeInTheDocument();
  });

  it("handles content selection", () => {
    renderContentList(defaultProps);

    const firstCard = screen.getByTestId("content-card-0");
    fireEvent.click(firstCard);

    expect(screen.getByText("Test synopsis")).toBeInTheDocument();
  });
});
