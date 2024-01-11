import { authMiddleware } from "@clerk/nextjs";


export default authMiddleware({
    publicRoutes: [
        '/',
        '/newsletter',
        '/sign-in',
        '/sign-up',
        '/api/secret'
    ]
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}