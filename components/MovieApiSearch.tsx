'use client'

import { getMoviesFromExternalAPI } from "@/utils/api"
import { Movie } from "@/utils/types"
import { ChangeEvent, useEffect, useState } from "react"

interface MovieApiSearchProps {
    completeMovieInformationCallBack: (title: string, year: number, description: string) => void
}

export default function MovieApiSearch({completeMovieInformationCallBack}: MovieApiSearchProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [possibleMovies, setPossibleMovies] = useState<Array<Movie>>([])

    function handleSearchTermChange (e: ChangeEvent<HTMLInputElement>) {
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


    function fillInMovieInformation(id: number) {
        const movie = possibleMovies.find(m => m.id === id);
        if (movie == null) return;
        const year = (new Date(movie.release_date)).getFullYear()
        completeMovieInformationCallBack(movie.title, year, movie.overview)
    }


    return <div className="py-2 px-2 m-10 mb-20 border-black flex flex-col items-center justify-stretch">
        <input
            className="p-5 w-full"
         type="text" placeholder="Search for the movie by name!"
         value={searchTerm}
        onChange={handleSearchTermChange}
         />

         {possibleMovies.length > 0 && (
            <ul>
                {possibleMovies.map(movie => (
                <li key={movie.id}>
                    <SearchResult title={movie.title} id={movie.id} releaseDate={movie.release_date} handleClick={fillInMovieInformation} />
                </li>))}
            </ul>
         )}
    </div>
}

interface SearchResultProps {
    id: number,
    title: string,
    releaseDate: string,
    handleClick: (id: number) => void
}

// TODO: on hover, show the description after a while?
function SearchResult({title, releaseDate, id, handleClick}: SearchResultProps) {


    return <div
        className="px-3 py-2 border-red-600 border-2 cursor-pointer"
    onClick={() => handleClick(id)}>
        <p>{title} ({releaseDate})</p>
    </div>
}