'use client'

import { addMoviesToEventClient, searchForMovieFromDatabase } from "@/utils/api";
import { Movie } from "@prisma/client"
import { useId } from "react"
import AsyncSelect from 'react-select/async';

import debounce from 'debounce-promise'
import { useRouter } from "next/navigation";



interface EventMovieAdderProps {
    eventId: number,
    initialMovieOptions: Movie[]
}

//TODO: clear the multi selector after submittion
export function EventMovieAdder(props: EventMovieAdderProps) {
    const router = useRouter()

    const { eventId, initialMovieOptions } = props




    async function handleMovieAdding(data: FormData) {
        const movieIds = data.getAll('event-movies')
            .map(x => Number(x))

        const succesfullyAddedMovies = await addMoviesToEventClient(eventId, movieIds)
        if (succesfullyAddedMovies > 0) {
            router.refresh()
        }
    }

    const id = useId()

    const debouncedTest = debounce(async (inputValue: string): Promise<Array<{value: number, label: string}>> => {
        if (inputValue.trim().length <= 0) {
            return initialMovieOptions.map(m => ({
                label: m.title,
                value: m.id
            }))
        }
        const movies = await searchForMovieFromDatabase(inputValue)
        return movies.map(m => ({
            value: m.id, 
            label: m.title
        }))      

    }, 1000)

    const loadOptions = debouncedTest

    return <div>
        <h2>Add a movie to the event</h2>
        <form action={handleMovieAdding}>
            <input type="hidden" name="event-id" id="event-id" value={eventId} />

        {
            // TODO: 
            // Are the  movies in alphabetical order? 
        }

            <br/>
            <div>
                <h4>Add movie(s)</h4>
                <AsyncSelect
                    name="event-movies"
                    id="event-movies"
                    className="text-black"
                    isMulti
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptions}
                />
            </div>

            <button type="submit" className="p-4 border-2 border-white rounded-md">Add movie</button>
        </form>
    </div>
}