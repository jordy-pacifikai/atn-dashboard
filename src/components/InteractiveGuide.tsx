'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Key,
  Gift,
  Info
} from 'lucide-react'

// Types
interface ATNRequirement {
  element: string
  source: string
  status: 'ok' | 'warning' | 'missing'
  note?: string
}

interface PageGuide {
  route: string
  pageName: string
  pageDescription: string
  roiMetric?: string
  roiDetails?: string
  benefits?: string[]
  atnRequirements?: ATNRequirement[]
  usageGuide?: string[]
  demoScript?: string
}

// ==========================================
// GUIDE COMPLET DE TOUTES LES PAGES
// ==========================================

const COMPLETE_GUIDE: PageGuide[] = [
  // 1. DASHBOARD
  {
    route: '/',
    pageName: 'Dashboard',
    pageDescription: 'Vue d\'ensemble de toutes les activités IA. C\'est votre cockpit quotidien pour superviser les automatisations.',
    roiMetric: '+35% productivité',
    roiDetails: 'En centralisant toutes les métriques, vous gagnez 2h/jour de compilation manuelle. Sur un mois, c\'est 40h économisées soit environ 400 000 XPF de coût salarial.',
    benefits: [
      'Vision 360° de toutes les automatisations en un coup d\'œil',
      'Détection immédiate des problèmes grâce aux alertes temps réel',
      'Prise de décision rapide basée sur des données actualisées',
      'Plus besoin de compiler manuellement les KPIs de différentes sources'
    ],
    usageGuide: [
      'Ouvrez le dashboard chaque matin pour voir les métriques de la veille',
      'Les cartes KPI en haut montrent les chiffres clés (conversations, newsletters, articles)',
      'Les alertes rouges sont prioritaires - traitez-les en premier',
      'Cliquez sur n\'importe quel widget pour accéder au détail'
    ],
    demoScript: 'Voici votre cockpit quotidien. En un coup d\'œil, vous voyez tout ce qui s\'est passé : combien de conversations le chatbot a gérées, les newsletters parties, les alertes concurrentielles. Tout est automatique, vous n\'avez qu\'à superviser.',
    atnRequirements: [
      { element: 'Stats chatbot', source: 'Webhook n8n → Supabase', status: 'ok', note: 'Automatique via Build 1' },
      { element: 'Stats newsletters', source: 'API Brevo', status: 'warning', note: 'Besoin clé API du compte ATN Brevo' },
      { element: 'Stats SEO', source: 'Google Search Console', status: 'warning', note: 'Besoin accès GSC site airtahitinui.com' },
      { element: 'Alertes concurrence', source: 'Workflow Build 6', status: 'ok', note: 'Configuré et actif' },
      { element: 'Revenus upsell', source: 'API réservations ATN', status: 'missing', note: 'Besoin documentation API système de réservation' }
    ]
  },

  // 2. DEMO SITE
  {
    route: '/demo-site',
    pageName: 'Demo Site',
    pageDescription: 'Testez le chatbot Tiare exactement comme vos visiteurs le voient sur le site Air Tahiti Nui.',
    roiMetric: 'Validation pré-production',
    roiDetails: 'Évite les erreurs en production. Un bug chatbot non détecté peut frustrer des centaines de clients/jour. Cette page permet de valider avant déploiement.',
    benefits: [
      'Test des réponses chatbot avant mise en production',
      'Validation multi-langues (FR, EN, JP, ES) sans quitter le dashboard',
      'Simulation responsive (mobile/tablet/desktop) instantanée',
      'Identification des questions sans réponse pour enrichir la FAQ'
    ],
    usageGuide: [
      'Cliquez sur la bulle bleue en bas à droite pour ouvrir le chatbot',
      'Testez en français, anglais, japonais ou espagnol',
      'Utilisez les boutons Desktop/Tablet/Mobile pour simuler différents appareils',
      'Notez les questions sans réponse satisfaisante pour les ajouter à la FAQ'
    ],
    demoScript: 'Ici vous pouvez tester le chatbot exactement comme vos clients le verront. Cliquez sur la bulle bleue en bas à droite. Essayez de poser une question sur les bagages, ou en anglais sur les vols vers LA, ou même en japonais. Le chatbot répond en 4 langues instantanément, 24/7.',
    atnRequirements: [
      { element: 'Chatbot Tiare', source: 'Workflow n8n Build 1', status: 'ok', note: 'Opérationnel' },
      { element: 'FAQ ATN', source: 'Supabase vector store', status: 'ok', note: '200+ questions indexées' },
      { element: 'Site démo', source: '/public/demo-site-content/', status: 'ok', note: 'Déployé' }
    ]
  },

  // 3. CHATBOT TIARE
  {
    route: '/conversations',
    pageName: 'Chatbot Tiare',
    pageDescription: 'Centre de contrôle de l\'assistant virtuel. Supervisez toutes les conversations clients en temps réel.',
    roiMetric: '40h/mois économisées',
    roiDetails: 'Le chatbot traite en moyenne 500+ requêtes/mois. À 5 min/requête en temps humain = 41h économisées. Au coût horaire standard (10 000 XPF), c\'est 410 000 XPF/mois de valeur générée.',
    benefits: [
      'Service client 24/7 sans augmenter les effectifs',
      'Réponses instantanées vs 4-24h en email traditionnel',
      'Support multilingue automatique (4 langues) sans traducteur',
      'Identification des FAQ manquantes pour amélioration continue',
      'Escalade intelligente vers humain quand nécessaire'
    ],
    usageGuide: [
      'Consultez les conversations de la veille chaque matin',
      'Filtrez par langue, sujet ou satisfaction pour analyser',
      'Les conversations "escaladées" nécessitent une intervention humaine',
      'Cliquez sur "Questions sans réponse" pour enrichir la FAQ'
    ],
    demoScript: 'Voici l\'historique de toutes les conversations du chatbot. Chaque ligne = un client assisté automatiquement. Vous voyez la langue détectée, le sujet, et si le client était satisfait. Si une conversation nécessite une intervention humaine, vous pouvez prendre le relais en un clic.',
    atnRequirements: [
      { element: 'Logs conversations', source: 'Supabase atn_conversations', status: 'ok', note: 'Table créée et alimentée' },
      { element: 'Webhook chatbot', source: 'n8n Build 1', status: 'ok', note: 'Workflow actif' },
      { element: 'Escalade humain', source: 'Email/Slack notification', status: 'warning', note: 'Besoin email équipe support (support@airtahitinui.com ?)' }
    ]
  },

  // 4. CONCIERGE PRO
  {
    route: '/concierge-pro',
    pageName: 'Concierge Pro',
    pageDescription: 'Assistant premium avec contexte réservation. Service 5 étoiles automatisé pour les clients connectés.',
    roiMetric: '+45% satisfaction',
    roiDetails: 'Les clients avec réservation représentent votre cœur de cible. +45% satisfaction = +20% de recommandations = acquisition gratuite de nouveaux clients. Valeur estimée : 2-3M XPF/an.',
    benefits: [
      'Expérience VIP personnalisée (le bot connaît nom, vol, classe)',
      'Suggestions d\'upsell contextuelles (bagage, salon, surclassement)',
      'Réduction des appels au call center pour les clients connectés',
      'Historique client exploité pour service personnalisé',
      'Différenciation concurrentielle forte vs chatbots génériques'
    ],
    usageGuide: [
      'Le Concierge Pro est réservé aux clients connectés sur "Mon Espace"',
      'Il connaît automatiquement leur réservation, vol, classe',
      'Il peut suggérer des services additionnels pertinents',
      'Surveillez les opportunités d\'upsell acceptées'
    ],
    demoScript: 'Le Concierge Pro va plus loin que le chatbot standard. Quand un client est connecté à son espace, l\'IA connaît sa réservation. Elle peut dire "Votre vol pour Tokyo part mardi à 23h30, voulez-vous ajouter un bagage supplémentaire ?" C\'est du service 5 étoiles automatisé.',
    atnRequirements: [
      { element: 'Données réservation', source: 'API GDS (Amadeus/Sabre)', status: 'missing', note: 'CRITIQUE : Besoin documentation API système de réservation ATN' },
      { element: 'Auth client', source: 'SSO ATN / Mon Espace', status: 'missing', note: 'Besoin specs authentification "Mon Espace ATN"' },
      { element: 'Workflow', source: 'n8n Build 18', status: 'ok', note: 'Prêt, attend les données de réservation' }
    ]
  },

  // 5. STAFF ASSISTANT
  {
    route: '/staff-assistant',
    pageName: 'Staff Assistant',
    pageDescription: 'TALIA - Assistant IA pour les employés ATN. Réduit les questions répétitives aux managers.',
    roiMetric: '-30% temps formation',
    roiDetails: 'Formation d\'un nouvel agent = 2-4 semaines. -30% = 3-5 jours gagnés par recrue. Avec 10 recrutements/an, c\'est 30-50 jours de productivité récupérés, soit ~500 000 XPF/an.',
    benefits: [
      'Onboarding accéléré des nouveaux employés',
      'Managers libérés des questions répétitives',
      'Base de connaissances toujours à jour et accessible',
      'Uniformisation des réponses (pas de variations selon qui répond)',
      'Disponibilité 24/7 (équipes en shifts, fuseaux horaires différents)'
    ],
    usageGuide: [
      'TALIA est accessible via l\'intranet ou une app dédiée',
      'Les employés peuvent poser des questions sur les procédures, tarifs, règles bagages',
      'Les questions fréquentes révèlent des lacunes de formation',
      'Ajoutez régulièrement de nouveaux documents à la base'
    ],
    demoScript: 'TALIA, c\'est le chatbot pour vos équipes internes. Un nouvel agent au comptoir peut demander "Quelle est la franchise bagage pour un Poerava Business vers Tokyo ?" et avoir la réponse en 2 secondes au lieu de chercher dans les manuels. Ça réduit de 30% le temps de formation.',
    atnRequirements: [
      { element: 'Base connaissances', source: 'Documents internes ATN', status: 'missing', note: 'Besoin : manuels procédures, politiques RH, guidelines marque, docs tarifs/bagages' },
      { element: 'Workflow', source: 'n8n Build 19', status: 'ok', note: 'Prêt à indexer les documents' },
      { element: 'Interface', source: 'Intranet ou app dédiée', status: 'warning', note: 'À définir : intégration intranet existant ou app standalone ?' }
    ]
  },

  // 6. NEWSLETTERS
  {
    route: '/newsletters',
    pageName: 'Newsletters',
    pageDescription: 'Gestion automatisée des campagnes email avec génération de contenu par IA.',
    roiMetric: '+25% ouverture',
    roiDetails: '+25% d\'ouverture = +25% d\'audience exposée aux offres. Si vous envoyez 50 000 emails/mois, c\'est 12 500 ouvertures supplémentaires. À 0.5% de conversion, c\'est 62 réservations additionnelles.',
    benefits: [
      'Génération automatique du contenu adapté au segment',
      'A/B testing automatisé pour optimiser les performances',
      'Personnalisation à grande échelle (prénom, historique...)',
      'Timing optimal suggéré par l\'IA',
      'Réduction du temps de création de 4h à 30min par campagne'
    ],
    usageGuide: [
      'Créez une campagne en décrivant le sujet et le segment cible',
      'L\'IA génère l\'objet, le préheader et le corps de l\'email',
      'Utilisez l\'A/B testing pour optimiser les objets',
      'Programmez l\'envoi aux heures suggérées par l\'IA'
    ],
    demoScript: 'Ici vous gérez toutes vos newsletters. L\'IA génère le contenu adapté à chaque segment. Vous voyez les stats en temps réel : ouvertures, clics, conversions. L\'A/B testing vous permet de tester différents objets pour maximiser les performances.',
    atnRequirements: [
      { element: 'Compte Brevo', source: 'API Brevo', status: 'warning', note: 'Besoin clé API Brevo du compte ATN ou accès au compte' },
      { element: 'Base contacts', source: 'Export CRM ATN', status: 'warning', note: 'Besoin export initial des abonnés avec segmentation' },
      { element: 'Templates email', source: 'Charte graphique ATN', status: 'warning', note: 'Besoin templates HTML email validés par la marque' },
      { element: 'Workflow', source: 'n8n Build 3', status: 'ok', note: 'Workflow newsletter prêt' }
    ]
  },

  // 7. CONTENU SEO
  {
    route: '/content',
    pageName: 'Contenu SEO',
    pageDescription: 'Génération automatique d\'articles de blog optimisés pour le référencement Google.',
    roiMetric: '+40% trafic organique',
    roiDetails: 'Le SEO est le canal d\'acquisition le moins cher à long terme. +40% de trafic organique = économie de 40% du budget pub équivalent. Si vous dépensez 5M XPF/an en pub, c\'est 2M XPF économisés.',
    benefits: [
      'Articles optimisés SEO générés en 5min vs 4h manuellement',
      'Positionnement sur des mots-clés à forte intention d\'achat',
      'Trafic gratuit et durable (vs pub qui s\'arrête sans budget)',
      'Calendrier éditorial automatisé',
      'Suggestions de sujets basées sur les tendances Google'
    ],
    usageGuide: [
      'L\'IA suggère des sujets à fort potentiel SEO',
      'Cliquez sur un sujet pour lancer la génération',
      'Vérifiez le score SEO et ajustez si besoin',
      'Publiez directement sur le blog ATN'
    ],
    demoScript: 'Cette page génère automatiquement des articles de blog optimisés pour Google. L\'IA analyse les tendances et suggère des sujets. Elle rédige l\'article complet avec les bons mots-clés, la structure H1/H2/H3, les meta descriptions. Un article qui prendrait 4h à rédiger est prêt en 5 minutes.',
    atnRequirements: [
      { element: 'Accès blog ATN', source: 'CMS site web', status: 'warning', note: 'Besoin accès au CMS (WordPress? Autre?) pour publication' },
      { element: 'Google Search Console', source: 'GSC API', status: 'warning', note: 'Besoin accès GSC airtahitinui.com pour analyse SEO' },
      { element: 'Google Analytics', source: 'GA4 API', status: 'warning', note: 'Optionnel : pour tracking conversions depuis articles' },
      { element: 'Workflow', source: 'n8n Build 4', status: 'ok', note: 'Générateur SEO prêt' }
    ]
  },

  // 8. SOCIAL MEDIA
  {
    route: '/social',
    pageName: 'Social Media',
    pageDescription: 'Gestion automatisée des publications sur Facebook, Instagram et LinkedIn.',
    roiMetric: '+50% engagement',
    roiDetails: '+50% engagement = +50% de portée organique (les algorithmes favorisent les posts engageants). Économie de 30% du budget pub social. Si vous investissez 2M XPF/an en social ads, c\'est 600 000 XPF économisés.',
    benefits: [
      'Publication automatique multi-plateformes (FB, IG, LinkedIn)',
      'Contenu adapté à chaque réseau (format, ton, hashtags)',
      'Programmation des posts aux heures optimales',
      'Économie de 10h/semaine de community management',
      'Cohérence de la présence sociale 7j/7'
    ],
    usageGuide: [
      'Décrivez le sujet du post, l\'IA adapte pour chaque plateforme',
      'Programmez les publications aux heures suggérées',
      'Suivez l\'engagement en temps réel',
      'Analysez les posts performants pour répliquer'
    ],
    demoScript: 'Cette page gère vos réseaux sociaux. Décrivez ce que vous voulez publier, l\'IA adapte le contenu pour Facebook, Instagram et LinkedIn automatiquement. Les posts sont programmés aux heures où votre audience est la plus active.',
    atnRequirements: [
      { element: 'Facebook Page', source: 'Meta Business Suite', status: 'warning', note: 'Besoin accès admin page ATN ou rôle "Éditeur"' },
      { element: 'Instagram', source: 'Meta Business Suite', status: 'warning', note: 'Besoin compte IG professionnel lié à la page FB' },
      { element: 'LinkedIn', source: 'LinkedIn API', status: 'warning', note: 'Besoin accès page entreprise ATN' },
      { element: 'Workflow', source: 'n8n Build 5', status: 'ok', note: 'Workflow social media prêt' }
    ]
  },

  // 9. VISUAL FACTORY
  {
    route: '/visual-factory',
    pageName: 'Visual Factory',
    pageDescription: 'Création automatique de visuels marketing avec l\'intelligence artificielle.',
    roiMetric: '10h/mois économisées',
    roiDetails: '10h/mois de graphiste économisées. Coût graphiste externe : ~15 000 XPF/h. Économie : 150 000 XPF/mois. Plus la réactivité : créer un visuel promo en 2min vs 2 jours d\'attente.',
    benefits: [
      'Création de visuels marketing en quelques clics',
      'Templates respectant la charte ATN automatiquement',
      'Génération IA de visuels uniques (paysages, avions...)',
      'Adaptation multi-formats (stories, posts, bannières)',
      'Réactivité maximale pour les promos flash'
    ],
    usageGuide: [
      'Choisissez un template ou décrivez ce que vous voulez',
      'L\'IA génère plusieurs propositions',
      'Ajustez les textes et couleurs si besoin',
      'Exportez en haute résolution'
    ],
    demoScript: 'La Visual Factory génère des visuels marketing automatiquement. Vous décrivez ce que vous voulez - par exemple "promotion -30% sur Bora Bora avec une photo de plage" - et l\'IA crée le visuel. En 2 minutes au lieu de 2 jours avec un graphiste.',
    atnRequirements: [
      { element: 'Charte graphique', source: 'Guidelines ATN', status: 'warning', note: 'Besoin : logos HD, couleurs Pantone/Hex, typographies officielles' },
      { element: 'Banque d\'images', source: 'Photothèque ATN', status: 'warning', note: 'Besoin accès photos officielles (avions, destinations, crew)' },
      { element: 'API Fal.ai', source: 'Génération IA', status: 'ok', note: 'Configuré via n8n Build 17' }
    ]
  },

  // 10. VEILLE CONCURRENCE
  {
    route: '/competitors',
    pageName: 'Veille Concurrence',
    pageDescription: 'Surveillance automatique des prix et promotions de vos concurrents.',
    roiMetric: 'Réagir en 24h',
    roiDetails: 'Une promo concurrent non détectée peut vous faire perdre des parts de marché. Réagir en 24h vs 7 jours = garder 80% des clients hésitants. Potentiellement 5-10M XPF/mois préservés.',
    benefits: [
      'Détection immédiate des promos concurrentes',
      'Comparatif prix automatique et actualisé',
      'Alertes en temps réel (email, dashboard)',
      'Historique des variations pour anticiper les tendances',
      'Avantage stratégique pour ajuster vos offres'
    ],
    usageGuide: [
      'Consultez les alertes chaque matin',
      'Les promotions détectées apparaissent en rouge',
      'Cliquez sur "Créer contre-offre" pour réagir rapidement',
      'Analysez l\'historique pour anticiper les patterns saisonniers'
    ],
    demoScript: 'Cette page surveille vos concurrents automatiquement. Dès qu\'Air France ou French Bee lance une promo, vous êtes alerté. Vous voyez les prix comparés, et vous pouvez créer une contre-offre en un clic. Plus besoin de surveiller manuellement.',
    atnRequirements: [
      { element: 'Scraping concurrents', source: 'APIs publiques', status: 'ok', note: 'Configuré : Air France, French Bee, United, Hawaiian' },
      { element: 'Workflow veille', source: 'n8n Build 6', status: 'ok', note: 'Surveillance quotidienne active' },
      { element: 'Prix ATN temps réel', source: 'API yield management', status: 'warning', note: 'Optionnel : pour comparaison automatique avec vos prix' }
    ]
  },

  // 11. GESTION AVIS
  {
    route: '/reviews',
    pageName: 'Gestion Avis',
    pageDescription: 'Réponses automatiques et intelligentes aux avis clients sur toutes les plateformes.',
    roiMetric: '+0.5 étoile moyenne',
    roiDetails: '+0.5 étoile sur Google/TripAdvisor = +9% de conversions selon les études. Sur 100 000 visiteurs/an qui consultent les avis, c\'est 9 000 réservations additionnelles potentielles.',
    benefits: [
      'Réponses rapides et professionnelles aux avis (positifs et négatifs)',
      'Détection automatique du sentiment et de l\'ironie',
      'Amélioration de l\'e-réputation mesurable',
      'Récupération des clients insatisfaits par réponse empathique',
      'Économie de 8h/mois de modération manuelle'
    ],
    usageGuide: [
      'Les avis sont collectés automatiquement depuis Google, TripAdvisor, etc.',
      'L\'IA génère une réponse adaptée au ton de l\'avis',
      'Validez, modifiez ou régénérez avant envoi',
      'Priorisez les avis 1-2 étoiles (urgents)'
    ],
    demoScript: 'Ici vous gérez tous vos avis clients. L\'IA détecte le sentiment - positif, négatif, ou même l\'ironie. Elle génère une réponse personnalisée que vous validez en un clic. Les avis négatifs sont traités en priorité pour récupérer les clients insatisfaits.',
    atnRequirements: [
      { element: 'Google Business', source: 'API Google My Business', status: 'warning', note: 'Besoin accès propriétaire/admin profil GMB Air Tahiti Nui' },
      { element: 'TripAdvisor', source: 'API TripAdvisor', status: 'warning', note: 'Besoin credentials compte TripAdvisor ATN' },
      { element: 'Trustpilot', source: 'API Trustpilot', status: 'warning', note: 'Optionnel si compte Trustpilot existant' },
      { element: 'Workflow', source: 'n8n Build 7', status: 'ok', note: 'Workflow réponses avis prêt' }
    ]
  },

  // 12. REVIEW INTELLIGENCE
  {
    route: '/review-intelligence',
    pageName: 'Review Intelligence',
    pageDescription: 'Analyse avancée des avis pour détecter les tendances et problèmes récurrents.',
    roiMetric: 'Détecter tendances',
    roiDetails: 'Détecter une tendance négative (ex: retards fréquents) avant qu\'elle n\'impacte la note globale permet d\'agir en amont. Éviter une baisse de 0.3 étoile = préserver 5% de conversions.',
    benefits: [
      'Vue d\'ensemble des thèmes récurrents dans les avis',
      'Détection précoce des problèmes opérationnels',
      'Benchmark automatique vs concurrents',
      'Identification des points forts à valoriser en com',
      'Données pour arbitrer les investissements (service, confort...)'
    ],
    usageGuide: [
      'Analysez les thèmes par catégorie (service, ponctualité, bagages...)',
      'Surveillez les tendances sur 30/60/90 jours',
      'Comparez avec les concurrents',
      'Identifiez vos points forts pour la communication'
    ],
    demoScript: 'Review Intelligence analyse tous vos avis pour détecter les tendances. Si les plaintes sur les retards augmentent de 50%, vous le voyez immédiatement et pouvez agir avant que ça n\'impacte votre note globale. C\'est de l\'intelligence préventive.',
    atnRequirements: [
      { element: 'Historique avis', source: 'Base Gestion Avis', status: 'ok', note: 'Alimenté par Build 7' },
      { element: 'Workflow analyse', source: 'n8n Build 16', status: 'ok', note: 'Review Intelligence actif (analyse sentiment + ironie)' }
    ]
  },

  // 13. LEAD SCORING
  {
    route: '/lead-scoring',
    pageName: 'Lead Scoring',
    pageDescription: 'Qualification automatique des prospects par l\'IA pour prioriser les efforts commerciaux.',
    roiMetric: '+30% conversion',
    roiDetails: '+30% de conversion sur les leads qualifiés = 30% de réservations en plus à effort commercial égal. Si vous convertissez 100 leads/mois, c\'est 30 réservations additionnelles soit ~3M XPF/mois.',
    benefits: [
      'Priorisation automatique des leads les plus chauds',
      'Nurturing personnalisé selon le niveau d\'engagement',
      'Moins de temps perdu sur les leads froids',
      'Meilleur taux de conversion global',
      'Données pour optimiser les campagnes d\'acquisition'
    ],
    usageGuide: [
      'Les leads sont scorés de 0 à 100 automatiquement',
      'Concentrez vos efforts sur les leads >70 (chauds)',
      'L\'IA envoie des emails de nurturing adaptés au score',
      'Personnalisez les critères de scoring selon votre expérience'
    ],
    demoScript: 'Le Lead Scoring qualifie automatiquement vos prospects. Un visiteur qui demande un devis, consulte les prix 3 fois et s\'abonne à la newsletter obtient un score élevé. Vous savez exactement qui relancer en priorité.',
    atnRequirements: [
      { element: 'Données comportement', source: 'Google Analytics / site ATN', status: 'warning', note: 'Besoin tracking comportemental sur le site (pages vues, temps passé)' },
      { element: 'CRM ATN', source: 'Export/API CRM', status: 'warning', note: 'Idéalement sync bidirectionnelle avec le CRM commercial ATN' },
      { element: 'Workflow', source: 'n8n Build 11', status: 'ok', note: 'Lead scoring engine prêt' }
    ]
  },

  // 14. VOLS
  {
    route: '/flights',
    pageName: 'Vols',
    pageDescription: 'Monitoring temps réel de tous les vols ATN avec alertes automatiques.',
    roiMetric: 'Alertes temps réel',
    roiDetails: 'Information proactive des passagers en cas de retard = -40% d\'appels au call center. Sur 50 appels évités/incident × 20 min/appel = 16h économisées par perturbation.',
    benefits: [
      'Vue temps réel de tous les vols ATN',
      'Alertes automatiques retards/annulations',
      'Communication proactive aux passagers concernés',
      'Chatbot informé en temps réel (répond correctement aux questions)',
      'Historique pour analyse des récurrences'
    ],
    usageGuide: [
      'La page affiche tous les vols en temps réel',
      'Les retards apparaissent en orange/rouge selon la durée',
      'Les passagers concernés sont notifiés automatiquement',
      'Le chatbot est mis à jour pour répondre correctement'
    ],
    demoScript: 'Cette page monitore tous vos vols en temps réel. Dès qu\'un retard est détecté, les passagers concernés sont prévenus automatiquement et le chatbot est mis à jour. Moins d\'appels au call center, meilleure satisfaction client.',
    atnRequirements: [
      { element: 'Données vols temps réel', source: 'API OPS ATN ou FlightAware', status: 'missing', note: 'CRITIQUE : Besoin API temps réel des statuts de vols' },
      { element: 'Liste passagers', source: 'API réservations', status: 'missing', note: 'Pour notifier les passagers concernés' },
      { element: 'Workflow', source: 'n8n Build 8', status: 'ok', note: 'Workflow monitoring vols prêt' }
    ]
  },

  // 15. RESERVATIONS
  {
    route: '/bookings',
    pageName: 'Réservations',
    pageDescription: 'Suivi des réservations avec détection d\'opportunités d\'upsell automatique.',
    roiMetric: '+15% upsell',
    roiDetails: '+15% d\'upsell sur les réservations. Si panier moyen = 200 000 XPF et 1000 réservations/mois, 15% d\'upsell à +30 000 XPF moyen = 4.5M XPF/mois de revenus additionnels.',
    benefits: [
      'Vue centralisée de toutes les réservations',
      'Détection automatique des opportunités d\'upsell',
      'Emails de suggestion personnalisés (bagage, siège, salon)',
      'Gestion simplifiée des modifications',
      'Analyse des tendances de réservation'
    ],
    usageGuide: [
      'Les réservations récentes s\'affichent automatiquement',
      'Les opportunités d\'upsell sont mises en évidence',
      'L\'IA envoie des emails de suggestion aux bons moments',
      'Suivez le taux d\'acceptation des upsells'
    ],
    demoScript: 'Cette page centralise toutes les réservations. L\'IA détecte les opportunités d\'upsell - par exemple un vol long-courrier sans bagage supplémentaire - et envoie automatiquement un email de suggestion au client. +15% de revenus additionnels.',
    atnRequirements: [
      { element: 'API réservations', source: 'GDS (Amadeus/Sabre)', status: 'missing', note: 'CRITIQUE : Besoin accès API système de réservation' },
      { element: 'Catalogue produits', source: 'Liste ancillaries ATN', status: 'warning', note: 'Liste des produits upsell avec prix' },
      { element: 'Workflow', source: 'n8n Build 9', status: 'ok', note: 'Workflow upsell automation prêt' }
    ]
  },

  // 16. CALENDRIER
  {
    route: '/calendar',
    pageName: 'Calendrier',
    pageDescription: 'Planning de toutes les publications et actions marketing.',
    roiMetric: 'Organisation auto',
    roiDetails: 'Un calendrier éditorial bien géré = régularité de publication = meilleur référencement et engagement. Économie de 4h/semaine de coordination. Évite les "trous" dans la communication.',
    benefits: [
      'Vue d\'ensemble de toutes les publications prévues',
      'Coordination facile entre équipes (marketing, social, comm)',
      'Évite les doublons et les périodes vides',
      'Drag-and-drop pour réorganiser facilement',
      'Suggestions de créneaux optimaux par l\'IA'
    ],
    usageGuide: [
      'Tous les contenus programmés apparaissent sur le calendrier',
      'Glissez-déposez pour changer les dates',
      'Les créneaux verts sont recommandés par l\'IA',
      'Évitez les jours sans publication'
    ],
    demoScript: 'Le calendrier centralise toutes vos publications : newsletters, posts sociaux, articles de blog. Vous voyez en un coup d\'œil ce qui est prévu et pouvez réorganiser par simple glisser-déposer.',
    atnRequirements: [
      { element: 'Données agrégées', source: 'Workflows newsletter/social/SEO', status: 'ok', note: 'Alimenté automatiquement par les autres modules' }
    ]
  },

  // 17. PARCOURS CLIENT
  {
    route: '/journeys',
    pageName: 'Parcours Client',
    pageDescription: 'Visualisation et automatisation du customer journey de bout en bout.',
    roiMetric: '+20% rétention',
    roiDetails: '+20% de rétention = +20% de clients qui revoyagent avec ATN. Acquérir un nouveau client coûte 5x plus cher que fidéliser. Énorme valeur à long terme.',
    benefits: [
      'Visualisation complète du parcours client (découverte → fidélisation)',
      'Automatisation des touchpoints clés (J-7, J-1, J+1, J+30)',
      'Détection des points d\'abandon pour optimisation',
      'Personnalisation de l\'expérience à chaque étape',
      'Mesure de l\'efficacité de chaque touchpoint'
    ],
    usageGuide: [
      'La carte du parcours montre chaque étape du client',
      'Les touchpoints automatisés sont indiqués en vert',
      'Analysez les taux d\'abandon par étape',
      'Optimisez les étapes faibles'
    ],
    demoScript: 'Le parcours client visualise toute l\'expérience de vos clients de A à Z. Des emails automatiques sont envoyés aux moments clés : rappel J-7 avec checklist, notification J-1 pour le check-in, remerciement J+1, offre fidélité J+30. Tout est automatisé.',
    atnRequirements: [
      { element: 'Données réservation', source: 'API GDS', status: 'missing', note: 'Pour déclencher les touchpoints au bon moment' },
      { element: 'Email transactionnel', source: 'Brevo ou SMTP ATN', status: 'warning', note: 'Pour envoyer les emails du parcours' },
      { element: 'Workflow', source: 'n8n Build 10', status: 'ok', note: 'Workflow customer journey prêt' }
    ]
  },

  // 18. RAPPORTS
  {
    route: '/reports',
    pageName: 'Rapports',
    pageDescription: 'Génération automatique de rapports de performance avec insights IA.',
    roiMetric: '3h/semaine économisées',
    roiDetails: 'Compilation manuelle d\'un rapport hebdo = 3-4h. × 52 semaines = 200h/an économisées. Plus : insights IA que vous n\'auriez jamais trouvés manuellement.',
    benefits: [
      'Rapports automatiques chaque lundi sans effort',
      'Templates personnalisables (hebdo, mensuel, campagne)',
      'Insights IA (tendances, anomalies, recommandations)',
      'Export PDF ou lien dashboard partageable',
      'Historique pour comparaison période vs période'
    ],
    usageGuide: [
      'Les rapports sont générés automatiquement chaque lundi',
      'Choisissez le template adapté à votre besoin',
      'L\'IA ajoute des insights et recommandations',
      'Exportez en PDF ou partagez le lien'
    ],
    demoScript: 'Les rapports sont générés automatiquement chaque lundi matin dans votre boîte mail. Vous avez les KPIs de la semaine, les tendances, et surtout les insights IA : l\'IA a détecté telle anomalie, recommande telle action. Vous gagnez des heures d\'analyse.',
    atnRequirements: [
      { element: 'Données des autres modules', source: 'Agrégation interne', status: 'ok', note: 'Les rapports compilent les données des autres pages' },
      { element: 'Destinataires', source: 'Emails équipe', status: 'warning', note: 'Liste des emails pour envoi automatique des rapports' }
    ]
  },

  // 19. ATTRIBUTION
  {
    route: '/attribution',
    pageName: 'Attribution',
    pageDescription: 'Identifiez précisément l\'origine de chaque vente pour optimiser vos investissements.',
    roiMetric: 'ROI par canal',
    roiDetails: 'Savoir d\'où viennent vos ventes permet d\'optimiser les budgets. Réallouer 20% du budget des canaux faibles vers les canaux forts = +20% de ROI marketing global.',
    benefits: [
      'Vision claire de l\'origine de chaque réservation',
      'ROI précis par canal marketing',
      'Optimisation des budgets publicitaires',
      'Compréhension du parcours multi-touchpoint',
      'Données pour négocier avec les agences/partenaires'
    ],
    usageGuide: [
      'Analysez la répartition des ventes par canal',
      'Comparez le ROI de chaque canal',
      'Réallouez les budgets vers les canaux performants',
      'Étudiez les chemins de conversion multi-touchpoint'
    ],
    demoScript: 'L\'attribution vous dit exactement d\'où viennent vos ventes. Vous voyez que le SEO génère 30% des conversions à coût quasi-nul, tandis que Google Ads coûte cher pour peu de résultats. Vous pouvez réallouer vos budgets intelligemment.',
    atnRequirements: [
      { element: 'Google Analytics 4', source: 'GA4 API', status: 'warning', note: 'Besoin accès GA4 avec tracking e-commerce configuré' },
      { element: 'UTM tracking', source: 'Paramètres URL', status: 'warning', note: 'Les campagnes doivent utiliser les UTM correctement' },
      { element: 'Données réservation', source: 'API GDS', status: 'missing', note: 'Pour matcher conversions et réservations' }
    ]
  },

  // 20. A/B TESTS
  {
    route: '/ab-tests',
    pageName: 'A/B Tests',
    pageDescription: 'Optimisation continue par expérimentation contrôlée.',
    roiMetric: '+15% conversion',
    roiDetails: 'Chaque A/B test gagnant améliore les conversions de 5-15%. 4 tests réussis/an avec +10% chacun = +46% cumulé. Impact massif sur le long terme.',
    benefits: [
      'Décisions basées sur des données, pas des opinions',
      'Amélioration continue et mesurable',
      'Suggestions de tests par l\'IA (idées + impact estimé)',
      'Résultats avec significance statistique',
      'Historique des tests pour capitaliser sur les learnings'
    ],
    usageGuide: [
      'L\'IA suggère des tests à fort impact potentiel',
      'Lancez un test en définissant les 2 variantes',
      'Attendez la significance statistique avant de conclure',
      'Appliquez le gagnant et lancez le test suivant'
    ],
    demoScript: 'L\'A/B testing vous permet de tester différentes versions et de garder la meilleure. Par exemple, 2 objets d\'email différents : vous envoyez à 10% de la base, et le gagnant part aux 90% restants. Décisions basées sur des données, pas des intuitions.',
    atnRequirements: [
      { element: 'Intégration site', source: 'Script A/B testing', status: 'warning', note: 'Besoin d\'injecter un script sur le site ATN pour les tests' },
      { element: 'Google Analytics', source: 'GA4 API', status: 'warning', note: 'Pour mesurer l\'impact des variantes' }
    ]
  },

  // 21. ROI DASHBOARD
  {
    route: '/roi',
    pageName: 'ROI Dashboard',
    pageDescription: 'Vue globale du retour sur investissement de toute la plateforme PACIFIK\'AI.',
    roiMetric: 'Vue globale',
    roiDetails: 'Cette page centralise TOUS les gains générés par la plateforme. Objectif : démontrer un ROI > 500% (5x l\'investissement) dès le 3ème mois.',
    benefits: [
      'Justification chiffrée de l\'investissement IA',
      'Données pour vos reportings direction',
      'Identification des modules les plus rentables',
      'Projection du ROI sur 12 mois',
      'Arguments factuels pour étendre le projet'
    ],
    usageGuide: [
      'Consultez le ROI total en haut de page',
      'Analysez les économies de temps par module',
      'Vérifiez l\'impact sur les revenus',
      'Utilisez ces chiffres pour vos reportings'
    ],
    demoScript: 'Le ROI Dashboard centralise tout ce que la plateforme vous fait gagner. Temps économisé : 40h/mois pour le chatbot, 15h/mois pour les newsletters... Revenus générés : upsells, conversions newsletter... Vous voyez en temps réel la rentabilité de votre investissement.',
    atnRequirements: [
      { element: 'Données agrégées', source: 'Tous les modules', status: 'ok', note: 'Compilation automatique des économies et revenus' }
    ]
  },

  // 22. UPSELL ENGINE
  {
    route: '/upsell',
    pageName: 'Upsell Engine',
    pageDescription: 'Configuration du moteur de recommandations pour maximiser le panier moyen.',
    roiMetric: '+25% panier moyen',
    roiDetails: '+25% de panier moyen grâce aux recommandations intelligentes. Sur 1000 réservations/mois à 200 000 XPF moyen, c\'est 50M XPF de revenus additionnels potentiels.',
    benefits: [
      'Suggestions d\'upsell personnalisées et pertinentes',
      'Configuration fine des règles de recommandation',
      'Optimisation automatique basée sur les conversions',
      'Multi-canal : chatbot, email, site web',
      'Mesure précise du revenu généré par recommandation'
    ],
    usageGuide: [
      'Configurez les produits à proposer (bagages, sièges, salon...)',
      'Définissez les règles de recommandation',
      'L\'IA optimise automatiquement selon les conversions',
      'Suivez le revenu généré par recommandation'
    ],
    demoScript: 'L\'Upsell Engine configure les recommandations de produits additionnels. Bagage supplémentaire, accès salon, surclassement... L\'IA apprend quoi proposer à qui et optimise automatiquement pour maximiser les conversions.',
    atnRequirements: [
      { element: 'Catalogue produits', source: 'Liste ancillaries ATN', status: 'warning', note: 'Liste des produits upsell avec prix et conditions' },
      { element: 'API réservation', source: 'GDS', status: 'missing', note: 'Pour connaître ce que le client a déjà acheté' },
      { element: 'Workflow', source: 'n8n Build 14', status: 'ok', note: 'Upsell engine prêt' }
    ]
  },

  // 23. PREFERENCES
  {
    route: '/preferences',
    pageName: 'Préférences',
    pageDescription: 'Personnalisation de votre expérience dashboard.',
    roiMetric: 'Confort utilisateur',
    roiDetails: 'Une interface bien configurée = utilisation quotidienne effective. Si le dashboard n\'est pas agréable à utiliser, il sera abandonné.',
    benefits: [
      'Notifications personnalisées (éviter le spam, garder l\'essentiel)',
      'Dashboard adapté à vos besoins (widgets, ordre)',
      'Thème clair/sombre selon vos préférences',
      'Fuseau horaire correct (important pour la Polynésie)'
    ],
    usageGuide: [
      'Configurez les notifications selon vos besoins',
      'Personnalisez l\'ordre des widgets',
      'Choisissez le thème clair ou sombre',
      'Vérifiez le fuseau horaire'
    ],
    demoScript: 'Dans les préférences, vous personnalisez votre dashboard. Notifications, thème, fuseau horaire... Tout est configurable pour que vous utilisiez la plateforme efficacement au quotidien.',
    atnRequirements: [
      { element: 'Aucun', source: 'Configuration interne', status: 'ok', note: 'Cette page est purement côté dashboard' }
    ]
  },

  // 24. PRIX CONCURRENTS
  {
    route: '/pricing-monitor',
    pageName: 'Prix Concurrents',
    pageDescription: 'Monitoring détaillé et historique des tarifs de vos concurrents.',
    roiMetric: 'Compétitivité prix',
    roiDetails: 'Être compétitif sur le prix est crucial dans l\'aérien. Surveiller les prix concurrents permet d\'ajuster votre yield management.',
    benefits: [
      'Comparatif prix en temps réel par route',
      'Historique des variations de prix concurrents',
      'Alertes sur les baisses de prix significatives',
      'Données pour le yield management',
      'Benchmark permanent vs le marché'
    ],
    usageGuide: [
      'Consultez le comparatif prix par route',
      'Les cellules rouges = vous êtes plus cher',
      'Analysez l\'historique pour anticiper les patterns',
      'Configurez des alertes sur vos routes stratégiques'
    ],
    demoScript: 'Le monitoring des prix vous montre exactement où vous vous situez vs la concurrence. Par route, par classe. Si vous êtes 20% plus cher qu\'Air France sur PPT-CDG, vous le voyez immédiatement.',
    atnRequirements: [
      { element: 'Scraping concurrents', source: 'APIs publiques', status: 'ok', note: 'Configuré via Build 20' },
      { element: 'Prix ATN', source: 'API yield management', status: 'warning', note: 'Optionnel : vos prix pour comparaison directe' }
    ]
  },

  // 25. PLANNER
  {
    route: '/planner',
    pageName: 'Planner',
    pageDescription: 'Outil de planification de voyage pour aider les clients à créer des itinéraires.',
    roiMetric: '+15% panier multi-îles',
    roiDetails: 'Les voyages multi-îles ont un panier moyen 2-3x supérieur au mono-île. +15% de conversion vers multi-îles = revenus significativement augmentés.',
    benefits: [
      'Aide les clients à planifier des voyages complexes',
      'Suggère des itinéraires optimisés',
      'Augmente les ventes multi-destinations',
      'Réduction des demandes "sur mesure" au call center',
      'Intégré au chatbot pour réponses enrichies'
    ],
    usageGuide: [
      'Les clients construisent leur voyage île par île',
      'L\'IA suggère des itinéraires optimisés',
      'Les templates sont prêts pour les demandes classiques',
      'Le chatbot peut utiliser le planner pour répondre'
    ],
    demoScript: 'Le Planner aide vos clients à créer des voyages multi-îles. Ils sélectionnent les îles, l\'IA optimise l\'itinéraire et suggère la durée idéale. Les paniers multi-îles sont 2-3x plus élevés que les mono-îles.',
    atnRequirements: [
      { element: 'Catalogue îles', source: 'Contenu ATN', status: 'warning', note: 'Descriptions et photos des destinations' },
      { element: 'Connexions inter-îles', source: 'Programme vols ATI', status: 'warning', note: 'Horaires et disponibilités Air Tahiti (domestique)' }
    ]
  },

  // 26. GUIDE
  {
    route: '/guide',
    pageName: 'Guide',
    pageDescription: 'Aide et documentation complète de la plateforme.',
    roiMetric: 'Autonomie utilisateur',
    roiDetails: 'Un utilisateur autonome = moins de support nécessaire. Les tutoriels réduisent de 80% les demandes de support basiques.',
    benefits: [
      'Prise en main rapide de la plateforme',
      'Tutoriels vidéo pour chaque fonctionnalité',
      'Contact support direct si besoin',
      'FAQ des questions fréquentes'
    ],
    usageGuide: [
      'Suivez le guide de démarrage rapide',
      'Regardez les tutoriels vidéo par fonctionnalité',
      'Consultez la FAQ pour les questions courantes',
      'Contactez le support si besoin'
    ],
    demoScript: 'La page Guide contient toute la documentation pour utiliser la plateforme. Tutoriels vidéo, FAQ, et contact support direct. Tout ce qu\'il faut pour être autonome.',
    atnRequirements: [
      { element: 'Aucun', source: 'Documentation intégrée', status: 'ok', note: 'Tout est inclus dans le dashboard' }
    ]
  },

  // 27. PARAMETRES
  {
    route: '/settings',
    pageName: 'Paramètres',
    pageDescription: 'Configuration technique et gestion des intégrations.',
    roiMetric: 'Maintenance système',
    roiDetails: 'Cette page permet de monitorer les connexions aux services externes. Une clé API expirée = fonctionnalité cassée. Surveillance proactive = continuité de service.',
    benefits: [
      'Vue d\'ensemble des connexions API',
      'Gestion des accès utilisateurs',
      'Logs techniques pour debug',
      'Alertes sur les problèmes techniques'
    ],
    usageGuide: [
      'Vérifiez que toutes les API sont connectées (vert)',
      'Les clés expirées apparaissent en rouge',
      'Gérez les accès utilisateurs de votre équipe',
      'Consultez les logs en cas de problème'
    ],
    demoScript: 'Les paramètres montrent l\'état de toutes les connexions techniques. Si une API est déconnectée, vous le voyez immédiatement. Vous pouvez aussi gérer les accès de votre équipe ici.',
    atnRequirements: [
      { element: 'Toutes les clés API', source: 'Services externes', status: 'warning', note: 'Cette page liste toutes les intégrations et leur statut' }
    ]
  }
]

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================

