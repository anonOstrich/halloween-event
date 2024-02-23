import { fetchMoviesDetailFromExternalAPI } from '@/app/api/movies/search/route';
import errorMessage from '@/app/api/utils/responses';
import {
  MovieDetails,
  MovieDetailsWithId,
  MovieDetailsWithMovieDBId,
  parseMovieDetailsArray
} from '@/app/api/utils/type-utils';
import { getUserId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { Movie } from '@/utils/types';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();

  const eventId = Number(params.id);
  const body = await req.json();

  let information: MovieDetails[] | null = null;
  // TODO: a global error handler, throw errors with message and status code => return errorMessage with those details.
  try {
    information = parseMovieDetailsArray(body.movieIds);
  } catch (e: any) {
    return errorMessage(e.message, 400);
  }

  if (information.length > 10) {
    //TODO: choose a limit, warn on the client side as well
    return errorMessage('You can only add 10 movies at a time', 400);
  }

  // 1. CHECK THAT ALL THE ID MOVIES ARE VALID
  const moviesWithIds = information.filter(
    (m) => 'id' in m
  ) as MovieDetailsWithId[];
  const countInDatabase = await prisma.movie.count({
    where: {
      id: {
        in: moviesWithIds.map((m) => m.id)
      }
    }
  });

  if (countInDatabase < moviesWithIds.length) {
    return errorMessage('Some of the movies are not in the database', 400);
  }

  // 2. FIGURE OUT WHICH EXTERNAL MOVIES ARE ALREADY IN THE DATABASE
  const moviesWithMovieDBIds = information.filter(
    (m) => 'movieDBId' in m
  ) as MovieDetailsWithMovieDBId[];

  const externalIdMoviesAlreadyInDB = await prisma.movie.findMany({
    where: {
      movieDBId: {
        in: moviesWithMovieDBIds.map((m) => m.movieDBId)
      }
    }
  });

  console.log('externalIdMoviesAlreadyInDB', externalIdMoviesAlreadyInDB);

  // 3. CREATE THE MOVIES THAT ARE NOT IN THE DATABASE
  const moviesToCreate = moviesWithMovieDBIds.filter(
    (m) =>
      !externalIdMoviesAlreadyInDB.map((m) => m.movieDBId).includes(m.movieDBId)
  );

  console.log('moviesToCreate', moviesToCreate);

  let moviesToCreateDetails: Movie[] | null = null;

  try {
    moviesToCreateDetails = await fetchMoviesDetailFromExternalAPI(
      moviesToCreate.map((m) => m.movieDBId)
    );
  } catch (e) {
    return errorMessage(
      'Could not fetch the movies from the external API',
      500
    );
  }

  const createdMovies = await prisma.movie.createMany({
    data: moviesToCreateDetails.map((m) => ({
      movieDBId: m.id,
      title: m.title,
      description: m.overview,
      year: Number(m.release_date.split('-')[0]),
      userId
    }))
  });

  if (createdMovies.count !== moviesToCreate.length) {
    console.error('Could not create all the movies...');
  }

  const createdMovieIds = await prisma.movie.findMany({
    where: {
      movieDBId: {
        in: moviesToCreate.map((m) => m.movieDBId)
      }
    },
    select: {
      id: true
    }
  });

  const allIdsToAssociate = [
    ...moviesWithIds.map((m) => m.id),
    ...externalIdMoviesAlreadyInDB.map((m) => m.id),
    ...createdMovieIds.map((m) => m.id)
  ];

  // 4. ASSOCIATE THE MOVIES WITH THE EVENT
  // What if a movie is already associated with the event? Just ignore is a working initial solution
  const result = await prisma.movieEvent.createMany({
    data: allIdsToAssociate.map((movieId) => ({
      eventId: eventId,
      movieId: movieId,
      userId: userId
    })),
    skipDuplicates: true
  });

  // 5. RETURN THE NUMBER OF MOVIES ASSOCIATED SUCCESSFULLY
  return Response.json(
    {
      data: result.count
    },
    {
      status: 200
    }
  );
}
