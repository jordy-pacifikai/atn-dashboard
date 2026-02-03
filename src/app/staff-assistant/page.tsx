'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { UserCog, MessageSquare, Send, FileText, HelpCircle, Clock, CheckCircle, Search, Book, Settings, Loader2, X, ThumbsDown, Plane, Calendar, Users, Shield, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react'

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

interface KnowledgeDocument {
  id: string
  title: string
  category: string
  excerpt: string
  lastUpdated: string
}

// Mapping des catégories Airtable vers les catégories du composant
const categoryMapping: Record<string, 'procedures' | 'hr' | 'technical' | 'operations'> = {
  'Procedure': 'procedures',
  'Planning': 'operations',
  'Conges': 'hr',
  'Formation': 'hr',
  'IT': 'technical',
  'Autre': 'procedures',
}

const categories = [
  { id: 'all', label: 'Toutes', icon: HelpCircle },
  { id: 'procedures', label: 'Procédures', icon: FileText },
  { id: 'hr', label: 'RH', icon: UserCog },
  { id: 'technical', label: 'Technique', icon: Settings },
  { id: 'operations', label: 'Opérations', icon: Clock },
]

// Base de connaissances mock data
const knowledgeBase: Record<string, KnowledgeDocument[]> = {
  procedures: [
    { id: 'p1', title: 'Procédure d\'embarquement standard', category: 'Embarquement', excerpt: 'Processus complet d\'embarquement des passagers, de la vérification des documents à l\'installation en cabine...', lastUpdated: '2026-01-15' },
    { id: 'p2', title: 'Gestion des bagages spéciaux', category: 'Bagages', excerpt: 'Protocole pour la manipulation des équipements sportifs, instruments de musique et objets fragiles...', lastUpdated: '2026-01-20' },
    { id: 'p3', title: 'Procédure d\'évacuation d\'urgence', category: 'Sécurité', excerpt: 'Instructions détaillées pour l\'évacuation rapide et sécurisée des passagers en cas d\'urgence...', lastUpdated: '2026-02-01' },
    { id: 'p4', title: 'Protocole VIP et Business Class', category: 'Service', excerpt: 'Standards de service premium pour les passagers Business et les VIP...', lastUpdated: '2026-01-25' },
    { id: 'p5', title: 'Gestion des retards et annulations', category: 'Opérations', excerpt: 'Procédures de communication et de rebooking en cas de perturbations...', lastUpdated: '2026-01-18' },
  ],
  hr: [
    { id: 'h1', title: 'Politique de congés et RTT', category: 'Congés', excerpt: 'Règles d\'acquisition et de prise des congés payés, RTT et congés spéciaux...', lastUpdated: '2026-01-10' },
    { id: 'h2', title: 'Formation continue PNC', category: 'Formation', excerpt: 'Programme de formation obligatoire et optionnelle pour le Personnel Navigant Commercial...', lastUpdated: '2026-01-28' },
    { id: 'h3', title: 'Avantages employés ATN', category: 'Avantages', excerpt: 'Billets staff, réductions partenaires, assurance santé et autres avantages...', lastUpdated: '2026-02-01' },
    { id: 'h4', title: 'Procédure d\'arrêt maladie', category: 'Santé', excerpt: 'Démarches à suivre en cas d\'arrêt maladie, certificats requis et délais...', lastUpdated: '2026-01-22' },
  ],
  technical: [
    { id: 't1', title: 'Guide système de réservation AMADEUS', category: 'Systèmes', excerpt: 'Manuel d\'utilisation du système de réservation, commandes fréquentes et dépannage...', lastUpdated: '2026-01-30' },
    { id: 't2', title: 'Application mobile équipage', category: 'Applications', excerpt: 'Fonctionnalités de l\'app équipage: planning, briefings, check-in...', lastUpdated: '2026-01-25' },
    { id: 't3', title: 'Wifi et systèmes bord', category: 'Avionique', excerpt: 'Configuration et dépannage des systèmes de divertissement et wifi passagers...', lastUpdated: '2026-01-15' },
  ],
  operations: [
    { id: 'o1', title: 'Briefing pré-vol standard', category: 'Vol', excerpt: 'Checklist et points à aborder lors du briefing équipage avant chaque vol...', lastUpdated: '2026-02-01' },
    { id: 'o2', title: 'Gestion des turbulences', category: 'Sécurité', excerpt: 'Procédures de sécurisation cabine et communication passagers en cas de turbulences...', lastUpdated: '2026-01-20' },
    { id: 'o3', title: 'Service repas long-courrier', category: 'Service', excerpt: 'Planning et standards de service pour les vols long-courriers vers Paris, Tokyo, LA...', lastUpdated: '2026-01-28' },
    { id: 'o4', title: 'Protocole sanitaire COVID', category: 'Santé', excerpt: 'Mesures sanitaires actualisées pour la protection des équipages et passagers...', lastUpdated: '2026-01-05' },
  ],
}

