import { useContext, useState, type MouseEvent } from 'react';
import Navbar from './components/navbar/navbar.component';
import Sidebar from './components/sidebar/sidebar.component';
import MovieCard from './components/moviecard/moviecard.component';
import Button from './components/button/button.component';
import { MoviesContext } from './contexts/contexts';
import './App.css';
import customFetch from './utils/customFetch';

export default function App() {
  const movies = useContext(MoviesContext);
  const [currentGenre, setCurrentGenre] = useState('Popular');

  const onGenreChange = (selectedGenre: string) => setCurrentGenre(selectedGenre);

  const fetchNewPage = async (page: number) => {
    const endpoint = `?page=${page}`;
    const newPageData = await customFetch(endpoint);
    movies.updateData(newPageData);
  }

  const onPageChange = (e: MouseEvent<HTMLButtonElement>) => {
    const direction = e.currentTarget.dataset.direction;
    const currentPage = movies.data.page;
    
    if(direction === 'prev') {
      if(currentPage === 1) return;
      fetchNewPage(currentPage - 1);
    }
    if(direction === 'next') {
      if(!movies.data.next) return;
      fetchNewPage(currentPage + 1);
    }
  }

  return (
    <>
      <Navbar />
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
    </>
  )
}
