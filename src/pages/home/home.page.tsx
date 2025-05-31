import { useEffect, type MouseEvent } from 'react';
import Sidebar from '../../components/sidebar/sidebar.component';
import MovieCard from '../../components/moviecard/moviecard.component';
import Button from '../../components/button/button.component';
import Spinner from '../../components/spinner/spinner.component';

// import { MoviesContext } from '../../contexts/contexts';
// import customFetch from '../../utils/customFetch';

import './home.page.css';
// import type { IMovieApiResponse } from '../../utils/types';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrentPage, selectGenreError, selectGenreStatus, selectMovieError, selectMovies, selectMovieStatus, selectNextPage, selectPageTitle, selectPrevPage } from '../../store/moviesSlice';
import { fetchGenres, fetchMovies } from '../../store/thunks';

export default function Home() {
  const dispatch = useAppDispatch();
  
  const movies = useAppSelector(selectMovies);
  
  // Page info
  const currentPage = useAppSelector(selectCurrentPage);
  const prevPage = useAppSelector(selectPrevPage);
  const nextPage = useAppSelector(selectNextPage);
  const pageTitle = useAppSelector(selectPageTitle);

  // Loading status
  const movieStatus = useAppSelector(selectMovieStatus);
  const genreStatus = useAppSelector(selectGenreStatus);

  // Errors
  const movieError = useAppSelector(selectMovieError);
  const genreError = useAppSelector(selectGenreError);

  const onPageChange = (e: MouseEvent<HTMLButtonElement>) => {
    const direction = e.currentTarget.dataset.direction;

    if (direction === 'prev' && prevPage && currentPage && currentPage > 1) {
      console.log('prev');
      dispatch(fetchMovies(prevPage));
    }
    if (direction === 'next' && nextPage) {
      console.log('next');
      dispatch(fetchMovies(nextPage));
    }
  }

  useEffect(() => {
    dispatch(fetchGenres('/titles/utils/genres'));
    dispatch(fetchMovies('/titles'));
  }, [dispatch])

  console.log(movies);

  return (
    <>
      {
        movieStatus === 'pending' || genreStatus === 'pending' && (
          <div className='feedback-container'>
            <Spinner />
          </div>
        )
      }

      {
        movieError || genreError && (
          <div className='error-container'>
            {movieError && <p>{movieError}</p>}
            {genreError && <p>{genreError}</p>}
          </div>
        )
      }

      {
        (movieStatus !== 'pending' && genreStatus !== 'pending' && !movieError && !genreError && movies) && (
          <div className='page-body'>
            <Sidebar />
            <div className="movies-section">
              <div className='header'>
                <h1>{pageTitle}</h1>
              </div>
              <div className="movies-grid">
                {
                  movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                }
              </div>
              <div className="pagination-container">
                <Button data-direction="prev" onClick={onPageChange} disabled={currentPage === 1}>Prev</Button>
                <Button data-direction="next" onClick={onPageChange} disabled={!(nextPage !== undefined)}>Next</Button>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}