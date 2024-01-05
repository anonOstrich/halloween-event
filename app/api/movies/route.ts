import { getUserId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {

    const {title, year, description} = await req.json()

    if (!title || !year || !description) {
        return
    }

    const userId = await getUserId()


    await prisma.movie.create({
        data: {
            userId,
            title: title.toString(),
            year: Number(year.toString()),
            description: description.toString(),

        }
    })

    return Response.json({
        data: {
            message: "It's a success"
        }
    }, {
        status: 200
    })
}