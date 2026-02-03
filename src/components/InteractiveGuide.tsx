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
        id: 'news-filter-all',
        selector: '[data-guide="news-filter-all"]',
        name: 'Filtre Tous Segments',
        description: 'Afficher toutes les newsletters sans filtre',
        interpretation: 'Vue globale de toutes les campagnes.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'news-filter-honeymoon',
        selector: '[data-guide="news-filter-honeymoon"]',
        name: 'Filtre Lune de Miel',
        description: 'Newsletters pour les couples en voyage de noces',
        interpretation: 'Segment premium. Offres romantiques, overwater bungalows.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'news-filter-family',
        selector: '[data-guide="news-filter-family"]',
        name: 'Filtre Famille',
        description: 'Newsletters pour les familles avec enfants',
        interpretation: 'Activités familiales, tarifs enfants, logements adaptés.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'news-filter-divers',
        selector: '[data-guide="news-filter-divers"]',
        name: 'Filtre Plongeurs',
        description: 'Newsletters pour les passionnés de plongée',
        interpretation: 'Spots de plongée, requins, manta rays, partenariats clubs.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'news-filter-business',
        selector: '[data-guide="news-filter-business"]',
        name: 'Filtre Business',
        description: 'Newsletters pour les voyageurs d\'affaires',
        interpretation: 'Classe Poerava Business, salons, flexibilité.',
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
        id: 'content-filter-all',
        selector: '[data-guide="content-filter-all"]',
        name: 'Filtre Tous',
        description: 'Afficher tous les articles',
        interpretation: 'Vue globale du contenu.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'content-filter-published',
        selector: '[data-guide="content-filter-published"]',
        name: 'Filtre Publiés',
        description: 'Articles déjà publiés sur le site',
        interpretation: 'Contenu live, générant du trafic.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'content-filter-draft',
        selector: '[data-guide="content-filter-draft"]',
        name: 'Filtre Brouillons',
        description: 'Articles en cours de rédaction',
        interpretation: 'À finaliser et valider.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'content-filter-scheduled',
        selector: '[data-guide="content-filter-scheduled"]',
        name: 'Filtre Planifiés',
        description: 'Articles prêts à publier à une date future',
        interpretation: 'Publication automatique programmée.',
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
        id: 'reviews-filter-all',
        selector: '[data-guide="reviews-filter-all"]',
        name: 'Filtre Tous',
        description: 'Afficher tous les avis sans filtre',
        interpretation: 'Vue globale de tous les avis.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reviews-filter-pending',
        selector: '[data-guide="reviews-filter-pending"]',
        name: 'Filtre À Valider',
        description: 'Avis avec réponse générée en attente de validation',
        interpretation: 'PRIORITAIRE: valider avant publication.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reviews-filter-approved',
        selector: '[data-guide="reviews-filter-approved"]',
        name: 'Filtre Approuvés',
        description: 'Avis avec réponse validée mais pas encore publiée',
        interpretation: 'Prêts à publier.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reviews-filter-published',
        selector: '[data-guide="reviews-filter-published"]',
        name: 'Filtre Publiés',
        description: 'Avis avec réponse déjà publiée',
        interpretation: 'Historique des réponses.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reviews-filter-rejected',
        selector: '[data-guide="reviews-filter-rejected"]',
        name: 'Filtre Rejetés',
        description: 'Avis dont la réponse a été rejetée',
        interpretation: 'À retravailler manuellement.',
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
        id: 'competitors-filter-all',
        selector: '[data-guide="competitors-filter-all"]',
        name: 'Filtre Toutes',
        description: 'Afficher toutes les alertes concurrentielles',
        interpretation: 'Vue globale de la veille.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'competitors-filter-urgent',
        selector: '[data-guide="competitors-filter-urgent"]',
        name: 'Filtre Urgent',
        description: 'Alertes nécessitant une action immédiate',
        interpretation: 'PRIORITAIRE: concurrent significativement moins cher.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'competitors-filter-high',
        selector: '[data-guide="competitors-filter-high"]',
        name: 'Filtre Haute Priorité',
        description: 'Alertes importantes à traiter rapidement',
        interpretation: 'Écart de prix notable, à surveiller.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'competitors-filter-medium',
        selector: '[data-guide="competitors-filter-medium"]',
        name: 'Filtre Priorité Moyenne',
        description: 'Alertes à suivre mais non urgentes',
        interpretation: 'Tendance à surveiller.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'competitors-filter-low',
        selector: '[data-guide="competitors-filter-low"]',
        name: 'Filtre Priorité Basse',
        description: 'Alertes informatives',
        interpretation: 'Pas d\'action immédiate requise.',
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
        name: 'Générateur de Rapport',
        description: 'Créez un rapport personnalisé à la demande',
        interpretation: 'Choisissez période, métriques, destinataires. Génération IA.',
        roiImpact: 'Rapports ad-hoc en 1 clic',
        source: 'Claude AI',
        status: 'ok',
      },
      {
        id: 'reports-filter-all',
        selector: '[data-guide="reports-filter-all"]',
        name: 'Filtre Tous',
        description: 'Afficher tous les rapports',
        interpretation: 'Vue globale de tous les templates.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reports-filter-performance',
        selector: '[data-guide="reports-filter-performance"]',
        name: 'Filtre Performance',
        description: 'Rapports de performance opérationnelle',
        interpretation: 'KPIs, métriques, dashboards.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reports-filter-content',
        selector: '[data-guide="reports-filter-content"]',
        name: 'Filtre Contenu',
        description: 'Rapports sur le contenu marketing',
        interpretation: 'Articles, newsletters, engagement.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reports-filter-revenue',
        selector: '[data-guide="reports-filter-revenue"]',
        name: 'Filtre Revenus',
        description: 'Rapports financiers et revenus',
        interpretation: 'CA, réservations, tendances.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reports-filter-operations',
        selector: '[data-guide="reports-filter-operations"]',
        name: 'Filtre Opérations',
        description: 'Rapports opérationnels vols',
        interpretation: 'Ponctualité, incidents, alertes.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reports-templates-list',
        selector: '[data-guide="reports-templates-list"]',
        name: 'Liste des Templates',
        description: 'Tous les modèles de rapports disponibles',
        interpretation: 'Cliquez pour prévisualiser ou générer.',
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
        id: 'flights-filter-all',
        selector: '[data-guide="flights-filter-all"]',
        name: 'Filtre Toutes',
        description: 'Afficher toutes les alertes vols',
        interpretation: 'Vue globale des perturbations.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'flights-filter-delay',
        selector: '[data-guide="flights-filter-delay"]',
        name: 'Filtre Retards',
        description: 'Alertes de retard uniquement',
        interpretation: 'Retards >30min nécessitant communication.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'flights-filter-cancelled',
        selector: '[data-guide="flights-filter-cancelled"]',
        name: 'Filtre Annulations',
        description: 'Vols annulés uniquement',
        interpretation: 'CRITIQUE: rebooking nécessaire.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'flights-filter-gate',
        selector: '[data-guide="flights-filter-gate"]',
        name: 'Filtre Changement Porte',
        description: 'Changements de porte d\'embarquement',
        interpretation: 'Info pratique pour les passagers.',
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
        id: 'social-filter-all',
        selector: '[data-guide="social-filter-all"]',
        name: 'Filtre Tous',
        description: 'Afficher toutes les mentions sans filtre',
        interpretation: 'Vue globale de toutes les plateformes.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'social-filter-twitter',
        selector: '[data-guide="social-filter-twitter"]',
        name: 'Filtre Twitter/X',
        description: 'Mentions sur Twitter/X uniquement',
        interpretation: 'Réactivité cruciale. Répondre en <1h.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'social-filter-instagram',
        selector: '[data-guide="social-filter-instagram"]',
        name: 'Filtre Instagram',
        description: 'Mentions sur Instagram uniquement',
        interpretation: 'Contenu visuel. Engagement Stories important.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'social-filter-facebook',
        selector: '[data-guide="social-filter-facebook"]',
        name: 'Filtre Facebook',
        description: 'Mentions sur Facebook uniquement',
        interpretation: 'Audience large. Commentaires et messages.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'social-filter-linkedin',
        selector: '[data-guide="social-filter-linkedin"]',
        name: 'Filtre LinkedIn',
        description: 'Mentions sur LinkedIn uniquement',
        interpretation: 'Audience B2B et professionnelle.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'social-mentions-list',
        selector: '[data-guide="social-mentions-list"]',
        name: 'Liste des Mentions',
        description: 'Toutes les mentions avec réponses suggérées',
        interpretation: 'Vert=positif, Jaune=neutre, Rouge=négatif.',
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
        id: 'roi-filter-all',
        selector: '[data-guide="roi-filter-all"]',
        name: 'Filtre Toutes',
        description: 'Afficher toutes les routes sans filtre',
        interpretation: 'Vue globale du réseau.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'roi-filter-critical',
        selector: '[data-guide="roi-filter-critical"]',
        name: 'Filtre CRITIQUE',
        description: 'Routes avec baisse significative',
        interpretation: 'URGENT: baisse >20%. Action immédiate requise.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'roi-filter-warning',
        selector: '[data-guide="roi-filter-warning"]',
        name: 'Filtre Attention',
        description: 'Routes avec légère baisse',
        interpretation: 'Baisse 10-20%. Surveiller et ajuster.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'roi-filter-growth',
        selector: '[data-guide="roi-filter-growth"]',
        name: 'Filtre Croissance',
        description: 'Routes en croissance',
        interpretation: 'Performance positive. Maintenir stratégie.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'roi-filter-stable',
        selector: '[data-guide="roi-filter-stable"]',
        name: 'Filtre Stable',
        description: 'Routes sans variation significative',
        interpretation: 'Variation <5%. Performance stable.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'roi-alerts-list',
        selector: '[data-guide="roi-alerts-list"]',
        name: 'Liste des Alertes ROI',
        description: 'Toutes les alertes par route avec recommandations',
        interpretation: 'Rouge=critique, Ambre=attention, Vert=croissance.',
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
        id: 'settings-chatbot',
        selector: '[data-guide="settings-chatbot"]',
        name: 'Configuration Chatbot',
        description: 'Personnalisez le ton et les langues du chatbot Tiare',
        interpretation: 'Ajustez le niveau de formalité et les langues actives.',
        source: 'Configuration chatbot',
        status: 'ok',
      },
      {
        id: 'settings-agents',
        selector: '[data-guide="settings-agents"]',
        name: 'Agents IA',
        description: 'Activez ou désactivez chaque agent IA',
        interpretation: 'Switch ON/OFF pour contrôler quels agents sont actifs.',
        source: 'Status agents n8n',
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
        id: 'attribution-stats',
        selector: '[data-guide="attribution-stats"]',
        name: 'KPIs Attribution',
        description: 'Statistiques globales des parcours et conversions',
        interpretation: 'Parcours analysés, touchpoints moyens, valeur totale attribuée.',
        roiImpact: 'Meilleure allocation budget',
        source: 'Table Attribution_Journeys',
        status: 'ok',
      },
      {
        id: 'attribution-models',
        selector: '[data-guide="attribution-models"]',
        name: 'Modèles d\'attribution',
        description: 'Comparez différents modèles (Linear, First Touch, Last Touch, etc.)',
        interpretation: 'Chaque modèle répartit le crédit différemment entre les touchpoints.',
        source: 'Calcul en temps réel',
        status: 'ok',
      },
      {
        id: 'attribution-journeys',
        selector: '[data-guide="attribution-journeys"]',
        name: 'Parcours clients',
        description: 'Détail des parcours individuels avec tous les touchpoints',
        interpretation: 'Cliquez pour voir le parcours complet d\'un client.',
        source: 'Table Attribution_Journeys',
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
        id: 'staff-stats',
        selector: '[data-guide="staff-stats"]',
        name: 'KPIs Assistant',
        description: 'Statistiques d\'utilisation de TALIA par les employés',
        interpretation: 'Questions traitées, temps économisé, satisfaction employés.',
        roiImpact: '-30% temps recherche',
        source: 'Table Staff_Queries',
        status: 'ok',
      },
      {
        id: 'staff-categories',
        selector: '[data-guide="staff-categories"]',
        name: 'Catégories de questions',
        description: 'Répartition des questions par thème',
        interpretation: 'Identifiez les sujets les plus demandés pour améliorer la documentation.',
        source: 'Analyse automatique',
        status: 'ok',
      },
      {
        id: 'staff-chat',
        selector: '[data-guide="staff-chat"]',
        name: 'Interface Chat',
        description: 'Testez TALIA en direct',
        interpretation: 'Posez des questions comme un employé pour vérifier les réponses.',
        source: 'API Claude + base documentaire',
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
        id: 'journeys-stats',
        selector: '[data-guide="journeys-stats"]',
        name: 'KPIs Journeys',
        description: 'Statistiques des parcours automatisés',
        interpretation: 'Journeys actifs, messages envoyés, taux d\'engagement.',
        roiImpact: '+25% engagement',
        source: 'Table Customer_Journeys',
        status: 'ok',
      },
      {
        id: 'journeys-filters',
        selector: '[data-guide="journeys-filters"]',
        name: 'Filtres parcours',
        description: 'Filtrer par type de parcours ou statut',
        interpretation: 'Pré-voyage, post-voyage, en cours, terminés.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'journeys-list',
        selector: '[data-guide="journeys-list"]',
        name: 'Liste des parcours',
        description: 'Détail de chaque parcours client avec étapes',
        interpretation: 'Vert=terminé, Bleu=en cours, Gris=planifié.',
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
        id: 'preferences-stats',
        selector: '[data-guide="preferences-stats"]',
        name: 'Stats préférences',
        description: 'KPIs des préférences clients',
        interpretation: 'Clients avec préférences, taux opt-in, canaux préférés.',
        roiImpact: 'Meilleur ciblage',
        source: 'Table Customer_Preferences',
        status: 'ok',
      },
      {
        id: 'preferences-rgpd',
        selector: '[data-guide="preferences-rgpd"]',
        name: 'Conformité RGPD',
        description: 'Statut de conformité et actions requises',
        interpretation: 'Vert=conforme, Ambre=action requise, Rouge=non conforme.',
        source: 'Audit automatique',
        status: 'ok',
      },
      {
        id: 'preferences-list',
        selector: '[data-guide="preferences-list"]',
        name: 'Liste clients',
        description: 'Préférences individuelles par client',
        interpretation: 'Cliquez pour voir/modifier les préférences d\'un client.',
        source: 'Table Customer_Preferences',
        status: 'ok',
      },
    ],
  },

  // ============ PAGE: VISUAL FACTORY ============
  {
    route: '/visual-factory',
    pageName: 'Visual Factory',
    pageDescription: 'Génération automatique d\'assets visuels marketing',
    globalROI: '-70% temps production',
    demoScript: 'Générez des visuels marketing en quelques clics: bannières, posts réseaux sociaux, headers email.',
    elements: [
      {
        id: 'visual-stats',
        selector: '[data-guide="visual-stats"]',
        name: 'Stats production',
        description: 'KPIs de génération de visuels',
        interpretation: 'Assets générés, temps économisé, formats créés.',
        roiImpact: '-70% temps production',
        source: 'Table Visual_Assets',
        status: 'ok',
      },
      {
        id: 'visual-generator',
        selector: '[data-guide="visual-generator"]',
        name: 'Générateur',
        description: 'Interface de génération de nouveaux visuels',
        interpretation: 'Choisissez le type, la destination, les couleurs et générez.',
        source: 'API Fal.ai + Claude',
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
    demoScript: 'Visualisez et gérez tout votre contenu planifié: articles, newsletters, posts sociaux.',
    elements: [
      {
        id: 'calendar-grid',
        selector: '[data-guide="calendar-grid"]',
        name: 'Grille calendrier',
        description: 'Vue calendrier du contenu planifié',
        interpretation: 'Cliquez sur une date pour voir/ajouter du contenu.',
        source: 'Table Content_Calendar',
        status: 'ok',
      },
      {
        id: 'calendar-stats',
        selector: '[data-guide="calendar-stats"]',
        name: 'Stats contenu',
        description: 'KPIs du calendrier éditorial',
        interpretation: 'Contenus planifiés, publiés, en retard.',
        source: 'Table Content_Calendar',
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
        id: 'bookings-stats',
        selector: '[data-guide="bookings-stats"]',
        name: 'Stats réservations',
        description: 'KPIs de l\'assistant booking',
        interpretation: 'Réservations assistées, taux conversion, valeur moyenne.',
        roiImpact: '+15% conversion',
        source: 'Table Bookings',
        status: 'ok',
      },
      {
        id: 'bookings-filters',
        selector: '[data-guide="bookings-filters"]',
        name: 'Filtres',
        description: 'Filtrer les réservations par statut',
        interpretation: 'En cours, confirmées, annulées.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'bookings-list',
        selector: '[data-guide="bookings-list"]',
        name: 'Liste réservations',
        description: 'Détail des réservations assistées',
        interpretation: 'Cliquez pour voir le parcours complet de réservation.',
        source: 'Table Bookings',
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
        id: 'planner-stats',
        selector: '[data-guide="planner-stats"]',
        name: 'Stats contenu',
        description: 'KPIs de production de contenu',
        interpretation: 'Articles planifiés, générés, publiés.',
        roiImpact: '8 articles/mois auto',
        source: 'Table Content_Planner',
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
        id: 'planner-list',
        selector: '[data-guide="planner-list"]',
        name: 'Liste contenus',
        description: 'Tous les contenus avec leur statut',
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
        id: 'abtests-stats',
        selector: '[data-guide="abtests-stats"]',
        name: 'Stats tests',
        description: 'KPIs des tests A/B',
        interpretation: 'Tests en cours, terminés, lift moyen, revenue testé.',
        roiImpact: '+14.6% lift moyen',
        source: 'Table AB_Tests',
        status: 'ok',
      },
      {
        id: 'abtests-methodology',
        selector: '[data-guide="abtests-methodology"]',
        name: 'Méthodologie',
        description: 'Explication de la méthode statistique utilisée',
        interpretation: 'Niveau de confiance 95%, correction Bonferroni pour multi-variantes.',
        source: 'Documentation',
        status: 'ok',
      },
      {
        id: 'abtests-list',
        selector: '[data-guide="abtests-list"]',
        name: 'Liste des tests',
        description: 'Tous les tests avec leurs variantes et résultats',
        interpretation: 'Vert=gagnant identifié, Bleu=en cours, Gris=brouillon.',
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
        id: 'upsell-stats',
        selector: '[data-guide="upsell-stats"]',
        name: 'Stats upsell',
        description: 'KPIs des offres personnalisées',
        interpretation: 'Offres envoyées, taux conversion, revenu généré, score perso moyen.',
        roiImpact: '+180k XPF/mois',
        source: 'Table Upsell_Offers',
        status: 'ok',
      },
      {
        id: 'upsell-filters',
        selector: '[data-guide="upsell-filters"]',
        name: 'Filtres statut',
        description: 'Filtrer par statut de l\'offre',
        interpretation: 'Envoyé, ouvert, cliqué, converti, ignoré.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'upsell-list',
        selector: '[data-guide="upsell-list"]',
        name: 'Liste des offres',
        description: 'Toutes les offres avec détails et performance',
        interpretation: 'Vert=converti, Orange=cliqué, Bleu=envoyé, Gris=ignoré.',
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
        id: 'leadscoring-stats',
        selector: '[data-guide="leadscoring-stats"]',
        name: 'Stats scoring',
        description: 'KPIs du scoring leads',
        interpretation: 'Total leads, hot leads (A), score moyen, valeur pipeline.',
        roiImpact: '+35% conversion',
        source: 'Table Lead_Scores',
        status: 'ok',
      },
      {
        id: 'leadscoring-rules',
        selector: '[data-guide="leadscoring-rules"]',
        name: 'Règles de scoring',
        description: 'Points attribués par type d\'action',
        interpretation: 'Booking start=25pts, Email click=15pts, etc.',
        source: 'Configuration',
        status: 'ok',
      },
      {
        id: 'leadscoring-filters',
        selector: '[data-guide="leadscoring-filters"]',
        name: 'Filtres grade',
        description: 'Filtrer par grade (A, B, C, D)',
        interpretation: 'A=Hot, B=Warm, C=Cold, D=Inactive.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'leadscoring-list',
        selector: '[data-guide="leadscoring-list"]',
        name: 'Liste des leads',
        description: 'Tous les leads avec score et historique d\'actions',
        interpretation: 'Cliquez pour voir le détail des actions du lead.',
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
        id: 'reviews-stats',
        selector: '[data-guide="reviews-stats"]',
        name: 'Stats analyse',
        description: 'KPIs de l\'analyse des avis',
        interpretation: 'Avis analysés, sentiment moyen, ironie détectée, thèmes principaux.',
        roiImpact: '+0.5 étoiles',
        source: 'Table Review_Analysis',
        status: 'ok',
      },
      {
        id: 'reviews-filters',
        selector: '[data-guide="reviews-filters"]',
        name: 'Filtres analyse',
        description: 'Filtrer par sentiment ou présence d\'ironie',
        interpretation: 'Positif, négatif, ironique, nécessite attention.',
        source: 'Interface locale',
        status: 'ok',
      },
      {
        id: 'reviews-list',
        selector: '[data-guide="reviews-list"]',
        name: 'Liste analyses',
        description: 'Avis analysés avec scores détaillés',
        interpretation: 'Badge ironie si détectée, score sentiment, thèmes extraits.',
        source: 'Table Review_Analysis',
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
        id: 'concierge-stats',
        selector: '[data-guide="concierge-stats"]',
        name: 'Stats concierge',
        description: 'KPIs du service concierge',
        interpretation: 'Conversations actives, résolues, avec réservation, langues actives.',
        roiImpact: '24/7 support',
        source: 'Table Concierge_Conversations',
        status: 'ok',
      },
      {
        id: 'concierge-conversations',
        selector: '[data-guide="concierge-conversations"]',
        name: 'Liste conversations',
        description: 'Toutes les conversations avec statut et sentiment',
        interpretation: 'Vert=résolu, Bleu=actif, Rouge=escaladé. Bordure=sentiment.',
        source: 'Table Concierge_Conversations',
        status: 'ok',
      },
      {
        id: 'concierge-chat',
        selector: '[data-guide="concierge-chat"]',
        name: 'Vue conversation',
        description: 'Détail de la conversation avec contexte réservation',
        interpretation: 'PNR, vol, date, classe affichés. Historique complet visible.',
        source: 'Table Concierge_Conversations',
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
        id: 'pricing-stats',
        selector: '[data-guide="pricing-stats"]',
        name: 'Stats veille',
        description: 'KPIs de la veille tarifaire',
        interpretation: 'Routes surveillées, alertes actives, concurrents suivis, écart moyen.',
        roiImpact: 'Ajustement proactif',
        source: 'Table Competitor_Prices',
        status: 'ok',
      },
      {
        id: 'pricing-alerts',
        selector: '[data-guide="pricing-alerts"]',
        name: 'Alertes actives',
        description: 'Routes avec alertes tarifaires',
        interpretation: 'Ambre=concurrent moins cher, action recommandée.',
        source: 'Build 20 - Pricing Monitor',
        status: 'ok',
      },
      {
        id: 'pricing-routes',
        selector: '[data-guide="pricing-routes"]',
        name: 'Grille routes',
        description: 'Toutes les routes avec comparatif prix',
        interpretation: 'Vert=compétitif, Rouge=plus cher. Graphique 7 jours.',
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
