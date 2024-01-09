import { prisma } from "./db"

// Utilities called from server actions. An alternative to calling the API from client
export async function deleteMovie(id: number) {
    const movieToDelete = await prisma.movie.delete({
        where: {
            id: id
        }
    })

    return movieToDelete
}