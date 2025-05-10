import type React from 'react';
import { useContext } from 'react';
import { GenreContext, MoviesContext } from '../../contexts/contexts';
import customFetch from '../../utils/customFetch';
import './sidebar.component.css';

interface SidebarProps {
  onGenreChange: (selectedGenre: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ onGenreChange }) => {
  const genres = useContext(GenreContext);
  const movies = useContext(MoviesContext);

  const clickHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.tagName.toLowerCase() === 'span') {
      if (target.dataset.index) {
        const index = parseInt(target.dataset.index);
        onGenreChange(genres[index]);

        const genreMovies = await customFetch(`/titles?genre=${genres[index]}`);
        console.log(genreMovies);
        movies.updateData(genreMovies);
      }
    }
  }

  return (
    <div className='sidebar' onClick={clickHandler}>
      {
        genres.map((genre, index) => (
          genre && <span key={index} data-index={index} className='filter'>{genre}</span>
        ))
      }
    </div>
  )
}

export default Sidebar;