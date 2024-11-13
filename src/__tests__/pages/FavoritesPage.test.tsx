import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../../store/favoritesSlice";
import FavoritesPage from "../../pages/FavoritesPage";

const mockContent = (id: number) => ({
  id,
  title: `Movie ${id}`,
  original_title: `Movie ${id}`,
  synopsis: "Test synopsis",
  year: 2024,
  images: { artwork_portrait: `test-image-${id}` },
});

const createStore = (initialFavorites = []) =>
  configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
    preloadedState: {
      favorites: {
        items: initialFavorites,
      },
    },
  });

describe("FavoritesPage", () => {
  it("shows empty state when no favorites", () => {
    render(
      <Provider store={createStore()}>
        <FavoritesPage />
      </Provider>
    );

    expect(screen.getByText("No favorites added yet")).toBeInTheDocument();
  });

  describe("with favorites", () => {
    const favorites = Array.from({ length: 6 }, (_, i) => mockContent(i));

    beforeEach(() => {
      render(
        //@ts-ignore
        <Provider store={createStore(favorites)}>
          <FavoritesPage />
        </Provider>
      );
    });

    it("renders favorites grid", () => {
      favorites.forEach((movie) => {
        expect(screen.getByText(movie.title)).toBeInTheDocument();
      });
    });

    it("shows movie details on click", () => {
      fireEvent.click(screen.getByText("Movie 0"));
      expect(screen.getByText("Synopsis")).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText("Close"));
      expect(screen.queryByText("Synopsis")).not.toBeInTheDocument();
    });

    it("shows favorite buttons for each item", () => {
      const favoriteButtons = screen.getAllByLabelText("Remove from favorites");
      expect(favoriteButtons).toHaveLength(favorites.length);
    });
  });
});
