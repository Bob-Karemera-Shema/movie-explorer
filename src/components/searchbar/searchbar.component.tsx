import { useState, type FormEvent } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { fetchMovies } from '../../store/thunks';
import { updatePageTitle } from '../../store/moviesSlice';

import { IoIosSearch } from "react-icons/io";
import Button from '../button/button.component';

import './searchbar.component.css';

const Searchbar = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updatePageTitle(`Search results "${title}"`))
    dispatch(fetchMovies(`/titles/search/title/${title}?exact=false&titleType=movie`));
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