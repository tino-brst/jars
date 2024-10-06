import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { NavLink } from '@/components/NavLink'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const metadata: Metadata = {
  title: 'Jars',
  description: 'Money tracking made ... easy? TBD',
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="p-4">
        {children}

        <nav className="fixed inset-x-0 bottom-0 flex justify-around bg-white/75 py-4 ring-1 ring-black/5 backdrop-blur-xl">
          <NavLink href="/">Jars</NavLink>
          <NavLink href="/transactions">Transactions</NavLink>
        </nav>
      </body>
    </html>
  )
}

export { metadata }
export default RootLayout
