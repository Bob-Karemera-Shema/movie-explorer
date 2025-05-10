import { genres } from '../../assets/data/genre';
import './sidebar.component.css';

export default function Sidebar() {
  return (
    <div className='sidebar'>
      {
        genres.results.map((genre, index) => (
          genre ? <span key={index} className='filter'>{genre}</span> : null
        ))
      }
    </div>
  )
}
