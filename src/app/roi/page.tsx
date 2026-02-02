'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, BarChart3 } from 'lucide-react'

interface RoiAlert {
  id: string
  destination: string
  variation: string
  status: 'critical' | 'warning' | 'stable' | 'growth' | 'strong_growth'
  trend: 'up' | 'down' | 'stable'
  action: string
  metrics: {
    bookings: number
    revenue: number
    avgTicket: number
  }
  date: string
}

const demoAlerts: RoiAlert[] = [
  {
    id: '1',
    destination: 'PPT-LAX',
    variation: '+18%',
    status: 'strong_growth',
    trend: 'up',
    action: 'Route très performante. Envisager d\'augmenter la capacité ou d\'ajouter des fréquences.',
    metrics: { bookings: 1245, revenue: 2890000, avgTicket: 2321 },
    date: '2026-01-28T10:00:00',
  },
  {
    id: '2',
    destination: 'PPT-CDG',
    variation: '-12%',
    status: 'warning',
    trend: 'down',
    action: 'Baisse significative. Analyser la concurrence Air France et ajuster la stratégie tarifaire.',
    metrics: { bookings: 567, revenue: 1450000, avgTicket: 2558 },
    date: '2026-01-28T10:00:00',
  },
  {
    id: '3',
    destination: 'PPT-NRT',
    variation: '-25%',
    status: 'critical',
    trend: 'down',
    action: 'URGENT: Baisse critique du trafic japonais. Recommandation: campagne marketing ciblée + offre promotionnelle.',
    metrics: { bookings: 234, revenue: 680000, avgTicket: 2906 },
    date: '2026-01-28T10:00:00',
  },
  {
    id: '4',
    destination: 'PPT-AKL',
    variation: '+5%',
    status: 'growth',
    trend: 'up',
    action: 'Croissance stable. Maintenir la stratégie actuelle.',
    metrics: { bookings: 189, revenue: 420000, avgTicket: 2222 },
    date: '2026-01-28T10:00:00',
  },
  {
    id: '5',
    destination: 'PPT-SEA',
    variation: '0%',
    status: 'stable',
    trend: 'stable',
    action: 'Route stable. Opportunité d\'expansion avec la saison ski à venir.',
    metrics: { bookings: 156, revenue: 350000, avgTicket: 2244 },
    date: '2026-01-28T10:00:00',
  },
]

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  critical: { label: 'CRITIQUE', color: 'text-red-700', bgColor: 'bg-red-100' },
  warning: { label: 'Attention', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  stable: { label: 'Stable', color: 'text-slate-700', bgColor: 'bg-slate-100' },
  growth: { label: 'Croissance', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  strong_growth: { label: 'Forte hausse', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
}

function AlertCard({ alert }: { alert: RoiAlert }) {
  const config = statusConfig[alert.status]
  const isNegative = alert.trend === 'down'

  return (
    <div className={`card border-l-4 ${isNegative ? 'border-red-500' : alert.trend === 'up' ? 'border-emerald-500' : 'border-slate-300'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{alert.destination}</p>
            <div className={`flex items-center justify-center gap-1 ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
              {isNegative ? <TrendingDown className="w-4 h-4" /> : alert.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : null}
              <span className="font-bold">{alert.variation}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded text-sm font-medium ${config.bgColor} ${config.color}`}>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg mb-4">
        <div>
          <p className="text-xs text-slate-500">Réservations</p>
          <p className="text-lg font-bold">{alert.metrics.bookings}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Revenu</p>
          <p className="text-lg font-bold">{(alert.metrics.revenue / 1000000).toFixed(1)}M XPF</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Panier moyen</p>
          <p className="text-lg font-bold">{alert.metrics.avgTicket.toLocaleString()} XPF</p>
        </div>
      </div>

      <div className={`p-3 rounded-lg ${alert.status === 'critical' ? 'bg-red-50' : 'bg-slate-50'}`}>
        <div className="flex items-start gap-2">
          {alert.status === 'critical' && <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />}
          <p className="text-sm">{alert.action}</p>
        </div>
      </div>
    </div>
  )
}

export default function RoiPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filteredAlerts = filterStatus
    ? demoAlerts.filter(a => a.status === filterStatus)
    : demoAlerts

  // Stats
  const totalRevenue = demoAlerts.reduce((acc, a) => acc + a.metrics.revenue, 0)
  const totalBookings = demoAlerts.reduce((acc, a) => acc + a.metrics.bookings, 0)
  const criticalCount = demoAlerts.filter(a => a.status === 'critical' || a.status === 'warning').length
  const growthRoutes = demoAlerts.filter(a => a.trend === 'up').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-emerald-500" />
            ROI Analyst
          </h1>
          <p className="text-slate-500">Build 4: Analyse des performances par route</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Revenu total</p>
          <p className="text-2xl font-bold">{(totalRevenue / 1000000).toFixed(1)}M XPF</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Réservations</p>
          <p className="text-2xl font-bold">{totalBookings.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Alertes actives</p>
          <p className="text-2xl font-bold text-amber-600">{criticalCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Routes en croissance</p>
          <p className="text-2xl font-bold text-emerald-600">{growthRoutes}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {[null, 'critical', 'warning', 'growth', 'stable'].map((status) => (
          <button
            key={status || 'all'}
            className={`px-4 py-2 rounded-lg text-sm ${filterStatus === status ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setFilterStatus(status)}
          >
            {status === null ? 'Toutes' : statusConfig[status]?.label || status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  )
}
