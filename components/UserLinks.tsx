import { isLoggedIn } from "@/utils/user";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";


export default function UserLinks() {
    const authDisabled = process.env["DISABLE_AUTH"] === 'true'

    if (authDisabled) {
        return <li className="px-5 py-3 text-green-400">DEMO WITHOUT AUTH</li>
    }

    if (isLoggedIn()) {
        return <li className='px-5 py-3'><UserButton /></li>
    }
    return <>
        <li className='px-5 py-3'><Link href="/sign-in">sign in</Link></li>
        <li className='px-5 py-3'><Link href="/sign-up">sign up</Link></li>
    </>
}