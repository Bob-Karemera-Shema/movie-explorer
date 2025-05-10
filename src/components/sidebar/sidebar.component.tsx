import type React from 'react';
import './sidebar.component.css';
import { useContext } from 'react';
import { GenreContext } from '../../contexts/contexts';

interface SidebarProps {
  onGenreChange: (selectedGenre: string) => void
}

const Sidebar:React.FC<SidebarProps> = ({onGenreChange}) => {
  const genres = useContext(GenreContext)

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