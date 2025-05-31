import type React from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectGenres, updatePageTitle } from '../../store/moviesSlice';
import { fetchMovies } from '../../store/thunks';

import './sidebar.component.css';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const genres = useAppSelector(selectGenres);

  const clickHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.tagName.toLowerCase() === 'span') {
      if (target.dataset.index && genres) {
        const index = parseInt(target.dataset.index);
        const selectedGenre = index === 0 ? 'All' : genres[index];
        const url = index === 0 ? '/titles' : `/titles?genre=${genres[index]}`;

        dispatch(updatePageTitle(selectedGenre))
        dispatch(fetchMovies(url));
      }
    }
  };

  return (
    <div className='sidebar' onClick={clickHandler}>
      {
        genres && genres.map((genre, index) => (
          genre ? <span key={genre} data-index={index} className='filter'>{genre}</span> :
            <span key='all' data-index={index} className='filter'>All</span>
        ))
      }
    </div>
  )
}

export default Sidebar;