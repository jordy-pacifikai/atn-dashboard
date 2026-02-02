'use client'

import { ReactNode, useState, useEffect } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { SidebarProvider } from '@/context/SidebarContext'
import InteractiveGuide from './InteractiveGuide'

const GUIDE_STORAGE_KEY = 'atn_guide_completed'

export function Providers({ children }: { children: ReactNode }) {
  const [showGuide, setShowGuide] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Check localStorage after hydration
    setIsHydrated(true)
    const guideCompleted = localStorage.getItem(GUIDE_STORAGE_KEY)
    if (!guideCompleted) {
      setShowGuide(true)
    }
  }, [])

  const handleGuideComplete = () => {
    localStorage.setItem(GUIDE_STORAGE_KEY, 'true')
    setShowGuide(false)
  }

  // Pour forcer le guide a s'afficher (dev/demo), ajouter ?guide=1 a l'URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('guide') === '1') {
        localStorage.removeItem(GUIDE_STORAGE_KEY)
        setShowGuide(true)
      }
    }
  }, [])

  return (
    <ThemeProvider>
      <SidebarProvider>
        {/* Guide interactif obligatoire */}
        {isHydrated && (
          <InteractiveGuide
            isOpen={showGuide}
            onComplete={handleGuideComplete}
          />
        )}
        {children}
      </SidebarProvider>
    </ThemeProvider>
  )
}
