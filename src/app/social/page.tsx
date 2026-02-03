'use client'

import { useState, useEffect } from 'react'
import { Users, Twitter, Instagram, Facebook, Linkedin, TrendingUp, MessageCircle, Send, RefreshCw, Loader2 } from 'lucide-react'

interface SocialMention {
  id: string
  platform: 'Twitter/X' | 'Instagram' | 'Facebook' | 'LinkedIn' | 'TikTok'
  author: string
  content: string
  sentiment: 'positive' | 'neutral' | 'negative'
  sentimentScore: number
  reach: number
  priority: 'high' | 'medium' | 'low'
  responseSuggested: string
  status: 'pending' | 'responded' | 'ignored'
  date: string
}

const fallbackMentions: SocialMention[] = [
  {
    id: '1',
    platform: 'Twitter/X',
    author: '@TahitiTraveler',
    content: 'Just booked my dream trip to Bora Bora with @AirTahitiNui! The Poerava Business Class looks amazing 🌺✈️ #Tahiti #DreamTrip',
    sentiment: 'positive',
    sentimentScore: 92,
    reach: 15400,
    priority: 'medium',
    responseSuggested: 'Mauruuru (merci) pour votre choix ! 🌺 Nous avons hâte de vous accueillir à bord et de vous faire vivre l\'expérience polynésienne dès votre embarquement. Bon voyage ! ✈️',
    status: 'pending',
    date: '2026-01-28T10:30:00',
  },
  {
    id: '2',
    platform: 'Instagram',
    author: '@luxurytravel_blog',
    content: 'Exceptional service on our @airtahitinui flight! The crew was so welcoming and the food was incredible. 10/10 would recommend for any Pacific destination 🏝️',
    sentiment: 'positive',
    sentimentScore: 95,
    reach: 45000,
    priority: 'high',
    responseSuggested: 'Thank you for sharing your beautiful experience with us! 🌺 We\'re so happy you enjoyed your journey. We hope to welcome you again soon for another adventure in paradise! 🏝️✨',
    status: 'responded',
    date: '2026-01-28T09:15:00',
  },
  {
    id: '3',
    platform: 'Facebook',
    author: 'Marie Dupont',
    content: 'Vol retardé de 2h sans information claire... Très déçue par Air Tahiti Nui ce soir 😤',
    sentiment: 'negative',
    sentimentScore: 25,
    reach: 890,
    priority: 'high',
    responseSuggested: 'Bonjour Marie, nous sommes sincèrement désolés pour ce désagrément et le manque d\'information. Pourriez-vous nous envoyer un message privé avec votre numéro de réservation ? Notre équipe va s\'occuper personnellement de votre situation.',
    status: 'pending',
    date: '2026-01-28T08:45:00',
  },
  {
    id: '4',
    platform: 'LinkedIn',
    author: 'Paul Martin, Travel Industry Expert',
    content: 'Impressed by Air Tahiti Nui\'s digital transformation strategy. Their new AI-powered customer service is a game changer for the Pacific aviation market.',
    sentiment: 'positive',
    sentimentScore: 88,
    reach: 12300,
    priority: 'medium',
    responseSuggested: 'Thank you Paul for highlighting our innovation efforts! We\'re committed to combining the best of Polynesian hospitality with cutting-edge technology to serve our passengers better.',
    status: 'pending',
    date: '2026-01-28T07:30:00',
  },
]

const platformIcons: Record<string, any> = {
  'Twitter/X': Twitter,
  'Instagram': Instagram,
  'Facebook': Facebook,
  'LinkedIn': Linkedin,
}

const platformColors: Record<string, string> = {
  'Twitter/X': 'bg-sky-100 text-sky-700',
  'Instagram': 'bg-pink-100 text-pink-700',
  'Facebook': 'bg-blue-100 text-blue-700',
  'LinkedIn': 'bg-indigo-100 text-indigo-700',
  'TikTok': 'bg-slate-800 text-white',
}

