import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import customFetch from '../../utils/customFetch';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addMovieToList, isMovieInWatchList, removeMovieFromList } from '../../store/watchlistSlice';

import type { IMovie, IRatingApiResponse, ITitleIdApiResponse } from '../../utils/types';

import Button from '../../components/button/button.component';

import './movie.page.css';

export default function Movie() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const inWatchList = useAppSelector(id ? isMovieInWatchList(id) : () => false);
  const [movie, setMovie] = useState<IMovie | null>(null);

  const addToList = () => {
    if (movie) dispatch(addMovieToList(movie));
  }

  const removeFromList = () => {
    if (movie) dispatch(removeMovieFromList(movie.id));
  }

  useEffect(() => {
    const getMovie = async () => {
      const response = await customFetch<ITitleIdApiResponse>(`/titles/${id}`);
      const rating = await customFetch<IRatingApiResponse>(`/titles/${id}/ratings`);

      setMovie({ ...response.results, rating: rating.results })
    };

    if (id) getMovie();
  }, [id]);

  return (
    <main className='movie-page'>
      {
        movie && (
          <section className='movie-section'>
            <article className='movie-image-container'>
              <img src={movie.primaryImage?.url} alt={movie.originalTitleText.text} />
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
