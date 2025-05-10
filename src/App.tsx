import { useContext, useState } from 'react';
import Navbar from './components/navbar/navbar.component';
import Sidebar from './components/sidebar/sidebar.component';
import MovieCard from './components/moviecard/moviecard.component';
import Button from './components/button/button.component';
import { MoviesContext } from './contexts/contexts';
import './App.css';

export default function App() {
  const movies = useContext(MoviesContext);
  const [currentGenre, setCurrentGenre] = useState('Popular');

  const onGenreChange = (selectedGenre: string) => setCurrentGenre(selectedGenre);

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
            <Button>Prev</Button>
            <Button>Next</Button>
          </div>
        </div>
      </div>
    </>
  )
}
