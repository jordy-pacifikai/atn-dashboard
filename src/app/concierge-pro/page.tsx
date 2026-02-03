'use client'

import { useState } from 'react'
import { Headphones, User, Plane, Calendar, MessageSquare, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react'

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

  const selectedConversation = demoConversations.find(c => c.id === selectedId)!

  const stats = {
    active: demoConversations.filter(c => c.status === 'active').length,
    resolved: demoConversations.filter(c => c.status === 'resolved').length,
    withBooking: demoConversations.filter(c => c.customer.pnr).length,
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
      </div>

      <div data-guide="concierge-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Conversations actives</p>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Résolues aujourd'hui</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.resolved}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Avec réservation</p>
          <p className="text-2xl font-bold">{stats.withBooking}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Langues actives</p>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Liste des conversations */}
        <div data-guide="concierge-conversations" className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversations
          </h2>
          <div className="space-y-2">
            {demoConversations.map(conv => (
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
        <div data-guide="concierge-chat" className="col-span-2 card">
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
              type="text"
              placeholder="Écrire une réponse..."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-atn-primary"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="px-6 py-3 bg-atn-primary text-white rounded-lg flex items-center gap-2 hover:bg-opacity-90">
              <Send className="w-5 h-5" />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
