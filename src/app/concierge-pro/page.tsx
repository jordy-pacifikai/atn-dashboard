'use client'

import { useState } from 'react'
import { Headphones, User, Plane, Calendar, MessageSquare, Send, Clock, CheckCircle, AlertCircle, Bot, UserCircle, Sparkles, Loader2 } from 'lucide-react'

interface Conversation {
  id: string
  customer: {
    name: string
    email: string
    language: string
    pnr?: string
    flightDate?: string
    route?: string
    class?: string
  }
  messages: {
    role: 'customer' | 'assistant'
    content: string
    timestamp: string
  }[]
  status: 'active' | 'resolved' | 'escalated'
  category: string
  sentiment: 'positive' | 'neutral' | 'negative'
}

const demoConversations: Conversation[] = [
  {
    id: '1',
    customer: {
      name: 'Jean-Pierre Martin',
      email: 'jpmartin@email.com',
      language: 'FR',
      pnr: 'TN789XY',
      flightDate: '2026-02-15',
      route: 'PPT → LAX',
      class: 'Poerava Business',
    },
    messages: [
      { role: 'customer', content: 'Bonjour, je souhaiterais modifier mon siège pour le vol du 15 février', timestamp: '2026-01-29T10:30:00' },
      { role: 'assistant', content: 'Bonjour M. Martin ! J\'ai bien trouvé votre réservation TN789XY pour le vol Papeete-Los Angeles du 15 février en classe Poerava Business. Vous êtes actuellement placé en 2A (côté hublot). Souhaitez-vous plutôt un siège côté couloir ?', timestamp: '2026-01-29T10:30:05' },
      { role: 'customer', content: 'Oui exactement, côté couloir si possible', timestamp: '2026-01-29T10:31:00' },
      { role: 'assistant', content: 'Parfait ! Le siège 2C côté couloir est disponible. Je procède au changement. Vous recevrez une confirmation par email dans quelques instants. Y a-t-il autre chose que je puisse faire pour vous ?', timestamp: '2026-01-29T10:31:05' },
    ],
    status: 'active',
    category: 'Modification siège',
    sentiment: 'positive',
  },
  {
    id: '2',
    customer: {
      name: 'Sarah Johnson',
      email: 'sjohnson@email.com',
      language: 'EN',
      pnr: 'TN456AB',
      flightDate: '2026-02-20',
      route: 'LAX → PPT',
      class: 'Moana Economy',
    },
    messages: [
      { role: 'customer', content: 'What is the baggage allowance for my flight?', timestamp: '2026-01-29T09:15:00' },
      { role: 'assistant', content: 'Hello Ms. Johnson! For your Moana Economy class booking on flight TN456AB (Los Angeles to Papeete on Feb 20), your baggage allowance includes: 1 checked bag (23kg), 1 cabin bag (10kg), and 1 personal item. Would you like to add extra baggage?', timestamp: '2026-01-29T09:15:05' },
    ],
    status: 'resolved',
    category: 'Bagages',
    sentiment: 'neutral',
  },
  {
    id: '3',
    customer: {
      name: 'Takeshi Yamamoto',
      email: 'tyamamoto@email.jp',
      language: 'JP',
      pnr: 'TN123CD',
      flightDate: '2026-02-10',
      route: 'NRT → PPT',
      class: 'Poerava Business',
    },
    messages: [
      { role: 'customer', content: '予約の確認をお願いします', timestamp: '2026-01-29T08:00:00' },
      { role: 'assistant', content: '山本様、こんにちは。TN123CDの予約を確認いたしました。2月10日の成田発パペーテ行きポエラバ・ビジネスクラスでございます。ご質問はございますか？', timestamp: '2026-01-29T08:00:05' },
    ],
    status: 'active',
    category: 'Confirmation',
    sentiment: 'positive',
  },
]

