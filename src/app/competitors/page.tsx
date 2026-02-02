'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Plane, ExternalLink } from 'lucide-react'

interface CompetitorAlert {
  id: string
  competitor: string
  route: string
  theirPrice: number
  ourPrice: number
  priceDiff: number
  alertType: 'price_lower' | 'new_promo' | 'schedule_change' | 'new_route'
  recommendation: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  status: 'new' | 'analyzing' | 'action_taken' | 'ignored'
  date: string
}

const demoAlerts: CompetitorAlert[] = [
  {
    id: '1',
    competitor: 'Air France',
    route: 'PPT-CDG',
    theirPrice: 1850,
    ourPrice: 2100,
    priceDiff: -250,
    alertType: 'price_lower',
    recommendation: 'Air France propose actuellement une promotion à -12% sur PPT-CDG. Recommandation: Créer une offre flash -10% pour les 48 prochaines heures ciblant le segment "Famille" qui représente 35% des réservations sur cette route.',
    priority: 'urgent',
    status: 'new',
    date: '2026-01-28T10:30:00',
  },
  {
    id: '2',
    competitor: 'Hawaiian Airlines',
    route: 'PPT-LAX',
    theirPrice: 1450,
    ourPrice: 1380,
    priceDiff: 70,
    alertType: 'new_promo',
    recommendation: 'Hawaiian Airlines a lancé une promo "Early Bird" mais reste plus cher. Notre positionnement tarifaire est optimal. Maintenir les tarifs actuels et mettre en avant notre avantage prix dans les newsletters.',
    priority: 'low',
    status: 'action_taken',
    date: '2026-01-28T08:15:00',
  },
  {
    id: '3',
    competitor: 'United Airlines',
    route: 'PPT-LAX',
    theirPrice: 1520,
    ourPrice: 1380,
    priceDiff: 140,
    alertType: 'schedule_change',
    recommendation: 'United a ajouté un vol de nuit concurrent à notre TN1. Notre horaire reste plus attractif (départ 23h55 vs 02h00). Aucune action immédiate requise.',
    priority: 'medium',
    status: 'analyzing',
    date: '2026-01-27T22:00:00',
  },
  {
    id: '4',
    competitor: 'LATAM',
    route: 'PPT-AKL',
    theirPrice: 980,
    ourPrice: 1150,
    priceDiff: -170,
    alertType: 'price_lower',
    recommendation: 'LATAM casse les prix sur Auckland avec une offre agressive. Proposer un package incluant 1 nuit d\'hôtel offerte pour différencier notre offre sans guerre tarifaire directe.',
    priority: 'high',
    status: 'new',
    date: '2026-01-27T18:30:00',
  },
]

const competitorLogos: Record<string, string> = {
  'Air France': 'AF',
  'Hawaiian Airlines': 'HA',
  'United Airlines': 'UA',
  'LATAM': 'LA',
  'Qantas': 'QF',
}

const priorityConfigs = {
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' },
  high: { label: 'Haute', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  medium: { label: 'Moyenne', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  low: { label: 'Basse', color: 'bg-slate-100 text-slate-700 border-slate-200' },
}

function AlertCard({ alert, onTakeAction }: { alert: CompetitorAlert; onTakeAction: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const priceDiffPositive = alert.priceDiff > 0

  return (
    <div className={`card border-l-4 ${priorityConfigs[alert.priority].color.replace('bg-', 'border-').replace('-100', '-500')}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center font-bold">
            {competitorLogos[alert.competitor] || '??'}
          </div>
          <div>
            <h3 className="font-bold">{alert.competitor}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Plane className="w-4 h-4" />
              <span>{alert.route}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityConfigs[alert.priority].color}`}>
          {priorityConfigs[alert.priority].label}
        </span>
      </div>

      {/* Prix comparison */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg mb-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Leur prix</p>
          <p className="text-xl font-bold">{alert.theirPrice}€</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Notre prix</p>
          <p className="text-xl font-bold text-atn-primary">{alert.ourPrice}€</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Différence</p>
          <p className={`text-xl font-bold flex items-center gap-1 ${priceDiffPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {priceDiffPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            {priceDiffPositive ? '+' : ''}{alert.priceDiff}€
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mb-4">
        <button
          className="text-sm text-atn-secondary hover:underline flex items-center gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Masquer' : 'Voir'} la recommandation IA
        </button>
        {expanded && (
          <div className="mt-3 p-4 bg-atn-secondary/10 rounded-lg">
            <p className="text-sm">{alert.recommendation}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {alert.status === 'new' && (
            <>
              <button
                className="px-4 py-2 bg-atn-primary text-white rounded-lg text-sm hover:bg-opacity-90"
                onClick={onTakeAction}
              >
                Prendre action
              </button>
              <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300">
                Analyser
              </button>
            </>
          )}
          {alert.status === 'analyzing' && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              En analyse
            </span>
          )}
          {alert.status === 'action_taken' && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-sm">
              Action prise
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

export default function CompetitorsPage() {
  const [alerts, setAlerts] = useState(demoAlerts)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)

  const handleTakeAction = (id: string) => {
    setAlerts(alerts.map(a =>
      a.id === id ? { ...a, status: 'action_taken' as const } : a
    ))
  }

  const filteredAlerts = filterPriority
    ? alerts.filter(a => a.priority === filterPriority)
    : alerts

  // Stats
  const urgentCount = alerts.filter(a => a.priority === 'urgent' || a.priority === 'high').length
  const competitorsCheaper = alerts.filter(a => a.priceDiff < 0).length
  const avgPriceDiff = Math.round(alerts.reduce((acc, a) => acc + a.priceDiff, 0) / alerts.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-atn-secondary" />
            Intelligence Concurrentielle
          </h1>
          <p className="text-slate-500">Build 7: Veille des prix et promotions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Alertes urgentes</p>
          <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Concurrents - chers</p>
          <p className="text-2xl font-bold text-red-600">{competitorsCheaper}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Diff. prix moyenne</p>
          <p className={`text-2xl font-bold ${avgPriceDiff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {avgPriceDiff >= 0 ? '+' : ''}{avgPriceDiff}€
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Concurrents surveillés</p>
          <p className="text-2xl font-bold">5</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {[null, 'urgent', 'high', 'medium', 'low'].map((priority) => (
          <button
            key={priority || 'all'}
            className={`px-4 py-2 rounded-lg text-sm ${
              filterPriority === priority ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
            }`}
            onClick={() => setFilterPriority(priority)}
          >
            {priority === null ? 'Toutes' : priorityConfigs[priority as keyof typeof priorityConfigs].label}
          </button>
        ))}
      </div>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onTakeAction={() => handleTakeAction(alert.id)}
          />
        ))}
      </div>
    </div>
  )
}
