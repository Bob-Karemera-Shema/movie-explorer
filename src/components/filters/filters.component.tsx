import type { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router';
import './filters.component.css';

const Filters = () => {
    const [searchParams , setSearchParams] = useSearchParams();
    const currentType = searchParams.get('titleType') ?? 'movie'

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newFilter = e.target.value;
        
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.set('titleType', newFilter);
        updatedParams.set('page', '1');

        setSearchParams(updatedParams);
    }

    return (
        <select value={currentType} onChange={handleChange}>
            <option value='' disabled></option>
            <option value='movie'>Movies</option>
            <option value='tvSeries'>Series</option>
        </select>
    )
}

export default Filters;