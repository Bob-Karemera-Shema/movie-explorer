import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import customFetch from "../utils/customFetch";
import { type IMovieApiResponse } from "../utils/types";
import { MoviesContext } from "./contexts";

const MoviesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [data, setData] = useState<IMovieApiResponse>({
        page: 0,
        next: '',
        entries: 0,
        results: []
    });

    useEffect(() => {
        const getInitialMovies = async () => {
            const response: IMovieApiResponse | undefined = await customFetch();
            if (response) {
                const resultsWithRatings = await Promise.all(
                    response.results.map(async (movie) => {
                        const rating = await customFetch(`/${movie.id}/ratings`);
                        return {
                            ...movie,
                            rating: {...rating.results}
                        }
                    }));

                setData({
                    ...response,
                    results: resultsWithRatings
                })
            };
        }

        getInitialMovies();
    }, []);

    const updateData = (newData: IMovieApiResponse) => setData(newData);

    const value = { data, updateData };

    return (
        <MoviesContext.Provider value={value}>
            {children}
        </MoviesContext.Provider>
    )
}

export default MoviesProvider;