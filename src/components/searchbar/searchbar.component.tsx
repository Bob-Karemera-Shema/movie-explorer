import { useState, type FormEvent } from 'react';

import { IoIosSearch } from "react-icons/io";
import Button from '../button/button.component';

import './searchbar.component.css';
import { useSearchParams } from 'react-router';

const Searchbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = useState('');

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = title.trim();
    if(!query) return;

    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('search', query);
    updatedParams.set('page', '1');

    setSearchParams(updatedParams);
    setTitle('');
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