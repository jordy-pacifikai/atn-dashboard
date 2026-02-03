'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  LayoutDashboard, Mail, FileText, TrendingUp, MessageCircle,
  HelpCircle, Sparkles, Target, Zap, CheckCircle, Clock,
  ArrowRight, Play, Bot, BarChart3, Shield,
  AlertTriangle, XCircle, Info, Database, Book, Users,
  Plane, Star, Eye, Calendar, Settings, CreditCard,
  Image as ImageIcon, Globe, Search, ChevronDown, ChevronRight,
  Headphones, Route, Compass
} from 'lucide-react'
import SidebarGuide from '@/components/SidebarGuide'

// Component to handle search params (must be wrapped in Suspense)
function GuideAutoLauncher({ onAutoLaunch }: { onAutoLaunch: () => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const autoLaunch = searchParams.get('sidebar') === 'true' || searchParams.get('auto') === 'true'
    if (autoLaunch) {
      onAutoLaunch()
    }
  }, [searchParams, onAutoLaunch])

  return null
}

// ============ GLOSSAIRE DES TERMES ============
const glossary = [
  {
    term: 'ETP (Équivalent Temps Plein)',
    definition: 'Mesure RH représentant 1 employé à temps complet (environ 151h/mois en France, 173h/mois à Tahiti). 0.5 ETP = la moitié du travail d\'un employé, soit environ 75-85h/mois. Utilisé pour quantifier les économies en ressources humaines.',
    example: '"L\'IA économise 0.5 ETP" = L\'IA fait le travail d\'un mi-temps, soit environ 2,000€/mois d\'économie salariale.',
    category: 'RH',
  },
  {
    term: 'ROI (Return On Investment)',
    definition: 'Retour sur investissement. Formule: (Gains - Coûts) / Coûts × 100. Un ROI de 200% signifie que pour 1€ investi, vous récupérez 2€ de bénéfice net.',
    example: 'Investissement: 500,000 XPF/mois. Gains: 1,500,000 XPF/mois → ROI = 200%',
    category: 'Finance',
  },
  {
    term: 'Taux de conversion',
    definition: 'Pourcentage de visiteurs qui réalisent l\'action souhaitée (achat, inscription, clic). Calculé: (Conversions / Visiteurs) × 100.',
    example: '1000 visiteurs chatbot, 120 cliquent sur "Réserver" → Taux = 12%',
    category: 'Marketing',
  },
  {
    term: 'Taux d\'ouverture (Open Rate)',
    definition: 'Pourcentage d\'emails ouverts par rapport aux emails délivrés. Benchmark email marketing: 20-25%. Avec personnalisation IA: 30-40%.',
    example: '1000 emails envoyés, 320 ouverts → Taux = 32%',
    category: 'Email Marketing',
  },
  {
    term: 'Taux de résolution',
    definition: 'Pourcentage de conversations chatbot résolues sans intervention humaine. Un taux >85% est considéré excellent.',
    example: '100 conversations, 89 résolues par l\'IA seule → Taux = 89%',
    category: 'Chatbot',
  },
  {
    term: 'Token',
    definition: 'Unité de mesure pour les modèles IA. 1 token ≈ 4 caractères en anglais, ≈ 2-3 caractères en français. Sert à calculer le coût des appels API.',
    example: '"Bonjour, comment puis-je vous aider ?" = environ 12 tokens',
    category: 'IA',
  },
  {
    term: 'Webhook',
    definition: 'URL qui reçoit des données automatiquement quand un événement se produit. Permet la communication temps réel entre systèmes.',
    example: 'Quand un client envoie un message, un webhook envoie les données au workflow n8n qui traite la demande.',
    category: 'Technique',
  },
  {
    term: 'Workflow',
    definition: 'Séquence automatisée d\'actions. Un workflow n8n peut recevoir une demande, appeler une IA, envoyer un email, mettre à jour une base de données, etc.',
    example: 'Workflow "Newsletter": Récupère contacts → Génère contenu IA → Envoie via Brevo → Log les stats',
    category: 'Automatisation',
  },
  {
    term: 'Segment (client)',
    definition: 'Groupe de clients partageant des caractéristiques communes. Permet de personnaliser les communications.',
    example: 'Segments ATN: Lune de miel, Famille, Plongeurs, Business, Premium',
    category: 'Marketing',
  },
  {
    term: 'SEO (Search Engine Optimization)',
    definition: 'Optimisation pour les moteurs de recherche. Techniques pour améliorer le positionnement d\'un site dans Google.',
    example: 'Score SEO 85/100 = Article bien optimisé pour les mots-clés cibles',
    category: 'Marketing',
  },
  {
    term: 'GDS (Global Distribution System)',
    definition: 'Système de réservation utilisé par les compagnies aériennes (Amadeus, Sabre, etc.). Contient les vols, disponibilités, tarifs.',
    example: 'ATN utilise probablement Amadeus ou Sabre pour gérer ses réservations.',
    category: 'Aviation',
  },
  {
    term: 'Scraping',
    definition: 'Extraction automatique de données depuis des sites web. Utilisé pour la veille concurrentielle.',
    example: 'Le workflow vérifie les prix French Bee chaque jour en "scrappant" leur site.',
    category: 'Technique',
  },
  {
    term: 'Lead Scoring',
    definition: 'Attribution d\'un score aux prospects selon leur probabilité d\'achat. Plus le score est élevé, plus le prospect est "chaud".',
    example: 'Score 85/100 = prospect très intéressé, à contacter en priorité',
    category: 'Commercial',
  },
  {
    term: 'Attribution (marketing)',
    definition: 'Identification du canal marketing qui a généré une conversion. Permet de savoir où investir le budget.',
    example: 'Attribution: 40% Google Ads, 30% Newsletter, 20% Chatbot, 10% Direct',
    category: 'Marketing',
  },
  {
    term: 'A/B Test',
    definition: 'Test comparatif de 2 versions (A et B) pour déterminer laquelle performe le mieux.',
    example: 'A/B test objet email: "Promo -20%" vs "Offre exclusive" → Version B +15% ouvertures',
    category: 'Marketing',
  },
]

