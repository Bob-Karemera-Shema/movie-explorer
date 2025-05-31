import { configureStore, type Action, type ThunkAction } from "@reduxjs/toolkit";

import moviesReducer from './moviesSlice';

export const store = configureStore({
    reducer: {
        movies: moviesReducer
    }
});

// Infer store type
export type AppStore = typeof store;

// Infer AppDisspatch and RootState types
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Handwritten thunk type
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;