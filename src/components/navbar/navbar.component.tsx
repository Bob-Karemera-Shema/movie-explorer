import Searchbar from './searchbar/searchbar.component';
import './navbar.component.css';

export default function Navbar() {
  return (
    <nav className='navbar-container'>
        <p className='navbar-logo'>wat<span className='navbar-logo-highlight'>ch</span></p>
        <Searchbar />
    </nav>
  )
}
