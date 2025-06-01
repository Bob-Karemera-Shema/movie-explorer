import { useState, type FormEvent } from 'react';

import { IoIosSearch } from "react-icons/io";
import Button from '../button/button.component';

import './searchbar.component.css';
import { useNavigate } from 'react-router';

const Searchbar = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = title.trim();
    if(!query) return;

    setTitle('');
    
    // Navigate to search url
    navigate(`/titles?search=${encodeURIComponent(query)}&page=1`);
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