'use client'

import { useState } from 'react'
import { Plane, Clock, AlertTriangle, CheckCircle, Bell, Send, Users } from 'lucide-react'

interface FlightAlert {
  id: string
  flightNumber: string
  route: string
  alertType: 'delay' | 'cancelled' | 'gate_change' | 'schedule_change'
  delayMinutes: number
  passengersAffected: number
  notificationsSent: number
  channels: string[]
  status: 'sent' | 'pending' | 'failed'
  date: string
}

const demoAlerts: FlightAlert[] = [
  {
    id: '1',
    flightNumber: 'TN1',
    route: 'PPT-LAX',
    alertType: 'delay',
    delayMinutes: 45,
    passengersAffected: 287,
    notificationsSent: 245,
    channels: ['SMS', 'Email', 'App Push'],
    status: 'sent',
    date: '2026-01-28T10:15:00',
  },
  {
    id: '2',
    flightNumber: 'TN8',
    route: 'CDG-PPT',
    alertType: 'gate_change',
    delayMinutes: 0,
    passengersAffected: 198,
    notificationsSent: 0,
    channels: ['App Push'],
    status: 'pending',
    date: '2026-01-28T09:45:00',
  },
  {
    id: '3',
    flightNumber: 'TN3',
    route: 'PPT-NRT',
    alertType: 'delay',
    delayMinutes: 120,
    passengersAffected: 156,
    notificationsSent: 156,
    channels: ['SMS', 'Email', 'App Push', 'WhatsApp'],
    status: 'sent',
    date: '2026-01-28T08:30:00',
  },
  {
    id: '4',
    flightNumber: 'TN5',
    route: 'PPT-AKL',
    alertType: 'cancelled',
    delayMinutes: 0,
    passengersAffected: 134,
    notificationsSent: 134,
    channels: ['SMS', 'Email', 'App Push'],
    status: 'sent',
    date: '2026-01-27T22:00:00',
  },
]

// Composant statut vol
function FlightStatusBadge({ type }: { type: FlightAlert['alertType'] }) {
  const configs = {
    delay: { label: 'Retard', color: 'bg-amber-100 text-amber-700', icon: Clock },
    cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
    gate_change: { label: 'Changement porte', color: 'bg-blue-100 text-blue-700', icon: Plane },
    schedule_change: { label: 'Horaire modifié', color: 'bg-purple-100 text-purple-700', icon: Clock },
  }
  const config = configs[type]
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

function AlertCard({ alert, onSendNotifications }: { alert: FlightAlert; onSendNotifications: () => void }) {
  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-atn-primary/10 rounded-lg">
            <Plane className="w-6 h-6 text-atn-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{alert.flightNumber}</h3>
              <span className="text-slate-500">{alert.route}</span>
            </div>
            <FlightStatusBadge type={alert.alertType} />
          </div>
        </div>
        {alert.alertType === 'delay' && alert.delayMinutes > 0 && (
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-600">+{alert.delayMinutes}min</p>
            <p className="text-xs text-slate-500">de retard</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-lg font-bold">{alert.passengersAffected}</p>
            <p className="text-xs text-slate-500">passagers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-lg font-bold">{alert.notificationsSent}</p>
            <p className="text-xs text-slate-500">notifiés</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Send className="w-5 h-5 text-slate-400" />
          <div>
            <div className="flex gap-1">
              {alert.channels.map(channel => (
                <span key={channel} className="px-1.5 py-0.5 bg-white rounded text-xs">
                  {channel}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {alert.status === 'sent' ? (
            <span className="flex items-center gap-1 text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              Notifications envoyées
            </span>
          ) : alert.status === 'pending' ? (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg text-sm hover:bg-opacity-90"
              onClick={onSendNotifications}
            >
              <Send className="w-4 h-4" />
              Envoyer les notifications
            </button>
          ) : (
            <span className="flex items-center gap-1 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              Échec de l'envoi
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">
          {new Date(alert.date).toLocaleString('fr-FR')}
        </span>
      </div>
    </div>
  )
}

export default function FlightsPage() {
  const [alerts, setAlerts] = useState(demoAlerts)
  const [filterType, setFilterType] = useState<string | null>(null)

  const handleSendNotifications = (id: string) => {
    setAlerts(alerts.map(a =>
      a.id === id ? { ...a, status: 'sent' as const, notificationsSent: a.passengersAffected } : a
    ))
  }

  const filteredAlerts = filterType
    ? alerts.filter(a => a.alertType === filterType)
    : alerts

  // Stats
  const totalAffected = alerts.reduce((acc, a) => acc + a.passengersAffected, 0)
  const totalNotified = alerts.reduce((acc, a) => acc + a.notificationsSent, 0)
  const delayedFlights = alerts.filter(a => a.alertType === 'delay').length
  const cancelledFlights = alerts.filter(a => a.alertType === 'cancelled').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Bell className="w-7 h-7 text-atn-secondary" />
            Flight Notifier
          </h1>
          <p className="text-slate-500">Build 8: Alertes vols en temps réel</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm text-slate-600">Surveillance active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Passagers impactés</p>
          <p className="text-2xl font-bold">{totalAffected}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Notifiés</p>
          <p className="text-2xl font-bold text-emerald-600">{totalNotified}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Vols retardés</p>
          <p className="text-2xl font-bold text-amber-600">{delayedFlights}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Vols annulés</p>
          <p className="text-2xl font-bold text-red-600">{cancelledFlights}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {[
          { value: null, label: 'Tous' },
          { value: 'delay', label: 'Retards' },
          { value: 'cancelled', label: 'Annulations' },
          { value: 'gate_change', label: 'Changements porte' },
        ].map(({ value, label }) => (
          <button
            key={value || 'all'}
            className={`px-4 py-2 rounded-lg text-sm ${
              filterType === value ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
            }`}
            onClick={() => setFilterType(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onSendNotifications={() => handleSendNotifications(alert.id)}
          />
        ))}
      </div>
    </div>
  )
}
