import { useContext, useState, type FormEvent } from 'react';
import { IoIosSearch } from "react-icons/io";
import Button from '../button/button.component';
import customFetch from '../../utils/customFetch';
import { MoviesContext } from '../../contexts/contexts';
import './searchbar.component.css';

const Searchbar = () => {
  const [title, setTitle] = useState('');
  const movies = useContext(MoviesContext);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    movies.startLoadingState();
    const searchData = await customFetch(`/titles/search/title/${title}?exact=false&titleType=movie`);
    movies.updateData(searchData);
  }

  return (
    <form className='searchbar-container' onSubmit={handleSearch}>
      <input
        className='serchbar-input'
        type='text'
        placeholder='Search . . .'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Button type='submit' className='secondary-button'>
        <IoIosSearch />
      </Button>
    </form>
  )
}

export default Searchbar;