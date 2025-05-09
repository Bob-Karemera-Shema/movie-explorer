import Navbar from './components/navbar/navbar.component';
import Sidebar from './components/sidebar/sidebar.component';
import MovieCard from './components/moviecard/moviecard.component';
import { testData } from './assets/data/test-data';
import './App.css';

export default function App() {
  return (
    <>
      <Navbar />
      <div className='page-body'>
        <Sidebar />
        <div className="movies-section">
          <div className="movies-grid">
            {
              testData.results.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            }
          </div>
          <div className="pagination-container"></div>
        </div>
      </div>
    </>
  )
}
