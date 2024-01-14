'use client'

import { Movie } from "@prisma/client"
import { useState } from "react"

interface EventMovieAdderProps {
    eventId: number,
    initialMovieOptions: Movie[]
}

export function EventMovieAdder(props: EventMovieAdderProps) {

    const { eventId, initialMovieOptions } = props

    const [movieOptions, setMovieOptions] = useState(initialMovieOptions)


    function handleMovieAdding() {
        console.log('called function handleMovieAdding')
    }

    return <div>
        <h2>Add a movie to the event</h2>
        <form action={handleMovieAdding}>
            <input type="hidden" name="event-id" id="event-id" value={eventId} />
            <select multiple name="movie-id" id="movie-id"
            className="text-white bg-gray-700 p-5">
                {
                    movieOptions.map(movie => (<option key={movie.id}>
                        {
                            movie.title
                        }
                    </option>))
                }
            </select>
            <br/>
            <button type="submit" className="p-4 border-2 border-white rounded-md">Add movie</button>
        </form>
    </div>
}