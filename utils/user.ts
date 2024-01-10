import { auth } from "@clerk/nextjs";

//TODO: Should I also check that the user is in my DB?
export function isLoggedIn() {
    const {userId} = auth()
    return userId != null
}