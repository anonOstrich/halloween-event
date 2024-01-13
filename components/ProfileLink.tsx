import { getUserId } from "@/utils/auth";
import Link from "next/link";


export default async function ProfileLink() {

    const userId = await getUserId()

    return <Link href={`/profile/${userId}`}>profile</Link>
}