import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
import MoviesPage from './pages/MoviesPage';
import FavoritesPage from './pages/FavoritesPage';
import Navigation from './components/Navigation';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Navigation />
          <Routes>
            <Route path="/" element={<MoviesPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;