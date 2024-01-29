import { getUserId } from "@/utils/auth";
import Link from "next/link";


export default async function ProfileLink({ className }: { className?: string }) {

    const userId = await getUserId()

    return <Link href={`/profile/${userId}`} className={className}>profile</Link>
}