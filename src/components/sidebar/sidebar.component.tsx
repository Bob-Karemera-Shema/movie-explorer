import type React from 'react';
import { useGetGenres } from '../../utils/hooks';
import './sidebar.component.css';

interface SidebarProps {
  onGenreChange: (selectedGenre: string) => void
}

const Sidebar:React.FC<SidebarProps> = ({onGenreChange}) => {
  const genres = useGetGenres();

  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    if(target.tagName.toLowerCase() === 'span') {
      if(target.dataset.index) {
        const index = parseInt(target.dataset.index);
        onGenreChange(genres[index]);
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