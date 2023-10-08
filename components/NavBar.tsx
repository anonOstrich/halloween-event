/* eslint-disable react/jsx-key */
import { pages } from '@/utils/pageList'
import Link from 'next/link'
import UserLinks from './UserLinks'

export default function NavBar() {

    return <nav>
        <ul className='flex justify-center gap-5'>
            {pages.map(page => <li className='px-5 py-3'>
                <Link href={page.url}>{page.title}</Link>
            </li>)}
            <UserLinks />
        </ul>
    </nav>
}