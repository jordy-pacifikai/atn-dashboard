'use client'

import { useState } from 'react'
import { ListTodo, Mail, FileText, Eye, Edit3, Trash2, Send, Clock, CheckCircle, AlertCircle, Sparkles, Calendar, Filter } from 'lucide-react'

interface PlannedContent {
  id: string
  type: 'newsletter' | 'article'
  title: string
  excerpt: string
  status: 'idea' | 'draft' | 'review' | 'approved' | 'scheduled' | 'published'
  scheduledDate: string
  category: string
  aiGenerated: boolean
  lastEdited: string
  metrics?: {
    seoScore?: number
    readability?: number
    engagement?: number
  }
}

// Generate 30 days of planned content
const generatePlannedContent = (): PlannedContent[] => {
  const content: PlannedContent[] = []
  const now = new Date()

  const newsletterTopics = [
    { title: 'Offres Black Friday Polynésie', excerpt: 'Découvrez nos meilleures offres pour voyager en Polynésie...' },
    { title: 'Nouvelle ligne Tokyo-Papeete', excerpt: 'Air Tahiti Nui lance sa nouvelle liaison directe...' },
    { title: 'Guide du voyageur fidèle', excerpt: 'Maximisez vos points Club Tiare avec ces astuces...' },
    { title: 'Escapade romantique Moorea', excerpt: 'Offre spéciale couples: vol + hôtel à partir de...' },
    { title: 'Les Marquises vous attendent', excerpt: 'Partez à la découverte des îles les plus mystérieuses...' },
    { title: 'Business Class: le luxe accessible', excerpt: 'Upgrade votre expérience avec notre classe Poerava...' },
  ]

  const articleTopics = [
    { title: 'Les 15 plus belles plages de Tahiti', excerpt: 'Notre sélection des plages incontournables pour...', category: 'Destinations' },
    { title: 'Guide complet plongée Rangiroa', excerpt: 'Tout ce qu\'il faut savoir pour plonger dans le...', category: 'Activités' },
    { title: 'Quand partir en Polynésie ?', excerpt: 'Analyse mois par mois pour choisir la meilleure période...', category: 'Guides' },
    { title: 'Test Poerava Business Class', excerpt: 'Notre verdict après avoir testé la classe affaires ATN...', category: 'Services' },
    { title: 'Polynésie en famille: guide complet', excerpt: 'Conseils pratiques pour voyager avec enfants en...', category: 'Guides' },
    { title: 'Gastronomie polynésienne', excerpt: 'Découvrez les saveurs authentiques du fenua à travers...', category: 'Culture' },
  ]

  const statuses: PlannedContent['status'][] = ['idea', 'draft', 'review', 'approved', 'scheduled']

  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + i)

    // Newsletter every 3-4 days
    if (i % 3 === 0) {
      const topic = newsletterTopics[i % newsletterTopics.length]
      const statusIndex = Math.min(Math.floor((30 - i) / 7), statuses.length - 1)
      content.push({
        id: `newsletter-${i}`,
        type: 'newsletter',
        title: topic.title,
        excerpt: topic.excerpt,
        status: i < 7 ? 'scheduled' : statuses[statusIndex],
        scheduledDate: date.toISOString().split('T')[0],
        category: 'Marketing',
        aiGenerated: Math.random() > 0.3,
        lastEdited: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        metrics: {
          engagement: Math.floor(Math.random() * 30) + 70,
        },
      })
    }

    // Article every 2 days
    if (i % 2 === 0) {
      const topic = articleTopics[i % articleTopics.length]
      const statusIndex = Math.min(Math.floor((30 - i) / 6), statuses.length - 1)
      content.push({
        id: `article-${i}`,
        type: 'article',
        title: topic.title,
        excerpt: topic.excerpt,
        status: i < 5 ? 'scheduled' : statuses[statusIndex],
        scheduledDate: date.toISOString().split('T')[0],
        category: topic.category,
        aiGenerated: Math.random() > 0.2,
        lastEdited: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        metrics: {
          seoScore: Math.floor(Math.random() * 20) + 80,
          readability: Math.floor(Math.random() * 15) + 85,
        },
      })
    }
  }

  return content.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  idea: { label: 'Idée', color: 'bg-slate-100 text-slate-600', icon: Sparkles },
  draft: { label: 'Brouillon', color: 'bg-amber-100 text-amber-700', icon: Edit3 },
  review: { label: 'En revue', color: 'bg-blue-100 text-blue-700', icon: Eye },
  approved: { label: 'Approuvé', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  scheduled: { label: 'Programmé', color: 'bg-purple-100 text-purple-700', icon: Clock },
  published: { label: 'Publié', color: 'bg-green-100 text-green-700', icon: Send },
}

