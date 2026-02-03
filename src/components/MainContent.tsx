'use client'

import { ReactNode } from 'react'
import { useSidebar } from '@/context/SidebarContext'

export default function MainContent({ children }: { children: ReactNode }) {
  const { isCollapsed, mounted } = useSidebar()

  // Use default width until mounted to prevent hydration mismatch
  const sidebarCollapsed = mounted ? isCollapsed : false

  return (
    <main
      className={`flex-1 min-h-screen overflow-x-hidden transition-all duration-300 bg-[--bg-secondary] ${
        sidebarCollapsed ? 'ml-[72px]' : 'ml-[280px]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-6 animate-fadeIn">
        {children}
      </div>
    </main>
  )
}
