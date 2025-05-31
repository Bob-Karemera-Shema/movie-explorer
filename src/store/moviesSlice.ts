import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import type { IMovieApiResponse } from "../utils/types";

import { addMovieToList, removeMovieFromList } from "./watchlistSlice";
import { fetchGenres, fetchMovies } from "./thunks";

interface MovieState {
    apiMovieResponse: IMovieApiResponse | null
    genres: string[] | null
    movieStatus: 'idle' | 'pending'
    genreStatus: 'idle' | 'pending'
    movieError: string | null
    genreError: string | null
};

const initialState: MovieState = {
    apiMovieResponse: null,
    genres: null,
    movieStatus: 'idle',
    genreStatus: 'idle',
    movieError: null,
    genreError: null
};

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
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
            .addCase(addMovieToList, (state, action) => {
                if (!state.apiMovieResponse) return;

                const index = state.apiMovieResponse?.results.findIndex(movie => movie.id === action.payload.id);
                if (index) {
                    state.apiMovieResponse.results[index].toWatch = true;
                }
            })
            .addCase(removeMovieFromList, (state, action) => {
                if (!state.apiMovieResponse) return;

                const index = state.apiMovieResponse?.results.findIndex(movie => movie.id === action.payload);
                if (index) {
                    state.apiMovieResponse.results[index].toWatch = false;
                }
            })
    }
});

// Export reducer function
export default moviesSlice.reducer;

// Export page info
export const selectCurrentPage = (state: RootState) => state.movies.apiMovieResponse?.page;

export const selectPrevPage = (state: RootState) => state.movies.apiMovieResponse?.prev;

export const selectNextPage = (state: RootState) => state.movies.apiMovieResponse?.next;

// Export movie selectors
export const selectMovies = (state: RootState) => state.movies.apiMovieResponse?.results;

export const selectMovieById = (state: RootState, id: string) => state.movies.apiMovieResponse?.results.find(movie => movie.id === id);

export const selectMovieStatus = (state: RootState) => state.movies.movieStatus;

export const selectMovieError = (state: RootState) => state.movies.movieError;

// Export genre selectors
export const selectGenres = (state: RootState) => state.movies.genres;

export const selectGenreStatus = (state: RootState) => state.movies.genreStatus;

export const selectGenreError = (state: RootState) => state.movies.genreError;