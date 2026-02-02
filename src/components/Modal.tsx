'use client'

import { useEffect, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  children: ReactNode
  onClose: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Try to find modal-root first, fallback to body
    const root = document.getElementById('modal-root') || document.body
    setPortalRoot(root)
    setMounted(true)

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  if (!mounted || !portalRoot) return null

  return createPortal(
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {children}
    </div>,
    portalRoot
  )
}
