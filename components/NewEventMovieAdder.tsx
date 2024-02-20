'use client'

import AsyncSelect from 'react-select/async';

import { Movie } from "@prisma/client"
import { useDarkThemeIsPreferred } from '@/utils/hooks';
import debounce from 'debounce-promise';
import { AbsoluteString } from 'next/dist/lib/metadata/types/metadata-types';
import { useState } from 'react';
import { addMoviesToEventClient, getMoviesFromExternalAPI, searchForMovieFromDatabase } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface NewEventMovieAdderProps {
    eventId: number,
    initialMovieOptions: Movie[]
}


export default function NewEventMovieAdder({ eventId, initialMovieOptions }: NewEventMovieAdderProps) {

    const [externalAPI, setExternalAPI] = useState(false)
    const router = useRouter()
    const prefersDarkMode = useDarkThemeIsPreferred()

    async function handleMovieAdding(data: FormData) {
        const movieId = Number(data.getAll('event-movie'))
        console.log("movieId: ", movieId)

        const succesfullyAddedMovies = await addMoviesToEventClient(eventId, [movieId])
        console.log(`successfully added ${succesfullyAddedMovies} movies`)
        if (succesfullyAddedMovies > 0) {
            router.refresh()
        }
    }

    async function fetchDBMovies(searchInput: string) {

        const movies = await searchForMovieFromDatabase(searchInput)
        return movies.map(m => ({
            value: m.id,
            label: m.title
        }))
    }

    async function fetchAPIMovies(searchInput: string) {
        const movies = await getMoviesFromExternalAPI(searchInput)
        return movies.map(m => ({
            value: m.id,
            label: m.title
        }))
    }


    async function handleMovieFetching(searchInput: string) {
        if (searchInput.trim().length <= 0) {
            return initialMovieOptions.map(m => ({
                label: m.title,
                value: m.id
            }))

        }

        if (externalAPI) {
            return fetchAPIMovies(searchInput)
        } else {
            return fetchDBMovies(searchInput)
        }

    }

    const debouncedLoadOptions = debounce(handleMovieFetching, 1000)

    const loadOptions = debouncedLoadOptions

    return <div>
        <h3>Event id: {eventId}</h3>
        <h3>Number of initial options: {initialMovieOptions.length}</h3>

        <form action={handleMovieAdding} className="space-y-4">
            <input type="hidden" name="event-id" id="event-id" value={eventId} />

            {
                // TODO: 
                // Are the  movies in alphabetical order? 
            }


            <div>
                <div>
                    <label htmlFor="use-api">Use external movie API for adding: </label>
                    <input type="checkbox" name="use-api" id="use-api"
                        onChange={e => {
                            setExternalAPI(e.target.checked)
                        }} />
                </div>

                {
                    externalAPI && <h4 className='text-2xl bg-cyan-700 py-2 text-center'>Using external API</h4>
                }

                <label htmlFor="event-movies" className="text-lg">Add movie(s)</label>

                <AsyncSelect
                    name="event-movie"
                    id="event-movies"
                    className="bg-bg-300 dark:bg-dark-bg-300"
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            // N.B.! these are manually set to the same values as in the tailwind config!
                            primary25: prefersDarkMode ? "#610fff" : '#ffd299',
                        }
                    })}
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: 'inherit',
                        }),
                        menu: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: 'inherit',
                        }),
                        input: (baseStyles, state) => ({
                            ...baseStyles,
                            color: "inherit"
                        }),
                        singleValue: (baseStyles, state) => ({
                            ...baseStyles,
                            color: "inherit"
                        }),
                        valueContainer: (baseStyles, state) => ({
                            ...baseStyles,
                            color: prefersDarkMode ? "white" : "inherit",
                        })
                    }}
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptions}
                />
            </div>

            <button type="submit" className="btn">Add movie</button>
        </form>
    </div>
}