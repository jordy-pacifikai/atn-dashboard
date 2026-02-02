'use client'

import { useState } from 'react'
import { Users, Twitter, Instagram, Facebook, Linkedin, TrendingUp, MessageCircle, Send } from 'lucide-react'

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

const demoMentions: SocialMention[] = [
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
    positive: 'text-emerald-600',
    neutral: 'text-amber-600',
    negative: 'text-red-600',
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
        <div className={`flex items-center gap-1 ${sentimentColors[mention.sentiment]}`}>
          <span>Sentiment: {mention.sentimentScore}%</span>
        </div>
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
  const [mentions, setMentions] = useState(demoMentions)
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null)

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
  const avgSentiment = Math.round(mentions.reduce((acc, m) => acc + m.sentimentScore, 0) / mentions.length)
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Portée totale</p>
          <p className="text-2xl font-bold">{totalReach.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Sentiment moyen</p>
          <p className={`text-2xl font-bold ${avgSentiment >= 70 ? 'text-emerald-600' : avgSentiment >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
            {avgSentiment}%
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">À traiter</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Alertes négatives</p>
          <p className="text-2xl font-bold text-red-600">{negativeCount}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm ${!filterPlatform ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilterPlatform(null)}
        >
          Tous
        </button>
        {['Twitter/X', 'Instagram', 'Facebook', 'LinkedIn'].map((platform) => {
          const Icon = platformIcons[platform]
          return (
            <button
              key={platform}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                filterPlatform === platform ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
              }`}
              onClick={() => setFilterPlatform(platform)}
            >
              <Icon className="w-4 h-4" />
              {platform}
            </button>
          )
        })}
      </div>

      {/* Liste des mentions */}
      <div className="space-y-4">
        {filteredMentions.map(mention => (
          <MentionCard
            key={mention.id}
            mention={mention}
            onRespond={() => handleRespond(mention.id)}
          />
        ))}
      </div>
    </div>
  )
}
