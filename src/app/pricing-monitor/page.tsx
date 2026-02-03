'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Minus, AlertTriangle, RefreshCw, Calendar, Plane, ArrowRight } from 'lucide-react'

interface PricePoint {
  date: string
  atn: number
  competitor: number
  competitorName: string
}

interface Route {
  id: string
  origin: string
  destination: string
  originCode: string
  destCode: string
  atnPrice: number
  competitors: {
    name: string
    price: number
    trend: 'up' | 'down' | 'stable'
    change: number
  }[]
  alert: boolean
  lastUpdated: string
  priceHistory: PricePoint[]
}

const demoRoutes: Route[] = [
  {
    id: '1',
    origin: 'Papeete',
    destination: 'Los Angeles',
    originCode: 'PPT',
    destCode: 'LAX',
    atnPrice: 185000,
    competitors: [
      { name: 'French Bee', price: 165000, trend: 'down', change: -8 },
      { name: 'United Airlines', price: 195000, trend: 'stable', change: 0 },
      { name: 'Air France', price: 210000, trend: 'up', change: 5 },
    ],
    alert: true,
    lastUpdated: '2026-01-29T10:00:00',
    priceHistory: [
      { date: '2026-01-23', atn: 185000, competitor: 180000, competitorName: 'French Bee' },
      { date: '2026-01-24', atn: 185000, competitor: 175000, competitorName: 'French Bee' },
      { date: '2026-01-25', atn: 185000, competitor: 172000, competitorName: 'French Bee' },
      { date: '2026-01-26', atn: 185000, competitor: 168000, competitorName: 'French Bee' },
      { date: '2026-01-27', atn: 185000, competitor: 167000, competitorName: 'French Bee' },
      { date: '2026-01-28', atn: 185000, competitor: 166000, competitorName: 'French Bee' },
      { date: '2026-01-29', atn: 185000, competitor: 165000, competitorName: 'French Bee' },
    ],
  },
  {
    id: '2',
    origin: 'Papeete',
    destination: 'Paris',
    originCode: 'PPT',
    destCode: 'CDG',
    atnPrice: 245000,
    competitors: [
      { name: 'French Bee', price: 235000, trend: 'stable', change: 0 },
      { name: 'Air France', price: 265000, trend: 'up', change: 3 },
    ],
    alert: false,
    lastUpdated: '2026-01-29T10:00:00',
    priceHistory: [],
  },
  {
    id: '3',
    origin: 'Papeete',
    destination: 'Tokyo',
    originCode: 'PPT',
    destCode: 'NRT',
    atnPrice: 195000,
    competitors: [
      { name: 'ANA', price: 205000, trend: 'down', change: -4 },
      { name: 'JAL', price: 215000, trend: 'stable', change: 0 },
    ],
    alert: false,
    lastUpdated: '2026-01-29T10:00:00',
    priceHistory: [],
  },
  {
    id: '4',
    origin: 'Papeete',
    destination: 'Auckland',
    originCode: 'PPT',
    destCode: 'AKL',
    atnPrice: 125000,
    competitors: [
      { name: 'Air New Zealand', price: 118000, trend: 'down', change: -6 },
    ],
    alert: true,
    lastUpdated: '2026-01-29T10:00:00',
    priceHistory: [],
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' XPF'
}

function TrendBadge({ trend, change }: { trend: 'up' | 'down' | 'stable'; change: number }) {
  const config = {
    up: { icon: TrendingUp, color: 'text-red-600 bg-red-100' },
    down: { icon: TrendingDown, color: 'text-emerald-600 bg-emerald-100' },
    stable: { icon: Minus, color: 'text-slate-600 bg-slate-100' },
  }
  const { icon: Icon, color } = config[trend]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {change !== 0 && `${change > 0 ? '+' : ''}${change}%`}
    </span>
  )
}

