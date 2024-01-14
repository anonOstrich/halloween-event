
import { prisma } from "@/utils/db";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";
import { tsBigIntKeyword } from '../../../../node_modules/@babel/types/lib/index-legacy.d';
import { Movie } from "@prisma/client";

export async function GET(req: NextApiRequest){

    const url = new URL(req.url!)
    const searchTerm = url.searchParams.get('searchTerm')
    if (searchTerm == null || searchTerm.trim().length == 0) {
        return []
    }
    

    const parsedSearchTerm = decodeURIComponent(searchTerm)
    console.log('parsed: ', parsedSearchTerm)

    const results = await prisma.movie.findMany({
        where: {
            title: {
                contains: searchTerm,
                // case insensitivity
                mode: 'insensitive'
            }
        },
        // TODO: set these constants somewhere else
        take: 7
    })

    console.log('Found from the database: ', JSON.stringify(results, null, 2))
    // const reqBody = await req.json()
    // URL encode! 


    const movies: Array<Movie> = results

    return Response.json({
        data: {
            movies: movies
        },
    }, {
        status: 200,
    })
}