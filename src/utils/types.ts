export interface IMovie {
  _id: string;
  id: string;
  primaryImage: {
    id: string;
    width: number;
    height: number;
    url: string;
    caption: {
      plainText: string;
      __typename: string;
    };
    __typename: string;
  } | null;
  titleType: {
    text: string;
    id: string;
    isSeries: boolean;
    isEpisode: boolean;
    __typename: string;
  };
  titleText: {
    text: string;
    __typename: string;
  };
  originalTitleText: {
    text: string;
    __typename: string;
  };
  releaseYear: {
    year: number;
    endYear: number | null;
    __typename: string;
  };
  releaseDate: {
    day: number | null;
    month: number | null;
    year: number;
    __typename: string;
  } | null;
  rating?: {
    tconst: string;
    averageRating: number;
    numVotes: number;
  };
}
export interface IMoviesApiResponse {
  page: number;
  prev?: string;
  next: string;
  entries: number;
  results: IMovie[];
}

export interface ITitleIdApiResponse {
  results: IMovie
}

export interface IGenreApiResponse {
  results: string[];
}

export interface IRatingApiResponse {
  results: {
    tconst: string
    averageRating: number
    numVotes: number
  }
}

export interface IMovieContext {
  data: IMoviesApiResponse;
  loading: boolean;
  error: string | null;
  updateData: (newData: IMoviesApiResponse) => void;
  startLoadingState: () => void;
}