function MentionCard({ mention, onRespond }: { mention: SocialMention; onRespond: () => void }) {
  const [showResponse, setShowResponse] = useState(false)
  const PlatformIcon = platformIcons[mention.platform] || Users

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-slate-100 text-slate-700',
  }

  const sentimentColors = {
    positive: 'bg-emerald-100 text-emerald-700',
    neutral: 'bg-amber-100 text-amber-700',
    negative: 'bg-red-100 text-red-700',
  }

  const sentimentLabels = {
    positive: 'Positif',
    neutral: 'Neutre',
    negative: 'Négatif',
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${platformColors[mention.platform]}`}>
            <PlatformIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-sm">{mention.author}</p>
            <p className="text-xs text-slate-500">{mention.platform}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[mention.priority]}`}>
            {mention.priority === 'high' ? 'Prioritaire' : mention.priority === 'medium' ? 'Normal' : 'Basse'}
          </span>
          {mention.status === 'responded' && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
              Répondu
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-700 mb-3">{mention.content}</p>

      {/* Metrics */}
      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          <span>{mention.reach.toLocaleString()} reach</span>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${sentimentColors[mention.sentiment]}`}>
          {sentimentLabels[mention.sentiment]} {mention.sentimentScore}%
        </span>
      </div>

      {/* Response section */}
      {mention.status === 'pending' && (
        <div className="border-t border-slate-100 pt-4">
          <button
            className="flex items-center gap-2 text-sm text-atn-secondary hover:underline"
            onClick={() => setShowResponse(!showResponse)}
          >
            <MessageCircle className="w-4 h-4" />
            {showResponse ? 'Masquer' : 'Voir réponse suggérée'}
          </button>

          {showResponse && (
            <div className="mt-3 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-700 mb-4">{mention.responseSuggested}</p>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg text-sm hover:bg-opacity-90"
                  onClick={onRespond}
                >
                  <Send className="w-4 h-4" />
                  Publier la réponse
                </button>
                <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300">
                  Modifier
                </button>
                <button className="px-4 py-2 text-slate-500 text-sm hover:underline ml-auto">
                  Ignorer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-slate-400 mt-4">
        {new Date(mention.date).toLocaleString('fr-FR')}
      </div>
    </div>
  )
}

export default function SocialPage() {
  const [mentions, setMentions] = useState<SocialMention[]>([])
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Fetch social mentions from Airtable
  const fetchMentions = async () => {
    try {
      const response = await fetch('/api/airtable?table=Social_Mentions&sortField=Date&sortDir=desc&limit=50')
      const data = await response.json()

      if (data.records && data.records.length > 0) {
        const mapped: SocialMention[] = data.records.map((record: { id: string; fields: Record<string, unknown> }) => ({
          id: record.id,
          platform: (record.fields.Platform as string) || 'Twitter/X',
          author: (record.fields.Author as string) || '@unknown',
          content: (record.fields.Content as string) || '',
          sentiment: ((record.fields.Sentiment as string)?.toLowerCase() || 'neutral') as 'positive' | 'neutral' | 'negative',
          sentimentScore: (record.fields.Sentiment_Score as number) || 50,
          reach: (record.fields.Reach as number) || 0,
          priority: ((record.fields.Priority as string)?.toLowerCase() || 'medium') as 'high' | 'medium' | 'low',
          responseSuggested: (record.fields.Response_Suggested as string) || '',
          status: ((record.fields.Status as string)?.toLowerCase() || 'pending') as 'pending' | 'responded' | 'ignored',
          date: (record.fields.Date as string) || new Date().toISOString(),
        }))
        setMentions(mapped)
      } else {
        setMentions(fallbackMentions)
      }
    } catch (error) {
      console.error('Error fetching social mentions:', error)
      setMentions(fallbackMentions)
    } finally {
      setLoading(false)
    }
  }

  // Sync social mentions (trigger n8n workflow)
  const syncMentions = async () => {
    setSyncing(true)
    try {
      await fetch('https://n8n.srv1140766.hstgr.cloud/webhook/atn-social-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan' })
      })
      await fetchMentions()
    } catch (error) {
      console.error('Error syncing social mentions:', error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchMentions()
  }, [])

  const handleRespond = (id: string) => {
    setMentions(mentions.map(m =>
      m.id === id ? { ...m, status: 'responded' as const } : m
    ))
  }

  const filteredMentions = filterPlatform
    ? mentions.filter(m => m.platform === filterPlatform)
    : mentions

  // Stats
  const totalReach = mentions.reduce((acc, m) => acc + m.reach, 0)
  const avgSentiment = mentions.length > 0 ? Math.round(mentions.reduce((acc, m) => acc + m.sentimentScore, 0) / mentions.length) : 0
  const pendingCount = mentions.filter(m => m.status === 'pending').length
  const negativeCount = mentions.filter(m => m.sentiment === 'negative').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Users className="w-7 h-7 text-atn-secondary" />
            Social Monitor
          </h1>
          <p className="text-slate-500">Build 6: Surveillance des réseaux sociaux</p>
        </div>
        <button
          onClick={syncMentions}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-atn-primary to-atn-secondary text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {syncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{syncing ? 'Scan en cours...' : 'Scanner'}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-guide="social-kpi-reach" className="card">
          <p className="text-sm text-slate-500">Portée totale</p>
          <p className="text-2xl font-bold">{totalReach.toLocaleString()}</p>
        </div>
        <div data-guide="social-kpi-sentiment" className="card">
          <p className="text-sm text-slate-500">Sentiment moyen</p>
          <p className={`text-2xl font-bold ${avgSentiment >= 70 ? 'text-emerald-600' : avgSentiment >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
            {avgSentiment}%
          </p>
        </div>
        <div data-guide="social-kpi-pending" className="card">
          <p className="text-sm text-slate-500">À traiter</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div data-guide="social-kpi-negative" className="card">
          <p className="text-sm text-slate-500">Alertes négatives</p>
          <p className="text-2xl font-bold text-red-600">{negativeCount}</p>
        </div>
      </div>

      {/* Filtres */}
      <div data-guide="social-filters" className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm ${!filterPlatform ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilterPlatform(null)}
        >
          Tous
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
            filterPlatform === 'Twitter/X' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
          }`}
          onClick={() => setFilterPlatform('Twitter/X')}
        >
          <Twitter className="w-4 h-4" />
          Twitter/X
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
            filterPlatform === 'Instagram' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
          }`}
          onClick={() => setFilterPlatform('Instagram')}
        >
          <Instagram className="w-4 h-4" />
          Instagram
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
            filterPlatform === 'Facebook' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
          }`}
          onClick={() => setFilterPlatform('Facebook')}
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
            filterPlatform === 'LinkedIn' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
          }`}
          onClick={() => setFilterPlatform('LinkedIn')}
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </button>
      </div>

      {/* Liste des mentions */}
      <div data-guide="social-mentions-list" className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atn-primary" />
            <span className="ml-3 text-slate-500">Chargement des mentions...</span>
          </div>
        ) : filteredMentions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Aucune mention trouvée
          </div>
        ) : (
          filteredMentions.map(mention => (
            <MentionCard
              key={mention.id}
              mention={mention}
              onRespond={() => handleRespond(mention.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
