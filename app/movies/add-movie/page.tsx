import MovieApiSearch from "@/components/MovieApiSearch"
import { prisma } from "@/utils/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

// Trying out a server action instead of using the REST api
async function handleAddMovie(data: FormData) {
    'use server'
    const title = data.get('title')
    const year = data.get('year')
    const description = data.get('description')

    if (!title || !year || !description) {
        return
    }

    const { userId: clerkId } = auth()

    const user = await prisma.user.findFirst({
        where: {
            clerkId: clerkId!
        }
    })

    await prisma.movie.create({
        data: {
            userId: user!.id,
            title: title.toString(),
            year: Number(year.toString()),
            description: description.toString(),

        }
    })
    redirect('/movies')
    console.log(title, year, description)
    console.log("Someone added a movie :)))")
}


export default async function AddMoviePage() {
    const currentYear = (new Date()).getFullYear()
    console.log("Where does this log? A: the server")

    return <main className="max-w-2xl mx-auto">
        <p>TODO: Ohjeistus. (Minkälainen on hyvä? Mitä toiveita on elokuville? Mitä rajoja ihmisillä on elokuville?)</p>
        <MovieApiSearch />
        <form action={handleAddMovie} className="flex flex-col gap-10">
            <div className="flex justify-center gap-4">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" type="text" required />
            </div>

            <div className="flex justify-center gap-4">
                <label htmlFor="year">Year</label>
                <input id="year" name="year" type="number" min={1880} max={currentYear} required />
            </div>

            <div className="flex justify-center gap-4">
                <label htmlFor="description" className="align-self-center self-center">Description</label>
                <textarea name="description" id="description" required></textarea>

            </div>

            <button type="submit" className='button'>Submit</button>
        </form></main>
}