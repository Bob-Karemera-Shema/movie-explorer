import Navbar from './components/navbar/navbar.component';
import MovieCard from './components/moviecard/moviecard.component';
import { testData } from './assets/test-data';
import './App.css';

export default function App() {
  return (
    <>
      <Navbar />
      {
        testData.results.map((movie, index) => <MovieCard key={index} movie={movie} />)
      }
    </>
  )
}
