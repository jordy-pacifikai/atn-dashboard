'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  X, ChevronLeft, ChevronRight, Play, Pause,
  DollarSign, CheckCircle, Lightbulb
} from 'lucide-react'

// Types
interface GuideStep {
  selector: string
  name: string
  category: string
  purpose: string
  roi: string
  roiDescription: string
  interpretation: string[]
}

// Guide steps data - simplified for tooltip display
const guideSteps: GuideStep[] = [
  // ACCUEIL
  {
    selector: '[data-sidebar-guide="dashboard"]',
    name: 'Dashboard',
    category: 'Accueil',
    purpose: 'Centre de commandement avec vue temps réel de tous vos agents IA, leurs performances et les KPIs critiques.',
    roi: '+35% productivité',
    roiDescription: 'Vos équipes gagnent 2h/jour en évitant de jongler entre 10+ outils.',
    interpretation: [
      'KPIs en haut = métriques critiques avec tendances',
      'Grille agents = point vert/orange/rouge selon santé',
      'Fil d\'activité = actions récentes en temps réel',
    ],
  },
  {
    selector: '[data-sidebar-guide="demo-site"]',
    name: 'Demo Site',
    category: 'Accueil',
    purpose: 'Testez le chatbot exactement comme vos clients le verront. Simulez des conversations et validez l\'expérience.',
    roi: '0 risque production',
    roiDescription: 'Évite les bugs vus par 10,000+ visiteurs = image préservée.',
    interpretation: [
      'Sélecteur viewport pour test mobile/desktop',
      'Logs en temps réel de ce que l\'IA "pense"',
      'Zone de test isolée de la production',
    ],
  },
  // AGENTS IA
  {
    selector: '[data-sidebar-guide="chatbot-tiare"]',
    name: 'Chatbot Tiare',
    category: 'Agents IA',
    purpose: 'Assistant client virtuel 24/7 en 3 langues. Répond, qualifie les prospects, redirige vers la réservation.',
    roi: '40h/mois économisées',
    roiDescription: '500+ conversations/mois = équivalent d\'un mi-temps.',
    interpretation: [
      'Total conversations = adoption du chatbot',
      'Temps réponse <2s = excellent',
      'Taux résolution >85% = IA bien entraînée',
    ],
  },
  {
    selector: '[data-sidebar-guide="concierge-pro"]',
    name: 'Concierge Pro',
    category: 'Agents IA',
    purpose: 'Chatbot premium pour clients authentifiés. Connaît leur vol, historique, offre un service personnalisé.',
    roi: '+45% satisfaction',
    roiDescription: 'Réponse personnalisée avec nom et vol = fidélité accrue.',
    interpretation: [
      'Contexte client = infos vol et classe',
      'Personnalisation = mentions du nom dans les réponses',
      'Actions = modifications, upgrades possibles',
    ],
  },
  {
    selector: '[data-sidebar-guide="staff-assistant"]',
    name: 'Staff Assistant',
    category: 'Agents IA',
    purpose: 'Assistant IA interne pour vos employés. Répond aux questions sans déranger le manager.',
    roi: '-30% temps formation',
    roiDescription: '15 questions/jour résolues par l\'IA = managers libérés.',
    interpretation: [
      'Questions employés = gaps de formation identifiés',
      'Taux résolution >80% = base de connaissances complète',
      'Temps gagné = 10min/question évitée au manager',
    ],
  },
  // MARKETING AUTOMATISE
  {
    selector: '[data-sidebar-guide="newsletters"]',
    name: 'Newsletters',
    category: 'Marketing',
    purpose: 'Newsletters hyper-personnalisées automatiques. L\'IA adapte le contenu par segment et historique.',
    roi: '+32% taux ouverture',
    roiDescription: '"Jean-Pierre, votre escapade lune de miel" vs email générique.',
    interpretation: [
      'Score personnalisation >90% = prénom + segment utilisés',
      'Taux ouverture benchmark : 20-25%, avec IA : 30-40%',
      'Conversions = réservations générées',
    ],
  },
  {
    selector: '[data-sidebar-guide="contenu-seo"]',
    name: 'Contenu SEO',
    category: 'Marketing',
    purpose: 'Articles de blog optimisés SEO générés automatiquement. Plus d\'articles = plus de trafic Google.',
    roi: '+45% trafic organique',
    roiDescription: '4 articles/mois pendant 6 mois = actif SEO durable et gratuit.',
    interpretation: [
      'Score SEO >80 = bon ranking potentiel',
      'Statut : Brouillon → Planifié → Publié',
      'Trafic et conversions par article',
    ],
  },
  {
    selector: '[data-sidebar-guide="social-media"]',
    name: 'Social Media',
    category: 'Marketing',
    purpose: 'Posts réseaux sociaux générés et planifiés automatiquement avec hashtags optimisés.',
    roi: '+50% engagement',
    roiDescription: 'Posts IA au moment optimal vs "quand on y pense".',
    interpretation: [
      'Engagement rate >3% = excellent',
      'Reach = audience au-delà des followers',
      'Best performing = type de contenu qui marche',
    ],
  },
  {
    selector: '[data-sidebar-guide="visual-factory"]',
    name: 'Visual Factory',
    category: 'Marketing',
    purpose: 'Visuels marketing générés par IA. Bannières, images social, headers email en 30 secondes.',
    roi: '-70% temps création',
    roiDescription: '2h manuel vs 30s IA = 240x plus rapide.',
    interpretation: [
      'Assets générés = temps économisé',
      'Formats : email, social, bannières',
      'Utilisation = combien sont effectivement utilisés',
    ],
  },
  // INTELLIGENCE
  {
    selector: '[data-sidebar-guide="veille-concurrence"]',
    name: 'Veille Concurrence',
    category: 'Intelligence',
    purpose: 'Monitoring 24/7 des prix concurrents. Alerte dès qu\'un concurrent baisse ses prix.',
    roi: 'Réaction <24h',
    roiDescription: 'Plus jamais surpris par une promo French Bee ou Hawaiian.',
    interpretation: [
      'Rouge = concurrent moins cher (urgent)',
      'Écart >15% = risque perte parts de marché',
      'Tendances = promo ponctuelle ou stratégie ?',
    ],
  },
  {
    selector: '[data-sidebar-guide="gestion-avis"]',
    name: 'Gestion Avis',
    category: 'Intelligence',
    purpose: 'Réponses automatiques aux avis Google, TripAdvisor. L\'IA génère des réponses personnalisées.',
    roi: '+0.3 étoile moyenne',
    roiDescription: 'Répondre à 100% des avis = amélioration mécanique de la note.',
    interpretation: [
      'Note >4.5/5 = objectif (chaque 0.1 = ~5% revenus)',
      'Volume d\'avis = crédibilité',
      'Temps de réponse <24h = image pro',
    ],
  },
  {
    selector: '[data-sidebar-guide="review-intelligence"]',
    name: 'Review Intelligence',
    category: 'Intelligence',
    purpose: 'Analyse sémantique avancée. Détection ironie, thèmes récurrents, tendances avant qu\'elles deviennent problèmes.',
    roi: 'Détection précoce',
    roiDescription: 'Identifier une tendance négative AVANT qu\'elle ne devienne virale.',
    interpretation: [
      'Détection ironie = "formidable..." avec contexte négatif',
      'Word cloud = sujets fréquents (rouge = négatif)',
      'Tendances = sujets qui montent en fréquence',
    ],
  },
  {
    selector: '[data-sidebar-guide="lead-scoring"]',
    name: 'Lead Scoring',
    category: 'Intelligence',
    purpose: 'Score 0-100 automatique par prospect selon probabilité d\'achat. Priorisez vos efforts.',
    roi: '+25% conversion',
    roiDescription: 'Contacter d\'abord les leads chauds = convertir plus avec moins d\'efforts.',
    interpretation: [
      '80-100 = lead très chaud, contacter aujourd\'hui',
      '50-79 = tiède, nurturing nécessaire',
      '0-49 = froid, garder pour plus tard',
    ],
  },
  // OPERATIONS
  {
    selector: '[data-sidebar-guide="vols"]',
    name: 'Vols',
    category: 'Opérations',
    purpose: 'Monitoring temps réel des vols : statut, retards, remplissage. Adaptez les promos et communications.',
    roi: 'Visibilité temps réel',
    roiDescription: 'Promo sur vol vide, communication proactive si retard.',
    interpretation: [
      'Vert = à l\'heure, Ambre = retard <1h, Rouge = >1h',
      'Remplissage <70% = opportunité promo flash',
      'Alertes passagers = préparer la communication',
    ],
  },
  {
    selector: '[data-sidebar-guide="reservations"]',
    name: 'Réservations',
    category: 'Opérations',
    purpose: 'Suivi des demandes clients : modifications, annulations, questions. Tout centralisé.',
    roi: 'Zéro demande oubliée',
    roiDescription: 'Centraliser = traitement plus rapide et efficace.',
    interpretation: [
      'Demandes en attente = objectif 0 en fin de journée',
      'Temps traitement <24h = excellent',
      'Types de demandes = patterns à automatiser',
    ],
  },
  {
    selector: '[data-sidebar-guide="calendrier"]',
    name: 'Calendrier',
    category: 'Opérations',
    purpose: 'Planning éditorial centralisé. Visualisez toutes vos campagnes et publications.',
    roi: 'Organisation parfaite',
    roiDescription: 'Plus de "on a oublié la newsletter" ou 2 promos en même temps.',
    interpretation: [
      'Blocs = actions planifiées par couleur',
      'Statuts : Planifié → En cours → Publié',
      'Charge de travail = éviter les jours surchargés',
    ],
  },
  {
    selector: '[data-sidebar-guide="parcours-client"]',
    name: 'Parcours Client',
    category: 'Opérations',
    purpose: 'Journeys automatisés : de la réservation au retour, communications personnalisées à chaque étape.',
    roi: '+30% rétention',
    roiDescription: 'Client bien accompagné = client qui revient.',
    interpretation: [
      'Journeys actifs = nombre de clients en parcours',
      'Étapes : J-7 rappel, J-1 infos, J+1 feedback',
      'Completion >80% = parcours bien configuré',
    ],
  },
  // ANALYTICS
  {
    selector: '[data-sidebar-guide="rapports"]',
    name: 'Rapports',
    category: 'Analytics',
    purpose: 'Rapports hebdo/mensuels générés automatiquement. PDF dans votre boîte chaque lundi matin.',
    roi: '4h/semaine économisées',
    roiDescription: '4h × 52 semaines × coût horaire = économie massive.',
    interpretation: [
      'Rapport hebdo = KPIs semaine vs semaine précédente',
      'Rapport mensuel = vue complète avec recommandations',
      'PDF = prêt à partager avec la direction',
    ],
  },
  {
    selector: '[data-sidebar-guide="attribution"]',
    name: 'Attribution',
    category: 'Analytics',
    purpose: 'ROI par canal marketing. Quel canal génère vraiment vos ventes ? Google Ads ? Newsletter ? Chatbot ?',
    roi: 'Budget optimisé',
    roiDescription: 'Si chatbot = 25% conversions pour 5% budget, réalloquez !',
    interpretation: [
      'Modèles : First-touch, Last-touch, Linéaire',
      'Part par canal = % des conversions',
      'ROI par canal = revenus / coût',
    ],
  },
  {
    selector: '[data-sidebar-guide="a/b-tests"]',
    name: 'A/B Tests',
    category: 'Analytics',
    purpose: 'Tests comparatifs automatisés. L\'IA teste différentes versions et identifie les gagnants.',
    roi: '+15% performance',
    roiDescription: 'Tester systématiquement = trouver les meilleures versions.',
    interpretation: [
      'Tests en cours = comparaisons actives',
      'Confiance >95% = test concluant',
      'Lift = amélioration B vs A',
    ],
  },
  {
    selector: '[data-sidebar-guide="roi-dashboard"]',
    name: 'ROI Dashboard',
    category: 'Analytics',
    purpose: 'Vue consolidée du retour sur investissement. Combien coûte la plateforme ? Combien rapporte-t-elle ?',
    roi: '347% ROI annualisé',
    roiDescription: 'Pour chaque XPF investi, 3.47 XPF récupérés.',
    interpretation: [
      'ROI Global >200% = excellent investissement',
      'Gains : temps économisé + revenus + coûts évités',
      'ROI par agent = identifier les plus rentables',
    ],
  },
  // CONFIGURATION
  {
    selector: '[data-sidebar-guide="upsell-engine"]',
    name: 'Upsell Engine',
    category: 'Configuration',
    purpose: 'Règles d\'upsell automatique. Après réservation : surclassements, bagages, assurances personnalisés.',
    roi: '+12% revenus/client',
    roiDescription: 'Client qui a réservé = 5x plus susceptible d\'acheter un extra.',
    interpretation: [
      'Règles actives = opportunités configurées',
      'Taux conversion >10% = excellent',
      'Revenu additionnel = argent quasi-gratuit',
    ],
  },
]

