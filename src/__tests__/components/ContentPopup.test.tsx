import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../../store/favoritesSlice";
import ContentPopup from "../../components/ContentPopup";

const mockContent = {
  id: 1,
  title: "Test Movie",
  original_title: "Original Test Movie",
  synopsis: "Test synopsis",
  year: 2024,
  images: { artwork_portrait: "test-image-url" },
};

const createTestStore = () =>
  configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
  });

describe("ContentPopup", () => {
  const onClose = vi.fn();

  //@ts-ignore
  beforeEach(() => {
    onClose.mockClear();
  });

  it("renders popup content", () => {
    render(
      <Provider store={createTestStore()}>
        <ContentPopup content={mockContent} onClose={onClose} />
      </Provider>
    );

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("Original Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("Test synopsis")).toBeInTheDocument();
  });

  it("closes on button click", () => {
    render(
      <Provider store={createTestStore()}>
        <ContentPopup content={mockContent} onClose={onClose} />
      </Provider>
    );

    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on escape key", () => {
    render(
      <Provider store={createTestStore()}>
        <ContentPopup content={mockContent} onClose={onClose} />
      </Provider>
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on backdrop click", () => {
    render(
      <Provider store={createTestStore()}>
        <ContentPopup content={mockContent} onClose={onClose} />
      </Provider>
    );

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });
});
