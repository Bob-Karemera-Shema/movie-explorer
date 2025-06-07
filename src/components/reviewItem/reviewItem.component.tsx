import React from 'react'
import type { Review } from '../../utils/types';

interface ReviewProps {
    review: Review
}

const ReviewItem = ({ review }: ReviewProps) => {
    const { name, rating, comment } = review;

    return (
        <div className="movie-review">
            <h3 className="reviewer">{name}</h3>
            <p className="review-rating">{rating} / 10</p>
            <p className="review-comment">{comment}</p>
        </div>
    )
}

export default ReviewItem