interface SidebarGuideProps {
  isOpen: boolean
  onClose: () => void
  autoPlay?: boolean
}

export default function SidebarGuide({ isOpen, onClose, autoPlay = false }: SidebarGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const [mounted, setMounted] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = guideSteps[currentStep]

  // Mount check for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Position the highlight and tooltip based on the current element
  const updatePositions = useCallback(() => {
    if (!step) return

    const element = document.querySelector(step.selector)
    if (!element) {
      // Element not found, try next step
      console.warn(`Element not found: ${step.selector}`)
      return
    }

    const rect = element.getBoundingClientRect()
    const padding = 8

    // Highlight position (with padding)
    setHighlightPosition({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    })

    // Tooltip position (to the right of the element, or below if not enough space)
    const tooltipWidth = 380
    const tooltipHeight = 400
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let tooltipTop = rect.top
    let tooltipLeft = rect.right + 20

    // If tooltip goes off right edge, position it below
    if (tooltipLeft + tooltipWidth > viewportWidth - 20) {
      tooltipLeft = Math.max(20, rect.left)
      tooltipTop = rect.bottom + 20
    }

    // If tooltip goes off bottom, position it above
    if (tooltipTop + tooltipHeight > viewportHeight - 20) {
      tooltipTop = Math.max(20, viewportHeight - tooltipHeight - 20)
    }

    setTooltipPosition({ top: tooltipTop, left: tooltipLeft })
  }, [step])

  // Update positions when step changes or window resizes
  useEffect(() => {
    if (!isOpen) return

    updatePositions()

    const handleResize = () => updatePositions()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize, true)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize, true)
    }
  }, [isOpen, currentStep, updatePositions])

  // Auto-play
  useEffect(() => {
    if (!isPlaying || !isOpen) return

    const timer = setInterval(() => {
      if (currentStep < guideSteps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }, 8000)

    return () => clearInterval(timer)
  }, [isPlaying, currentStep, isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (currentStep < guideSteps.length - 1) {
          setCurrentStep(prev => prev + 1)
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (currentStep > 0) {
          setCurrentStep(prev => prev - 1)
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentStep, onClose])

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      setIsPlaying(autoPlay)
    }
  }, [isOpen, autoPlay])

  if (!isOpen || !mounted) return null

  const progress = ((currentStep + 1) / guideSteps.length) * 100

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Dark overlay with hole for highlighted element */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={highlightPosition.left}
              y={highlightPosition.top}
              width={highlightPosition.width}
              height={highlightPosition.height}
              rx="12"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
          style={{ pointerEvents: 'all' }}
          onClick={onClose}
        />
      </svg>

      {/* Highlight border around element */}
      <div
        className="absolute border-2 border-sky-400 rounded-xl pointer-events-none transition-all duration-300 shadow-[0_0_0_4px_rgba(56,189,248,0.3)]"
        style={{
          top: highlightPosition.top,
          left: highlightPosition.left,
          width: highlightPosition.width,
          height: highlightPosition.height,
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: 380,
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Progress bar */}
        <div className="h-1 bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{step.category}</p>
            <h3 className="font-bold text-lg text-slate-900">{step.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title={isPlaying ? 'Pause' : 'Lecture auto'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-slate-600" />
              ) : (
                <Play className="w-4 h-4 text-slate-600" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {/* Purpose */}
          <p className="text-sm text-slate-700 leading-relaxed">{step.purpose}</p>

          {/* ROI Highlight */}
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-emerald-800">{step.roi}</p>
                <p className="text-xs text-emerald-700 mt-0.5">{step.roiDescription}</p>
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" />
              Comment interpréter
            </p>
            <div className="space-y-1.5">
              {step.interpretation.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Préc
            </button>

            <span className="text-xs text-slate-500">
              {currentStep + 1} / {guideSteps.length}
            </span>

            {currentStep < guideSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg hover:opacity-90 transition-colors"
              >
                Suiv
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Terminer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
