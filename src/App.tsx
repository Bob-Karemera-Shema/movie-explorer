import Navbar from './components/navbar/navbar.component';
import Sidebar from './components/sidebar/sidebar.component';
import MovieCard from './components/moviecard/moviecard.component';
import Button from './components/button/button.component';
import { testData } from './assets/data/test-data';
import './App.css';

export default function App() {
  return (
    <>
      <Navbar />
      <div className='page-body'>
        <Sidebar />
        <div className="movies-section">
          <h1 className='main-header'>Movie Catalog</h1>
          <div className="movies-grid">
            {
              testData.results.map((movie) => <MovieCard key={movie.id} movie={movie} />)
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
