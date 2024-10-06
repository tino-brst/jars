import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

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
      <body className="p-4">{children}</body>
    </html>
  )
}

export { metadata }
export default RootLayout