// Réponses TALIA par catégorie
const taliaResponses: Record<string, { keywords: string[], response: string }[]> = {
  procedures: [
    { keywords: ['embarquement', 'boarding', 'passager'], response: 'Pour l\'embarquement standard:\n\n1. **Vérification documents** - Passeport, visa si nécessaire, carte d\'embarquement\n2. **Contrôle bagages cabine** - Max 10kg, dimensions 55x35x25cm\n3. **Priorité d\'embarquement** - Business, familles, PMR, puis par zone\n4. **Placement** - Guidez les passagers vers leur siège, aidez au rangement des bagages\n\n📋 Consultez le manuel complet dans la base de connaissances.' },
    { keywords: ['bagage', 'valise', 'soute'], response: 'Pour les bagages spéciaux:\n\n• **Équipements sportifs** - Surf, vélo: soute uniquement, déclaration préalable\n• **Instruments de musique** - Petit: cabine si place. Grand: siège supplémentaire ou soute\n• **Objets fragiles** - Étiquette FRAGILE, manipulation délicate\n\n⚠️ Poids max soute: 23kg éco, 32kg business\n\nBesoin du formulaire de déclaration spéciale?' },
    { keywords: ['urgence', 'évacuation', 'sécurité'], response: '🚨 **Procédure d\'évacuation d\'urgence**\n\n1. Restez calme, suivez les instructions du CCP\n2. Dirigez les passagers vers les issues les plus proches\n3. Commande: "Détachez vos ceintures, laissez tout, dirigez-vous vers la sortie"\n4. Vérifiez les toilettes et compartiments\n5. Signalez "Cabine évacuée" au CCP\n\n⏱️ Objectif: évacuation complète en 90 secondes' },
  ],
  hr: [
    { keywords: ['congé', 'vacances', 'rtt', 'repos'], response: '📅 **Politique de congés ATN**\n\n• **Congés payés**: 25 jours/an (acquisition 2.08j/mois)\n• **RTT PNC**: 12 jours/an\n• **Demande**: Via l\'app RH, 30 jours à l\'avance min.\n• **Validation**: Chef de cabine sous 7 jours\n\n💡 Astuce: Les périodes creuses (fév-mars, oct-nov) ont plus de chances d\'approbation.\n\nVoulez-vous que je vous aide à poser une demande?' },
    { keywords: ['formation', 'recyclage', 'certification'], response: '📚 **Formations obligatoires PNC**\n\n• **Recyclage sécurité**: Annuel (2 jours)\n• **Formation secourisme**: Tous les 2 ans\n• **Formation service**: Selon affectation\n\n🗓️ Prochaines sessions:\n- Recyclage sécurité: 15-16 février\n- Secourisme avancé: 22 février\n\nInscription via le portail RH ou contactez formation@airtahitinui.pf' },
    { keywords: ['maladie', 'arrêt', 'médecin'], response: '🏥 **Procédure arrêt maladie**\n\n1. **Prévenir** le planning sous 1h (appel + SMS)\n2. **Certificat médical** à envoyer sous 48h\n3. **Adresse**: rh.medical@airtahitinui.pf\n\n📞 Contact planning: +689 40 86 42 42\n\n⚠️ Important: Ne pas reprendre le vol sans certificat de reprise si arrêt > 7 jours' },
    { keywords: ['avantage', 'billet', 'réduction', 'staff'], response: '✈️ **Avantages employés ATN**\n\n• **Billets staff**: 90% réduction (selon dispo)\n• **Famille**: Conjoint + 2 enfants: 75% réduction\n• **Partenaires**: 30% hôtels partenaires (Intercontinental, Hilton...)\n• **Duty free**: -20% boutiques aéroport\n\n📱 Réservation via l\'app "ATN Staff Travel"\n\nVoulez-vous la liste des hôtels partenaires?' },
  ],
  technical: [
    { keywords: ['amadeus', 'réservation', 'système', 'pnr'], response: '💻 **Commandes AMADEUS fréquentes**\n\n• `RT[PNR]` - Afficher réservation\n• `MD` - Page suivante\n• `DA` - Afficher disponibilité\n• `SS[nb]Y[date]` - Vendre segment\n\n🔧 Problème de connexion?\n1. Vérifiez le VPN\n2. Redémarrez le terminal\n3. Support IT: poste 4242\n\nBesoin d\'aide sur une commande spécifique?' },
    { keywords: ['wifi', 'divertissement', 'écran', 'ife'], response: '📺 **Système IFE (In-Flight Entertainment)**\n\n**Dépannage passager:**\n1. Reset écran: bouton sous l\'accoudoir 5 sec\n2. Changement casque si audio défaillant\n3. Reboot individuel via tablette équipage\n\n**Wifi Onboard:**\n- Business: inclus, code sur carte d\'embarquement\n- Économie: 10€/vol ou 30€/mois\n\n🛠️ Problème général? Contactez le chef de cabine pour reboot système.' },
    { keywords: ['app', 'application', 'mobile', 'crew'], response: '📱 **Application Crew ATN**\n\n**Fonctionnalités:**\n• Planning & rotations\n• Briefings pré-vol\n• Check-in équipage\n• Demandes de swap\n\n**Problème fréquent:** App qui ne se synchronise pas\n→ Déconnexion/Reconnexion + Pull-to-refresh\n\n📲 Dernière version: 4.2.1\nMise à jour obligatoire avant le 15 février' },
  ],
  operations: [
    { keywords: ['briefing', 'pré-vol', 'réunion'], response: '📋 **Checklist Briefing Pré-vol**\n\n1. ✅ Présentation équipage & rôles\n2. ✅ Particularités vol (météo, durée, VIP)\n3. ✅ Points sécurité du jour\n4. ✅ Service & timing repas\n5. ✅ Questions équipage\n\n⏱️ Timing: 45 min avant embarquement\n📍 Lieu: Salle briefing Terminal B\n\nBesoin du template de briefing?' },
    { keywords: ['turbulence', 'attachez', 'ceinture'], response: '⚠️ **Procédure Turbulences**\n\n**Niveau 1 - Légères:**\n- Annonce: "Nous traversons une zone de turbulences légères"\n- Service maintenu avec précaution\n\n**Niveau 2 - Modérées:**\n- Suspendre le service\n- Sécuriser galleys\n- Annonce: "Veuillez regagner vos sièges"\n\n**Niveau 3 - Sévères:**\n- Équipage assis immédiatement\n- Passagers position de sécurité si nécessaire\n\n🎤 Phrases standards dans le manuel PA' },
    { keywords: ['repas', 'service', 'menu', 'plateau'], response: '🍽️ **Service Repas Long-Courrier**\n\n**PPT-CDG (12h):**\n- H+1: Premier service (choix 2 plats)\n- H+8: Deuxième service léger\n\n**Timing Business:**\n- Service à la carte\n- Champagne après décollage\n- Menu dégustation 4 services\n\n📊 Commandes spéciales (VGML, KSML...): vérifiez le manifeste 30 min avant service\n\nVoulez-vous les menus du mois?' },
  ],
}

