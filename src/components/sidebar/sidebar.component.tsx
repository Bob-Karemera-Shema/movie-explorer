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
        const selectedGenre = index === 0 ? 'All' : genres[index];
        const url = index === 0 ? '/titles' : `/titles?genre=${genres[index]}`;

        onGenreChange(selectedGenre);
        const genreMovies = await customFetch(url);
        movies.updateData(genreMovies);
      }
    }
  }

  return (
    <div className='sidebar' onClick={clickHandler}>
      {
        genres.map((genre, index) => (
          genre ? <span key={genre} data-index={index} className='filter'>{genre}</span> :
            <span key='all' data-index={index} className='filter'>All</span>
        ))
      }
    </div>
  )
}

export default Sidebar;