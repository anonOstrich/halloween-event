import { auth } from "@clerk/nextjs";

//TODO: Should I also check that the user is in my DB?
export function isLoggedIn() {
    if (process.env["DISABLE_AUTH"] == "true") { return true }
    const { userId } = auth()
    return userId != null
}