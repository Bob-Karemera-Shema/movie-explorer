import { combineReducers, configureStore, type Action, type ThunkAction } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';

import moviesReducer from './movies/moviesSlice';
import watchlistReducer from './watchlistSlice';
import reviewsReducer from './reviews/reviewsSlice';
import themeReducer from './themeSlice';

const rootReducer = combineReducers({
    movies: moviesReducer,
    watchlist: watchlistReducer,
    reviews: reviewsReducer,
    theme: themeReducer
});

// whitelist watchlist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['watchlist', 'theme']
};

// Persist reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

// Persist store
export const persistor = persistStore(store);

// Infer store type
export type AppStore = typeof store;

// Infer AppDisspatch and RootState types
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Handwritten thunk type
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;