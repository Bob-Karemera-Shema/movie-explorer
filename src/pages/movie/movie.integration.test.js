import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import App from '../../App';
import { fetchReviews, addReview } from '../../utils/firebase';

// Mock Firebase modules
jest.mock('../../utils/firebase', () => ({
    __esModule: true,
    fetchReviews: jest.fn(),
    addReview: jest.fn(),
}));

jest.mock('../../utils/customFetch', () => ({
    __esModule: true,
    default: jest.fn(),
}));

// Sample data
const movieId = 'test-movie';
const existingReviews = [
  { id: 'r1', name: 'Alice', rating: 8, comment: 'Great movie!', createdAt: new Date() },
];
const newReview = { id: 'r2', name: 'Bob', rating: 9, comment: 'Loved it!', createdAt: new Date() };

describe('Movie Detail Integration Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // On first mount, return existing reviews
    fetchReviews.mockResolvedValue(existingReviews);
    // On subsequent fetch, include new review
    fetchReviews.mockImplementationOnce(() => Promise.resolve(existingReviews))
                     .mockImplementationOnce(() => Promise.resolve([...existingReviews, newReview]));
    addReview.mockResolvedValue(undefined);
  });

  it('fetches and displays reviews on mount', async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${movieId}`]}>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for loading to finish and reviews to be displayed
    await waitFor(() => expect(fetchReviewsMock).toHaveBeenCalledWith(movieId));
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('8 / 10')).toBeInTheDocument();
    expect(screen.getByText('Great movie!')).toBeInTheDocument();
  });

  it('allows user to submit a new review and displays it', async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${movieId}`]}>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    // Ensure initial reviews loaded
    await screen.findByText('Alice');

    // Fill the form
    userEvent.type(screen.getByPlaceholderText('Your Name'), newReview.name);
    userEvent.type(screen.getByPlaceholderText('Rating out of 10'), newReview.rating.toString());
    userEvent.type(screen.getByPlaceholderText('Comment . . .'), newReview.comment);

    // Submit
    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check addReview called with correct args
    await waitFor(() => {
      expect(addReviewMock).toHaveBeenCalledWith(movieId, {
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
      });
    });

    // After adding, fetchReviews is called again and new review appears
    await waitFor(() => expect(fetchReviewsMock).toHaveBeenCalledTimes(2));
    expect(await screen.findByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('9 / 10')).toBeInTheDocument();
    expect(screen.getByText('Loved it!')).toBeInTheDocument();
  });

  it('navigates from Home to Movie Detail via routing', async () => {
    // Assuming Home has links with data-testid={`link-${movieId}`}
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Simulate clicking a movie link
    const link = await screen.findByTestId(`link-${movieId}`);
    userEvent.click(link);

    // Verify URL and Movie page
    await waitFor(() => expect(window.location.pathname).toBe(`/movie/${movieId}`));
    expect(screen.getByTestId('movie-page')).toBeInTheDocument();
  });

  describe.each(['light', 'dark'])('Review flow under %s theme', (theme) => {
    it(`works correctly in ${theme} mode`, async () => {
      // Apply theme class to body
      document.body.className = theme;

      render(
        <MemoryRouter initialEntries={[`/movie/${movieId}`]}>
          <App />
        </MemoryRouter>
      );

      // Flow: load existing, submit, check new
      await screen.findByText('Alice');
      userEvent.type(screen.getByPlaceholderText('Your Name'), newReview.name);
      userEvent.type(screen.getByPlaceholderText('Rating out of 10'), newReview.rating.toString());
      userEvent.type(screen.getByPlaceholderText('Comment . . .'), newReview.comment);
      userEvent.click(screen.getByRole('button', { name: /submit/i }));
      await waitFor(() => expect(addReviewMock).toHaveBeenCalled());
      await screen.findByText('Bob');
      // Optionally test theme-specific styling
      expect(document.body.className).toBe(theme);
    });
  });
});
