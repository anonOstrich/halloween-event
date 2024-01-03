'use client'

import { getMoviesFromExternalAPI } from "@/utils/api"
import { Movie } from "@/utils/types"
import { ChangeEvent, useEffect, useState } from "react"


export default function MovieApiSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const [possibleMovies, setPossibleMovies] = useState<Array<Movie>>([])

    function DoStuff (e: ChangeEvent<HTMLInputElement>) {
        console.log(e.target.value)
        setSearchTerm(e.target.value)
    }

    async function updatePossibilities() {
        const result = await getMoviesFromExternalAPI(searchTerm)
        setPossibleMovies(result)
    }

    useEffect(() => {
        if (searchTerm.trim().length > 0) {
            updatePossibilities()
        }
    }, [searchTerm])


    return <div className="py-2 px-2 m-10 mb-20 border-black flex items-center justify-stretch">
        <input
            className="p-5 w-full"
         type="text" placeholder="Search for the movie by name!"
         value={searchTerm}
        onChange={DoStuff}
         />

         {possibleMovies.length > 0 && (
            <ul>
                {possibleMovies.map(movie => (<li key={movie.id}>{movie.title}</li>))}
            </ul>
         )}
    </div>
}