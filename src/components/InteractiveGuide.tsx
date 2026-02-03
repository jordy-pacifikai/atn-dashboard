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
        id: 'dashboard-btn-refresh',
        selector: '[data-guide="dashboard-btn-refresh"]',
        name: 'Bouton Actualiser',
        description: 'Rafraîchir toutes les données du dashboard',
        interpretation: 'Cliquez pour actualiser les KPIs et statistiques en temps réel.',
        source: 'Interface locale',
        status: 'ok',
      },
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
        id: 'conv-kpi-total',
        selector: '[data-guide="conv-kpi-total"]',
        name: 'KPI Total Conversations',
        description: 'Nombre total de conversations traitées par le chatbot',
        interpretation: 'Volume = charge du chatbot. Croissance normale: +10-20%/mois en période haute.',
        roiImpact: '40h/mois économisées',
        source: 'Table Airtable Concierge_Logs',
        status: 'ok',
      },
      {
        id: 'conv-kpi-avgtime',
        selector: '[data-guide="conv-kpi-avgtime"]',
        name: 'KPI Temps de Réponse',
        description: 'Temps moyen de réponse du chatbot',
        interpretation: 'Optimal: <1.5s. Si >3s, vérifier la latence API Claude.',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'conv-kpi-tokens',
        selector: '[data-guide="conv-kpi-tokens"]',
        name: 'KPI Tokens Utilisés',
        description: 'Consommation de tokens API ce mois',
        interpretation: 'Coût estimé: tokens × 0.003$/1K. Budget typique: 50-100$/mois.',
        source: 'API Claude usage',
        status: 'ok',
      },
      {
        id: 'conv-kpi-languages',
        selector: '[data-guide="conv-kpi-languages"]',
        name: 'KPI Langues Actives',
        description: 'Nombre de langues utilisées par les visiteurs',
        interpretation: 'FR/EN/JP = marchés principaux. Espagnol = LATAM en croissance.',
        source: 'Détection automatique',
        status: 'ok',
      },
      {
        id: 'conv-search',
        selector: '[data-guide="conv-search"]',
        name: 'Recherche Conversations',
        description: 'Barre de recherche dans les conversations',
        interpretation: 'Recherchez par mot-clé pour identifier des tendances ou problèmes récurrents.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'conv-filter-all',
        selector: '[data-guide="conv-filter-all"]',
        name: 'Filtre Toutes Langues',
        description: 'Afficher toutes les conversations sans filtre de langue',
        interpretation: 'Vue globale de toutes les interactions.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'conv-filter-fr',
        selector: '[data-guide="conv-filter-fr"]',
        name: 'Filtre Français',
        description: 'Afficher uniquement les conversations en français',
        interpretation: 'Marché Métropole + local. Environ 45% du trafic.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'conv-filter-en',
        selector: '[data-guide="conv-filter-en"]',
        name: 'Filtre Anglais',
        description: 'Afficher uniquement les conversations en anglais',
        interpretation: 'Marché US/Australie/NZ. Environ 35% du trafic.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'conv-filter-es',
        selector: '[data-guide="conv-filter-es"]',
        name: 'Filtre Espagnol',
        description: 'Afficher uniquement les conversations en espagnol',
        interpretation: 'Marché LATAM en croissance. Environ 5% du trafic.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'conv-filter-jp',
        selector: '[data-guide="conv-filter-jp"]',
        name: 'Filtre Japonais',
        description: 'Afficher uniquement les conversations en japonais',
        interpretation: 'Marché Japon stratégique. Environ 15% du trafic.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'conv-conversations-list',
        selector: '[data-guide="conv-conversations-list"]',
        name: 'Liste des Conversations',
        description: 'Tableau de toutes les conversations avec détails',
        interpretation: 'Cliquez sur une ligne pour voir l\'échange complet. Identifiez les questions sans réponse.',
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
        id: 'news-kpi-sent',
        selector: '[data-guide="news-kpi-sent"]',
        name: 'KPI Emails Envoyés',
        description: 'Nombre total d\'emails personnalisés envoyés ce mois',
        interpretation: 'Volume d\'emails. Croissance typique: +15%/mois.',
        roiImpact: '+32% vs emails génériques',
        source: 'Table Newsletter_Logs',
        status: 'ok',
      },
      {
        id: 'news-kpi-perso',
        selector: '[data-guide="news-kpi-perso"]',
        name: 'KPI Score Personnalisation',
        description: 'Niveau moyen de personnalisation des emails',
        interpretation: '>90% = excellent. Score basé sur: prénom, historique, préférences, langue.',
        source: 'Calcul IA',
        status: 'ok',
      },
      {
        id: 'news-kpi-openrate',
        selector: '[data-guide="news-kpi-openrate"]',
        name: 'KPI Taux d\'Ouverture',
        description: 'Pourcentage d\'emails ouverts par les destinataires',
        interpretation: '>30% = excellent. Benchmark secteur: 22%. ATN cible: 35%.',
        source: 'API Brevo',
        status: 'ok',
      },
      {
        id: 'news-kpi-segments',
        selector: '[data-guide="news-kpi-segments"]',
        name: 'KPI Segments Actifs',
        description: 'Nombre de segments clients distincts ciblés',
        interpretation: 'Plus de segments = meilleure personnalisation. Minimum: 4 segments.',
        source: 'Configuration',
        status: 'ok',
      },
      {
        id: 'news-filters',
        selector: '[data-guide="news-filters"]',
        name: 'Filtres par Segment',
        description: 'Filtrer les newsletters par segment client',
        interpretation: 'Lune de miel, Famille, Plongeurs, Business. Chaque segment reçoit des contenus adaptés.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'news-newsletters-list',
        selector: '[data-guide="news-newsletters-list"]',
        name: 'Liste des Newsletters',
        description: 'Historique complet des campagnes email',
        interpretation: 'Vert=ouvert, Violet=cliqué, Bleu=envoyé, Ambre=planifié.',
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
        id: 'content-kpi-published',
        selector: '[data-guide="content-kpi-published"]',
        name: 'KPI Articles Publiés',
        description: 'Nombre d\'articles publiés ce mois',
        interpretation: 'Objectif: 8 articles/mois minimum.',
        roiImpact: '+45% trafic organique',
        source: 'Table Content_Articles',
        status: 'ok',
      },
      {
        id: 'content-kpi-seo',
        selector: '[data-guide="content-kpi-seo"]',
        name: 'KPI Score SEO',
        description: 'Score SEO moyen des articles',
        interpretation: '>85 = excellent, 70-85 = bon, <70 = à améliorer.',
        source: 'Analyse IA',
        status: 'ok',
      },
      {
        id: 'content-kpi-words',
        selector: '[data-guide="content-kpi-words"]',
        name: 'KPI Mots Générés',
        description: 'Total de mots générés ce mois',
        interpretation: 'Volume de contenu. ~1500 mots/article optimal.',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'content-kpi-images',
        selector: '[data-guide="content-kpi-images"]',
        name: 'KPI Images',
        description: 'Nombre d\'images générées ou associées',
        interpretation: '2-3 images par article recommandé.',
        source: 'Table Content_Articles',
        status: 'ok',
      },
      {
        id: 'content-filters',
        selector: '[data-guide="content-filters"]',
        name: 'Filtres par Statut',
        description: 'Filtrer les articles par état de publication',
        interpretation: 'Tous, Publiés, Brouillons, Planifiés. Suivez le cycle de vie du contenu.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'content-articles-list',
        selector: '[data-guide="content-articles-list"]',
        name: 'Liste des Articles',
        description: 'Tous les articles avec leur statut',
        interpretation: 'Vert=publié, Ambre=review, Gris=brouillon.',
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
        id: 'reviews-kpi-avgrating',
        selector: '[data-guide="reviews-kpi-avgrating"]',
        name: 'KPI Note Moyenne',
        description: 'Note moyenne de tous les avis reçus',
        interpretation: 'Objectif: >4.5★. Chaque 0.1★ = +5% confiance client.',
        roiImpact: '+0.3 étoiles en moyenne',
        source: 'API Google Business Profile',
        status: 'ok',
      },
      {
        id: 'reviews-kpi-pending',
        selector: '[data-guide="reviews-kpi-pending"]',
        name: 'KPI Avis à Valider',
        description: 'Nombre d\'avis en attente de validation de réponse',
        interpretation: 'Objectif: 0. Traiter dans les 2h maximum.',
        source: 'Table Reviews',
        status: 'ok',
      },
      {
        id: 'reviews-kpi-positive',
        selector: '[data-guide="reviews-kpi-positive"]',
        name: 'KPI Avis Positifs',
        description: 'Nombre d\'avis avec note ≥4★',
        interpretation: 'Ratio positif/total: objectif >85%.',
        source: 'Table Reviews',
        status: 'ok',
      },
      {
        id: 'reviews-kpi-total',
        selector: '[data-guide="reviews-kpi-total"]',
        name: 'KPI Total Avis',
        description: 'Nombre total d\'avis reçus ce mois',
        interpretation: 'Volume d\'avis. Plus d\'avis = meilleur SEO local.',
        source: 'Table Reviews',
        status: 'ok',
      },
      {
        id: 'reviews-filters',
        selector: '[data-guide="reviews-filters"]',
        name: 'Filtres par Statut',
        description: 'Filtrer les avis par statut de validation',
        interpretation: 'À valider=prioritaire, Approuvés=prêts, Publiés=historique, Rejetés=à retravailler.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reviews-reviews-list',
        selector: '[data-guide="reviews-reviews-list"]',
        name: 'Liste des Avis',
        description: 'Tous les avis avec leurs réponses générées',
        interpretation: '5★=vert, 4★=vert clair, 3★=jaune, 2★=orange, 1★=rouge.',
        source: 'Table Reviews',
        status: 'ok',
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
        id: 'competitors-kpi-urgent',
        selector: '[data-guide="competitors-kpi-urgent"]',
        name: 'KPI Alertes Urgentes',
        description: 'Nombre d\'alertes nécessitant une action immédiate',
        interpretation: 'Urgent = concurrent moins cher de >10%. Action requise.',
        roiImpact: 'Ajustement prix proactif',
        source: 'Scraping quotidien',
        status: 'ok',
      },
      {
        id: 'competitors-kpi-cheaper',
        selector: '[data-guide="competitors-kpi-cheaper"]',
        name: 'KPI Concurrent Moins Cher',
        description: 'Nombre de routes où un concurrent est moins cher',
        interpretation: 'Objectif: <20% des routes. Analyser les écarts.',
        source: 'Comparaison tarifaire',
        status: 'ok',
      },
      {
        id: 'competitors-kpi-avgdiff',
        selector: '[data-guide="competitors-kpi-avgdiff"]',
        name: 'KPI Écart Moyen',
        description: 'Différence moyenne de prix vs concurrents',
        interpretation: 'Positif = plus cher. Négatif = moins cher. Cible: -5%.',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'competitors-kpi-monitored',
        selector: '[data-guide="competitors-kpi-monitored"]',
        name: 'KPI Routes Surveillées',
        description: 'Nombre de routes sous veille active',
        interpretation: 'Toutes les routes principales doivent être surveillées.',
        source: 'Configuration',
        status: 'ok',
      },
      {
        id: 'competitors-filters',
        selector: '[data-guide="competitors-filters"]',
        name: 'Filtres par Priorité',
        description: 'Filtrer les alertes par niveau de priorité',
        interpretation: 'Urgent=action immédiate, Haute=à surveiller, Moyenne=tendance, Basse=informatif.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'competitors-alerts-list',
        selector: '[data-guide="competitors-alerts-list"]',
        name: 'Liste des Alertes',
        description: 'Toutes les alertes concurrentielles détectées',
        interpretation: 'Rouge=urgent, Ambre=attention, Vert=compétitif.',
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
        id: 'reports-custom-section',
        selector: '[data-guide="reports-custom-section"]',
        name: 'Générateur de Rapport IA',
        description: 'Créez un rapport personnalisé à la demande avec l\'IA',
        interpretation: 'Décrivez le rapport souhaité, l\'IA le génère à partir des données de tous les workflows.',
        roiImpact: 'Rapports ad-hoc en 1 clic',
        source: 'Claude AI',
        status: 'ok',
      },
      {
        id: 'reports-filters',
        selector: '[data-guide="reports-filters"]',
        name: 'Filtres par Catégorie',
        description: 'Filtrer les templates de rapports par catégorie',
        interpretation: 'Tous, Performance, Contenu, Revenue, Opérations. Chaque catégorie regroupe des rapports spécifiques.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reports-templates-list',
        selector: '[data-guide="reports-templates-list"]',
        name: 'Liste des Templates',
        description: 'Tous les modèles de rapports disponibles',
        interpretation: 'Cliquez "Générer" pour créer un rapport. Fréquence et dernière génération affichées.',
        source: 'Table Reports',
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
        id: 'flights-kpi-affected',
        selector: '[data-guide="flights-kpi-affected"]',
        name: 'KPI Passagers Impactés',
        description: 'Nombre de passagers concernés par des perturbations',
        interpretation: 'Tous ces passagers doivent être notifiés.',
        roiImpact: '100% informés',
        source: 'Table Flight_Alerts',
        status: 'ok',
      },
      {
        id: 'flights-kpi-notified',
        selector: '[data-guide="flights-kpi-notified"]',
        name: 'KPI Passagers Notifiés',
        description: 'Pourcentage de passagers ayant reçu la notification',
        interpretation: 'Objectif: 100%. <95% = problème technique.',
        source: 'Système notifications',
        status: 'ok',
      },
      {
        id: 'flights-kpi-delayed',
        selector: '[data-guide="flights-kpi-delayed"]',
        name: 'KPI Vols Retardés',
        description: 'Nombre de vols avec retard >30min',
        interpretation: 'Monitorer les causes récurrentes.',
        source: 'Table Flight_Alerts',
        status: 'ok',
      },
      {
        id: 'flights-kpi-cancelled',
        selector: '[data-guide="flights-kpi-cancelled"]',
        name: 'KPI Vols Annulés',
        description: 'Nombre de vols annulés ce mois',
        interpretation: 'Objectif: 0. Chaque annulation = crise.',
        source: 'Table Flight_Alerts',
        status: 'ok',
      },
      {
        id: 'flights-btn-sync',
        selector: '[data-guide="flights-btn-sync"]',
        name: 'Bouton Vérifier les Vols',
        description: 'Déclenche une vérification en temps réel des vols',
        interpretation: 'Cliquez pour synchroniser avec le système de réservation et détecter les nouvelles perturbations.',
        roiImpact: 'Réactivité en temps réel',
        source: 'Workflow n8n atn-flight-notifier',
        status: 'ok',
      },
      {
        id: 'flights-filters',
        selector: '[data-guide="flights-filters"]',
        name: 'Filtres Alertes',
        description: 'Filtrer les alertes par type de perturbation',
        interpretation: 'Tous, Retards (>30min), Annulations (CRITIQUE), Changements de porte.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'flights-alerts-list',
        selector: '[data-guide="flights-alerts-list"]',
        name: 'Liste des Alertes Vols',
        description: 'Toutes les alertes avec statut notification',
        interpretation: 'Vert=notifié, Ambre=en cours, Rouge=échec.',
        source: 'Table Flight_Alerts',
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
        id: 'social-kpi-reach',
        selector: '[data-guide="social-kpi-reach"]',
        name: 'KPI Portée Totale',
        description: 'Nombre total de personnes atteintes par les mentions',
        interpretation: 'Reach = visibilité. Croissance cible: +10%/mois.',
        roiImpact: '+50% engagement',
        source: 'API Meta + Twitter',
        status: 'ok',
      },
      {
        id: 'social-kpi-sentiment',
        selector: '[data-guide="social-kpi-sentiment"]',
        name: 'KPI Sentiment Moyen',
        description: 'Score moyen de sentiment des mentions',
        interpretation: '>70% = positif, 50-70% = neutre, <50% = problème.',
        source: 'Analyse IA',
        status: 'ok',
      },
      {
        id: 'social-kpi-pending',
        selector: '[data-guide="social-kpi-pending"]',
        name: 'KPI Mentions à Traiter',
        description: 'Nombre de mentions en attente de réponse',
        interpretation: 'Objectif: 0. Répondre dans les 2h.',
        source: 'Table Social_Mentions',
        status: 'ok',
      },
      {
        id: 'social-kpi-negative',
        selector: '[data-guide="social-kpi-negative"]',
        name: 'KPI Alertes Négatives',
        description: 'Mentions négatives nécessitant attention',
        interpretation: 'PRIORITAIRE: traiter immédiatement pour éviter buzz négatif.',
        source: 'Analyse IA',
        status: 'ok',
      },
      {
        id: 'social-filters',
        selector: '[data-guide="social-filters"]',
        name: 'Filtres par Plateforme',
        description: 'Filtrer les mentions par réseau social',
        interpretation: 'Twitter/X, Instagram, Facebook, LinkedIn. Chaque plateforme a ses spécificités.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'social-mentions-list',
        selector: '[data-guide="social-mentions-list"]',
        name: 'Liste des Mentions',
        description: 'Toutes les mentions avec réponses suggérées par l\'IA',
        interpretation: 'Score sentiment coloré: vert >70%, jaune 50-70%, rouge <50%.',
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
        id: 'roi-kpi-revenue',
        selector: '[data-guide="roi-kpi-revenue"]',
        name: 'KPI Revenu Total',
        description: 'Chiffre d\'affaires total en XPF',
        interpretation: 'Revenu global. Croissance cible: +10%/an.',
        roiImpact: 'Optimisation revenus',
        source: 'Table ROI_Alerts',
        status: 'ok',
      },
      {
        id: 'roi-kpi-bookings',
        selector: '[data-guide="roi-kpi-bookings"]',
        name: 'KPI Réservations',
        description: 'Nombre total de réservations',
        interpretation: 'Volume de ventes. Comparer avec capacité.',
        source: 'Table ROI_Alerts',
        status: 'ok',
      },
      {
        id: 'roi-kpi-alerts',
        selector: '[data-guide="roi-kpi-alerts"]',
        name: 'KPI Alertes Actives',
        description: 'Nombre de routes nécessitant attention',
        interpretation: 'Objectif: <3 alertes. Critique = action immédiate.',
        source: 'Analyse IA',
        status: 'ok',
      },
      {
        id: 'roi-kpi-growth',
        selector: '[data-guide="roi-kpi-growth"]',
        name: 'KPI Routes en Croissance',
        description: 'Nombre de routes avec tendance positive',
        interpretation: 'Plus de routes en croissance = santé du réseau.',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'roi-filters',
        selector: '[data-guide="roi-filters"]',
        name: 'Filtres par Statut',
        description: 'Filtrer les routes par statut de performance',
        interpretation: 'Toutes, CRITIQUE (baisse >20%), Attention (10-20%), Croissance, Stable.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'roi-alerts-list',
        selector: '[data-guide="roi-alerts-list"]',
        name: 'Liste des Alertes ROI',
        description: 'Toutes les alertes par route avec recommandations IA',
        interpretation: 'Rouge=critique, Ambre=attention, Vert=croissance. Action suggérée par l\'IA.',
        source: 'Table ROI_Alerts',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: SETTINGS ============
  {
    route: '/settings',
    pageName: 'Paramètres',
    pageDescription: 'Configuration complète de la plateforme et des agents IA',
    globalROI: 'Personnalisation totale',
    demoScript: 'Configurez chaque aspect de vos agents IA: ton, langues, génération de contenu, et contrôlez les switches d\'activation.',
    elements: [
      {
        id: 'settings-content-gen',
        selector: '[data-guide="settings-content-gen"]',
        name: 'Génération de contenu',
        description: 'Paramètres de génération automatique de contenu',
        interpretation: 'Contrôlez la fréquence et le type de contenu généré par l\'IA.',
        source: 'Configuration locale',
        status: 'ok',
      },
      {
        id: 'settings-api-keys',
        selector: '[data-guide="settings-api-keys"]',
        name: 'Clés API',
        description: 'Configuration des clés API des services externes',
        interpretation: 'Gérez vos clés API Claude, Brevo, et autres services connectés.',
        source: 'Configuration locale',
        status: 'warning',
        atnAction: 'Fournir les clés API production',
      },
      {
        id: 'settings-webhooks',
        selector: '[data-guide="settings-webhooks"]',
        name: 'Webhooks',
        description: 'URLs des webhooks n8n pour les intégrations',
        interpretation: 'Copiez ces URLs pour connecter vos systèmes externes.',
        source: 'Configuration n8n',
        status: 'ok',
      },
      {
        id: 'settings-notifications',
        selector: '[data-guide="settings-notifications"]',
        name: 'Notifications',
        description: 'Paramètres des alertes et notifications',
        interpretation: 'Configurez qui reçoit quelles alertes et par quel canal.',
        source: 'Configuration locale',
        status: 'ok',
      },
      {
        id: 'settings-language',
        selector: '[data-guide="settings-language"]',
        name: 'Langue Interface',
        description: 'Langue de l\'interface du dashboard',
        interpretation: 'Choisissez FR ou EN pour l\'interface admin.',
        source: 'Configuration locale',
        status: 'ok',
      },
      {
        id: 'settings-btn-save',
        selector: '[data-guide="settings-btn-save"]',
        name: 'Bouton Sauvegarder',
        description: 'Enregistrer toutes les modifications',
        interpretation: 'N\'oubliez pas de sauvegarder après vos modifications.',
        source: 'Interface locale',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: ATTRIBUTION ============
  {
    route: '/attribution',
    pageName: 'Attribution Multi-Touch',
    pageDescription: 'Analyse du parcours client et attribution des conversions',
    globalROI: 'Optimisation budget marketing',
    demoScript: 'Visualisez les parcours clients complets: quels canaux contribuent aux conversions et dans quel ordre.',
    elements: [
      {
        id: 'attribution-btn-refresh',
        selector: '[data-guide="attribution-btn-refresh"]',
        name: 'Bouton Actualiser',
        description: 'Rafraîchir les données d\'attribution',
        interpretation: 'Cliquez pour recalculer les attributions.',
        source: 'Workflow n8n',
        status: 'ok',
      },
      {
        id: 'attribution-kpi-channels',
        selector: '[data-guide="attribution-kpi-channels"]',
        name: 'KPI Canaux',
        description: 'Nombre de canaux marketing actifs',
        interpretation: 'Plus de canaux = meilleure couverture client.',
        roiImpact: 'Meilleure allocation budget',
        source: 'Table Attribution_Journeys',
        status: 'ok',
      },
      {
        id: 'attribution-kpi-conversions',
        selector: '[data-guide="attribution-kpi-conversions"]',
        name: 'KPI Conversions',
        description: 'Nombre total de conversions attribuées',
        interpretation: 'Volume de conversions avec attribution multi-touch.',
        source: 'Table Attribution_Journeys',
        status: 'ok',
      },
      {
        id: 'attribution-kpi-revenue',
        selector: '[data-guide="attribution-kpi-revenue"]',
        name: 'KPI Revenu Attribué',
        description: 'Valeur totale des conversions attribuées',
        interpretation: 'Revenu réparti entre les canaux selon le modèle.',
        source: 'Table Attribution_Journeys',
        status: 'ok',
      },
      {
        id: 'attribution-kpi-touchpoints',
        selector: '[data-guide="attribution-kpi-touchpoints"]',
        name: 'KPI Touchpoints',
        description: 'Nombre moyen de touchpoints par conversion',
        interpretation: 'Combien de contacts avant conversion.',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'attribution-models-section',
        selector: '[data-guide="attribution-models-section"]',
        name: 'Section Modèles',
        description: 'Sélection du modèle d\'attribution',
        interpretation: 'First Touch, Last Touch, Linear, Time Decay, Position Based.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'attribution-model-firsttouch',
        selector: '[data-guide="attribution-model-firsttouch"]',
        name: 'Modèle First Touch',
        description: '100% du crédit au premier point de contact',
        interpretation: 'Idéal pour mesurer l\'acquisition: quel canal découvre le client?',
        source: 'Modèle d\'attribution',
        status: 'ok',
      },
      {
        id: 'attribution-model-lasttouch',
        selector: '[data-guide="attribution-model-lasttouch"]',
        name: 'Modèle Last Touch',
        description: '100% du crédit au dernier point de contact',
        interpretation: 'Idéal pour mesurer la conversion finale: quel canal déclenche l\'achat?',
        source: 'Modèle d\'attribution',
        status: 'ok',
      },
      {
        id: 'attribution-model-linear',
        selector: '[data-guide="attribution-model-linear"]',
        name: 'Modèle Linéaire',
        description: 'Crédit réparti équitablement entre tous les touchpoints',
        interpretation: 'Vue équilibrée: chaque interaction compte autant.',
        source: 'Modèle d\'attribution',
        status: 'ok',
      },
      {
        id: 'attribution-model-timedecay',
        selector: '[data-guide="attribution-model-timedecay"]',
        name: 'Modèle Time Decay',
        description: 'Plus de crédit aux touchpoints récents',
        interpretation: 'Favorise les interactions proches de la conversion.',
        source: 'Modèle d\'attribution',
        status: 'ok',
      },
      {
        id: 'attribution-model-positionbased',
        selector: '[data-guide="attribution-model-positionbased"]',
        name: 'Modèle Position Based',
        description: '40% premier, 40% dernier, 20% partagé entre',
        interpretation: 'Valorise acquisition et conversion, moins le nurturing.',
        source: 'Modèle d\'attribution',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: STAFF ASSISTANT ============
  {
    route: '/staff-assistant',
    pageName: 'Staff Assistant TALIA',
    pageDescription: 'Assistant IA interne pour les employés ATN',
    globalROI: '-30% temps recherche interne',
    demoScript: 'TALIA répond aux questions des employés sur les procédures, politiques RH, et documents internes.',
    elements: [
      {
        id: 'staff-kpi-total',
        selector: '[data-guide="staff-kpi-total"]',
        name: 'KPI Questions Traitées',
        description: 'Nombre total de questions posées à TALIA',
        interpretation: 'Volume d\'utilisation. Plus = meilleure adoption.',
        roiImpact: '-30% temps recherche',
        source: 'Table Staff_Requests',
        status: 'ok',
      },
      {
        id: 'staff-kpi-helpful',
        selector: '[data-guide="staff-kpi-helpful"]',
        name: 'KPI Réponses Utiles',
        description: 'Réponses marquées comme utiles par les employés',
        interpretation: 'Taux satisfaction. Objectif: >85%.',
        source: 'Table Staff_Requests',
        status: 'ok',
      },
      {
        id: 'staff-kpi-procedures',
        selector: '[data-guide="staff-kpi-procedures"]',
        name: 'KPI Procédures Consultées',
        description: 'Documents de procédures accédés via TALIA',
        interpretation: 'Utilisation de la base documentaire.',
        source: 'Table Staff_Requests',
        status: 'ok',
      },
      {
        id: 'staff-kpi-responsetime',
        selector: '[data-guide="staff-kpi-responsetime"]',
        name: 'KPI Temps de Réponse',
        description: 'Temps moyen de réponse de TALIA',
        interpretation: 'Objectif: < 5 secondes.',
        source: 'Métrique système',
        status: 'ok',
      },
      {
        id: 'staff-question-section',
        selector: '[data-guide="staff-question-section"]',
        name: 'Section Question',
        description: 'Interface pour poser une question à TALIA',
        interpretation: 'Saisissez votre question, utilisez les raccourcis thématiques, puis cliquez Demander.',
        source: 'API Claude',
        status: 'ok',
      },
      {
        id: 'staff-filters',
        selector: '[data-guide="staff-filters"]',
        name: 'Filtres et Recherche',
        description: 'Filtrer l\'historique par catégorie ou mot-clé',
        interpretation: 'Procédures, RH, Technique, Opérations + recherche textuelle.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'staff-history-list',
        selector: '[data-guide="staff-history-list"]',
        name: 'Historique Questions',
        description: 'Liste des questions/réponses passées',
        interpretation: 'Consultez les interactions précédentes des employés.',
        source: 'Table Staff_Requests',
        status: 'ok',
      },
      {
        id: 'staff-knowledge-section',
        selector: '[data-guide="staff-knowledge-section"]',
        name: 'Base de connaissances',
        description: 'Accès direct à la documentation ATN',
        interpretation: 'Manuel des procédures, FAQ RH, Documentation technique, Réglementations.',
        source: 'Base documentaire ATN',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: JOURNEYS ============
  {
    route: '/journeys',
    pageName: 'Customer Journeys',
    pageDescription: 'Parcours personnalisés pré/post voyage automatisés',
    globalROI: '+25% engagement client',
    demoScript: 'Chaque passager reçoit une séquence de communications personnalisées avant et après son voyage.',
    elements: [
      {
        id: 'journeys-btn-sync',
        selector: '[data-guide="journeys-btn-sync"]',
        name: 'Bouton Synchroniser',
        description: 'Rafraîchir les parcours clients',
        interpretation: 'Cliquez pour mettre à jour les statuts des journeys.',
        source: 'Workflow n8n',
        status: 'ok',
      },
      {
        id: 'journeys-btn-new',
        selector: '[data-guide="journeys-btn-new"]',
        name: 'Bouton Nouveau Journey',
        description: 'Créer un nouveau parcours client',
        interpretation: 'Ouvre l\'éditeur pour configurer les étapes du parcours.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'journeys-kpi-active',
        selector: '[data-guide="journeys-kpi-active"]',
        name: 'KPI Journeys Actifs',
        description: 'Nombre de parcours actuellement actifs',
        interpretation: 'Parcours en production qui envoient des communications.',
        roiImpact: '+25% engagement',
        source: 'Table Customer_Journeys',
        status: 'ok',
      },
      {
        id: 'journeys-kpi-inprogress',
        selector: '[data-guide="journeys-kpi-inprogress"]',
        name: 'KPI En Cours',
        description: 'Clients actuellement dans un parcours',
        interpretation: 'Volume de clients recevant des communications automatisées.',
        source: 'Table Customer_Journeys',
        status: 'ok',
      },
      {
        id: 'journeys-kpi-completed',
        selector: '[data-guide="journeys-kpi-completed"]',
        name: 'KPI Complétés',
        description: 'Parcours terminés avec succès',
        interpretation: 'Clients ayant reçu toute la séquence.',
        source: 'Table Customer_Journeys',
        status: 'ok',
      },
      {
        id: 'journeys-kpi-conversion',
        selector: '[data-guide="journeys-kpi-conversion"]',
        name: 'KPI Conversion',
        description: 'Taux de conversion moyen des parcours',
        interpretation: 'Pourcentage de clients convertis par les journeys.',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'journeys-journeys-list',
        selector: '[data-guide="journeys-journeys-list"]',
        name: 'Liste des Parcours',
        description: 'Tous les parcours avec leurs statistiques',
        interpretation: 'Cliquez pour voir les étapes et les stats détaillées.',
        source: 'Table Customer_Journeys',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: PREFERENCES ============
  {
    route: '/preferences',
    pageName: 'Préférences Clients',
    pageDescription: 'Centre de préférences et conformité RGPD',
    globalROI: '100% conformité RGPD',
    demoScript: 'Gérez les préférences de communication de chaque client et assurez la conformité RGPD.',
    elements: [
      {
        id: 'preferences-btn-sync',
        selector: '[data-guide="preferences-btn-sync"]',
        name: 'Bouton Synchroniser',
        description: 'Rafraîchir les préférences clients',
        interpretation: 'Cliquez pour synchroniser avec le CRM.',
        source: 'Workflow n8n',
        status: 'ok',
      },
      {
        id: 'preferences-btn-export',
        selector: '[data-guide="preferences-btn-export"]',
        name: 'Bouton Exporter',
        description: 'Exporter les données RGPD',
        interpretation: 'Export CSV pour audit de conformité.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'preferences-kpi-total',
        selector: '[data-guide="preferences-kpi-total"]',
        name: 'KPI Total Clients',
        description: 'Nombre total de clients avec préférences',
        interpretation: 'Volume de clients dans le système.',
        roiImpact: 'Meilleur ciblage',
        source: 'Table Customer_Preferences',
        status: 'ok',
      },
      {
        id: 'preferences-kpi-full',
        selector: '[data-guide="preferences-kpi-full"]',
        name: 'KPI Opt-in Complet',
        description: 'Clients avec tous les canaux activés',
        interpretation: 'Maximum d\'opportunités de contact.',
        source: 'Table Customer_Preferences',
        status: 'ok',
      },
      {
        id: 'preferences-kpi-partial',
        selector: '[data-guide="preferences-kpi-partial"]',
        name: 'KPI Opt-in Partiel',
        description: 'Clients avec certains canaux activés',
        interpretation: 'Ciblage limité à certains canaux.',
        source: 'Table Customer_Preferences',
        status: 'ok',
      },
      {
        id: 'preferences-kpi-optout',
        selector: '[data-guide="preferences-kpi-optout"]',
        name: 'KPI Opt-out',
        description: 'Clients ayant refusé les communications',
        interpretation: 'À ne pas contacter (conformité RGPD).',
        source: 'Table Customer_Preferences',
        status: 'ok',
      },
      {
        id: 'preferences-rgpd-box',
        selector: '[data-guide="preferences-rgpd-box"]',
        name: 'Statut RGPD',
        description: 'Indicateur de conformité RGPD',
        interpretation: 'Vert=conforme, Ambre=action requise.',
        source: 'Audit automatique',
        status: 'ok',
      },
      {
        id: 'preferences-search',
        selector: '[data-guide="preferences-search"]',
        name: 'Recherche Client',
        description: 'Rechercher un client par nom ou email',
        interpretation: 'Trouvez rapidement un client spécifique.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'preferences-customers-list',
        selector: '[data-guide="preferences-customers-list"]',
        name: 'Liste des Clients',
        description: 'Tous les clients avec leurs préférences',
        interpretation: 'Cliquez pour voir/modifier les préférences.',
        source: 'Table Customer_Preferences',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: VISUAL FACTORY ============
  {
    route: '/visual-factory',
    pageName: 'Smart Visual Factory',
    pageDescription: 'Génération automatique d\'assets visuels marketing avec Fal.ai',
    globalROI: '-70% temps production',
    demoScript: 'Générez des visuels marketing en quelques clics: bannières web, posts sociaux, stories, headers email.',
    elements: [
      {
        id: 'visual-kpi-total',
        selector: '[data-guide="visual-kpi-total"]',
        name: 'KPI Total générés',
        description: 'Nombre total d\'assets générés',
        interpretation: 'Volume de production. Plus = plus de contenu disponible.',
        roiImpact: '-70% temps production',
        source: 'Table Visual_Assets',
        status: 'ok',
      },
      {
        id: 'visual-kpi-ready',
        selector: '[data-guide="visual-kpi-ready"]',
        name: 'KPI Prêts',
        description: 'Assets prêts à utiliser',
        interpretation: 'Disponibles pour publication immédiate.',
        source: 'Table Visual_Assets',
        status: 'ok',
      },
      {
        id: 'visual-kpi-approved',
        selector: '[data-guide="visual-kpi-approved"]',
        name: 'KPI Approuvés',
        description: 'Assets validés par l\'équipe',
        interpretation: 'Passés par le workflow de validation.',
        source: 'Table Visual_Assets',
        status: 'ok',
      },
      {
        id: 'visual-kpi-generating',
        selector: '[data-guide="visual-kpi-generating"]',
        name: 'KPI En cours',
        description: 'Assets en cours de génération',
        interpretation: 'Génération Fal.ai en cours (~30s par image).',
        source: 'API Fal.ai',
        status: 'ok',
      },
      {
        id: 'visual-generator-section',
        selector: '[data-guide="visual-generator-section"]',
        name: 'Section Générateur',
        description: 'Interface de création de nouveaux visuels',
        interpretation: 'Sélectionnez type, décrivez, générez.',
        source: 'API Fal.ai + Claude',
        status: 'ok',
      },
      {
        id: 'visual-type-selector',
        selector: '[data-guide="visual-type-selector"]',
        name: 'Sélecteur de Format',
        description: 'Choisir le format du visuel',
        interpretation: 'Bannière web, Post social, Story/Reel, Header email.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'visual-prompt-input',
        selector: '[data-guide="visual-prompt-input"]',
        name: 'Champ Description',
        description: 'Décrivez le visuel souhaité',
        interpretation: 'Soyez précis: sujet, ambiance, couleurs.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'visual-btn-generate',
        selector: '[data-guide="visual-btn-generate"]',
        name: 'Bouton Générer',
        description: 'Lancer la génération IA',
        interpretation: 'Envoie le prompt à Fal.ai pour génération.',
        source: 'API Fal.ai',
        status: 'ok',
      },
      {
        id: 'visual-btn-brandcolors',
        selector: '[data-guide="visual-btn-brandcolors"]',
        name: 'Option Brand Colors',
        description: 'Appliquer les couleurs de la marque ATN',
        interpretation: 'Bleu #00A9CE et Rouge #E31837.',
        source: 'Configuration',
        status: 'ok',
      },
      {
        id: 'visual-btn-addtext',
        selector: '[data-guide="visual-btn-addtext"]',
        name: 'Option Ajouter Texte',
        description: 'Ajouter du texte sur le visuel',
        interpretation: 'Titres, CTAs, slogans.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'visual-gallery-section',
        selector: '[data-guide="visual-gallery-section"]',
        name: 'Galerie Assets',
        description: 'Tous les visuels générés récemment',
        interpretation: 'Cliquez pour voir en grand, télécharger ou modifier.',
        source: 'Table Visual_Assets',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: CALENDAR ============
  {
    route: '/calendar',
    pageName: 'Calendrier Éditorial',
    pageDescription: 'Planification du contenu marketing automatisé',
    globalROI: 'Contenu planifié 30j',
    demoScript: 'Visualisez et gérez tout votre contenu planifié: articles, newsletters, posts sociaux. Glissez-déposez pour réorganiser.',
    elements: [
      {
        id: 'calendar-btn-new',
        selector: '[data-guide="calendar-btn-new"]',
        name: 'Bouton Nouveau Contenu',
        description: 'Créer un nouveau contenu (newsletter ou article)',
        interpretation: 'Ouvre l\'éditeur pour planifier un nouveau contenu.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'calendar-grid',
        selector: '[data-guide="calendar-grid"]',
        name: 'Grille Calendrier',
        description: 'Vue calendrier mensuel du contenu',
        interpretation: 'Rose=newsletter, Violet=article. Glissez-déposez pour changer la date.',
        source: 'Table Content_Calendar',
        status: 'ok',
      },
      {
        id: 'calendar-kpi-newsletters',
        selector: '[data-guide="calendar-kpi-newsletters"]',
        name: 'KPI Newsletters',
        description: 'Nombre de newsletters planifiées ce mois',
        interpretation: 'Objectif: 4-8 newsletters/mois.',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'calendar-kpi-articles',
        selector: '[data-guide="calendar-kpi-articles"]',
        name: 'KPI Articles',
        description: 'Nombre d\'articles SEO planifiés ce mois',
        interpretation: 'Objectif: 8 articles/mois minimum.',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'calendar-kpi-scheduled',
        selector: '[data-guide="calendar-kpi-scheduled"]',
        name: 'KPI Programmés',
        description: 'Contenus en attente de publication',
        interpretation: 'Total prêts à être publiés automatiquement.',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'calendar-kpi-drafts',
        selector: '[data-guide="calendar-kpi-drafts"]',
        name: 'KPI Brouillons',
        description: 'Contenus en cours de rédaction',
        interpretation: 'À finaliser avant publication.',
        source: 'Calcul automatique',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: BOOKINGS ============
  {
    route: '/bookings',
    pageName: 'Booking Assistant',
    pageDescription: 'Assistant de réservation intelligent',
    globalROI: '+15% conversion booking',
    demoScript: 'L\'assistant guide les clients dans leur réservation et suggère des options personnalisées.',
    elements: [
      {
        id: 'bookings-btn-sync',
        selector: '[data-guide="bookings-btn-sync"]',
        name: 'Bouton Synchroniser',
        description: 'Rafraîchir les demandes de réservation',
        interpretation: 'Cliquez pour synchroniser avec le système de réservation.',
        source: 'API Booking',
        status: 'ok',
      },
      {
        id: 'bookings-kpi-requests',
        selector: '[data-guide="bookings-kpi-requests"]',
        name: 'KPI Demandes',
        description: 'Nombre total de demandes traitées',
        interpretation: 'Volume de demandes assistées par l\'IA.',
        roiImpact: '+15% conversion',
        source: 'Table Booking_Requests',
        status: 'ok',
      },
      {
        id: 'bookings-kpi-completed',
        selector: '[data-guide="bookings-kpi-completed"]',
        name: 'KPI Complétées',
        description: 'Demandes traitées avec succès',
        interpretation: 'Vert=bon taux de complétion.',
        source: 'Table Booking_Requests',
        status: 'ok',
      },
      {
        id: 'bookings-kpi-reservations',
        selector: '[data-guide="bookings-kpi-reservations"]',
        name: 'KPI Réservations',
        description: 'Réservations effectuées via l\'assistant',
        interpretation: 'Conversions réelles en réservations.',
        source: 'Table Booking_Requests',
        status: 'ok',
      },
      {
        id: 'bookings-kpi-passengers',
        selector: '[data-guide="bookings-kpi-passengers"]',
        name: 'KPI Passagers',
        description: 'Nombre total de passagers',
        interpretation: 'Volume de passagers assistés.',
        source: 'Table Booking_Requests',
        status: 'ok',
      },
      {
        id: 'bookings-filters',
        selector: '[data-guide="bookings-filters"]',
        name: 'Filtres par Type',
        description: 'Filtrer par type de demande',
        interpretation: 'Tous, Réservation, Modification, Annulation, Information.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'bookings-requests-list',
        selector: '[data-guide="bookings-requests-list"]',
        name: 'Liste des Demandes',
        description: 'Historique des demandes de réservation',
        interpretation: 'Cliquez pour voir le détail de la conversation.',
        source: 'Table Booking_Requests',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: PLANNER ============
  {
    route: '/planner',
    pageName: 'Content Planner',
    pageDescription: 'Planification et génération de contenu marketing',
    globalROI: '8 articles/mois auto',
    demoScript: 'Planifiez votre contenu marketing et laissez l\'IA générer les articles optimisés SEO.',
    elements: [
      {
        id: 'planner-btn-calendar',
        selector: '[data-guide="planner-btn-calendar"]',
        name: 'Bouton Calendrier',
        description: 'Accéder au calendrier de publication',
        interpretation: 'Visualisez le planning sur un calendrier mensuel.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'planner-kpi-week',
        selector: '[data-guide="planner-kpi-week"]',
        name: 'KPI Cette Semaine',
        description: 'Nombre de contenus planifiés cette semaine',
        interpretation: 'Objectif: 2+ contenus/semaine pour maintenir le rythme SEO.',
        roiImpact: '8 articles/mois auto',
        source: 'Table Content_Planner',
        status: 'ok',
      },
      {
        id: 'planner-kpi-booked',
        selector: '[data-guide="planner-kpi-booked"]',
        name: 'KPI Programmés',
        description: 'Contenus programmés en attente de publication',
        interpretation: 'Stock de contenu prêt à être publié automatiquement.',
        source: 'Table Content_Planner',
        status: 'ok',
      },
      {
        id: 'planner-kpi-confirmed',
        selector: '[data-guide="planner-kpi-confirmed"]',
        name: 'KPI Confirmés',
        description: 'Contenus validés par l\'équipe',
        interpretation: 'Contenus approuvés et prêts pour publication.',
        source: 'Table Content_Planner',
        status: 'ok',
      },
      {
        id: 'planner-kpi-value',
        selector: '[data-guide="planner-kpi-value"]',
        name: 'KPI Valeur SEO',
        description: 'Valeur SEO estimée du contenu planifié',
        interpretation: 'Impact potentiel sur le trafic organique.',
        roiImpact: '+45% trafic organique',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'planner-filters',
        selector: '[data-guide="planner-filters"]',
        name: 'Filtres',
        description: 'Filtrer par statut ou type de contenu',
        interpretation: 'Brouillon, en review, publié.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'planner-items-list',
        selector: '[data-guide="planner-items-list"]',
        name: 'Liste Contenus',
        description: 'Tous les contenus avec leur statut et dates',
        interpretation: 'Cliquez pour éditer ou voir le contenu généré.',
        source: 'Table Content_Planner',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: A/B TESTS ============
  {
    route: '/ab-tests',
    pageName: 'A/B Test Engine',
    pageDescription: 'Tests A/B avec analyse statistique automatique',
    globalROI: '+14.6% lift moyen',
    demoScript: 'Testez différentes variantes d\'emails, CTAs, prix et laissez l\'IA déterminer le gagnant statistiquement.',
    elements: [
      {
        id: 'abtests-btn-refresh',
        selector: '[data-guide="abtests-btn-refresh"]',
        name: 'Bouton Actualiser',
        description: 'Rafraîchir les résultats des tests',
        interpretation: 'Cliquez pour recalculer les statistiques.',
        source: 'Workflow n8n',
        status: 'ok',
      },
      {
        id: 'abtests-btn-new',
        selector: '[data-guide="abtests-btn-new"]',
        name: 'Bouton Nouveau Test',
        description: 'Créer un nouveau test A/B',
        interpretation: 'Ouvre l\'assistant de création de test.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'abtests-kpi-running',
        selector: '[data-guide="abtests-kpi-running"]',
        name: 'KPI Tests en Cours',
        description: 'Nombre de tests actuellement actifs',
        interpretation: 'Tests collectant des données.',
        roiImpact: '+14.6% lift moyen',
        source: 'Table AB_Tests',
        status: 'ok',
      },
      {
        id: 'abtests-kpi-completed',
        selector: '[data-guide="abtests-kpi-completed"]',
        name: 'KPI Tests Terminés',
        description: 'Tests avec résultat statistiquement significatif',
        interpretation: 'Gagnant identifié avec confiance 95%.',
        source: 'Table AB_Tests',
        status: 'ok',
      },
      {
        id: 'abtests-kpi-lift',
        selector: '[data-guide="abtests-kpi-lift"]',
        name: 'KPI Lift Moyen',
        description: 'Amélioration moyenne des variantes gagnantes',
        interpretation: 'Plus le lift est élevé, plus les tests sont efficaces.',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'abtests-kpi-revenue',
        selector: '[data-guide="abtests-kpi-revenue"]',
        name: 'KPI Revenu Testé',
        description: 'Volume de revenu impacté par les tests',
        interpretation: 'Montant exposé aux tests A/B.',
        source: 'Table AB_Tests',
        status: 'ok',
      },
      {
        id: 'abtests-methodology-box',
        selector: '[data-guide="abtests-methodology-box"]',
        name: 'Méthodologie',
        description: 'Explication de la méthode statistique',
        interpretation: 'Niveau de confiance 95%, correction Bonferroni.',
        source: 'Documentation',
        status: 'ok',
      },
      {
        id: 'abtests-tests-list',
        selector: '[data-guide="abtests-tests-list"]',
        name: 'Liste des Tests',
        description: 'Tous les tests avec variantes et résultats',
        interpretation: 'Vert=gagnant, Bleu=en cours, Gris=brouillon.',
        source: 'Table AB_Tests',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: UPSELL ============
  {
    route: '/upsell',
    pageName: 'Upsell Engine',
    pageDescription: 'Offres personnalisées intelligentes basées sur le profil client',
    globalROI: '+180k XPF/mois revenus additionnels',
    demoScript: 'L\'IA génère des offres ultra-personnalisées selon le segment client: upgrade classe, excursions, bagages.',
    elements: [
      {
        id: 'upsell-btn-generate',
        selector: '[data-guide="upsell-btn-generate"]',
        name: 'Bouton Générer',
        description: 'Générer de nouvelles offres personnalisées',
        interpretation: 'Lance l\'IA pour créer des offres basées sur les profils clients.',
        roiImpact: '+180k XPF/mois',
        source: 'Workflow n8n',
        status: 'ok',
      },
      {
        id: 'upsell-kpi-offers',
        selector: '[data-guide="upsell-kpi-offers"]',
        name: 'KPI Offres Envoyées',
        description: 'Nombre d\'offres personnalisées envoyées',
        interpretation: 'Volume d\'offres en circulation.',
        source: 'Table Upsell_Offers',
        status: 'ok',
      },
      {
        id: 'upsell-kpi-conversion',
        selector: '[data-guide="upsell-kpi-conversion"]',
        name: 'KPI Taux Conversion',
        description: 'Pourcentage d\'offres converties',
        interpretation: 'Efficacité des offres. Objectif >15%.',
        source: 'Table Upsell_Offers',
        status: 'ok',
      },
      {
        id: 'upsell-kpi-revenue',
        selector: '[data-guide="upsell-kpi-revenue"]',
        name: 'KPI Revenu Généré',
        description: 'Revenus additionnels via upsell',
        interpretation: 'Impact direct sur le CA.',
        source: 'Table Upsell_Offers',
        status: 'ok',
      },
      {
        id: 'upsell-kpi-score',
        selector: '[data-guide="upsell-kpi-score"]',
        name: 'KPI Score Perso',
        description: 'Score moyen de personnalisation',
        interpretation: 'Plus le score est élevé, plus l\'offre est pertinente.',
        source: 'Calcul IA',
        status: 'ok',
      },
      {
        id: 'upsell-filters',
        selector: '[data-guide="upsell-filters"]',
        name: 'Filtres Statut',
        description: 'Filtrer par statut de l\'offre',
        interpretation: 'Tous, Envoyé, Ouvert, Cliqué, Converti.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'upsell-list',
        selector: '[data-guide="upsell-list"]',
        name: 'Liste des Offres',
        description: 'Toutes les offres avec détails et performance',
        interpretation: 'Vert=converti, Orange=cliqué, Bleu=envoyé.',
        source: 'Table Upsell_Offers',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: LEAD SCORING ============
  {
    route: '/lead-scoring',
    pageName: 'Lead Scoring Engine',
    pageDescription: 'Scoring comportemental des prospects pour priorisation',
    globalROI: '+35% conversion leads chauds',
    demoScript: 'Chaque prospect reçoit un score basé sur ses actions: pages vues, clics emails, recherches.',
    elements: [
      {
        id: 'leadscoring-btn-recalculate',
        selector: '[data-guide="leadscoring-btn-recalculate"]',
        name: 'Bouton Recalculer',
        description: 'Déclenche le recalcul des scores de tous les leads',
        interpretation: 'Cliquez pour mettre à jour les scores en fonction des dernières activités.',
        roiImpact: 'Scores à jour',
        source: 'Workflow n8n atn-lead-scoring',
        status: 'ok',
      },
      {
        id: 'leadscoring-kpi-total',
        selector: '[data-guide="leadscoring-kpi-total"]',
        name: 'KPI Total Leads',
        description: 'Nombre total de leads dans le système',
        interpretation: 'Volume de prospects à traiter.',
        source: 'Table Lead_Scores',
        status: 'ok',
      },
      {
        id: 'leadscoring-kpi-hot',
        selector: '[data-guide="leadscoring-kpi-hot"]',
        name: 'KPI Hot Leads',
        description: 'Leads avec grade A (score >80)',
        interpretation: 'PRIORITAIRES: prêts à convertir, contacter rapidement.',
        roiImpact: '+35% conversion',
        source: 'Table Lead_Scores',
        status: 'ok',
      },
      {
        id: 'leadscoring-kpi-score',
        selector: '[data-guide="leadscoring-kpi-score"]',
        name: 'KPI Score Moyen',
        description: 'Score moyen de tous les leads',
        interpretation: 'Indicateur de qualité du pipeline. >50 = bon.',
        source: 'Table Lead_Scores',
        status: 'ok',
      },
      {
        id: 'leadscoring-kpi-pipeline',
        selector: '[data-guide="leadscoring-kpi-pipeline"]',
        name: 'KPI Valeur Pipeline',
        description: 'Valeur totale prédite du pipeline',
        interpretation: 'Somme des valeurs prédites de tous les leads.',
        source: 'Table Lead_Scores',
        status: 'ok',
      },
      {
        id: 'leadscoring-rules-section',
        selector: '[data-guide="leadscoring-rules-section"]',
        name: 'Section Règles de Scoring',
        description: 'Affiche les règles de calcul des scores',
        interpretation: 'Booking start=25pts, Email click=15pts, Page view=10pts, Search=8pts, Email open=5pts, Download=10pts.',
        source: 'Configuration',
        status: 'ok',
      },
      {
        id: 'leadscoring-rules-grid',
        selector: '[data-guide="leadscoring-rules-grid"]',
        name: 'Grille des Points',
        description: 'Points attribués par type d\'action',
        interpretation: 'Chaque action augmente le score du lead.',
        source: 'Configuration',
        status: 'ok',
      },
      {
        id: 'leadscoring-filters',
        selector: '[data-guide="leadscoring-filters"]',
        name: 'Filtres Grade',
        description: 'Filtrer les leads par grade A/B/C/D',
        interpretation: 'A=Hot (prêt à convertir), B=Warm, C=Cold, D=Inactive (à réengager ou supprimer).',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'leadscoring-leads-list',
        selector: '[data-guide="leadscoring-leads-list"]',
        name: 'Liste des Leads',
        description: 'Tous les leads avec score et historique d\'actions',
        interpretation: 'Cliquez sur "Voir historique" pour les actions détaillées. Score visuel: vert >70, bleu >40, ambre >20, rouge <20.',
        source: 'Table Lead_Scores',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: REVIEW INTELLIGENCE ============
  {
    route: '/review-intelligence',
    pageName: 'Review Intelligence FOX',
    pageDescription: 'Analyse avancée des avis avec détection d\'ironie et sentiment',
    globalROI: '+0.5 étoiles en 6 mois',
    demoScript: 'L\'IA analyse chaque avis en profondeur: sentiment réel, ironie, thèmes, et génère des réponses adaptées.',
    elements: [
      {
        id: 'reviews-btn-analyze',
        selector: '[data-guide="reviews-btn-analyze"]',
        name: 'Bouton Analyser',
        description: 'Lancer l\'analyse IA des nouveaux avis',
        interpretation: 'Déclenche le workflow n8n d\'analyse sentiment + ironie.',
        roiImpact: '+0.5 étoiles',
        source: 'Workflow atn-review-intelligence',
        status: 'ok',
      },
      {
        id: 'reviews-kpi-positive',
        selector: '[data-guide="reviews-kpi-positive"]',
        name: 'KPI Avis Positifs',
        description: 'Nombre d\'avis avec sentiment positif',
        interpretation: 'Score > 0.5. Objectif: >70% du total.',
        source: 'Table Reviews',
        status: 'ok',
      },
      {
        id: 'reviews-kpi-negative',
        selector: '[data-guide="reviews-kpi-negative"]',
        name: 'KPI Avis Négatifs',
        description: 'Nombre d\'avis avec sentiment négatif',
        interpretation: 'Score < -0.5. Chaque avis négatif doit recevoir une réponse.',
        source: 'Table Reviews',
        status: 'ok',
      },
      {
        id: 'reviews-kpi-irony',
        selector: '[data-guide="reviews-kpi-irony"]',
        name: 'KPI Ironie Détectée',
        description: 'Nombre d\'avis avec ironie/sarcasme détecté',
        interpretation: 'ATTENTION: ne pas répondre au premier degré !',
        source: 'Analyse IA',
        status: 'ok',
      },
      {
        id: 'reviews-kpi-action',
        selector: '[data-guide="reviews-kpi-action"]',
        name: 'KPI Action Requise',
        description: 'Avis nécessitant une intervention humaine',
        interpretation: 'Prioritaires: ironie, très négatifs, ou sujets sensibles.',
        source: 'Analyse IA',
        status: 'ok',
      },
      {
        id: 'intel-filters',
        selector: '[data-guide="intel-filters"]',
        name: 'Filtres Analyse',
        description: 'Filtrer par type: tous, ironie, ou action requise',
        interpretation: 'Ironie=priorité haute, Action=à traiter manuellement.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reviews-analyses-list',
        selector: '[data-guide="reviews-analyses-list"]',
        name: 'Liste des Analyses',
        description: 'Tous les avis avec leur analyse détaillée',
        interpretation: 'Badge ironie si détectée, score sentiment, émotions.',
        source: 'Table Reviews',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: CONCIERGE PRO ============
  {
    route: '/concierge-pro',
    pageName: 'Concierge Pro',
    pageDescription: 'Concierge multilingue avec contexte réservation',
    globalROI: '24/7 support premium',
    demoScript: 'Le concierge a accès aux détails de réservation pour des réponses ultra-personnalisées.',
    elements: [
      {
        id: 'concierge-kpi-active',
        selector: '[data-guide="concierge-kpi-active"]',
        name: 'KPI Conversations Actives',
        description: 'Nombre de conversations en cours',
        interpretation: 'Bleu = en attente de réponse. Objectif: répondre en <2min.',
        roiImpact: '24/7 support',
        source: 'Table Concierge_Conversations',
        status: 'ok',
      },
      {
        id: 'concierge-kpi-resolved',
        selector: '[data-guide="concierge-kpi-resolved"]',
        name: 'KPI Résolues Aujourd\'hui',
        description: 'Conversations terminées avec succès',
        interpretation: 'Taux résolution = résolues / total. Objectif: >90%.',
        source: 'Table Concierge_Conversations',
        status: 'ok',
      },
      {
        id: 'concierge-kpi-withbooking',
        selector: '[data-guide="concierge-kpi-withbooking"]',
        name: 'KPI Avec Réservation',
        description: 'Conversations liées à un PNR existant',
        interpretation: 'Le concierge peut accéder aux détails du vol pour personnaliser.',
        source: 'Table Concierge_Conversations',
        status: 'ok',
      },
      {
        id: 'concierge-kpi-languages',
        selector: '[data-guide="concierge-kpi-languages"]',
        name: 'KPI Langues Actives',
        description: 'Nombre de langues utilisées',
        interpretation: 'FR, EN, JP = marchés principaux. ES en croissance.',
        source: 'Détection automatique',
        status: 'ok',
      },
      {
        id: 'concierge-conversations-list',
        selector: '[data-guide="concierge-conversations-list"]',
        name: 'Liste des Conversations',
        description: 'Toutes les conversations avec statut et sentiment',
        interpretation: 'Vert=résolu, Bleu=actif, Rouge=escaladé. Bordure couleur=sentiment.',
        source: 'Table Concierge_Conversations',
        status: 'ok',
      },
      {
        id: 'concierge-chat-panel',
        selector: '[data-guide="concierge-chat-panel"]',
        name: 'Panneau de Conversation',
        description: 'Détail de la conversation avec contexte réservation',
        interpretation: 'PNR, vol, date, classe affichés. Historique complet visible.',
        source: 'Table Concierge_Conversations',
        status: 'ok',
      },
      {
        id: 'concierge-input',
        selector: '[data-guide="concierge-input"]',
        name: 'Zone de Réponse',
        description: 'Champ pour rédiger une réponse manuelle',
        interpretation: 'Utile pour cas complexes nécessitant intervention humaine.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'concierge-btn-send',
        selector: '[data-guide="concierge-btn-send"]',
        name: 'Bouton Envoyer',
        description: 'Envoyer la réponse au client',
        interpretation: 'La réponse est envoyée dans la langue du client.',
        source: 'Interface locale',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: PRICING MONITOR ============
  {
    route: '/pricing-monitor',
    pageName: 'Competitor Pricing Monitor',
    pageDescription: 'Veille tarifaire quotidienne sur les concurrents',
    globalROI: 'Réaction prix <24h',
    demoScript: 'Surveillez les prix de French Bee, United, Air France en temps réel et recevez des alertes.',
    elements: [
      {
        id: 'pricing-btn-refresh',
        selector: '[data-guide="pricing-btn-refresh"]',
        name: 'Bouton Actualiser',
        description: 'Rafraîchir les données de prix concurrents',
        interpretation: 'Lance une nouvelle analyse des prix. Données mises à jour quotidiennement automatiquement.',
        source: 'Workflow n8n Build 20',
        status: 'ok',
      },
      {
        id: 'pricing-kpi-routes',
        selector: '[data-guide="pricing-kpi-routes"]',
        name: 'KPI Routes Surveillées',
        description: 'Nombre de routes suivies',
        interpretation: 'Toutes les routes ATN avec au moins un concurrent.',
        roiImpact: 'Couverture complète',
        source: 'Table Competitor_Prices',
        status: 'ok',
      },
      {
        id: 'pricing-kpi-alerts',
        selector: '[data-guide="pricing-kpi-alerts"]',
        name: 'KPI Alertes Actives',
        description: 'Routes où un concurrent est moins cher',
        interpretation: 'Nécessite une action: ajuster le prix ou lancer une promo.',
        roiImpact: 'Réaction <24h',
        source: 'Table Competitor_Prices',
        status: 'ok',
      },
      {
        id: 'pricing-kpi-competitors',
        selector: '[data-guide="pricing-kpi-competitors"]',
        name: 'KPI Concurrents',
        description: 'Nombre de compagnies surveillées',
        interpretation: 'French Bee, United, Air France, Hawaiian, etc.',
        source: 'Configuration',
        status: 'ok',
      },
      {
        id: 'pricing-kpi-avgdiff',
        selector: '[data-guide="pricing-kpi-avgdiff"]',
        name: 'KPI Écart Moyen',
        description: 'Différence moyenne de prix avec les concurrents',
        interpretation: 'Positif = ATN plus cher. Négatif = ATN moins cher.',
        roiImpact: 'Positionnement prix',
        source: 'Calcul automatique',
        status: 'ok',
      },
      {
        id: 'pricing-alerts-box',
        selector: '[data-guide="pricing-alerts-box"]',
        name: 'Box Alertes',
        description: 'Routes avec alertes tarifaires urgentes',
        interpretation: 'Ambre=concurrent moins cher. Cliquez pour voir les détails.',
        source: 'Build 20 - Pricing Monitor',
        status: 'ok',
      },
      {
        id: 'pricing-routes-list',
        selector: '[data-guide="pricing-routes-list"]',
        name: 'Grille Routes',
        description: 'Toutes les routes avec comparatif prix par concurrent',
        interpretation: 'Vert=compétitif, Rouge=plus cher. Graphique historique 7 jours.',
        source: 'Table Competitor_Prices',
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
