'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  MessageSquare,
  Mail,
  FileText,
  Star,
  BarChart3,
  Brain,
  Users,
  Plane,
  Calendar,
  Target,
  TrendingUp,
  Zap,
  Settings,
  Sparkles,
  Image as ImageIcon,
  Route,
  CreditCard,
  Headphones,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  LayoutDashboard,
  ExternalLink,
  HelpCircle,
  Lightbulb,
} from 'lucide-react'

interface InteractiveGuideProps {
  isOpen: boolean
  onComplete: () => void
}

// Types pour les etapes du guide
interface GuideStep {
  id: string
  type: 'welcome' | 'sidebar-group' | 'sidebar-item' | 'page-section' | 'summary' | 'chatbot'
  title: string
  subtitle?: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  color?: string
  // Pour sidebar-item
  sidebarSelector?: string
  href?: string
  roi?: string
  roiDetail?: string
  salesArgs?: string[]
  badge?: string
  // Pour page-section
  pageSelector?: string
  pageSectionTitle?: string
  // Pour summary
  stats?: { label: string; value: string; color: string }[]
}

// Configuration complete du guide
const guideSteps: GuideStep[] = [
  // === WELCOME ===
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Bienvenue dans votre Dashboard IA',
    subtitle: 'Air Tahiti Nui x PACIFIK\'AI',
    description: 'Ce guide interactif vous presente toutes les fonctionnalites de votre dashboard. Chaque agent IA travaille pour vous 24h/24, automatisant votre marketing et votre relation client.',
    icon: Sparkles,
    color: 'from-[--atn-primary] to-[--atn-secondary]',
  },

  // === ACCUEIL ===
  {
    id: 'sidebar-dashboard',
    type: 'sidebar-item',
    title: 'Dashboard',
    subtitle: 'Vue d\'ensemble',
    description: 'Votre tableau de bord central. Visualisez en un coup d\'oeil toutes vos metriques IA: conversations du chatbot, newsletters envoyees, alertes concurrence, et plus encore.',
    icon: LayoutDashboard,
    sidebarSelector: '[href="/"]',
    href: '/',
    roi: '+35% productivite',
    roiDetail: 'Toutes vos donnees centralisees',
    salesArgs: ['KPIs temps reel', 'Alertes prioritaires', 'Actions rapides'],
    color: 'from-slate-500 to-slate-600',
  },
  {
    id: 'sidebar-demo',
    type: 'sidebar-item',
    title: 'Demo Site',
    subtitle: 'Testez le chatbot en action',
    description: 'Un site de demonstration Air Tahiti Nui avec le chatbot Tiare integre. Testez vous-meme l\'experience client: posez des questions sur les vols, les bagages, les destinations...',
    icon: Play,
    sidebarSelector: '[href="/demo-site"]',
    href: '/demo-site',
    roi: 'Experience live',
    roiDetail: 'Montrez a vos equipes',
    salesArgs: ['Chatbot fonctionnel', 'Newsletter avec centres d\'interet', 'Design ATN authentique'],
    badge: 'TESTER',
    color: 'from-[--atn-primary] to-[--atn-secondary]',
  },

  // === AGENTS IA ===
  {
    id: 'sidebar-group-agents',
    type: 'sidebar-group',
    title: 'Agents IA',
    subtitle: 'Vos assistants virtuels 24/7',
    description: 'Ces 3 agents IA communiquent avec vos clients et vos employes en temps reel, dans leur langue, sans intervention humaine. Ils apprennent et s\'ameliorent continuellement.',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'sidebar-chatbot',
    type: 'sidebar-item',
    title: 'Chatbot Tiare',
    subtitle: 'Conversations clients automatisees',
    description: 'L\'agent Tiare repond aux questions clients 24h/24 en francais, anglais et japonais. Il detecte automatiquement la langue et peut escalader vers un humain si necessaire.',
    icon: MessageSquare,
    sidebarSelector: '[href="/conversations"]',
    href: '/conversations',
    roi: '40h/mois economisees',
    roiDetail: 'Equivalent 1 employe temps partiel',
    salesArgs: ['Reponse instantanee', 'Multilingue natif', 'Escalade intelligente'],
    badge: 'LIVE',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'sidebar-concierge',
    type: 'sidebar-item',
    title: 'Concierge Pro',
    subtitle: 'Support premium VIP',
    description: 'Support personnalise pour vos clients premium et groupes. L\'agent memorise les preferences et propose des recommandations d\'hotels, activites et surclassements adaptes.',
    icon: Headphones,
    sidebarSelector: '[href="/concierge-pro"]',
    href: '/concierge-pro',
    roi: '+45% satisfaction',
    roiDetail: 'NPS ameliore de 15 points',
    salesArgs: ['Memoire des preferences', 'Upsell intelligent', 'Experience premium'],
    color: 'from-cyan-500 to-teal-500',
  },
  {
    id: 'sidebar-staff',
    type: 'sidebar-item',
    title: 'Staff Assistant',
    subtitle: 'Aide aux employes',
    description: 'Une base de connaissances interrogeable en langage naturel pour vos employes. Procedures, tarifs, politiques bagages... tout est accessible instantanement.',
    icon: Users,
    sidebarSelector: '[href="/staff-assistant"]',
    href: '/staff-assistant',
    roi: '-30% temps formation',
    roiDetail: 'Nouveaux employes operationnels en 1 semaine',
    salesArgs: ['Onboarding accelere', 'Coherence des reponses', 'MAJ automatique'],
    color: 'from-teal-500 to-green-500',
  },

  // === MARKETING AUTOMATISE ===
  {
    id: 'sidebar-group-marketing',
    type: 'sidebar-group',
    title: 'Marketing Automatise',
    subtitle: 'Contenu genere et diffuse sans effort',
    description: 'L\'IA cree et publie votre contenu marketing automatiquement: newsletters personnalisees, articles de blog SEO, posts reseaux sociaux, visuels...',
    icon: Mail,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'sidebar-newsletters',
    type: 'sidebar-item',
    title: 'Newsletters',
    subtitle: 'Campagnes email automatisees',
    description: 'Newsletters hebdomadaires generees automatiquement et personnalisees par segment (plongee, lune de miel, famille, business). Envoi au meilleur moment grace a l\'IA predictive.',
    icon: Mail,
    sidebarSelector: '[href="/newsletters"]',
    href: '/newsletters',
    roi: '+25% taux ouverture',
    roiDetail: 'vs moyenne industrie 15%',
    salesArgs: ['Segmentation auto', 'A/B testing sujets', 'Timing optimal'],
    badge: 'LIVE',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'sidebar-content',
    type: 'sidebar-item',
    title: 'Contenu SEO',
    subtitle: 'Articles de blog automatiques',
    description: '4 articles de blog par semaine generes automatiquement, optimises SEO avec mots-cles, meta-descriptions et images. Destinations, conseils voyage, actualites...',
    icon: FileText,
    sidebarSelector: '[href="/content"]',
    href: '/content',
    roi: '+40% trafic organique',
    roiDetail: 'En 6 mois',
    salesArgs: ['4 articles/semaine', 'Optimisation SEO auto', 'Images incluses'],
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'sidebar-social',
    type: 'sidebar-item',
    title: 'Social Media',
    subtitle: 'Posts automatiques multi-plateformes',
    description: 'Posts Instagram, Facebook et LinkedIn generes et programmes automatiquement. Calendrier editorial gere par l\'IA avec visuels et hashtags optimises.',
    icon: Sparkles,
    sidebarSelector: '[href="/social"]',
    href: '/social',
    roi: '+50% engagement',
    roiDetail: 'Likes, commentaires, partages',
    salesArgs: ['Calendrier auto', 'Visuels IA', 'Hashtags optimises'],
    color: 'from-rose-500 to-orange-500',
  },
  {
    id: 'sidebar-visual',
    type: 'sidebar-item',
    title: 'Visual Factory',
    subtitle: 'Creation de visuels IA',
    description: 'Bannieres, stories, visuels marketing crees automatiquement aux couleurs Air Tahiti Nui. Multi-formats pour tous vos canaux.',
    icon: ImageIcon,
    sidebarSelector: '[href="/visual-factory"]',
    href: '/visual-factory',
    roi: '10h/mois economisees',
    roiDetail: 'Plus besoin de graphiste quotidien',
    salesArgs: ['Templates ATN', 'Multi-formats', 'Banque images integree'],
    color: 'from-orange-500 to-amber-500',
  },

  // === INTELLIGENCE ===
  {
    id: 'sidebar-group-intelligence',
    type: 'sidebar-group',
    title: 'Intelligence & Veille',
    subtitle: 'Surveillance automatique du marche',
    description: 'L\'IA surveille vos concurrents et votre e-reputation 24/7. Alertes en temps reel, analyse des sentiments, qualification des leads.',
    icon: Brain,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'sidebar-competitors',
    type: 'sidebar-item',
    title: 'Veille Concurrence',
    subtitle: 'Alertes prix et promotions',
    description: 'Monitoring temps reel des prix et promotions de French Bee, Air France, United, Qantas... Alertes instantanees pour reagir rapidement.',
    icon: Brain,
    sidebarSelector: '[href="/competitors"]',
    href: '/competitors',
    roi: 'Reagir en 24h',
    roiDetail: 'vs plusieurs jours manuellement',
    salesArgs: ['Monitoring 24/7', 'Alertes par route', 'Historique tendances'],
    badge: 'LIVE',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'sidebar-reviews',
    type: 'sidebar-item',
    title: 'Gestion Avis',
    subtitle: 'Reponses automatiques aux avis',
    description: 'Reponses personnalisees aux avis Google, TripAdvisor et Trustpilot generees automatiquement. Ton adapte selon le sentiment (negatif = empathique).',
    icon: Star,
    sidebarSelector: '[href="/reviews"]',
    href: '/reviews',
    roi: '+0.5 etoile moyenne',
    roiDetail: 'Sur 6 mois',
    salesArgs: ['Reponse en 2h', 'Ton adapte', 'Moderation pre-publication'],
    color: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'sidebar-review-intel',
    type: 'sidebar-item',
    title: 'Review Intelligence',
    subtitle: 'Analyse des sentiments',
    description: 'Detection des tendances et problemes recurrents dans les avis. Dashboard temps reel des sentiments avec benchmark concurrentiel.',
    icon: TrendingUp,
    sidebarSelector: '[href="/review-intelligence"]',
    href: '/review-intelligence',
    roi: 'Detecter problemes',
    roiDetail: 'Avant qu\'ils deviennent critiques',
    salesArgs: ['Sentiments temps reel', 'Alertes problemes', 'Benchmark'],
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'sidebar-lead-scoring',
    type: 'sidebar-item',
    title: 'Lead Scoring',
    subtitle: 'Qualification automatique',
    description: 'Score 0-100 attribue automatiquement a chaque prospect selon son comportement. Priorisez vos efforts sur les leads les plus chauds.',
    icon: Target,
    sidebarSelector: '[href="/lead-scoring"]',
    href: '/lead-scoring',
    roi: '+30% conversion',
    roiDetail: 'En priorisant les bons leads',
    salesArgs: ['Score automatique', 'Declencheurs actions', 'Integration CRM'],
    color: 'from-red-500 to-rose-500',
  },

  // === OPERATIONS ===
  {
    id: 'sidebar-group-operations',
    type: 'sidebar-group',
    title: 'Operations & Suivi',
    subtitle: 'Gestion operationnelle centralisee',
    description: 'Vols, reservations, planning editorial, parcours client... tout est centralise et automatise pour une vision 360 de vos operations.',
    icon: Plane,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'sidebar-flights',
    type: 'sidebar-item',
    title: 'Vols',
    subtitle: 'Monitoring temps reel',
    description: 'Suivi de tous vos vols en temps reel. Alertes automatiques retards, annulations, changements de porte. Notifications proactives aux passagers.',
    icon: Plane,
    sidebarSelector: '[href="/flights"]',
    href: '/flights',
    roi: 'Alertes temps reel',
    roiDetail: 'Proactivite client',
    salesArgs: ['Integration donnees vol', 'Notifications auto', 'Gestion perturbations'],
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'sidebar-bookings',
    type: 'sidebar-item',
    title: 'Reservations',
    subtitle: 'Suivi et upsell intelligent',
    description: 'Vue consolidee des reservations avec suggestions d\'upsell personnalisees au bon moment: surclassements, bagages supplementaires, hotels partenaires.',
    icon: CreditCard,
    sidebarSelector: '[href="/bookings"]',
    href: '/bookings',
    roi: '+15% upsell',
    roiDetail: 'Revenus additionnels',
    salesArgs: ['Recommandations contextuelles', 'Timing optimal', 'Tracking conversion'],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'sidebar-calendar',
    type: 'sidebar-item',
    title: 'Calendrier',
    subtitle: 'Planning editorial automatise',
    description: 'Visualisez toutes vos publications programmees: newsletters, posts sociaux, articles blog. Vue mensuelle et hebdomadaire avec drag & drop.',
    icon: Calendar,
    sidebarSelector: '[href="/calendar"]',
    href: '/calendar',
    roi: 'Organisation auto',
    roiDetail: 'Zero charge mentale',
    salesArgs: ['Vue mensuelle/hebdo', 'Drag & drop', 'Sync multi-canaux'],
    color: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'sidebar-journeys',
    type: 'sidebar-item',
    title: 'Parcours Client',
    subtitle: 'Customer journeys automatises',
    description: 'Visualisez et automatisez le parcours de chaque client: decouverte, consideration, reservation, pre-voyage, voyage, post-voyage.',
    icon: Route,
    sidebarSelector: '[href="/journeys"]',
    href: '/journeys',
    roi: '+20% retention',
    roiDetail: 'Clients qui revoyagent',
    salesArgs: ['Touchpoints automatises', 'Relances personnalisees', 'Programme fidelite'],
    color: 'from-cyan-500 to-blue-500',
  },

  // === ANALYTICS ===
  {
    id: 'sidebar-group-analytics',
    type: 'sidebar-group',
    title: 'Analytics & Rapports',
    subtitle: 'Mesurez votre ROI en temps reel',
    description: 'Chaque action IA est mesuree. Rapports automatiques, attribution des ventes, A/B tests continus. Justifiez votre investissement avec des chiffres concrets.',
    icon: BarChart3,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'sidebar-reports',
    type: 'sidebar-item',
    title: 'Rapports',
    subtitle: 'KPIs automatiques chaque lundi',
    description: 'Rapports PDF complets envoyes automatiquement chaque lundi matin. Tous vos KPIs, comparaisons semaine/mois, et recommandations IA incluses.',
    icon: BarChart3,
    sidebarSelector: '[href="/reports"]',
    href: '/reports',
    roi: 'Chaque lundi matin',
    roiDetail: 'Sans rien faire',
    salesArgs: ['KPIs personnalises', 'Comparaisons temporelles', 'Recommandations IA'],
    badge: 'LIVE',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'sidebar-attribution',
    type: 'sidebar-item',
    title: 'Attribution',
    subtitle: 'Source de vos ventes',
    description: 'Identifiez quels canaux generent vraiment vos ventes: SEO, publicites, newsletter, reseaux sociaux. Optimisez vos budgets marketing.',
    icon: Zap,
    sidebarSelector: '[href="/attribution"]',
    href: '/attribution',
    roi: 'ROI par canal',
    roiDetail: 'Optimisez vos budgets',
    salesArgs: ['Multi-touch attribution', 'Valeur par source', 'Recommandations budget'],
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'sidebar-abtests',
    type: 'sidebar-item',
    title: 'A/B Tests',
    subtitle: 'Optimisation continue',
    description: 'L\'IA teste automatiquement differentes versions de vos contenus (sujets, visuels, CTA) et selectionne les gagnants.',
    icon: Target,
    sidebarSelector: '[href="/ab-tests"]',
    href: '/ab-tests',
    roi: '+15% conversion',
    roiDetail: 'Amelioration continue',
    salesArgs: ['Tests automatiques', 'Significance statistique', 'Auto-selection gagnant'],
    color: 'from-purple-500 to-fuchsia-500',
  },
  {
    id: 'sidebar-roi',
    type: 'sidebar-item',
    title: 'ROI Dashboard',
    subtitle: 'Retour sur investissement global',
    description: 'Vue consolidee du ROI de chaque fonctionnalite IA. Economies en XPF, temps economise, revenus generes. Justifiez l\'investissement.',
    icon: TrendingUp,
    sidebarSelector: '[href="/roi"]',
    href: '/roi',
    roi: 'Vue globale',
    roiDetail: 'Justifiez l\'investissement',
    salesArgs: ['Economies XPF', 'Temps economise', 'Revenus generes'],
    color: 'from-fuchsia-500 to-pink-500',
  },

  // === CONFIGURATION ===
  {
    id: 'sidebar-group-config',
    type: 'sidebar-group',
    title: 'Configuration',
    subtitle: 'Personnalisez votre experience',
    description: 'Configurez les agents IA selon vos besoins: ton, langue, regles metier. Acces au guide et aux parametres avances.',
    icon: Settings,
    color: 'from-gray-500 to-slate-500',
  },
  {
    id: 'sidebar-upsell',
    type: 'sidebar-item',
    title: 'Upsell Engine',
    subtitle: 'Moteur de recommandations',
    description: 'Configurez les regles de recommandations: quand proposer un surclassement, quels hotels suggerer, quelles activites recommander.',
    icon: Sparkles,
    sidebarSelector: '[href="/upsell"]',
    href: '/upsell',
    roi: '+25% panier moyen',
    roiDetail: 'Revenus additionnels',
    salesArgs: ['Regles personnalisables', 'Timing intelligent', 'A/B testing integre'],
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'sidebar-preferences',
    type: 'sidebar-item',
    title: 'Preferences',
    subtitle: 'Personnalisation',
    description: 'Configurez vos preferences personnelles: theme sombre/clair, langue, notifications, raccourcis clavier et affichage du dashboard.',
    icon: Settings,
    sidebarSelector: '[href="/preferences"]',
    href: '/preferences',
    roi: 'Experience sur-mesure',
    roiDetail: 'Votre dashboard, votre style',
    salesArgs: ['Theme personnalisable', 'Notifications', 'Raccourcis'],
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'sidebar-pricing-monitor',
    type: 'sidebar-item',
    title: 'Prix Concurrents',
    subtitle: 'Monitoring tarifs',
    description: 'Suivez les prix de vos concurrents en temps reel. Comparez vos tarifs avec French Bee, Air France, United et recevez des alertes quand ils changent leurs prix.',
    icon: CreditCard,
    sidebarSelector: '[href="/pricing-monitor"]',
    href: '/pricing-monitor',
    roi: 'Reagir en temps reel',
    roiDetail: 'Ajustez vos prix rapidement',
    salesArgs: ['Monitoring automatique', 'Alertes prix', 'Historique tendances'],
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'sidebar-planner',
    type: 'sidebar-item',
    title: 'Planner',
    subtitle: 'Planification voyage',
    description: 'Outil de planification de voyage pour vos clients. Generez des itineraires personnalises avec hotels, activites et vols en quelques clics.',
    icon: Calendar,
    sidebarSelector: '[href="/planner"]',
    href: '/planner',
    roi: 'Itineraires auto',
    roiDetail: 'Gain de temps commercial',
    salesArgs: ['Itineraires personnalises', 'Hotels partenaires', 'Export PDF'],
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'sidebar-guide',
    type: 'sidebar-item',
    title: 'Guide',
    subtitle: 'Aide et documentation',
    description: 'Retrouvez ce guide a tout moment, ainsi que la documentation complete et les tarifs des fonctionnalites.',
    icon: HelpCircle,
    sidebarSelector: '[href="/guide"]',
    href: '/guide',
    roi: 'Support integre',
    roiDetail: 'Autonomie maximale',
    salesArgs: ['Documentation complete', 'Tutoriels video', 'FAQ dynamique'],
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'sidebar-settings',
    type: 'sidebar-item',
    title: 'Parametres',
    subtitle: 'Configuration avancee',
    description: 'Parametres avances: ton des agents, regles metier, integrations API, webhooks, export de donnees.',
    icon: Settings,
    sidebarSelector: '[href="/settings"]',
    href: '/settings',
    roi: 'Controle total',
    roiDetail: 'Personnalisation complete',
    salesArgs: ['Ton personnalisable', 'Regles metier', 'API & webhooks'],
    color: 'from-slate-500 to-gray-500',
  },

  // === ASSISTANT CHATBOT ===
  {
    id: 'chatbot-assistant',
    type: 'chatbot',
    title: 'Assistant ATN',
    subtitle: 'Votre copilote IA',
    description: 'Le chatbot en bas a droite est votre assistant personnel. Il peut generer des rapports, modifier vos newsletters, creer du contenu SEO, reprogrammer vos publications et ajuster les prompts de vos agents IA. Parlez-lui en francais, il comprend tout !',
    icon: MessageSquare,
    color: 'from-[--atn-primary] to-[--atn-secondary]',
  },

  // === SUMMARY ===
  {
    id: 'summary',
    type: 'summary',
    title: 'Votre ecosysteme IA est pret !',
    subtitle: 'Recapitulatif de ce que vous obtenez',
    description: 'Tous ces agents et outils travaillent ensemble, 24h/24, pour automatiser votre marketing et ameliorer votre relation client. Commencez par tester le chatbot sur le Demo Site !',
    icon: CheckCircle,
    color: 'from-[--atn-primary] to-[--atn-green]',
    stats: [
      { label: 'Agents IA actifs', value: '3', color: 'text-blue-500' },
      { label: 'Outils marketing', value: '4', color: 'text-purple-500' },
      { label: 'Heures economisees/mois', value: '40+', color: 'text-green-500' },
      { label: 'Valeur mensuelle', value: '200K XPF', color: 'text-[--atn-primary]' },
    ],
  },
]

