import { NextRequest } from "next/server";
import {cookies} from 'next/headers'
import { randomUUID } from "crypto";
import { prisma } from "@/utils/db";
import { getSecret } from "@/utils/auth";

export function GET(request: NextRequest) {
    return Response.json(":#")
}

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const value = data.get('secret')
    if (!value) {
        return Response.json({}, {status: 403, statusText: 'Cannot be empty, sorry!'})
    }

    if (value !== getSecret()) {
        return Response.json({message: "Invalid secret. Ask from the Person and try again."}, {status: 403})
    }

    const userFingerPrint = randomUUID()
    cookies().set('fingerPrint', userFingerPrint)
    await prisma.possibleRegistrar.create({
        data: {
            hash: userFingerPrint
        }
    })
    const originURI = new URL(request.url)
    const redirectURI = new URL('sign-up', originURI.origin)
    return Response.redirect(redirectURI.href)
}