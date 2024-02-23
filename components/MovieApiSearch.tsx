'use client';

import { getMoviesFromExternalAPI } from '@/utils/api';
import { useDarkThemeIsPreferred } from '@/utils/hooks';
import { Movie } from '@/utils/types';
import debounce from 'debounce-promise';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';

const TIMEOUT_DELAY_IN_MS = 500;

interface MovieApiSearchProps {
  completeMovieInformationCallBack: (
    title: string,
    year: number,
    description: string
  ) => void;
}

export default function MovieApiSearch({
  completeMovieInformationCallBack
}: MovieApiSearchProps) {
  const darkModeEnabled = useDarkThemeIsPreferred();

  function fillInMovieInformation(movie: Movie | null) {
    if (movie == null) return;
    const year = new Date(movie.release_date).getFullYear();
    completeMovieInformationCallBack(movie.title, year, movie.overview);
  }

  const loadOptions = debounce(async (inputValue: string) => {
    if (inputValue.trim().length <= 0) {
      return [];
    }
    const movies = await getMoviesFromExternalAPI(inputValue);
    return movies.map((m) => ({
      value: m,
      label: m.title
    }));
  }, TIMEOUT_DELAY_IN_MS);

  return (
    <div>
      <AsyncSelect
        name="movie-id"
        id="movie-id"
        cacheOptions
        loadOptions={loadOptions}
        isSearchable
        isClearable
        className="bg-bg-300 dark:bg-dark-bg-300"
        onChange={(e) => {
          fillInMovieInformation(e?.value ?? null);
        }}
        placeholder="Search for a movie by title"
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
            backgroundColor: 'inherit',
            color: 'inherit'
          }),
          singleValue: (baseStyles, state) => ({
            ...baseStyles,
            color: 'inherit'
          })
        }}
      />
    </div>
  );
}
