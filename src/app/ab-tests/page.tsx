'use client'

import { useState } from 'react'
import { FlaskConical, Trophy, Users, BarChart3, Play, Pause, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Variant {
  id: string
  name: string
  description: string
  traffic: number
  metrics: {
    impressions: number
    clicks: number
    conversions: number
    revenue: number
  }
}

interface ABTest {
  id: string
  name: string
  type: 'email' | 'landing' | 'pricing' | 'cta'
  status: 'running' | 'completed' | 'draft'
  startDate: string
  endDate?: string
  variants: Variant[]
  winner?: string
  confidence: number
  minSampleSize: number
}

const demoTests: ABTest[] = [
  {
    id: '1',
    name: 'Objet Email Newsletter',
    type: 'email',
    status: 'running',
    startDate: '2026-01-22',
    variants: [
      {
        id: 'a',
        name: 'Variante A',
        description: '🌴 Envie de Polynésie ? Découvrez nos offres',
        traffic: 50,
        metrics: { impressions: 12500, clicks: 2800, conversions: 145, revenue: 26100000 },
      },
      {
        id: 'b',
        name: 'Variante B',
        description: 'Vos prochaines vacances à Tahiti vous attendent',
        traffic: 50,
        metrics: { impressions: 12500, clicks: 3150, conversions: 168, revenue: 30240000 },
      },
    ],
    confidence: 94.2,
    minSampleSize: 25000,
  },
  {
    id: '2',
    name: 'CTA Page Booking',
    type: 'cta',
    status: 'completed',
    startDate: '2026-01-10',
    endDate: '2026-01-20',
    variants: [
      {
        id: 'a',
        name: 'Variante A',
        description: 'Réserver maintenant',
        traffic: 50,
        metrics: { impressions: 45000, clicks: 4950, conversions: 890, revenue: 160200000 },
      },
      {
        id: 'b',
        name: 'Variante B',
        description: 'Commencer mon voyage',
        traffic: 50,
        metrics: { impressions: 45000, clicks: 5850, conversions: 1120, revenue: 201600000 },
      },
    ],
    winner: 'b',
    confidence: 99.1,
    minSampleSize: 80000,
  },
  {
    id: '3',
    name: 'Pricing Display',
    type: 'pricing',
    status: 'running',
    startDate: '2026-01-25',
    variants: [
      {
        id: 'a',
        name: 'Prix total',
        description: 'Afficher le prix total incluant taxes',
        traffic: 33,
        metrics: { impressions: 8200, clicks: 1640, conversions: 82, revenue: 14760000 },
      },
      {
        id: 'b',
        name: 'Prix à partir de',
        description: 'Prix de base + mention taxes incluses',
        traffic: 33,
        metrics: { impressions: 8200, clicks: 1886, conversions: 94, revenue: 16920000 },
      },
      {
        id: 'c',
        name: 'Prix mensuel',
        description: 'Afficher le prix en mensualités',
        traffic: 34,
        metrics: { impressions: 8400, clicks: 2100, conversions: 105, revenue: 18900000 },
      },
    ],
    confidence: 78.5,
    minSampleSize: 30000,
  },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' XPF'
}

function ConfidenceBadge({ confidence, status }: { confidence: number; status: ABTest['status'] }) {
  if (status === 'draft') return null

  let color = 'bg-slate-100 text-slate-700'
  if (confidence >= 95) color = 'bg-emerald-100 text-emerald-700'
  else if (confidence >= 90) color = 'bg-blue-100 text-blue-700'
  else if (confidence >= 80) color = 'bg-amber-100 text-amber-700'

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {confidence}% confiance
    </span>
  )
}