function ContentRow({
  item,
  onEdit,
  onPreview,
  onDelete,
  onStatusChange,
}: {
  item: PlannedContent
  onEdit: () => void
  onPreview: () => void
  onDelete: () => void
  onStatusChange: (status: PlannedContent['status']) => void
}) {
  const StatusIcon = statusConfig[item.status].icon
  const daysUntil = Math.ceil((new Date(item.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="group flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
      {/* Type icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        item.type === 'newsletter' ? 'bg-pink-100' : 'bg-purple-100'
      }`}>
        {item.type === 'newsletter' ? (
          <Mail className="w-5 h-5 text-pink-600" />
        ) : (
          <FileText className="w-5 h-5 text-purple-600" />
        )}
      </div>

      {/* Content info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium truncate">{item.title}</h3>
          {item.aiGenerated && (
            <span className="px-1.5 py-0.5 bg-atn-secondary/10 text-atn-secondary rounded text-xs">
              IA
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 truncate">{item.excerpt}</p>
      </div>

      {/* Category */}
      <div className="hidden md:block">
        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
          {item.category}
        </span>
      </div>

      {/* Metrics */}
      <div className="hidden lg:flex items-center gap-3 text-xs">
        {item.metrics?.seoScore && (
          <span className="text-emerald-600">SEO: {item.metrics.seoScore}%</span>
        )}
        {item.metrics?.engagement && (
          <span className="text-blue-600">Eng: {item.metrics.engagement}%</span>
        )}
      </div>

      {/* Date */}
      <div className="text-right min-w-[100px]">
        <p className="text-sm font-medium">
          {new Date(item.scheduledDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </p>
        <p className={`text-xs ${daysUntil <= 3 ? 'text-red-500' : 'text-slate-500'}`}>
          {daysUntil === 0 ? 'Aujourd\'hui' : daysUntil < 0 ? 'Passé' : `J-${daysUntil}`}
        </p>
      </div>

      {/* Status dropdown */}
      <select
        value={item.status}
        onChange={(e) => onStatusChange(e.target.value as PlannedContent['status'])}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${statusConfig[item.status].color}`}
      >
        {Object.entries(statusConfig).map(([value, config]) => (
          <option key={value} value={value}>{config.label}</option>
        ))}
      </select>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onPreview}
          className="p-2 hover:bg-slate-100 rounded-lg"
          title="Prévisualiser"
        >
          <Eye className="w-4 h-4 text-slate-500" />
        </button>
        <button
          onClick={onEdit}
          className="p-2 hover:bg-slate-100 rounded-lg"
          title="Modifier"
        >
          <Edit3 className="w-4 h-4 text-slate-500" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-50 rounded-lg"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  )
}

export default function PlannerPage() {
  const [content, setContent] = useState<PlannedContent[]>(generatePlannedContent())
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [selectedContent, setSelectedContent] = useState<PlannedContent | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const filteredContent = content.filter(c => {
    if (filterType && c.type !== filterType) return false
    if (filterStatus && c.status !== filterStatus) return false
    return true
  })

  const handleStatusChange = (id: string, status: PlannedContent['status']) => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  const handleDelete = (id: string) => {
    setContent(prev => prev.filter(c => c.id !== id))
  }

  // Stats
  const thisWeek = content.filter(c => {
    const days = Math.ceil((new Date(c.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 7
  })
  const pendingReview = content.filter(c => c.status === 'review').length
  const scheduled = content.filter(c => c.status === 'scheduled').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <ListTodo className="w-7 h-7 text-indigo-500" />
            Content Planner
          </h1>
          <p className="text-slate-500">Planification éditoriale sur 30 jours</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = '/calendar'}
            className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50"
          >
            <Calendar className="w-4 h-4" />
            Vue calendrier
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Cette semaine</p>
          <p className="text-2xl font-bold">{thisWeek.length}</p>
          <p className="text-xs text-slate-400">{thisWeek.filter(c => c.type === 'newsletter').length} newsletters, {thisWeek.filter(c => c.type === 'article').length} articles</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">En attente de revue</p>
          <p className="text-2xl font-bold text-amber-600">{pendingReview}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Programmés</p>
          <p className="text-2xl font-bold text-purple-600">{scheduled}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Générés par IA</p>
          <p className="text-2xl font-bold text-atn-secondary">{content.filter(c => c.aiGenerated).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600">Filtres:</span>
        </div>

        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${!filterType ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
            onClick={() => setFilterType(null)}
          >
            Tous
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${filterType === 'newsletter' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`}
            onClick={() => setFilterType(filterType === 'newsletter' ? null : 'newsletter')}
          >
            <Mail className="w-3.5 h-3.5" />
            Newsletters
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${filterType === 'article' ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}
            onClick={() => setFilterType(filterType === 'article' ? null : 'article')}
          >
            <FileText className="w-3.5 h-3.5" />
            Articles
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        <select
          value={filterStatus || ''}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          className="px-3 py-1.5 rounded-lg text-sm border border-slate-200"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(statusConfig).map(([value, config]) => (
            <option key={value} value={value}>{config.label}</option>
          ))}
        </select>

        <div className="ml-auto text-sm text-slate-500">
          {filteredContent.length} contenus
        </div>
      </div>

      {/* Content list */}
      <div className="space-y-2">
        {filteredContent.map(item => (
          <ContentRow
            key={item.id}
            item={item}
            onEdit={() => {
              setSelectedContent(item)
              setShowEditor(true)
            }}
            onPreview={() => {
              setSelectedContent(item)
              setShowPreview(true)
            }}
            onDelete={() => handleDelete(item.id)}
            onStatusChange={(status) => handleStatusChange(item.id, status)}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedContent.type === 'newsletter' ? (
                  <Mail className="w-5 h-5 text-pink-500" />
                ) : (
                  <FileText className="w-5 h-5 text-purple-500" />
                )}
                <span className="font-medium">{selectedContent.type === 'newsletter' ? 'Newsletter' : 'Article'}</span>
              </div>
              <button
                onClick={() => {
                  setShowPreview(false)
                  setSelectedContent(null)
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{selectedContent.title}</h1>
              <p className="text-slate-600 mb-6">{selectedContent.excerpt}</p>
              <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-500">
                <p>Prévisualisation complète disponible après connexion aux APIs.</p>
                <p className="mt-2">Le contenu sera généré par le workflow n8n correspondant.</p>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPreview(false)
                  setShowEditor(true)
                }}
                className="px-4 py-2 border border-slate-200 rounded-lg"
              >
                Modifier
              </button>
              <button className="btn-primary">
                Approuver & Programmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Modifier: {selectedContent.title}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  defaultValue={selectedContent.title}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date de publication</label>
                <input
                  type="date"
                  defaultValue={selectedContent.scheduledDate}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-atn-secondary" />
                  Prompt IA - Modifier avec l'intelligence artificielle
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg h-24"
                  placeholder="Ex: Rends le titre plus accrocheur, ajoute des chiffres, change la date au 15 février..."
                ></textarea>
                <button className="mt-2 px-4 py-2 bg-atn-secondary text-white rounded-lg text-sm">
                  Appliquer les modifications IA
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowEditor(false)
                  setSelectedContent(null)
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button className="btn-primary">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