// Générer une réponse TALIA
function generateTaliaResponse(question: string, category?: string): { response: string, category: 'procedures' | 'hr' | 'technical' | 'operations' } {
  const questionLower = question.toLowerCase()

  // Chercher dans toutes les catégories ou une spécifique
  const categoriesToSearch = category ? [category] : Object.keys(taliaResponses)

  for (const cat of categoriesToSearch) {
    const responses = taliaResponses[cat as keyof typeof taliaResponses]
    if (responses) {
      for (const item of responses) {
        if (item.keywords.some(kw => questionLower.includes(kw))) {
          return { response: item.response, category: cat as any }
        }
      }
    }
  }

  // Réponse par défaut
  return {
    response: `Merci pour votre question ! 🌺\n\nJe n'ai pas trouvé d'information précise sur "${question}" dans ma base de connaissances.\n\n**Suggestions:**\n• Reformulez avec des mots-clés plus spécifiques\n• Consultez la base de connaissances ci-dessous\n• Contactez votre responsable direct\n\n📧 Support RH: rh@airtahitinui.pf\n📞 Support Ops: +689 40 86 42 00`,
    category: 'procedures'
  }
}

// Mock data pour l'historique initial
const initialMockQueries: StaffQuery[] = [
  {
    id: 'mock1',
    employee: { name: 'Marie Tetuanui', department: 'PNC', role: 'Chef de Cabine' },
    query: 'Quelle est la procédure pour les passagers à mobilité réduite?',
    response: '♿ **Assistance PMR**\n\n1. Pré-embarquement obligatoire (20 min avant)\n2. Fauteuil roulant disponible à la porte\n3. Placement: rangées proches issues de secours interdites\n4. Briefing sécurité individuel\n\nContact assistance: poste 3333',
    category: 'procedures',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    helpful: true
  },
  {
    id: 'mock2',
    employee: { name: 'Teva Pereyre', department: 'Ground Ops', role: 'Agent Escale' },
    query: 'Comment faire une demande de congés pour juillet?',
    response: '📅 Pour les congés d\'été:\n\n1. App RH > Congés > Nouvelle demande\n2. Sélectionnez vos dates\n3. ⚠️ Période haute: demande avant le 1er avril\n4. Validation sous 14 jours\n\nQuota été: max 2 semaines consécutives sauf exception.',
    category: 'hr',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    helpful: true
  },
  {
    id: 'mock3',
    employee: { name: 'Hinano Raapoto', department: 'PNC', role: 'Hôtesse' },
    query: 'Le système IFE ne fonctionne plus sur le siège 24A',
    response: '📺 **Dépannage IFE siège individuel:**\n\n1. Reset: bouton sous l\'accoudoir (5 sec)\n2. Si échec: proposer changement de siège\n3. Si complet: offrir compensation (bon duty-free)\n\n🛠️ Signaler en fin de vol via l\'app maintenance.',
    category: 'technical',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    helpful: null
  },
]

