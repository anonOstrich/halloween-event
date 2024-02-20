/* eslint-disable react/jsx-key */
import { pages } from '@/utils/pageList';
import Link from 'next/link';
import UserLinks from './UserLinks';
import ProfileLink from './ProfileLink';
import { getUserId } from '@/utils/auth';
import { isLoggedIn } from '@/utils/user';
import { link } from 'fs';

export default async function NavBar() {
  const loggedIn = isLoggedIn();

  return (
    <nav className="border-b-2 border-accent-100 dark:border-dark-accent-100">
      <ul className="flex justify-center gap-1 md:gap-5 flex-wrap items-stretch">
        {pages.map((page) => (
          <li key={page.url}>
            <Link
              className="px-3 md:px-5 hover:bg-primary-100 dark:hover:bg-dark-primary-100 h-full flex items-center"
              href={page.url}
            >
              {page.title}
            </Link>
          </li>
        ))}

        {loggedIn && (
          <li key={'/profile'}>
            <ProfileLink className="px-3 md:px-5 hover:bg-primary-100 dark:hover:bg-dark-primary-100 h-full flex items-center" />
          </li>
        )}
        <UserLinks />
      </ul>
    </nav>
  );
}
