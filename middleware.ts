import { authMiddleware } from "@clerk/nextjs";


const runningLocally = process.env['LOCAL_ENVIRONMENT']
const disableAuth = process.env['DISABLE_AUTH']

let mw = authMiddleware({
    publicRoutes: [
        '/',
        '/newsletter',
        '/sign-in',
        '/sign-up',
        '/api/secret'
    ]
})


if (disableAuth === 'true') {
    mw = authMiddleware({
        publicRoutes: (req) => true
    })

}

export default mw

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}