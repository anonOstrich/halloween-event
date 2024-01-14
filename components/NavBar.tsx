/* eslint-disable react/jsx-key */
import { pages } from '@/utils/pageList'
import Link from 'next/link'
import UserLinks from './UserLinks'
import ProfileLink from './ProfileLink'
import { getUserId } from '@/utils/auth'
import { isLoggedIn } from '@/utils/user'
import { link } from 'fs'

export default async function NavBar() {


    const loggedIn = isLoggedIn()

    return <nav className='border-b-2 border-[var(--foreground-color)]'>
        <ul className='flex justify-center gap-5'>
            {pages.map(page => <li key={page.url} className='px-5 py-3'>
                <Link href={page.url}>{page.title}</Link>
            </li>)}

            {
                loggedIn && (<li key={"/profile"} className='px-5 py-3'>
                    <ProfileLink />
                </li>)
            }
            <UserLinks />
        </ul>
    </nav>
}