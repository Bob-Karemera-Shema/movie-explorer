import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router';
import reviewsReducer from '../../store/reviews/reviewsSlice';
import watchlistReducer from '../../store/watchlistSlice';
import moviesReducer from '../../store/movies/moviesSlice';
import Movie from '../movie/movie.page';

// Mock firebase functions to avoid import.meta.env issues
jest.mock('../../utils/firebase.ts', () => ({
  addReview: jest.fn(() => Promise.resolve()),
  fetchReviews: jest.fn(() => Promise.resolve([]))
}));

// Mock custom fetch function to avoid import.meta.env issues
jest.mock('../../utils/customFetch.ts', () => ({
    customFetch: jest.fn(() => Promise.resolve())
}))

describe('Movie Page', () => {
  const renderMoviePage = (movieId = 'tt1234567', preloadedState = {}) => {
    const store = configureStore({
      reducer: {
        movies: moviesReducer,
        reviews: reviewsReducer,
        watchlist: watchlistReducer
      },
      preloadedState
    });

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/movies/${movieId}`]}>
          <Routes>
            <Route path="/movies/:id" element={<Movie />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test('displays movie data and WatchList button', async () => {
    const movieId = 'tt1234567';
    const preloadedState = {
      movies: {
        selectedMovieStatus: 'idle',
        selectedMovie: {
          id: movieId,
          originalTitleText: { text: 'Test Movie' },
          releaseYear: { year: 2024 },
          titleType: { isSeries: false },
          rating: { averageRating: 8.5, numVotes: 10000 },
        },
        selectedMovieError: null,
      },
      reviews: { reviews: {}, status: 'idle', error: null },
      watchlist: { toWatch: [] }
    };

    renderMoviePage(movieId, preloadedState);

    expect(await screen.findByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Add to WatchList')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    const movieId = 'tt1234567';
    const preloadedState = {
      movies: {
        selectedMovieStatus: 'pending',
        selectedMovie: null,
        selectedMovieError: null,
      },
      reviews: { reviews: {}, status: 'pending', error: null },
      watchlist: { toWatch: [] }
    };

    renderMoviePage(movieId, preloadedState);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('shows error state', () => {
    const movieId = 'tt1234567';
    const preloadedState = {
      movies: {
        selectedMovieStatus: 'idle',
        selectedMovie: null,
        selectedMovieError: 'Failed to fetch movie',
      },
      reviews: { reviews: {}, status: 'idle', error: 'Review fetch failed' },
      watchlist: { toWatch: [] }
    };

    renderMoviePage(movieId, preloadedState);

    expect(screen.getByText(/Failed to fetch movie/)).toBeInTheDocument();
    expect(screen.getByText(/Review fetch failed/)).toBeInTheDocument();
  });
});