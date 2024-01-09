import Reaction from "@/components/Reaction"
import { prisma } from "@/utils/db"
import { deleteMovie } from "@/utils/server-actions"
import { redirect } from "next/navigation"


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



    return <main className="flex flex-col justify-between max-w-2xl mx-auto">
        <DeleteMovieComponent movieId={movie.id}  />
        <article>
            <h2>{movie.title}</h2>
            <p>Year: {movie.year}</p>
            <p>Description: {movie.description}</p>
            <p>Added by: {user.email}</p>
        </article>

        {<Reaction movieId={movie.id} />}
    </main>
}


async function handleDeletion(data: FormData) {
    'use server'
    const something = data.get('movie-id')
    console.log('logging something...', something)
    // Better type check would be in order
    const movieId = Number(something?.valueOf())
    const deletedMovie = await deleteMovie(movieId);
    return redirect("/movies")
}

interface DeleteMovieComponentProps {
    movieId: number
}

// This needs to consider cursor on the whole
function DeleteMovieComponent({movieId}: DeleteMovieComponentProps) {
    return <div className="absolute top-0 right-0 mx-5 my-5 bg-red-200 rounded-full min-w-[50px] min-h-[50px] flex justify-center align-middle">
        <form action={handleDeletion} className="flex justify-center align-middle">
            <input type="hidden" name="movie-id" value={movieId}/>
            <button className="text-black" type="submit">X</button>
        </form>
    </div>
}