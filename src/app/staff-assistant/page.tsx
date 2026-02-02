'use client'

import { useState } from 'react'
import { UserCog, MessageSquare, Send, FileText, HelpCircle, Clock, CheckCircle, Search, Book, Settings } from 'lucide-react'

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

const demoQueries: StaffQuery[] = [
  {
    id: '1',
    employee: { name: 'Vaiana Teriitahi', department: 'Service Client', role: 'Agent' },
    query: 'Quelle est la procédure pour un passager qui a perdu son passeport avant l\'embarquement ?',
    response: 'En cas de perte de passeport avant embarquement :\n\n1. Diriger le passager vers le bureau de police de l\'aéroport\n2. Contacter le superviseur de vol\n3. Le passager peut voyager avec une déclaration de perte + pièce d\'identité complémentaire sur les vols domestiques uniquement\n4. Pour les vols internationaux, un passeport temporaire est requis\n\nDélai moyen : 2-4 heures pour un passeport d\'urgence',
    category: 'procedures',
    timestamp: '2026-01-29T10:30:00',
    helpful: true,
  },
  {
    id: '2',
    employee: { name: 'Teiki Moana', department: 'Opérations', role: 'Coordinateur' },
    query: 'Comment modifier les affectations d\'équipage dans le système Amadeus ?',
    response: 'Pour modifier les affectations d\'équipage dans Amadeus Altéa :\n\n1. Accéder au module Crew Management (CM)\n2. Sélectionner le vol concerné via le code vol\n3. Cliquer sur "Crew Assignment"\n4. Modifier l\'affectation via le bouton "Edit"\n5. Valider les qualifications requises\n6. Confirmer et notifier l\'équipage\n\nNote: Modifications < 24h nécessitent validation superviseur.',
    category: 'technical',
    timestamp: '2026-01-29T09:15:00',
    helpful: true,
  },
  {
    id: '3',
    employee: { name: 'Marie Hiro', department: 'RH', role: 'Assistante' },
    query: 'Quels sont les documents requis pour une demande de congé maternité ?',
    response: 'Documents requis pour le congé maternité ATN :\n\n1. Certificat médical de grossesse (date prévue accouchement)\n2. Formulaire interne CM-MAT-01\n3. Copie de la carte vitale\n4. RIB pour les indemnités\n\nDélai de dépôt : minimum 2 mois avant date prévue\nDurée légale : 16 semaines (6 avant + 10 après)\n\nContact RH : rh@airtahitinui.pf',
    category: 'hr',
    timestamp: '2026-01-29T08:45:00',
    helpful: null,
  },
  {
    id: '4',
    employee: { name: 'Raihau Tetuanui', department: 'Piste', role: 'Agent de piste' },
    query: 'Procédure de dégivrage sur le 787 Dreamliner',
    response: 'Procédure de dégivrage Boeing 787 Dreamliner :\n\n1. Vérifier les conditions météo (temp < 3°C avec précipitations)\n2. Commander fluide Type I ou Type IV selon conditions\n3. Zones prioritaires : bords d\'attaque, stabilisateurs, gouvernes\n4. Temps holdover selon fluide et météo (voir tableau HOLDOVER)\n5. Inspection visuelle post-dégivrage obligatoire\n6. Report au commandant de bord\n\nAttention: Le 787 a des surfaces composites - pression réduite requise.',
    category: 'operations',
    timestamp: '2026-01-28T22:00:00',
    helpful: true,
  },
]

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

  const filteredQueries = demoQueries.filter(q => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false
    if (searchQuery && !q.query.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const stats = {
    total: demoQueries.length,
    helpful: demoQueries.filter(q => q.helpful === true).length,
    procedures: demoQueries.filter(q => q.category === 'procedures').length,
    avgResponseTime: '< 5s',
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

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Questions traitées</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Réponses utiles</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.helpful}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Procédures consultées</p>
          <p className="text-2xl font-bold text-blue-600">{stats.procedures}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Temps de réponse</p>
          <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
        </div>
      </div>

      {/* Nouvelle question */}
      <div className="card bg-gradient-to-r from-cyan-50 to-blue-50">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-600" />
          Poser une question à TALIA
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Exemple: Quelle est la procédure pour..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 bg-white"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-cyan-600">
            <Send className="w-5 h-5" />
            Demander
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1.5 bg-white rounded-full text-xs text-slate-600 hover:bg-slate-50">
            📋 Procédures embarquement
          </button>
          <button className="px-3 py-1.5 bg-white rounded-full text-xs text-slate-600 hover:bg-slate-50">
            ✈️ Opérations vol
          </button>
          <button className="px-3 py-1.5 bg-white rounded-full text-xs text-slate-600 hover:bg-slate-50">
            👥 Questions RH
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                selectedCategory === cat.id ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>
        <div className="relative">
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
      <div className="space-y-4">
        {filteredQueries.map(query => (
          <QueryCard key={query.id} query={query} />
        ))}
      </div>

      {/* Base de connaissances */}
      <div className="card">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Book className="w-5 h-5" />
          Base de connaissances
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Manuel des procédures', count: 156 },
            { label: 'FAQ RH', count: 89 },
            { label: 'Documentation technique', count: 234 },
            { label: 'Réglementations', count: 67 },
          ].map((item) => (
            <button key={item.label} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 text-left">
              <p className="font-medium text-sm">{item.label}</p>
              <p className="text-xs text-slate-500">{item.count} documents</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
