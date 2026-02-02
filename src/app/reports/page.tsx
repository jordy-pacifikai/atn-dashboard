'use client'

import { useState } from 'react'
import { FileBarChart, Download, Calendar, Clock, Loader2, CheckCircle, Mail, FileText, TrendingUp, Users, Plane, Star, ShoppingCart } from 'lucide-react'

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: any
  category: 'performance' | 'content' | 'revenue' | 'operations'
  frequency: string
  lastGenerated?: string
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'daily-summary',
    name: 'Résumé quotidien',
    description: 'Vue d\'ensemble de toutes les activités des 10 workflows sur les dernières 24h',
    icon: FileBarChart,
    category: 'performance',
    frequency: 'Quotidien',
    lastGenerated: '2026-01-28T08:00:00',
  },
  {
    id: 'weekly-marketing',
    name: 'Performance Marketing',
    description: 'Newsletters envoyées, taux d\'ouverture, clics, conversions, articles publiés',
    icon: Mail,
    category: 'content',
    frequency: 'Hebdomadaire',
    lastGenerated: '2026-01-27T09:00:00',
  },
  {
    id: 'roi-analysis',
    name: 'Analyse ROI par route',
    description: 'Performance commerciale par destination, évolution vs période précédente',
    icon: TrendingUp,
    category: 'revenue',
    frequency: 'Hebdomadaire',
    lastGenerated: '2026-01-27T09:00:00',
  },
  {
    id: 'customer-satisfaction',
    name: 'Satisfaction client',
    description: 'Analyse des avis, score NPS, temps de réponse concierge, résolution',
    icon: Star,
    category: 'operations',
    frequency: 'Hebdomadaire',
  },
  {
    id: 'upsell-performance',
    name: 'Performance Upsell',
    description: 'Offres envoyées, taux de conversion, revenu additionnel généré',
    icon: ShoppingCart,
    category: 'revenue',
    frequency: 'Hebdomadaire',
    lastGenerated: '2026-01-27T09:00:00',
  },
  {
    id: 'competitor-intel',
    name: 'Veille concurrentielle',
    description: 'Mouvements tarifaires, nouvelles routes, alertes marché',
    icon: Users,
    category: 'operations',
    frequency: 'Bi-hebdomadaire',
  },
  {
    id: 'flight-ops',
    name: 'Opérations vols',
    description: 'Retards, annulations, notifications envoyées, satisfaction post-perturbation',
    icon: Plane,
    category: 'operations',
    frequency: 'Quotidien',
    lastGenerated: '2026-01-28T06:00:00',
  },
  {
    id: 'content-seo',
    name: 'Performance SEO',
    description: 'Articles publiés, scores SEO/GEO, trafic généré, positions keywords',
    icon: FileText,
    category: 'content',
    frequency: 'Mensuel',
  },
]

const categoryConfig = {
  performance: { label: 'Performance', color: 'bg-blue-100 text-blue-700' },
  content: { label: 'Contenu', color: 'bg-purple-100 text-purple-700' },
  revenue: { label: 'Revenue', color: 'bg-emerald-100 text-emerald-700' },
  operations: { label: 'Opérations', color: 'bg-amber-100 text-amber-700' },
}

