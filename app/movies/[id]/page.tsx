import { prisma } from "@/utils/db"


export default async function MoviePage({ params }: { params: { id: string, } }) {
    const movieId = params.id

    const movie = await prisma.movie.findFirst({
        where: {
            // TODO: parse better. Throws an ugly error if user manually writes a non-number at the moment
            id: Number(movieId)
        },
        include: {
            user: true
        }
    })

    if (movie == null) {
        return <div>Cannot find movie by id {movieId} 🐅</div>
    }
    const user = movie.user

    return <div>
        <h2>{movie.title}</h2>
        <p>Year: {movie.year}</p>
        <p>Description: {movie.description}</p>
        <p>Added by: {user.email}</p>
    </div>
}