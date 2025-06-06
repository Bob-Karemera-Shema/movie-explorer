import { createSlice } from "@reduxjs/toolkit";
import type { Review } from "../../utils/types";
import { loadReviewsForMovie, submitReview } from "./thunks";

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
                if(!state.reviews[movieId]) {
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

export default reviewsSlice.reducer;