interface InteractiveGuideProps {
  isOpen?: boolean
  onComplete?: () => void
}

export default function InteractiveGuide({ isOpen: externalIsOpen, onComplete }: InteractiveGuideProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = externalIsOpen !== undefined
  const isOpen = isControlled ? externalIsOpen : internalIsOpen

  const setIsOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(value)
    }
    if (!value && onComplete) {
      onComplete()
    }
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'requirements'>('overview')
  const pathname = usePathname()
  const router = useRouter()

  // Trouver le guide de la page actuelle
  const currentPageGuide = COMPLETE_GUIDE.find(g => g.route === pathname)

  // Reset tab quand on change de page
  useEffect(() => {
    setActiveTab('overview')
  }, [pathname])

  const navigateToPage = (route: string) => {
    router.push(route)
  }

  // Bouton flottant quand fermé
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <BookOpen className="w-5 h-5" />
        <span className="font-medium">Guide interactif</span>
      </button>
    )
  }

  return (
    <>
      {/* Overlay sombre */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal du guide */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex">
        {/* Sidebar - Navigation entre pages */}
        <div className="w-64 bg-slate-900 rounded-l-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" />
              Guide des pages
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {COMPLETE_GUIDE.map((page) => {
              const isActive = page.route === pathname
              const hasWarnings = page.atnRequirements?.some(r => r.status === 'warning')
              const hasMissing = page.atnRequirements?.some(r => r.status === 'missing')

              return (
                <button
                  key={page.route}
                  onClick={() => navigateToPage(page.route)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between gap-2 transition-colors ${
                    isActive
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{page.pageName}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {hasMissing && <XCircle className="w-3 h-3 text-red-400" />}
                    {hasWarnings && !hasMissing && <AlertCircle className="w-3 h-3 text-amber-400" />}
                    {!hasWarnings && !hasMissing && <CheckCircle className="w-3 h-3 text-green-400" />}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="p-3 border-t border-slate-700">
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span>Prêt</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>En attente d'infos</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-red-400" />
                <span>Bloquant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 bg-white rounded-r-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {currentPageGuide?.pageName || 'Page non documentée'}
                </h1>
                <p className="text-violet-100">
                  {currentPageGuide?.pageDescription || 'Cette page n\'a pas encore de documentation.'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {currentPageGuide?.roiMetric && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-sm">
                <TrendingUp className="w-4 h-4" />
                ROI estimé : <strong>{currentPageGuide.roiMetric}</strong>
              </div>
            )}
          </div>

          {/* Tabs */}
          {currentPageGuide && (
            <div className="border-b border-slate-200 px-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Info className="w-4 h-4 inline mr-2" />
                  Vue d'ensemble
                </button>
                <button
                  onClick={() => setActiveTab('usage')}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'usage'
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Comment utiliser
                </button>
                <button
                  onClick={() => setActiveTab('requirements')}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'requirements'
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Key className="w-4 h-4 inline mr-2" />
                  Prérequis ATN
                </button>
              </div>
            </div>
          )}

          {/* Contenu de l'onglet */}
          <div className="flex-1 overflow-y-auto p-6">
            {!currentPageGuide ? (
              <div className="text-center text-slate-500 py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Cette page n'a pas encore de documentation dans le guide.</p>
              </div>
            ) : activeTab === 'overview' ? (
              <div className="space-y-6">
                {/* ROI détaillé */}
                {currentPageGuide.roiDetails && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Retour sur investissement
                    </h3>
                    <p className="text-green-800">{currentPageGuide.roiDetails}</p>
                  </div>
                )}

                {/* Bénéfices */}
                {currentPageGuide.benefits && currentPageGuide.benefits.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Bénéfices pour vous
                    </h3>
                    <ul className="space-y-2">
                      {currentPageGuide.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-blue-800">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Script démo */}
                {currentPageGuide.demoScript && (
                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                    <h3 className="font-semibold text-violet-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Script de démonstration (Jordy)
                    </h3>
                    <p className="text-violet-800 italic">"{currentPageGuide.demoScript}"</p>
                  </div>
                )}
              </div>
            ) : activeTab === 'usage' ? (
              <div className="space-y-6">
                {/* Guide d'utilisation */}
                {currentPageGuide.usageGuide && currentPageGuide.usageGuide.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Comment utiliser cette page</h3>
                    <ol className="space-y-3">
                      {currentPageGuide.usageGuide.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-sm font-semibold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-slate-700 pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Prérequis ATN */}
                {currentPageGuide.atnRequirements && currentPageGuide.atnRequirements.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Ce qu'Air Tahiti Nui doit fournir pour activer cette page
                    </h3>
                    <div className="space-y-3">
                      {currentPageGuide.atnRequirements.map((req, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl border ${
                            req.status === 'ok'
                              ? 'bg-green-50 border-green-200'
                              : req.status === 'warning'
                              ? 'bg-amber-50 border-amber-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {req.status === 'ok' ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : req.status === 'warning' ? (
                              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-slate-900">{req.element}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  req.status === 'ok'
                                    ? 'bg-green-100 text-green-700'
                                    : req.status === 'warning'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {req.status === 'ok' ? 'Configuré' : req.status === 'warning' ? 'En attente' : 'Manquant'}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 mt-1">Source : {req.source}</p>
                              {req.note && (
                                <p className={`text-sm mt-2 ${
                                  req.status === 'ok'
                                    ? 'text-green-700'
                                    : req.status === 'warning'
                                    ? 'text-amber-700'
                                    : 'text-red-700'
                                }`}>
                                  {req.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>Cette page est prête à l'emploi sans prérequis supplémentaires.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4 flex items-center justify-between bg-slate-50">
            <p className="text-sm text-slate-500">
              {COMPLETE_GUIDE.findIndex(g => g.route === pathname) + 1} / {COMPLETE_GUIDE.length} pages documentées
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentIdx = COMPLETE_GUIDE.findIndex(g => g.route === pathname)
                  if (currentIdx > 0) {
                    navigateToPage(COMPLETE_GUIDE[currentIdx - 1].route)
                  }
                }}
                disabled={COMPLETE_GUIDE.findIndex(g => g.route === pathname) === 0}
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
              <button
                onClick={() => {
                  const currentIdx = COMPLETE_GUIDE.findIndex(g => g.route === pathname)
                  if (currentIdx < COMPLETE_GUIDE.length - 1) {
                    navigateToPage(COMPLETE_GUIDE[currentIdx + 1].route)
                  }
                }}
                disabled={COMPLETE_GUIDE.findIndex(g => g.route === pathname) === COMPLETE_GUIDE.length - 1}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-30"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
