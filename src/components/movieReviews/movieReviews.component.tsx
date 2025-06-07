import React from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { loadReviewsForMovie } from "../../store/reviews/thunks";
import type { RootState } from "../../store/store";

import ReviewItem from "../reviewItem/reviewItem.component";
import ReviewForm from "../reviewForm/reviewForm.component";

import './movieReviews.component.css';

interface MovieReviewsProps {
    movieId: string
}

export default function MovieReviews({ movieId }: MovieReviewsProps) {
    const dispatch = useAppDispatch();
    const reviews = useAppSelector((state: RootState) => state.reviews.reviews[movieId]);

    useEffect(() => {
        dispatch(loadReviewsForMovie(movieId));
    }, [dispatch, movieId]);

    return (
        <section className="movie-reviews-section">
            <h2 className="movie-reviews-header">Reviews</h2>
            <div className="movie-reviews-container">
                {
                    reviews && (
                        reviews.length === 0 ? (<p className="no-reviews">No reviews yet.</p>) : (
                            reviews.map(review => (
                                <ReviewItem key={review.id} review={review} />
                            ))
                        )
                    )
                }
            </div>
            <ReviewForm movieId={movieId} />
        </section>
    )
}
