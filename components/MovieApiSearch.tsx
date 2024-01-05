'use client'

import { getMoviesFromExternalAPI } from "@/utils/api"
import { Movie } from "@/utils/types"
import { ChangeEvent, useEffect, useState } from "react"

const TIMEOUT_DELAY_IN_MS = 2_000

interface MovieApiSearchProps {
    completeMovieInformationCallBack: (title: string, year: number, description: string) => void
}

export default function MovieApiSearch({completeMovieInformationCallBack}: MovieApiSearchProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [possibleMovies, setPossibleMovies] = useState<Array<Movie>>([])
    // It's nicer to hide but keep them 'open' in certain situations (examining the filled information)
    const [possibleMoviesVisible, setPossibleMoviesVisible] = useState(true)
    //TODO:  NodeJS is probably not the exact type I'm looking for, if this is run on the client...
    const [pollTimeout, setPollTimeout] = useState<NodeJS.Timeout | null>(null);

    function handleSearchTermChange (e: ChangeEvent<HTMLInputElement>) {
        setSearchTerm(e.target.value)
    }

    async function updatePossibilities() {
        // console.log('UPDATING POSSIBILITIES: A COSTLY OPERATION')
        const result = await getMoviesFromExternalAPI(searchTerm)
        setPossibleMovies(result)
    }

    useEffect(() => {
        if (pollTimeout != null) {
            clearTimeout(pollTimeout)
        }
        if (searchTerm.trim().length > 0) {
            
            const handle = setTimeout(updatePossibilities, TIMEOUT_DELAY_IN_MS)
            setPollTimeout(handle);
            // updatePossibilities()
        } else {

            // Just instantly set to no options? 
            setPossibleMovies([])
        }

        return () => {
            if (pollTimeout != null) {
                clearTimeout(pollTimeout)
            }
        }
    }, [searchTerm])


    function fillInMovieInformation(id: number) {
        const movie = possibleMovies.find(m => m.id === id);
        if (movie == null) return;
        const year = (new Date(movie.release_date)).getFullYear()
        setPossibleMoviesVisible(false)
        completeMovieInformationCallBack(movie.title, year, movie.overview)
    }


    return <div className=" py-2 px-2 m-10 mb-20 border-black flex flex-col items-center justify-stretch">
        <input
            className="p-5 w-full"
         type="text" placeholder="Search for the movie by name!"
         value={searchTerm}
        onChange={handleSearchTermChange}
        onFocus={() => {setPossibleMoviesVisible(true)}}
         />
        
        {
            /**
             * TODO: Make a scrollable list
             */
        }
        <div className={`relative w-full ${possibleMoviesVisible ? '' : 'hidden'}`}>
        {possibleMovies.length > 0 && (
            <ul className="absolute text-black bg-white black top-100%">
                {possibleMovies.map(movie => (
                <li key={movie.id}>
                    <SearchResult title={movie.title} id={movie.id} releaseDate={movie.release_date} handleClick={fillInMovieInformation} />
                </li>))}
            </ul>
         )}
        </div>

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
        className="px-3 py-2 border-red-600 border-2 cursor-pointer hover:bg-gray-200"
    onClick={() => handleClick(id)}>
        <p>{title} ({releaseDate})</p>
    </div>
}