function ReportCard({
  report,
  onGenerate,
  isGenerating,
}: {
  report: ReportTemplate
  onGenerate: () => void
  isGenerating: boolean
}) {
  const Icon = report.icon
  const category = categoryConfig[report.category]

  return (
    <div className="card">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          report.category === 'performance' ? 'bg-blue-100' :
          report.category === 'content' ? 'bg-purple-100' :
          report.category === 'revenue' ? 'bg-emerald-100' :
          'bg-amber-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            report.category === 'performance' ? 'text-blue-600' :
            report.category === 'content' ? 'text-purple-600' :
            report.category === 'revenue' ? 'text-emerald-600' :
            'text-amber-600'
          }`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{report.name}</h3>
            <span className={`px-2 py-0.5 rounded text-xs ${category.color}`}>
              {category.label}
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-3">{report.description}</p>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{report.frequency}</span>
            </div>
            {report.lastGenerated && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Dernier: {new Date(report.lastGenerated).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-4 py-2 bg-atn-primary text-white rounded-lg hover:bg-atn-primary/90 disabled:opacity-50 flex items-center gap-2 text-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Générer
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [isCustomGenerating, setIsCustomGenerating] = useState(false)

  const filteredReports = filterCategory
    ? reportTemplates.filter(r => r.category === filterCategory)
    : reportTemplates

  const handleGenerate = async (reportId: string) => {
    setGeneratingId(reportId)
    // Simulate generation
    await new Promise(r => setTimeout(r, 3000))
    setGeneratingId(null)
    // In real implementation, this would trigger a workflow and download the result
    alert('Rapport généré ! (En production: téléchargement automatique)')
  }

  const handleCustomReport = async () => {
    if (!customPrompt.trim()) return
    setIsCustomGenerating(true)
    await new Promise(r => setTimeout(r, 3000))
    setIsCustomGenerating(false)
    alert('Rapport personnalisé généré !')
    setCustomPrompt('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FileBarChart className="w-7 h-7 text-blue-500" />
            Rapports
          </h1>
          <p className="text-slate-500">Génération de rapports sur demande</p>
        </div>
      </div>

      {/* Custom report request */}
      <div className="card bg-gradient-to-r from-atn-primary/5 to-atn-secondary/5 border-atn-secondary/20">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-atn-secondary">✨</span>
          Rapport personnalisé avec l'IA
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Décris le rapport que tu veux et l'IA le générera à partir des données de tous les workflows.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ex: Donne-moi un rapport sur les performances des newsletters des 2 dernières semaines avec recommandations..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary"
          />
          <button
            onClick={handleCustomReport}
            disabled={!customPrompt.trim() || isCustomGenerating}
            className="px-6 py-2.5 bg-atn-secondary text-white rounded-lg hover:bg-atn-secondary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {isCustomGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <FileBarChart className="w-4 h-4" />
                Générer
              </>
            )}
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-xs text-slate-500">Suggestions:</span>
          {[
            'Performance globale ce mois',
            'Comparaison vs mois dernier',
            'Top 5 opportunités',
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setCustomPrompt(suggestion)}
              className="text-xs px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm ${!filterCategory ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
          onClick={() => setFilterCategory(null)}
        >
          Tous
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            className={`px-4 py-2 rounded-lg text-sm ${filterCategory === key ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
            onClick={() => setFilterCategory(filterCategory === key ? null : key)}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Report templates */}
      <div className="space-y-4">
        {filteredReports.map(report => (
          <ReportCard
            key={report.id}
            report={report}
            onGenerate={() => handleGenerate(report.id)}
            isGenerating={generatingId === report.id}
          />
        ))}
      </div>

      {/* Recent reports */}
      <div className="card">
        <h2 className="font-semibold mb-4">Rapports récents</h2>
        <div className="space-y-3">
          {[
            { name: 'Résumé quotidien - 28 Jan 2026', size: '245 KB', time: 'Il y a 2h' },
            { name: 'Performance Marketing - Semaine 4', size: '1.2 MB', time: 'Hier' },
            { name: 'Analyse ROI - Janvier 2026', size: '890 KB', time: 'Il y a 2 jours' },
            { name: 'Opérations vols - 27 Jan 2026', size: '156 KB', time: 'Il y a 2 jours' },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileBarChart className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium">{report.name}</p>
                  <p className="text-xs text-slate-500">{report.size} • {report.time}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-white rounded-lg">
                <Download className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled reports */}
      <div className="card">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-400" />
          Rapports programmés
        </h2>
        <div className="space-y-3">
          {[
            { name: 'Résumé quotidien', schedule: 'Tous les jours à 08:00', nextRun: 'Demain 08:00' },
            { name: 'Performance Marketing', schedule: 'Lundi à 09:00', nextRun: 'Lun 3 Fév' },
            { name: 'Analyse ROI', schedule: 'Vendredi à 17:00', nextRun: 'Ven 31 Jan' },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div>
                <p className="text-sm font-medium">{report.name}</p>
                <p className="text-xs text-slate-500">{report.schedule}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Prochain envoi</p>
                <p className="text-sm font-medium text-atn-secondary">{report.nextRun}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:bg-slate-50">
          + Programmer un nouveau rapport
        </button>
      </div>
    </div>
  )
}
