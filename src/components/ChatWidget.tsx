'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, Loader2, Calendar, Mail, FileText, BarChart3, Settings, Minimize2, Compass, HelpCircle } from 'lucide-react'
import { sendAssistantMessage, generateReport } from '@/lib/api'
import SidebarGuide from './SidebarGuide'
import InteractiveGuide from './InteractiveGuide'

// Set to true to use real n8n webhooks, false for demo mode
const USE_REAL_API = true

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: {
    type: string
    label: string
    data?: any
  }[]
}

const QUICK_ACTIONS = [
  { icon: Calendar, label: 'Reprogrammer un contenu', prompt: 'Je veux reprogrammer un contenu' },
  { icon: Mail, label: 'Modifier une newsletter', prompt: 'Modifier la prochaine newsletter' },
  { icon: FileText, label: 'Générer un article', prompt: 'Génère un nouvel article SEO' },
  { icon: BarChart3, label: 'Rapport du jour', prompt: 'Donne-moi le rapport du jour' },
  { icon: Settings, label: 'Ajuster un prompt', prompt: 'Je veux ajuster un prompt de workflow' },
]

const DEMO_RESPONSES: Record<string, { content: string; actions?: Message['actions'] }> = {
  'rapport': {
    content: `📊 **Rapport du 28 janvier 2026**

**Performances du jour:**
- 4 newsletters envoyées (taux d'ouverture moyen: 34%)
- 2 articles publiés (SEO score: 91%)
- 156 conversations concierge traitées
- 3 alertes concurrentielles détectées

**Points d'attention:**
- Route PPT-NRT en baisse (-25%) → campagne recommandée
- 2 avis négatifs à traiter (Build 9)

**Revenus générés:**
- Upsell: 180,000 XPF
- Conversions newsletter: ~450,000 XPF estimé`,
    actions: [
      { type: 'view', label: 'Voir détails ROI', data: { route: '/roi' } },
      { type: 'view', label: 'Voir les avis', data: { route: '/reviews' } },
    ]
  },
  'newsletter': {
    content: `📧 **Prochaine newsletter programmée:**

**"Offres spéciales Bora Bora"**
- Date: 30 janvier 2026, 09:00
- Segment: Tous les abonnés (12,450)
- Statut: En attente de validation

Que veux-tu modifier?`,
    actions: [
      { type: 'edit', label: 'Modifier le titre', data: { field: 'title' } },
      { type: 'edit', label: 'Changer la date', data: { field: 'date' } },
      { type: 'edit', label: 'Voir le contenu', data: { field: 'content' } },
    ]
  },
  'article': {
    content: `✍️ **Génération d'article SEO**

Je peux générer un article optimisé. Choisis un sujet ou donne-moi un thème:

**Sujets suggérés (trending):**
1. "Meilleure période pour visiter les Tuamotu"
2. "Guide complet: escale à Los Angeles"
3. "Poerava Business vs concurrence"

Ou décris le sujet que tu veux.`,
    actions: [
      { type: 'generate', label: 'Sujet 1: Tuamotu', data: { topic: 1 } },
      { type: 'generate', label: 'Sujet 2: LA', data: { topic: 2 } },
      { type: 'generate', label: 'Sujet 3: Business', data: { topic: 3 } },
    ]
  },
  'reprogrammer': {
    content: `📅 **Contenus programmés cette semaine:**

1. Newsletter "Offres Bora Bora" - 30 jan
2. Article "Plongée Rangiroa" - 31 jan
3. Newsletter "Tokyo nouvelle ligne" - 1 fév
4. Article "Polynésie en famille" - 2 fév

Lequel veux-tu reprogrammer?`,
    actions: [
      { type: 'reschedule', label: 'Newsletter 30 jan', data: { id: 1 } },
      { type: 'reschedule', label: 'Article 31 jan', data: { id: 2 } },
      { type: 'reschedule', label: 'Newsletter 1 fév', data: { id: 3 } },
    ]
  },
  'prompt': {
    content: `⚙️ **Ajustement des prompts workflows**

Quel workflow veux-tu ajuster?

**Workflows avec prompts IA:**
- Build 1: Concierge (ton, personnalité)
- Build 2: Newsletter (style rédactionnel)
- Build 3: Articles SEO (structure, mots-clés)
- Build 9: Réponses avis (empathie, solutions)
- Build 10: Upsell (persuasion, offres)`,
    actions: [
      { type: 'prompt', label: 'Concierge', data: { build: 1 } },
      { type: 'prompt', label: 'Newsletter', data: { build: 2 } },
      { type: 'prompt', label: 'Articles', data: { build: 3 } },
    ]
  },
  'default': {
    content: `Je suis l'assistant du dashboard ATN. Je peux t'aider à:

• **Modifier** newsletters et articles
• **Reprogrammer** du contenu
• **Générer** de nouveaux contenus
• **Ajuster** les prompts des workflows
• **Créer** des rapports sur demande

Que veux-tu faire?`
  }
}

