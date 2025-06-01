import { useEffect, type MouseEvent } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrentPage, selectGenreError, selectGenreStatus, selectMovieError, selectMovies, selectMovieStatus, selectNextPage, selectPageTitle, selectPrevPage } from '../../store/moviesSlice';
import { fetchGenres, fetchMovies } from '../../store/thunks';

import Sidebar from '../../components/sidebar/sidebar.component';
// import Spinner from '../../components/spinner/spinner.component';
import MovieCard from '../../components/moviecard/moviecard.component';
import Button from '../../components/button/button.component';

import './home.page.css';
import Feedback from '../../components/feedback.component';

export default function Home() {
  const dispatch = useAppDispatch();

  const movies = useAppSelector(selectMovies);

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
      dispatch(fetchMovies(prevPage));
    }
    if (direction === 'next' && nextPage) {
      dispatch(fetchMovies(nextPage));
    }
  }

  useEffect(() => {
    dispatch(fetchGenres('/titles/utils/genres'));
    dispatch(fetchMovies('/titles'));
  }, [dispatch])

  return (
    <>
      <main className='home-page'>
        <Sidebar />
        <Feedback
          isLoading={movieStatus === 'pending' || genreStatus === 'pending'}
          errors={[movieError, genreError].filter((error) => error !== null)}
        />
        <section className="movies-grid-section">
          <div className='movie-grid-header'>
            <h1>{pageTitle}</h1>
          </div>
          <div className="movies-grid">
            {
              movies && movies.map((movie) => <MovieCard key={movie.id} movie={movie} withClickNavigation />)
            }
          </div>
          <div className="pagination-container">
            <Button data-direction="prev" className='pagination-button' onClick={onPageChange} disabled={currentPage === 1}>Prev</Button>
            <Button data-direction="next" className='pagination-button' onClick={onPageChange} disabled={!(nextPage !== undefined)}>Next</Button>
          </div>
        </section>
      </main>
    </>
  )
}