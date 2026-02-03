'use client'

import { useState, useEffect } from 'react'
import { GitBranch, Play, Pause, Clock, ArrowRight, Plus, MoreVertical, RefreshCw, Loader2 } from 'lucide-react'

interface JourneyStep {
  id: string
  type: 'email' | 'sms' | 'wait' | 'condition' | 'action'
  name: string
  config: Record<string, unknown>
}

interface Journey {
  id: string
  name: string
  trigger: string
  status: 'active' | 'paused' | 'draft'
  steps: JourneyStep[]
  stats: {
    entered: number
    completed: number
    inProgress: number
    conversionRate: number
  }
  lastTriggered: string
}

const fallbackJourneys: Journey[] = [
  {
    id: '1',
    name: 'Post-Réservation',
    trigger: 'Nouvelle réservation confirmée',
    status: 'active',
    steps: [
      { id: 's1', type: 'email', name: 'Email de confirmation', config: {} },
      { id: 's2', type: 'wait', name: 'Attendre 3 jours', config: { days: 3 } },
      { id: 's3', type: 'email', name: 'Guide destination', config: {} },
      { id: 's4', type: 'wait', name: 'Attendre J-7', config: { before: 7 } },
      { id: 's5', type: 'email', name: 'Check-in en ligne', config: {} },
      { id: 's6', type: 'sms', name: 'Rappel embarquement', config: {} },
    ],
    stats: { entered: 1250, completed: 890, inProgress: 280, conversionRate: 71.2 },
    lastTriggered: '2026-01-29T09:45:00',
  },
  {
    id: '2',
    name: 'Panier Abandonné',
    trigger: 'Recherche sans réservation (24h)',
    status: 'active',
    steps: [
      { id: 's1', type: 'wait', name: 'Attendre 2h', config: { hours: 2 } },
      { id: 's2', type: 'email', name: 'Rappel recherche', config: {} },
      { id: 's3', type: 'condition', name: 'A ouvert email?', config: {} },
      { id: 's4', type: 'email', name: 'Offre spéciale -10%', config: {} },
    ],
    stats: { entered: 3420, completed: 1540, inProgress: 890, conversionRate: 12.8 },
    lastTriggered: '2026-01-29T10:30:00',
  },
  {
    id: '3',
    name: 'Réengagement 6 mois',
    trigger: 'Aucune activité depuis 6 mois',
    status: 'paused',
    steps: [
      { id: 's1', type: 'email', name: 'Tu nous manques', config: {} },
      { id: 's2', type: 'wait', name: 'Attendre 7 jours', config: { days: 7 } },
      { id: 's3', type: 'email', name: 'Offre de bienvenue', config: {} },
    ],
    stats: { entered: 8500, completed: 2100, inProgress: 0, conversionRate: 4.2 },
    lastTriggered: '2026-01-15T14:00:00',
  },
  {
    id: '4',
    name: 'Anniversaire Club Tiare',
    trigger: 'Anniversaire membre fidélité',
    status: 'active',
    steps: [
      { id: 's1', type: 'email', name: 'Joyeux anniversaire!', config: {} },
      { id: 's2', type: 'action', name: 'Crédit 1000 miles', config: {} },
    ],
    stats: { entered: 450, completed: 445, inProgress: 5, conversionRate: 98.9 },
    lastTriggered: '2026-01-29T00:00:00',
  },
]

function StepBadge({ type }: { type: JourneyStep['type'] }) {
  const config = {
    email: { label: 'Email', color: 'bg-blue-100 text-blue-700' },
    sms: { label: 'SMS', color: 'bg-emerald-100 text-emerald-700' },
    wait: { label: 'Attente', color: 'bg-amber-100 text-amber-700' },
    condition: { label: 'Condition', color: 'bg-purple-100 text-purple-700' },
    action: { label: 'Action', color: 'bg-rose-100 text-rose-700' },
  }
  const { label, color } = config[type]

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}

