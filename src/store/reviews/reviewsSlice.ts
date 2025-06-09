import { createSlice } from "@reduxjs/toolkit";
import { loadReviewsForMovie, submitReview } from "./thunks";

import type { Review } from "../../utils/types";
import type { RootState } from "../store";

interface ReviewsState {
    reviews: Record<string, Review[]>;
    status: 'idle' | 'pending';
    error: string | null;
}

const initialState: ReviewsState = {
    reviews: {},
    status: 'idle',
    error: null
};

const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadReviewsForMovie.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(loadReviewsForMovie.fulfilled, (state, action) => {
                const { movieId, reviews } = action.payload;
                state.reviews[movieId] = reviews;
                state.status = 'idle';
            })
            .addCase(loadReviewsForMovie.rejected, (state, action) => {
                state.status = 'idle';
                state.error = action.payload || 'Failed to fetch reviews';
            })
            .addCase(submitReview.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(submitReview.fulfilled, (state, action) => {
                const { movieId, review } = action.payload;
                if (!state.reviews[movieId]) {
                    state.reviews[movieId] = [review];
                } else {
                    // newest reviews first
                    state.reviews[movieId].unshift(review);
                }
                state.status = 'idle';
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.status = 'idle';
                state.error = action.payload || 'Failed to submit review';
            })
    }
});

// Export reviews reducer
export default reviewsSlice.reducer;

// Export reviews status
export const selectReviewsStatus = (state: RootState) => state.reviews.status;

// Export reviews error
export const selectReviewsError = (state: RootState) => state.reviews.error;