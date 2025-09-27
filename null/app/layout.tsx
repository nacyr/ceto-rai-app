import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ceto Rai Humanitarian Foundation',
  description: 'Restoring hope and changing lives through sustainable community development programs across education, healthcare, and empowerment.',
  keywords: ['humanitarian', 'foundation', 'education', 'healthcare', 'empowerment', 'charity'],
  authors: [{ name: 'Ceto Rai Foundation' }],
  openGraph: {
    title: 'Ceto Rai Humanitarian Foundation',
    description: 'Restoring hope and changing lives through sustainable community development programs.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}