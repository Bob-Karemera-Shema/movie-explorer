import type React from 'react';
import { useContext, useEffect } from 'react';
import { GenreContext, MoviesContext } from '../../contexts/contexts';
import customFetch from '../../utils/customFetch';
import './sidebar.component.css';

interface SidebarProps {
  onGenreChange: (selectedGenre: string) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onGenreChange, isOpen, toggle }) => {
  const genres = useContext(GenreContext);
  const movies = useContext(MoviesContext);

  const clickHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.tagName.toLowerCase() === 'span') {
      if (target.dataset.index) {
        const index = parseInt(target.dataset.index);
        const selectedGenre = index === 0 ? 'All' : genres[index];
        const url = index === 0 ? '/titles' : `/titles?genre=${genres[index]}`;

        movies.startLoadingState();
        onGenreChange(selectedGenre);
        const genreMovies = await customFetch(url);
        movies.updateData(genreMovies);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Cleanup just in case
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={toggle}></div>}
      <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={clickHandler}>
        <div className="sidebar-buttons">
          {
            isOpen && <button className='close-btn' onClick={toggle}>X</button>
          }
        </div>
        {
          genres.map((genre, index) => (
            genre ? <span key={genre} data-index={index} className='filter'>{genre}</span> :
              <span key='all' data-index={index} className='filter'>All</span>
          ))
        }
      </div>
    </>
  )
}

export default Sidebar;