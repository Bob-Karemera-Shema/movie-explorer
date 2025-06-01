import { Link } from 'react-router';
import Searchbar from '../searchbar/searchbar.component';
import './navbar.component.css';

const Navbar = () => {
  return (
    <nav className='navbar-container'>
      <div className='navlinks'>
        <Link to='/' className='navbar-logo'>wat<span className='navbar-logo-highlight'>ch</span></Link>
        <div>
          <Link to='/' className='navlink'>Home</Link>
          <Link to='/watchlist' className='navlink'>Watchlist</Link>
        </div>
      </div>
      <Searchbar />
    </nav>
  )
}

export default Navbar;
