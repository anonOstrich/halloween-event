import { auth } from "@clerk/nextjs"
import { env } from "process"
import { prisma } from "./db"

export function getSecret() {
    return env['REGISTRATION_SECRET']
}

export async function getUserId(){
    const { userId } = auth()
    const user =  await prisma.user.findUniqueOrThrow({
        where: {
            clerkId: userId!
        }
    })
    return user.id
}