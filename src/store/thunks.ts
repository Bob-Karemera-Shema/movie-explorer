import customFetch from "../utils/customFetch";
import type { IGenreApiResponse, IMovie, IMoviesApiResponse, IRatingApiResponse } from "../utils/types";
import { selectMovieStatus } from "./moviesSlice";
import { createAppAsyncThunk } from "./withTypes";

function getPrevPage(url: string | undefined, current: number) {
    if (!url || !url.includes('?')) return '';

    const [path, queryStr] = url.split('?');
    const prev = Math.max(1, current - 1);
    const params = new URLSearchParams(queryStr);
    params.set('page', prev.toString());
    return `${path}?${params.toString()}`;
}

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

export const fetchMovies = createAppAsyncThunk<IMoviesApiResponse, string>(
    'movies/fetchMovies',
    async (endpoint, thunkAPI) => {
        try {
            const response = await customFetch<IMoviesApiResponse>(endpoint);
            const ratedResults = await addRatingsToMovies(response.results);
            const prev = getPrevPage(response.next, response.page);
            return { ...response, prev, results: ratedResults };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return thunkAPI.rejectWithValue(message);
        }
    },
    {
        condition(_, thunkApi) {
            const moviesStatus = selectMovieStatus(thunkApi.getState());
            if (moviesStatus !== 'idle') return false;
        }
    }
);

export const fetchGenres = createAppAsyncThunk<string[], string>(
    'movies/fetchGenres',
    async (endpoint, thunkAPI) => {
        try {
            const response = await customFetch<IGenreApiResponse>(endpoint);
            return response.results;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return thunkAPI.rejectWithValue(message);
        }
    }
)