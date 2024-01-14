'use client'

import { getMoviesFromExternalAPI } from "@/utils/api"
import { Movie } from "@/utils/types"
import debounce from "debounce-promise"
import AsyncSelect from "react-select/async"

const TIMEOUT_DELAY_IN_MS = 500

interface MovieApiSearchProps {
    completeMovieInformationCallBack: (title: string, year: number, description: string) => void
}

export default function MovieApiSearch({ completeMovieInformationCallBack }: MovieApiSearchProps) {

    function fillInMovieInformation(movie: Movie | null) {
        if (movie == null) return;
        const year = (new Date(movie.release_date)).getFullYear()
        completeMovieInformationCallBack(movie.title, year, movie.overview)
    }

    const loadOptions = debounce(async (inputValue: string) => {
        if (inputValue.trim().length <= 0) {
            return []
        }
        const movies = await getMoviesFromExternalAPI(inputValue)
        return movies.map(m => ({
            value: m,
            label: m.title,
        }))
    }, TIMEOUT_DELAY_IN_MS)

    return (<div>
        <AsyncSelect
            name="movie-id"
            id="movie-id"
            cacheOptions
            loadOptions={loadOptions}
            isSearchable
            isClearable
            className="text-black"
            onChange={(e) => { fillInMovieInformation(e?.value ?? null) }}
            placeholder="Search for a movie by title"
        />
    </div>)


}
