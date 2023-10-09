import { getUserId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    const { movieId,
    reaction} = await req.json()
    const userId = await getUserId()
    const createdReaction = await prisma.reaction.upsert({
        update: {
            type: reaction
        },
        create: {
            type: reaction,
            userId,
            movieId,
        },
        where: {
            userId_movieId: {
                movieId,
                userId
            }
        }
    })
    return Response.json({
        data: createdReaction
    }, {status: 200})
}