import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../../store/favoritesSlice";
import FavoriteButton from "../../components/FavoriteButton";

const mockContent = {
  id: 1,
  title: "Test Movie",
  original_title: "Test Movie",
  synopsis: "Test synopsis",
  year: 2024,
  images: { artwork_portrait: "test-image-url" },
};

const createTestStore = (isFavorite = false) =>
  configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
    preloadedState: {
      favorites: {
        items: isFavorite ? [mockContent] : [],
      },
    },
  });

describe("FavoriteButton", () => {
  it("renders unfavorited state", () => {
    render(
      <Provider store={createTestStore()}>
        <FavoriteButton content={mockContent} />
      </Provider>
    );

    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  it("renders favorited state", () => {
    render(
      <Provider store={createTestStore(true)}>
        <FavoriteButton content={mockContent} />
      </Provider>
    );

    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
  });

  it("toggles favorite state on click", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <FavoriteButton content={mockContent} />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(store.getState().favorites.items).toHaveLength(1);

    fireEvent.click(screen.getByRole("button"));
    expect(store.getState().favorites.items).toHaveLength(0);
  });
});
