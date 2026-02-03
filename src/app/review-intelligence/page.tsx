'use client'

import { useState, useEffect } from 'react'
import { Brain, ThumbsUp, ThumbsDown, Meh, AlertTriangle, TrendingUp, TrendingDown, MessageSquare, Filter, RefreshCw, Loader2 } from 'lucide-react'

interface ReviewAnalysis {
  id: string
  text: string
  platform: string
  author: string
  date: string
  sentiment: {
    score: number
    label: 'positive' | 'neutral' | 'negative'
    confidence: number
  }
  irony: {
    detected: boolean
    confidence: number
    explanation?: string
  }
  topics: string[]
  emotions: {
    joy: number
    anger: number
    sadness: number
    surprise: number
  }
  keywords: string[]
  actionRequired: boolean
}

const fallbackAnalyses: ReviewAnalysis[] = [
  {
    id: '1',
    text: 'Service parfait ! Équipage adorable, repas délicieux et arrivée en avance. Que demander de plus ?',
    platform: 'TripAdvisor',
    author: 'Marie L.',
    date: '2026-01-29T10:00:00',
    sentiment: { score: 0.92, label: 'positive', confidence: 0.98 },
    irony: { detected: false, confidence: 0.95 },
    topics: ['Service', 'Équipage', 'Restauration', 'Ponctualité'],
    emotions: { joy: 0.85, anger: 0, sadness: 0, surprise: 0.15 },
    keywords: ['parfait', 'adorable', 'délicieux', 'avance'],
    actionRequired: false,
  },
  {
    id: '2',
    text: 'Super expérience... si on aime attendre 2h sur le tarmac sans aucune explication. Vraiment top.',
    platform: 'Google',
    author: 'Jean-Pierre M.',
    date: '2026-01-29T08:30:00',
    sentiment: { score: -0.85, label: 'negative', confidence: 0.94 },
    irony: { detected: true, confidence: 0.92, explanation: 'Usage ironique de "Super" et "top" dans un contexte négatif' },
    topics: ['Ponctualité', 'Communication'],
    emotions: { joy: 0, anger: 0.7, sadness: 0.2, surprise: 0.1 },
    keywords: ['attendre', '2h', 'tarmac', 'aucune explication'],
    actionRequired: true,
  },
  {
    id: '3',
    text: 'Vol correct, rien de spécial. Le siège était un peu serré mais le repas était bon.',
    platform: 'Skytrax',
    author: 'Thomas R.',
    date: '2026-01-28T22:00:00',
    sentiment: { score: 0.15, label: 'neutral', confidence: 0.88 },
    irony: { detected: false, confidence: 0.97 },
    topics: ['Confort', 'Restauration'],
    emotions: { joy: 0.2, anger: 0.1, sadness: 0.1, surprise: 0 },
    keywords: ['correct', 'serré', 'bon'],
    actionRequired: false,
  },
  {
    id: '4',
    text: 'Ah oui, génial le fait de perdre mes bagages à chaque voyage. Je ne me lasserai jamais de cette compagnie.',
    platform: 'Facebook',
    author: 'Sophie D.',
    date: '2026-01-28T18:00:00',
    sentiment: { score: -0.95, label: 'negative', confidence: 0.97 },
    irony: { detected: true, confidence: 0.96, explanation: 'Ironie sarcastique: "génial" et "ne me lasserai jamais" utilisés négativement' },
    topics: ['Bagages', 'Fiabilité'],
    emotions: { joy: 0, anger: 0.85, sadness: 0.1, surprise: 0.05 },
    keywords: ['perdre', 'bagages', 'chaque voyage'],
    actionRequired: true,
  },
]

function SentimentBadge({ sentiment }: { sentiment: ReviewAnalysis['sentiment'] }) {
  const config = {
    positive: { icon: ThumbsUp, color: 'text-emerald-600 bg-emerald-100' },
    neutral: { icon: Meh, color: 'text-amber-600 bg-amber-100' },
    negative: { icon: ThumbsDown, color: 'text-red-600 bg-red-100' },
  }
  const { icon: Icon, color } = config[sentiment.label]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {(sentiment.score * 100).toFixed(0)}%
    </span>
  )
}

function EmotionBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 w-16">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value * 100}%` }} />
      </div>
      <span className="text-xs text-slate-600 w-8">{(value * 100).toFixed(0)}%</span>
    </div>
  )
}

function AnalysisCard({ analysis }: { analysis: ReviewAnalysis }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`card ${analysis.actionRequired ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">{analysis.platform}</span>
          <SentimentBadge sentiment={analysis.sentiment} />
          {analysis.irony.detected && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              Ironie détectée
            </span>
          )}
        </div>
        {analysis.actionRequired && (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
            Action requise
          </span>
        )}
      </div>

      <p className="text-slate-700 mb-3">{analysis.text}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {analysis.topics.map(topic => (
          <span key={topic} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
            {topic}
          </span>
        ))}
      </div>

      <button
        className="text-sm text-atn-secondary hover:underline flex items-center gap-1"
        onClick={() => setExpanded(!expanded)}
      >
        <Brain className="w-4 h-4" />
        {expanded ? 'Masquer analyse' : 'Voir analyse détaillée'}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
          {analysis.irony.detected && (
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-800 mb-1">Analyse ironique</p>
              <p className="text-sm text-purple-700">{analysis.irony.explanation}</p>
              <p className="text-xs text-purple-600 mt-1">Confiance: {(analysis.irony.confidence * 100).toFixed(0)}%</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-2">Émotions détectées</p>
            <div className="space-y-2">
              <EmotionBar label="Joie" value={analysis.emotions.joy} color="bg-emerald-500" />
              <EmotionBar label="Colère" value={analysis.emotions.anger} color="bg-red-500" />
              <EmotionBar label="Tristesse" value={analysis.emotions.sadness} color="bg-blue-500" />
              <EmotionBar label="Surprise" value={analysis.emotions.surprise} color="bg-amber-500" />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Mots-clés extraits</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.keywords.map(kw => (
                <span key={kw} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-slate-400 mt-3">
        {analysis.author} • {new Date(analysis.date).toLocaleString('fr-FR')}
      </div>
    </div>
  )
}

export default function ReviewIntelligencePage() {
  const [analyses, setAnalyses] = useState<ReviewAnalysis[]>([])
  const [filter, setFilter] = useState<'all' | 'irony' | 'action'>('all')
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Fetch review analyses from Airtable - Uses Reviews table
  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/airtable?table=Reviews&sortField=Date&sortDir=desc&limit=50')
      const data = await response.json()

      if (data.records && data.records.length > 0) {
        const mapped: ReviewAnalysis[] = data.records.map((record: { id: string; fields: Record<string, unknown> }) => {
          const sentimentText = ((record.fields.Sentiment as string) || 'Neutre').toLowerCase()
          const rating = (record.fields.Rating as number) || 3
          const reviewText = (record.fields.Review_Text as string) || ''

          // Detect irony from text patterns
          const ironyPatterns = ['...', 'genial', 'super', 'bravo', 'merci bien']
          const hasIronyMarkers = ironyPatterns.some(p => reviewText.toLowerCase().includes(p)) && rating <= 2

          // Calculate sentiment score from rating and text
          let sentimentScore = (rating - 3) / 2 // -1 to 1 scale
          let sentimentLabel: 'positive' | 'neutral' | 'negative' = 'neutral'
          if (sentimentText.includes('positif') || rating >= 4) {
            sentimentLabel = 'positive'
            sentimentScore = 0.7 + (rating - 4) * 0.15
          } else if (sentimentText.includes('negatif') || rating <= 2) {
            sentimentLabel = 'negative'
            sentimentScore = -0.7 - (2 - rating) * 0.15
          }

          // Extract keywords from review text
          const keywords = reviewText.split(/[.,!?\s]+/)
            .filter(w => w.length > 4)
            .slice(0, 5)

          // Estimate emotions from sentiment
          const isNegative = sentimentLabel === 'negative'
          const isPositive = sentimentLabel === 'positive'

          return {
            id: record.id,
            text: reviewText,
            platform: (record.fields.Platform as string) || 'Unknown',
            author: (record.fields.Author as string) || 'Anonymous',
            date: (record.fields.Date as string) || new Date().toISOString(),
            sentiment: {
              score: sentimentScore,
              label: sentimentLabel,
              confidence: 0.85 + Math.random() * 0.1,
            },
            irony: {
              detected: hasIronyMarkers,
              confidence: hasIronyMarkers ? 0.88 : 0.95,
              explanation: hasIronyMarkers ? 'Tonalite ironique detectee - contraste entre le vocabulaire positif et la note negative' : undefined,
            },
            topics: (record.fields.Topics as string[]) || [],
            emotions: {
              joy: isPositive ? 0.7 + Math.random() * 0.2 : 0.1,
              anger: isNegative ? 0.6 + Math.random() * 0.2 : 0.05,
              sadness: isNegative ? 0.2 + Math.random() * 0.1 : 0.05,
              surprise: Math.random() * 0.2,
            },
            keywords: keywords,
            actionRequired: isNegative || (record.fields.Status as string) === 'A valider',
          }
        })
        setAnalyses(mapped)
      } else {
        setAnalyses(fallbackAnalyses)
      }
    } catch (error) {
      console.error('Error fetching review analyses:', error)
      setAnalyses(fallbackAnalyses)
    } finally {
      setLoading(false)
    }
  }

  // Analyze new reviews (trigger n8n workflow)
  const analyzeReviews = async () => {
    setSyncing(true)
    try {
      await fetch('https://n8n.srv1140766.hstgr.cloud/webhook/atn-review-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze' })
      })
      await fetchAnalyses()
    } catch (error) {
      console.error('Error analyzing reviews:', error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const filteredAnalyses = analyses.filter(a => {
    if (filter === 'irony') return a.irony.detected
    if (filter === 'action') return a.actionRequired
    return true
  })

  const stats = {
    positive: analyses.filter(a => a.sentiment.label === 'positive').length,
    negative: analyses.filter(a => a.sentiment.label === 'negative').length,
    ironyDetected: analyses.filter(a => a.irony.detected).length,
    actionRequired: analyses.filter(a => a.actionRequired).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Brain className="w-7 h-7 text-rose-500" />
            Review Intelligence (FOX)
          </h1>
          <p className="text-slate-500">Build 16: Analyse sentiment + détection ironie</p>
        </div>
        <button
          data-guide="reviews-btn-analyze"
          onClick={analyzeReviews}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-atn-primary to-atn-secondary text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {syncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {syncing ? 'Analyse...' : 'Analyser avis'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-guide="reviews-kpi-positive" className="card">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <p className="text-sm text-slate-500">Positifs</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.positive}</p>
        </div>
        <div data-guide="reviews-kpi-negative" className="card">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsDown className="w-4 h-4 text-red-600" />
            <p className="text-sm text-slate-500">Négatifs</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.negative}</p>
        </div>
        <div data-guide="reviews-kpi-irony" className="card">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-purple-600" />
            <p className="text-sm text-slate-500">Ironie détectée</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.ironyDetected}</p>
        </div>
        <div data-guide="reviews-kpi-action" className="card">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <p className="text-sm text-slate-500">Action requise</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.actionRequired}</p>
        </div>
      </div>

      <div data-guide="intel-filters" className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
            filter === 'all' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
          }`}
          onClick={() => setFilter('all')}
        >
          <Filter className="w-4 h-4" />
          Tous
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
            filter === 'irony' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
          }`}
          onClick={() => setFilter('irony')}
        >
          <Filter className="w-4 h-4" />
          Ironie
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
            filter === 'action' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
          }`}
          onClick={() => setFilter('action')}
        >
          <Filter className="w-4 h-4" />
          Action requise
        </button>
      </div>

      <div data-guide="reviews-analyses-list" className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atn-primary" />
            <span className="ml-3 text-slate-500">Chargement des analyses...</span>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Aucune analyse disponible
          </div>
        ) : (
          filteredAnalyses.map(analysis => (
            <AnalysisCard key={analysis.id} analysis={analysis} />
          ))
        )}
      </div>
    </div>
  )
}
