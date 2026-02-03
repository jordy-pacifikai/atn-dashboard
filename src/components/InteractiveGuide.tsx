'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Zap,
  Target,
  Database,
  Play,
  Pause,
} from 'lucide-react'

// Types
interface ElementGuide {
  id: string
  selector: string // CSS selector pour trouver l'élément
  fallbackSelector?: string // Backup selector si le premier ne marche pas
  name: string
  description: string
  interpretation: string // Comment lire/interpréter cette donnée
  roiImpact?: string // Impact ROI
  source: string // D'où vient la donnée
  status: 'ok' | 'warning' | 'missing' // Status du prérequis ATN
  atnAction?: string // Ce que ATN doit fournir si status != ok
}

interface PageConfig {
  route: string
  pageName: string
  pageDescription: string
  globalROI?: string
  demoScript?: string
  elements: ElementGuide[]
}

interface HighlightRect {
  top: number
  left: number
  width: number
  height: number
}

// Configuration complète par page
const pageConfigs: PageConfig[] = [
  // ============ PAGE: DASHBOARD ============
  {
    route: '/',
    pageName: 'Dashboard',
    pageDescription: 'Vue d\'ensemble de tous vos agents IA et KPIs principaux',
    globalROI: '+35% productivité marketing',
    demoScript: 'Voici votre cockpit quotidien. En un coup d\'œil, vous voyez tout ce qui s\'est passé : combien de conversations le chatbot a gérées, les newsletters parties, les alertes concurrentielles.',
    elements: [
      {
        id: 'kpi-conversations',
        selector: '[data-guide="kpis-grid"] > div:nth-child(1)',
        name: 'KPI Conversations',
        description: 'Nombre total de conversations chatbot ce mois',
        interpretation: 'Chaque conversation = un client assisté automatiquement. Visez +20% par mois en période haute.',
        roiImpact: '40h/mois économisées',
        source: 'Webhook chatbot → Supabase atn_conversations',
        status: 'ok',
      },
      {
        id: 'kpi-temps',
        selector: '[data-guide="kpis-grid"] > div:nth-child(2)',
        name: 'KPI Temps économisé',
        description: 'Heures de travail humain économisées par l\'IA',
        interpretation: 'Calculé: (conversations × 3min) + (newsletters × 45min) + (articles × 2h). Compare au coût d\'un employé.',
        roiImpact: 'Équivalent 0.5 ETP',
        source: 'Calcul automatique depuis les stats',
        status: 'ok',
      },
      {
        id: 'kpi-satisfaction',
        selector: '[data-guide="kpis-grid"] > div:nth-child(3)',
        name: 'KPI Satisfaction',
        description: 'Taux de satisfaction des interactions chatbot',
        interpretation: 'Basé sur: résolution sans escalade (positif), demande agent humain (négatif), feedback explicite.',
        roiImpact: '+45% satisfaction client',
        source: 'Analyse sentiment + taux résolution',
        status: 'warning',
        atnAction: 'Activer le feedback post-conversation sur le widget chatbot',
      },
      {
        id: 'kpi-conversion',
        selector: '[data-guide="kpis-grid"] > div:nth-child(4)',
        name: 'KPI Taux conversion',
        description: 'Taux de conversion des leads chatbot',
        interpretation: 'Visiteur chatbot → clic lien réservation. Benchmark secteur: 8-12%. Visez 15%+.',
        roiImpact: '+2.1% vs mois dernier',
        source: 'Tracking UTM liens chatbot',
        status: 'missing',
        atnAction: 'Fournir accès Google Analytics ou système de tracking ATN',
      },
      {
        id: 'agents-grid',
        selector: '[data-guide="agents-grid"]',
        name: 'Grille Agents IA',
        description: 'Les 6 agents IA qui travaillent pour vous 24/7',
        interpretation: 'Point vert = actif. Chaque agent a ses stats en temps réel. Cliquez pour accéder aux détails.',
        roiImpact: '6 agents = 6 postes automatisés',
        source: 'Status workflows n8n',
        status: 'ok',
      },
      {
        id: 'activity-feed',
        selector: '[data-guide="activity-feed"]',
        name: 'Fil d\'activité',
        description: 'Les dernières actions de vos agents IA',
        interpretation: 'Bleu=chat, Ambre=alerte concurrence, Jaune=avis, Vert=contenu, Violet=newsletter. Alertes ambre = action requise.',
        source: 'Agrégation temps réel tous workflows',
        status: 'ok',
      },
      {
        id: 'flights-widget',
        selector: '[data-guide="flights-widget"]',
        name: 'Widget Vols',
        description: 'Aperçu des vols du jour avec taux de remplissage',
        interpretation: 'Vert=à l\'heure, Ambre=retard. Remplissage: vert >85%, ambre 70-85%, rouge <70%.',
        source: 'API Amadeus/Sabre',
        status: 'missing',
        atnAction: 'Fournir accès API système de réservation (Amadeus/Sabre)',
      },
      {
        id: 'chatbot-widget',
        selector: '[data-guide="chatbot-widget"]',
        name: 'Widget Chatbot Tiare',
        description: 'Performance temps réel du chatbot',
        interpretation: 'Conversations/jour, taux résolution (>85% = excellent), temps réponse (<2s = bon).',
        roiImpact: '89% résolution automatique',
        source: 'Webhook chatbot Tiare',
        status: 'ok',
      },
      {
        id: 'upcoming-widget',
        selector: '[data-guide="upcoming-widget"]',
        name: 'Widget À venir',
        description: 'Prochaines actions automatiques planifiées',
        interpretation: 'Violet=newsletter, Indigo=rapport, Vert=article SEO. Cliquez pour modifier le planning.',
        source: 'Calendrier n8n + Content Calendar Airtable',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: CONVERSATIONS ============
  {
    route: '/conversations',
    pageName: 'Chatbot Tiare',
    pageDescription: 'Historique et monitoring des conversations du chatbot multilingue',
    globalROI: '40h/mois économisées',
    demoScript: 'Voici l\'historique de toutes les conversations. Chaque ligne = un client assisté automatiquement. Le chatbot répond en 4 langues instantanément, 24/7.',
    elements: [
      {
        id: 'conv-stats',
        selector: '[data-guide="conv-stats"]',
        name: 'KPIs Conversations',
        description: 'Statistiques globales: total, temps moyen, tokens, langues',
        interpretation: 'Total = volume chatbot. Temps <1.5s = excellent. Tokens = coût API. Langues = mix visiteurs.',
        roiImpact: '40h/mois économisées',
        source: 'Table Airtable Concierge_Logs',
        status: 'ok',
      },
      {
        id: 'conv-filters',
        selector: '[data-guide="conv-filters"]',
        name: 'Filtres conversations',
        description: 'Recherche et filtrage par langue',
        interpretation: 'Utilisez pour analyser les questions d\'un marché spécifique (ex: japonais pour adapter l\'offre).',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'conv-list',
        selector: '[data-guide="conv-list"]',
        name: 'Liste des conversations',
        description: 'Historique détaillé de chaque échange',
        interpretation: 'Cliquez sur une ligne pour voir Q/R complète. Identifiez les questions sans réponse pour améliorer la FAQ.',
        source: 'Table Airtable Concierge_Logs',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: NEWSLETTERS ============
  {
    route: '/newsletters',
    pageName: 'Newsletters Personnalisées',
    pageDescription: 'Emails hyper-personnalisés générés par IA selon le segment client',
    globalROI: '+32% taux ouverture',
    demoScript: 'Chaque email est unique, généré par l\'IA selon le profil du client. Un couple en lune de miel ne reçoit pas le même email qu\'une famille ou un plongeur.',
    elements: [
      {
        id: 'news-stats',
        selector: '[data-guide="news-stats"]',
        name: 'KPIs Newsletter',
        description: 'Emails envoyés, score perso, taux ouverture, segments actifs',
        interpretation: 'Taux ouverture >30% = excellent avec personnalisation. Score perso >90% = très personnalisé.',
        roiImpact: '+32% vs emails génériques',
        source: 'Table Newsletter_Logs + API Brevo',
        status: 'ok',
      },
      {
        id: 'news-filters',
        selector: '[data-guide="news-filters"]',
        name: 'Filtres segment',
        description: 'Filtrer les newsletters par segment client',
        interpretation: 'Analysez les performances par segment. Si un segment sous-performe, ajustez le contenu IA.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'news-list',
        selector: '[data-guide="news-list"]',
        name: 'Liste des newsletters',
        description: 'Historique des emails avec preview',
        interpretation: 'Cliquez pour voir l\'email complet. Vert=ouvert, Violet=cliqué, Bleu=envoyé, Ambre=en attente.',
        source: 'Table Newsletter_Logs',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: DEMO SITE ============
  {
    route: '/demo-site',
    pageName: 'Demo Site',
    pageDescription: 'Testez le chatbot Tiare comme un visiteur du site ATN',
    globalROI: 'Test avant mise en production',
    demoScript: 'Ici vous pouvez tester le chatbot exactement comme vos clients le verront. Cliquez sur la bulle bleue en bas à droite. Essayez en français, anglais, ou japonais.',
    elements: [
      {
        id: 'demo-banner',
        selector: '[data-guide="demo-banner"]',
        name: 'Bannière guide',
        description: 'Instructions pour tester le chatbot',
        interpretation: 'Suivez les étapes indiquées pour une démo complète. Cliquez sur la bulle bleue pour commencer.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'demo-tips',
        selector: '[data-guide="demo-tips"]',
        name: 'Conseils de test',
        description: 'Questions suggérées pour tester le chatbot',
        interpretation: 'Testez ces questions types pour valider que le chatbot répond correctement.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'demo-toolbar',
        selector: '[data-guide="demo-toolbar"]',
        name: 'Barre d\'outils',
        description: 'Changez le viewport (desktop, tablette, mobile) et rafraîchissez le site',
        interpretation: 'Vérifiez que l\'expérience est bonne sur tous les appareils. 60% du trafic est mobile.',
        source: 'Interface locale',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: CONTENT SEO ============
  {
    route: '/content',
    pageName: 'Contenu SEO',
    pageDescription: 'Articles de blog générés par IA pour le référencement',
    globalROI: '+45% trafic organique',
    demoScript: 'L\'IA génère des articles optimisés SEO sur vos destinations. 8 articles ce mois = 8 opportunités de ranking Google.',
    elements: [
      {
        id: 'content-stats',
        selector: '[data-guide="content-stats"]',
        name: 'Stats contenu',
        description: 'KPIs de production et performance SEO',
        interpretation: 'Articles publiés, mots générés, score SEO moyen, trafic organique généré.',
        roiImpact: '8 articles/mois automatiques',
        source: 'Table Content_Articles + Google Search Console',
        status: 'warning',
        atnAction: 'Fournir accès Google Search Console du site airtahitinui.com',
      },
      {
        id: 'content-filters',
        selector: '[data-guide="content-filters"]',
        name: 'Filtres contenu',
        description: 'Filtrer les articles par statut',
        interpretation: 'Utilisez pour voir les brouillons à valider ou les articles en attente de publication.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'content-list',
        selector: '[data-guide="content-list"]',
        name: 'Liste des articles',
        description: 'Tous les articles générés avec leur statut',
        interpretation: 'Vert=publié, Ambre=en review, Gris=brouillon. Cliquez pour voir/éditer le contenu.',
        source: 'Table Content_Articles',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: REVIEWS ============
  {
    route: '/reviews',
    pageName: 'Gestion Avis',
    pageDescription: 'Réponses automatiques aux avis Google/TripAdvisor',
    globalROI: '100% avis répondus',
    demoScript: 'Chaque avis reçoit une réponse personnalisée en moins de 2h. Positif: remerciement + invitation à revenir. Négatif: excuse + solution.',
    elements: [
      {
        id: 'reviews-stats',
        selector: '[data-guide="reviews-stats"]',
        name: 'Stats avis',
        description: 'Volume d\'avis et note moyenne',
        interpretation: 'Note moyenne (objectif >4.5), temps de réponse (<2h), % répondus (objectif 100%).',
        roiImpact: '+0.3 étoiles en moyenne',
        source: 'API Google Business Profile + TripAdvisor',
        status: 'missing',
        atnAction: 'Fournir accès Google Business Profile et TripAdvisor Manager',
      },
      {
        id: 'reviews-filters',
        selector: '[data-guide="reviews-filters"]',
        name: 'Filtres avis',
        description: 'Filtrer par note et statut de réponse',
        interpretation: 'Filtrez les avis négatifs non répondus pour les traiter en priorité.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reviews-list',
        selector: '[data-guide="reviews-list"]',
        name: 'Liste des avis',
        description: 'Avis récents avec réponses générées',
        interpretation: '5★=vert, 4★=vert clair, 3★=jaune, 2★=orange, 1★=rouge. Cliquez pour voir/modifier la réponse.',
        source: 'Table Reviews',
        status: 'warning',
        atnAction: 'Configurer webhook Google Business pour sync temps réel',
      },
    ],
  },

  // ============ PAGE: COMPETITORS ============
  {
    route: '/competitors',
    pageName: 'Veille Concurrence',
    pageDescription: 'Monitoring automatique des prix et offres concurrents',
    globalROI: 'Réaction en <24h aux changements',
    demoScript: 'Le système surveille French Bee, Hawaiian Airlines et LATAM. Dès qu\'un concurrent baisse ses prix, vous êtes alerté.',
    elements: [
      {
        id: 'competitors-stats',
        selector: '[data-guide="competitors-stats"]',
        name: 'Stats veille',
        description: 'KPIs de veille concurrentielle',
        interpretation: 'Concurrents surveillés, alertes actives, évolution moyenne des prix.',
        roiImpact: 'Ajustement prix proactif',
        source: 'Scraping quotidien sites concurrents',
        status: 'ok',
      },
      {
        id: 'competitors-filters',
        selector: '[data-guide="competitors-filters"]',
        name: 'Filtres concurrents',
        description: 'Filtrer par compagnie ou type d\'alerte',
        interpretation: 'Concentrez-vous sur un concurrent spécifique ou sur les alertes urgentes.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'competitors-list',
        selector: '[data-guide="competitors-list"]',
        name: 'Liste des alertes',
        description: 'Détail des changements de prix détectés',
        interpretation: 'Rouge=concurrent moins cher (urgent), Vert=vous êtes compétitif, Ambre=nouvelle offre.',
        source: 'Build 6 - Competitor Monitoring',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: REPORTS ============
  {
    route: '/reports',
    pageName: 'Rapports Automatiques',
    pageDescription: 'Rapports hebdo/mensuels générés et envoyés automatiquement',
    globalROI: '4h/semaine économisées',
    demoScript: 'Chaque lundi à 8h, un rapport complet part automatiquement aux 5 destinataires configurés. Vous n\'avez rien à faire.',
    elements: [
      {
        id: 'reports-custom',
        selector: '[data-guide="reports-custom"]',
        name: 'Rapport personnalisé',
        description: 'Générez un rapport à la demande avec paramètres personnalisés',
        interpretation: 'Choisissez la période, les métriques, les destinataires. Utile pour présentations ponctuelles.',
        roiImpact: 'Rapports ad-hoc en 1 clic',
        source: 'Interface locale + Claude AI',
        status: 'ok',
      },
      {
        id: 'reports-filters',
        selector: '[data-guide="reports-filters"]',
        name: 'Filtres rapports',
        description: 'Filtrer par type de rapport',
        interpretation: 'Hebdo, mensuel, trimestriel. Identifiez les rapports manqués ou en échec.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reports-templates',
        selector: '[data-guide="reports-templates"]',
        name: 'Templates rapports',
        description: 'Modèles de rapports disponibles',
        interpretation: 'Cliquez pour voir le contenu type. Personnalisez selon vos besoins.',
        source: 'Table Reports + Supabase storage',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: FLIGHTS ============
  {
    route: '/flights',
    pageName: 'Flight Notifier',
    pageDescription: 'Alertes vols en temps réel et notifications automatiques',
    globalROI: '100% passagers informés',
    demoScript: 'Dès qu\'un vol est retardé ou annulé, tous les passagers concernés sont notifiés automatiquement par SMS, email et push.',
    elements: [
      {
        id: 'flights-stats',
        selector: '[data-guide="flights-stats"]',
        name: 'Stats alertes',
        description: 'KPIs des alertes vols et notifications',
        interpretation: 'Passagers impactés, notifiés (objectif 100%), vols retardés/annulés.',
        roiImpact: '100% passagers informés proactivement',
        source: 'Table Flight_Alerts',
        status: 'ok',
      },
      {
        id: 'flights-filters',
        selector: '[data-guide="flights-filters"]',
        name: 'Filtres alertes',
        description: 'Filtrer par type d\'alerte',
        interpretation: 'Retards, annulations, changements de porte. Priorisez les alertes critiques.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'flights-list',
        selector: '[data-guide="flights-list"]',
        name: 'Liste des alertes',
        description: 'Alertes récentes avec statut notification',
        interpretation: 'Vert=notifications envoyées, Ambre=en attente, Rouge=échec envoi.',
        source: 'Table Flight_Alerts + Webhooks n8n',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: SOCIAL ============
  {
    route: '/social',
    pageName: 'Social Monitor',
    pageDescription: 'Surveillance des mentions sur les réseaux sociaux avec réponses IA',
    globalROI: '+50% engagement',
    demoScript: 'Toutes les mentions de votre marque sont analysées. L\'IA génère des réponses adaptées au sentiment et à la plateforme.',
    elements: [
      {
        id: 'social-stats',
        selector: '[data-guide="social-stats"]',
        name: 'Stats mentions',
        description: 'Portée, sentiment moyen, mentions à traiter',
        interpretation: 'Sentiment >70% = positif. Alertes négatives = à traiter en priorité.',
        roiImpact: '+50% réactivité sociale',
        source: 'API Meta + Twitter + LinkedIn',
        status: 'warning',
        atnAction: 'Fournir accès Meta Business Suite et Twitter Analytics',
      },
      {
        id: 'social-filters',
        selector: '[data-guide="social-filters"]',
        name: 'Filtres plateformes',
        description: 'Filtrer par réseau social',
        interpretation: 'Analysez les performances par plateforme. Identifiez où concentrer vos efforts.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'social-list',
        selector: '[data-guide="social-list"]',
        name: 'Liste des mentions',
        description: 'Mentions récentes avec réponses suggérées',
        interpretation: 'Vert=positif, Rouge=négatif. Cliquez pour voir/modifier la réponse IA.',
        source: 'Table Social_Mentions',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: ROI ANALYST ============
  {
    route: '/roi',
    pageName: 'ROI Analyst',
    pageDescription: 'Analyse des performances par route avec alertes et recommandations',
    globalROI: 'Optimisation revenus par route',
    demoScript: 'Chaque route est analysée: revenus, réservations, variation. L\'IA détecte les anomalies et recommande des actions.',
    elements: [
      {
        id: 'roi-stats',
        selector: '[data-guide="roi-stats"]',
        name: 'Stats revenus',
        description: 'KPIs globaux: revenu total, réservations, alertes, routes en croissance',
        interpretation: 'Revenu en XPF, tendance vs mois dernier. Alertes = routes nécessitant attention.',
        roiImpact: 'Optimisation revenus par route',
        source: 'Table ROI_Alerts',
        status: 'ok',
      },
      {
        id: 'roi-filters',
        selector: '[data-guide="roi-filters"]',
        name: 'Filtres routes',
        description: 'Filtrer par statut de performance',
        interpretation: 'Critique, Attention, Croissance, Stable. Priorisez les routes critiques.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'roi-list',
        selector: '[data-guide="roi-list"]',
        name: 'Liste des alertes ROI',
        description: 'Alertes par route avec métriques et recommandations IA',
        interpretation: 'Rouge=critique (baisse forte), Ambre=attention, Vert=croissance. Action IA suggérée.',
        source: 'Table ROI_Alerts + Claude AI',
        status: 'ok',
      },
    ],
  },
]

// Fallback pour pages non configurées
const defaultPageConfig: PageConfig = {
  route: '*',
  pageName: 'Page',
  pageDescription: 'Guide non configuré pour cette page',
  elements: [],
}

export default function InteractiveGuide() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [currentElementIndex, setCurrentElementIndex] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, placement: 'bottom' as 'top' | 'bottom' | 'left' | 'right' })
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  // Trouver la config de la page courante
  const currentPageConfig = pageConfigs.find(p => p.route === pathname) || defaultPageConfig
  const elements = currentPageConfig.elements
  const currentElement = elements[currentElementIndex]

  // Fonction pour trouver un élément par selector
  const findElement = useCallback((selector: string, fallback?: string): HTMLElement | null => {
    try {
      let el = document.querySelector(selector) as HTMLElement
      if (!el && fallback) {
        el = document.querySelector(fallback) as HTMLElement
      }
      return el
    } catch {
      return null
    }
  }, [])

  // Mettre à jour le rect du highlight (position fixed dans le viewport)
  const updateHighlightRect = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect()

    setHighlightRect({
      top: rect.top - 8,
      left: rect.left - 8,
      width: rect.width + 16,
      height: rect.height + 16,
    })
  }, [])

  // Fonction pour calculer la position du tooltip - FIXE dans le viewport, ne chevauche JAMAIS l'encadré
  const calculateTooltipPosition = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const tooltipWidth = 400
    const tooltipHeight = 380
    const margin = 20
    const highlightPadding = 8

    let placement: 'top' | 'bottom' | 'left' | 'right' = 'right'
    let top = 0
    let left = 0

    // Zone de l'élément highlighté (avec padding)
    const highlightTop = rect.top - highlightPadding
    const highlightBottom = rect.bottom + highlightPadding
    const highlightLeft = rect.left - highlightPadding
    const highlightRight = rect.right + highlightPadding

    // Espace disponible autour de l'élément
    const spaceAbove = highlightTop
    const spaceBelow = window.innerHeight - highlightBottom
    const spaceLeft = highlightLeft
    const spaceRight = window.innerWidth - highlightRight

    // Priorité: droite > gauche > bas > haut (pour ne jamais chevaucher)
    if (spaceRight >= tooltipWidth + margin) {
      placement = 'right'
      top = Math.max(margin, Math.min(rect.top, window.innerHeight - tooltipHeight - margin))
      left = highlightRight + margin
    } else if (spaceLeft >= tooltipWidth + margin) {
      placement = 'left'
      top = Math.max(margin, Math.min(rect.top, window.innerHeight - tooltipHeight - margin))
      left = highlightLeft - tooltipWidth - margin
    } else if (spaceBelow >= tooltipHeight + margin) {
      placement = 'bottom'
      top = highlightBottom + margin
      left = Math.max(margin, Math.min(rect.left, window.innerWidth - tooltipWidth - margin))
    } else if (spaceAbove >= tooltipHeight + margin) {
      placement = 'top'
      top = highlightTop - tooltipHeight - margin
      left = Math.max(margin, Math.min(rect.left, window.innerWidth - tooltipWidth - margin))
    } else {
      // Fallback: coin inférieur droit
      placement = 'bottom'
      top = window.innerHeight - tooltipHeight - margin
      left = window.innerWidth - tooltipWidth - margin
    }

    // Contraindre dans la fenêtre
    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin))
    top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - margin))

    return { top, left, placement }
  }, [])

  // Fonction pour bloquer/débloquer le scroll
  const setScrollLock = useCallback((lock: boolean) => {
    const html = document.documentElement
    const body = document.body

    if (lock) {
      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
    } else {
      html.style.overflow = ''
      body.style.overflow = ''
    }
  }, [])

  // Débloquer le scroll quand le guide se ferme
  useEffect(() => {
    if (!isOpen) {
      setScrollLock(false)
    }
    return () => setScrollLock(false)
  }, [isOpen, setScrollLock])

  // Mettre à jour le highlight quand l'élément change
  useEffect(() => {
    if (!isOpen || !currentElement) {
      setHighlightedElement(null)
      setHighlightRect(null)
      return
    }

    const el = findElement(currentElement.selector, currentElement.fallbackSelector)
    if (el) {
      // Débloquer le scroll temporairement pour scroller vers l'élément
      setScrollLock(false)

      // Scroll vers l'élément
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Attendre que le scroll soit terminé, puis bloquer et calculer les positions
      setTimeout(() => {
        setHighlightedElement(el)
        updateHighlightRect(el)
        setTooltipPosition(calculateTooltipPosition(el))
        // Rebloquer le scroll après avoir positionné
        setScrollLock(true)
      }, 500)
    } else {
      setHighlightedElement(null)
      setHighlightRect(null)
    }
  }, [isOpen, currentElement, findElement, calculateTooltipPosition, updateHighlightRect, setScrollLock])

  // Mettre à jour les positions lors du resize
  useEffect(() => {
    if (!isOpen || !highlightedElement) return

    const handleResize = () => {
      updateHighlightRect(highlightedElement)
      setTooltipPosition(calculateTooltipPosition(highlightedElement))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, highlightedElement, updateHighlightRect, calculateTooltipPosition])

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || !isOpen) return

    const timer = setTimeout(() => {
      if (currentElementIndex < elements.length - 1) {
        setCurrentElementIndex(prev => prev + 1)
      } else {
        setIsAutoPlaying(false)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [isAutoPlaying, isOpen, currentElementIndex, elements.length])

  // Reset quand on change de page
  useEffect(() => {
    setCurrentElementIndex(0)
    setIsAutoPlaying(false)
  }, [pathname])

  const handleNext = () => {
    if (currentElementIndex < elements.length - 1) {
      setCurrentElementIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentElementIndex > 0) {
      setCurrentElementIndex(prev => prev - 1)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setHighlightedElement(null)
    setIsAutoPlaying(false)
  }

  const getStatusIcon = (status: 'ok' | 'warning' | 'missing') => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: 'ok' | 'warning' | 'missing') => {
    switch (status) {
      case 'ok':
        return 'bg-emerald-500/10 border-emerald-500/30'
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30'
      case 'missing':
        return 'bg-red-500/10 border-red-500/30'
    }
  }

  // Si pas d'éléments configurés pour cette page
  if (elements.length === 0) {
    return (
      <>
        {/* Bouton flottant - positionné au-dessus du chatbot */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Guide</span>
        </button>

        {/* Modal simple */}
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={handleClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{currentPageConfig.pageName}</h2>
                <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">{currentPageConfig.pageDescription}</p>
              <p className="text-sm text-slate-500">Guide détaillé non disponible pour cette page.</p>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {/* Bouton flottant - positionné au-dessus du chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Guide interactif</span>
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {elements.length}
          </span>
        </button>
      )}

      {/* Overlay highlight avec cutout transparent */}
      {isOpen && highlightRect && (
        <div className="fixed inset-0 z-[90] pointer-events-none">
          {/* SVG overlay avec cutout */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <mask id="highlight-mask">
                {/* Fond blanc = visible */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {/* Cutout noir = transparent */}
                <rect
                  x={highlightRect.left}
                  y={highlightRect.top}
                  width={highlightRect.width}
                  height={highlightRect.height}
                  rx="12"
                  fill="black"
                />
              </mask>
            </defs>
            {/* Overlay sombre avec le masque */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.5)"
              mask="url(#highlight-mask)"
            />
          </svg>

          {/* Bordure autour de l'élément highlighté - opacité 0 à l'intérieur */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: highlightRect.top,
              left: highlightRect.left,
              width: highlightRect.width,
              height: highlightRect.height,
              borderRadius: '12px',
              border: '3px solid #8b5cf6',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
              background: 'transparent',
            }}
          />
        </div>
      )}

      {/* Tooltip - FIXE dans le viewport, ne bouge pas avec le scroll */}
      {isOpen && currentElement && highlightRect && (
        <div
          className="fixed z-[100] w-[400px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            maxHeight: 'calc(100vh - 40px)',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
                  {currentPageConfig.pageName}
                </p>
                <h3 className="text-white font-bold text-lg">{currentElement.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title={isAutoPlaying ? 'Pause' : 'Auto-play'}
                >
                  {isAutoPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-white/70 text-sm">
                {currentElementIndex + 1} / {elements.length}
              </span>
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${((currentElementIndex + 1) / elements.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[350px] overflow-y-auto">
            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {currentElement.description}
            </p>

            {/* Interpretation */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Comment interpréter</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">{currentElement.interpretation}</p>
              </div>
            </div>

            {/* ROI Impact */}
            {currentElement.roiImpact && (
              <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl mb-3">
                <Zap className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">Impact ROI</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">{currentElement.roiImpact}</p>
                </div>
              </div>
            )}

            {/* Source & Status */}
            <div className={`flex items-start gap-3 p-3 rounded-xl border ${getStatusColor(currentElement.status)}`}>
              <Database className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Source de données</p>
                  {getStatusIcon(currentElement.status)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{currentElement.source}</p>

                {/* Action ATN si nécessaire */}
                {currentElement.atnAction && (
                  <div className="mt-2 p-2 bg-white dark:bg-slate-700 rounded-lg">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Action ATN requise
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{currentElement.atnAction}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentElementIndex === 0}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>

            {/* Dots navigation */}
            <div className="flex items-center gap-1">
              {elements.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentElementIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentElementIndex
                      ? 'bg-violet-600 w-4'
                      : 'bg-slate-300 dark:bg-slate-600 hover:bg-violet-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentElementIndex === elements.length - 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
