'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
  mounted: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load from localStorage only after mount
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored !== null) {
      setIsCollapsed(stored === 'true')
    }
    setMounted(true)
  }, [])

  const toggleSidebar = () => {
    const newValue = !isCollapsed
    setIsCollapsed(newValue)
    localStorage.setItem('sidebar-collapsed', String(newValue))
  }

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    localStorage.setItem('sidebar-collapsed', String(collapsed))
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setCollapsed, mounted }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
