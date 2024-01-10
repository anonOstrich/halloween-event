import { getUserId } from "./auth"
import { prisma } from "./db"
import { convertNumberToScore } from "./score-utils"

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
    const convertedScore = convertNumberToScore(score)
    
    const updatedReview = await prisma.review.upsert({
        where: {
            userId_movieId: {
                movieId: id,
                userId: userId
            }
        },
        create: {
            score: convertedScore,
            reviewText: text,
            userId: userId,
            movieId: id
        }, 
        update: {
            score: convertedScore,
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