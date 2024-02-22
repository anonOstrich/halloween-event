export type MovieDetailsWithId = { id: number };
export type MovieDetailsWithMovieDBId = { movieDBId: number };

export type MovieDetails = MovieDetailsWithId | MovieDetailsWithMovieDBId;

const isMovieDetails = (
  movieDetails: unknown
): movieDetails is MovieDetails => {
  return (
    typeof movieDetails === 'object' &&
    ((movieDetails as any).id !== undefined &&
      typeof (movieDetails as any).id === 'number') !==
      ((movieDetails as any).movieDBId !== undefined &&
        typeof (movieDetails as any).movieDBId === 'number')
  );
};

export const parseMovieDetailsArray = (
  movieDetails: unknown
): MovieDetails[] => {
  if (!Array.isArray(movieDetails)) {
    throw new Error('Movie details should be an array');
  }
  for (let d of movieDetails) {
    if (!isMovieDetails(d)) {
      throw new Error('Movie details should be an array of movie details');
    }
  }

  return movieDetails;
};
