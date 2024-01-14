import { getUserId } from "./auth"
import { prisma } from "./db"

// Utilities called from server actions. An alternative to calling the API from client
export async function deleteMovie(id: number) {
    const userId = await getUserId()
    const movieToDelete = await prisma.movie.delete({
        where: {
            id: id,
            userId: userId
        }
    })

    return movieToDelete
}

export async function updateMovie(id: number, title: string, year: number, description: string) {
    const userId = await getUserId()
    const updatedMovie = await prisma.movie.update({
        where: {
            id: id,
            userId: userId
        },
        data: {
            title: title,
            year: year,
            description: description
        }
    })
    return updatedMovie
}

export async function reviewMovie(id: number, score: number, text: string | null) {
    const userId = await getUserId()

    //TODO: Don't just throw...
    if (score < 0 || score > 19) { 
        throw new Error('Score must be between 0 and 19')
    }
    
    const updatedReview = await prisma.review.upsert({
        where: {
            userId_movieId: {
                movieId: id,
                userId: userId
            }
        },
        create: {
            score: score,
            reviewText: text,
            userId: userId,
            movieId: id
        }, 
        update: {
            score: score,
            reviewText: text
        }


    })

    return updatedReview
}

export async function deleteMovieReview(movieId: number) {
    const userId = await getUserId()

    const deletedReview = await prisma.review.delete({
        where: {
            userId_movieId: {
                movieId: movieId,
                userId: userId
            }
        }
    })
    return deletedReview
}


export async function createEvent(title: string, description: string, plannedDate: Date, theme: string ) {

    const userId = await getUserId()

    const createdEvent = await prisma.event.create({
        data: {
            userId: userId,
            title,
            description,
            plannedDate,
            theme,
        }
    })

    return createdEvent

}

export async function associateMoviesWithEvent(eventId: number, movieIds: Array<number>) {
    if (movieIds.length == 0) {
        return 0
    }

    const userId = await getUserId()

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


    return result.count
}