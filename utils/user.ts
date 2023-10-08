import { auth } from "@clerk/nextjs";


export function isLoggedIn() {
    const {userId} = auth()
    return userId != null
}