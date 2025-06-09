// import React from "react";
import { useAppDispatch } from "../../store/hooks"
import { submitReview } from "../../store/reviews/thunks";
import { useForm, type SubmitHandler } from "react-hook-form";
import Button from "../button/button.component";

interface ReviewFormInputs {
    name: string;
    rating: number;
    comment: string;
}

const ReviewForm = ({ movieId }: { movieId: string }) => {
    const dispatch = useAppDispatch();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormInputs>({
        mode: "onChange"
    });

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

    return (
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
                // min={1}
                // max={10}
                placeholder="Rating out of 10"
                {...register("rating", {
                    required: "Rating required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Rating must be at least 1" },
                    max: { value: 10, message: "Rating can not exceed 10" }
                })}
            />
            {errors.rating && <p className="form-error">{errors.rating.message}</p>}

            <textarea
                rows={5}
                // maxLength={350}
                className="movie-review-textarea"
                placeholder="Comment . . ."
                {...register("comment", {
                    required: "Comment required",
                    minLength: { value: 10, message: "Comment must be at least 10 characters" },
                    maxLength: { value: 350, message: "Comment can not exceed 350 characters" }
                })}
            />
            {errors.comment && <p className="form-error">{errors.comment.message}</p>}

            <Button type="submit" className='primary-button'>Submit</Button>
        </form>
    )
}

export default ReviewForm;