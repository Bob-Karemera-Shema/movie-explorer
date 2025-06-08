import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Review } from "../../utils/types";
import { addReview, fetchReviews } from "../../utils/firebase";

// Thunk to fetch movie review once
export const loadReviewsForMovie = createAsyncThunk<
    { movieId: string; reviews: Review[] },
    string,
    { rejectValue: string }
>(
    "reviews/loadForMovie",
    async (movieId, thunkAPI) => {
        try {
            const reviews = await fetchReviews(movieId);
            return { movieId, reviews };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Thunk to submit a new review
export const submitReview = createAsyncThunk<
    { movieId: string; review: Review },
    { movieId: string; name: string; rating: number; comment: string },
    { rejectValue: string }
>(
    "reviews/submit",
    async (payload, thunkAPI) => {
        const { movieId, name, rating, comment } = payload;
        try {
            await addReview(movieId, { name, rating, comment });
            // Re-fetch all reviews to get the new one
            const allReviews = await fetchReviews(movieId);
            const newest = allReviews[0];
            return { movieId, review: newest };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            return thunkAPI.rejectWithValue(message);
        }
    }
);