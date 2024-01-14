/* eslint-disable react/jsx-key */
import MovieCard from "@/components/MovieCard"
import { prisma } from "@/utils/db"
import Link from "next/link"


export default async function Movies() {

    //TODO: if many many movies, don't load them all at once
    const movies = await prisma.movie.findMany({})

    const moviesComponent = movies.length == 0 ? <h3>No movies :/</h3> : <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
        {movies.map(m => <li className="h-full" key={m.id}><MovieCard movie={m} /></li>)}
    </ul>

    return <section className="m-auto max-w-4xl flex flex-col items-center justify-between gap-5">
        <Link href="/movies/add-movie" className="border-2 border-white p-5 rounded-md hover:bg-gray-700">Add a new movie 🎞️</Link>
        {moviesComponent}
    </section>
}