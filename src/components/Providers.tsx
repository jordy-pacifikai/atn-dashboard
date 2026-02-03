'use client'

import { ReactNode, useState, useEffect } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { SidebarProvider } from '@/context/SidebarContext'
import InteractiveGuide from './InteractiveGuide'

export function Providers({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <ThemeProvider>
      <SidebarProvider>
        {/* Guide interactif - bouton flottant toujours visible */}
        {isHydrated && <InteractiveGuide />}
        {children}
      </SidebarProvider>
    </ThemeProvider>
  )
}
