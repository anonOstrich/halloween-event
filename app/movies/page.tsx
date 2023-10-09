/* eslint-disable react/jsx-key */
import MovieCard from "@/components/MovieCard"
import { prisma } from "@/utils/db"
import Link from "next/link"


export default async function Movies() {

    const movies = await prisma.movie.findMany({
        take: 10
    })

    const moviesComponent = movies.length == 0 ? <h3>No movies :/</h3> : <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {movies.map(m => <li><MovieCard movie={m} /></li>)}
    </ul>

    return <section>
        <Link href="/movies/add-movie"><button className="button">Add a new movie 🎞️</button></Link>
        {moviesComponent}
    </section>
}