function QueryCard({ query, onFeedback }: { query: StaffQuery, onFeedback: (id: string, helpful: boolean) => void }) {
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
    <div className="card animate-fadeIn">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
            <UserCog className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-sm">{query.employee.name}</p>
            <p className="text-xs text-slate-500">{query.employee.department} • {query.employee.role}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[query.category]}`}>
          {categoryLabels[query.category]}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-slate-800 mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          {query.query}
        </p>
        <div className="p-4 bg-gradient-to-br from-slate-50 to-cyan-50/30 rounded-xl border border-slate-100">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs font-medium text-cyan-600">Réponse TALIA</span>
          </div>
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{query.response}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {new Date(query.timestamp).toLocaleString('fr-FR')}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Cette réponse était-elle utile ?</span>
          <button
            onClick={() => onFeedback(query.id, true)}
            className={`p-1.5 rounded-lg transition-all ${query.helpful === true ? 'bg-emerald-100 text-emerald-600 scale-110' : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-500'}`}
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => onFeedback(query.id, false)}
            className={`p-1.5 rounded-lg transition-all ${query.helpful === false ? 'bg-red-100 text-red-600 scale-110' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'}`}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Modal Base de Connaissances
function KnowledgeModal({
  category,
  documents,
  onClose
}: {
  category: string
  documents: KnowledgeDocument[]
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const categoryTitles: Record<string, string> = {
    procedures: 'Manuel des procédures',
    hr: 'FAQ RH',
    technical: 'Documentation technique',
    operations: 'Réglementations',
  }

  const categoryIcons: Record<string, any> = {
    procedures: FileText,
    hr: Users,
    technical: Settings,
    operations: Shield,
  }

  const Icon = categoryIcons[category] || FileText

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!mounted) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
      style={{ margin: 0, marginLeft: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{categoryTitles[category]}</h2>
                <p className="text-cyan-100 text-sm">{documents.length} documents disponibles</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-200" />
            <input
              type="text"
              placeholder="Rechercher dans les documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full">
                        {doc.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        Mis à jour le {new Date(doc.lastUpdated).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-800 mb-1 group-hover:text-cyan-600 transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{doc.excerpt}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Aucun document trouvé pour "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default function StaffAssistantPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [newQuestion, setNewQuestion] = useState('')
  const [queries, setQueries] = useState<StaffQuery[]>([])
  const [loading, setLoading] = useState(true)
  const [isAsking, setIsAsking] = useState(false)
  const [knowledgeModal, setKnowledgeModal] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchStaffRequests() {
      try {
        const res = await fetch('/api/airtable?table=Staff_Requests&view=Grid%20view')
        if (res.ok) {
          const data = await res.json()
          const mapped: StaffQuery[] = data.records.map((r: any) => ({
            id: r.id,
            employee: {
              name: r.fields.Employee_Name || 'Employé',
              department: r.fields.Department || 'N/A',
              role: r.fields.Employee_ID || '',
            },
            query: r.fields.Question || '',
            response: r.fields.Response || '',
            category: categoryMapping[r.fields.Category] || 'procedures',
            timestamp: r.fields.Date || new Date().toISOString(),
            helpful: r.fields.Status === 'answered' ? true : null,
          }))
          // Si pas de données Airtable, utiliser les données mock
          setQueries(mapped.length > 0 ? mapped : initialMockQueries)
        } else {
          // Fallback aux données mock
          setQueries(initialMockQueries)
        }
      } catch (err) {
        console.error('Error fetching staff requests:', err)
        // Fallback aux données mock
        setQueries(initialMockQueries)
      } finally {
        setLoading(false)
      }
    }
    fetchStaffRequests()
  }, [])

  // Poser une question à TALIA
  const handleAskQuestion = async (question?: string) => {
    const q = question || newQuestion.trim()
    if (!q) return

    setIsAsking(true)
    setNewQuestion('')

    // Simuler un délai de réponse IA
    await new Promise(r => setTimeout(r, 1500))

    const { response, category } = generateTaliaResponse(q)

    const newQuery: StaffQuery = {
      id: `q-${Date.now()}`,
      employee: {
        name: 'Vous',
        department: 'Staff ATN',
        role: 'Utilisateur',
      },
      query: q,
      response,
      category,
      timestamp: new Date().toISOString(),
      helpful: null,
    }

    setQueries(prev => [newQuery, ...prev])
    setIsAsking(false)
  }

  // Feedback utile/pas utile
  const handleFeedback = (id: string, helpful: boolean) => {
    setQueries(prev => prev.map(q =>
      q.id === id ? { ...q, helpful } : q
    ))
  }

  // Suggestions rapides
  const quickSuggestions = [
    { label: 'Procédures embarquement', question: 'Quelle est la procédure d\'embarquement standard des passagers?' },
    { label: 'Demande de congés', question: 'Comment faire une demande de congés?' },
    { label: 'Problème système IFE', question: 'Le système IFE ne fonctionne pas, que faire?' },
    { label: 'Briefing pré-vol', question: 'Quels sont les points du briefing pré-vol?' },
  ]

  const filteredQueries = queries.filter(q => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false
    if (searchQuery && !q.query.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const stats = {
    total: queries.length,
    helpful: queries.filter(q => q.helpful === true).length,
    procedures: queries.filter(q => q.category === 'procedures').length,
    avgResponseTime: '< 5s',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-guide="staff-kpi-total" className="card">
          <p className="text-sm text-slate-500">Questions traitées</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div data-guide="staff-kpi-helpful" className="card">
          <p className="text-sm text-slate-500">Réponses utiles</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.helpful}</p>
        </div>
        <div data-guide="staff-kpi-procedures" className="card">
          <p className="text-sm text-slate-500">Procédures consultées</p>
          <p className="text-2xl font-bold text-blue-600">{stats.procedures}</p>
        </div>
        <div data-guide="staff-kpi-responsetime" className="card">
          <p className="text-sm text-slate-500">Temps de réponse</p>
          <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
        </div>
      </div>

      {/* Nouvelle question */}
      <div data-guide="staff-question-section" className="card bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 border-cyan-200">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span>Poser une question à TALIA</span>
        </h2>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Exemple: Quelle est la procédure pour..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white shadow-sm"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
            disabled={isAsking}
          />
          <button
            onClick={() => handleAskQuestion()}
            disabled={isAsking || !newQuestion.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium flex items-center gap-2 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
          >
            {isAsking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Demander
              </>
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {quickSuggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleAskQuestion(s.question)}
              disabled={isAsking}
              className="px-4 py-2 bg-white rounded-full text-xs text-slate-600 hover:bg-cyan-100 hover:text-cyan-700 border border-slate-200 hover:border-cyan-300 transition-all disabled:opacity-50 shadow-sm"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtres et recherche */}
      <div data-guide="staff-filters" className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              selectedCategory === 'all' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            <HelpCircle className="w-4 h-4" />
            Toutes
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              selectedCategory === 'procedures' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setSelectedCategory('procedures')}
          >
            <FileText className="w-4 h-4" />
            Procédures
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              selectedCategory === 'hr' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setSelectedCategory('hr')}
          >
            <UserCog className="w-4 h-4" />
            RH
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              selectedCategory === 'technical' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setSelectedCategory('technical')}
          >
            <Settings className="w-4 h-4" />
            Technique
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              selectedCategory === 'operations' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setSelectedCategory('operations')}
          >
            <Clock className="w-4 h-4" />
            Opérations
          </button>
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
      <div data-guide="staff-history-list" className="space-y-4">
        {filteredQueries.length > 0 ? (
          filteredQueries.map(query => (
            <QueryCard key={query.id} query={query} onFeedback={handleFeedback} />
          ))
        ) : (
          <div className="card text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">Aucune question trouvée</p>
            <p className="text-sm text-slate-400">Posez votre première question à TALIA ci-dessus</p>
          </div>
        )}
      </div>

      {/* Base de connaissances */}
      <div data-guide="staff-knowledge-section" className="card">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Book className="w-5 h-5 text-cyan-600" />
          Base de connaissances
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setKnowledgeModal('procedures')}
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 text-left border border-blue-200 transition-all group"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <p className="font-medium text-sm text-blue-900">Manuel des procédures</p>
            <p className="text-xs text-blue-600">{knowledgeBase.procedures.length} documents</p>
          </button>
          <button
            onClick={() => setKnowledgeModal('hr')}
            className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 text-left border border-purple-200 transition-all group"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="font-medium text-sm text-purple-900">FAQ RH</p>
            <p className="text-xs text-purple-600">{knowledgeBase.hr.length} documents</p>
          </button>
          <button
            onClick={() => setKnowledgeModal('technical')}
            className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-amber-200 text-left border border-amber-200 transition-all group"
          >
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <p className="font-medium text-sm text-amber-900">Documentation technique</p>
            <p className="text-xs text-amber-600">{knowledgeBase.technical.length} documents</p>
          </button>
          <button
            onClick={() => setKnowledgeModal('operations')}
            className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 text-left border border-emerald-200 transition-all group"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <p className="font-medium text-sm text-emerald-900">Réglementations</p>
            <p className="text-xs text-emerald-600">{knowledgeBase.operations.length} documents</p>
          </button>
        </div>
      </div>

      {/* Modal Base de Connaissances */}
      {knowledgeModal && (
        <KnowledgeModal
          category={knowledgeModal}
          documents={knowledgeBase[knowledgeModal] || []}
          onClose={() => setKnowledgeModal(null)}
        />
      )}
    </div>
  )
}
