import type React from 'react';

import { useAppSelector } from '../../store/hooks';
import { selectGenres } from '../../store/moviesSlice';

import './sidebar.component.css';
import { useNavigate } from 'react-router';

const Sidebar = () => {
  const navigate = useNavigate()
  const genres = useAppSelector(selectGenres);

  const clickHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.tagName.toLowerCase() === 'span' && target.dataset.index && genres) {
        const index = parseInt(target.dataset.index);
        const url = index === 0 ? '/titles?page=1' : `/titles?genre=${genres[index]}&page=1`;

        navigate(url);
    }
  };

  return (
    <div className='sidebar' onClick={clickHandler}>
      {
        genres && genres.map((genre, index) => (
          genre ? <span key={genre} data-index={index} className='filter'>{genre}</span> :
            <span key='popular' data-index={index} className='filter'>Popular</span>
        ))
      }
    </div>
  )
}

export default Sidebar;