import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { loadReviewsForMovie, submitReview } from "../../store/reviews/thunks";
import type { RootState } from "../../store/store";
import { useForm, type SubmitHandler } from "react-hook-form";

import Button from "../button/button.component";

import './movieReviews.component.css';

interface MovieReviewsProps {
    movieId: string
}

interface ReviewFormInputs {
    name: string;
    rating: number;
    comment: string;
}

export default function MovieReviews({ movieId }: MovieReviewsProps) {
    const dispatch = useAppDispatch();
    const reviews = useAppSelector((state: RootState) => state.reviews.reviews[movieId]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormInputs>()

    const onSubmit: SubmitHandler<ReviewFormInputs> = (data) => {
        dispatch(
            submitReview({
                ...data,
                movieId
            })
        ).then(() => {
            reset();
        })
    }

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
                                <div key={review.id} className="movie-review">
                                    <h3 className="reviewer">{review.name}</h3>
                                    <p className="review-rating">{review.rating} / 10</p>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))
                        )
                    )
                }
            </div>
            <form className="movie-review-form" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    className="movie-review-input"
                    placeholder="Your Name"
                    {...register("name", {
                        required: "Name required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                        maxLength: { value: 50, message: "Name must be under 50 characters" },
                        pattern: {
                            value: /^[\p{L}\p{M}\s'-]+$/u,
                            message: "Name must only contain letters, spaces, apostrophes, or hyphens"
                        }
                    })}
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}

                <input
                    type="number" className="movie-review-input"
                    min={1}
                    max={10}
                    placeholder="Rating out of 10"
                    {...register("rating", {
                        required: "Rating required",
                        valueAsNumber: true,
                        min: { value: 1, message: "Rating must be at least 1" },
                        max: { value: 10, message: "Rating cannot exceed 10" }
                    })}
                />
                {errors.rating && <p className="form-error">{errors.rating.message}</p>}

                <textarea
                    rows={5}
                    maxLength={350}
                    className="movie-review-textarea"
                    placeholder="Comment . . ."
                    {...register("comment", {
                        required: "Comment required",
                        minLength: { value: 10, message: "Comment must be at least 10 characters" }
                    })}
                />
                {errors.comment && <p className="form-error">{errors.comment.message}</p>}

                <Button type="submit" className='primary-button'>Submit</Button>
            </form>
        </section>
    )
}