// ============ CONFIGURATION DES PAGES ============
const pageDocumentation = [
  {
    category: 'ACCUEIL',
    pages: [
      {
        name: 'Dashboard',
        route: '/',
        icon: LayoutDashboard,
        description: 'Vue d\'ensemble de tous vos agents IA et KPIs principaux',
        roi: '+35% productivité marketing',
        elements: [
          {
            name: 'KPIs principaux (4 cartes)',
            what: 'Conversations, Temps économisé, Satisfaction, Taux conversion',
            how: 'Chaque carte montre la valeur actuelle + tendance (flèche verte/rouge) + période de comparaison',
            why: 'Permet de voir en 5 secondes si tout va bien ou s\'il y a un problème à traiter',
            source: 'Agrégation automatique des données de tous les workflows',
            status: 'ok',
          },
          {
            name: 'Grille Agents IA',
            what: 'Les 6 agents actifs avec leur statut et dernière activité',
            how: 'Point vert = actif, Point rouge = erreur. Cliquez pour accéder aux détails de chaque agent.',
            why: 'Visualiser d\'un coup d\'œil que tous les systèmes fonctionnent',
            source: 'Status des workflows n8n',
            status: 'ok',
          },
          {
            name: 'Fil d\'activité',
            what: 'Les 5 dernières actions des agents IA',
            how: 'Bleu=conversation, Ambre=alerte concurrence, Jaune=avis, Vert=article, Violet=newsletter',
            why: 'Suivre en temps réel ce que font vos agents sans aller dans chaque section',
            source: 'Logs agrégés de tous les workflows',
            status: 'ok',
          },
          {
            name: 'Widget Vols',
            what: 'Aperçu des vols du jour avec statut et remplissage',
            how: 'Vert=à l\'heure, Ambre=retard. Pourcentage = taux de remplissage',
            why: 'Contexte opérationnel pour le marketing (adapter les promos si vol vide)',
            source: 'API système de réservation (Amadeus/Sabre)',
            status: 'missing',
            action: 'Fournir accès API GDS',
          },
        ],
      },
      {
        name: 'Demo Site',
        route: '/demo-site',
        icon: Globe,
        description: 'Testez le chatbot Tiare comme un visiteur du site ATN',
        roi: 'Test avant mise en production',
        elements: [
          {
            name: 'Sélecteur viewport',
            what: 'Boutons Desktop/Tablette/Mobile',
            how: 'Cliquez pour redimensionner l\'iframe et tester le chatbot sur différents écrans',
            why: '60% du trafic est mobile - important de vérifier l\'expérience',
            source: 'Interface locale',
            status: 'ok',
          },
          {
            name: 'Site démo avec chatbot',
            what: 'Reproduction du site ATN avec le chatbot Tiare intégré',
            how: 'La bulle bleue en bas à droite = chatbot. Cliquez pour ouvrir et poser des questions.',
            why: 'Tester le chatbot exactement comme les clients le verront',
            source: 'Démo hébergée + Workflow Build 1',
            status: 'ok',
          },
        ],
      },
    ],
  },
  {
    category: 'AGENTS IA',
    pages: [
      {
        name: 'Chatbot Tiare',
        route: '/conversations',
        icon: MessageCircle,
        description: 'Historique et monitoring des conversations du chatbot multilingue',
        roi: '40h/mois économisées (≈ 0.25 ETP)',
        elements: [
          {
            name: 'Total conversations',
            what: 'Compteur de toutes les conversations dans la période',
            how: 'Plus c\'est haut, plus le chatbot est sollicité. Comparez semaine/semaine.',
            why: 'Mesurer l\'adoption du chatbot par les visiteurs',
            source: 'Table Airtable Concierge_Logs',
            status: 'ok',
          },
          {
            name: 'Temps moyen réponse',
            what: 'Durée moyenne de réponse de l\'IA en secondes',
            how: '<1.5s = excellent, 1.5-3s = bon, >3s = vérifier les questions complexes',
            why: 'L\'IA doit répondre plus vite qu\'un humain (qui met 3-5 min)',
            source: 'Champ Temps dans Concierge_Logs',
            status: 'ok',
          },
          {
            name: 'Tokens utilisés',
            what: 'Consommation API Claude',
            how: '1000 tokens ≈ $0.01. Pics = questions complexes ou conversations longues.',
            why: 'Surveiller le coût opérationnel de l\'IA',
            source: 'Logs API Claude',
            status: 'ok',
          },
          {
            name: 'Liste des conversations',
            what: 'Historique détaillé de chaque échange',
            how: 'Cliquez sur une ligne pour voir question + réponse complète. Badge langue à gauche.',
            why: 'Identifier les questions mal comprises pour améliorer la FAQ',
            source: 'Table Airtable Concierge_Logs',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Concierge Pro',
        route: '/concierge-pro',
        icon: Headphones,
        description: 'Version avancée du chatbot pour clients avec réservation',
        roi: '+45% satisfaction client',
        elements: [
          {
            name: 'Contexte réservation',
            what: 'Informations du vol du client connecté',
            how: 'L\'IA connaît: numéro de vol, date, classe, historique voyages',
            why: 'Réponses personnalisées: "Votre vol TN7 part dans 3 jours"',
            source: 'API GDS + Authentification Mon Espace ATN',
            status: 'missing',
            action: 'Fournir accès API réservations + specs auth Mon Espace',
          },
          {
            name: 'Toggle IA par conversation',
            what: 'Activer/désactiver l\'IA pour chaque conversation individuellement',
            how: 'Cliquez sur le bouton toggle à côté du badge statut dans l\'en-tête de conversation. Mode "IA" = réponses auto, Mode "Manuel" = agent humain.',
            why: 'Permet aux agents de prendre le contrôle sur des cas complexes sans désactiver l\'IA pour toutes les conversations',
            source: 'Paramètre local par conversation',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Staff Assistant',
        route: '/staff-assistant',
        icon: Users,
        description: 'Assistant IA interne pour les employés ATN',
        roi: '-30% temps formation nouveaux employés',
        elements: [
          {
            name: 'Base de connaissances',
            what: 'Documents internes indexés (procédures, tarifs, règles)',
            how: 'L\'employé pose une question, l\'IA cherche dans les docs et répond',
            why: 'Évite de déranger le manager pour des questions de procédure',
            source: 'Documents internes ATN vectorisés',
            status: 'missing',
            action: 'Fournir manuels de procédures, politiques RH, guidelines marque',
          },
        ],
      },
    ],
  },
  {
    category: 'MARKETING AUTOMATISÉ',
    pages: [
      {
        name: 'Newsletters',
        route: '/newsletters',
        icon: Mail,
        description: 'Emails hyper-personnalisés générés par IA selon le segment',
        roi: '+32% taux ouverture vs emails génériques',
        elements: [
          {
            name: 'Score personnalisation',
            what: 'Niveau de personnalisation moyen des emails (0-100%)',
            how: '>90% = prénom + segment + historique utilisés. 70-90% = bon. <70% = améliorer CRM.',
            why: 'Plus c\'est personnalisé, plus le taux d\'ouverture est élevé',
            source: 'Calcul basé sur champs dynamiques utilisés',
            status: 'ok',
          },
          {
            name: 'Taux d\'ouverture',
            what: '% d\'emails ouverts sur emails envoyés',
            how: 'Benchmark standard: 20-25%. Avec personnalisation IA: 30-40%. <20% = revoir objets.',
            why: 'Indicateur clé de la qualité de vos campagnes',
            source: 'API Brevo tracking',
            status: 'warning',
            action: 'Fournir clé API Brevo',
          },
          {
            name: 'Preview email',
            what: 'Aperçu complet de chaque email généré',
            how: 'Cliquez sur une carte pour voir l\'email tel qu\'il a été envoyé',
            why: 'Vérifier la qualité du contenu IA avant/après envoi',
            source: 'Table Newsletter_Logs',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Contenu SEO',
        route: '/content',
        icon: FileText,
        description: 'Articles de blog générés par IA pour le référencement',
        roi: '+45% trafic organique (estimation sur 6 mois)',
        elements: [
          {
            name: 'Score SEO',
            what: 'Note de 0-100 évaluant l\'optimisation de l\'article',
            how: '>80 = excellent, 60-80 = bon, <60 = à optimiser. Basé sur: mots-clés, structure, longueur.',
            why: 'Articles bien notés rankent mieux sur Google',
            source: 'Analyse algorithmique du contenu',
            status: 'ok',
          },
          {
            name: 'Trafic organique',
            what: 'Nombre de visiteurs venus de Google sur vos articles',
            how: 'Comparez mois/mois. Croissance = SEO qui fonctionne.',
            why: 'Mesurer le ROI réel des articles générés',
            source: 'Google Search Console',
            status: 'warning',
            action: 'Fournir accès Google Search Console airtahitinui.com',
          },
        ],
      },
      {
        name: 'Social Monitor',
        route: '/social',
        icon: ImageIcon,
        description: 'Surveillance mentions sur réseaux sociaux',
        roi: '+50% réactivité aux mentions',
        elements: [
          {
            name: 'Sentiment Score',
            what: 'Score 0-100 indiquant si mention positive/neutre/négative',
            how: 'IA analyse le texte et attribue un score. >70 = positif, <40 = négatif.',
            why: 'Prioriser les réponses aux mentions négatives',
            source: 'API Meta, Twitter, LinkedIn',
            status: 'warning',
            action: 'Fournir accès API réseaux sociaux',
          },
          {
            name: 'Réponse suggérée',
            what: 'Proposition de réponse générée par l\'IA',
            how: 'Claude analyse le contexte et propose une réponse adaptée au ton de la marque.',
            why: 'Répondre rapidement avec un message approprié',
            source: 'Claude API',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Visual Factory',
        route: '/visual-factory',
        icon: ImageIcon,
        description: 'Génération automatique d\'assets visuels par IA',
        roi: '-70% temps de création graphique',
        elements: [
          {
            name: 'Assets générés',
            what: 'Images, bannières, visuels créés par l\'IA',
            how: 'L\'IA génère des visuels adaptés à chaque canal (email, social, web)',
            why: 'Plus besoin d\'attendre le graphiste pour chaque campagne',
            source: 'API Fal.ai + Claude Vision',
            status: 'ok',
          },
        ],
      },
    ],
  },
  {
    category: 'INTELLIGENCE',
    pages: [
      {
        name: 'Veille Concurrence',
        route: '/competitors',
        icon: Eye,
        description: 'Monitoring automatique des prix et offres concurrents',
        roi: 'Réaction en <24h aux changements de prix',
        elements: [
          {
            name: 'Alertes prix',
            what: 'Notifications quand un concurrent change ses tarifs',
            how: 'Rouge = concurrent moins cher (urgent), Ambre = info, Vert = vous êtes moins cher',
            why: 'Réagir rapidement pour ne pas perdre de parts de marché',
            source: 'Scraping quotidien French Bee, Hawaiian, LATAM',
            status: 'ok',
          },
          {
            name: 'Comparatif prix',
            what: 'Tableau des prix par route et concurrent',
            how: 'Vert = vous êtes compétitif, Rouge = prix à revoir. Écart en % affiché.',
            why: 'Vue d\'ensemble de votre positionnement tarifaire',
            source: 'Build 6 - Competitor Monitoring',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Gestion Avis',
        route: '/reviews',
        icon: Star,
        description: 'Réponses automatiques aux avis Google/TripAdvisor',
        roi: '+0.3 étoiles de note moyenne (statistique secteur)',
        elements: [
          {
            name: 'Note moyenne',
            what: 'Moyenne des avis sur toutes les plateformes',
            how: 'Objectif: >4.5/5. Chaque 0.1 étoile = ~5% de revenus supplémentaires.',
            why: 'La note influence directement les décisions d\'achat',
            source: 'API Google Business Profile + TripAdvisor',
            status: 'missing',
            action: 'Fournir accès Google Business Profile et TripAdvisor Manager',
          },
          {
            name: 'Réponses générées',
            what: 'Réponses automatiques personnalisées à chaque avis',
            how: 'Avis positif = remerciement + invitation à revenir. Négatif = excuse + solution.',
            why: 'Répondre à 100% des avis améliore l\'image et le ranking',
            source: 'Workflow Build 5',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Review Intelligence',
        route: '/review-intelligence',
        icon: Search,
        description: 'Analyse sémantique avancée de tous vos avis',
        roi: 'Détection précoce des problèmes récurrents',
        elements: [
          {
            name: 'Analyse sentiment',
            what: 'Classement automatique positif/neutre/négatif + détection ironie',
            how: "L'IA comprend le contexte: \"Le repas était 'formidable'\" (ironie détectée)",
            why: 'Ne pas être trompé par des avis sarcastiques',
            source: 'Workflow Build 16 - Review Intelligence',
            status: 'ok',
          },
          {
            name: 'Thèmes récurrents',
            what: 'Sujets les plus mentionnés dans les avis',
            how: 'Word cloud: plus le mot est gros, plus il est fréquent',
            why: 'Identifier ce qui plaît (à renforcer) ou déplaît (à corriger)',
            source: 'Analyse NLP des avis',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Lead Scoring',
        route: '/lead-scoring',
        icon: Target,
        description: 'Qualification automatique des prospects',
        roi: '+25% taux de conversion commercial',
        elements: [
          {
            name: 'Score prospect',
            what: 'Note de 0-100 évaluant la probabilité d\'achat',
            how: '>80 = très chaud (contacter aujourd\'hui), 50-80 = tiède (nurturing), <50 = froid',
            why: 'Prioriser les prospects les plus susceptibles d\'acheter',
            source: 'Algorithme basé sur comportement + données CRM',
            status: 'ok',
          },
        ],
      },
    ],
  },
  {
    category: 'OPÉRATIONS',
    pages: [
      {
        name: 'Vols',
        route: '/flights',
        icon: Plane,
        description: 'Monitoring des vols et taux de remplissage',
        roi: 'Visibilité opérationnelle temps réel',
        elements: [
          {
            name: 'Statut vols',
            what: 'État de chaque vol (à l\'heure, retard, annulé)',
            how: 'Vert = à l\'heure, Ambre = retard <1h, Rouge = retard >1h ou annulé',
            why: 'Contexte pour adapter les communications (promos si vol vide, excuses si retard)',
            source: 'API GDS (Amadeus/Sabre)',
            status: 'missing',
            action: 'Fournir accès API système de réservation',
          },
          {
            name: 'Taux de remplissage',
            what: '% de sièges vendus par vol',
            how: 'Vert >85%, Ambre 70-85%, Rouge <70%',
            why: 'Déclencher des promos ciblées sur les vols à faible remplissage',
            source: 'API GDS',
            status: 'missing',
            action: 'Documentation API système de réservation',
          },
        ],
      },
      {
        name: 'Réservations',
        route: '/bookings',
        icon: CreditCard,
        description: 'Suivi des demandes et réservations clients',
        roi: 'Réduction du temps de traitement',
        elements: [
          {
            name: 'Demandes en attente',
            what: 'Requêtes clients nécessitant une action',
            how: 'Classées par type (modification, annulation, information) et priorité',
            why: 'Ne rien laisser passer, traiter dans l\'ordre de priorité',
            source: 'Formulaires site + emails entrants',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Calendrier',
        route: '/calendar',
        icon: Calendar,
        description: 'Planning éditorial et campagnes',
        roi: 'Organisation et anticipation',
        elements: [
          {
            name: 'Planning éditorial',
            what: 'Vue calendrier de toutes les publications prévues',
            how: 'Drag & drop pour déplacer, clic pour éditer. Couleurs par type de contenu.',
            why: 'Visualiser et coordonner toutes les actions marketing',
            source: 'Table Content_Calendar Airtable',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Parcours Client',
        route: '/journeys',
        icon: Route,
        description: 'Automatisation des parcours client multi-touchpoints',
        roi: '+30% rétention client',
        elements: [
          {
            name: 'Journeys actifs',
            what: 'Séquences automatisées déclenchées par des événements',
            how: 'Ex: Réservation → J-7 email prep → J-1 rappel → J+1 feedback → J+30 offre retour',
            why: 'Accompagner le client à chaque étape sans intervention manuelle',
            source: 'Workflows n8n Build 21-25',
            status: 'ok',
          },
        ],
      },
    ],
  },
  {
    category: 'ANALYTICS',
    pages: [
      {
        name: 'Rapports',
        route: '/reports',
        icon: BarChart3,
        description: 'Rapports automatiques hebdo/mensuels',
        roi: '4h/semaine économisées sur le reporting',
        elements: [
          {
            name: 'Rapports générés',
            what: 'PDFs automatiques avec tous les KPIs de la période',
            how: 'Cliquez pour voir/télécharger. Envoyés automatiquement aux destinataires configurés.',
            why: 'Plus besoin de compiler manuellement les stats chaque semaine',
            source: 'Workflow Build 7 + Supabase storage',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Attribution',
        route: '/attribution',
        icon: TrendingUp,
        description: 'Analyse ROI de chaque canal marketing',
        roi: 'Optimisation du budget marketing',
        elements: [
          {
            name: 'Attribution multi-touch',
            what: 'Répartition des conversions par canal (Google, Email, Social, Direct)',
            how: 'Modèles: First-touch, Last-touch, Linéaire. Comparez pour comprendre le parcours.',
            why: 'Savoir où investir votre budget pour maximiser le ROI',
            source: 'Google Analytics + CRM',
            status: 'warning',
            action: 'Fournir accès Google Analytics',
          },
        ],
      },
      {
        name: 'A/B Tests',
        route: '/ab-tests',
        icon: Zap,
        description: 'Tests comparatifs automatisés',
        roi: '+15% performance moyenne des campagnes',
        elements: [
          {
            name: 'Tests en cours',
            what: 'Comparaisons actives entre versions A et B',
            how: 'Statut: En cours (pas assez de données) ou Terminé (winner identifié)',
            why: 'Amélioration continue basée sur les données, pas l\'intuition',
            source: 'Workflow A/B + Stats',
            status: 'ok',
          },
        ],
      },
      {
        name: 'ROI Dashboard',
        route: '/roi',
        icon: Target,
        description: 'Retour sur investissement global de la plateforme',
        roi: '347% ROI annualisé (projection)',
        elements: [
          {
            name: 'ROI Global',
            what: 'Calcul: (Gains générés - Coût plateforme) / Coût × 100',
            how: '>200% = excellent, 100-200% = bon, <100% = optimiser',
            why: 'Justifier l\'investissement auprès de la direction',
            source: 'Agrégation de tous les gains mesurables',
            status: 'ok',
          },
          {
            name: 'ROI par agent',
            what: 'Contribution de chaque workflow au ROI total',
            how: 'Identifiez les agents les plus rentables vs ceux à optimiser',
            why: 'Allocation intelligente des ressources',
            source: 'Calcul par workflow',
            status: 'ok',
          },
        ],
      },
    ],
  },
  {
    category: 'CONFIGURATION',
    pages: [
      {
        name: 'Upsell Engine',
        route: '/upsell',
        icon: Zap,
        description: 'Configuration des offres personnalisées post-réservation',
        roi: '+12% de revenus additionnels par client',
        elements: [
          {
            name: 'Règles upsell',
            what: 'Conditions et offres automatiques',
            how: 'Ex: "Si classe éco + vol >8h → proposer surclassement Poerava à -30%"',
            why: 'Revenus additionnels sans effort de vente',
            source: 'Configuration locale + API réservation',
            status: 'warning',
            action: 'Fournir catalogue d\'offres upsell et règles métier',
          },
        ],
      },
      {
        name: 'Prix Concurrents',
        route: '/pricing-monitor',
        icon: CreditCard,
        description: 'Configuration de la veille tarifaire',
        roi: 'Compétitivité maintenue',
        elements: [
          {
            name: 'Routes surveillées',
            what: 'Liste des routes et concurrents monitorés',
            how: 'Ajoutez/supprimez des routes, définissez les seuils d\'alerte',
            why: 'Personnaliser la veille selon vos priorités commerciales',
            source: 'Configuration Build 20',
            status: 'ok',
          },
        ],
      },
      {
        name: 'Paramètres',
        route: '/settings',
        icon: Settings,
        description: 'Configuration générale du dashboard',
        roi: 'Personnalisation',
        elements: [
          {
            name: 'Préférences',
            what: 'Thème, langue, notifications, destinataires rapports',
            how: 'Modifiez selon vos préférences',
            why: 'Adapter l\'outil à votre façon de travailler',
            source: 'LocalStorage + Supabase',
            status: 'ok',
          },
        ],
      },
    ],
  },
]

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'pages' | 'glossary' | 'faq'>('pages')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['ACCUEIL', 'AGENTS IA'])
  const [expandedPages, setExpandedPages] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [showSidebarGuide, setShowSidebarGuide] = useState(false)

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const togglePage = (pageName: string) => {
    setExpandedPages(prev =>
      prev.includes(pageName) ? prev.filter(p => p !== pageName) : [...prev, pageName]
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />
      case 'missing': return <XCircle className="w-4 h-4 text-red-500" />
      default: return null
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-emerald-50 border-emerald-200'
      case 'warning': return 'bg-amber-50 border-amber-200'
      case 'missing': return 'bg-red-50 border-red-200'
      default: return 'bg-slate-50'
    }
  }

  const filteredGlossary = glossary.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const glossaryCategories = Array.from(new Set(glossary.map(g => g.category)))

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Auto-launch handler wrapped in Suspense */}
      <Suspense fallback={null}>
        <GuideAutoLauncher onAutoLaunch={() => setShowSidebarGuide(true)} />
      </Suspense>

      {/* Sidebar Guide Modal */}
      <SidebarGuide
        isOpen={showSidebarGuide}
        onClose={() => setShowSidebarGuide(false)}
        autoPlay={false}
      />

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-3">
            <Book className="w-4 h-4" />
            Documentation complète
          </div>
          <h1 className="text-3xl font-bold mb-3">Guide du Dashboard ATN</h1>
          <p className="text-white/80 max-w-2xl mb-4">
            Explication détaillée de chaque page, chaque élément, comment interpréter les données,
            et ce dont ATN a besoin pour que tout fonctionne.
          </p>
          {/* Launch Interactive Sidebar Guide */}
          <button
            onClick={() => setShowSidebarGuide(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 rounded-xl font-semibold text-sm hover:bg-violet-50 transition-colors shadow-lg"
          >
            <Compass className="w-5 h-5" />
            Lancer le Guide Interactif de la Sidebar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div data-guide="guide-tabs" className="flex gap-1 p-1 bg-[--bg-secondary] rounded-xl">
        {[
          { id: 'pages', label: 'Pages du Dashboard', icon: LayoutDashboard },
          { id: 'glossary', label: 'Glossaire des termes', icon: Book },
          { id: 'faq', label: 'Questions fréquentes', icon: HelpCircle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[--text-primary] shadow-sm'
                : 'text-[--text-secondary] hover:text-[--text-primary]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Pages */}
      {activeTab === 'pages' && (
        <div data-guide="guide-pages-content" className="space-y-4">
          {/* Legend */}
          <div data-guide="guide-legend" className="flex items-center gap-6 p-4 bg-[--bg-secondary] rounded-xl text-sm">
            <span className="font-medium text-[--text-primary]">Légende statut:</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-[--text-secondary]">Fonctionnel</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-[--text-secondary]">Besoin config ATN</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-[--text-secondary]">Accès manquant</span>
            </div>
          </div>

          {/* Categories */}
          {pageDocumentation.map(category => (
            <div key={category.category} className="bg-white border border-[--border-primary] rounded-xl overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full flex items-center justify-between p-4 hover:bg-[--bg-secondary] transition-colors"
              >
                <h2 className="font-semibold text-[--text-primary]">{category.category}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[--text-tertiary]">{category.pages.length} pages</span>
                  {expandedCategories.includes(category.category) ? (
                    <ChevronDown className="w-5 h-5 text-[--text-tertiary]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[--text-tertiary]" />
                  )}
                </div>
              </button>

              {/* Pages */}
              {expandedCategories.includes(category.category) && (
                <div className="border-t border-[--border-primary]">
                  {category.pages.map(page => (
                    <div key={page.name} className="border-b border-[--border-primary] last:border-0">
                      {/* Page Header */}
                      <button
                        onClick={() => togglePage(page.name)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-[--bg-secondary] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                          <page.icon className="w-5 h-5 text-violet-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-[--text-primary]">{page.name}</h3>
                            <span className="text-xs text-[--text-tertiary]">{page.route}</span>
                          </div>
                          <p className="text-sm text-[--text-secondary]">{page.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-emerald-600">{page.roi}</p>
                        </div>
                        {expandedPages.includes(page.name) ? (
                          <ChevronDown className="w-5 h-5 text-[--text-tertiary]" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-[--text-tertiary]" />
                        )}
                      </button>

                      {/* Page Elements */}
                      {expandedPages.includes(page.name) && (
                        <div className="px-4 pb-4 space-y-3">
                          {page.elements.map((el, i) => (
                            <div key={i} className={`p-4 rounded-xl border ${getStatusBg(el.status)}`}>
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-medium text-[--text-primary]">{el.name}</h4>
                                {getStatusIcon(el.status)}
                              </div>

                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-[--text-primary]">C'est quoi: </span>
                                  <span className="text-[--text-secondary]">{el.what}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-[--text-primary]">Comment lire: </span>
                                  <span className="text-[--text-secondary]">{el.how}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-[--text-primary]">Pourquoi c'est utile: </span>
                                  <span className="text-[--text-secondary]">{el.why}</span>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-[--border-primary] mt-2">
                                  <Database className="w-4 h-4 text-[--text-tertiary]" />
                                  <span className="text-[--text-tertiary]">Source: {el.source}</span>
                                </div>

                                {el.action && (
                                  <div className="mt-2 p-3 bg-white rounded-lg border border-amber-300">
                                    <p className="text-xs font-medium text-amber-700 flex items-center gap-1 mb-1">
                                      <Target className="w-3 h-3" />
                                      Action ATN requise
                                    </p>
                                    <p className="text-sm text-amber-600">{el.action}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}

                          <Link
                            href={page.route}
                            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                          >
                            Aller sur cette page
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Glossary */}
      {activeTab === 'glossary' && (
        <div data-guide="guide-glossary-content" className="space-y-4">
          {/* Search & Filter */}
          <div data-guide="guide-glossary-search" className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[--text-tertiary]" />
              <input
                type="text"
                placeholder="Rechercher un terme..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[--border-primary] rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <select
              value={filterCategory || ''}
              onChange={e => setFilterCategory(e.target.value || null)}
              className="px-4 py-2 border border-[--border-primary] rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Toutes catégories</option>
              {glossaryCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Terms */}
          <div className="grid gap-4">
            {filteredGlossary.map((item, i) => (
              <div key={i} className="bg-white border border-[--border-primary] rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-[--text-primary]">{item.term}</h3>
                  <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full">
                    {item.category}
                  </span>
                </div>
                <p className="text-[--text-secondary] mb-4">{item.definition}</p>
                <div className="p-3 bg-[--bg-secondary] rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium text-[--text-primary]">Exemple: </span>
                    <span className="text-[--text-secondary]">{item.example}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: FAQ */}
      {activeTab === 'faq' && (
        <div data-guide="guide-faq-content" className="space-y-3">
          {[
            {
              q: 'C\'est quoi ce dashboard exactement ?',
              a: 'C\'est une interface qui vous permet de superviser et contrôler tous les agents IA qui travaillent pour ATN. Chaque agent automatise une tâche spécifique (répondre aux clients, envoyer des newsletters, surveiller les concurrents...). Le dashboard vous donne une vue d\'ensemble et vous permet d\'intervenir si nécessaire.',
            },
            {
              q: 'Les données affichées sont-elles réelles ?',
              a: 'Non, c\'est une démo avec des données fictives. En production, tout serait connecté aux vrais systèmes Air Tahiti Nui (CRM, email, base réservations, etc.). Les workflows sont prêts, il manque juste les connexions.',
            },
            {
              q: 'Qu\'est-ce que ATN doit fournir pour que ça fonctionne ?',
              a: 'Chaque page indique ce qui manque avec un indicateur orange ou rouge. Les principaux éléments: accès API système de réservation (Amadeus/Sabre), clé API Brevo, accès Google Search Console, accès Google Business Profile. Une fois ces accès fournis, les workflows peuvent être connectés.',
            },
            {
              q: 'Combien de temps faut-il pour tout mettre en place ?',
              a: 'Une fois les accès fournis: 2-4 semaines pour le pack Starter (chatbot + newsletters), 4-8 semaines pour Business (+ contenu + avis), 2-3 mois pour Enterprise (intégration complète GDS).',
            },
            {
              q: 'Le chatbot peut-il vraiment réserver des vols ?',
              a: 'Dans cette démo, non. Mais le workflow peut être connecté à votre système de réservation pour permettre des réservations directes ou des redirections intelligentes vers la page de booking avec les paramètres pré-remplis.',
            },
            {
              q: 'Quelle est la différence entre ce système et ChatGPT ?',
              a: 'ChatGPT est un outil généraliste. Nos workflows sont spécifiquement entraînés sur vos données, votre ton de marque, et connectés à vos systèmes. L\'IA connaît vos produits, vos prix, vos destinations. Elle ne fait pas d\'erreurs comme confondre Tahiti et Hawaii.',
            },
            {
              q: 'Qui gère les workflows au quotidien ?',
              a: 'Les workflows tournent en autonomie 24/7. Vous gardez le contrôle via ce dashboard pour superviser, approuver certaines actions (comme les réponses aux avis négatifs), et ajuster les paramètres. PACIFIK\'AI assure la maintenance technique.',
            },
            {
              q: 'Et si l\'IA fait une erreur ?',
              a: 'Plusieurs garde-fous sont en place: validation humaine pour les actions sensibles, limites de budget, logs complets. Vous pouvez toujours intervenir et corriger. Les cas ambigus sont escaladés automatiquement.',
            },
            {
              q: 'Comment interpréter les indicateurs verts/orange/rouges ?',
              a: 'Vert = tout fonctionne, la donnée est en temps réel. Orange = fonctionne partiellement, besoin d\'une config côté ATN. Rouge = accès manquant, la fonctionnalité n\'est pas active. Consultez chaque page de ce guide pour voir les actions requises.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-[--border-primary] rounded-xl p-5">
              <p className="font-medium text-[--text-primary] mb-2">{item.q}</p>
              <p className="text-sm text-[--text-secondary]">{item.a}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
