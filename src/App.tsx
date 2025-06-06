import { Routes, Route } from 'react-router';
import Container from './pages/container.page';
import './App.css';
import Home from './pages/home/home.page';
import Movie from './pages/movie/movie.page';
import WatchList from './pages/watchlist/watchlist.page';
import ScrollToTop from './components/scrollToTop';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Container />}>
          <Route index element={<Home />} />
          <Route path='movie/:id' element={<Movie />} />
          <Route path='watchlist' element={<WatchList />} />
        </Route>
      </Routes >
    </>
  );
}
