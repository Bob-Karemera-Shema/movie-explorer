import { useEffect, type MouseEvent } from 'react';
import { useSearchParams } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectGenreError, selectGenreStatus, selectMovieError, selectMovies, selectMovieStatus, selectNextPage, selectPageTitle, updatePageTitle } from '../../store/movies/moviesSlice';
import { fetchGenres, fetchMovies } from '../../store/movies/thunks';

import Sidebar from '../../components/sidebar/sidebar.component';
import MovieCard from '../../components/moviecard/moviecard.component';
import Button from '../../components/button/button.component';
import Feedback from '../../components/feedback.component';

import './home.page.css';
import Filters from '../../components/filters/filters.component';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search');
  const genre = searchParams.get('genre') ?? 'Popular';
  const page = parseInt(searchParams.get('page') ?? '1');
  const filter = searchParams.get('titleType');

  const dispatch = useAppDispatch();
  const movies = useAppSelector(selectMovies);
  const pageTitle = useAppSelector(selectPageTitle);
  const next = useAppSelector(selectNextPage);

  // Loading status
  const movieStatus = useAppSelector(selectMovieStatus);
  const genreStatus = useAppSelector(selectGenreStatus);

  // Errors
  const movieError = useAppSelector(selectMovieError);
  const genreError = useAppSelector(selectGenreError);

  const onPageChange = (e: MouseEvent<HTMLButtonElement>) => {
    const direction = e.currentTarget.dataset.direction;
    const nextPage = direction === 'next' ? (next?.length ? page + 1 : page) : Math.max(1, page - 1);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', nextPage.toString());
    setSearchParams(newParams);
  };

  // Fetch genres once
  useEffect(() => {
    dispatch(fetchGenres('/titles/utils/genres'));
  }, [dispatch]);

  // Fetch movies every time URL params change
  useEffect(() => {
    let url = '';

    if (searchQuery) {
      url = `/titles/search/title/${searchQuery}?exact=false&titleType=movie&page=${page}`;
      dispatch(updatePageTitle(`Search results for "${searchQuery}"`));
    }else if(filter) {
      url = `/titles?titleType=${filter}&page=${page}`;
      const title = filter === 'movie' ? 'Movies' : 'Series';
      dispatch(updatePageTitle(title));
    } else if (genre === 'Popular') {
      url = `/titles?page=${page}`;
      dispatch(updatePageTitle('Popular'));
    } else {
      url = `/titles?genre=${genre}&page=${page}`;
      dispatch(updatePageTitle(genre));
    }

    dispatch(fetchMovies(url));
  }, [searchQuery, genre, page, filter, dispatch]);

  console.log(movies);

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
            <Filters />
          </div>
          <div className="movies-grid">
            {
              movies && movies.map((movie) => <MovieCard key={movie.id} movie={movie} withClickNavigation />)
            }
          </div>
          <div className="pagination-container">
            <Button data-direction="prev" className='pagination-button' onClick={onPageChange}>Prev</Button>
            <Button data-direction="next" className='pagination-button' onClick={onPageChange}>Next</Button>
          </div>
        </section>
      </main>
    </>
  )
}