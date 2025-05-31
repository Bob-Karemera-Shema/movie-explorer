import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IMovie } from "../utils/types"
import type { RootState } from "./store";

const initialState: {
    toWatch: IMovie[]
} = {
    toWatch: []
};

const watchListSlice = createSlice({
    name: 'watchlist',
    initialState,
    reducers: {
        addMovieToList(state, action: PayloadAction<IMovie>) {
            state.toWatch.push(action.payload);
        },
        removeMovieFromList(state, action: PayloadAction<string>) {
            state.toWatch = state.toWatch.filter(movie => movie.id !== action.payload);
        }
    }
});

export const { addMovieToList, removeMovieFromList } = watchListSlice.actions;

export default watchListSlice.reducer;

// Export list selector
export const selectWatchListMovies = (state: RootState) => state.watchlist.toWatch;