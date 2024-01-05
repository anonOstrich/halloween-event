import NavBar from '@/components/NavBar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastContainer  } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Halloween Event',
  description: 'Some stuff',
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
        <body className={inter.className}>
          <NavBar />
          {children}
          <ToastContainer pauseOnHover={false} theme='dark' />
        </body>

      </html>
    </ClerkProvider>
  )
}
