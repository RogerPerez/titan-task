import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../../store/favoritesSlice";
import ContentCard from "../../components/ContentCard";

const mockContent = {
  id: 1,
  title: "Test Movie",
  original_title: "Test Movie",
  synopsis: "Test synopsis",
  year: 2024,
  images: { artwork_portrait: "test-image-url" },
};

const createStore = () =>
  configureStore({
    reducer: { favorites: favoritesReducer },
  });

describe("ContentCard", () => {
  const defaultProps = {
    content: mockContent,
    index: 0,
    isFocused: false,
    onSelect: vi.fn(),
    onFocus: vi.fn(),
    isPreloaded: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCard = (props = {}) => {
    return render(
      <Provider store={createStore()}>
        <ContentCard {...defaultProps} {...props} />
      </Provider>
    );
  };

  it("renders basic content", () => {
    renderCard();
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("handles focus state correctly", () => {
    renderCard({ isFocused: true });
    const card = screen.getByTestId("content-card-0");
    expect(card).toHaveStyle({ transform: "scale(1.1)" });
    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const { rerender } = renderCard();
    const card = screen.getByTestId("content-card-0");

    fireEvent.click(card);
    expect(defaultProps.onFocus).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelect).not.toHaveBeenCalled();

    rerender(
      <Provider store={createStore()}>
        <ContentCard {...defaultProps} isFocused={true} />
      </Provider>
    );

    fireEvent.click(card);
    expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
  });

  it("sets correct loading attribute based on preload status", () => {
    const { rerender } = renderCard({ isPreloaded: true });
    let img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("decoding", "async");

    rerender(
      <Provider store={createStore()}>
        <ContentCard {...defaultProps} isPreloaded={false} />
      </Provider>
    );
    img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("applies correct styles for focused and unfocused states", () => {
    const { rerender } = renderCard();
    let card = screen.getByTestId("content-card-0");
    expect(card).toHaveStyle({ transform: "scale(0.9)", opacity: "0.5" });

    rerender(
      <Provider store={createStore()}>
        <ContentCard {...defaultProps} isFocused={true} />
      </Provider>
    );
    card = screen.getByTestId("content-card-0");
    expect(card).toHaveStyle({ transform: "scale(1.1)", opacity: "1" });
  });

  it("shows favorite button only when focused", () => {
    const { rerender } = renderCard();
    expect(screen.queryByLabelText("Add to favorites")).not.toBeInTheDocument();

    rerender(
      <Provider store={createStore()}>
        <ContentCard {...defaultProps} isFocused={true} />
      </Provider>
    );
    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });
});