function PriceChart({ data }: { data: PricePoint[] }) {
  if (data.length === 0) return null

  const maxPrice = Math.max(...data.flatMap(d => [d.atn, d.competitor]))
  const minPrice = Math.min(...data.flatMap(d => [d.atn, d.competitor]))
  const range = maxPrice - minPrice || 1

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <p className="text-sm font-medium mb-3">Évolution 7 jours</p>
      <div className="flex items-end gap-1 h-24">
        {data.map((point, idx) => (
          <div key={idx} className="flex-1 flex flex-col gap-1">
            <div className="flex-1 flex items-end gap-0.5">
              <div
                className="flex-1 bg-atn-primary rounded-t"
                style={{ height: `${((point.atn - minPrice) / range) * 100}%`, minHeight: '4px' }}
                title={`ATN: ${formatPrice(point.atn)}`}
              />
              <div
                className="flex-1 bg-rose-400 rounded-t"
                style={{ height: `${((point.competitor - minPrice) / range) * 100}%`, minHeight: '4px' }}
                title={`${point.competitorName}: ${formatPrice(point.competitor)}`}
              />
            </div>
            <span className="text-[10px] text-slate-400 text-center">
              {new Date(point.date).toLocaleDateString('fr-FR', { day: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2 justify-center">
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <span className="w-3 h-3 bg-atn-primary rounded" /> ATN
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <span className="w-3 h-3 bg-rose-400 rounded" /> Concurrent
        </span>
      </div>
    </div>
  )
}

function RouteCard({ route }: { route: Route }) {
  const lowestCompetitor = route.competitors.reduce((prev, curr) =>
    prev.price < curr.price ? prev : curr
  )
  const priceDiff = route.atnPrice - lowestCompetitor.price
  const priceDiffPercent = ((priceDiff / lowestCompetitor.price) * 100).toFixed(1)

  return (
    <div className={`card ${route.alert ? 'border-l-4 border-l-amber-500' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{route.originCode}</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-lg font-bold">{route.destCode}</span>
          </div>
          {route.alert && (
            <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              Alerte prix
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">
          MAJ: {new Date(route.lastUpdated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-atn-primary/10 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Prix ATN</p>
          <p className="text-xl font-bold text-atn-primary">{formatPrice(route.atnPrice)}</p>
        </div>
        <div className={`p-4 rounded-lg ${priceDiff > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
          <p className="text-sm text-slate-600 mb-1">vs Meilleur concurrent</p>
          <p className={`text-xl font-bold ${priceDiff > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {priceDiff > 0 ? '+' : ''}{formatPrice(priceDiff)}
          </p>
          <p className="text-xs text-slate-500">({priceDiff > 0 ? '+' : ''}{priceDiffPercent}%)</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Concurrents</p>
        {route.competitors.map(comp => (
          <div key={comp.name} className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span className="text-sm">{comp.name}</span>
            <div className="flex items-center gap-3">
              <span className="font-medium text-sm">{formatPrice(comp.price)}</span>
              <TrendBadge trend={comp.trend} change={comp.change} />
            </div>
          </div>
        ))}
      </div>

      <PriceChart data={route.priceHistory} />
    </div>
  )
}

export default function PricingMonitorPage() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)

  const stats = {
    routesMonitored: demoRoutes.length,
    alerts: demoRoutes.filter(r => r.alert).length,
    competitorsTracked: Array.from(new Set(demoRoutes.flatMap(r => r.competitors.map(c => c.name)))).length,
    avgDiff: demoRoutes.reduce((acc, r) => {
      const lowest = Math.min(...r.competitors.map(c => c.price))
      return acc + ((r.atnPrice - lowest) / lowest) * 100
    }, 0) / demoRoutes.length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-rose-500" />
            Competitor Pricing Monitor
          </h1>
          <p className="text-slate-500">Build 20: Veille tarifaire quotidienne</p>
        </div>
        <button data-guide="pricing-btn-refresh" className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg hover:bg-opacity-90">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-guide="pricing-kpi-routes" className="card">
          <p className="text-sm text-slate-500">Routes surveillées</p>
          <p className="text-2xl font-bold">{stats.routesMonitored}</p>
        </div>
        <div data-guide="pricing-kpi-alerts" className="card">
          <p className="text-sm text-slate-500">Alertes actives</p>
          <p className="text-2xl font-bold text-amber-600">{stats.alerts}</p>
        </div>
        <div data-guide="pricing-kpi-competitors" className="card">
          <p className="text-sm text-slate-500">Concurrents suivis</p>
          <p className="text-2xl font-bold">{stats.competitorsTracked}</p>
        </div>
        <div data-guide="pricing-kpi-avgdiff" className="card">
          <p className="text-sm text-slate-500">Écart moyen</p>
          <p className={`text-2xl font-bold ${stats.avgDiff > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {stats.avgDiff > 0 ? '+' : ''}{stats.avgDiff.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Alertes */}
      {stats.alerts > 0 && (
        <div data-guide="pricing-alerts-box" className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="font-medium text-amber-800">Alertes tarifaires</span>
          </div>
          <p className="text-sm text-amber-700">
            {stats.alerts} route(s) avec un concurrent significativement moins cher.
            Recommandation : réviser la politique tarifaire.
          </p>
        </div>
      )}

      {/* Routes */}
      <div data-guide="pricing-routes-list" className="grid grid-cols-2 gap-6">
        {demoRoutes.map(route => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </div>
  )
}
