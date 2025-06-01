import type React from 'react';

import { useAppSelector } from '../../store/hooks';
import { selectGenres } from '../../store/moviesSlice';

import './sidebar.component.css';
import { useSearchParams } from 'react-router';

const Sidebar = () => {
  const genres = useAppSelector(selectGenres);
  const [searchParams, setSearchParams] = useSearchParams();

  const clickHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.tagName.toLowerCase() === 'span' && target.dataset.index && genres) {
      const index = parseInt(target.dataset.index);

      const updatedParams = new URLSearchParams(searchParams);

      if (index === 0) {
        updatedParams.delete('genre'); // Popular = no specific genre
      } else {
        updatedParams.set('genre', genres[index]);
      }
      
      updatedParams.set('page', '1');

      setSearchParams(updatedParams);
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