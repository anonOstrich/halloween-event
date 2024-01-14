import Review from "@/components/Review"
import ReviewSummary from "@/components/ReviewSummary"
import { getUserId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { deleteMovie } from "@/utils/server-actions"
import { Movie } from "@prisma/client"
import Link from "next/link"
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
    const userId = await getUserId()

    const userAllowedToModify = userId === user.id

    return <main className="flex flex-col justify-between max-w-2xl mx-auto gap-10">
        {
            userAllowedToModify && (<div className="absolute top-[15%] right-10">
                <DeleteMovieComponent movieId={movie.id} />
                <UpdateMovieComponent movie={movie} />
            </div>)
        }

        <article className="bg-gray-700 px-5 py-5 border-2 rounded-md flex flex-col gap-5">
            <h2>{movie.title}</h2>
            <p>Year: {movie.year}</p>
            <p>Description: {movie.description}</p>
            <p>Added by: {user.email}</p>
        </article>

        <Review movieId={movie.id} />
        <ReviewSummary movie={movie} />
    </main>
}


async function handleDeletion(data: FormData) {
    'use server'
    const something = data.get('movie-id')
    // Better type check would be in order
    const movieId = Number(something?.valueOf())
    const deletedMovie = await deleteMovie(movieId);
    return redirect("/movies")
}

interface DeleteMovieComponentProps {
    movieId: number
}

// This needs to consider cursor on the whole
function DeleteMovieComponent({ movieId }: DeleteMovieComponentProps) {
    return <div className="mx-5 my-5 bg-red-200 rounded-full min-w-[50px] min-h-[50px] flex justify-center align-middle">
        <form action={handleDeletion} className="flex justify-center align-middle">
            <input type="hidden" name="movie-id" value={movieId} />
            <button className="text-black" type="submit">X</button>
        </form>
    </div>
}


interface UpdateMovieComponentProps {
    movie: Movie
}

function UpdateMovieComponent({ movie }: UpdateMovieComponentProps) {
    const { title, id } = movie

    // Relate to the position of the delete button: maybe they should be in the same container, even?
    return (<Link href={`/movies/${id}/edit`} className="block border-2 border-white p-3">Update</Link>)
}