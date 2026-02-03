'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Search, Clock, Zap, RefreshCw, Loader2 } from 'lucide-react'

// Types
interface Conversation {
  id: string
  session: string
  question: string
  response: string
  language: string
  responseTime: number
  tokens: number
  timestamp: string
}

// Detect language from text
function detectLanguage(text: string): string {
  if (/[ぁ-んァ-ン]/.test(text)) return 'JP'
  if (/[一-龯]/.test(text)) return 'CN'
  if (/[áéíóúñ¿¡]/i.test(text)) return 'ES'
  if (/[àâçéèêëîïôûùüÿœæ]/i.test(text)) return 'FR'
  if (/^[a-zA-Z\s.,!?'"()-]+$/.test(text)) return 'EN'
  return 'FR' // Default
}

// Composant ligne conversation
function ConversationRow({ conversation }: { conversation: Conversation }) {
  const [expanded, setExpanded] = useState(false)
  const langColors: Record<string, string> = {
    FR: 'bg-blue-100 text-blue-700',
    EN: 'bg-emerald-100 text-emerald-700',
    ES: 'bg-amber-100 text-amber-700',
    JP: 'bg-pink-100 text-pink-700',
    CN: 'bg-red-100 text-red-700',
  }

  return (
    <div className="border-b border-slate-100 last:border-0">
      <div
        className="flex items-center gap-4 py-4 cursor-pointer hover:bg-slate-50 px-4 -mx-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`px-2 py-1 rounded text-xs font-medium ${langColors[conversation.language] || 'bg-slate-100 text-slate-700'}`}>
          {conversation.language}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{conversation.question}</p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{conversation.response}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{conversation.responseTime}s</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>{conversation.tokens}</span>
          </div>
          <span className="text-xs">
            {new Date(conversation.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 bg-slate-50 -mx-4">
          <div className="grid grid-cols-2 gap-4 p-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Question</p>
              <p className="text-sm bg-white p-3 rounded-lg border border-slate-200">
                {conversation.question}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Réponse IA</p>
              <p className="text-sm bg-white p-3 rounded-lg border border-slate-200">
                {conversation.response}
              </p>
            </div>
          </div>
          <div className="flex gap-2 px-4">
            <span className="text-xs text-slate-400">Session: {conversation.session}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLang, setFilterLang] = useState<string | null>(null)

  // Fetch conversations from Airtable
  const fetchConversations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/airtable?table=Concierge_Logs&sortField=Date&sortDir=desc&limit=50')
      const data = await response.json()

      if (data.records) {
        const mapped = data.records.map((r: { id: string; fields: { Session?: string; Question?: string; 'Réponse'?: string; 'Temps (s)'?: number; Tokens?: number; Date?: string } }) => ({
          id: r.id,
          session: r.fields.Session || '',
          question: r.fields.Question || '',
          response: r.fields['Réponse'] || '',
          language: detectLanguage(r.fields.Question || ''),
          responseTime: r.fields['Temps (s)'] || 0,
          tokens: r.fields.Tokens || 0,
          timestamp: r.fields.Date || new Date().toISOString(),
        }))
        setConversations(mapped)
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  const filteredConversations = conversations.filter(c => {
    if (filterLang && c.language !== filterLang) return false
    if (searchQuery && !c.question.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Stats
  const totalConversations = conversations.length
  const avgResponseTime = totalConversations > 0
    ? (conversations.reduce((acc, c) => acc + c.responseTime, 0) / totalConversations).toFixed(1)
    : '0'
  const totalTokens = conversations.reduce((acc, c) => acc + c.tokens, 0)
  const uniqueLangs = Array.from(new Set(conversations.map(c => c.language)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-atn-secondary" />
            Conversations
          </h1>
          <p className="text-slate-500">Build 1: Concierge IA Multilingue - Données Airtable en temps réel</p>
        </div>
        <button
          onClick={fetchConversations}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg hover:bg-atn-primary/90 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Total conversations</p>
          <p className="text-2xl font-bold">{totalConversations}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Temps moyen</p>
          <p className="text-2xl font-bold">{avgResponseTime}s</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Tokens utilisés</p>
          <p className="text-2xl font-bold">{totalTokens}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Langues détectées</p>
          <div className="flex gap-1 mt-2">
            {uniqueLangs.length > 0 ? uniqueLangs.map(lang => (
              <span key={lang} className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                {lang}
              </span>
            )) : (
              <span className="text-xs text-slate-400">-</span>
            )}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded-lg text-sm ${!filterLang ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setFilterLang(null)}
          >
            Tous
          </button>
          {['FR', 'EN', 'ES', 'JP'].map(lang => (
            <button
              key={lang}
              className={`px-3 py-2 rounded-lg text-sm ${filterLang === lang ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
              onClick={() => setFilterLang(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atn-secondary" />
            <span className="ml-3 text-slate-500">Chargement depuis Airtable...</span>
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map(conversation => (
            <ConversationRow key={conversation.id} conversation={conversation} />
          ))
        ) : (
          <p className="text-center text-slate-500 py-8">Aucune conversation trouvée</p>
        )}
      </div>
    </div>
  )
}
