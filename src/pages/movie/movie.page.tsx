import { useEffect } from 'react';
import type { SyntheticEvent } from 'react';
import { useParams } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addMovieToList, isMovieInWatchList, removeMovieFromList } from '../../store/watchlistSlice';
import { selectSelectedMovie, selectSelectedMovieError, selectSelectedMovieStatus } from '../../store/movies/moviesSlice';
import { fetchMovieById } from '../../store/movies/thunks';

import Button from '../../components/button/button.component';
import Feedback from '../../components/feedback.component';

import placeholder from '../../assets/placeholder.jpg';

import './movie.page.css';

export default function Movie() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const movie = useAppSelector(selectSelectedMovie);
  const status = useAppSelector(selectSelectedMovieStatus);
  const error = useAppSelector(selectSelectedMovieError);
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
    <main className='movie-page'>
      <Feedback
        isLoading={status === 'pending'}
        errors={[error].filter((error) => error !== null)}
      />
      {
        (status === 'idle' && !error && movie) && (
          <section className='movie-section'>
            <article className='movie-image-container'>
              <img src={movie.primaryImage?.url || placeholder} onError={handleImageError} alt={movie.originalTitleText.text} />
            </article>
            <article className='movie-details-container'>
              <h1>{movie.originalTitleText.text}</h1>
              <p>{movie.releaseYear.year}</p>
              {
                movie?.rating && (
                  <div className='movie-rating-container'>
                    <span>Rating: {movie.rating.averageRating}</span>
                    <span>Votes: {movie.rating.numVotes}</span>
                  </div>
                )
              }
              <p>{movie.titleType.isSeries ? 'Series' : 'Movie'}</p>
              {
                inWatchList ? (
                  <Button className='primary-button' onClick={removeFromList}>
                    Remove from WatchList
                  </Button>
                ) : (
                  <Button className='primary-button' onClick={addToList}>
                    Add to WatchList
                  </Button>
                )
              }
            </article>
          </section>
        )
      }
    </main>
  )
}
