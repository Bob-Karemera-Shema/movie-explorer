import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import customFetch from "../utils/customFetch";
import { type IMovieApiResponse } from "../utils/types";
import { MoviesContext } from "./contexts";

function getPrevPage(url:string | undefined, current: number) {
    if (!url || !url.includes('?')) return '';

    const [path, queryStr] = url.split('?');
    const prev = Math.max(1, current - 1);
    const params = new URLSearchParams(queryStr);
    params.set('page', prev.toString());
    return `${path}?${params.toString()}`;
}

const MoviesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [data, setData] = useState<IMovieApiResponse>({
        page: 0,
        next: '',
        entries: 0,
        results: []
    });

    useEffect(() => {
        const getInitialMovies = async () => {
            const response: IMovieApiResponse | undefined = await customFetch('/titles');
            if (response) {
                const resultsWithRatings = await Promise.all(
                    response.results.map(async (movie) => {
                        const rating = await customFetch(`/titles/${movie.id}/ratings`);
                        return {
                            ...movie,
                            rating: {...rating.results}
                        }
                    }));

                const prev = getPrevPage(response.next, response.page);

                setData({
                    ...response,
                    prev,
                    results: resultsWithRatings
                })
            };
        }

        getInitialMovies();
    }, []);

    const updateData = (newData: IMovieApiResponse) => {
        console.log(newData);
        const prev = getPrevPage(newData.next, newData.page);
        setData({
            ...newData,
            prev
        })
    };

    console.log(data);

    const value = { data, updateData };

    return (
        <MoviesContext.Provider value={value}>
            {children}
        </MoviesContext.Provider>
    )
}

export default MoviesProvider;