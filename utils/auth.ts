import { auth } from "@clerk/nextjs"
import { env } from "process"
import { prisma } from "./db"

export function getSecret() {
    return env['REGISTRATION_SECRET']
}

export async function getUserId(){
    if (process.env['DISABLE_AUTH'] === 'true') {
        return 2
    }

    const { userId } = auth()
    const user =  await prisma.user.findUniqueOrThrow({
        where: {
            clerkId: userId!
        }
    })
    return user.id
}

export async function isLoggedIn() {
    const { userId } = auth()
    const user =  await prisma.user.findUnique({
        where: {
            clerkId: userId!
        }
    })
    return user != null
}