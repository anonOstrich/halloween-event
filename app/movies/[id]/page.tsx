import Reaction from "@/components/Reaction"
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


    const reaction = await prisma.reaction.findFirst({
        where: {
            movieId: movie.id,
            userId: user.id
        }
    })



    return <main className="flex justify-between max-w-2xl mx-auto">
        <article>
            <h2>{movie.title}</h2>
            <p>Year: {movie.year}</p>
            <p>Description: {movie.description}</p>
            <p>Added by: {user.email}</p>
        </article>

        {<Reaction reaction={reaction} movieId={movie.id} />}
    </main>
}