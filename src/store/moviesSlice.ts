import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "./withTypes";
import customFetch from "../utils/customFetch";

import type { RootState } from "./store";
import type { IRatingApiResponse, IMovie, IMovieApiResponse } from "../utils/types";

async function addRatingsToMovies(movies: IMovie[]): Promise<IMovie[]> {
    return Promise.all(
        movies.map(async (movie) => {
            try {
                const ratingResponse = await customFetch<IRatingApiResponse>(`/titles/${movie.id}/ratings`);
                return {
                    ...movie,
                    rating: ratingResponse.results,
                };
            } catch {
                return { ...movie };
            }
        })
    );
}

export const fetchMovies = createAppAsyncThunk<IMovieApiResponse, string>(
    'movies/fetch',
    async (genre, thunkAPI) => {
        try {
            const response = await customFetch<IMovieApiResponse>(genre);
            const enrichedResults = await addRatingsToMovies(response.results);
            return { ...response, results: enrichedResults };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return thunkAPI.rejectWithValue(message);
        }
    },
    {
        condition(_, thunkApi) {
            const moviesStatus = selectMoviesStatus(thunkApi.getState());
            if (moviesStatus !== 'idle') return false;
        }
    }
);

interface MovieState {
    apiMovieResponse: IMovieApiResponse | null
    status: 'idle' | 'pending' | 'succeeded' | 'failed'
    error: string | null
};

const initialState: MovieState = {
    apiMovieResponse: null,
    status: 'idle',
    error: null
};

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        updateWatchList(state, action: PayloadAction<{ id: string; toWatch: boolean }>) {
            const movie = state.apiMovieResponse?.results.find(m => m.id === action.payload.id);
            if (movie) {
                movie.toWatch = action.payload.toWatch;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.apiMovieResponse = action.payload;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch movies';
            })
    }
});

// Export action creators
export const { updateWatchList } = moviesSlice.actions;

// Export reducer function
export default moviesSlice.reducer;

// Export movie selectors
export const selectAllMovies = (state: RootState) => state.movies.apiMovieResponse?.results;

export const selectMovieById = (state: RootState, id: string) => state.movies.apiMovieResponse?.results.find(movie => movie.id === id);

export const selectMoviesStatus = (state: RootState) => state.movies.status;

export const selectMoviesError = (state: RootState) => state.movies.error;