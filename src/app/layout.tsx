import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jars',
  description: 'Money tracking made ... easy? TBD',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="p-4 font-sans">{children}</body>
    </html>
  )
}
