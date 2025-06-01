import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import type { IMovie, IMoviesApiResponse } from "../utils/types";
import { fetchGenres, fetchMovieById, fetchMovies } from "./thunks";

interface MovieState {
    apiMovieResponse: IMoviesApiResponse | null
    genres: string[] | null
    movieStatus: 'idle' | 'pending'
    genreStatus: 'idle' | 'pending'
    movieError: string | null
    genreError: string | null
    selectedMovie: IMovie | null
    selectedMovieStatus: 'idle' | 'pending'
    selectedMovieError: string | null
    pageTitle: string
};

const initialState: MovieState = {
    apiMovieResponse: null,
    genres: null,
    movieStatus: 'idle',
    genreStatus: 'idle',
    movieError: null,
    genreError: null,
    selectedMovie: null,
    selectedMovieStatus: 'idle',
    selectedMovieError: null,
    pageTitle: 'Popular'
};

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        updatePageTitle(state, action: PayloadAction<string>) {
            state.pageTitle = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.movieStatus = 'pending';
                state.movieError = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.movieStatus = 'idle';
                state.apiMovieResponse = action.payload;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.movieStatus = 'idle';
                state.movieError = action.payload || 'Failed to fetch movies';
            })
            .addCase(fetchGenres.pending, (state) => {
                state.genreStatus = 'pending';
                state.genreError = null;
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.genreStatus = 'idle';
                state.genres = action.payload;
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.genreStatus = 'idle';
                state.genreError = action.payload ?? 'Failed to fetch genres';
            })
            .addCase(fetchMovieById.pending, (state) => {
                state.selectedMovieStatus = 'pending';
                state.selectedMovieError = null;
            })
            .addCase(fetchMovieById.fulfilled, (state, action) => {
                state.selectedMovieStatus = 'idle';
                state.selectedMovie = action.payload;
            })
            .addCase(fetchMovieById.rejected, (state, action) => {
                state.selectedMovieStatus = 'idle';
                state.selectedMovieError = action.payload || 'Failed to fetch movie';
            })
    }
});

// Export action creators
export const { updatePageTitle } = moviesSlice.actions;

// Export reducer function
export default moviesSlice.reducer;

// Export page info
export const selectCurrentPage = (state: RootState) => state.movies.apiMovieResponse?.page;

export const selectPrevPage = (state: RootState) => state.movies.apiMovieResponse?.prev;

export const selectNextPage = (state: RootState) => state.movies.apiMovieResponse?.next;

export const selectPageTitle = (state: RootState) => state.movies.pageTitle;

// Export movie selectors
export const selectMovies = (state: RootState) => state.movies.apiMovieResponse?.results;

export const selectMovieById = (state: RootState, id: string) => state.movies.apiMovieResponse?.results.find(movie => movie.id === id);

export const selectMovieStatus = (state: RootState) => state.movies.movieStatus;

export const selectMovieError = (state: RootState) => state.movies.movieError;

// Export genre selectors
export const selectGenres = (state: RootState) => state.movies.genres;

export const selectGenreStatus = (state: RootState) => state.movies.genreStatus;

export const selectGenreError = (state: RootState) => state.movies.genreError;

// Export selected movie selectors
export const selectSelectedMovie = (state: RootState) => state.movies.selectedMovie;

export const selectSelectedMovieStatus = (state: RootState) => state.movies.selectedMovieStatus;

export const selectSelectedMovieError = (state: RootState) => state.movies.selectedMovieError;