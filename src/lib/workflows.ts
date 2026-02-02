// Configuration des 25 workflows ATN
export const WORKFLOWS = [
  // Builds 1-10: Agents IA Métier
  {
    id: 1,
    name: 'Concierge IA Multilingue',
    webhook: 'atn-concierge',
    category: 'service',
    description: 'Chatbot multilingue pour répondre aux questions clients',
    color: '#3B82F6',
    page: '/conversations',
  },
  {
    id: 2,
    name: 'Newsletter Personnalisée',
    webhook: 'atn-newsletter-demo',
    category: 'marketing',
    description: 'Génération d\'emails personnalisés par segment',
    color: '#EC4899',
    page: '/newsletters',
  },
  {
    id: 3,
    name: 'Content Factory SEO+GEO',
    webhook: 'atn-seo-content',
    category: 'marketing',
    description: 'Création d\'articles SEO avec images générées',
    color: '#8B5CF6',
    page: '/content',
  },
  {
    id: 4,
    name: 'ROI Analyst',
    webhook: 'atn-roi-analyst',
    category: 'revenue',
    description: 'Analyse des performances et alertes ROI',
    color: '#10B981',
    page: '/roi',
  },
  {
    id: 5,
    name: 'Booking Assistant',
    webhook: 'atn-booking-assistant',
    workflowId: 'dDPAbhFPeIRc9gU4',
    category: 'service',
    description: 'Assistant pour les demandes de réservation',
    color: '#06B6D4',
    page: '/bookings',
  },
  {
    id: 6,
    name: 'Social Monitor',
    webhook: 'atn-social-monitor',
    workflowId: 'XVxINg7uQRCvDCDi',
    category: 'marketing',
    description: 'Surveillance des mentions sur les réseaux sociaux',
    color: '#F59E0B',
    page: '/social',
  },
  {
    id: 7,
    name: 'Competitor Intelligence',
    webhook: 'atn-competitor-intel',
    workflowId: 'Vj3pAXnbDt2tMnP1',
    category: 'revenue',
    description: 'Veille concurrentielle prix et promos',
    color: '#EF4444',
    page: '/competitors',
  },
  {
    id: 8,
    name: 'Flight Notifier',
    webhook: 'atn-flight-notifier',
    workflowId: 'qwatQWUdzJMYFR9L',
    category: 'operations',
    description: 'Alertes retards et annulations de vols',
    color: '#6366F1',
    page: '/flights',
  },
  {
    id: 9,
    name: 'Review Responder',
    webhook: 'atn-review-responder',
    workflowId: 'VEdk4X5rseMYfWxW',
    category: 'service',
    description: 'Réponses automatiques aux avis clients',
    color: '#14B8A6',
    page: '/reviews',
  },
  {
    id: 10,
    name: 'Upsell Engine',
    webhook: 'atn-upsell-engine',
    workflowId: 'fzywRGoEAg2xDCkE',
    category: 'revenue',
    description: 'Offres personnalisées d\'upsell',
    color: '#F97316',
    page: '/upsell',
  },

  // Builds 11-15: Dashboard Management
  {
    id: 11,
    name: 'Dashboard API Hub',
    webhook: 'atn-dashboard-api',
    workflowId: 'Y49udNuyGyUtlzub',
    category: 'internal',
    description: 'API centralisée pour le dashboard',
    color: '#64748B',
    page: null, // Internal
  },
  {
    id: 12,
    name: 'Content Scheduler',
    webhook: 'atn-content-scheduler',
    workflowId: '27fFsoBVYDSwjg0Y',
    category: 'internal',
    description: 'Publication automatique des contenus',
    color: '#64748B',
    page: '/calendar',
  },
  {
    id: 13,
    name: 'Dashboard AI Assistant',
    webhook: 'atn-assistant',
    workflowId: 'j0NhhYp9Di9R2VpN',
    category: 'internal',
    description: 'Assistant IA du dashboard',
    color: '#64748B',
    page: null, // Widget
  },
  {
    id: 14,
    name: 'Report Generator',
    webhook: 'atn-report-generator',
    workflowId: 'Iq9VrM2K7UgG2f0o',
    category: 'internal',
    description: 'Génération de rapports sur demande',
    color: '#64748B',
    page: '/reports',
  },
  {
    id: 15,
    name: 'Smart Content Generator',
    webhook: 'atn-smart-generator',
    workflowId: 'SqQoJF18mKWRJpDC',
    category: 'automation',
    description: 'Génération intelligente de contenu hebdomadaire',
    color: '#A855F7',
    page: '/planner',
  },

  // Builds 16-20: IA Avancée
  {
    id: 16,
    name: 'Review Intelligence (FOX)',
    webhook: 'atn-review-intelligence',
    workflowId: 'dns5fBlQn4yTbysh',
    category: 'analytics',
    description: 'Analyse sentiment + ironie des avis clients',
    color: '#F43F5E',
    page: '/review-intelligence',
  },
  {
    id: 17,
    name: 'Smart Visual Factory',
    webhook: 'atn-visual-factory',
    workflowId: 'gGhUbWgqb45DU4XC',
    category: 'marketing',
    description: 'Génération assets marketing avec Fal.ai',
    color: '#D946EF',
    page: '/visual-factory',
  },
  {
    id: 18,
    name: 'Concierge Pro',
    webhook: 'atn-concierge-pro',
    workflowId: 'UBTOzOAbLU8hRcZg',
    category: 'service',
    description: 'Concierge avec contexte réservation',
    color: '#0EA5E9',
    page: '/concierge-pro',
  },
  {
    id: 19,
    name: 'Staff Assistant TALIA',
    webhook: 'atn-staff-assistant',
    workflowId: '8VSLdWVav46sLsaV',
    category: 'internal',
    description: 'Assistant interne employés ATN',
    color: '#22D3EE',
    page: '/staff-assistant',
  },
  {
    id: 20,
    name: 'Competitor Pricing Monitor',
    webhook: 'atn-pricing-monitor',
    workflowId: 'jD7Sw3JbnRJdQmSp',
    category: 'revenue',
    description: 'Veille tarifaire quotidienne',
    color: '#FB7185',
    page: '/pricing-monitor',
  },

  // Builds 21-25: Marketing Automation V2
  {
    id: 21,
    name: 'Journey Orchestrator',
    webhook: 'atn-journey-trigger',
    workflowId: 'Il04njQNQSLJAyuG',
    category: 'automation',
    description: 'Séquences automatisées multi-étapes',
    color: '#818CF8',
    page: '/journeys',
  },
  {
    id: 22,
    name: 'A/B Test Engine',
    webhook: 'atn-ab-test',
    workflowId: 'zJUwQpMeVHJi59IW',
    category: 'analytics',
    description: 'Tests A/B avec analyse statistique',
    color: '#34D399',
    page: '/ab-tests',
  },
  {
    id: 23,
    name: 'Lead Scoring Engine',
    webhook: 'atn-lead-scoring',
    workflowId: 'vsRuqUxbNgG0OcxL',
    category: 'revenue',
    description: 'Scoring comportemental prospects',
    color: '#FBBF24',
    page: '/lead-scoring',
  },
  {
    id: 24,
    name: 'Attribution Tracker',
    webhook: 'atn-attribution',
    workflowId: 'iknuCue891D2ZGPC',
    category: 'analytics',
    description: 'Multi-touch attribution 5 modèles',
    color: '#FB923C',
    page: '/attribution',
  },
  {
    id: 25,
    name: 'Preference Center',
    webhook: 'atn-preferences',
    workflowId: 'lXc0kaCs96rzZtfU',
    category: 'service',
    description: 'Gestion préférences client RGPD',
    color: '#A3E635',
    page: '/preferences',
  },
]

