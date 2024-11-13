# Movie Browser

A modern, performant React application for browsing movies with smooth animations, keyboard navigation, and favorites management.

## Features

- 🎥 Smooth horizontal scrolling movie list with optimized performance
- ⌨️ Full keyboard navigation support
  - `←` / `→`: Navigate through movies
  - `Enter`: Select movie / Open details
  - `Esc`: Close movie details
- ❤️ Favorites management
  - Add/remove favorites from any view
  - Grid view for favorites collection
  - Persistent storage
- 🎯 Performance optimizations:
  - Advanced image preloading system
    - Priority-based loading for visible content
    - Chunk-based background loading
    - Intelligent queue management
  - Smart pagination with prefetching
  - Efficient CSS transforms
  - Optimized re-renders
- 🎨 Beautiful UI with fluid animations
  - Smooth transitions
  - Hover effects
  - Loading states
- 📱 Responsive design
  - Adaptive grid layout for favorites
  - Dynamic content sizing
  - Mobile-friendly interactions
- ♿ Accessibility features
  - ARIA labels
  - Keyboard navigation
  - Focus management
- 🧪 Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js 16+
- npm 7+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Architecture

### Key Components

- **MoviesPage**: Main browsing interface with horizontal scrolling
- **FavoritesPage**: Grid layout for favorite movies
- **ContentList**: Horizontal scrolling list with keyboard navigation
- **ContentCard**: Individual movie card with optimized rendering
- **ContentPopup**: Detailed movie view
- **FavoriteButton**: Favorites management

### Performance Features

- Advanced Image Preloading:
  - Priority-based loading for visible content
  - Background loading for upcoming content
  - Intelligent queue management
  - Abort controller for cleanup
- Smart Pagination:
  - Prefetch threshold monitoring
  - Automatic content loading
  - Duplicate prevention
- State Management:
  - Redux Toolkit for global state
  - Local storage persistence
  - Optimized updates

## License

This project is licensed under the [RPL-1.0 License](./LICENSE) - see the LICENSE file for details
