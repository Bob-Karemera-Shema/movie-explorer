import { useEffect, useState } from "react";
import customFetch from "./customFetch";

interface GenreFetchResponse {
  results: string[];
}

export function useGetGenres() {
    const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    async function getGenres() {
      const response: GenreFetchResponse | undefined = await customFetch('/utils/genres');
      if(response?.results) setGenres(response.results);
    }

    getGenres();
  }, []);

  return genres
}