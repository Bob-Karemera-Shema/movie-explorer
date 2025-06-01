import type { FC, PropsWithChildren, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';
import type { IMovie } from '../../utils/types';
import placeholder from '../../assets/placeholder.jpg';
import './moviecard.component.css';

interface MovieCardProps {
  movie: IMovie
  withClickNavigation?: boolean
}

const MovieCard: FC<PropsWithChildren<MovieCardProps>> = ({ movie, withClickNavigation, children }) => {
  const navigate = useNavigate();

  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = placeholder;
  };

  const clickHandler = () => {
    if(withClickNavigation) navigate(`/movie/${movie.id}`);
  }

  return (
    <div className='movie-card' onClick={clickHandler}>
      <div className="movie-image-container">
        <img className='movie-image' src={movie.primaryImage ? movie.primaryImage.url : placeholder} onError={handleImageError} alt={movie.originalTitleText.text} />
      </div>
      <div className="movie-info-container">
        <p className='movie-name'>{movie.originalTitleText.text}</p>
        {movie.releaseYear?.year && <p className='movie-extra-details'>{movie.releaseYear.year}</p>}
        {movie.rating?.averageRating && <p className='movie-extra-details'>Rating: {movie.rating.averageRating}</p>}
        {children}
      </div>
    </div>
  )
};

export default MovieCard;