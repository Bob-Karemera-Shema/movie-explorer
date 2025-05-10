import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { GenreContext } from "./contexts";
import { type IGenreApiResponse } from "../utils/types";
import customFetch from "../utils/customFetch";

const GenreProvider: FC<PropsWithChildren> = ({children}) => {    
    const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    async function getGenres() {
      const response: IGenreApiResponse | undefined = await customFetch('/utils/genres');
      if(response?.results) setGenres(response.results);
    }

    getGenres();
  }, []);

    return (
        <GenreContext.Provider value={genres}>
            {children}
        </GenreContext.Provider>
    )
}

export default GenreProvider;