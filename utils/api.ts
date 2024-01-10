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
