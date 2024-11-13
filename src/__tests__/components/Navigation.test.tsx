import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../../store/favoritesSlice";
import Navigation from "../../components/Navigation";

const createTestStore = (favoritesCount = 0) =>
  configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
    preloadedState: {
      favorites: {
        items: Array(favoritesCount).fill({
          id: 1,
          title: "Test",
          original_title: "Test",
          synopsis: "Test",
          year: 2024,
          images: { artwork_portrait: "test" },
        }),
      },
    },
  });

describe("Navigation", () => {
  it("renders navigation links", () => {
    render(
      <BrowserRouter>
        <Provider store={createTestStore()}>
          <Navigation />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText("Home")).toBeInTheDocument();
    expect(screen.getByLabelText("Favorites")).toBeInTheDocument();
  });

  it("shows favorites count badge", () => {
    render(
      <BrowserRouter>
        <Provider store={createTestStore(5)}>
          <Navigation />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("hides favorites count badge when empty", () => {
    render(
      <BrowserRouter>
        <Provider store={createTestStore(0)}>
          <Navigation />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
