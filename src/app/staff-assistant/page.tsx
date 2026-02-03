'use client'

import { useState, useEffect } from 'react'
import { UserCog, MessageSquare, Send, FileText, HelpCircle, Clock, CheckCircle, Search, Book, Settings, Loader2 } from 'lucide-react'

interface StaffQuery {
  id: string
  employee: {
    name: string
    department: string
    role: string
  }
  query: string
  response: string
  category: 'procedures' | 'hr' | 'technical' | 'operations'
  timestamp: string
  helpful: boolean | null
}

// Mapping des catégories Airtable vers les catégories du composant
const categoryMapping: Record<string, 'procedures' | 'hr' | 'technical' | 'operations'> = {
  'Procedure': 'procedures',
  'Planning': 'operations',
  'Conges': 'hr',
  'Formation': 'hr',
  'IT': 'technical',
  'Autre': 'procedures',
}

const categories = [
  { id: 'all', label: 'Toutes', icon: HelpCircle },
  { id: 'procedures', label: 'Procédures', icon: FileText },
  { id: 'hr', label: 'RH', icon: UserCog },
  { id: 'technical', label: 'Technique', icon: Settings },
  { id: 'operations', label: 'Opérations', icon: Clock },
]

function QueryCard({ query }: { query: StaffQuery }) {
  const categoryColors = {
    procedures: 'bg-blue-100 text-blue-700',
    hr: 'bg-purple-100 text-purple-700',
    technical: 'bg-amber-100 text-amber-700',
    operations: 'bg-emerald-100 text-emerald-700',
  }

  const categoryLabels = {
    procedures: 'Procédures',
    hr: 'RH',
    technical: 'Technique',
    operations: 'Opérations',
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <UserCog className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <p className="font-medium text-sm">{query.employee.name}</p>
            <p className="text-xs text-slate-500">{query.employee.department} • {query.employee.role}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[query.category]}`}>
          {categoryLabels[query.category]}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-slate-800 mb-2">{query.query}</p>
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-700 whitespace-pre-line">{query.response}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {new Date(query.timestamp).toLocaleString('fr-FR')}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Cette réponse était-elle utile ?</span>
          <button className={`p-1.5 rounded ${query.helpful === true ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-100'}`}>
            <CheckCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StaffAssistantPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [newQuestion, setNewQuestion] = useState('')
  const [queries, setQueries] = useState<StaffQuery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStaffRequests() {
      try {
        const res = await fetch('/api/airtable?table=Staff_Requests&view=Grid%20view')
        if (res.ok) {
          const data = await res.json()
          const mapped: StaffQuery[] = data.records.map((r: any) => ({
            id: r.id,
            employee: {
              name: r.fields.Employee_Name || 'Employé',
              department: r.fields.Department || 'N/A',
              role: r.fields.Employee_ID || '',
            },
            query: r.fields.Question || '',
            response: r.fields.Response || '',
            category: categoryMapping[r.fields.Category] || 'procedures',
            timestamp: r.fields.Date || new Date().toISOString(),
            helpful: r.fields.Status === 'answered' ? true : null,
          }))
          setQueries(mapped)
        }
      } catch (err) {
        console.error('Error fetching staff requests:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStaffRequests()
  }, [])

  const filteredQueries = queries.filter(q => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false
    if (searchQuery && !q.query.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const stats = {
    total: queries.length,
    helpful: queries.filter(q => q.helpful === true).length,
    procedures: queries.filter(q => q.category === 'procedures').length,
    avgResponseTime: '< 5s',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <UserCog className="w-7 h-7 text-cyan-500" />
            Staff Assistant TALIA
          </h1>
          <p className="text-slate-500">Build 19: Assistant interne employés ATN</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-guide="staff-kpi-questions" className="card">
          <p className="text-sm text-slate-500">Questions traitées</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div data-guide="staff-kpi-helpful" className="card">
          <p className="text-sm text-slate-500">Réponses utiles</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.helpful}</p>
        </div>
        <div data-guide="staff-kpi-procedures" className="card">
          <p className="text-sm text-slate-500">Procédures consultées</p>
          <p className="text-2xl font-bold text-blue-600">{stats.procedures}</p>
        </div>
        <div data-guide="staff-kpi-responsetime" className="card">
          <p className="text-sm text-slate-500">Temps de réponse</p>
          <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
        </div>
      </div>

      {/* Nouvelle question */}
      <div data-guide="staff-question-section" className="card bg-gradient-to-r from-cyan-50 to-blue-50">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-600" />
          Poser une question à TALIA
        </h2>
        <div className="flex gap-3">
          <input
            data-guide="staff-question-input"
            type="text"
            placeholder="Exemple: Quelle est la procédure pour..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 bg-white"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button data-guide="staff-btn-ask" className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-cyan-600">
            <Send className="w-5 h-5" />
            Demander
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button data-guide="staff-quicklink-procedures" className="px-3 py-1.5 bg-white rounded-full text-xs text-slate-600 hover:bg-slate-50">
            Procédures embarquement
          </button>
          <button data-guide="staff-quicklink-operations" className="px-3 py-1.5 bg-white rounded-full text-xs text-slate-600 hover:bg-slate-50">
            Opérations vol
          </button>
          <button data-guide="staff-quicklink-hr" className="px-3 py-1.5 bg-white rounded-full text-xs text-slate-600 hover:bg-slate-50">
            Questions RH
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            data-guide="staff-filter-all"
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              selectedCategory === 'all' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            <HelpCircle className="w-4 h-4" />
            Toutes
          </button>
          <button
            data-guide="staff-filter-procedures"
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              selectedCategory === 'procedures' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setSelectedCategory('procedures')}
          >
            <FileText className="w-4 h-4" />
            Procédures
          </button>
          <button
            data-guide="staff-filter-hr"
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              selectedCategory === 'hr' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setSelectedCategory('hr')}
          >
            <UserCog className="w-4 h-4" />
            RH
          </button>
          <button
            data-guide="staff-filter-technical"
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              selectedCategory === 'technical' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setSelectedCategory('technical')}
          >
            <Settings className="w-4 h-4" />
            Technique
          </button>
          <button
            data-guide="staff-filter-operations"
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              selectedCategory === 'operations' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setSelectedCategory('operations')}
          >
            <Clock className="w-4 h-4" />
            Opérations
          </button>
        </div>
        <div data-guide="staff-search" className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-atn-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Historique des questions */}
      <div data-guide="staff-history-list" className="space-y-4">
        {filteredQueries.map(query => (
          <QueryCard key={query.id} query={query} />
        ))}
      </div>

      {/* Base de connaissances */}
      <div data-guide="staff-knowledge-section" className="card">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Book className="w-5 h-5" />
          Base de connaissances
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button data-guide="staff-kb-manual" className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 text-left">
            <p className="font-medium text-sm">Manuel des procédures</p>
            <p className="text-xs text-slate-500">156 documents</p>
          </button>
          <button data-guide="staff-kb-faq" className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 text-left">
            <p className="font-medium text-sm">FAQ RH</p>
            <p className="text-xs text-slate-500">89 documents</p>
          </button>
          <button data-guide="staff-kb-tech" className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 text-left">
            <p className="font-medium text-sm">Documentation technique</p>
            <p className="text-xs text-slate-500">234 documents</p>
          </button>
          <button data-guide="staff-kb-regulations" className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 text-left">
            <p className="font-medium text-sm">Réglementations</p>
            <p className="text-xs text-slate-500">67 documents</p>
          </button>
        </div>
      </div>
    </div>
  )
}
