import NavBar from '@/components/NavBar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Movie Club',
  description: 'Site for facilitating movie watching events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // NOTE: What's wrapped by clerkprovider cannot be build-time rendered. See the clerk documentation for alternatives, if you want SSG for some pages
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className + " bg-bg-100 dark:bg-dark-bg-100 text-text-100 dark:text-dark-text-100"}>
          <NavBar />
          <main className='max-w-4xl m-auto mt-4'>
            {children}
          </main>
          <ToastContainer pauseOnHover={false} />
        </body>

      </html>
    </ClerkProvider>
  )
}
