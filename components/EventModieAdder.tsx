'use client';

import {
  addMoviesToEventClient,
  searchForMovieFromDatabase
} from '@/utils/api';
import { Movie } from '@prisma/client';
import AsyncSelect from 'react-select/async';

import debounce from 'debounce-promise';
import { useRouter } from 'next/navigation';
import { useDarkThemeIsPreferred } from '@/utils/hooks';

interface EventMovieAdderProps {
  eventId: number;
  initialMovieOptions: Movie[];
}

//TODO: clear the multi selector after submittion
export function EventMovieAdder(props: EventMovieAdderProps) {
  const router = useRouter();

  const darkModeEnabled = useDarkThemeIsPreferred();

  const { eventId, initialMovieOptions } = props;

  async function handleMovieAdding(data: FormData) {
    const movieIds = data.getAll('event-movies').map((x) => Number(x));

    const succesfullyAddedMovies = await addMoviesToEventClient(
      eventId,
      movieIds
    );
    if (succesfullyAddedMovies > 0) {
      router.refresh();
    }
  }

  const debouncedTest = debounce(
    async (
      inputValue: string
    ): Promise<Array<{ value: number; label: string }>> => {
      if (inputValue.trim().length <= 0) {
        return initialMovieOptions.map((m) => ({
          label: m.title,
          value: m.id
        }));
      }
      const movies = await searchForMovieFromDatabase(inputValue);
      return movies.map((m) => ({
        value: m.id,
        label: m.title
      }));
    },
    1000
  );

  const loadOptions = debouncedTest;

  return (
    <div className="mt-8 space-y-4 bg-bg-200 dark:bg-dark-bg-200 p-4 rounded">
      <h2 className="prose dark:prose-invert prose-2xl">Add a new movie</h2>
      <form action={handleMovieAdding} className="space-y-4">
        <input type="hidden" name="event-id" id="event-id" value={eventId} />

        {
          // TODO:
          // Are the  movies in alphabetical order?
        }

        <div>
          <label htmlFor="event-movies" className="text-lg">
            Add movie(s)
          </label>
          <AsyncSelect
            name="event-movies"
            id="event-movies"
            className="bg-bg-300 dark:bg-dark-bg-300"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                // N.B.! these are manually set to the same values as in the tailwind config!
                primary25: darkModeEnabled ? '#610fff' : '#ffd299'
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
              })
            }}
            isMulti
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
          />
        </div>

        <button type="submit" className="btn">
          Add movie
        </button>
      </form>
    </div>
  );
}
