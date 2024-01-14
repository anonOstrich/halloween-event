import { Vote, VoteType } from "@prisma/client";
import { Movie } from "./types"

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

    return data.message
}


// Really this is toggling!
export async function voteForEventMovie(movieEventId: number, voteType: VoteType): Promise<Vote> {

    const response = await fetch(`/api/events/${movieEventId}/vote`, {
        method: 'POST',
        body: JSON.stringify({
            voteType
        })
    })
    const {
        data 
    } = await response.json()

    const { vote } = data
    return vote
}

export async function searchForMovieFromDatabase(searchTerm: string): Promise<Movie[]> {
    if (searchTerm.length == 0) {
        return []
    } 
    const response = await fetch(`/api/movies/search-db?searchTerm=${encodeURIComponent(searchTerm)}`)
    const {data} = await response.json();
    const { movies } = data
    return movies
}