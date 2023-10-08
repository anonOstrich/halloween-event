import { setSecret } from "@/utils/db";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    return Response.json(":#")
}

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const value = data.get('secret')
    if (!value) {
        return Response.json({}, {status: 403, statusText: 'Cannot be empty, sorry!'})
    }

    // Could also check: you have not given the secret yet

    await setSecret(value.toString())
    const originURI = new URL(request.url)
    const something = new URL('sign-up', originURI.origin)
    return Response.redirect(something.href)
}