function JourneyCard({ journey }: { journey: Journey }) {
  const [expanded, setExpanded] = useState(false)

  const statusConfig = {
    active: { label: 'Actif', color: 'bg-emerald-100 text-emerald-700', icon: Play },
    paused: { label: 'En pause', color: 'bg-amber-100 text-amber-700', icon: Pause },
    draft: { label: 'Brouillon', color: 'bg-slate-100 text-slate-700', icon: Clock },
  }
  const status = statusConfig[journey.status]

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold">{journey.name}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
              <status.icon className="w-3 h-3" />
              {status.label}
            </span>
          </div>
          <p className="text-sm text-slate-500">Déclencheur: {journey.trigger}</p>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded">
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-2xl font-bold">{journey.stats.entered.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Entrés</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{journey.stats.inProgress.toLocaleString()}</p>
          <p className="text-xs text-slate-500">En cours</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-2xl font-bold text-emerald-600">{journey.stats.completed.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Complétés</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-2xl font-bold text-atn-primary">{journey.stats.conversionRate}%</p>
          <p className="text-xs text-slate-500">Conversion</p>
        </div>
      </div>

      <button
        className="text-sm text-atn-secondary hover:underline flex items-center gap-1"
        onClick={() => setExpanded(!expanded)}
      >
        <GitBranch className="w-4 h-4" />
        {expanded ? 'Masquer les étapes' : `Voir les ${journey.steps.length} étapes`}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            {journey.steps.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <StepBadge type={step.type} />
                  <span className="text-sm">{step.name}</span>
                </div>
                {idx < journey.steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
        Dernier déclenchement: {new Date(journey.lastTriggered).toLocaleString('fr-FR')}
      </div>
    </div>
  )
}

export default function JourneysPage() {
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Fetch journeys from Airtable
  const fetchJourneys = async () => {
    try {
      const response = await fetch('/api/airtable?table=Journeys&sortField=Last_Triggered&sortDir=desc&limit=50')
      const data = await response.json()

      if (data.records && data.records.length > 0) {
        const mapped: Journey[] = data.records.map((record: { id: string; fields: Record<string, unknown> }) => ({
          id: record.id,
          name: (record.fields.Name as string) || 'Journey',
          trigger: (record.fields.Trigger as string) || '',
          status: ((record.fields.Status as string)?.toLowerCase() || 'draft') as Journey['status'],
          steps: (record.fields.Steps as JourneyStep[]) || [],
          stats: {
            entered: (record.fields.Stats_Entered as number) || 0,
            completed: (record.fields.Stats_Completed as number) || 0,
            inProgress: (record.fields.Stats_InProgress as number) || 0,
            conversionRate: (record.fields.Stats_ConversionRate as number) || 0,
          },
          lastTriggered: (record.fields.Last_Triggered as string) || new Date().toISOString(),
        }))
        setJourneys(mapped)
      } else {
        setJourneys(fallbackJourneys)
      }
    } catch (error) {
      console.error('Error fetching journeys:', error)
      setJourneys(fallbackJourneys)
    } finally {
      setLoading(false)
    }
  }

  // Sync journeys (trigger n8n workflow)
  const syncJourneys = async () => {
    setSyncing(true)
    try {
      await fetch('https://n8n.srv1140766.hstgr.cloud/webhook/atn-journey-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' })
      })
      await fetchJourneys()
    } catch (error) {
      console.error('Error syncing journeys:', error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchJourneys()
  }, [])

  const stats = {
    activeJourneys: journeys.filter(j => j.status === 'active').length,
    totalInJourney: journeys.reduce((acc, j) => acc + j.stats.inProgress, 0),
    completedToday: journeys.reduce((acc, j) => acc + j.stats.completed, 0),
    avgConversion: journeys.length > 0 ? (journeys.reduce((acc, j) => acc + j.stats.conversionRate, 0) / journeys.length).toFixed(1) : '0',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <GitBranch className="w-7 h-7 text-indigo-500" />
            Journey Orchestrator
          </h1>
          <p className="text-slate-500">Build 21: Séquences automatisées multi-étapes</p>
        </div>
        <div className="flex gap-2">
          <button
            data-guide="journeys-btn-sync"
            onClick={syncJourneys}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50"
          >
            {syncing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {syncing ? 'Sync...' : 'Actualiser'}
          </button>
          <button data-guide="journeys-btn-new" className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg hover:bg-opacity-90">
            <Plus className="w-4 h-4" />
            Nouveau Journey
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-guide="journeys-kpi-active" className="card">
          <p className="text-sm text-slate-500">Journeys actifs</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.activeJourneys}</p>
        </div>
        <div data-guide="journeys-kpi-inprogress" className="card">
          <p className="text-sm text-slate-500">Clients en parcours</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalInJourney.toLocaleString()}</p>
        </div>
        <div data-guide="journeys-kpi-completed" className="card">
          <p className="text-sm text-slate-500">Complétés aujourd'hui</p>
          <p className="text-2xl font-bold">{stats.completedToday}</p>
        </div>
        <div data-guide="journeys-kpi-conversion" className="card">
          <p className="text-sm text-slate-500">Conversion moyenne</p>
          <p className="text-2xl font-bold text-atn-primary">{stats.avgConversion}%</p>
        </div>
      </div>

      <div data-guide="journeys-journeys-list" className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atn-primary" />
            <span className="ml-3 text-slate-500">Chargement des journeys...</span>
          </div>
        ) : journeys.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Aucun journey configuré
          </div>
        ) : (
          journeys.map(journey => (
            <JourneyCard key={journey.id} journey={journey} />
          ))
        )}
      </div>
    </div>
  )
}
