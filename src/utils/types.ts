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
  rating: {
    averageRating: number;
    numVotes: number;
  };
}

export interface IMovieApiResponse {
  page: number;
  next: string;
  entries: number;
  results: IMovie[];
}