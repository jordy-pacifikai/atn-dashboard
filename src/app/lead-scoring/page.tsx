'use client'

import { useState } from 'react'
import { Target, TrendingUp, TrendingDown, User, Mail, MousePointer, Calendar, Star, Filter, ArrowUpRight } from 'lucide-react'

interface Lead {
  id: string
  email: string
  name: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D'
  lastActivity: string
  activities: {
    type: 'pageview' | 'email_open' | 'email_click' | 'search' | 'booking_start' | 'download'
    description: string
    points: number
    timestamp: string
  }[]
  predictedValue: number
  conversionProbability: number
}

const demoLeads: Lead[] = [
  {
    id: '1',
    email: 'marie.dupont@email.com',
    name: 'Marie Dupont',
    score: 87,
    grade: 'A',
    lastActivity: '2026-01-29T10:30:00',
    activities: [
      { type: 'booking_start', description: 'Démarré réservation PPT-LAX', points: 25, timestamp: '2026-01-29T10:30:00' },
      { type: 'email_click', description: 'Clic sur offre Business Class', points: 15, timestamp: '2026-01-29T09:15:00' },
      { type: 'pageview', description: 'Page Poerava Business (3 min)', points: 10, timestamp: '2026-01-28T16:00:00' },
      { type: 'search', description: 'Recherche Papeete-Paris février', points: 8, timestamp: '2026-01-28T15:45:00' },
    ],
    predictedValue: 450000,
    conversionProbability: 78,
  },
  {
    id: '2',
    email: 'john.smith@company.com',
    name: 'John Smith',
    score: 72,
    grade: 'A',
    lastActivity: '2026-01-29T08:00:00',
    activities: [
      { type: 'email_click', description: 'Clic sur newsletter destinations', points: 15, timestamp: '2026-01-29T08:00:00' },
      { type: 'pageview', description: 'Comparaison vols (5 pages)', points: 12, timestamp: '2026-01-28T20:00:00' },
      { type: 'download', description: 'Guide Polynésie PDF', points: 10, timestamp: '2026-01-27T14:00:00' },
    ],
    predictedValue: 320000,
    conversionProbability: 62,
  },
  {
    id: '3',
    email: 'sophie.martin@email.fr',
    name: 'Sophie Martin',
    score: 45,
    grade: 'B',
    lastActivity: '2026-01-28T12:00:00',
    activities: [
      { type: 'email_open', description: 'Ouverture newsletter', points: 5, timestamp: '2026-01-28T12:00:00' },
      { type: 'pageview', description: 'Page accueil', points: 3, timestamp: '2026-01-25T10:00:00' },
    ],
    predictedValue: 180000,
    conversionProbability: 28,
  },
  {
    id: '4',
    email: 'tanaka.yuki@mail.jp',
    name: 'Tanaka Yuki',
    score: 31,
    grade: 'C',
    lastActivity: '2026-01-27T09:00:00',
    activities: [
      { type: 'pageview', description: 'Page destinations', points: 5, timestamp: '2026-01-27T09:00:00' },
      { type: 'email_open', description: 'Ouverture welcome email', points: 3, timestamp: '2026-01-20T10:00:00' },
    ],
    predictedValue: 95000,
    conversionProbability: 12,
  },
  {
    id: '5',
    email: 'inactive@email.com',
    name: 'Paul Inactive',
    score: 8,
    grade: 'D',
    lastActivity: '2026-01-10T09:00:00',
    activities: [
      { type: 'email_open', description: 'Ouverture email (bounce)', points: 2, timestamp: '2026-01-10T09:00:00' },
    ],
    predictedValue: 0,
    conversionProbability: 2,
  },
]

const activityIcons = {
  pageview: MousePointer,
  email_open: Mail,
  email_click: Mail,
  search: Target,
  booking_start: Calendar,
  download: ArrowUpRight,
}

