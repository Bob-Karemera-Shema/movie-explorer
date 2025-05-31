import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import customFetch from "../utils/customFetch";
import { type IMovie, type IMovieApiResponse } from "../utils/types";
import { MoviesContext } from "./contexts";

function getPrevPage(url: string | undefined, current: number) {
    if (!url || !url.includes('?')) return '';

    const [path, queryStr] = url.split('?');
    const prev = Math.max(1, current - 1);
    const params = new URLSearchParams(queryStr);
    params.set('page', prev.toString());
    return `${path}?${params.toString()}`;
}

function getMovieRatings(movies: IMovie[]) {
    const moviesWithRatings = movies.map(async (movie) => {
        const rating = await customFetch(`/titles/${movie.id}/ratings`);
        return {
            ...movie,
            rating: { ...rating.results }
        }
    });

    return moviesWithRatings;
}

const MoviesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [data, setData] = useState<IMovieApiResponse>({
        page: 0,
        next: '',
        entries: 0,
        results: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startLoadingState = () => setLoading(true);

    const updateData = async (newData: IMovieApiResponse) => {
        setLoading(true);
        setError(null);

        try {
            const resultsWithRatings = await Promise.all(getMovieRatings(newData.results));
            const prev = getPrevPage(newData.next, newData.page);

            setData({
                ...newData,
                prev,
                results: resultsWithRatings
            });
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An unknown error occured');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getInitialMovies = async () => {
            setLoading(true);
            setError(null);

            try {
                const response: IMovieApiResponse | undefined = await customFetch('/titles');
                if (response) {
                    updateData(response);
                };
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : 'An unknown error occured');
            } finally {
                setLoading(false);
            }
        }

        getInitialMovies();
    }, []);

    const value = { data, loading, error, updateData, startLoadingState };

    return (
        <MoviesContext.Provider value={value}>
            {children}
        </MoviesContext.Provider>
    )
}

export default MoviesProvider;