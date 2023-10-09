import { prisma } from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {id: string}}){
    console.log('request: ', req)
    const movieId = Number(params.id)
    
    const reactions = await prisma.reaction.findMany({
        where: {
            movieId
        },
        select: {
            type: true
        }
    })

    return Response.json({
        data: reactions
    }, {status: 200})
}