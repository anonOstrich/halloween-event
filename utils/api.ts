import { Reaction } from "@prisma/client"
import { Movie } from "./types"


export async function reactToMovie(movieId: number, reaction: Reaction['type']): Promise<Reaction> {
    const response = await fetch('/api/react', {
        method: 'POST',
        body: JSON.stringify({
            movieId,
            reaction
        })
    })
    const { data } = await response.json()
    return data
}

export async function getMovieReaction(movieId: number): Promise<Reaction | null> {
    const response = await fetch(`/api/movies/${movieId}/reaction`)
    const { data } = await response.json()
    return data
}

export async function getMoviesFromExternalAPI(searchTerm: string): Promise<Array<Movie>> {
    const response = await fetch(`/api/movies/search`, {
        method: 'POST',
        body: JSON.stringify({
            partialName: searchTerm
        })
    })
    const { data } = await response.json();
    return data.movies;
}

export async function addNewMovie(title: string, year: number, description: string): Promise<string> {
    const response = await fetch('/api/movies', {
        method: 'POST',
        body: JSON.stringify({
            title,
            year,
            description
        })
    })
    const {data} = await response.json();

    console.log('this came from the backend after adding a new movie:')
    console.log(JSON.stringify(data, null, 2))
    return data.message
}