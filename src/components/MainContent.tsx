'use client'

import { ReactNode } from 'react'
import { PanelLeftClose, PanelLeft } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'

export default function MainContent({ children }: { children: ReactNode }) {
  const { isCollapsed, toggleSidebar, mounted } = useSidebar()

  // Use default width until mounted to prevent hydration mismatch
  const sidebarCollapsed = mounted ? isCollapsed : false

  return (
    <main
      className={`flex-1 min-h-screen overflow-x-hidden transition-all duration-300 bg-[--bg-secondary] ${
        sidebarCollapsed ? 'ml-[72px]' : 'ml-[280px]'
      }`}
    >
      {/* Toggle sidebar button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-14 z-50 p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all"
        style={{ left: sidebarCollapsed ? '84px' : '292px' }}
        title={sidebarCollapsed ? 'Ouvrir le menu' : 'Fermer le menu'}
      >
        {sidebarCollapsed ? (
          <PanelLeft className="w-4 h-4 text-slate-600" />
        ) : (
          <PanelLeftClose className="w-4 h-4 text-slate-600" />
        )}
      </button>

      <div className="max-w-6xl mx-auto px-6 py-6 animate-fadeIn">
        {children}
      </div>
    </main>
  )
}
