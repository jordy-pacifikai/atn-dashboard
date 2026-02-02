import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import Sidebar from '@/components/Sidebar'
import ChatWidget from '@/components/ChatWidget'
import MainContent from '@/components/MainContent'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ATN Dashboard - AI Agents Monitor',
  description: 'Dashboard de monitoring des agents IA Air Tahiti Nui',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {/* Prototype Banner */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#00A9CE] to-[#E31837] text-white text-center py-2 px-4 text-sm font-medium">
            <span className="opacity-90">PROTOTYPE DEMO</span>
            <span className="mx-2">-</span>
            <span>Dashboard Air Tahiti Nui propulsé par PACIFIK&apos;AI</span>
          </div>
          <div className="flex min-h-screen pt-10">
            <Sidebar />
            <MainContent>
              {children}
            </MainContent>
            <ChatWidget />
          </div>
        </Providers>
      </body>
    </html>
  )
}