function GradeBadge({ grade }: { grade: Lead['grade'] }) {
  const config = {
    A: { color: 'bg-emerald-500 text-white', label: 'Hot Lead' },
    B: { color: 'bg-blue-500 text-white', label: 'Warm' },
    C: { color: 'bg-amber-500 text-white', label: 'Cold' },
    D: { color: 'bg-slate-400 text-white', label: 'Inactive' },
  }
  const { color, label } = config[grade]

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>
      {grade} - {label}
    </span>
  )
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (score / 100) * circumference

  let color = '#ef4444'
  if (score >= 70) color = '#10b981'
  else if (score >= 40) color = '#3b82f6'
  else if (score >= 20) color = '#f59e0b'

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90">
        <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle
          cx="48" cy="48" r="40"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{score}</span>
      </div>
    </div>
  )
}

function LeadCard({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card">
      <div className="flex items-start gap-4">
        <ScoreRing score={lead.score} />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold">{lead.name}</h3>
              <p className="text-sm text-slate-500">{lead.email}</p>
            </div>
            <GradeBadge grade={lead.grade} />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-2 bg-slate-50 rounded text-center">
              <p className="text-lg font-bold text-atn-primary">{lead.conversionProbability}%</p>
              <p className="text-xs text-slate-500">Prob. conversion</p>
            </div>
            <div className="p-2 bg-slate-50 rounded text-center">
              <p className="text-lg font-bold">{new Intl.NumberFormat('fr-FR').format(lead.predictedValue)} XPF</p>
              <p className="text-xs text-slate-500">Valeur prédite</p>
            </div>
            <div className="p-2 bg-slate-50 rounded text-center">
              <p className="text-lg font-bold">{lead.activities.length}</p>
              <p className="text-xs text-slate-500">Actions</p>
            </div>
          </div>

          <button
            className="text-sm text-atn-secondary hover:underline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Masquer activités' : 'Voir historique'}
          </button>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              {lead.activities.map((activity, idx) => {
                const Icon = activityIcons[activity.type]
                return (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(activity.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">+{activity.points} pts</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LeadScoringPage() {
  const [filterGrade, setFilterGrade] = useState<Lead['grade'] | 'all'>('all')

  const filteredLeads = filterGrade === 'all'
    ? demoLeads
    : demoLeads.filter(l => l.grade === filterGrade)

  const stats = {
    total: demoLeads.length,
    hotLeads: demoLeads.filter(l => l.grade === 'A').length,
    avgScore: Math.round(demoLeads.reduce((acc, l) => acc + l.score, 0) / demoLeads.length),
    totalPredictedValue: demoLeads.reduce((acc, l) => acc + l.predictedValue, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Target className="w-7 h-7 text-amber-500" />
            Lead Scoring Engine
          </h1>
          <p className="text-slate-500">Build 23: Scoring comportemental prospects</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Total leads</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Hot Leads (A)</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.hotLeads}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Score moyen</p>
          <p className="text-2xl font-bold text-atn-primary">{stats.avgScore}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Valeur pipeline</p>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('fr-FR').format(stats.totalPredictedValue)} XPF</p>
        </div>
      </div>

      {/* Scoring rules */}
      <div className="card bg-gradient-to-r from-amber-50 to-orange-50">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Règles de scoring
        </h2>
        <div className="grid grid-cols-6 gap-3 text-center">
          {[
            { action: 'Booking start', points: 25 },
            { action: 'Email click', points: 15 },
            { action: 'Page view (>2min)', points: 10 },
            { action: 'Search', points: 8 },
            { action: 'Email open', points: 5 },
            { action: 'Download', points: 10 },
          ].map(rule => (
            <div key={rule.action} className="p-3 bg-white rounded-lg">
              <p className="text-lg font-bold text-amber-600">+{rule.points}</p>
              <p className="text-xs text-slate-600">{rule.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {(['all', 'A', 'B', 'C', 'D'] as const).map(grade => (
          <button
            key={grade}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              filterGrade === grade ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setFilterGrade(grade)}
          >
            <Filter className="w-4 h-4" />
            {grade === 'all' ? 'Tous' : `Grade ${grade}`}
          </button>
        ))}
      </div>

      {/* Liste des leads */}
      <div className="space-y-4">
        {filteredLeads.map(lead => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  )
}
