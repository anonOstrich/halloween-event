import { Movie } from "@/utils/types";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    const access_token = process.env["MOVIE_ACCESS_TOKEN"]

    // TODO: Use the dynamically provided value
    const reqBody = await req.json()
    const query = encodeURIComponent(reqBody.partialName) 
    // URL encode! 

    const something = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=true`,
         {headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`
    }})

    const jsonResponse = await something.json();

    const foundMovies: Array<any> = jsonResponse.results;


    const filteredMovies = foundMovies.slice(0, 6).map(fullMovie => ({
        adult: fullMovie.adult,
        genre_ids: fullMovie.genre_ids,
        id: fullMovie.id,
        original_language: fullMovie.original_language,
        original_title: fullMovie.original_title,
        overview: fullMovie.overview,
        release_date: fullMovie.release_date,
        title: fullMovie.title
    })) as Array<Movie>

    return Response.json({
        data: {
            movies: filteredMovies
        },
    }, {
        status: 200,
        
    })
}