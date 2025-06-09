import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import customFetch from '../../utils/customFetch';
import { fetchReviews, addReview } from '../../utils/firebase';

import moviesReducer from '../../store/movies/moviesSlice';
import reviewsReducer from '../../store/reviews/reviewsSlice';
import watchlistReducer from '../../store/watchlistSlice';
import Movie from './movie.page';

jest.mock('../../utils/customFetch', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../../utils/firebase', () => ({
    __esModule: true,
    fetchReviews: jest.fn(),
    addReview: jest.fn(),
}));

async function renderWithState(preloadedState) {
    const store = configureStore({
        reducer: combineReducers({
            movies: moviesReducer,
            reviews: reviewsReducer,
            watchlist: watchlistReducer,
        }),
        preloadedState,
    });

    let results;
    await act(async () => {
        results = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/movie/123']}>
                    <Routes>
                        <Route path="/movie/:id" element={<Movie />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    });
    return { store, ...results };
}

beforeEach(() => {
    jest.clearAllMocks();
    fetchReviews.mockResolvedValueOnce([]);
    addReview.mockResolvedValueOnce({});
});

describe('MovieDetail page', () => {
    it('shows loading spinner when movie is pending', async () => {
        // Make customFetch never resolve to simulate "pending"
        customFetch.mockImplementation(() => new Promise(() => { }));

        await renderWithState({
            movies: {
                selectedMovieStatus: 'pending',
                selectedMovie: null,
                selectedMovieError: null,
            },
            reviews: {
                reviews: {},
                status: 'idle',
                error: null,
            },
            watchlist: { toWatch: [] },
        });

        expect(screen.getByTestId('loading-container')).toBeInTheDocument();
    });

    it('shows loading spinner when reviews are pending', async () => {
        // Prevent movie fetch from resolving immediately
        customFetch.mockImplementation(() => new Promise(() => { }));

        await renderWithState({
            movies: {
                selectedMovieStatus: 'idle',
                selectedMovie: null,
                selectedMovieError: null,
            },
            reviews: {
                reviews: {},
                status: 'pending',
                error: null,
            },
            watchlist: { toWatch: [] },
        });

        // Spinner should appear because reviewsStatus==='pending'
        expect(screen.getByTestId('loading-container')).toBeInTheDocument();
    });

    it('shows error messages when movieError exists', async () => {
        customFetch.mockResolvedValueOnce({});

        await renderWithState({
            movies: {
                selectedMovieStatus: 'idle',
                selectedMovie: null,
                selectedMovieError: 'Failed to get movie',
            },
            reviews: {
                reviews: {},
                status: 'idle',
                error: null,
            },
            watchlist: { toWatch: [] },
        });

        expect(await screen.getByText('Failed to get movie')).toBeInTheDocument();
    });

    it('shows error messages when reviewsError exists', async () => {
        customFetch.mockResolvedValueOnce({});

        await renderWithState({
            movies: {
                selectedMovieStatus: 'idle',
                selectedMovie: null,
                selectedMovieError: null,
            },
            reviews: {
                reviews: {},
                status: 'idle',
                error: 'Failed to get reviews',
            },
            watchlist: { toWatch: [] },
        });

        expect(await screen.getByText('Failed to get reviews')).toBeInTheDocument();
    });

    it('renders movie data and ReviewList when loaded', async () => {
        // 1st call => movie data
        customFetch
            .mockResolvedValueOnce({
                results: {
                    id: '123',
                    originalTitleText: { text: 'My Test Movie' },
                    releaseYear: { year: 2021 },
                    primaryImage: { url: 'https://example.com/poster.jpg' },
                    titleType: { isSeries: false },
                },
            })
            // 2nd call => rating data
            .mockResolvedValueOnce({
                results: { averageRating: 8.5, numVotes: 2000 },
            });

        fetchReviews.mockResolvedValueOnce([
            { id: 'r1', name: 'Bob', rating: 3, comment: 'First Review', createdAt: new Date() },
            { id: 'r2', name: 'Will', rating: 5, comment: 'Second Review', createdAt: new Date() },
        ]);

        await renderWithState({
            movies: {
                selectedMovieStatus: 'idle',
                selectedMovie: null,
                selectedMovieError: null,
            },
            reviews: {
                reviews: {},
                status: 'idle',
                error: null,
            },
            watchlist: { toWatch: [] },
        });

        // Wait for useEffect() → dispatch(fetchMovieById) → state update
        expect(await screen.findByTestId('movie-title')).toHaveTextContent('My Test Movie');
        expect(screen.getByTestId('movie-year')).toHaveTextContent('2021');
        expect(screen.getByTestId('movie-poster')).toHaveAttribute(
            'src',
            'https://example.com/poster.jpg'
        );
        expect(screen.getByTestId('movie-rating')).toHaveTextContent('Rating: 8.5');
        expect(screen.getByTestId('movie-type')).toHaveTextContent('Movie');
        expect(screen.getByTestId('add-watchlist')).toBeInTheDocument();
        expect(screen.getByTestId('mock-movie-reviews')).toBeInTheDocument();
    });
});