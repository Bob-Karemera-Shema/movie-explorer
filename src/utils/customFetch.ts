export default async function customFetch(endpoint: string = '') {
    const url = `https://moviesdatabase.p.rapidapi.com${endpoint}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': import.meta.env.VITE_API_KEY,
            'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com'
        }
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Fetch failed: ${error.message}`);
    }
    
    return await response.json();
}