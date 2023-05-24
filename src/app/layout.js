import Navbar from '@/components/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NanColab app',
  description: 'Created for the hackaton',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <header>
            <Navbar />
          </header>

          {children}
        </body>
      </AuthProvider>
    </html>
  )
}
