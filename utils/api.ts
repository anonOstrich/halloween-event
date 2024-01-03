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

export async function getMovieReaction(movieId: number): Promise<Reaction> {
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