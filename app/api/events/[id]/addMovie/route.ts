import { fetchMoviesDetailFromExternalAPI } from "@/app/api/movies/search/route";
import { getUserId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextRequest } from "next/server";


interface NiceReturnType {
    externalIds: number[],
    createdIds: number[]
}

async function createMoviesIfNecessary(ids: number[], userId: number): Promise<NiceReturnType>{
    const movieIdsForExistingMovies = await prisma.movie.findMany({
        where: {
            id: {
                in: ids
            }
        },
        select: {
            id: true
        }
    })
    const existingIds = movieIdsForExistingMovies.map(m => m.id)

    const newMovieIdsToCreate = ids.filter((movieId) => !existingIds.includes(movieId))

    if (newMovieIdsToCreate.length == 0) {
        return  {
            externalIds: [],
            createdIds: []  
        }
    }

    const movieDetails = await fetchMoviesDetailFromExternalAPI(newMovieIdsToCreate)


    console.log("movieDetails: ", JSON.stringify(movieDetails, null, 2))

    let createdIds: number[] = []
    for (let movie of movieDetails) {
        const created = await prisma.movie.create({
            data: {
                title: movie.title,
                description: movie.overview,
                year: Number(movie.release_date.split('-')[0]),
                userId
            }
        })
        createdIds.push(created.id)
    }
    return {
        externalIds: newMovieIdsToCreate,
        createdIds
    }
}


export async function POST(req: NextRequest, {params}: {params: {id: string}}){
    const eventId = Number(params.id)
    const body = await req.json()
    const userId = await getUserId()


    // Might be movie ids or api ids
    const movieIds = (body.movieIds as any[]).map(x => Number(x))

    //TODO: choose a limit, warn on the client side as well
    if (movieIds.length > 10) {
        return Response.json({
            error: "You can only add 10 movies at a time"
        }, {
            status: 400
        })
    }

    const alreadyAssociatedIds = (await prisma.movieEvent.findMany({
        where: {
            eventId: eventId,
            movieId: {
                in: movieIds
            }
        },
        select: {
            movieId: true
        }
    }))
    .map(d => d.movieId)

    let newMovieIdsToAssociate = movieIds.filter((movieId) => !alreadyAssociatedIds.includes(movieId))


    const {
        createdIds,
        externalIds
    } = await createMoviesIfNecessary(newMovieIdsToAssociate, userId)

    // Don't want to associate the extenal ids!
    newMovieIdsToAssociate = newMovieIdsToAssociate.filter((movieId) => !externalIds.includes(movieId))

    //Do want to associate the created ids!
    newMovieIdsToAssociate = newMovieIdsToAssociate.concat(createdIds)


    const dataToInsert = newMovieIdsToAssociate.map((movieId) => ({
        eventId: eventId,
        movieId: movieId,
        userId: userId
    }))


    const result = await prisma.movieEvent.createMany({
        data: dataToInsert,
        // Skips: only in the new data, or also for the database? Experiment
        skipDuplicates: true
    })


    return Response.json({
        data: result.count
    }, 
    {
        status: 200
    })
}