export default function InteractiveGuide({ isOpen, onComplete }: InteractiveGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const router = useRouter()
  const pathname = usePathname()

  // Track window size for modal positioning (client-side only)
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const step = guideSteps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === guideSteps.length - 1
  const progress = ((currentStep + 1) / guideSteps.length) * 100

  // Highlight element in sidebar
  const updateHighlight = useCallback(() => {
    if (!step.sidebarSelector) {
      setHighlightRect(null)
      return
    }

    // Petit delai pour laisser le DOM se mettre a jour
    setTimeout(() => {
      const element = document.querySelector(step.sidebarSelector!)
      if (element) {
        // Scroller l'element dans la vue avant de calculer sa position
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })

        // Attendre que le scroll soit termine avant de calculer la position
        setTimeout(() => {
          const rect = element.getBoundingClientRect()
          setHighlightRect(rect)
        }, 300)
      } else {
        setHighlightRect(null)
      }
    }, 100)
  }, [step.sidebarSelector])

  // Bloquer le scroll de la sidebar pendant le guide
  useEffect(() => {
    if (isOpen) {
      const sidebarNav = document.querySelector('aside nav')
      if (sidebarNav) {
        (sidebarNav as HTMLElement).style.overflowY = 'hidden'
      }
      return () => {
        if (sidebarNav) {
          (sidebarNav as HTMLElement).style.overflowY = 'auto'
        }
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      updateHighlight()
      window.addEventListener('resize', updateHighlight)
      return () => window.removeEventListener('resize', updateHighlight)
    }
  }, [isOpen, currentStep, updateHighlight])

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
      return
    }
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(prev => prev + 1)
      setIsAnimating(false)
    }, 200)
  }

  const handlePrev = () => {
    if (isFirstStep) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(prev => prev - 1)
      setIsAnimating(false)
    }, 200)
  }

  const handleNavigateAndContinue = (href: string) => {
    if (pathname !== href) {
      router.push(href)
    }
    handleNext()
  }

  const handleSkipToEnd = () => {
    onComplete()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'Escape') onComplete()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentStep, isLastStep])

  if (!isOpen) return null

  const StepIcon = step.icon || Sparkles

  return (
    <>
      {/* Overlay avec trou rectangulaire */}
      {step.type === 'chatbot' ? (
        <>
          {/* Overlay complet pour le chatbot */}
          <div className="fixed inset-0 bg-black/50 z-[9998] pointer-events-none" />
          {/* Cercle pulsant autour du bouton chatbot */}
          <div
            className="fixed z-[9998] pointer-events-none"
            style={{
              right: 24 - 8, // bottom-6 = 24px, padding 8px
              bottom: 24 - 8,
              width: 56 + 16, // button 56px + padding
              height: 56 + 16,
            }}
          >
            {/* Cercle de highlight */}
            <div className="absolute inset-0 rounded-full border-2 border-[--atn-primary] animate-pulse" />
            {/* Animation pulsante */}
            <div className="absolute inset-0 rounded-full border-2 border-[--atn-secondary] animate-ping opacity-50" />
          </div>
        </>
      ) : highlightRect ? (
        <>
          {/* Top */}
          <div
            className="fixed left-0 right-0 top-0 bg-black/50 z-[9998] pointer-events-none transition-all duration-300"
            style={{ height: highlightRect.top - 8 }}
          />
          {/* Bottom */}
          <div
            className="fixed left-0 right-0 bottom-0 bg-black/50 z-[9998] pointer-events-none transition-all duration-300"
            style={{ top: highlightRect.bottom + 8 }}
          />
          {/* Left */}
          <div
            className="fixed left-0 bg-black/50 z-[9998] pointer-events-none transition-all duration-300"
            style={{
              top: highlightRect.top - 8,
              width: highlightRect.left - 8,
              height: highlightRect.height + 16,
            }}
          />
          {/* Right */}
          <div
            className="fixed right-0 bg-black/50 z-[9998] pointer-events-none transition-all duration-300"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.right + 8,
              height: highlightRect.height + 16,
            }}
          />
          {/* Cadre rectangulaire autour de l'element */}
          <div
            className="fixed border-2 border-[--atn-primary] rounded-xl z-[9998] pointer-events-none transition-all duration-300"
            style={{
              left: highlightRect.left - 8,
              top: highlightRect.top - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
            }}
          />
        </>
      ) : (
        <div className="fixed inset-0 bg-black/50 z-[9998] pointer-events-none" />
      )}

      {/* Tooltip/Modal positionne */}
      <div
        className={`fixed z-[9999] transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
        style={
          step.type === 'chatbot' && windowSize.width > 0
            ? {
                // Positionne au-dessus du chatbot avec fleche vers le bas
                right: 24, // Aligne avec le bouton chatbot
                bottom: 24 + 56 + 16, // Au-dessus du bouton (24px + 56px button + 16px gap)
                width: '340px',
                maxHeight: 'calc(100vh - 150px)',
              }
            : highlightRect && windowSize.width > 0
            ? (() => {
                const modalWidth = 400
                const padding = 20
                const maxModalHeight = windowSize.height - padding * 2

                // Position horizontale: a droite de l'element, sinon a gauche si pas de place
                let left = highlightRect.right + 24
                if (left + modalWidth > windowSize.width - padding) {
                  // Pas de place a droite, mettre a gauche
                  left = Math.max(padding, highlightRect.left - modalWidth - 24)
                }

                // Position verticale: en haut pour eviter les debordements
                const top = padding

                return {
                  left,
                  top,
                  width: `${modalWidth}px`,
                  maxHeight: `${maxModalHeight}px`,
                }
              })()
            : {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '500px',
                maxHeight: 'calc(100vh - 40px)',
              }
        }
      >
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[inherit]">
          {/* Progress bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-[--atn-primary] to-[--atn-secondary] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className={`p-4 bg-gradient-to-r ${step.color || 'from-[--atn-primary] to-[--atn-secondary]'} text-white`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <StepIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs opacity-80">{currentStep + 1}/{guideSteps.length}</p>
                  <h2 className="text-lg font-bold leading-tight">{step.title}</h2>
                </div>
              </div>
              <button
                onClick={handleSkipToEnd}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs"
                title="Passer le guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {step.subtitle && (
              <p className="text-sm opacity-90 ml-13">{step.subtitle}</p>
            )}
          </div>

          {/* Content - Scrollable */}
          <div className="p-4 overflow-y-auto flex-1 min-h-0">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>

            {/* ROI et arguments de vente pour sidebar-item */}
            {step.type === 'sidebar-item' && (
              <>
                {/* Badge */}
                {step.badge && (
                  <div className="mb-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                      step.badge === 'LIVE' ? 'bg-[--atn-green] text-white' : 'bg-[--atn-primary] text-white'
                    }`}>
                      {step.badge}
                    </span>
                  </div>
                )}

                {/* ROI */}
                {step.roi && (
                  <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[--atn-green]/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[--atn-green]" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[--atn-green]">{step.roi}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{step.roiDetail}</p>
                    </div>
                  </div>
                )}

                {/* Arguments de vente */}
                {step.salesArgs && (
                  <div className="space-y-1.5 mb-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Points cles
                    </p>
                    {step.salesArgs.map((arg, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <CheckCircle className="w-3.5 h-3.5 text-[--atn-green] flex-shrink-0" />
                        <span>{arg}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bouton voir la page */}
                {step.href && (
                  <button
                    onClick={() => handleNavigateAndContinue(step.href!)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[--atn-primary]/10 text-[--atn-primary] rounded-lg hover:bg-[--atn-primary]/20 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir cette page
                  </button>
                )}
              </>
            )}

            {/* Summary stats */}
            {step.type === 'summary' && step.stats && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {step.stats.map((stat, i) => (
                  <div key={i} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Chatbot specific content */}
            {step.type === 'chatbot' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-[--atn-primary]/10 to-[--atn-secondary]/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-[--atn-primary]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Connecte aux 10 workflows IA</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Il peut faire
                  </p>
                  {[
                    'Generer des rapports instantanes',
                    'Modifier vos newsletters',
                    'Creer du contenu SEO',
                    'Reprogrammer vos publications',
                    'Ajuster les prompts des agents',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <CheckCircle className="w-3.5 h-3.5 text-[--atn-green] flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fleche pointant vers le chatbot (vers le bas) */}
          {step.type === 'chatbot' && (
            <div
              className="absolute -bottom-4 right-6"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            >
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                <path
                  d="M0 0 L12 16 L24 0"
                  fill="white"
                  className="dark:fill-gray-900"
                />
              </svg>
            </div>
          )}

          {/* Footer - Navigation - Toujours visible */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between flex-shrink-0">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isFirstStep
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Prec.
            </button>

            {/* Mini step indicators */}
            <div className="flex items-center gap-1">
              {guideSteps.filter((_, i) => {
                // Montrer seulement les 5 etapes autour de l'actuelle
                return Math.abs(i - currentStep) <= 2
              }).map((_, idx) => {
                const actualIndex = currentStep - 2 + idx
                if (actualIndex < 0 || actualIndex >= guideSteps.length) return null
                return (
                  <button
                    key={actualIndex}
                    onClick={() => setCurrentStep(actualIndex)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      actualIndex === currentStep
                        ? 'w-4 bg-[--atn-primary]'
                        : actualIndex < currentStep
                        ? 'bg-[--atn-green]'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )
              })}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 bg-[--atn-primary] text-white rounded-lg hover:bg-[--atn-primary]/90 transition-colors text-sm font-medium"
            >
              {isLastStep ? 'Terminer' : 'Suiv.'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
