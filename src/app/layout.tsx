import type { Metadata } from 'next'
import './globals.css'

const metadata: Metadata = {
  title: 'Jars',
  description: 'Money tracking made ... easy? TBD',
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="p-4 font-sans">{children}</body>
    </html>
  )
}

export { metadata }
export default RootLayout
