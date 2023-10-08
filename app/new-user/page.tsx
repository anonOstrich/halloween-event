import { auth } from "@clerk/nextjs"

export default function NewUser() {
    const { userId } = auth()
    if (!userId) {
        return <div>No user access should not be possible 🫢</div>
    }
    return <div>You are user with the id {userId}</div>
}