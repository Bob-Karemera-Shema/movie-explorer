import { useState, type ChangeEvent } from 'react';
import { IoIosSearch } from "react-icons/io";
import { testData } from '../../../assets/data/test-data';
import './searchbar.component.css';

const Searchbar = () => {
  const [search, setSearch] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(testData.results.filter(movie => movie.titleText.text.toLowerCase().includes(e.target.value.toLowerCase())));
  }

  const handleSearch = () => {}

  return (
    <div className='searchbar-container'>
      <input
        className='serchbar-input'
        type='text'
        placeholder='Search . . .'
        value={search}
        onChange={handleChange}
      />
      <IoIosSearch className='searchbar-button' onClick={handleSearch} />
    </div>
  )
}

export default Searchbar;