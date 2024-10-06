import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { NavLink } from '@/components/NavLink'
import { twMerge } from 'tailwind-merge'

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
      <body
        className={twMerge(
          // TODO maybe the nav can be sticky? So there is no need to keep track
          // of its height. The body will need min-h-screen or similar though
          '[--nav-height:52px]',
          'p-4 pb-[calc(env(safe-area-inset-bottom)+theme(spacing.4)+var(--nav-height))]',
        )}
      >
        {children}

        <nav className="fixed inset-x-0 bottom-0 flex bg-white/75 ring-1 ring-black/5 backdrop-blur-xl">
          <NavLink href="/">Jars</NavLink>
          <NavLink href="/transactions">Transactions</NavLink>
        </nav>
      </body>
    </html>
  )
}

export { metadata }
export default RootLayout
