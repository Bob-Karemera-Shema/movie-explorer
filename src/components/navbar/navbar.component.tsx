import Searchbar from '../searchbar/searchbar.component';
import './navbar.component.css';

const Navbar = () => {
  return (
    <nav className='navbar-container'>
        <p className='navbar-logo'>wat<span className='navbar-logo-highlight'>ch</span></p>
        <Searchbar />
    </nav>
  )
}

export default Navbar;
