'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  X, ChevronLeft, ChevronRight, Play, Pause, Check,
  LayoutDashboard, MessageSquare, Mail, FileText, Star,
  BarChart3, Brain, Users, Plane, Calendar, Target,
  TrendingUp, Zap, Settings, Sparkles, Image as ImageIcon,
  Route, CreditCard, Headphones, HelpCircle, Globe, Eye,
  DollarSign, Clock, CheckCircle, AlertTriangle, Lightbulb,
  ArrowRight, Search, Bot
} from 'lucide-react'

// Types
interface SidebarGuideItem {
  id: string
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  purpose: string
  interpretation: string[]
  roiMetrics: {
    value: string
    description: string
    calculation?: string
  }
  keyFeatures: string[]
  useCases: string[]
  dataSource: string
  updateFrequency: string
  dependencies?: string[]
}

// Documentation complete de chaque element sidebar
const sidebarGuideData: SidebarGuideItem[] = [
  // ACCUEIL
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    category: 'Accueil',
    purpose: 'Le Dashboard est le centre de commandement de votre infrastructure IA. Il offre une vue d\'ensemble en temps réel de tous vos agents automatisés, leurs performances et les métriques clés de votre activité. C\'est ici que vous commencez votre journée pour identifier rapidement ce qui fonctionne et ce qui nécessite votre attention.',
    interpretation: [
      '**KPIs en haut** : Les 4 cartes principales montrent les métriques critiques. Une flèche verte = amélioration, rouge = dégradation. Comparez toujours à la période précédente.',
      '**Grille des agents** : Chaque carte représente un agent IA actif. Point vert = fonctionne parfaitement. Point orange = attention requise. Point rouge = erreur à traiter.',
      '**Fil d\'activité** : Les dernières actions de vos agents. Permet de voir en temps réel ce qui se passe sans aller dans chaque section.',
      '**Graphique tendances** : Évolution sur 7/30 jours. Cherchez les patterns : pics le week-end ? Baisse en milieu de semaine ?',
    ],
    roiMetrics: {
      value: '+35% productivité marketing',
      description: 'Le Dashboard centralise toutes les informations, éliminant le besoin de jongler entre 10+ outils différents. Vos équipes gagnent en moyenne 2h/jour en temps de recherche et compilation de données.',
      calculation: '2h/jour × 22 jours × coût horaire moyen = économie mensuelle',
    },
    keyFeatures: [
      'Vue unifiée de tous les agents IA',
      'Alertes temps réel sur les anomalies',
      'KPIs avec tendances comparatives',
      'Accès rapide aux actions prioritaires',
    ],
    useCases: [
      'Briefing matinal de l\'équipe marketing',
      'Identification rapide des problèmes',
      'Reporting à la direction',
      'Suivi des performances globales',
    ],
    dataSource: 'Agrégation de tous les workflows n8n + Airtable + API externes',
    updateFrequency: 'Temps réel (rafraîchissement auto toutes les 30s)',
  },
  {
    id: 'demo-site',
    name: 'Demo Site',
    href: '/demo-site',
    icon: Globe,
    category: 'Accueil',
    purpose: 'Cette page vous permet de tester le chatbot Tiare exactement comme vos clients le verront sur le site Air Tahiti Nui. Vous pouvez simuler des conversations, vérifier les réponses de l\'IA, et valider l\'expérience utilisateur avant mise en production.',
    interpretation: [
      '**Sélecteur viewport** : Testez l\'expérience sur Desktop, Tablette et Mobile. 60% du trafic est mobile - critique de vérifier.',
      '**Zone de test** : Le site avec le chatbot intégré. Cliquez sur la bulle bleue pour ouvrir le chat.',
      '**Logs en temps réel** : Visualisez ce que l\'IA "pense" pendant qu\'elle répond.',
    ],
    roiMetrics: {
      value: 'Validation avant mise en production',
      description: 'Évite les erreurs coûteuses en production. Un bug chatbot vu par 10,000 visiteurs = image de marque dégradée. Tester ici = 0 risque.',
      calculation: 'Coût d\'un bad buzz évité > 100,000 XPF',
    },
    keyFeatures: [
      'Test multi-device (responsive)',
      'Conversations test sans impact production',
      'Visualisation des logs IA',
      'Partage de scénarios de test',
    ],
    useCases: [
      'Validation avant déploiement',
      'Formation des équipes',
      'Démonstration aux stakeholders',
      'Debug de conversations problématiques',
    ],
    dataSource: 'Environnement de test isolé',
    updateFrequency: 'À la demande',
  },
  // AGENTS IA
  {
    id: 'conversations',
    name: 'Chatbot Tiare',
    href: '/conversations',
    icon: MessageSquare,
    category: 'Agents IA',
    purpose: 'Le Chatbot Tiare est votre assistant client virtuel 24/7. Il répond aux questions des visiteurs en 3 langues (FR/EN/ES), qualifie les prospects, et redirige vers la réservation. Cette page vous permet de monitorer toutes les conversations et d\'améliorer continuellement les réponses.',
    interpretation: [
      '**Total conversations** : Volume global. Croissance = adoption du chatbot. Stagnation = peut-être pas assez visible sur le site.',
      '**Temps moyen réponse** : <2s = excellent (plus rapide qu\'un humain). >5s = vérifier les questions complexes qui ralentissent.',
      '**Taux de résolution** : % de conversations résolues sans escalade humaine. >85% = excellent. <70% = améliorer la FAQ.',
      '**Tokens utilisés** : Consommation API = coût. Pics = questions longues/complexes. Surveillez les anomalies.',
      '**Liste conversations** : Cliquez pour voir le détail. Identifiez les questions mal comprises pour enrichir la base de connaissances.',
    ],
    roiMetrics: {
      value: '40h/mois économisées (≈ 0.25 ETP)',
      description: 'Chaque conversation chatbot = 3-5 min de temps agent économisé. Avec 500+ conversations/mois, c\'est l\'équivalent d\'un mi-temps qui répond aux questions basiques.',
      calculation: '500 conv × 4 min × coût horaire agent ÷ 60 = économie mensuelle',
    },
    keyFeatures: [
      'Support 24/7 multilingue',
      'Réponses instantanées (<2s)',
      'Qualification automatique des leads',
      'Escalade intelligente vers humain',
    ],
    useCases: [
      'Questions fréquentes (bagages, horaires, tarifs)',
      'Aide à la réservation',
      'Informations destinations',
      'Support avant/après voyage',
    ],
    dataSource: 'Table Airtable Concierge_Logs + API Claude',
    updateFrequency: 'Temps réel',
  },
  {
    id: 'concierge-pro',
    name: 'Concierge Pro',
    href: '/concierge-pro',
    icon: Headphones,
    category: 'Agents IA',
    purpose: 'Version premium du chatbot pour les clients authentifiés avec une réservation. L\'IA connaît leur vol, leur historique, et peut offrir un service personnalisé : "Votre vol TN7 part dans 3 jours, voulez-vous des informations sur les bagages autorisés ?"',
    interpretation: [
      '**Contexte client** : L\'IA affiche les infos du client connecté (vol, classe, historique). Vérifiez que les données sont correctes.',
      '**Personnalisation** : Les réponses mentionnent le nom, le vol, la classe. Plus c\'est personnalisé, plus la satisfaction augmente.',
      '**Actions disponibles** : Modification de réservation, upgrade, services additionnels. Chaque action génère du revenu.',
    ],
    roiMetrics: {
      value: '+45% satisfaction client',
      description: 'Un client qui reçoit une réponse personnalisée mentionnant son vol est 45% plus satisfait qu\'une réponse générique. Satisfaction = fidélité = revenus récurrents.',
      calculation: 'NPS avant/après × impact sur repeat booking rate',
    },
    keyFeatures: [
      'Contexte réservation intégré',
      'Historique voyageur',
      'Actions de modification directes',
      'Proactivité (rappels, suggestions)',
    ],
    useCases: [
      'Support premium pré-vol',
      'Modifications de réservation',
      'Upsell personnalisé',
      'Assistance voyage en cours',
    ],
    dataSource: 'API GDS + Authentification Mon Espace ATN',
    updateFrequency: 'Temps réel avec contexte client',
    dependencies: ['Accès API réservations', 'Specs auth Mon Espace'],
  },
  {
    id: 'staff-assistant',
    name: 'Staff Assistant',
    href: '/staff-assistant',
    icon: Users,
    category: 'Agents IA',
    purpose: 'Assistant IA interne pour les employés ATN. Répond aux questions sur les procédures, tarifs, règles, sans déranger le manager. Réduit drastiquement le temps de formation des nouveaux employés.',
    interpretation: [
      '**Questions employés** : Quels types de questions sont posées ? Identifiez les gaps de formation.',
      '**Taux de résolution** : L\'IA trouve-t-elle les réponses dans la documentation ? Si <80%, enrichir la base.',
      '**Temps gagné** : Chaque question résolue par l\'IA = 10min de temps manager économisé.',
    ],
    roiMetrics: {
      value: '-30% temps formation nouveaux employés',
      description: 'Un nouvel employé pose en moyenne 15 questions/jour les premières semaines. Avec l\'assistant IA, il obtient des réponses instantanées sans mobiliser ses collègues.',
      calculation: '15 questions × 10min × nb nouveaux employés/an = temps gagné',
    },
    keyFeatures: [
      'Base de connaissances interne',
      'Recherche documentaire IA',
      'Historique des questions',
      'Suggestions proactives',
    ],
    useCases: [
      'Onboarding nouveaux employés',
      'Rappel procédures',
      'Recherche tarifaire',
      'FAQ interne',
    ],
    dataSource: 'Documents internes ATN vectorisés',
    updateFrequency: 'Mise à jour à chaque ajout de documentation',
    dependencies: ['Manuels de procédures', 'Politiques RH', 'Guidelines marque'],
  },
  // MARKETING AUTOMATISE
  {
    id: 'newsletters',
    name: 'Newsletters',
    href: '/newsletters',
    icon: Mail,
    category: 'Marketing Automatisé',
    purpose: 'Génération et envoi automatique de newsletters hyper-personnalisées. L\'IA adapte le contenu selon le segment (lune de miel, famille, business...), l\'historique du client, et les offres du moment. Fini les emails génériques que personne n\'ouvre.',
    interpretation: [
      '**Score personnalisation** : >90% = prénom + segment + historique utilisés. Plus c\'est haut, meilleur est le taux d\'ouverture.',
      '**Taux d\'ouverture** : Benchmark standard 20-25%. Avec personnalisation IA : 30-40%. Si <20%, revoir les objets.',
      '**Taux de clic** : % de gens qui cliquent après ouverture. >5% = excellent. <2% = contenu pas assez pertinent.',
      '**Conversions** : Le graal. Combien de réservations générées par cette newsletter ?',
    ],
    roiMetrics: {
      value: '+32% taux d\'ouverture vs emails génériques',
      description: 'Une newsletter personnalisée "Jean-Pierre, votre prochaine escapade lune de miel à Bora Bora" a 32% plus de chances d\'être ouverte qu\'un générique "Découvrez nos offres".',
      calculation: 'Taux ouverture personnalisé - Taux ouverture générique = +32 points',
    },
    keyFeatures: [
      'Personnalisation par segment',
      'Génération contenu IA',
      'A/B testing automatique des objets',
      'Envoi optimisé (meilleur moment)',
    ],
    useCases: [
      'Promotions ciblées par segment',
      'Newsletters saisonnières',
      'Relances abandons de panier',
      'Anniversaires et occasions spéciales',
    ],
    dataSource: 'CRM segments + API Brevo',
    updateFrequency: 'Selon calendrier défini (hebdo/mensuel)',
    dependencies: ['Clé API Brevo'],
  },
  {
    id: 'content',
    name: 'Contenu SEO',
    href: '/content',
    icon: FileText,
    category: 'Marketing Automatisé',
    purpose: 'Génération automatique d\'articles de blog optimisés SEO. L\'IA écrit des articles sur vos destinations, conseils voyage, actualités, qui attirent du trafic organique depuis Google. Plus d\'articles = plus de visibilité = plus de réservations.',
    interpretation: [
      '**Score SEO** : Note 0-100 basée sur mots-clés, structure, longueur. >80 = excellent ranking potentiel.',
      '**Statut publication** : Brouillon (à relire) → Planifié (date prévue) → Publié (live).',
      '**Trafic généré** : Combien de visiteurs chaque article attire depuis Google.',
      '**Conversions** : Combien de ces visiteurs finissent par réserver.',
    ],
    roiMetrics: {
      value: '+45% trafic organique (sur 6 mois)',
      description: 'Publier 4 articles/mois pendant 6 mois crée un actif SEO durable. Ce trafic est "gratuit" contrairement aux pubs payantes.',
      calculation: 'Coût acquisition client organique vs payant = économie massive',
    },
    keyFeatures: [
      'Génération articles IA',
      'Optimisation SEO automatique',
      'Planification éditoriale',
      'Analyse de performance',
    ],
    useCases: [
      'Guides de destination',
      'Conseils de voyage',
      'Actualités compagnie',
      'FAQ enrichies',
    ],
    dataSource: 'Table SEO_Content + Google Search Console',
    updateFrequency: 'Publication selon calendrier éditorial',
    dependencies: ['Accès Google Search Console'],
  },
  {
    id: 'social',
    name: 'Social Media',
    href: '/social',
    icon: Sparkles,
    category: 'Marketing Automatisé',
    purpose: 'Génération et planification de posts pour vos réseaux sociaux (Facebook, Instagram, LinkedIn). L\'IA crée des contenus engageants adaptés à chaque plateforme, avec hashtags optimisés et timing parfait.',
    interpretation: [
      '**Engagement rate** : (Likes + Comments + Shares) / Followers. >3% = excellent. <1% = contenu à revoir.',
      '**Reach** : Combien de personnes ont vu le post (au-delà de vos followers).',
      '**Best performing** : Identifiez quel type de contenu marche le mieux (photos, vidéos, carrousels).',
    ],
    roiMetrics: {
      value: '+50% engagement moyen',
      description: 'Posts générés avec IA et publiés au moment optimal ont 50% plus d\'engagement que posts manuels publiés "quand on y pense".',
      calculation: 'Engagement moyen avec IA - Engagement moyen sans = +50%',
    },
    keyFeatures: [
      'Génération multi-plateforme',
      'Hashtags optimisés',
      'Planification automatique',
      'Analyse des tendances',
    ],
    useCases: [
      'Posts promotionnels',
      'Contenu inspirationnel',
      'User-generated content',
      'Actualités compagnie',
    ],
    dataSource: 'API Meta Business Suite',
    updateFrequency: 'Selon planning social',
    dependencies: ['Accès Meta Business Suite'],
  },
  {
    id: 'visual-factory',
    name: 'Visual Factory',
    href: '/visual-factory',
    icon: ImageIcon,
    category: 'Marketing Automatisé',
    purpose: 'Génération automatique de visuels marketing par IA. Bannières, images réseaux sociaux, headers email... Plus besoin d\'attendre le graphiste pour chaque campagne.',
    interpretation: [
      '**Assets générés** : Nombre de visuels créés. Comparez au temps que ça prendrait manuellement.',
      '**Formats disponibles** : Email headers, Social posts, Bannières web. Chaque format a ses dimensions.',
      '**Utilisation** : Combien d\'assets sont effectivement utilisés dans les campagnes.',
    ],
    roiMetrics: {
      value: '-70% temps de création graphique',
      description: 'Un visuel qui prenait 2h à créer (brief → graphiste → révisions) est généré en 30 secondes par l\'IA.',
      calculation: '2h manuel vs 30s IA = 240x plus rapide',
    },
    keyFeatures: [
      'Génération IA (Fal.ai)',
      'Respect charte graphique',
      'Multi-formats automatiques',
      'Bibliothèque d\'assets',
    ],
    useCases: [
      'Visuels campagnes email',
      'Posts réseaux sociaux',
      'Bannières promotionnelles',
      'Illustrations articles',
    ],
    dataSource: 'API Fal.ai + Claude Vision',
    updateFrequency: 'À la demande',
  },
  // INTELLIGENCE
  {
    id: 'competitors',
    name: 'Veille Concurrence',
    href: '/competitors',
    icon: Eye,
    category: 'Intelligence',
    purpose: 'Monitoring automatique 24/7 des prix et offres de vos concurrents (French Bee, Hawaiian, LATAM...). Recevez une alerte dès qu\'un concurrent baisse ses prix sur vos routes. Ne soyez plus jamais pris au dépourvu.',
    interpretation: [
      '**Alertes prix** : Rouge = concurrent moins cher (action urgente). Ambre = changement détecté. Vert = vous êtes compétitif.',
      '**Écart de prix** : % de différence. >15% = risque de perte de parts de marché.',
      '**Tendances** : Le concurrent baisse-t-il progressivement ? Promo ponctuelle ou stratégie long terme ?',
      '**Routes critiques** : Identifiez les routes où vous êtes le plus exposé.',
    ],
    roiMetrics: {
      value: 'Réaction en <24h aux changements',
      description: 'Avant, vous découvriez les promos concurrents via les clients ou la presse. Maintenant, vous êtes alerté en temps réel et pouvez réagir immédiatement.',
      calculation: 'Revenus préservés en réagissant vite vs revenus perdus en découvrant tard',
    },
    keyFeatures: [
      'Scraping quotidien automatisé',
      'Alertes multi-canaux',
      'Historique des prix',
      'Analyse des tendances',
    ],
    useCases: [
      'Ajustement tarifaire réactif',
      'Promos défensives',
      'Intelligence concurrentielle',
      'Reporting direction',
    ],
    dataSource: 'Scraping sites concurrents (French Bee, Hawaiian, LATAM)',
    updateFrequency: 'Quotidien à 6h',
  },
  {
    id: 'reviews',
    name: 'Gestion Avis',
    href: '/reviews',
    icon: Star,
    category: 'Intelligence',
    purpose: 'Collecte et réponse automatique aux avis clients sur toutes les plateformes (Google, TripAdvisor, Trustpilot...). L\'IA génère des réponses personnalisées et appropriées au ton de l\'avis.',
    interpretation: [
      '**Note moyenne** : Objectif >4.5/5. Chaque 0.1 étoile = ~5% de revenus (études secteur).',
      '**Volume d\'avis** : Plus d\'avis = plus de crédibilité. Encouragez les avis positifs.',
      '**Répartition sentiment** : Positifs/Neutres/Négatifs. Un ratio 80/15/5 est sain.',
      '**Temps de réponse** : Répondre <24h améliore l\'image. L\'IA répond instantanément.',
    ],
    roiMetrics: {
      value: '+0.3 étoiles de note moyenne',
      description: 'Répondre à 100% des avis, de façon personnalisée et rapide, améliore mécaniquement la note. Les études montrent +0.3 étoiles en moyenne.',
      calculation: '+0.3 étoile × impact revenus estimé (5%/étoile) = gain significatif',
    },
    keyFeatures: [
      'Agrégation multi-plateformes',
      'Réponses IA personnalisées',
      'Analyse de sentiment',
      'Workflow d\'approbation',
    ],
    useCases: [
      'Réponse aux avis positifs',
      'Gestion de crise (avis négatifs)',
      'Identification tendances',
      'Amélioration continue service',
    ],
    dataSource: 'API Google Business Profile + TripAdvisor',
    updateFrequency: 'Temps réel',
    dependencies: ['Accès Google Business Profile', 'Accès TripAdvisor Manager'],
  },
  {
    id: 'review-intelligence',
    name: 'Review Intelligence',
    href: '/review-intelligence',
    icon: Brain,
    category: 'Intelligence',
    purpose: 'Analyse sémantique avancée de tous vos avis. L\'IA ne se contente pas de classer positif/négatif, elle détecte l\'ironie, identifie les thèmes récurrents, et prédit les tendances avant qu\'elles ne deviennent des problèmes.',
    interpretation: [
      '**Détection ironie** : L\'IA comprend que "Le repas était formidable..." (avec contexte négatif) est en fait une critique.',
      '**Thèmes récurrents** : Word cloud des sujets. Plus c\'est gros = plus c\'est mentionné. Rouge = négatif.',
      '**Tendances émergentes** : Un sujet qui monte en fréquence. Permet d\'anticiper.',
      '**Comparaison temporelle** : Les plaintes sur X ont-elles augmenté ce mois-ci ?',
    ],
    roiMetrics: {
      value: 'Détection précoce des problèmes',
      description: 'Identifier une tendance négative (ex: plaintes répétées sur les repas) AVANT qu\'elle ne devienne virale = temps de réaction et économie de crise.',
      calculation: 'Coût d\'une crise évitée > 1,000,000 XPF',
    },
    keyFeatures: [
      'NLP avancé + détection ironie',
      'Clustering thématique',
      'Analyse de tendances',
      'Alertes proactives',
    ],
    useCases: [
      'Amélioration produit/service',
      'Formation du personnel',
      'Prévention de crise',
      'Reporting qualité',
    ],
    dataSource: 'Workflow Build 16 - Review Intelligence',
    updateFrequency: 'Analyse quotidienne',
  },
  {
    id: 'lead-scoring',
    name: 'Lead Scoring',
    href: '/lead-scoring',
    icon: Target,
    category: 'Intelligence',
    purpose: 'Attribution automatique d\'un score de 0-100 à chaque prospect selon sa probabilité d\'achat. Priorisez vos efforts commerciaux sur les leads les plus chauds.',
    interpretation: [
      '**Score 80-100** : Lead très chaud. Contacter aujourd\'hui. Forte intention d\'achat.',
      '**Score 50-79** : Lead tiède. Nurturing nécessaire. Envoyer du contenu de valeur.',
      '**Score 0-49** : Lead froid. Pas prêt à acheter. Garder en base pour plus tard.',
      '**Critères de scoring** : Comportement site, ouvertures email, interactions chatbot, historique.',
    ],
    roiMetrics: {
      value: '+25% taux de conversion commercial',
      description: 'En contactant d\'abord les leads les plus chauds, vos commerciaux convertissent plus avec moins d\'efforts.',
      calculation: 'Taux conversion priorisé vs taux conversion random = +25%',
    },
    keyFeatures: [
      'Scoring comportemental',
      'Mise à jour temps réel',
      'Critères personnalisables',
      'Intégration CRM',
    ],
    useCases: [
      'Priorisation commerciale',
      'Automatisation nurturing',
      'Segmentation dynamique',
      'Allocation ressources',
    ],
    dataSource: 'Comportement site + CRM + Email tracking',
    updateFrequency: 'Temps réel',
  },
  // OPERATIONS
  {
    id: 'flights',
    name: 'Vols',
    href: '/flights',
    icon: Plane,
    category: 'Opérations',
    purpose: 'Monitoring temps réel de tous vos vols : statut, retards, taux de remplissage. Permet d\'adapter les communications marketing (promos sur vols vides) et d\'anticiper les problèmes.',
    interpretation: [
      '**Statut vol** : Vert = à l\'heure. Ambre = retard <1h. Rouge = retard >1h ou annulé.',
      '**Taux de remplissage** : Vert >85%. Ambre 70-85%. Rouge <70%. Vols rouges = opportunité de promo flash.',
      '**Alertes passagers** : Nombre de passagers impactés par un retard. Permet de préparer la communication.',
    ],
    roiMetrics: {
      value: 'Visibilité opérationnelle temps réel',
      description: 'Connecter le marketing aux opérations permet des actions rapides : promo sur un vol vide, communication proactive en cas de retard.',
      calculation: 'Revenus additionnels (promos vols vides) + satisfaction (communication proactive)',
    },
    keyFeatures: [
      'Statut temps réel',
      'Alertes automatiques',
      'Historique des perturbations',
      'Intégration communications',
    ],
    useCases: [
      'Promos flash sur vols vides',
      'Communication retards proactive',
      'Coordination équipes',
      'Reporting opérationnel',
    ],
    dataSource: 'API GDS (Amadeus/Sabre)',
    updateFrequency: 'Temps réel',
    dependencies: ['Accès API système de réservation'],
  },
  {
    id: 'bookings',
    name: 'Réservations',
    href: '/bookings',
    icon: CreditCard,
    category: 'Opérations',
    purpose: 'Suivi de toutes les demandes et réservations clients. Modifications, annulations, questions... Tout est centralisé pour ne rien laisser passer.',
    interpretation: [
      '**Demandes en attente** : Nombre de requêtes non traitées. Objectif : 0 en fin de journée.',
      '**Temps de traitement** : Délai moyen entre demande et résolution. <24h = excellent.',
      '**Type de demandes** : Modifications, annulations, infos. Identifiez les patterns pour automatiser.',
    ],
    roiMetrics: {
      value: 'Réduction du temps de traitement',
      description: 'Centraliser toutes les demandes évite les oublis et permet un traitement plus rapide et efficace.',
      calculation: 'Temps moyen avant - Temps moyen après = gain par demande',
    },
    keyFeatures: [
      'Vue unifiée des demandes',
      'Priorisation automatique',
      'Historique client',
      'Templates de réponse',
    ],
    useCases: [
      'Traitement modifications',
      'Gestion annulations',
      'Support client centralisé',
      'Suivi SLA',
    ],
    dataSource: 'Formulaires site + emails entrants',
    updateFrequency: 'Temps réel',
  },
  {
    id: 'calendar',
    name: 'Calendrier',
    href: '/calendar',
    icon: Calendar,
    category: 'Opérations',
    purpose: 'Planning éditorial et marketing centralisé. Visualisez toutes vos campagnes, publications, newsletters sur un calendrier. Coordonnez les équipes et évitez les conflits.',
    interpretation: [
      '**Vue calendrier** : Chaque bloc = une action planifiée. Couleurs par type (email, social, article).',
      '**Statuts** : Planifié (futur), En cours (en préparation), Publié (fait), Annulé.',
      '**Charge de travail** : Évitez les jours surchargés. Répartissez les publications.',
    ],
    roiMetrics: {
      value: 'Organisation et anticipation',
      description: 'Un calendrier éditorial bien tenu = cohérence des communications, pas de "on a oublié la newsletter", pas de 2 promos en même temps.',
      calculation: 'Qualité perception marque + efficacité équipe',
    },
    keyFeatures: [
      'Vue mensuelle/hebdo/jour',
      'Drag & drop',
      'Intégration workflows',
      'Partage équipe',
    ],
    useCases: [
      'Planification campagnes',
      'Coordination équipes',
      'Anticipation saisonnalité',
      'Reporting activité',
    ],
    dataSource: 'Table Content_Calendar Airtable',
    updateFrequency: 'Temps réel',
  },
  {
    id: 'journeys',
    name: 'Parcours Client',
    href: '/journeys',
    icon: Route,
    category: 'Opérations',
    purpose: 'Automatisation des parcours client multi-touchpoints. De la réservation au retour, chaque étape déclenche des communications personnalisées automatiques.',
    interpretation: [
      '**Journeys actifs** : Nombre de parcours en cours. Chaque client = 1 journey actif.',
      '**Étapes** : J-7 rappel, J-1 infos pratiques, J+1 feedback, J+30 offre retour. Chaque étape a son taux de succès.',
      '**Completion rate** : % de clients qui vont jusqu\'au bout du journey. Objectif >80%.',
    ],
    roiMetrics: {
      value: '+30% rétention client',
      description: 'Un client bien accompagné (rappels, infos, suivi) revient plus souvent. Les journeys automatisés assurent un suivi parfait sans effort manuel.',
      calculation: 'Taux de repeat booking avec journey vs sans = +30%',
    },
    keyFeatures: [
      'Séquences multi-étapes',
      'Déclencheurs événementiels',
      'Personnalisation dynamique',
      'Analytics par étape',
    ],
    useCases: [
      'Onboarding post-réservation',
      'Préparation voyage',
      'Suivi satisfaction',
      'Réengagement',
    ],
    dataSource: 'Workflows n8n Build 21-25',
    updateFrequency: 'Événementiel',
  },
  // ANALYTICS
  {
    id: 'reports',
    name: 'Rapports',
    href: '/reports',
    icon: BarChart3,
    category: 'Analytics',
    purpose: 'Génération automatique de rapports hebdomadaires et mensuels. Plus besoin de compiler les stats à la main. Le rapport arrive dans votre boîte chaque lundi matin.',
    interpretation: [
      '**Rapport hebdo** : KPIs de la semaine, comparaison semaine précédente, alertes.',
      '**Rapport mensuel** : Vue complète du mois, tendances, recommandations.',
      '**Téléchargement** : PDF prêt à partager avec la direction.',
    ],
    roiMetrics: {
      value: '4h/semaine économisées sur le reporting',
      description: 'Compiler un rapport hebdo prenait 4h. Maintenant c\'est automatique. 4h × 52 semaines × coût horaire = économie annuelle significative.',
      calculation: '4h × 52 semaines × 5,000 XPF/h = 1,040,000 XPF/an',
    },
    keyFeatures: [
      'Génération automatique',
      'Export PDF',
      'Envoi programmé',
      'Personnalisation contenu',
    ],
    useCases: [
      'Reporting direction',
      'Suivi KPIs équipe',
      'Analyse tendances',
      'Justification investissements',
    ],
    dataSource: 'Workflow Build 7 + Supabase storage',
    updateFrequency: 'Hebdomadaire (lundi 8h) + Mensuel (1er du mois)',
  },
  {
    id: 'attribution',
    name: 'Attribution',
    href: '/attribution',
    icon: TrendingUp,
    category: 'Analytics',
    purpose: 'Analyse du ROI de chaque canal marketing. Savez-vous quel canal génère vraiment vos ventes ? Google Ads ? Newsletter ? Chatbot ? L\'attribution répond à cette question.',
    interpretation: [
      '**Modèles d\'attribution** : First-touch (premier contact), Last-touch (dernier avant achat), Linéaire (réparti).',
      '**Part par canal** : % des conversions attribuées à chaque canal. Comparez les modèles.',
      '**ROI par canal** : Revenus générés / Coût du canal. Focus sur les plus rentables.',
    ],
    roiMetrics: {
      value: 'Optimisation budget marketing',
      description: 'Savoir que le chatbot génère 25% des conversions (alors qu\'il ne coûte que 5% du budget) permet de réallouer intelligemment.',
      calculation: 'Budget optimisé selon attribution = ROI global amélioré',
    },
    keyFeatures: [
      'Multi-touch attribution',
      'Comparaison modèles',
      'ROI par canal',
      'Recommandations budget',
    ],
    useCases: [
      'Allocation budget',
      'Justification investissements',
      'Optimisation canaux',
      'Reporting CMO',
    ],
    dataSource: 'Google Analytics + CRM',
    updateFrequency: 'Quotidien',
    dependencies: ['Accès Google Analytics'],
  },
  {
    id: 'ab-tests',
    name: 'A/B Tests',
    href: '/ab-tests',
    icon: Zap,
    category: 'Analytics',
    purpose: 'Tests comparatifs automatisés. L\'IA teste continuellement différentes versions (objets email, messages chatbot, visuels) et identifie les gagnants. Amélioration continue basée sur les données.',
    interpretation: [
      '**Tests en cours** : Nombre de comparaisons actives. Plusieurs tests simultanés = optimisation rapide.',
      '**Confiance statistique** : Un test est concluant quand confiance >95%. Avant ça, pas de décision.',
      '**Lift** : Amélioration de la version B vs A. +15% lift = version B nettement meilleure.',
    ],
    roiMetrics: {
      value: '+15% performance moyenne des campagnes',
      description: 'Tester systématiquement = trouver les meilleures versions. Sur l\'année, les petites améliorations s\'accumulent.',
      calculation: 'Performance moyenne avec A/B - Sans A/B = +15%',
    },
    keyFeatures: [
      'Tests automatisés',
      'Calcul confiance statistique',
      'Application automatique du gagnant',
      'Historique des tests',
    ],
    useCases: [
      'Optimisation objets email',
      'Test messages chatbot',
      'Comparaison visuels',
      'Landing pages',
    ],
    dataSource: 'Workflow A/B + Stats',
    updateFrequency: 'Continu',
  },
  {
    id: 'roi',
    name: 'ROI Dashboard',
    href: '/roi',
    icon: DollarSign,
    category: 'Analytics',
    purpose: 'Vue consolidée du retour sur investissement de toute la plateforme. Combien coûte-t-elle ? Combien rapporte-t-elle ? Le ROI justifie l\'investissement auprès de la direction.',
    interpretation: [
      '**ROI Global** : (Gains - Coûts) / Coûts × 100. >200% = excellent investissement.',
      '**Gains par catégorie** : Temps économisé, revenus additionnels, coûts évités.',
      '**ROI par agent** : Identifiez les agents les plus rentables vs ceux à optimiser.',
      '**Projection annuelle** : ROI projeté sur 12 mois avec tendance actuelle.',
    ],
    roiMetrics: {
      value: '347% ROI annualisé (projection)',
      description: 'Pour chaque XPF investi dans la plateforme, vous en récupérez 3.47 en valeur (temps économisé + revenus générés + coûts évités).',
      calculation: '(Économies temps + Revenus additionnels + Coûts évités) / Coût plateforme',
    },
    keyFeatures: [
      'Calcul ROI automatique',
      'Détail par agent',
      'Projections',
      'Comparaison périodes',
    ],
    useCases: [
      'Justification investissement',
      'Reporting direction',
      'Optimisation ressources',
      'Benchmark interne',
    ],
    dataSource: 'Agrégation de tous les gains mesurables',
    updateFrequency: 'Temps réel',
  },
  // CONFIGURATION
  {
    id: 'upsell',
    name: 'Upsell Engine',
    href: '/upsell',
    icon: Sparkles,
    category: 'Configuration',
    purpose: 'Configuration des règles d\'upsell automatique. Après une réservation, proposez des surclassements, bagages additionnels, assurances... de façon personnalisée.',
    interpretation: [
      '**Règles actives** : Nombre de règles d\'upsell configurées. Plus de règles = plus d\'opportunités.',
      '**Taux de conversion upsell** : % de clients qui acceptent une offre. >10% = excellent.',
      '**Revenu additionnel** : Somme générée par les upsells. C\'est du revenu quasi-gratuit.',
    ],
    roiMetrics: {
      value: '+12% de revenus additionnels par client',
      description: 'Un client qui a déjà réservé est 5x plus susceptible d\'acheter un extra qu\'un nouveau prospect.',
      calculation: 'Revenu moyen upsell / Revenu moyen réservation = +12%',
    },
    keyFeatures: [
      'Règles conditionnelles',
      'Personnalisation par segment',
      'Timing optimisé',
      'Analytics détaillés',
    ],
    useCases: [
      'Surclassement classe',
      'Bagages additionnels',
      'Assurance voyage',
      'Services lounge',
    ],
    dataSource: 'Configuration locale + API réservation',
    updateFrequency: 'Selon modifications',
    dependencies: ['Catalogue offres upsell', 'Règles métier'],
  },
  {
    id: 'pricing-monitor',
    name: 'Prix Concurrents',
    href: '/pricing-monitor',
    icon: CreditCard,
    category: 'Configuration',
    purpose: 'Configuration de la veille tarifaire. Définissez quelles routes surveiller, quels concurrents, et les seuils d\'alerte.',
    interpretation: [
      '**Routes surveillées** : Liste des liaisons monitorées. Ajoutez vos routes prioritaires.',
      '**Concurrents** : Qui surveiller sur chaque route.',
      '**Seuils d\'alerte** : À partir de quel écart de prix déclencher une alerte.',
    ],
    roiMetrics: {
      value: 'Compétitivité maintenue',
      description: 'Surveiller les bons concurrents sur les bonnes routes = ne jamais être dépassé sans le savoir.',
      calculation: 'Parts de marché préservées',
    },
    keyFeatures: [
      'Configuration routes',
      'Sélection concurrents',
      'Seuils personnalisables',
      'Fréquence monitoring',
    ],
    useCases: [
      'Setup initial monitoring',
      'Ajout nouvelles routes',
      'Ajustement seuils',
      'Maintenance',
    ],
    dataSource: 'Configuration Build 20',
    updateFrequency: 'Configuration manuelle',
  },
  {
    id: 'settings',
    name: 'Paramètres',
    href: '/settings',
    icon: Settings,
    category: 'Configuration',
    purpose: 'Configuration générale du dashboard : thème, notifications, destinataires des rapports, connexions API...',
    interpretation: [
      '**Thème** : Mode clair/sombre selon préférence.',
      '**Notifications** : Quelles alertes recevoir et par quel canal (email, SMS, push).',
      '**Connexions** : Status des API connectées. Vert = OK, Rouge = à reconnecter.',
    ],
    roiMetrics: {
      value: 'Personnalisation',
      description: 'Un outil configuré selon vos préférences = adoption plus rapide et usage plus efficace.',
      calculation: 'Satisfaction utilisateur',
    },
    keyFeatures: [
      'Thème visuel',
      'Préférences notifications',
      'Gestion équipe',
      'Connexions API',
    ],
    useCases: [
      'Personnalisation interface',
      'Configuration alertes',
      'Gestion accès',
      'Maintenance connexions',
    ],
    dataSource: 'LocalStorage + Supabase',
    updateFrequency: 'Manuel',
  },
]

