'use client';

import AsyncSelect from 'react-select/async';

import { Movie } from '@prisma/client';
import { useDarkThemeIsPreferred } from '@/utils/hooks';
import debounce from 'debounce-promise';
import { useId, useState } from 'react';
import {
  addMoviesToEventClient,
  getMoviesFromExternalAPI,
  searchForMovieFromDatabase
} from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EventMovieAdderProps {
  eventId: number;
  initialMovieOptions: Movie[];
}

export default function EventMovieAdder({
  eventId,
  initialMovieOptions
}: EventMovieAdderProps) {
  const [externalAPI, setExternalAPI] = useState(false);
  const router = useRouter();
  const prefersDarkMode = useDarkThemeIsPreferred();

  async function handleMovieAdding(data: FormData) {
    const movieId = Number(data.getAll('event-movie'));
    console.log('movieId: ', movieId);

    const succesfullyAddedMovies = await addMoviesToEventClient(eventId, [
      movieId
    ]);
    console.log(`successfully added ${succesfullyAddedMovies} movies`);
    if (succesfullyAddedMovies > 0) {
      router.refresh();
    }
  }

  async function fetchDBMovies(searchInput: string) {
    const movies = await searchForMovieFromDatabase(searchInput);
    return movies.map((m) => ({
      value: m.id,
      label: m.title
    }));
  }

  async function fetchAPIMovies(searchInput: string) {
    const movies = await getMoviesFromExternalAPI(searchInput);
    return movies.map((m) => ({
      value: m.id,
      label: m.title
    }));
  }

  async function fetchMoviesA(searchInput: string) {
    const movies = [
      { label: 'aa', value: 1 },
      { label: 'bb', value: 2 },
      { label: 'cc', value: 3 }
    ];

    return movies.filter((m) => m.label.includes(searchInput));
  }

  async function fetchMoviesB(searchInput: string) {
    const movies = [
      { label: 'a', value: 1 },
      { label: 'b', value: 2 },
      { label: 'c', value: 3 }
    ];
    return movies.filter((m) => m.label.includes(searchInput));
  }

  async function handleMovieFetching(searchInput: string) {
    if (searchInput.trim().length <= 0) {
      return initialMovieOptions.map((m) => ({
        label: m.title,
        value: m.id
      }));
    }

    console.log('search input: ', searchInput);

    if (externalAPI) {
      return fetchMoviesA(searchInput);
    } else {
      return fetchMoviesB(searchInput);
    }

    // if (externalAPI) {
    //   return fetchAPIMovies(searchInput);
    // } else {
    //   return fetchDBMovies(searchInput);
    // }
  }

  const debouncedLoadOptions = debounce(handleMovieFetching, 500);

  const loadOptions = debouncedLoadOptions;

  return (
    <div
      className="mt-4 lg:mt-8 bg-bg-200 dark:bg-dark-bg-200 p-4 rounded
      flex flex-col gap-2 sm:gap-4 md:gap-8 py-4 sm:px-4 
    "
    >
      <h2 className="prose dark:prose-invert prose-2xl text-center">
        Add a new movie
      </h2>

      <form
        action={handleMovieAdding}
        className="space-y-4 flex flex-col items-center
        md:items-stretch
        "
      >
        <input type="hidden" name="event-id" id="event-id" value={eventId} />

        {
          // TODO:
          // Are the  movies in alphabetical order?
        }

        <div>
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:gap-4 md:items-center md:justify-between ">
              <label htmlFor="event-movie" className="text-lg">
                Select movies:
              </label>

              <SourceToggler setValue={setExternalAPI} />
            </div>

            <AsyncSelect
              name="event-movie"
              id="event-movies"
              className="bg-bg-300 dark:bg-dark-bg-300"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  // N.B.! these are manually set to the same values as in the tailwind config!
                  // TODO: use the tailwind config values instead, look up in JavaScript
                  primary25: prefersDarkMode ? '#610fff' : '#ffd299'
                }
              })}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: 'inherit'
                }),
                menu: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: 'inherit'
                }),
                input: (baseStyles, state) => ({
                  ...baseStyles,
                  color: 'inherit'
                }),
                singleValue: (baseStyles, state) => ({
                  ...baseStyles,
                  color: 'inherit'
                }),
                valueContainer: (baseStyles, state) => ({
                  ...baseStyles,
                  color: prefersDarkMode ? 'white' : 'inherit'
                })
              }}
              // Cache will clear when this value changes
              // a truthy value -> caching is enabled
              cacheOptions={`caching-${externalAPI}`}
              // How would we choose the defaults? Better to just leave empty?
              // defaultOptions
              loadOptions={loadOptions}
            />
          </div>
        </div>

        <button type="submit" className="btn">
          Add movie
        </button>
      </form>
    </div>
  );
}

interface SourceTogglerProps {
  setValue: (value: boolean) => void;
}

// Probably quite a lot to do: make as accessible as a default checkbox
// If you want to use a ready-made component, use e.g. Flowbite
export function SourceToggler({ setValue }: SourceTogglerProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex gap-2 md:gap-4 items-center">
      <input
        checked={isChecked}
        className="peer absolute opacity-0 z-index-[-10]"
        type="checkbox"
        name="use-api"
        id="use-api"
        onChange={(e) => {
          setIsChecked(e.target.checked);
          setValue(e.target.checked);
        }}
      />
      <div
        className="w-10 h-10 min-w-[20px] min-h-[20px] max-w-[100px] max-h-[100px]
        before:content-['✓']
        before:text-2xl md:text-4xl lg:text-4xl
        before:font-extrabold before:text-transparent
        flex justify-center items-stretch
        peer-checked:before:text-text-100   dark:peer-checked:before:text-dark-text-100
        before:flex before:items-center before:justify-center
        rounded-md border-2 border-black
        bg-bg-200
        dark:bg-dark-bg-200
        peer-checked:bg-primary-200
        dark:peer-checked:bg-dark-primary-200
        peer-focus:ring-4 peer-focus:ring-primary-200 peer-focus:dark:ring-dark-primary-200
        "
        onClick={() => {
          setIsChecked(!isChecked);
          setValue(!isChecked);
        }}
      ></div>
      <label htmlFor="use-api">
        Search from{' '}
        <Link href="https://www.themoviedb.org/">The Movie Database</Link>
      </label>
    </div>
  );
}
