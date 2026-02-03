'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  SkipForward,
  CheckCircle,
  Circle,
  Sparkles,
  BookOpen
} from 'lucide-react'

// Types
interface GuideStep {
  selector: string
  title: string
  content: string
  details?: string[]
  interpretation?: string
  action?: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

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
  steps: GuideStep[]
}

// ==========================================
// GUIDE COMPLET DE TOUTES LES PAGES
// ==========================================

const COMPLETE_GUIDE: PageGuide[] = [
  // ==========================================
  // 1. DASHBOARD - Page d'accueil
  // ==========================================
  {
    route: '/',
    pageName: 'Dashboard',
    pageDescription: 'Vue d\'ensemble de toutes les activités IA. C\'est votre cockpit quotidien.',
    roiMetric: '+35% productivité',
    roiDetails: 'En centralisant toutes les métriques, vous gagnez 2h/jour de compilation manuelle. Sur un mois, c\'est 40h économisées soit environ 400 000 XPF de coût salarial.',
    benefits: [
      'Vision 360° de toutes les automatisations en un coup d\'œil',
      'Détection immédiate des problèmes grâce aux alertes temps réel',
      'Prise de décision rapide basée sur des données actualisées',
      'Plus besoin de compiler manuellement les KPIs de différentes sources'
    ],
    atnRequirements: [
      { element: 'Stats chatbot', source: 'Webhook n8n → Supabase', status: 'ok', note: 'Automatique via Build 1' },
      { element: 'Stats newsletters', source: 'API Brevo', status: 'warning', note: 'Besoin clé API du compte ATN Brevo' },
      { element: 'Stats SEO', source: 'Google Search Console', status: 'warning', note: 'Besoin accès GSC site airtahitinui.com' },
      { element: 'Alertes concurrence', source: 'Workflow Build 6', status: 'ok', note: 'Configuré et actif' },
      { element: 'Revenus upsell', source: 'API réservations ATN', status: 'missing', note: 'Besoin documentation API système de réservation (Amadeus/Sabre?)' }
    ],
    steps: [
      {
        selector: '[data-guide="kpi-cards"]',
        title: '📊 Cartes KPI principales',
        content: 'Ces 4 cartes affichent les métriques clés en temps réel.',
        details: [
          'Conversations Chatbot : nombre de clients assistés automatiquement',
          'Newsletters envoyées : campagnes parties cette semaine',
          'Articles publiés : contenus SEO générés',
          'Alertes actives : points d\'attention à traiter'
        ],
        interpretation: 'Vérifiez ces chiffres chaque matin. Une baisse soudaine peut indiquer un problème technique.',
        position: 'bottom'
      },
      {
        selector: '[data-guide="alerts-section"]',
        title: '🚨 Section Alertes',
        content: 'Les alertes prioritaires apparaissent ici en rouge.',
        details: [
          'Avis négatifs non traités (à répondre sous 24h)',
          'Alertes concurrentielles (promo détectée chez un concurrent)',
          'Erreurs workflow (un automatisme a échoué)',
          'Opportunités upsell manquées'
        ],
        interpretation: 'Traitez d\'abord les alertes rouges, puis les oranges. Les vertes sont informatives.',
        action: 'Cliquez sur une alerte pour voir le détail et agir',
        position: 'right'
      },
      {
        selector: '[data-guide="revenue-widget"]',
        title: '💰 Revenus générés par l\'IA',
        content: 'Suivi en temps réel des revenus attribuables aux automatisations.',
        details: [
          'Upsell chatbot : ventes additionnelles suggérées par Tiare',
          'Conversions newsletter : achats suite aux emails',
          'Récupération abandon : paniers sauvés par relance auto'
        ],
        interpretation: 'Ce widget justifie le ROI de PACIFIK\'AI. Utilisez ces chiffres pour vos reportings.',
        position: 'left'
      },
      {
        selector: '[data-guide="activity-feed"]',
        title: '📋 Fil d\'activité',
        content: 'Historique en temps réel de toutes les actions automatisées.',
        details: [
          'Chaque ligne = une action de l\'IA',
          'Horodatage précis',
          'Type d\'action (chatbot, email, article...)',
          'Statut (succès, en cours, échec)'
        ],
        interpretation: 'Scrollez pour voir l\'historique. Cliquez sur une ligne pour le détail.',
        position: 'top'
      },
      {
        selector: '[data-guide="quick-actions"]',
        title: '⚡ Actions rapides',
        content: 'Raccourcis vers les tâches les plus fréquentes.',
        details: [
          'Générer un article : lance la création SEO',
          'Nouvelle newsletter : démarre une campagne',
          'Voir les avis : accède aux avis à traiter',
          'Rapport express : génère un PDF de synthèse'
        ],
        action: 'Ces boutons déclenchent des workflows n8n en arrière-plan',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 2. DEMO SITE
  // ==========================================
  {
    route: '/demo-site',
    pageName: 'Demo Site',
    pageDescription: 'Testez le chatbot Tiare exactement comme vos visiteurs le voient.',
    roiMetric: 'Validation pré-production',
    roiDetails: 'Évite les erreurs en production. Un bug chatbot non détecté peut frustrer des centaines de clients/jour. Cette page permet de valider avant déploiement.',
    benefits: [
      'Test des réponses chatbot avant mise en production',
      'Validation multi-langues (FR, EN, JP, ES) sans quitter le dashboard',
      'Simulation responsive (mobile/tablet/desktop) instantanée',
      'Identification des questions sans réponse pour enrichir la FAQ'
    ],
    atnRequirements: [
      { element: 'Chatbot Tiare', source: 'Workflow n8n Build 1', status: 'ok', note: 'Opérationnel' },
      { element: 'FAQ ATN', source: 'Supabase vector store', status: 'ok', note: '200+ questions indexées' },
      { element: 'Site démo', source: '/public/demo-site-content/', status: 'ok', note: 'Déployé' }
    ],
    steps: [
      {
        selector: '[data-guide="viewport-switcher"]',
        title: '📱 Sélecteur de viewport',
        content: 'Testez l\'expérience sur différents appareils.',
        details: [
          'Desktop : vue ordinateur (largeur 100%)',
          'Tablet : vue tablette (768px)',
          'Mobile : vue smartphone (375px)'
        ],
        interpretation: '60% du trafic ATN vient du mobile. Testez prioritairement cette vue.',
        position: 'bottom'
      },
      {
        selector: '[data-guide="demo-iframe"]',
        title: '🌐 Site de démonstration',
        content: 'Réplique fidèle du site airtahitinui.com avec le chatbot intégré.',
        details: [
          'Le chatbot est la bulle bleue en bas à droite',
          'Cliquez dessus pour ouvrir la conversation',
          'Testez en français, anglais, japonais, espagnol',
          'Le chatbot connaît toute la FAQ ATN (200+ questions)'
        ],
        action: 'Cliquez sur la bulle bleue et posez une question !',
        position: 'center'
      },
      {
        selector: '[data-guide="suggested-questions"]',
        title: '💡 Questions suggérées',
        content: 'Exemples de questions pour tester les capacités du chatbot.',
        details: [
          '"Quels sont les bagages autorisés en cabine ?"',
          '"What flights go to Los Angeles?"',
          '"東京へのフライトはありますか？" (vols vers Tokyo en japonais)',
          '"Je veux réserver un vol pour Bora Bora"'
        ],
        interpretation: 'Testez des questions complexes pour voir les limites. Notez celles sans réponse pour enrichir la FAQ.',
        position: 'top'
      },
      {
        selector: '[data-guide="refresh-button"]',
        title: '🔄 Rafraîchir',
        content: 'Recharge le site démo pour réinitialiser la conversation.',
        action: 'Utilisez après chaque test pour repartir de zéro',
        position: 'left'
      }
    ]
  },

  // ==========================================
  // 3. CHATBOT TIARE - Conversations
  // ==========================================
  {
    route: '/conversations',
    pageName: 'Chatbot Tiare',
    pageDescription: 'Centre de contrôle de l\'assistant virtuel. Supervisez toutes les conversations.',
    roiMetric: '40h/mois économisées',
    roiDetails: 'Le chatbot traite en moyenne 500+ requêtes/mois. À 5 min/requête en temps humain = 41h économisées. Au coût horaire standard (10 000 XPF), c\'est 410 000 XPF/mois de valeur générée.',
    benefits: [
      'Service client 24/7 sans augmenter les effectifs',
      'Réponses instantanées vs 4-24h en email traditionnel',
      'Support multilingue automatique (4 langues) sans traducteur',
      'Identification des FAQ manquantes pour amélioration continue',
      'Escalade intelligente vers humain quand nécessaire'
    ],
    atnRequirements: [
      { element: 'Logs conversations', source: 'Supabase atn_conversations', status: 'ok', note: 'Table créée et alimentée' },
      { element: 'Webhook chatbot', source: 'n8n Build 1', status: 'ok', note: 'Workflow actif' },
      { element: 'Escalade humain', source: 'Email/Slack notification', status: 'warning', note: 'Besoin email équipe support (support@airtahitinui.com ?) ou accès Slack' }
    ],
    steps: [
      {
        selector: '[data-guide="conversation-list"]',
        title: '💬 Liste des conversations',
        content: 'Toutes les conversations clients classées par date.',
        details: [
          'Chaque ligne = un client assisté automatiquement',
          'Avatar : icône par défaut ou photo si client connecté',
          'Aperçu : derniers messages échangés',
          'Badge langue : FR, EN, JP, ES détecté automatiquement'
        ],
        interpretation: 'Les conversations récentes sont en haut. Scrollez pour l\'historique.',
        position: 'right'
      },
      {
        selector: '[data-guide="conversation-filters"]',
        title: '🔍 Filtres',
        content: 'Filtrez les conversations par critères.',
        details: [
          'Par langue : voir uniquement FR, EN, etc.',
          'Par statut : résolu, en cours, escaladé',
          'Par sujet : bagages, réservation, horaires...',
          'Par satisfaction : satisfait, neutre, insatisfait'
        ],
        action: 'Utilisez "escaladé" pour voir les cas nécessitant intervention humaine',
        position: 'bottom'
      },
      {
        selector: '[data-guide="conversation-detail"]',
        title: '📖 Détail conversation',
        content: 'Transcription complète de la conversation sélectionnée.',
        details: [
          'Messages client en gris (à gauche)',
          'Réponses Tiare en bleu (à droite)',
          'Horodatage de chaque message',
          'Sources utilisées par l\'IA pour répondre'
        ],
        interpretation: 'Vérifiez que les réponses sont correctes. Signalez les erreurs pour améliorer l\'IA.',
        position: 'left'
      },
      {
        selector: '[data-guide="escalate-button"]',
        title: '🆘 Bouton Escalader',
        content: 'Transférez la conversation à un humain.',
        details: [
          'Envoie une notification à l\'équipe support',
          'Le client reçoit "Un conseiller va vous répondre"',
          'La conversation reste visible ici',
          'Vous pouvez répondre directement depuis le dashboard'
        ],
        action: 'Utilisez pour les demandes complexes ou clients VIP',
        position: 'top'
      },
      {
        selector: '[data-guide="stats-sidebar"]',
        title: '📊 Statistiques',
        content: 'Métriques de performance du chatbot.',
        details: [
          'Taux de résolution : % de questions résolues sans humain',
          'Temps moyen : durée moyenne d\'une conversation',
          'Satisfaction : note moyenne donnée par les clients',
          'Questions fréquentes : top 10 des sujets demandés'
        ],
        interpretation: 'Un taux de résolution > 85% est excellent. En dessous, enrichissez la FAQ.',
        position: 'left'
      },
      {
        selector: '[data-guide="faq-gaps"]',
        title: '❓ Questions sans réponse',
        content: 'Liste des questions où Tiare n\'a pas trouvé de réponse.',
        details: [
          'Classées par fréquence (les plus demandées en haut)',
          'Cliquez pour voir le contexte',
          'Bouton "Ajouter à la FAQ" pour enrichir la base'
        ],
        interpretation: 'Traitez cette liste chaque semaine. Chaque question ajoutée améliore le chatbot.',
        action: 'Objectif : vider cette liste progressivement',
        position: 'right'
      }
    ]
  },

  // ==========================================
  // 4. CONCIERGE PRO
  // ==========================================
  {
    route: '/concierge-pro',
    pageName: 'Concierge Pro',
    pageDescription: 'Assistant premium avec contexte réservation. Service 5 étoiles automatisé.',
    roiMetric: '+45% satisfaction',
    roiDetails: 'Les clients avec réservation représentent votre cœur de cible. +45% satisfaction = +20% de recommandations = acquisition gratuite de nouveaux clients. Valeur estimée : 2-3M XPF/an en acquisition économisée.',
    benefits: [
      'Expérience VIP personnalisée (le bot connaît nom, vol, classe)',
      'Suggestions d\'upsell contextuelles (bagage, salon, surclassement)',
      'Réduction des appels au call center pour les clients connectés',
      'Historique client exploité pour service personnalisé',
      'Différenciation concurrentielle forte vs chatbots génériques'
    ],
    atnRequirements: [
      { element: 'Données réservation', source: 'API GDS (Amadeus/Sabre)', status: 'missing', note: 'CRITIQUE : Besoin documentation API système de réservation ATN' },
      { element: 'Auth client', source: 'SSO ATN / Mon Espace', status: 'missing', note: 'Besoin specs authentification "Mon Espace ATN"' },
      { element: 'Workflow', source: 'n8n Build 18', status: 'ok', note: 'Prêt, attend les données de réservation' }
    ],
    steps: [
      {
        selector: '[data-guide="booking-context"]',
        title: '✈️ Contexte réservation',
        content: 'Informations du client connecté affichées automatiquement.',
        details: [
          'Nom du passager',
          'Numéro de vol et date',
          'Classe (Poerava Business / Moana Economy / Moana Premium)',
          'Historique des voyages ATN'
        ],
        interpretation: 'Le Concierge utilise ces infos pour personnaliser ses réponses.',
        position: 'right'
      },
      {
        selector: '[data-guide="personalized-responses"]',
        title: '💎 Réponses personnalisées',
        content: 'Exemples de réponses contextuelles.',
        details: [
          '"Bonjour M. Dupont, votre vol TN7 pour Tokyo part dans 3 jours"',
          '"En Poerava Business, vous avez droit à 2x32kg de bagages"',
          '"Voulez-vous réserver un accès au salon avant votre vol ?"',
          '"D\'après votre historique, vous préférez les sièges côté hublot"'
        ],
        interpretation: 'Ce niveau de personnalisation augmente la satisfaction de 45%.',
        position: 'left'
      },
      {
        selector: '[data-guide="upsell-suggestions"]',
        title: '💰 Suggestions upsell',
        content: 'Opportunités de ventes additionnelles détectées par l\'IA.',
        details: [
          'Surclassement vers Business (si dispo)',
          'Bagage supplémentaire',
          'Accès salon VIP',
          'Assurance voyage',
          'Transfert aéroport'
        ],
        interpretation: 'Chaque suggestion acceptée génère du revenu additionnel.',
        position: 'bottom'
      },
      {
        selector: '[data-guide="integration-status"]',
        title: '🔌 Status intégration',
        content: 'État de la connexion avec les systèmes ATN.',
        details: [
          'API Réservations : connecté / déconnecté',
          'Mon Espace ATN : authentification active',
          'Dernière sync : horodatage'
        ],
        interpretation: 'Si "déconnecté", le Concierge fonctionne en mode basique (comme Tiare).',
        position: 'top'
      }
    ]
  },

  // ==========================================
  // 5. STAFF ASSISTANT (TALIA)
  // ==========================================
  {
    route: '/staff-assistant',
    pageName: 'Staff Assistant',
    pageDescription: 'TALIA - Assistant IA pour les employés ATN. Réduit les questions aux managers.',
    roiMetric: '-30% temps formation',
    roiDetails: 'Formation d\'un nouvel agent = 2-4 semaines. -30% = 3-5 jours gagnés par recrue. Avec 10 recrutements/an, c\'est 30-50 jours de productivité récupérés, soit ~500 000 XPF/an.',
    benefits: [
      'Onboarding accéléré des nouveaux employés',
      'Managers libérés des questions répétitives',
      'Base de connaissances toujours à jour et accessible',
      'Uniformisation des réponses (pas de variations selon qui répond)',
      'Disponibilité 24/7 (équipes en shifts, fuseaux horaires différents)'
    ],
    atnRequirements: [
      { element: 'Base connaissances', source: 'Documents internes ATN', status: 'missing', note: 'Besoin : manuels procédures, politiques RH, guidelines marque, docs tarifs/bagages' },
      { element: 'Workflow', source: 'n8n Build 19', status: 'ok', note: 'Prêt à indexer les documents' },
      { element: 'Interface', source: 'Intranet ou app dédiée', status: 'warning', note: 'À définir : intégration intranet existant ou app standalone ?' }
    ],
    steps: [
      {
        selector: '[data-guide="knowledge-base"]',
        title: '📚 Base de connaissances',
        content: 'Documents internes indexés et consultables par TALIA.',
        details: [
          'Manuels de procédures (check-in, embarquement...)',
          'Politiques RH (congés, formations...)',
          'Guidelines marque (logo, couleurs, ton...)',
          'Tarifs et règles bagages par destination'
        ],
        interpretation: 'Plus la base est riche, plus TALIA est utile. Ajoutez vos documents.',
        action: 'Cliquez sur "Ajouter un document" pour enrichir',
        position: 'right'
      },
      {
        selector: '[data-guide="employee-queries"]',
        title: '👥 Questions des employés',
        content: 'Historique des questions posées par le staff.',
        details: [
          'Classées par département (comptoir, call center, marketing...)',
          'Fréquence de chaque question',
          'Taux de réponse satisfaisante'
        ],
        interpretation: 'Les questions fréquentes révèlent des lacunes de formation.',
        position: 'left'
      },
      {
        selector: '[data-guide="quick-answers"]',
        title: '⚡ Réponses rapides',
        content: 'Top 10 des questions les plus fréquentes avec réponses.',
        details: [
          '"Franchise bagage Poerava Business vers Tokyo ?" → 2x32kg',
          '"Horaire du vol TN1 ?" → 23h30 départ PPT',
          '"Procédure surclassement ?" → Voir manuel page 47'
        ],
        action: 'Partagez cette page avec les nouveaux employés',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 6. NEWSLETTERS
  // ==========================================
  {
    route: '/newsletters',
    pageName: 'Newsletters',
    pageDescription: 'Gestion automatisée des campagnes email avec génération IA.',
    roiMetric: '+25% ouverture',
    roiDetails: '+25% d\'ouverture = +25% d\'audience exposée aux offres. Si vous envoyez 50 000 emails/mois, c\'est 12 500 ouvertures supplémentaires. À 0.5% de conversion, c\'est 62 réservations additionnelles. Valeur : ~6M XPF/mois.',
    benefits: [
      'Génération automatique du contenu adapté au segment',
      'A/B testing automatisé pour optimiser les performances',
      'Personnalisation à grande échelle (prénom, historique...)',
      'Timing optimal suggéré par l\'IA',
      'Réduction du temps de création de 4h à 30min par campagne'
    ],
    atnRequirements: [
      { element: 'Compte Brevo', source: 'API Brevo', status: 'warning', note: 'Besoin clé API Brevo du compte ATN ou accès au compte' },
      { element: 'Base contacts', source: 'Export CRM ATN', status: 'warning', note: 'Besoin export initial des abonnés avec segmentation' },
      { element: 'Templates email', source: 'Charte graphique ATN', status: 'warning', note: 'Besoin templates HTML email validés par la marque' },
      { element: 'Workflow', source: 'n8n Build 3', status: 'ok', note: 'Workflow newsletter prêt' }
    ],
    steps: [
      {
        selector: '[data-guide="campaign-list"]',
        title: '📧 Liste des campagnes',
        content: 'Toutes vos newsletters passées et programmées.',
        details: [
          'Statut : Brouillon, Programmée, Envoyée, Terminée',
          'Date d\'envoi prévue ou effective',
          'Segment ciblé (tous, business, familles...)',
          'Aperçu du contenu'
        ],
        interpretation: 'Les campagnes vertes ont bien performé, les rouges moins bien.',
        position: 'right'
      },
      {
        selector: '[data-guide="campaign-stats"]',
        title: '📊 Statistiques campagne',
        content: 'Performance détaillée de chaque envoi.',
        details: [
          'Taux d\'ouverture : % qui ont ouvert l\'email',
          'Taux de clic : % qui ont cliqué un lien',
          'Taux de conversion : % qui ont réservé',
          'Revenus générés : CA attribuable à la campagne'
        ],
        interpretation: 'Objectifs ATN : >30% ouverture, >5% clic, >0.5% conversion',
        position: 'left'
      },
      {
        selector: '[data-guide="ai-generator"]',
        title: '🤖 Générateur IA',
        content: 'Création automatique de contenu personnalisé.',
        details: [
          'Choisissez le sujet (promo, destination, actualité...)',
          'Sélectionnez le segment',
          'L\'IA génère : objet, préheader, corps, CTA',
          'Vous validez et modifiez si besoin'
        ],
        action: 'L\'IA s\'adapte au ton ATN et personnalise par segment',
        position: 'bottom'
      },
      {
        selector: '[data-guide="ab-testing"]',
        title: '🔬 A/B Testing',
        content: 'Testez différentes versions pour optimiser.',
        details: [
          'Créez 2 versions de l\'objet',
          'Envoi à 10% de la base pour test',
          'La meilleure version part aux 90% restants',
          'Automatique ou manuel selon vos préférences'
        ],
        interpretation: 'L\'A/B testing augmente les taux d\'ouverture de 15-25%',
        position: 'top'
      },
      {
        selector: '[data-guide="schedule"]',
        title: '📅 Programmation',
        content: 'Planifiez vos envois à l\'avance.',
        details: [
          'Choisissez date et heure',
          'Fuseau horaire pris en compte (Tahiti, Paris, Tokyo...)',
          'Meilleurs moments suggérés par l\'IA',
          'Option "Envoyer maintenant"'
        ],
        interpretation: 'Mardi et jeudi 9h-11h sont les meilleurs créneaux pour ATN.',
        position: 'right'
      }
    ]
  },

  // ==========================================
  // 7. CONTENU SEO
  // ==========================================
  {
    route: '/content',
    pageName: 'Contenu SEO',
    pageDescription: 'Génération automatique d\'articles de blog optimisés pour Google.',
    roiMetric: '+40% trafic organique',
    roiDetails: 'Le SEO est le canal d\'acquisition le moins cher à long terme. +40% de trafic organique = économie de 40% du budget pub équivalent. Si vous dépensez 5M XPF/an en pub, c\'est 2M XPF économisés.',
    benefits: [
      'Articles optimisés SEO générés en 5min vs 4h manuellement',
      'Positionnement sur des mots-clés à forte intention d\'achat',
      'Trafic gratuit et durable (vs pub qui s\'arrête sans budget)',
      'Calendrier éditorial automatisé',
      'Suggestions de sujets basées sur les tendances Google'
    ],
    atnRequirements: [
      { element: 'Accès blog ATN', source: 'CMS site web', status: 'warning', note: 'Besoin accès au CMS (WordPress? Autre?) pour publication' },
      { element: 'Google Search Console', source: 'GSC API', status: 'warning', note: 'Besoin accès GSC airtahitinui.com pour analyse SEO' },
      { element: 'Google Analytics', source: 'GA4 API', status: 'warning', note: 'Optionnel : pour tracking conversions depuis articles' },
      { element: 'Workflow', source: 'n8n Build 4', status: 'ok', note: 'Générateur SEO prêt' }
    ],
    steps: [
      {
        selector: '[data-guide="article-list"]',
        title: '📝 Liste des articles',
        content: 'Tous vos articles SEO générés et publiés.',
        details: [
          'Titre et URL de l\'article',
          'Score SEO (0-100)',
          'Mot-clé principal ciblé',
          'Trafic généré depuis publication'
        ],
        interpretation: 'Visez un score SEO > 85 pour chaque article.',
        position: 'right'
      },
      {
        selector: '[data-guide="seo-score"]',
        title: '🎯 Score SEO',
        content: 'Évaluation de l\'optimisation de l\'article.',
        details: [
          'Titre : contient le mot-clé, <60 caractères',
          'Meta description : 150-160 caractères, mot-clé inclus',
          'Structure : H1, H2, H3 bien hiérarchisés',
          'Contenu : >1500 mots, mot-clé 1-2% densité',
          'Images : alt text optimisé',
          'Liens : internes et externes pertinents'
        ],
        interpretation: 'Cliquez sur chaque critère pour voir comment améliorer.',
        position: 'left'
      },
      {
        selector: '[data-guide="keyword-suggestions"]',
        title: '🔑 Suggestions de mots-clés',
        content: 'L\'IA propose des sujets à fort potentiel.',
        details: [
          'Basé sur les tendances Google',
          'Volume de recherche mensuel',
          'Difficulté de positionnement',
          'Pertinence pour ATN'
        ],
        interpretation: 'Priorisez : volume élevé + difficulté moyenne + haute pertinence',
        action: 'Cliquez sur un mot-clé pour lancer la génération',
        position: 'bottom'
      },
      {
        selector: '[data-guide="content-calendar"]',
        title: '📅 Calendrier éditorial',
        content: 'Planification des publications.',
        details: [
          'Vue mensuelle des articles prévus',
          'Répartition par catégorie (destinations, conseils, actus)',
          'Statut : à rédiger, en révision, programmé, publié'
        ],
        interpretation: 'Objectif : 2-3 articles/semaine pour un impact SEO significatif.',
        position: 'top'
      }
    ]
  },

  // ==========================================
  // 8. SOCIAL MEDIA
  // ==========================================
  {
    route: '/social',
    pageName: 'Social Media',
    pageDescription: 'Gestion automatisée des réseaux sociaux ATN.',
    roiMetric: '+50% engagement',
    roiDetails: '+50% engagement = +50% de portée organique (algorithmes favorisent les posts engageants). Économie de 30% du budget pub social. Si vous investissez 2M XPF/an en social ads, c\'est 600 000 XPF économisés.',
    benefits: [
      'Publication automatique multi-plateformes (FB, IG, LinkedIn)',
      'Contenu adapté à chaque réseau (format, ton, hashtags)',
      'Programmation des posts aux heures optimales',
      'Économie de 10h/semaine de community management',
      'Cohérence de la présence sociale 7j/7'
    ],
    atnRequirements: [
      { element: 'Facebook Page', source: 'Meta Business Suite', status: 'warning', note: 'Besoin accès admin page ATN ou rôle "Éditeur"' },
      { element: 'Instagram', source: 'Meta Business Suite', status: 'warning', note: 'Besoin compte IG professionnel lié à la page FB' },
      { element: 'LinkedIn', source: 'LinkedIn API', status: 'warning', note: 'Besoin accès page entreprise ATN' },
      { element: 'Workflow', source: 'n8n Build 5', status: 'ok', note: 'Workflow social media prêt' }
    ],
    steps: [
      {
        selector: '[data-guide="post-queue"]',
        title: '📱 File de publication',
        content: 'Posts programmés pour Facebook, Instagram, LinkedIn.',
        details: [
          'Aperçu visuel de chaque post',
          'Plateforme(s) ciblée(s)',
          'Date et heure de publication',
          'Statut : brouillon, approuvé, publié'
        ],
        interpretation: 'Maintenez toujours 1-2 semaines de posts en avance.',
        position: 'right'
      },
      {
        selector: '[data-guide="content-generator"]',
        title: '✨ Générateur de contenu',
        content: 'L\'IA crée des posts adaptés à chaque plateforme.',
        details: [
          'Facebook : texte + image, ton conversationnel',
          'Instagram : visuel fort + hashtags optimisés',
          'LinkedIn : ton professionnel, actualités corporate'
        ],
        action: 'Décrivez le sujet, l\'IA adapte le format',
        position: 'left'
      },
      {
        selector: '[data-guide="engagement-stats"]',
        title: '📊 Statistiques engagement',
        content: 'Performance de vos publications.',
        details: [
          'Reach : nombre de personnes atteintes',
          'Engagement : likes, commentaires, partages',
          'Taux d\'engagement : engagement/reach',
          'Meilleurs posts : top performers du mois'
        ],
        interpretation: 'Taux > 5% = excellent. Analysez les posts performants pour répliquer.',
        position: 'bottom'
      },
      {
        selector: '[data-guide="best-times"]',
        title: '⏰ Meilleurs horaires',
        content: 'L\'IA analyse quand votre audience est active.',
        details: [
          'Heatmap par jour et heure',
          'Suggestions de créneaux optimaux',
          'Adaptation aux fuseaux horaires (Tahiti, France, Japon)'
        ],
        interpretation: 'Programmez vos posts importants sur les créneaux verts.',
        position: 'top'
      }
    ]
  },

  // ==========================================
  // 9. VISUAL FACTORY
  // ==========================================
  {
    route: '/visual-factory',
    pageName: 'Visual Factory',
    pageDescription: 'Création automatique de visuels marketing avec l\'IA.',
    roiMetric: '10h/mois économisées',
    roiDetails: '10h/mois de graphiste économisées. Coût graphiste externe : ~15 000 XPF/h. Économie : 150 000 XPF/mois. Plus la réactivité : créer un visuel promo en 2min vs 2 jours d\'attente.',
    benefits: [
      'Création de visuels marketing en quelques clics',
      'Templates respectant la charte ATN automatiquement',
      'Génération IA de visuels uniques (paysages, avions...)',
      'Adaptation multi-formats (stories, posts, bannières)',
      'Réactivité maximale pour les promos flash'
    ],
    atnRequirements: [
      { element: 'Charte graphique', source: 'Guidelines ATN', status: 'warning', note: 'Besoin : logos HD, couleurs Pantone/Hex, typographies officielles' },
      { element: 'Banque d\'images', source: 'Photothèque ATN', status: 'warning', note: 'Besoin accès photos officielles (avions, destinations, crew)' },
      { element: 'API Fal.ai', source: 'Génération IA', status: 'ok', note: 'Configuré via n8n Build 17' }
    ],
    steps: [
      {
        selector: '[data-guide="template-gallery"]',
        title: '🖼️ Galerie de templates',
        content: 'Modèles prêts à personnaliser aux couleurs ATN.',
        details: [
          'Posts réseaux sociaux (carré, story, bannière)',
          'Bannières email',
          'Visuels promotionnels',
          'Infographies destinations'
        ],
        action: 'Cliquez sur un template pour le personnaliser',
        position: 'right'
      },
      {
        selector: '[data-guide="ai-generator"]',
        title: '🤖 Génération IA',
        content: 'Créez des visuels uniques avec l\'IA.',
        details: [
          'Décrivez ce que vous voulez en texte',
          'L\'IA génère plusieurs propositions',
          'Affinez avec des instructions supplémentaires',
          'Export en haute résolution'
        ],
        interpretation: 'Exemple : "Photo de plage Bora Bora avec texte promo -30%"',
        position: 'left'
      },
      {
        selector: '[data-guide="brand-assets"]',
        title: '🎨 Assets de marque',
        content: 'Bibliothèque des éléments visuels ATN.',
        details: [
          'Logos (toutes versions)',
          'Palette de couleurs officielle',
          'Typographies autorisées',
          'Photos validées (banque d\'images ATN)'
        ],
        interpretation: 'Utilisez uniquement ces éléments pour rester dans la charte.',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 10. VEILLE CONCURRENCE
  // ==========================================
  {
    route: '/competitors',
    pageName: 'Veille Concurrence',
    pageDescription: 'Surveillance automatique des concurrents avec alertes temps réel.',
    roiMetric: 'Réagir en 24h',
    roiDetails: 'Une promo concurrent non détectée peut vous faire perdre des parts de marché. Réagir en 24h vs 7 jours = garder 80% des clients hésitants. Sur PPT-LAX, ça représente potentiellement 5-10M XPF/mois préservés.',
    benefits: [
      'Détection immédiate des promos concurrentes',
      'Comparatif prix automatique et actualisé',
      'Alertes en temps réel (email, dashboard)',
      'Historique des variations pour anticiper les tendances',
      'Avantage stratégique pour ajuster vos offres'
    ],
    atnRequirements: [
      { element: 'Scraping concurrents', source: 'APIs publiques', status: 'ok', note: 'Configuré : Air France, French Bee, United, Hawaiian' },
      { element: 'Workflow veille', source: 'n8n Build 6', status: 'ok', note: 'Surveillance quotidienne active' },
      { element: 'Prix ATN temps réel', source: 'API yield management', status: 'warning', note: 'Optionnel : pour comparaison automatique avec vos prix' }
    ],
    steps: [
      {
        selector: '[data-guide="competitor-cards"]',
        title: '✈️ Fiches concurrents',
        content: 'Vue d\'ensemble de chaque concurrent surveillé.',
        details: [
          'Air France : routes Pacifique, promos, actualités',
          'French Bee : prix low-cost, nouvelles routes',
          'United Airlines : connexions USA',
          'Hawaiian Airlines : Hawaï-Tahiti'
        ],
        interpretation: 'Cliquez sur un concurrent pour voir son historique complet.',
        position: 'right'
      },
      {
        selector: '[data-guide="price-comparison"]',
        title: '💰 Comparatif prix',
        content: 'Tableau des prix par route et concurrent.',
        details: [
          'PPT-LAX : vos prix vs concurrence',
          'PPT-CDG : idem',
          'PPT-NRT : idem',
          'Évolution sur 30/60/90 jours'
        ],
        interpretation: 'Rouge = vous êtes plus cher. Vert = vous êtes compétitif.',
        position: 'left'
      },
      {
        selector: '[data-guide="promo-alerts"]',
        title: '🚨 Alertes promos',
        content: 'Notifications quand un concurrent lance une offre.',
        details: [
          'Détection automatique des promos',
          'Analyse du niveau de remise',
          'Durée de l\'offre',
          'Routes concernées'
        ],
        action: 'Cliquez sur "Créer contre-offre" pour réagir rapidement',
        position: 'bottom'
      },
      {
        selector: '[data-guide="market-share"]',
        title: '📊 Parts de marché',
        content: 'Estimation de votre position sur chaque route.',
        details: [
          'Basé sur les données publiques et estimations',
          'Évolution mensuelle',
          'Benchmark vs objectifs ATN'
        ],
        interpretation: 'Objectif : maintenir >40% sur PPT-LAX, >30% sur PPT-CDG',
        position: 'top'
      }
    ]
  },

  // ==========================================
  // 11. GESTION AVIS
  // ==========================================
  {
    route: '/reviews',
    pageName: 'Gestion Avis',
    pageDescription: 'Réponses automatiques aux avis clients sur toutes les plateformes.',
    roiMetric: '+0.5 étoile moyenne',
    roiDetails: '+0.5 étoile sur Google/TripAdvisor = +9% de conversions selon les études. Sur 100 000 visiteurs/an qui consultent les avis, c\'est 9 000 réservations additionnelles potentielles. Impact massif.',
    benefits: [
      'Réponses rapides et professionnelles aux avis (positifs et négatifs)',
      'Détection automatique du sentiment et de l\'ironie',
      'Amélioration de l\'e-réputation mesurable',
      'Récupération des clients insatisfaits par réponse empathique',
      'Économie de 8h/mois de modération manuelle'
    ],
    atnRequirements: [
      { element: 'Google Business', source: 'API Google My Business', status: 'warning', note: 'Besoin accès propriétaire/admin profil GMB Air Tahiti Nui' },
      { element: 'TripAdvisor', source: 'API TripAdvisor', status: 'warning', note: 'Besoin credentials compte TripAdvisor ATN' },
      { element: 'Trustpilot', source: 'API Trustpilot', status: 'warning', note: 'Optionnel si compte Trustpilot existant' },
      { element: 'Workflow', source: 'n8n Build 7', status: 'ok', note: 'Workflow réponses avis prêt' }
    ],
    steps: [
      {
        selector: '[data-guide="review-inbox"]',
        title: '📬 Boîte de réception avis',
        content: 'Tous les avis collectés depuis Google, TripAdvisor, Trustpilot...',
        details: [
          'Source : plateforme d\'origine',
          'Note : étoiles données',
          'Texte : contenu de l\'avis',
          'Statut : non traité, répondu, escaladé'
        ],
        interpretation: 'Priorisez les avis 1-2 étoiles (urgents) puis 5 étoiles (fidélisation).',
        position: 'right'
      },
      {
        selector: '[data-guide="sentiment-analysis"]',
        title: '😊 Analyse de sentiment',
        content: 'L\'IA détecte le ton de chaque avis.',
        details: [
          'Positif : client satisfait, à remercier',
          'Neutre : feedback constructif',
          'Négatif : problème à résoudre',
          'Ironie détectée : attention aux faux positifs'
        ],
        interpretation: 'L\'IA détecte même l\'ironie ("Super, 5h de retard...")',
        position: 'left'
      },
      {
        selector: '[data-guide="auto-responses"]',
        title: '🤖 Réponses automatiques',
        content: 'L\'IA génère des réponses personnalisées.',
        details: [
          'Adaptées au ton de l\'avis',
          'Personnalisées avec le prénom si disponible',
          'Proposent des solutions concrètes si négatif',
          'Respectent le ton de marque ATN'
        ],
        action: 'Validez, modifiez ou régénérez avant envoi',
        position: 'bottom'
      },
      {
        selector: '[data-guide="review-stats"]',
        title: '📊 Statistiques avis',
        content: 'Évolution de votre e-réputation.',
        details: [
          'Note moyenne par plateforme',
          'Évolution sur 30/60/90 jours',
          'Volume d\'avis reçus',
          'Temps de réponse moyen'
        ],
        interpretation: 'Objectif : répondre sous 24h, note moyenne >4.2/5',
        position: 'top'
      }
    ]
  },

  // ==========================================
  // 12. REVIEW INTELLIGENCE
  // ==========================================
  {
    route: '/review-intelligence',
    pageName: 'Review Intelligence',
    pageDescription: 'Analyse avancée des avis pour détecter les tendances.',
    roiMetric: 'Détecter tendances',
    roiDetails: 'Détecter une tendance négative (ex: retards fréquents) avant qu\'elle n\'impacte la note globale permet d\'agir en amont. Éviter une baisse de 0.3 étoile = préserver 5% de conversions = millions de XPF.',
    benefits: [
      'Vue d\'ensemble des thèmes récurrents dans les avis',
      'Détection précoce des problèmes opérationnels',
      'Benchmark automatique vs concurrents',
      'Identification des points forts à valoriser en com',
      'Données pour arbitrer les investissements (service, confort...)'
    ],
    atnRequirements: [
      { element: 'Historique avis', source: 'Base Gestion Avis', status: 'ok', note: 'Alimenté par Build 7' },
      { element: 'Workflow analyse', source: 'n8n Build 16', status: 'ok', note: 'Review Intelligence actif (analyse sentiment + ironie)' }
    ],
    steps: [
      {
        selector: '[data-guide="topic-analysis"]',
        title: '🏷️ Analyse par thème',
        content: 'L\'IA catégorise les avis par sujet.',
        details: [
          'Service à bord : repas, personnel, confort',
          'Ponctualité : retards, annulations',
          'Réservation : site web, call center',
          'Bagages : franchise, réclamations'
        ],
        interpretation: 'Identifiez les thèmes récurrents pour prioriser les améliorations.',
        position: 'right'
      },
      {
        selector: '[data-guide="trend-detection"]',
        title: '📈 Détection de tendances',
        content: 'Évolution des sujets dans le temps.',
        details: [
          'Hausse soudaine de plaintes = alerte',
          'Amélioration progressive = succès d\'une action',
          'Comparaison avec les concurrents'
        ],
        interpretation: 'Si "retards" augmente de 50%, il y a un problème opérationnel.',
        position: 'left'
      },
      {
        selector: '[data-guide="competitor-comparison"]',
        title: '🆚 Benchmark concurrence',
        content: 'Comparez votre e-réputation aux concurrents.',
        details: [
          'Notes moyennes comparées',
          'Points forts/faibles relatifs',
          'Verbatims différenciants'
        ],
        interpretation: 'Utilisez vos points forts dans votre communication.',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 13. LEAD SCORING
  // ==========================================
  {
    route: '/lead-scoring',
    pageName: 'Lead Scoring',
    pageDescription: 'Qualification automatique des prospects par l\'IA.',
    roiMetric: '+30% conversion',
    roiDetails: '+30% de conversion sur les leads qualifiés = 30% de réservations en plus à effort commercial égal. Si vous convertissez 100 leads/mois, c\'est 30 réservations additionnelles soit ~3M XPF/mois de revenus supplémentaires.',
    benefits: [
      'Priorisation automatique des leads les plus chauds',
      'Nurturing personnalisé selon le niveau d\'engagement',
      'Moins de temps perdu sur les leads froids',
      'Meilleur taux de conversion global',
      'Données pour optimiser les campagnes d\'acquisition'
    ],
    atnRequirements: [
      { element: 'Données comportement', source: 'Google Analytics / site ATN', status: 'warning', note: 'Besoin tracking comportemental sur le site (pages vues, temps passé)' },
      { element: 'CRM ATN', source: 'Export/API CRM', status: 'warning', note: 'Idéalement sync bidirectionnelle avec le CRM commercial ATN' },
      { element: 'Workflow', source: 'n8n Build 11', status: 'ok', note: 'Lead scoring engine prêt' }
    ],
    steps: [
      {
        selector: '[data-guide="lead-list"]',
        title: '👤 Liste des leads',
        content: 'Tous les contacts avec leur score de qualification.',
        details: [
          'Score 0-100 : probabilité de conversion',
          'Source : site web, newsletter, chatbot...',
          'Comportement : pages vues, emails ouverts',
          'Statut : froid, tiède, chaud'
        ],
        interpretation: 'Concentrez vos efforts sur les leads >70 (chauds).',
        position: 'right'
      },
      {
        selector: '[data-guide="scoring-criteria"]',
        title: '🎯 Critères de scoring',
        content: 'Comment l\'IA calcule le score.',
        details: [
          '+20 points : a demandé un devis',
          '+15 points : a consulté les prix >3 fois',
          '+10 points : abonné newsletter',
          '+5 points : a utilisé le chatbot',
          '-10 points : inactif depuis 30 jours'
        ],
        interpretation: 'Personnalisez les critères selon votre expérience.',
        position: 'left'
      },
      {
        selector: '[data-guide="auto-nurturing"]',
        title: '🔄 Nurturing automatique',
        content: 'Séquences d\'emails selon le score.',
        details: [
          'Lead froid : contenus inspirationnels',
          'Lead tiède : offres et promos',
          'Lead chaud : relance personnalisée, appel suggéré'
        ],
        action: 'L\'IA adapte le contenu au comportement du lead',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 14. VOLS
  // ==========================================
  {
    route: '/flights',
    pageName: 'Vols',
    pageDescription: 'Monitoring temps réel de tous les vols ATN.',
    roiMetric: 'Alertes temps réel',
    roiDetails: 'Information proactive des passagers en cas de retard = -40% d\'appels au call center. Sur 50 appels évités/incident × 20 min/appel = 16h économisées par perturbation. Plus satisfaction client préservée.',
    benefits: [
      'Vue temps réel de tous les vols ATN',
      'Alertes automatiques retards/annulations',
      'Communication proactive aux passagers concernés',
      'Chatbot informé en temps réel (répond correctement aux questions)',
      'Historique pour analyse des récurrences'
    ],
    atnRequirements: [
      { element: 'Données vols temps réel', source: 'API OPS ATN ou FlightAware', status: 'missing', note: 'CRITIQUE : Besoin API temps réel des statuts de vols' },
      { element: 'Liste passagers', source: 'API réservations', status: 'missing', note: 'Pour notifier les passagers concernés' },
      { element: 'Workflow', source: 'n8n Build 8', status: 'ok', note: 'Workflow monitoring vols prêt' }
    ],
    steps: [
      {
        selector: '[data-guide="flight-board"]',
        title: '🛫 Tableau des vols',
        content: 'Vue en temps réel de tous les vols ATN.',
        details: [
          'Numéro de vol',
          'Route (départ → arrivée)',
          'Horaire prévu et réel',
          'Statut : à l\'heure, retardé, embarquement, décollé'
        ],
        interpretation: 'Les vols en rouge ont un problème à surveiller.',
        position: 'right'
      },
      {
        selector: '[data-guide="delay-alerts"]',
        title: '⏰ Alertes retard',
        content: 'Notifications automatiques en cas de retard.',
        details: [
          'Retard >15min : alerte jaune',
          'Retard >1h : alerte orange',
          'Annulation : alerte rouge',
          'Communication auto aux passagers concernés'
        ],
        action: 'Le chatbot est informé automatiquement pour répondre aux questions',
        position: 'left'
      },
      {
        selector: '[data-guide="load-factor"]',
        title: '📊 Taux de remplissage',
        content: 'Coefficient de remplissage par vol.',
        details: [
          'Vert : >85% (bon)',
          'Orange : 60-85% (moyen)',
          'Rouge : <60% (à surveiller)'
        ],
        interpretation: 'Les vols rouges peuvent nécessiter une promo de dernière minute.',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 15. RESERVATIONS
  // ==========================================
  {
    route: '/bookings',
    pageName: 'Réservations',
    pageDescription: 'Suivi des réservations avec opportunités d\'upsell.',
    roiMetric: '+15% upsell',
    roiDetails: '+15% d\'upsell sur les réservations. Si panier moyen = 200 000 XPF et 1000 réservations/mois, 15% d\'upsell à +30 000 XPF moyen = 4.5M XPF/mois de revenus additionnels.',
    benefits: [
      'Vue centralisée de toutes les réservations',
      'Détection automatique des opportunités d\'upsell',
      'Emails de suggestion personnalisés (bagage, siège, salon)',
      'Gestion simplifiée des modifications',
      'Analyse des tendances de réservation'
    ],
    atnRequirements: [
      { element: 'API réservations', source: 'GDS (Amadeus/Sabre)', status: 'missing', note: 'CRITIQUE : Besoin accès API système de réservation' },
      { element: 'Catalogue produits', source: 'Liste ancillaries ATN', status: 'warning', note: 'Liste des produits upsell avec prix' },
      { element: 'Workflow', source: 'n8n Build 9', status: 'ok', note: 'Workflow upsell automation prêt' }
    ],
    steps: [
      {
        selector: '[data-guide="booking-list"]',
        title: '📋 Liste des réservations',
        content: 'Toutes les réservations récentes.',
        details: [
          'Référence de réservation',
          'Passager(s)',
          'Vol(s) concerné(s)',
          'Classe et options choisies',
          'Montant total'
        ],
        interpretation: 'Cliquez sur une réservation pour voir le détail complet.',
        position: 'right'
      },
      {
        selector: '[data-guide="upsell-opportunities"]',
        title: '💎 Opportunités upsell',
        content: 'Suggestions de ventes additionnelles.',
        details: [
          'Surclassement disponible',
          'Bagage supplémentaire recommandé',
          'Assurance voyage non souscrite',
          'Siège premium disponible'
        ],
        action: 'L\'IA envoie automatiquement des emails de suggestion',
        position: 'left'
      },
      {
        selector: '[data-guide="modification-requests"]',
        title: '✏️ Demandes de modification',
        content: 'Requêtes clients en attente.',
        details: [
          'Changement de date',
          'Ajout de passager',
          'Modification de classe',
          'Annulation'
        ],
        interpretation: 'Traitées automatiquement si simples, escaladées si complexes.',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 16. CALENDRIER
  // ==========================================
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
    atnRequirements: [
      { element: 'Données agrégées', source: 'Workflows newsletter/social/SEO', status: 'ok', note: 'Alimenté automatiquement par les autres modules' }
    ],
    steps: [
      {
        selector: '[data-guide="calendar-view"]',
        title: '📅 Vue calendrier',
        content: 'Visualisation mensuelle de toutes les actions prévues.',
        details: [
          'Newsletters programmées',
          'Articles à publier',
          'Posts réseaux sociaux',
          'Campagnes promotionnelles'
        ],
        interpretation: 'Chaque couleur = un type de contenu. Évitez les jours vides.',
        position: 'center'
      },
      {
        selector: '[data-guide="drag-drop"]',
        title: '✋ Glisser-déposer',
        content: 'Réorganisez facilement vos publications.',
        action: 'Glissez un élément pour changer sa date',
        position: 'right'
      },
      {
        selector: '[data-guide="auto-suggestions"]',
        title: '💡 Suggestions automatiques',
        content: 'L\'IA propose des créneaux optimaux.',
        details: [
          'Basé sur les performances passées',
          'Évite les conflits de contenu',
          'Tient compte des événements ATN'
        ],
        interpretation: 'Les créneaux verts sont recommandés par l\'IA.',
        position: 'left'
      }
    ]
  },

  // ==========================================
  // 17. PARCOURS CLIENT
  // ==========================================
  {
    route: '/journeys',
    pageName: 'Parcours Client',
    pageDescription: 'Visualisation et optimisation des customer journeys.',
    roiMetric: '+20% rétention',
    roiDetails: '+20% de rétention = +20% de clients qui revoyagent avec ATN. Acquérir un nouveau client coûte 5x plus cher que fidéliser. Sur 10 000 clients/an, 2000 fidélisations additionnelles = énorme valeur LTV.',
    benefits: [
      'Visualisation complète du parcours client (découverte → fidélisation)',
      'Automatisation des touchpoints clés (J-7, J-1, J+1, J+30)',
      'Détection des points d\'abandon pour optimisation',
      'Personnalisation de l\'expérience à chaque étape',
      'Mesure de l\'efficacité de chaque touchpoint'
    ],
    atnRequirements: [
      { element: 'Données réservation', source: 'API GDS', status: 'missing', note: 'Pour déclencher les touchpoints au bon moment' },
      { element: 'Email transactionnel', source: 'Brevo ou SMTP ATN', status: 'warning', note: 'Pour envoyer les emails du parcours' },
      { element: 'Workflow', source: 'n8n Build 10', status: 'ok', note: 'Workflow customer journey prêt' }
    ],
    steps: [
      {
        selector: '[data-guide="journey-map"]',
        title: '🗺️ Carte du parcours',
        content: 'Visualisation des étapes client de A à Z.',
        details: [
          'Découverte : comment ils trouvent ATN',
          'Considération : comparaison des options',
          'Réservation : achat du billet',
          'Pré-voyage : préparation',
          'Voyage : expérience à bord',
          'Post-voyage : fidélisation'
        ],
        interpretation: 'Chaque étape a des touchpoints automatisés.',
        position: 'center'
      },
      {
        selector: '[data-guide="touchpoints"]',
        title: '📍 Points de contact',
        content: 'Actions automatisées à chaque étape.',
        details: [
          'J-7 : email de rappel avec checklist',
          'J-1 : notification check-in en ligne',
          'J+1 : email de remerciement',
          'J+30 : enquête satisfaction + offre fidélité'
        ],
        action: 'Cliquez sur un touchpoint pour voir/modifier l\'automatisation',
        position: 'right'
      },
      {
        selector: '[data-guide="drop-off-analysis"]',
        title: '📉 Analyse des abandons',
        content: 'Où les clients décrochent dans le parcours.',
        details: [
          'Taux d\'abandon par étape',
          'Raisons identifiées',
          'Actions de récupération'
        ],
        interpretation: 'Concentrez vos efforts sur les étapes à fort abandon.',
        position: 'left'
      }
    ]
  },

  // ==========================================
  // 18. RAPPORTS
  // ==========================================
  {
    route: '/reports',
    pageName: 'Rapports',
    pageDescription: 'Génération automatique de rapports de performance.',
    roiMetric: 'Chaque lundi matin',
    roiDetails: 'Compilation manuelle d\'un rapport hebdo = 3-4h. × 52 semaines = 200h/an économisées. Plus : insights IA que vous n\'auriez jamais trouvés manuellement.',
    benefits: [
      'Rapports automatiques chaque lundi sans effort',
      'Templates personnalisables (hebdo, mensuel, campagne)',
      'Insights IA (tendances, anomalies, recommandations)',
      'Export PDF ou lien dashboard partageable',
      'Historique pour comparaison période vs période'
    ],
    atnRequirements: [
      { element: 'Données des autres modules', source: 'Agrégation interne', status: 'ok', note: 'Les rapports compilent les données des autres pages' },
      { element: 'Destinataires', source: 'Emails équipe', status: 'warning', note: 'Liste des emails pour envoi automatique des rapports' }
    ],
    steps: [
      {
        selector: '[data-guide="report-templates"]',
        title: '📄 Templates de rapports',
        content: 'Modèles prêts à générer.',
        details: [
          'Rapport hebdomadaire : KPIs de la semaine',
          'Rapport mensuel : analyse complète',
          'Rapport campagne : performance d\'une action spécifique',
          'Rapport direction : synthèse executive'
        ],
        action: 'Cliquez sur "Générer" pour créer le rapport',
        position: 'right'
      },
      {
        selector: '[data-guide="auto-scheduling"]',
        title: '⏰ Programmation automatique',
        content: 'Recevez vos rapports sans y penser.',
        details: [
          'Hebdo : chaque lundi 8h',
          'Mensuel : 1er du mois',
          'Destinataires configurables',
          'Format PDF ou lien dashboard'
        ],
        interpretation: 'Les rapports arrivent dans votre boîte mail automatiquement.',
        position: 'left'
      },
      {
        selector: '[data-guide="ai-insights"]',
        title: '🧠 Insights IA',
        content: 'L\'IA ajoute des analyses et recommandations.',
        details: [
          'Tendances détectées',
          'Anomalies signalées',
          'Recommandations d\'actions',
          'Prévisions pour la période suivante'
        ],
        interpretation: 'Ces insights font gagner des heures d\'analyse.',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 19. ATTRIBUTION
  // ==========================================
  {
    route: '/attribution',
    pageName: 'Attribution',
    pageDescription: 'Identifiez l\'origine de chaque vente.',
    roiMetric: 'ROI par canal',
    roiDetails: 'Savoir d\'où viennent vos ventes permet d\'optimiser les budgets. Réallouer 20% du budget des canaux faibles vers les canaux forts = +20% de ROI marketing global. Sur 10M XPF/an de budget, c\'est 2M XPF mieux investis.',
    benefits: [
      'Vision claire de l\'origine de chaque réservation',
      'ROI précis par canal marketing',
      'Optimisation des budgets publicitaires',
      'Compréhension du parcours multi-touchpoint',
      'Données pour négocier avec les agences/partenaires'
    ],
    atnRequirements: [
      { element: 'Google Analytics 4', source: 'GA4 API', status: 'warning', note: 'Besoin accès GA4 avec tracking e-commerce configuré' },
      { element: 'UTM tracking', source: 'Paramètres URL', status: 'warning', note: 'Les campagnes doivent utiliser les UTM correctement' },
      { element: 'Données réservation', source: 'API GDS', status: 'missing', note: 'Pour matcher conversions et réservations' }
    ],
    steps: [
      {
        selector: '[data-guide="channel-breakdown"]',
        title: '📊 Répartition par canal',
        content: 'D\'où viennent vos ventes.',
        details: [
          'Recherche organique (Google)',
          'Publicité payante (Google Ads, Meta)',
          'Email marketing (newsletters)',
          'Réseaux sociaux (posts)',
          'Direct (site en direct)',
          'Chatbot (conversions Tiare)'
        ],
        interpretation: 'Investissez plus sur les canaux à fort ROI.',
        position: 'right'
      },
      {
        selector: '[data-guide="conversion-paths"]',
        title: '🛤️ Chemins de conversion',
        content: 'Parcours typiques avant achat.',
        details: [
          'Exemple : Google → Newsletter → Chatbot → Achat',
          'Nombre de touchpoints moyen',
          'Durée moyenne du cycle'
        ],
        interpretation: 'Comprenez comment les canaux travaillent ensemble.',
        position: 'left'
      },
      {
        selector: '[data-guide="roi-calculator"]',
        title: '💰 Calculateur ROI',
        content: 'Rentabilité de chaque canal.',
        details: [
          'Coût par canal (pub, outils, temps)',
          'Revenus générés',
          'ROI = (Revenus - Coûts) / Coûts × 100'
        ],
        interpretation: 'Un ROI > 300% est excellent pour l\'email marketing.',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 20. A/B TESTS
  // ==========================================
  {
    route: '/ab-tests',
    pageName: 'A/B Tests',
    pageDescription: 'Optimisation continue par expérimentation.',
    roiMetric: '+15% conversion',
    roiDetails: 'Chaque A/B test gagnant améliore les conversions de 5-15%. 4 tests réussis/an avec +10% chacun = +46% cumulé. Sur un trafic de 100 000 visiteurs, c\'est des milliers de conversions additionnelles.',
    benefits: [
      'Décisions basées sur des données, pas des opinions',
      'Amélioration continue et mesurable',
      'Suggestions de tests par l\'IA (idées + impact estimé)',
      'Résultats avec significance statistique',
      'Historique des tests pour capitaliser sur les learnings'
    ],
    atnRequirements: [
      { element: 'Intégration site', source: 'Script A/B testing', status: 'warning', note: 'Besoin d\'injecter un script sur le site ATN pour les tests' },
      { element: 'Google Analytics', source: 'GA4 API', status: 'warning', note: 'Pour mesurer l\'impact des variantes' }
    ],
    steps: [
      {
        selector: '[data-guide="active-tests"]',
        title: '🧪 Tests en cours',
        content: 'Expérimentations actuellement actives.',
        details: [
          'Nom du test',
          'Variantes comparées (A vs B)',
          'Métrique suivie',
          'Progression (% du trafic testé)'
        ],
        interpretation: 'Attendez une significance statistique avant de conclure.',
        position: 'right'
      },
      {
        selector: '[data-guide="test-results"]',
        title: '📈 Résultats',
        content: 'Performance de chaque variante.',
        details: [
          'Taux de conversion A vs B',
          'Intervalle de confiance',
          'Gagnant statistique',
          'Impact estimé sur le revenu'
        ],
        interpretation: 'Vert = gagnant significatif. Gris = pas assez de données.',
        position: 'left'
      },
      {
        selector: '[data-guide="test-ideas"]',
        title: '💡 Idées de tests',
        content: 'L\'IA suggère des expérimentations.',
        details: [
          'Basé sur les données et best practices',
          'Impact potentiel estimé',
          'Difficulté de mise en œuvre'
        ],
        action: 'Cliquez sur une idée pour lancer le test',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 21. ROI DASHBOARD
  // ==========================================
  {
    route: '/roi',
    pageName: 'ROI Dashboard',
    pageDescription: 'Vue globale du retour sur investissement PACIFIK\'AI.',
    roiMetric: 'Vue globale',
    roiDetails: 'Cette page centralise TOUS les gains générés par la plateforme. Objectif : démontrer un ROI > 500% (5x l\'investissement) dès le 3ème mois. Vous voyez en temps réel la rentabilité de votre investissement PACIFIK\'AI.',
    benefits: [
      'Justification chiffrée de l\'investissement IA',
      'Données pour vos reportings direction',
      'Identification des modules les plus rentables',
      'Projection du ROI sur 12 mois',
      'Arguments factuels pour étendre le projet'
    ],
    atnRequirements: [
      { element: 'Données agrégées', source: 'Tous les modules', status: 'ok', note: 'Compilation automatique des économies et revenus' }
    ],
    steps: [
      {
        selector: '[data-guide="total-roi"]',
        title: '💰 ROI Total',
        content: 'Retour sur investissement global de la plateforme.',
        details: [
          'Investissement : abonnement PACIFIK\'AI + temps équipe',
          'Gains : économies + revenus additionnels',
          'ROI = Gains / Investissement × 100'
        ],
        interpretation: 'Objectif : ROI > 500% dès le 3ème mois.',
        position: 'center'
      },
      {
        selector: '[data-guide="savings-breakdown"]',
        title: '⏱️ Économies de temps',
        content: 'Heures économisées par automatisation.',
        details: [
          'Chatbot : 40h/mois (équivalent 0.25 ETP)',
          'Newsletters : 15h/mois',
          'Réponses avis : 10h/mois',
          'Rapports : 8h/mois'
        ],
        interpretation: 'Valorisez ces heures au coût horaire de votre équipe.',
        position: 'right'
      },
      {
        selector: '[data-guide="revenue-impact"]',
        title: '📈 Impact revenus',
        content: 'Revenus générés grâce à l\'IA.',
        details: [
          'Upsell chatbot : XXX XPF/mois',
          'Conversions newsletter : XXX XPF/mois',
          'Récupération abandons : XXX XPF/mois'
        ],
        interpretation: 'Ces revenus n\'existeraient pas sans les automatisations.',
        position: 'left'
      }
    ]
  },

  // ==========================================
  // 22. UPSELL ENGINE
  // ==========================================
  {
    route: '/upsell',
    pageName: 'Upsell Engine',
    pageDescription: 'Configuration du moteur de recommandations.',
    roiMetric: '+25% panier moyen',
    roiDetails: '+25% de panier moyen grâce aux recommandations intelligentes. Sur 1000 réservations/mois à 200 000 XPF moyen, c\'est 50M XPF de revenus additionnels mensuels potentiels.',
    benefits: [
      'Suggestions d\'upsell personnalisées et pertinentes',
      'Configuration fine des règles de recommandation',
      'Optimisation automatique basée sur les conversions',
      'Multi-canal : chatbot, email, site web',
      'Mesure précise du revenu généré par recommandation'
    ],
    atnRequirements: [
      { element: 'Catalogue produits', source: 'Liste ancillaries ATN', status: 'warning', note: 'Liste des produits upsell avec prix et conditions' },
      { element: 'API réservation', source: 'GDS', status: 'missing', note: 'Pour connaître ce que le client a déjà acheté' },
      { element: 'Workflow', source: 'n8n Build 14', status: 'ok', note: 'Upsell engine prêt' }
    ],
    steps: [
      {
        selector: '[data-guide="product-catalog"]',
        title: '📦 Catalogue produits',
        content: 'Options disponibles à l\'upsell.',
        details: [
          'Surclassements (Economy → Premium → Business)',
          'Bagages supplémentaires',
          'Sièges premium',
          'Assurances',
          'Transferts aéroport',
          'Accès salons'
        ],
        action: 'Activez/désactivez les produits à proposer',
        position: 'right'
      },
      {
        selector: '[data-guide="recommendation-rules"]',
        title: '🎯 Règles de recommandation',
        content: 'Quand proposer quoi.',
        details: [
          'Si voyage >8h → proposer surclassement',
          'Si famille → proposer bagages enfants',
          'Si business traveler → proposer salon',
          'Si premier vol → proposer assurance'
        ],
        interpretation: 'L\'IA affine ces règles automatiquement selon les conversions.',
        position: 'left'
      },
      {
        selector: '[data-guide="conversion-rates"]',
        title: '📊 Taux de conversion',
        content: 'Performance de chaque recommandation.',
        details: [
          'Taux d\'affichage',
          'Taux de clic',
          'Taux d\'achat',
          'Revenu moyen généré'
        ],
        interpretation: 'Désactivez les recommandations à <1% de conversion.',
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 23. PREFERENCES
  // ==========================================
  {
    route: '/preferences',
    pageName: 'Préférences',
    pageDescription: 'Personnalisation de votre expérience dashboard.',
    roiMetric: 'Confort utilisateur',
    roiDetails: 'Une interface bien configurée = utilisation quotidienne effective. Si le dashboard n\'est pas agréable à utiliser, il sera abandonné et le ROI s\'effondre.',
    benefits: [
      'Notifications personnalisées (éviter le spam, garder l\'essentiel)',
      'Dashboard adapté à vos besoins (widgets, ordre)',
      'Thème clair/sombre selon vos préférences',
      'Fuseau horaire correct (important pour la Polynésie)'
    ],
    atnRequirements: [
      { element: 'Aucun', source: 'Configuration interne', status: 'ok', note: 'Cette page est purement côté dashboard' }
    ],
    steps: [
      {
        selector: '[data-guide="notification-settings"]',
        title: '🔔 Notifications',
        content: 'Choisissez quand être alerté.',
        details: [
          'Email : alertes critiques uniquement',
          'Push : toutes les alertes',
          'SMS : urgences seulement',
          'Fréquence de digest'
        ],
        action: 'Évitez le "notification fatigue" en filtrant intelligemment',
        position: 'right'
      },
      {
        selector: '[data-guide="dashboard-layout"]',
        title: '🖼️ Disposition',
        content: 'Personnalisez votre page d\'accueil.',
        details: [
          'Widgets affichés',
          'Ordre des widgets',
          'Taille des graphiques',
          'Thème clair/sombre'
        ],
        position: 'left'
      },
      {
        selector: '[data-guide="language-region"]',
        title: '🌍 Langue et région',
        content: 'Paramètres de localisation.',
        details: [
          'Langue de l\'interface',
          'Fuseau horaire',
          'Format des dates',
          'Devise par défaut'
        ],
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 24. PRIX CONCURRENTS
  // ==========================================
  {
    route: '/pricing-monitor',
    pageName: 'Prix Concurrents',
    pageDescription: 'Monitoring détaillé des tarifs concurrentiels.',
    roiMetric: 'Compétitivité prix',
    roiDetails: 'Être compétitif sur le prix est crucial dans l\'aérien. Surveiller les prix concurrents permet d\'ajuster votre yield management et de ne pas perdre de ventes par méconnaissance du marché.',
    benefits: [
      'Comparatif prix en temps réel par route',
      'Historique des variations de prix concurrents',
      'Alertes sur les baisses de prix significatives',
      'Données pour le yield management',
      'Benchmark permanent vs le marché'
    ],
    atnRequirements: [
      { element: 'Scraping concurrents', source: 'APIs publiques', status: 'ok', note: 'Configuré via Build 20' },
      { element: 'Prix ATN', source: 'API yield management', status: 'warning', note: 'Optionnel : vos prix pour comparaison directe' }
    ],
    steps: [
      {
        selector: '[data-guide="price-grid"]',
        title: '💰 Grille tarifaire',
        content: 'Comparatif prix par route et classe.',
        details: [
          'Vos prix vs chaque concurrent',
          'Par classe (Eco, Premium, Business)',
          'Par période (basse/haute saison)',
          'Historique des variations'
        ],
        interpretation: 'Les cellules rouges = vous êtes significativement plus cher.',
        position: 'right'
      },
      {
        selector: '[data-guide="price-alerts"]',
        title: '🚨 Alertes prix',
        content: 'Notifications sur les variations.',
        details: [
          'Seuil configurable (ex: variation >10%)',
          'Par concurrent spécifique',
          'Par route prioritaire'
        ],
        action: 'Configurez des alertes sur vos routes stratégiques',
        position: 'left'
      }
    ]
  },

  // ==========================================
  // 25. PLANNER
  // ==========================================
  {
    route: '/planner',
    pageName: 'Planner',
    pageDescription: 'Outil de planification de voyage pour les clients.',
    roiMetric: '+15% panier multi-îles',
    roiDetails: 'Les voyages multi-îles ont un panier moyen 2-3x supérieur au mono-île. +15% de conversion vers multi-îles = revenus significativement augmentés sur les vols inter-îles ATI.',
    benefits: [
      'Aide les clients à planifier des voyages complexes',
      'Suggère des itinéraires optimisés',
      'Augmente les ventes multi-destinations',
      'Réduction des demandes "sur mesure" au call center',
      'Intégré au chatbot pour réponses enrichies'
    ],
    atnRequirements: [
      { element: 'Catalogue îles', source: 'Contenu ATN', status: 'warning', note: 'Descriptions et photos des destinations' },
      { element: 'Connexions inter-îles', source: 'Programme vols ATI', status: 'warning', note: 'Horaires et disponibilités Air Tahiti (domestique)' }
    ],
    steps: [
      {
        selector: '[data-guide="trip-builder"]',
        title: '✈️ Constructeur de voyage',
        content: 'Aide les clients à planifier leur séjour.',
        details: [
          'Sélection des îles à visiter',
          'Durée recommandée par île',
          'Vols inter-îles suggérés',
          'Activités et hébergements'
        ],
        interpretation: 'Utilisé par le chatbot pour les demandes complexes.',
        position: 'right'
      },
      {
        selector: '[data-guide="itinerary-templates"]',
        title: '📋 Templates d\'itinéraires',
        content: 'Parcours types prêts à proposer.',
        details: [
          'Lune de miel : Tahiti → Moorea → Bora Bora',
          'Aventure : Tahiti → Rangiroa → Fakarava',
          'Famille : Tahiti → Moorea → Huahine',
          'Express : Tahiti → Bora Bora'
        ],
        action: 'Créez vos propres templates',
        position: 'left'
      }
    ]
  },

  // ==========================================
  // 26. GUIDE
  // ==========================================
  {
    route: '/guide',
    pageName: 'Guide',
    pageDescription: 'Aide et documentation de la plateforme.',
    roiMetric: 'Autonomie utilisateur',
    roiDetails: 'Un utilisateur autonome = moins de support nécessaire. Les tutoriels et guides réduisent de 80% les demandes de support basiques.',
    benefits: [
      'Prise en main rapide de la plateforme',
      'Tutoriels vidéo pour chaque fonctionnalité',
      'Contact support direct si besoin',
      'FAQ des questions fréquentes'
    ],
    atnRequirements: [
      { element: 'Aucun', source: 'Documentation intégrée', status: 'ok', note: 'Tout est inclus dans le dashboard' }
    ],
    steps: [
      {
        selector: '[data-guide="getting-started"]',
        title: '🚀 Prise en main',
        content: 'Guide de démarrage rapide.',
        details: [
          'Étape 1 : Explorer le dashboard',
          'Étape 2 : Tester le chatbot',
          'Étape 3 : Configurer les notifications',
          'Étape 4 : Personnaliser'
        ],
        position: 'right'
      },
      {
        selector: '[data-guide="video-tutorials"]',
        title: '🎬 Tutoriels vidéo',
        content: 'Formations en vidéo.',
        details: [
          'Tour complet du dashboard (5min)',
          'Gérer les conversations (3min)',
          'Créer une newsletter (4min)',
          'Analyser les rapports (6min)'
        ],
        action: 'Regardez les vidéos pour maîtriser chaque fonctionnalité',
        position: 'left'
      },
      {
        selector: '[data-guide="support-contact"]',
        title: '📞 Support',
        content: 'Comment nous contacter.',
        details: [
          'Email : support@pacifikai.com',
          'Chat : widget en bas à droite',
          'Téléphone : +689 89 55 81 89',
          'RDV : cal.com/pacifikai/support'
        ],
        position: 'bottom'
      }
    ]
  },

  // ==========================================
  // 27. PARAMETRES
  // ==========================================
  {
    route: '/settings',
    pageName: 'Paramètres',
    pageDescription: 'Configuration technique de la plateforme.',
    roiMetric: 'Maintenance système',
    roiDetails: 'Cette page permet de monitorer les connexions aux services externes. Une clé API expirée = fonctionnalité cassée. Surveillance proactive = continuité de service.',
    benefits: [
      'Vue d\'ensemble des connexions API',
      'Gestion des accès utilisateurs',
      'Logs techniques pour debug',
      'Alertes sur les problèmes techniques'
    ],
    atnRequirements: [
      { element: 'Toutes les clés API', source: 'Services externes', status: 'warning', note: 'Cette page liste toutes les intégrations et leur statut' }
    ],
    steps: [
      {
        selector: '[data-guide="api-keys"]',
        title: '🔑 Clés API',
        content: 'Connexions aux services externes.',
        details: [
          'Brevo : envoi d\'emails',
          'Google : Search Console, Analytics',
          'Facebook : publication automatique',
          'Système réservation : données vols'
        ],
        interpretation: 'Les clés expirées apparaissent en rouge.',
        action: 'Cliquez sur "Renouveler" si une clé expire',
        position: 'right'
      },
      {
        selector: '[data-guide="team-members"]',
        title: '👥 Équipe',
        content: 'Gestion des accès utilisateurs.',
        details: [
          'Ajouter des membres',
          'Définir les rôles (admin, éditeur, lecteur)',
          'Historique des connexions'
        ],
        action: 'Limitez les accès admin aux personnes essentielles',
        position: 'left'
      },
      {
        selector: '[data-guide="webhook-logs"]',
        title: '📝 Logs webhooks',
        content: 'Historique des automatisations.',
        details: [
          'Chaque appel aux workflows n8n',
          'Statut : succès, échec',
          'Temps de réponse',
          'Erreurs détaillées'
        ],
        interpretation: 'Utilisez pour déboguer si une automatisation ne fonctionne pas.',
        position: 'bottom'
      }
    ]
  }
]

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================

export default function InteractiveGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Trouver le guide de la page actuelle
  const currentPageGuide = COMPLETE_GUIDE.find(g => g.route === pathname)
  const currentStep = currentPageGuide?.steps[currentStepIndex]

  // Mettre en surbrillance l'élément
  useEffect(() => {
    if (!isOpen || !currentStep) {
      setHighlightedElement(null)
      return
    }

    const element = document.querySelector(currentStep.selector) as HTMLElement
    if (element) {
      setHighlightedElement(element)
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      setHighlightedElement(null)
    }
  }, [isOpen, currentStep])

  // Navigation
  const nextStep = useCallback(() => {
    if (!currentPageGuide) return

    if (currentStepIndex < currentPageGuide.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    } else {
      // Passer à la page suivante
      const currentIdx = COMPLETE_GUIDE.findIndex(g => g.route === pathname)
      if (currentIdx < COMPLETE_GUIDE.length - 1) {
        const nextPage = COMPLETE_GUIDE[currentIdx + 1]
        router.push(nextPage.route)
        setCurrentStepIndex(0)
      }
    }
  }, [currentPageGuide, currentStepIndex, pathname, router])

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }, [currentStepIndex])

  const skipToPage = (route: string) => {
    router.push(route)
    setCurrentStepIndex(0)
  }

  // Reset step quand on change de page
  useEffect(() => {
    setCurrentStepIndex(0)
  }, [pathname])

  // Calculer la position du tooltip
  const getTooltipPosition = () => {
    if (!highlightedElement || !currentStep) return {}

    const rect = highlightedElement.getBoundingClientRect()
    const position = currentStep.position || 'right'

    switch (position) {
      case 'top':
        return { bottom: `${window.innerHeight - rect.top + 20}px`, left: `${rect.left}px` }
      case 'bottom':
        return { top: `${rect.bottom + 20}px`, left: `${rect.left}px` }
      case 'left':
        return { top: `${rect.top}px`, right: `${window.innerWidth - rect.left + 20}px` }
      case 'right':
        return { top: `${rect.top}px`, left: `${rect.right + 20}px` }
      case 'center':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
      default:
        return { top: `${rect.top}px`, left: `${rect.right + 20}px` }
    }
  }

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
      <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setIsOpen(false)} />

      {/* Highlight de l'élément */}
      {highlightedElement && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 8,
            left: highlightedElement.getBoundingClientRect().left - 8,
            width: highlightedElement.getBoundingClientRect().width + 16,
            height: highlightedElement.getBoundingClientRect().height + 16,
            border: '3px solid #8b5cf6',
            borderRadius: '12px',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6), 0 0 30px rgba(139,92,246,0.5)',
          }}
        />
      )}

      {/* Tooltip d'explication */}
      {currentStep && (
        <div
          className="fixed z-50 w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={getTooltipPosition()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">
                {currentPageGuide?.pageName} • Étape {currentStepIndex + 1}/{currentPageGuide?.steps.length}
              </span>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-lg p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-semibold">{currentStep.title}</h3>
            {currentPageGuide?.roiMetric && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs">
                <Sparkles className="w-3 h-3" />
                ROI : {currentPageGuide.roiMetric}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 max-h-[400px] overflow-y-auto">
            <p className="text-gray-700 mb-4">{currentStep.content}</p>

            {currentStep.details && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Détails :</p>
                <ul className="space-y-1">
                  {currentStep.details.map((detail, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-violet-500 mt-1">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentStep.interpretation && (
              <div className="bg-violet-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-violet-900 mb-1">💡 Comment interpréter :</p>
                <p className="text-sm text-violet-700">{currentStep.interpretation}</p>
              </div>
            )}

            {currentStep.action && (
              <div className="bg-amber-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-amber-900 mb-1">⚡ Action :</p>
                <p className="text-sm text-amber-700">{currentStep.action}</p>
              </div>
            )}

            {/* Affichage à la première étape seulement : ROI détaillé, bénéfices et prérequis ATN */}
            {currentStepIndex === 0 && (
              <>
                {/* ROI Détaillé */}
                {currentPageGuide?.roiDetails && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-green-900 mb-1">💰 ROI détaillé :</p>
                    <p className="text-sm text-green-700">{currentPageGuide.roiDetails}</p>
                  </div>
                )}

                {/* Bénéfices */}
                {currentPageGuide?.benefits && currentPageGuide.benefits.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-blue-900 mb-2">✨ Bénéfices pour vous :</p>
                    <ul className="space-y-1">
                      {currentPageGuide.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prérequis ATN */}
                {currentPageGuide?.atnRequirements && currentPageGuide.atnRequirements.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-900 mb-2">🔑 Ce qu'ATN doit fournir :</p>
                    <div className="space-y-2">
                      {currentPageGuide.atnRequirements.map((req, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                            req.status === 'ok' ? 'bg-green-500' :
                            req.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          <div className="text-sm">
                            <span className="font-medium text-slate-800">{req.element}</span>
                            <span className="text-slate-500"> ({req.source})</span>
                            {req.note && (
                              <p className="text-slate-600 text-xs mt-0.5">{req.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Configuré</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> En attente</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Manquant</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer navigation */}
          <div className="border-t p-4 flex items-center justify-between bg-gray-50">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>

            <div className="flex items-center gap-1">
              {currentPageGuide?.steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStepIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentStepIndex ? 'w-6 bg-violet-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation rapide entre pages */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-lg p-3 max-h-96 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-500 mb-2">Pages du guide</p>
        {COMPLETE_GUIDE.map((page, i) => (
          <button
            key={page.route}
            onClick={() => skipToPage(page.route)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
              page.route === pathname
                ? 'bg-violet-100 text-violet-700 font-medium'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {page.route === pathname ? (
              <CheckCircle className="w-4 h-4 text-violet-600" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300" />
            )}
            {page.pageName}
          </button>
        ))}
      </div>
    </>
  )
}
