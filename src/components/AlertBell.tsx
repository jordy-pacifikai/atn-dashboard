'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

interface Alert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  buildNumber: number
  timestamp: string
}

// Composant de notification temps réel
export default function AlertBell() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Simulation d'alertes en temps réel
  useEffect(() => {
    // En production, utiliser Supabase Realtime ici
    const demoAlerts: Alert[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Vol TN1 retardé',
        message: 'Retard de 45 minutes sur PPT-LAX',
        buildNumber: 8,
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'error',
        title: 'Prix concurrent',
        message: 'Air France -15% sur PPT-CDG',
        buildNumber: 7,
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '3',
        type: 'success',
        title: 'Newsletter envoyée',
        message: '234 emails segment Famille',
        buildNumber: 2,
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
    ]
    setAlerts(demoAlerts)
    setUnreadCount(demoAlerts.length)
  }, [])

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id))
    setUnreadCount(Math.max(0, unreadCount - 1))
  }

  const typeColors = {
    error: 'bg-red-100 text-red-700 border-red-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-lg hover:bg-slate-100"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
          <div className="p-3 border-b border-slate-100">
            <h3 className="font-semibold text-sm">Alertes</h3>
          </div>
          <div className="max-h-96 overflow-auto">
            {alerts.length === 0 ? (
              <p className="p-4 text-center text-slate-500 text-sm">Aucune alerte</p>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 border-b border-slate-50 hover:bg-slate-50 ${typeColors[alert.type]} bg-opacity-50`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{alert.message}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Build {alert.buildNumber} • {new Date(alert.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      className="p-1 hover:bg-white rounded"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-2 border-t border-slate-100">
            <button
              className="w-full py-2 text-sm text-atn-secondary hover:bg-slate-50 rounded"
              onClick={() => {
                setAlerts([])
                setUnreadCount(0)
              }}
            >
              Tout marquer comme lu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
