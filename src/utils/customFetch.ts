export default async function customFetch<T>(endpoint: string = ''): Promise<T> {
    const url = `https://moviesdatabase.p.rapidapi.com${endpoint}`;
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
        throw new Error('Missing/invalid RapidAPI key.');
    }

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com'
        }
    };

    let response: Response;
    try {
        response = await fetch(url, options);
    } catch (networkError) {
        throw new Error(`Network error: ${String(networkError)}`);
    }

    let data: T;
    try {
        data = await response.json();
    } catch {
        throw new Error('Failed to parse response as JSON.');
    }

    if (!response.ok) {
        throw new Error(`Fetch failed: ${JSON.stringify(data)}`);
    }

    return data;
}