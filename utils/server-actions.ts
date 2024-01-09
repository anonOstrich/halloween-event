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