// Grouper par catégorie
const categories = Array.from(new Set(sidebarGuideData.map(item => item.category)))

interface SidebarGuideProps {
  isOpen: boolean
  onClose: () => void
  autoPlay?: boolean
}

export default function SidebarGuide({ isOpen, onClose, autoPlay = false }: SidebarGuideProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [visitedItems, setVisitedItems] = useState<string[]>([])
  const router = useRouter()
  const pathname = usePathname()

  const currentItem = sidebarGuideData[currentIndex]

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !isOpen) return

    const timer = setInterval(() => {
      if (currentIndex < sidebarGuideData.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }, 15000) // 15 seconds per item

    return () => clearInterval(timer)
  }, [isPlaying, currentIndex, isOpen])

  // Track visited items
  useEffect(() => {
    if (currentItem && !visitedItems.includes(currentItem.id)) {
      setVisitedItems(prev => [...prev, currentItem.id])
    }
  }, [currentItem, visitedItems])

  // Navigation
  const goToNext = useCallback(() => {
    if (currentIndex < sidebarGuideData.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex])

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  const goToItem = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsPlaying(false)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goToNext, goToPrev, onClose])

  // Navigate to page
  const navigateToPage = () => {
    router.push(currentItem.href)
    onClose()
  }

  if (!isOpen) return null

  const progress = ((currentIndex + 1) / sidebarGuideData.length) * 100
  const Icon = currentItem.icon

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header with progress */}
        <div className="relative">
          {/* Progress bar */}
          <div className="h-1 bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-atn-primary to-atn-secondary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header content */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-atn-primary to-atn-secondary flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Guide Interactif</h2>
                <p className="text-sm text-slate-500">
                  {currentIndex + 1} / {sidebarGuideData.length} • {currentItem.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title={isPlaying ? 'Pause' : 'Lecture automatique'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-slate-600" />
                ) : (
                  <Play className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title section */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-atn-primary/20 to-atn-secondary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-8 h-8 text-atn-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold text-slate-900">{currentItem.name}</h3>
                  <span className="text-sm px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                    {currentItem.href}
                  </span>
                </div>
                <p className="text-slate-600">{currentItem.purpose}</p>
              </div>
            </div>

            {/* ROI Highlight */}
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-emerald-800">ROI de cet onglet</h4>
                    <span className="text-lg font-bold text-emerald-600">{currentItem.roiMetrics.value}</span>
                  </div>
                  <p className="text-sm text-emerald-700 mb-2">{currentItem.roiMetrics.description}</p>
                  {currentItem.roiMetrics.calculation && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-100/50 px-3 py-1.5 rounded-lg inline-flex">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Calcul : {currentItem.roiMetrics.calculation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* How to interpret */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-atn-primary" />
                Comment interpréter cet onglet
              </h4>
              <div className="space-y-2">
                {currentItem.interpretation.map((item, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-atn-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-atn-primary">{index + 1}</span>
                    </div>
                    <p
                      className="text-sm text-slate-700 flex-1"
                      dangerouslySetInnerHTML={{
                        __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Two columns: Features & Use Cases */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Key Features */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Fonctionnalités clés
                </h4>
                <ul className="space-y-2">
                  {currentItem.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Cas d'usage
                </h4>
                <ul className="space-y-2">
                  {currentItem.useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-purple-700">
                      <ArrowRight className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technical info */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm">
                <Bot className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">Source : {currentItem.dataSource}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">MAJ : {currentItem.updateFrequency}</span>
              </div>
            </div>

            {/* Dependencies warning */}
            {currentItem.dependencies && currentItem.dependencies.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Prérequis à fournir
                </h4>
                <ul className="space-y-1">
                  {currentItem.dependencies.map((dep, index) => (
                    <li key={index} className="text-sm text-amber-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {dep}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center justify-between">
            {/* Prev */}
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>

            {/* Dots / Quick nav */}
            <div className="flex items-center gap-1 max-w-md overflow-x-auto py-1">
              {sidebarGuideData.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => goToItem(index)}
                  className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${
                    index === currentIndex
                      ? 'w-6 bg-atn-primary'
                      : visitedItems.includes(item.id)
                      ? 'bg-emerald-400'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={item.name}
                />
              ))}
            </div>

            {/* Next / Go to page */}
            <div className="flex items-center gap-2">
              <button
                onClick={navigateToPage}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-atn-primary hover:bg-atn-primary/10 rounded-lg transition-colors"
              >
                Voir la page
                <ArrowRight className="w-4 h-4" />
              </button>

              {currentIndex < sidebarGuideData.length - 1 ? (
                <button
                  onClick={goToNext}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-atn-primary to-atn-secondary rounded-lg hover:opacity-90 transition-colors"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Terminer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
