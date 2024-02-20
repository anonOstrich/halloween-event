'use client'

import AsyncSelect from 'react-select/async';

import { Movie } from "@prisma/client"
import { useDarkThemeIsPreferred } from '@/utils/hooks';
import debounce from 'debounce-promise';
import { AbsoluteString } from 'next/dist/lib/metadata/types/metadata-types';
import { useState } from 'react';

interface NewEventMovieAdderProps {
    eventId: number,
    initialMovieOptions: Movie[]
}


export default function NewEventMovieAdder({ eventId, initialMovieOptions }: NewEventMovieAdderProps) {

    const [externalAPI, setExternalAPI] = useState(false)
    const prefersDarkMode = useDarkThemeIsPreferred()

    async function handleMovieAdding(data: FormData) {
        console.log('trying to add something :^)')
    }


    async function handleMovieFetching(searchInput: string) {
        return [{ value: 1, label: "test" }, { value: 2, label: "test2" }]
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
                    name="event-movies"
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