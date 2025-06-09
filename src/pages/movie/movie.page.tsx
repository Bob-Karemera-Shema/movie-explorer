// import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import type { SyntheticEvent } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addMovieToList, isMovieInWatchList, removeMovieFromList } from '../../store/watchlistSlice';
import { selectSelectedMovie, selectSelectedMovieError, selectSelectedMovieStatus } from '../../store/movies/moviesSlice';
import { selectReviewsError, selectReviewsStatus } from '../../store/reviews/reviewsSlice';
import { fetchMovieById } from '../../store/movies/thunks';

import Button from '../../components/button/button.component';
import Feedback from '../../components/feedback.component';
import MovieReviews from '../../components/movieReviews/movieReviews.component';

import placeholder from '../../assets/placeholder.jpg';

import './movie.page.css';

export default function Movie() {
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const movie = useAppSelector(selectSelectedMovie);

  const movieStatus = useAppSelector(selectSelectedMovieStatus);
  const movieError = useAppSelector(selectSelectedMovieError);

  const reviewsStatus = useAppSelector(selectReviewsStatus);
  const reviewsError = useAppSelector(selectReviewsError);

  const inWatchList = useAppSelector(id ? isMovieInWatchList(id) : () => false);

  const addToList = () => {
    if (movie) dispatch(addMovieToList(movie));
  }

  const removeFromList = () => {
    if (movie) dispatch(removeMovieFromList(movie.id));
  }

  useEffect(() => {
    if (id) dispatch(fetchMovieById(id));
  }, [dispatch, id]);

  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = placeholder;
  };

  return (
    <main className='movie-page' data-testid="movie-page">
      <Feedback
        isLoading={movieStatus === 'pending' || reviewsStatus === 'pending'}
        errors={[movieError, reviewsError].filter((error) => error !== null)}
      />
      {
        (movieStatus === 'idle' && !movieError && movie && id) && (
          <>
            <section className='movie-section' data-testid="movie-details">
              <article className='movie-image-container'>
                <img data-testid="movie-poster" src={movie.primaryImage?.url || placeholder} onError={handleImageError} alt={movie.originalTitleText.text} />
              </article>
              <article className='movie-details-container'>
                <h1 data-testid="movie-title">{movie.originalTitleText.text}</h1>
                <p data-testid="movie-year">{movie.releaseYear.year}</p>
                {
                  movie?.rating && (
                    <div className='movie-rating-container' data-testid="movie-rating">
                      <span>Rating: {movie.rating.averageRating}</span>
                      <span>Votes: {movie.rating.numVotes}</span>
                    </div>
                  )
                }
                <p data-testid="movie-type">{movie.titleType.isSeries ? 'Series' : 'Movie'}</p>
                {
                  inWatchList ? (
                    <Button className='primary-button' onClick={removeFromList} data-testid="remove-watchlist">
                      Remove from WatchList
                    </Button>
                  ) : (
                    <Button className='primary-button' onClick={addToList} data-testid="add-watchlist">
                      Add to WatchList
                    </Button>
                  )
                }
              </article>
            </section>
            <MovieReviews movieId={id} />
          </>
        )
      }
    </main>
  )
}
