import { createContext } from "react";
import type { IMovieContext } from "../utils/types";

export const MoviesContext = createContext<IMovieContext>({
    data: {
        page: 1,
        next: '',
        entries: 0,
        results: [],
    },
    loading: false,
    error: null,
    updateData: () => {},
    startLoadingState: () => {}
});

export const GenreContext = createContext<string[]>([]);