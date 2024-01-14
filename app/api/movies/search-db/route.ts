
import { prisma } from "@/utils/db";
import { NextRequest } from "next/server";
import { Movie } from "@prisma/client";

export async function GET(req: NextRequest){

    const url = new URL(req.url!)
    const searchTerm = url.searchParams.get('searchTerm')
    if (searchTerm == null || searchTerm.trim().length == 0) {
        return   Response.json({
            data: {
                movies: []
            },
        }, {
            status: 200,
        })
    }
    

    const parsedSearchTerm = decodeURIComponent(searchTerm)

    const results = await prisma.movie.findMany({
        where: {
            title: {
                contains: parsedSearchTerm,
                // case insensitivity
                mode: 'insensitive'
            }
        },
        // TODO: set these constants somewhere else
        take: 7
    })


    const movies: Array<Movie> = results

    return Response.json({
        data: {
            movies: movies
        },
    }, {
        status: 200,
    })
}