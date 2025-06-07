import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewItem from './reviewItem.component';

describe('ReviewItem', () => {
  test('renders name, rating, and comment', () => {
    const review = { name: 'Alice', rating: 9, comment: 'One of the best movies of all time!' };
    render(<ReviewItem review={review} />);

    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText(/9/)).toBeInTheDocument();
    expect(screen.getByText(/One of the best movies of all time!/)).toBeInTheDocument();
  });
});