import { Movie } from '@/utils/types';
import { NextRequest } from 'next/server';

//TODO: move this elsewhere, since sometimes server would benefit from calling the functions directly
//TODO: should I store the environment variables just once outside of the functions?
export async function fetchMoviesDetailFromExternalAPI(
  movieAPIIds: number[]
): Promise<Movie[]> {
  // Will have to do 1 request for each movie, I believe...
  if (movieAPIIds.length > 5) {
    return [];
  }
  const access_token = process.env['MOVIE_ACCESS_TOKEN'];

  const promises = movieAPIIds.map((id) =>
    fetch(`https://api.themoviedb.org/3/movie/${movieAPIIds[0]}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
  );

  const responses = await Promise.all(promises);
  const jsonResponses = await Promise.all(responses.map((r) => r.json()));
  // First: test that this works with one movie

  console.log('full JSON response: ', JSON.stringify(jsonResponses, null, 2));
  const result = (jsonResponses as any[]).map((fullMovie) => ({
    adult: fullMovie.adult,
    genre_ids: fullMovie.genre_ids,
    id: fullMovie.id,
    original_language: fullMovie.original_language,
    original_title: fullMovie.original_title,
    overview: fullMovie.overview,
    release_date: fullMovie.release_date,
    title: fullMovie.title
  })) as Array<Movie>;

  console.log('cleaner result: ', JSON.stringify(result, null, 2));
  return result;
}

export async function POST(req: NextRequest) {
  const access_token = process.env['MOVIE_ACCESS_TOKEN'];

  // TODO: Use the dynamically provided value
  const reqBody = await req.json();
  const query = encodeURIComponent(reqBody.partialName);
  // URL encode!

  const something = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=true`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    }
  );

  const jsonResponse = await something.json();

  const foundMovies: Array<any> = jsonResponse.results;

  const filteredMovies = foundMovies.slice(0, 6).map((fullMovie) => ({
    adult: fullMovie.adult,
    genre_ids: fullMovie.genre_ids,
    id: fullMovie.id,
    original_language: fullMovie.original_language,
    original_title: fullMovie.original_title,
    overview: fullMovie.overview,
    release_date: fullMovie.release_date,
    title: fullMovie.title
  })) as Array<Movie>;

  return Response.json(
    {
      data: {
        movies: filteredMovies
      }
    },
    {
      status: 200
    }
  );
}
