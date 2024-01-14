'use client'

import { searchForMovieFromDatabase } from "@/utils/api";
import { Movie } from "@prisma/client"
import { useState, useId} from "react"
import Select from "react-select"
import AsyncSelect from 'react-select/async';
// This just for value :/
import { useDebounce } from 'usehooks-ts'
import debounce from 'debounce-promise'



interface EventMovieAdderProps {
    eventId: number,
    initialMovieOptions: Movie[]
}

export function EventMovieAdder(props: EventMovieAdderProps) {


    const [delayHandle, setDelayHandle] = useState<{
        handle: NodeJS.Timeout | null
    }>({handle: null})


    const { eventId, initialMovieOptions } = props


    function getDelayHandle(){
        return delayHandle
    }

    function handleMovieAdding() {
        console.log('called function handleMovieAdding')
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
                <h4>Async test</h4>
                <AsyncSelect
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