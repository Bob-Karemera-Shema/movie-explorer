import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reviewsReducer from '../../store/reviews/reviewsSlice';
import ReviewForm from './reviewForm.component';

// Mock firebase functions to avoid import.meta.env issues
jest.mock('../../utils/firebase.ts', () => ({
  addReview: jest.fn(() => Promise.resolve()),
  fetchReviews: jest.fn(() => Promise.resolve([]))
}));

function renderWithStore(ui, { preloadedState, store = configureStore({ reducer: { reviews: reviewsReducer }, preloadedState }) } = {}) {
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('ReviewForm', () => {
  test('validates required empty fields and shows errors', async () => {
    renderWithStore(<ReviewForm movieId="tt0000081" />);

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Name required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Rating required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Comment required/i)).toBeInTheDocument();
  });

  test('validates name with one character, rating less than 1, comment less than 10 characters, and shows errors', async () => {
    renderWithStore(<ReviewForm movieId="tt0000081" />);

    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'B' } });
    fireEvent.change(screen.getByPlaceholderText(/rating out of 10/i), { target: { value: '0' } });
    fireEvent.change(screen.getByPlaceholderText(/comment/i), { target: { value: 'Great!' } });

    // fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/Rating must be at least 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Comment must be at least 10 characters/i)).toBeInTheDocument();
  });

  test('validates name with more than 50 characters, rating greater than 10, comment greater than 350 characters, and shows errors', async () => {
    renderWithStore(<ReviewForm movieId="tt0000081" />);

    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'Deserunt exercitation consequat veniam est sit Lorem cupidatat ut. Lorem sint qui magna exercitation ipsum fugiat excepteur duis deserunt cupidatat fugiat cillum. Sunt cupidatat culpa sint exercitation ut officia consequat aute voluptate minim minim est excepteur irure.' } });
    fireEvent.change(screen.getByPlaceholderText(/rating out of 10/i), { target: { value: '20' } });
    fireEvent.change(screen.getByPlaceholderText(/comment/i), { target: { value: 'Ea non enim elit excepteur amet ea nisi ullamco sit. Eiusmod ipsum commodo elit nostrud esse adipisicing culpa sunt ipsum consectetur cillum. Nulla ex non excepteur qui proident magna ullamco exercitation sunt laborum ut. Magna qui proident sit nulla enim pariatur tempor mollit ex commodo incididunt. Aute reprehenderit magna duis sint fugiat culpa ipsum incididunt. Adipisicing aute ut fugiat cillum non cupidatat proident do. Reprehenderit magna nulla exercitation id dolore exercitation minim.' } });

    // fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Name must be under 50 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/Rating can not exceed 10/i)).toBeInTheDocument();
    expect(await screen.findByText(/Comment can not exceed 350 characters/i)).toBeInTheDocument();
  });

  test('submits when inputs are valid', async () => {
    renderWithStore(<ReviewForm movieId="tt0000081" />);

    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByPlaceholderText(/rating out of 10/i), { target: { value: '8' } });
    fireEvent.change(screen.getByPlaceholderText(/comment/i), { target: { value: 'Great movie!' } });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Name required/i)).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your name/i)).toHaveValue('');
      expect(screen.getByPlaceholderText(/rating out of 10/i)).toHaveValue(null);
      expect(screen.getByPlaceholderText(/comment/i)).toHaveValue('');
    });
  });
});