export const CATEGORIES = {
  service: {
    name: 'Service Client',
    color: '#3B82F6',
    icon: 'Users',
    builds: [1, 5, 9, 18, 25]
  },
  marketing: {
    name: 'Marketing',
    color: '#EC4899',
    icon: 'Megaphone',
    builds: [2, 3, 6, 17]
  },
  operations: {
    name: 'Opérations',
    color: '#6366F1',
    icon: 'Plane',
    builds: [8]
  },
  revenue: {
    name: 'Revenue',
    color: '#10B981',
    icon: 'TrendingUp',
    builds: [4, 7, 10, 20, 23]
  },
  automation: {
    name: 'Automation',
    color: '#A855F7',
    icon: 'Zap',
    builds: [15, 21]
  },
  analytics: {
    name: 'Analytics',
    color: '#F43F5E',
    icon: 'BarChart3',
    builds: [16, 22, 24]
  },
  internal: {
    name: 'Interne',
    color: '#64748B',
    icon: 'Settings',
    builds: [11, 12, 13, 14, 19]
  },
}

export const N8N_WEBHOOK_BASE = 'https://n8n.srv1140766.hstgr.cloud/webhook'

export function getWebhookUrl(webhook: string): string {
  return `${N8N_WEBHOOK_BASE}/${webhook}`
}

export function getWorkflowById(id: number) {
  return WORKFLOWS.find(w => w.id === id)
}

export function getWorkflowsByCategory(category: string) {
  return WORKFLOWS.filter(w => w.category === category)
}

export function getVisibleWorkflows() {
  return WORKFLOWS.filter(w => w.page !== null && w.category !== 'internal')
}

export function getCategoryStats() {
  return Object.entries(CATEGORIES).map(([key, cat]) => ({
    key,
    ...cat,
    count: cat.builds.length,
    workflows: cat.builds.map(id => getWorkflowById(id)).filter(Boolean),
  }))
}
