import { getUserId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {id: string}}){
    const {id} = params
    const userId = await getUserId()
    const reaction = await prisma.reaction.findUnique({
        where: {
            userId_movieId: {
                userId,
                movieId: Number(id)
            }
        }
    })
    return Response.json({data: reaction}, {status: 200})
}