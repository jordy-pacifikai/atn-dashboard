'use client'

import { useState, useEffect, useCallback } from 'react'
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
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(1)',
        name: 'KPI Conversations',
        description: 'Nombre total de conversations chatbot ce mois',
        interpretation: 'Chaque conversation = un client assisté automatiquement. Visez +20% par mois en période haute.',
        roiImpact: '40h/mois économisées',
        source: 'Webhook chatbot → Supabase atn_conversations',
        status: 'ok',
      },
      {
        id: 'kpi-temps',
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(2)',
        name: 'KPI Temps économisé',
        description: 'Heures de travail humain économisées par l\'IA',
        interpretation: 'Calculé: (conversations × 3min) + (newsletters × 45min) + (articles × 2h). Compare au coût d\'un employé.',
        roiImpact: 'Équivalent 0.5 ETP',
        source: 'Calcul automatique depuis les stats',
        status: 'ok',
      },
      {
        id: 'kpi-satisfaction',
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(3)',
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
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(4)',
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
        selector: '.col-span-2.card',
        fallbackSelector: '.grid.grid-cols-3 > div:first-child',
        name: 'Grille Agents IA',
        description: 'Les 6 agents IA qui travaillent pour vous 24/7',
        interpretation: 'Point vert = actif. Chaque agent a ses stats en temps réel. Cliquez pour accéder aux détails.',
        roiImpact: '6 agents = 6 postes automatisés',
        source: 'Status workflows n8n',
        status: 'ok',
      },
      {
        id: 'activity-feed',
        selector: '.grid.grid-cols-3 > div:last-child',
        name: 'Fil d\'activité',
        description: 'Les dernières actions de vos agents IA',
        interpretation: 'Bleu=chat, Ambre=alerte concurrence, Jaune=avis, Vert=contenu, Violet=newsletter. Alertes ambre = action requise.',
        source: 'Agrégation temps réel tous workflows',
        status: 'ok',
      },
      {
        id: 'flights-widget',
        selector: '.grid.grid-cols-3.gap-6:last-of-type > div:first-child',
        name: 'Widget Vols',
        description: 'Aperçu des vols du jour avec taux de remplissage',
        interpretation: 'Vert=à l\'heure, Ambre=retard. Remplissage: vert >85%, ambre 70-85%, rouge <70%.',
        source: 'API Amadeus/Sabre',
        status: 'missing',
        atnAction: 'Fournir accès API système de réservation (Amadeus/Sabre)',
      },
      {
        id: 'chatbot-widget',
        selector: '.grid.grid-cols-3.gap-6:last-of-type > div:nth-child(2)',
        name: 'Widget Chatbot Tiare',
        description: 'Performance temps réel du chatbot',
        interpretation: 'Conversations/jour, taux résolution (>85% = excellent), temps réponse (<2s = bon).',
        roiImpact: '89% résolution automatique',
        source: 'Webhook chatbot Tiare',
        status: 'ok',
      },
      {
        id: 'upcoming-widget',
        selector: '.grid.grid-cols-3.gap-6:last-of-type > div:last-child',
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
        id: 'conv-stat-total',
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(1)',
        name: 'Total conversations',
        description: 'Nombre total de conversations dans la période',
        interpretation: 'Plus c\'est haut, plus le chatbot est utilisé. Comparez semaine/semaine pour voir la tendance.',
        source: 'Table Airtable Concierge_Logs',
        status: 'ok',
      },
      {
        id: 'conv-stat-time',
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(2)',
        name: 'Temps moyen réponse',
        description: 'Temps moyen de réponse de l\'IA en secondes',
        interpretation: '<1.5s = excellent, 1.5-3s = bon, >3s = à optimiser (vérifier la complexité des questions).',
        roiImpact: 'Instantané vs 5min humain',
        source: 'Champ Temps dans Concierge_Logs',
        status: 'ok',
      },
      {
        id: 'conv-stat-tokens',
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(3)',
        name: 'Tokens utilisés',
        description: 'Consommation API Claude (coût opérationnel)',
        interpretation: '1000 tokens ≈ $0.01. Surveillez les pics = questions complexes ou conversations longues.',
        source: 'Champ Tokens dans Concierge_Logs',
        status: 'ok',
      },
      {
        id: 'conv-stat-langs',
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(4)',
        name: 'Langues détectées',
        description: 'Répartition des langues des visiteurs',
        interpretation: 'FR=français, EN=anglais, JP=japonais, ES=espagnol. Adaptez votre FAQ selon la demande.',
        roiImpact: '4 langues sans traducteur',
        source: 'Détection automatique dans le texte',
        status: 'ok',
      },
      {
        id: 'conv-filters',
        selector: '.flex.gap-4:has(input)',
        fallbackSelector: '.flex.gap-2',
        name: 'Filtres conversations',
        description: 'Recherche et filtrage par langue',
        interpretation: 'Utilisez pour analyser les questions d\'un marché spécifique (ex: japonais pour adapter l\'offre).',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'conv-list',
        selector: '.card:last-of-type',
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
        id: 'news-stat-sent',
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(1)',
        name: 'Emails envoyés',
        description: 'Nombre total d\'emails personnalisés envoyés',
        interpretation: 'Compare au nombre de contacts segmentés. Objectif: 100% de couverture des segments actifs.',
        source: 'Table Newsletter_Logs',
        status: 'ok',
      },
      {
        id: 'news-stat-perso',
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(2)',
        name: 'Score personnalisation',
        description: 'Niveau moyen de personnalisation des emails',
        interpretation: '>90% = excellent (prénom, segment, historique). 70-90% = bon. <70% = améliorer les données CRM.',
        roiImpact: '+25% engagement',
        source: 'Calcul basé sur champs utilisés',
        status: 'ok',
      },
      {
        id: 'news-stat-open',
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(3)',
        name: 'Taux d\'ouverture',
        description: 'Pourcentage d\'emails ouverts',
        interpretation: 'Benchmark email marketing: 20-25%. Avec personnalisation IA: 30-40%. <20% = revoir les objets.',
        roiImpact: '+32% vs emails génériques',
        source: 'API Brevo tracking',
        status: 'warning',
        atnAction: 'Fournir clé API Brevo pour tracking temps réel',
      },
      {
        id: 'news-stat-segments',
        selector: '.grid.grid-cols-2.lg\\:grid-cols-4 > div:nth-child(4)',
        name: 'Segments actifs',
        description: 'Nombre de segments clients configurés',
        interpretation: 'Plus de segments = plus de personnalisation. Minimum recommandé: 5 (Famille, Couple, Solo, Business, Plongée).',
        source: 'Configuration CRM',
        status: 'ok',
      },
      {
        id: 'news-filters',
        selector: '.flex.gap-2:has(button)',
        name: 'Filtres segment',
        description: 'Filtrer les newsletters par segment client',
        interpretation: 'Analysez les performances par segment. Si un segment sous-performe, ajustez le contenu IA.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'news-cards',
        selector: '.space-y-4:last-of-type',
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
        id: 'demo-viewport',
        selector: '.flex.gap-2.p-1',
        name: 'Sélecteur viewport',
        description: 'Testez le chatbot en mode desktop, tablette ou mobile',
        interpretation: 'Vérifiez que l\'expérience est bonne sur tous les appareils. 60% du trafic est mobile.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'demo-iframe',
        selector: '#demo-iframe',
        fallbackSelector: 'iframe',
        name: 'Site démo',
        description: 'Aperçu du site ATN avec le chatbot intégré',
        interpretation: 'La bulle bleue en bas à droite = chatbot Tiare. Cliquez pour tester.',
        source: 'Démo hébergée',
        status: 'ok',
      },
      {
        id: 'demo-tips',
        selector: '.grid.grid-cols-3.gap-4',
        name: 'Conseils de test',
        description: 'Questions suggérées pour tester le chatbot',
        interpretation: 'Testez ces questions types pour valider que le chatbot répond correctement.',
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
        selector: '.grid.grid-cols-4.gap-4',
        fallbackSelector: '.grid.grid-cols-2.lg\\:grid-cols-4',
        name: 'Stats contenu',
        description: 'KPIs de production et performance SEO',
        interpretation: 'Articles publiés, mots générés, score SEO moyen, trafic organique généré.',
        roiImpact: '8 articles/mois automatiques',
        source: 'Table Content_Articles + Google Search Console',
        status: 'warning',
        atnAction: 'Fournir accès Google Search Console du site airtahitinui.com',
      },
      {
        id: 'content-list',
        selector: '.space-y-4',
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
        selector: '.grid.grid-cols-4.gap-4',
        fallbackSelector: '.grid.grid-cols-2.lg\\:grid-cols-4',
        name: 'Stats avis',
        description: 'Volume d\'avis et note moyenne',
        interpretation: 'Note moyenne (objectif >4.5), temps de réponse (<2h), % répondus (objectif 100%).',
        roiImpact: '+0.3 étoiles en moyenne',
        source: 'API Google Business Profile + TripAdvisor',
        status: 'missing',
        atnAction: 'Fournir accès Google Business Profile et TripAdvisor Manager',
      },
      {
        id: 'reviews-list',
        selector: '.space-y-4',
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
        id: 'competitors-alerts',
        selector: '.grid.grid-cols-4.gap-4',
        fallbackSelector: '.grid.grid-cols-2',
        name: 'Alertes actives',
        description: 'Changements détectés nécessitant attention',
        interpretation: 'Rouge=urgent (concurrent moins cher), Ambre=info (nouvelle offre), Vert=positif (vous êtes moins cher).',
        roiImpact: 'Ajustement prix proactif',
        source: 'Scraping quotidien sites concurrents',
        status: 'ok',
      },
      {
        id: 'competitors-table',
        selector: 'table',
        fallbackSelector: '.card:has(table)',
        name: 'Comparatif prix',
        description: 'Tableau des prix par route et concurrent',
        interpretation: 'Vert=vous êtes moins cher, Rouge=concurrent moins cher. Écart en % à droite.',
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
        id: 'reports-stats',
        selector: '.grid.grid-cols-4.gap-4',
        fallbackSelector: '.grid.grid-cols-2',
        name: 'Stats rapports',
        description: 'Nombre de rapports générés et destinataires',
        interpretation: '12 rapports/mois = hebdo + mensuels. Vérifiez que tous les destinataires sont configurés.',
        source: 'Table Reports',
        status: 'ok',
      },
      {
        id: 'reports-list',
        selector: '.space-y-4',
        name: 'Historique rapports',
        description: 'Tous les rapports avec date et statut d\'envoi',
        interpretation: 'Cliquez pour voir le PDF. Vert=envoyé, Ambre=en génération.',
        source: 'Table Reports + Supabase storage',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: FLIGHTS ============
  {
    route: '/flights',
    pageName: 'Vols',
    pageDescription: 'Monitoring des vols et taux de remplissage',
    globalROI: 'Visibilité opérationnelle',
    demoScript: 'Vue temps réel de tous vos vols avec statut et remplissage. Intégration directe avec votre système de réservation.',
    elements: [
      {
        id: 'flights-stats',
        selector: '.grid.grid-cols-4.gap-4',
        fallbackSelector: '.grid.grid-cols-2',
        name: 'Stats vols',
        description: 'KPIs opérationnels du jour',
        interpretation: 'Vols du jour, retards, taux de remplissage moyen, revenus estimés.',
        source: 'API GDS (Amadeus/Sabre)',
        status: 'missing',
        atnAction: 'Fournir accès API système de réservation',
      },
      {
        id: 'flights-table',
        selector: 'table',
        fallbackSelector: '.card:has(table)',
        name: 'Liste des vols',
        description: 'Détail de chaque vol avec statut temps réel',
        interpretation: 'Vert=à l\'heure, Ambre=retard léger, Rouge=retard important/annulé.',
        source: 'API GDS',
        status: 'missing',
        atnAction: 'Documentation API système de réservation',
      },
    ],
  },

  // ============ PAGE: SOCIAL ============
  {
    route: '/social',
    pageName: 'Social Media',
    pageDescription: 'Posts réseaux sociaux générés par IA',
    globalROI: '+50% engagement',
    demoScript: 'L\'IA génère des posts optimisés pour chaque plateforme. Un même contenu est adapté: court pour Twitter, visuel pour Instagram, pro pour LinkedIn.',
    elements: [
      {
        id: 'social-stats',
        selector: '.grid.grid-cols-4.gap-4',
        fallbackSelector: '.grid.grid-cols-2',
        name: 'Stats social',
        description: 'Engagement et reach par plateforme',
        interpretation: 'Engagement rate (likes+comments+shares / followers). Benchmark: 2-5% selon plateforme.',
        source: 'API Meta + Twitter',
        status: 'warning',
        atnAction: 'Fournir accès Meta Business Suite et Twitter Analytics',
      },
      {
        id: 'social-calendar',
        selector: '.card:has(.space-y-4)',
        name: 'Calendrier posts',
        description: 'Posts planifiés avec preview',
        interpretation: 'Vert=publié, Bleu=planifié, Gris=brouillon. Cliquez pour éditer avant publication.',
        source: 'Table Social_Posts',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: ROI DASHBOARD ============
  {
    route: '/roi',
    pageName: 'ROI Dashboard',
    pageDescription: 'Retour sur investissement global de la plateforme IA',
    globalROI: '347% ROI annualisé',
    demoScript: 'Voici le nerf de la guerre: combien la plateforme vous rapporte vs ce qu\'elle coûte. Chaque agent a son ROI détaillé.',
    elements: [
      {
        id: 'roi-global',
        selector: '.card:first-of-type',
        name: 'ROI Global',
        description: 'Retour sur investissement total',
        interpretation: 'ROI = (Gains - Coûts) / Coûts × 100. >200% = excellent, 100-200% = bon, <100% = optimiser.',
        roiImpact: '347% ROI projeté',
        source: 'Calcul agrégé tous agents',
        status: 'ok',
      },
      {
        id: 'roi-breakdown',
        selector: '.grid.grid-cols-3.gap-4',
        fallbackSelector: '.grid.grid-cols-2',
        name: 'Détail par agent',
        description: 'ROI individuel de chaque agent IA',
        interpretation: 'Vert=ROI positif, Rouge=ROI négatif (rare, vérifier la config). Cliquez pour détail.',
        source: 'Calcul par workflow',
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
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, placement: 'bottom' as 'top' | 'bottom' | 'left' | 'right' })
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

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

  // Fonction pour calculer la position du tooltip
  const calculateTooltipPosition = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const tooltipWidth = 400
    const tooltipHeight = 300
    const margin = 16

    let placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
    let top = 0
    let left = 0

    // Espace disponible
    const spaceAbove = rect.top
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceLeft = rect.left
    const spaceRight = window.innerWidth - rect.right

    // Choisir le meilleur placement
    if (spaceBelow >= tooltipHeight + margin) {
      placement = 'bottom'
      top = rect.bottom + margin
      left = rect.left + rect.width / 2 - tooltipWidth / 2
    } else if (spaceAbove >= tooltipHeight + margin) {
      placement = 'top'
      top = rect.top - tooltipHeight - margin
      left = rect.left + rect.width / 2 - tooltipWidth / 2
    } else if (spaceRight >= tooltipWidth + margin) {
      placement = 'right'
      top = rect.top + rect.height / 2 - tooltipHeight / 2
      left = rect.right + margin
    } else {
      placement = 'left'
      top = rect.top + rect.height / 2 - tooltipHeight / 2
      left = rect.left - tooltipWidth - margin
    }

    // Contraindre dans la fenêtre
    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin))
    top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - margin))

    return { top, left, placement }
  }, [])

  // Mettre à jour le highlight quand l'élément change
  useEffect(() => {
    if (!isOpen || !currentElement) {
      setHighlightedElement(null)
      return
    }

    const el = findElement(currentElement.selector, currentElement.fallbackSelector)
    if (el) {
      setHighlightedElement(el)
      setTooltipPosition(calculateTooltipPosition(el))

      // Scroll vers l'élément
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      setHighlightedElement(null)
    }
  }, [isOpen, currentElement, findElement, calculateTooltipPosition])

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
        {/* Bouton flottant */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
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
      {/* Bouton flottant */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Guide interactif</span>
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {elements.length}
          </span>
        </button>
      )}

      {/* Overlay highlight */}
      {isOpen && highlightedElement && (
        <div className="fixed inset-0 z-[90] pointer-events-none">
          {/* Overlay sombre */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Trou pour l'élément highlighté */}
          <div
            className="absolute bg-transparent"
            style={{
              top: highlightedElement.getBoundingClientRect().top - 8,
              left: highlightedElement.getBoundingClientRect().left - 8,
              width: highlightedElement.getBoundingClientRect().width + 16,
              height: highlightedElement.getBoundingClientRect().height + 16,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)',
              borderRadius: '12px',
              border: '3px solid #8b5cf6',
            }}
          />
        </div>
      )}

      {/* Tooltip */}
      {isOpen && currentElement && (
        <div
          className="fixed z-[100] w-[400px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
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
