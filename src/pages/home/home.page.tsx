import { useContext, useState, type MouseEvent } from 'react';
import Sidebar from '../../components/sidebar/sidebar.component';
import MovieCard from '../../components/moviecard/moviecard.component';
import Button from '../../components/button/button.component';
import Spinner from '../../components/spinner/spinner.component';

import { MoviesContext } from '../../contexts/contexts';
import customFetch from '../../utils/customFetch';

import './home.page.css';
import type { IMovieApiResponse } from '../../utils/types';

export default function Home() {
  const movies = useContext(MoviesContext);
  const [currentGenre, setCurrentGenre] = useState('Popular');

  const onGenreChange = (selectedGenre: string) => setCurrentGenre(selectedGenre);

  const goToPage = async (page: string) => {
    movies.startLoadingState();
    const newPageData = await customFetch<IMovieApiResponse>(page);
    movies.updateData(newPageData);
  }

  const onPageChange = (e: MouseEvent<HTMLButtonElement>) => {
    const direction = e.currentTarget.dataset.direction;
    const currentPage = movies.data.page;

    if (direction === 'prev' && movies.data.prev && currentPage > 1) {
      goToPage(movies.data.prev);
    }
    if (direction === 'next') {
      goToPage(movies.data.next);
    }
  }

  return (
    <>
      {
        movies.loading && (
          <div className='feedback-container'>
            <Spinner />
          </div>
        )
      }

      {
        movies.error && (
          <div className='error-container'>
            <p>{movies.error}</p>
          </div>
        )
      }

      {
        !movies.loading && !movies.error && (
          <div className='page-body'>
            <Sidebar onGenreChange={onGenreChange} />
            <div className="movies-section">
              <div className='header'>
                <h1>{currentGenre}</h1>
              </div>
              <div className="movies-grid">
                {
                  movies.data.results.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                }
              </div>
              <div className="pagination-container">
                <Button data-direction="prev" onClick={onPageChange} disabled={movies.data.page === 1}>Prev</Button>
                <Button data-direction="next" onClick={onPageChange} disabled={!movies.data.next}>Next</Button>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}