function getResponse(message: string): { content: string; actions?: Message['actions'] } {
  const lower = message.toLowerCase()

  if (lower.includes('rapport') || lower.includes('jour') || lower.includes('performance')) {
    return DEMO_RESPONSES['rapport']
  }
  if (lower.includes('newsletter') || lower.includes('email') || lower.includes('mail')) {
    return DEMO_RESPONSES['newsletter']
  }
  if (lower.includes('article') || lower.includes('seo') || lower.includes('génère') || lower.includes('genere')) {
    return DEMO_RESPONSES['article']
  }
  if (lower.includes('reprogramm') || lower.includes('date') || lower.includes('calendrier')) {
    return DEMO_RESPONSES['reprogrammer']
  }
  if (lower.includes('prompt') || lower.includes('ajust') || lower.includes('workflow')) {
    return DEMO_RESPONSES['prompt']
  }

  return DEMO_RESPONSES['default']
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showSidebarGuide, setShowSidebarGuide] = useState(false)
  const [showInteractiveGuide, setShowInteractiveGuide] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Salut! Je suis l\'assistant du dashboard ATN. Je peux modifier tes contenus, reprogrammer des publications, générer des rapports... Que puis-je faire pour toi?',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    let response: { content: string; actions?: Message['actions'] }

    if (USE_REAL_API) {
      // Use real n8n webhook
      try {
        const apiResponse = await sendAssistantMessage(messageText, `session_${Date.now()}`)
        if (apiResponse.success) {
          response = {
            content: apiResponse.response || 'Action effectuée.',
          }
        } else {
          // Fallback to demo if API fails
          response = getResponse(messageText)
        }
      } catch (error) {
        response = getResponse(messageText)
      }
    } else {
      // Demo mode
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000))
      response = getResponse(messageText)
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      actions: response.actions,
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleAction = (action: { type: string; label: string; data?: { route?: string } }) => {
    if (action.type === 'view' && action.data?.route) {
      window.location.href = action.data.route
    } else {
      // Handle other actions - could trigger workflow webhooks
      handleSend(`Action: ${action.label}`)
    }
  }

  if (!isOpen) {
    return (
      <>
        {/* Sidebar Guide Modal */}
        <SidebarGuide
          isOpen={showSidebarGuide}
          onClose={() => setShowSidebarGuide(false)}
          autoPlay={false}
        />

        {/* Interactive Guide (rendered when active) */}
        {showInteractiveGuide && <InteractiveGuide />}

        {/* Floating buttons container */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          {/* Guide Interactif button - top */}
          <button
            onClick={() => setShowInteractiveGuide(!showInteractiveGuide)}
            className={`w-14 h-14 ${showInteractiveGuide ? 'bg-emerald-600' : 'bg-emerald-500'} text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all hover:scale-105 flex items-center justify-center`}
            title="Guide Interactif"
          >
            <HelpCircle className="w-6 h-6" />
          </button>

          {/* Guide Sidebar button - middle */}
          <button
            onClick={() => setShowSidebarGuide(true)}
            className="w-14 h-14 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 transition-all hover:scale-105 flex items-center justify-center"
            title="Guide Sidebar"
          >
            <Compass className="w-6 h-6" />
          </button>

          {/* Assistant button - bottom */}
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-atn-secondary text-white rounded-full shadow-lg hover:bg-atn-secondary/90 transition-all hover:scale-105 flex items-center justify-center relative"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
              1
            </span>
          </button>
        </div>
      </>
    )
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col transition-all ${
        isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-atn-primary to-atn-secondary rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Assistant ATN</h3>
            {!isMinimized && (
              <p className="text-xs text-white/70">Connecté aux 20 workflows</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-atn-secondary text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-800 rounded-bl-md'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>

                  {/* Action buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleAction(action)}
                          className="px-3 py-1.5 bg-white text-atn-secondary text-xs font-medium rounded-full hover:bg-slate-50 transition-colors border border-atn-secondary/20"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-slate-500 mb-2">Actions rapides:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action.prompt)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-xs text-slate-700 transition-colors"
                  >
                    <action.icon className="w-3 h-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Demande quelque chose..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-atn-secondary/50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-atn-secondary text-white rounded-full flex items-center justify-center hover:bg-atn-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
