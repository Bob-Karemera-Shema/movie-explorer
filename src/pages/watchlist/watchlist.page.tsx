import Button from '../../components/button/button.component';
import MovieCard from '../../components/moviecard/moviecard.component';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeMovieFromList, selectWatchListMovies } from '../../store/watchlistSlice';
import './watchlist.page.css';

export default function WatchList() {
  const dispatch = useAppDispatch();

  const watchlist = useAppSelector(selectWatchListMovies);

  return (
    <main className='watchlist-page'>
      <section className="watchlist-section">
        <div className='watchlist-header'>
          <h1>Watchlist</h1>
        </div>
        {
          watchlist.length === 0 ? (
            <p>Your watchlist is empty!</p>
          ) : (
            <div className="watchlist-grid">
              {
                watchlist.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}>
                    <Button className='primary-button' onClick={() => dispatch(removeMovieFromList(movie.id))}>
                      Remove From Watchlist
                    </Button>
                  </MovieCard>
                ))
              }
            </div>
          )
        }
      </section>
    </main>
  )
}
