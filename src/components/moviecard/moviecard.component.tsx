import type { FC, SyntheticEvent } from 'react';
import type { IMovie } from '../../utils/types';
import placeholder from '../../assets/placeholder.jpg';
import './moviecard.component.css';

interface MovieCardProps {
  movie: IMovie
}

const MovieCard: FC<MovieCardProps> = ({movie}) => {
  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = placeholder;
  };

  return (
    <div className='movie-card'>
      <div className="movie-image-container">
        <img className='movie-image' src={movie.primaryImage ? movie.primaryImage.url : placeholder} onError={handleError} alt={movie.originalTitleText.text} />
      </div>
      <div className="movie-info-container">
        <p className='movie-name'>{movie.originalTitleText.text}</p>
        <p className='movie-extra-details'>{movie.releaseYear?.year}</p>
        <p className='movie-extra-details'>Rating: {movie.rating?.averageRating}</p>
      </div>
    </div>
  )
};

export default MovieCard;