function BookingContext({ customer }: { customer: Conversation['customer'] }) {
  if (!customer.pnr) return null

  return (
    <div className="bg-gradient-to-r from-atn-primary/10 to-atn-secondary/10 rounded-lg p-4 mb-4">
      <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
        <Plane className="w-4 h-4 text-atn-primary" />
        Contexte réservation
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-slate-500 text-xs">PNR</p>
          <p className="font-medium">{customer.pnr}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Vol</p>
          <p className="font-medium">{customer.route}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Date</p>
          <p className="font-medium">{new Date(customer.flightDate!).toLocaleDateString('fr-FR')}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Classe</p>
          <p className="font-medium">{customer.class}</p>
        </div>
      </div>
    </div>
  )
}

function ConversationCard({ conversation, selected, onClick }: { conversation: Conversation; selected: boolean; onClick: () => void }) {
  const statusIcons = {
    active: <Clock className="w-4 h-4 text-blue-500" />,
    resolved: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    escalated: <AlertCircle className="w-4 h-4 text-red-500" />,
  }

  const sentimentColors = {
    positive: 'border-l-emerald-500',
    neutral: 'border-l-amber-500',
    negative: 'border-l-red-500',
  }

  const lastMessage = conversation.messages[conversation.messages.length - 1]

  return (
    <button
      className={`w-full text-left p-4 border-l-4 ${sentimentColors[conversation.sentiment]} ${
        selected ? 'bg-atn-primary/5' : 'bg-white hover:bg-slate-50'
      } rounded-r-lg mb-2`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{conversation.customer.language}</span>
          <span className="font-medium text-sm">{conversation.customer.name}</span>
        </div>
        {statusIcons[conversation.status]}
      </div>
      <p className="text-sm text-slate-600 line-clamp-1">{lastMessage.content}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-400">{conversation.category}</span>
        <span className="text-xs text-slate-400">
          {new Date(lastMessage.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </button>
  )
}

export default function ConciergeProPage() {
  const [selectedId, setSelectedId] = useState(demoConversations[0].id)
  const [newMessage, setNewMessage] = useState('')
  const [aiEnabled, setAiEnabled] = useState(true)
  const [conversations, setConversations] = useState(demoConversations)
  const [isSending, setIsSending] = useState(false)

  const selectedConversation = conversations.find(c => c.id === selectedId)!

  // Simuler envoi de message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsSending(true)

    // Ajouter le message de l'assistant/humain
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedId) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              role: 'assistant' as const,
              content: newMessage,
              timestamp: new Date().toISOString(),
            }
          ]
        }
      }
      return conv
    })

    setConversations(updatedConversations)
    setNewMessage('')

    // Simuler réponse du client après 2 secondes
    await new Promise(r => setTimeout(r, 2000))

    const customerResponses = [
      'Merci beaucoup pour votre aide !',
      'Parfait, c\'est exactement ce dont j\'avais besoin.',
      'D\'accord, je comprends. Merci !',
      'Excellent service, merci !',
    ]

    const randomResponse = customerResponses[Math.floor(Math.random() * customerResponses.length)]

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedId) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              role: 'customer' as const,
              content: randomResponse,
              timestamp: new Date().toISOString(),
            }
          ]
        }
      }
      return conv
    }))

    // Si l'IA est activée, générer une réponse automatique
    if (aiEnabled) {
      await new Promise(r => setTimeout(r, 1500))

      const aiResponses = [
        'Je suis ravi d\'avoir pu vous aider ! N\'hésitez pas si vous avez d\'autres questions. Bon voyage avec Air Tahiti Nui ! 🌺',
        'Avec plaisir ! Y a-t-il autre chose que je puisse faire pour vous avant votre vol ?',
        'C\'est un plaisir de vous assister. Je reste à votre disposition pour toute autre demande.',
      ]

      const randomAiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedId) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                role: 'assistant' as const,
                content: randomAiResponse,
                timestamp: new Date().toISOString(),
              }
            ]
          }
        }
        return conv
      }))
    }

    setIsSending(false)
  }

  const stats = {
    active: conversations.filter(c => c.status === 'active').length,
    resolved: conversations.filter(c => c.status === 'resolved').length,
    withBooking: conversations.filter(c => c.customer.pnr).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Headphones className="w-7 h-7 text-sky-500" />
            Concierge Pro
          </h1>
          <p className="text-slate-500">Build 18: Concierge avec contexte réservation</p>
        </div>

        {/* Toggle IA */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
            aiEnabled
              ? 'bg-gradient-to-r from-sky-50 to-cyan-50 border-sky-200'
              : 'bg-slate-50 border-slate-200'
          }`}>
            {aiEnabled ? (
              <Bot className="w-5 h-5 text-sky-600" />
            ) : (
              <UserCircle className="w-5 h-5 text-slate-500" />
            )}
            <span className={`text-sm font-medium ${aiEnabled ? 'text-sky-700' : 'text-slate-600'}`}>
              {aiEnabled ? 'Mode IA' : 'Mode Manuel'}
            </span>
          </div>

          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              aiEnabled
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 shadow-md'
                : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center ${
                aiEnabled ? 'translate-x-7' : 'translate-x-0'
              }`}
            >
              {aiEnabled ? (
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              ) : (
                <UserCircle className="w-3.5 h-3.5 text-slate-400" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Bannière mode manuel */}
      {!aiEnabled && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Mode manuel activé</p>
            <p className="text-xs text-amber-600">L'agent IA ne répondra pas automatiquement. Les réponses seront gérées manuellement.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-guide="concierge-kpi-active" className="card">
          <p className="text-sm text-slate-500">Conversations actives</p>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div data-guide="concierge-kpi-resolved" className="card">
          <p className="text-sm text-slate-500">Résolues aujourd'hui</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.resolved}</p>
        </div>
        <div data-guide="concierge-kpi-withbooking" className="card">
          <p className="text-sm text-slate-500">Avec réservation</p>
          <p className="text-2xl font-bold">{stats.withBooking}</p>
        </div>
        <div data-guide="concierge-kpi-languages" className="card">
          <p className="text-sm text-slate-500">Langues actives</p>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Liste des conversations */}
        <div data-guide="concierge-conversations-list" className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversations
          </h2>
          <div className="space-y-2">
            {conversations.map(conv => (
              <ConversationCard
                key={conv.id}
                conversation={conv}
                selected={conv.id === selectedId}
                onClick={() => setSelectedId(conv.id)}
              />
            ))}
          </div>
        </div>

        {/* Conversation sélectionnée */}
        <div data-guide="concierge-chat-panel" className="col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-atn-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-atn-primary" />
              </div>
              <div>
                <p className="font-medium">{selectedConversation.customer.name}</p>
                <p className="text-sm text-slate-500">{selectedConversation.customer.email}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              selectedConversation.status === 'active' ? 'bg-blue-100 text-blue-700' :
              selectedConversation.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
              'bg-red-100 text-red-700'
            }`}>
              {selectedConversation.status === 'active' ? 'En cours' :
               selectedConversation.status === 'resolved' ? 'Résolu' : 'Escaladé'}
            </span>
          </div>

          <BookingContext customer={selectedConversation.customer} />

          {/* Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4 p-4 bg-slate-50 rounded-lg">
            {selectedConversation.messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'assistant'
                    ? 'bg-white border border-slate-200'
                    : 'bg-atn-primary text-white'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'assistant' ? 'text-slate-400' : 'text-white/70'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              data-guide="concierge-input"
              type="text"
              placeholder={aiEnabled ? "Écrire une réponse (l'IA répondra ensuite automatiquement)..." : "Écrire une réponse manuelle..."}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isSending}
            />
            <button
              data-guide="concierge-btn-send"
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-atn-primary to-atn-secondary text-white rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer
                </>
              )}
            </button>
          </div>

          {/* Indicateur mode IA */}
          <div className={`mt-3 flex items-center gap-2 text-xs ${aiEnabled ? 'text-sky-600' : 'text-slate-500'}`}>
            {aiEnabled ? (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>L'IA répondra automatiquement aux messages du client</span>
              </>
            ) : (
              <>
                <UserCircle className="w-3.5 h-3.5" />
                <span>Mode manuel - Vous gérez la conversation</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
