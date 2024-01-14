import { getUserId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest, {params}: {params: {id: string}}){
    const eventId = Number(params.id)
    const body = await req.json()
    const userId = await getUserId()


    const movieIds = (body.movieIds as any[]).map(x => Number(x))


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

    const newMovieIdsToAssociate = movieIds.filter((movieId) => !alreadyAssociatedIds.includes(movieId))

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