function VariantCard({ variant, isWinner, testStatus }: { variant: Variant; isWinner: boolean; testStatus: ABTest['status'] }) {
  const ctr = ((variant.metrics.clicks / variant.metrics.impressions) * 100).toFixed(2)
  const convRate = ((variant.metrics.conversions / variant.metrics.clicks) * 100).toFixed(2)

  return (
    <div className={`p-4 rounded-lg border-2 ${isWinner ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{variant.name}</span>
          {isWinner && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white rounded text-xs font-medium">
              <Trophy className="w-3 h-3" />
              Gagnant
            </span>
          )}
        </div>
        <span className="text-sm text-slate-500">{variant.traffic}% trafic</span>
      </div>

      <p className="text-sm text-slate-600 mb-4 p-2 bg-white rounded">{variant.description}</p>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <p className="text-lg font-bold">{variant.metrics.impressions.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Impressions</p>
        </div>
        <div>
          <p className="text-lg font-bold">{ctr}%</p>
          <p className="text-xs text-slate-500">CTR</p>
        </div>
        <div>
          <p className="text-lg font-bold">{convRate}%</p>
          <p className="text-xs text-slate-500">Conv.</p>
        </div>
        <div>
          <p className="text-lg font-bold text-atn-primary">{formatCurrency(variant.metrics.revenue)}</p>
          <p className="text-xs text-slate-500">Revenue</p>
        </div>
      </div>
    </div>
  )
}

function TestCard({ test }: { test: ABTest }) {
  const [expanded, setExpanded] = useState(false)

  const statusConfig = {
    running: { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: Play },
    completed: { label: 'Terminé', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    draft: { label: 'Brouillon', color: 'bg-slate-100 text-slate-700', icon: Clock },
  }
  const status = statusConfig[test.status]

  const typeLabels = {
    email: 'Email',
    landing: 'Landing Page',
    pricing: 'Tarification',
    cta: 'Call-to-Action',
  }

  const totalImpressions = test.variants.reduce((acc, v) => acc + v.metrics.impressions, 0)
  const progress = (totalImpressions / test.minSampleSize) * 100

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold">{test.name}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
              <status.icon className="w-3 h-3" />
              {status.label}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{typeLabels[test.type]}</span>
          </div>
          <p className="text-sm text-slate-500">
            Démarré le {new Date(test.startDate).toLocaleDateString('fr-FR')}
            {test.endDate && ` • Terminé le ${new Date(test.endDate).toLocaleDateString('fr-FR')}`}
          </p>
        </div>
        <ConfidenceBadge confidence={test.confidence} status={test.status} />
      </div>

      {test.status === 'running' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-500">Progression échantillon</span>
            <span className="font-medium">{totalImpressions.toLocaleString()} / {test.minSampleSize.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-atn-primary rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      <button
        className="text-sm text-atn-secondary hover:underline flex items-center gap-1"
        onClick={() => setExpanded(!expanded)}
      >
        <FlaskConical className="w-4 h-4" />
        {expanded ? 'Masquer les variantes' : `Voir ${test.variants.length} variantes`}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
          {test.variants.map(variant => (
            <VariantCard
              key={variant.id}
              variant={variant}
              isWinner={test.winner === variant.id}
              testStatus={test.status}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ABTestsPage() {
  const stats = {
    running: demoTests.filter(t => t.status === 'running').length,
    completed: demoTests.filter(t => t.status === 'completed').length,
    avgLift: '+14.6%',
    totalRevenue: demoTests.reduce((acc, t) => acc + t.variants.reduce((a, v) => a + v.metrics.revenue, 0), 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FlaskConical className="w-7 h-7 text-emerald-500" />
            A/B Test Engine
          </h1>
          <p className="text-slate-500">Build 22: Tests A/B avec analyse statistique</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg hover:bg-opacity-90">
          <FlaskConical className="w-4 h-4" />
          Nouveau test
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Tests en cours</p>
          <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Tests terminés</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Lift moyen</p>
          <p className="text-2xl font-bold text-atn-primary">{stats.avgLift}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Revenue total testé</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-800">Méthodologie statistique</span>
        </div>
        <p className="text-sm text-blue-700">
          Les tests utilisent un niveau de confiance de 95% avec correction de Bonferroni pour les tests multi-variantes.
          Un test est considéré significatif uniquement après avoir atteint la taille d'échantillon minimale.
        </p>
      </div>

      <div className="space-y-4">
        {demoTests.map(test => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  )
}
