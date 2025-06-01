import { Link } from 'react-router';
import Searchbar from '../searchbar/searchbar.component';
import './navbar.component.css';

const Navbar = () => {
  return (
    <nav className='navbar-container'>
        <Link to='/' className='navbar-logo'>wat<span className='navbar-logo-highlight'>ch</span></Link>
        <Link to='/watchlist' className='nav-link'>Watchlist</Link>
        <Searchbar />
    </nav>
  )
}

export default Navbar;
