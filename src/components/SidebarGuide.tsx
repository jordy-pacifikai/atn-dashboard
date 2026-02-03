'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  X, ChevronLeft, ChevronRight, Play, Pause,
  DollarSign, CheckCircle, Lightbulb, Target, ArrowRight,
  Clock, Database, AlertTriangle
} from 'lucide-react'

// Types
interface GuideStep {
  selector: string
  name: string
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

// Guide steps data - FULL DETAILS
const guideSteps: GuideStep[] = [
  // ============ ACCUEIL ============
  {
    selector: '[data-sidebar-guide="dashboard"]',
    name: 'Dashboard',
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
    selector: '[data-sidebar-guide="demo-site"]',
    name: 'Demo Site',
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
  // ============ AGENTS IA ============
  {
    selector: '[data-sidebar-guide="chatbot-tiare"]',
    name: 'Chatbot Tiare',
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
      'Support 24/7 multilingue (FR/EN/ES)',
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
    selector: '[data-sidebar-guide="concierge-pro"]',
    name: 'Concierge Pro',
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
      'Historique voyageur complet',
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
    selector: '[data-sidebar-guide="staff-assistant"]',
    name: 'Staff Assistant',
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
      'Base de connaissances interne vectorisée',
      'Recherche documentaire IA',
      'Historique des questions',
      'Suggestions proactives',
    ],
    useCases: [
      'Onboarding nouveaux employés',
      'Rappel procédures',
      'Recherche tarifaire rapide',
      'FAQ interne',
    ],
    dataSource: 'Documents internes ATN vectorisés',
    updateFrequency: 'Mise à jour à chaque ajout de documentation',
    dependencies: ['Manuels de procédures', 'Politiques RH', 'Guidelines marque'],
  },
  // ============ MARKETING AUTOMATISE ============
  {
    selector: '[data-sidebar-guide="newsletters"]',
    name: 'Newsletters',
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
      'Personnalisation par segment client',
      'Génération contenu IA automatique',
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
    selector: '[data-sidebar-guide="contenu-seo"]',
    name: 'Contenu SEO',
    category: 'Marketing Automatisé',
    purpose: 'Génération automatique d\'articles de blog optimisés SEO. L\'IA écrit des articles sur vos destinations, conseils voyage, actualités, qui attirent du trafic organique depuis Google. Plus d\'articles = plus de visibilité = plus de réservations.',
    interpretation: [
      '**Score SEO** : Note 0-100 basée sur mots-clés, structure, longueur. >80 = excellent ranking potentiel.',
      '**Score GEO** : Optimisation pour Google Discover et featured snippets.',
      '**Statut publication** : Brouillon (à relire) → Planifié (date prévue) → Publié (live).',
      '**Trafic généré** : Combien de visiteurs chaque article attire depuis Google.',
    ],
    roiMetrics: {
      value: '+45% trafic organique (sur 6 mois)',
      description: 'Publier 4 articles/mois pendant 6 mois crée un actif SEO durable. Ce trafic est "gratuit" contrairement aux pubs payantes.',
      calculation: 'Coût acquisition client organique vs payant = économie massive',
    },
    keyFeatures: [
      'Génération articles IA complète',
      'Optimisation SEO automatique',
      'Planification éditoriale',
      'Analyse de performance par article',
    ],
    useCases: [
      'Guides de destination détaillés',
      'Conseils de voyage pratiques',
      'Actualités compagnie',
      'FAQ enrichies pour le SEO',
    ],
    dataSource: 'Table SEO_Content + Google Search Console',
    updateFrequency: 'Publication selon calendrier éditorial',
    dependencies: ['Accès Google Search Console'],
  },
  {
    selector: '[data-sidebar-guide="social-media"]',
    name: 'Social Media',
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
      'Génération multi-plateforme adaptée',
      'Hashtags optimisés par IA',
      'Planification automatique',
      'Analyse des tendances',
    ],
    useCases: [
      'Posts promotionnels',
      'Contenu inspirationnel destinations',
      'User-generated content',
      'Actualités compagnie',
    ],
    dataSource: 'API Meta Business Suite',
    updateFrequency: 'Selon planning social défini',
    dependencies: ['Accès Meta Business Suite'],
  },
  {
    selector: '[data-sidebar-guide="visual-factory"]',
    name: 'Visual Factory',
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
      'Respect charte graphique ATN',
      'Multi-formats automatiques',
      'Bibliothèque d\'assets centralisée',
    ],
    useCases: [
      'Visuels campagnes email',
      'Posts réseaux sociaux',
      'Bannières promotionnelles',
      'Illustrations articles blog',
    ],
    dataSource: 'API Fal.ai + Claude Vision',
    updateFrequency: 'À la demande',
  },
  // ============ INTELLIGENCE ============
  {
    selector: '[data-sidebar-guide="veille-concurrence"]',
    name: 'Veille Concurrence',
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
      'Alertes multi-canaux (email, Slack)',
      'Historique des prix complet',
      'Analyse des tendances tarifaires',
    ],
    useCases: [
      'Ajustement tarifaire réactif',
      'Promos défensives ciblées',
      'Intelligence concurrentielle',
      'Reporting direction',
    ],
    dataSource: 'Scraping sites concurrents (French Bee, Hawaiian, LATAM)',
    updateFrequency: 'Quotidien à 6h',
  },
  {
    selector: '[data-sidebar-guide="gestion-avis"]',
    name: 'Gestion Avis',
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
      'Réponses IA personnalisées par ton',
      'Analyse de sentiment automatique',
      'Workflow d\'approbation si besoin',
    ],
    useCases: [
      'Réponse aux avis positifs (remercier)',
      'Gestion de crise (avis négatifs)',
      'Identification tendances récurrentes',
      'Amélioration continue service',
    ],
    dataSource: 'API Google Business Profile + TripAdvisor',
    updateFrequency: 'Temps réel',
    dependencies: ['Accès Google Business Profile', 'Accès TripAdvisor Manager'],
  },
  {
    selector: '[data-sidebar-guide="review-intelligence"]',
    name: 'Review Intelligence',
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
      'Clustering thématique automatique',
      'Analyse de tendances temporelles',
      'Alertes proactives sur anomalies',
    ],
    useCases: [
      'Amélioration produit/service ciblée',
      'Formation du personnel sur points faibles',
      'Prévention de crise réputation',
      'Reporting qualité à la direction',
    ],
    dataSource: 'Workflow Build 16 - Review Intelligence',
    updateFrequency: 'Analyse quotidienne',
  },
  {
    selector: '[data-sidebar-guide="lead-scoring"]',
    name: 'Lead Scoring',
    category: 'Intelligence',
    purpose: 'Attribution automatique d\'un score de 0-100 à chaque prospect selon sa probabilité d\'achat. Priorisez vos efforts commerciaux sur les leads les plus chauds.',
    interpretation: [
      '**Score 80-100** : Lead très chaud. Contacter aujourd\'hui. Forte intention d\'achat détectée.',
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
      'Scoring comportemental multi-critères',
      'Mise à jour temps réel du score',
      'Critères personnalisables par ATN',
      'Intégration CRM automatique',
    ],
    useCases: [
      'Priorisation commerciale quotidienne',
      'Automatisation nurturing par score',
      'Segmentation dynamique des prospects',
      'Allocation ressources commerciales',
    ],
    dataSource: 'Comportement site + CRM + Email tracking',
    updateFrequency: 'Temps réel',
  },
  // ============ OPERATIONS ============
  {
    selector: '[data-sidebar-guide="vols"]',
    name: 'Vols',
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
      'Statut temps réel de tous les vols',
      'Alertes automatiques multi-canaux',
      'Historique des perturbations',
      'Intégration communications passagers',
    ],
    useCases: [
      'Promos flash sur vols vides (<70%)',
      'Communication retards proactive',
      'Coordination équipes sol/marketing',
      'Reporting opérationnel',
    ],
    dataSource: 'API GDS (Amadeus/Sabre)',
    updateFrequency: 'Temps réel',
    dependencies: ['Accès API système de réservation'],
  },
  {
    selector: '[data-sidebar-guide="réservations"]',
    name: 'Réservations',
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
      'Vue unifiée de toutes les demandes',
      'Priorisation automatique par urgence',
      'Historique client complet',
      'Templates de réponse pré-configurés',
    ],
    useCases: [
      'Traitement modifications rapide',
      'Gestion annulations',
      'Support client centralisé',
      'Suivi SLA équipe',
    ],
    dataSource: 'Formulaires site + emails entrants',
    updateFrequency: 'Temps réel',
  },
  {
    selector: '[data-sidebar-guide="calendrier"]',
    name: 'Calendrier',
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
      'Drag & drop pour réorganiser',
      'Intégration workflows automatiques',
      'Partage équipe en temps réel',
    ],
    useCases: [
      'Planification campagnes marketing',
      'Coordination équipes créa/marketing',
      'Anticipation saisonnalité',
      'Reporting activité éditoriale',
    ],
    dataSource: 'Table Content_Calendar Airtable',
    updateFrequency: 'Temps réel',
  },
  {
    selector: '[data-sidebar-guide="parcours-client"]',
    name: 'Parcours Client',
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
      'Séquences multi-étapes automatisées',
      'Déclencheurs événementiels (résa, vol, etc.)',
      'Personnalisation dynamique par client',
      'Analytics détaillés par étape',
    ],
    useCases: [
      'Onboarding post-réservation',
      'Préparation voyage (J-7, J-1)',
      'Suivi satisfaction (J+1)',
      'Réengagement (J+30, J+90)',
    ],
    dataSource: 'Workflows n8n Build 21-25',
    updateFrequency: 'Événementiel',
  },
  // ============ ANALYTICS ============
  {
    selector: '[data-sidebar-guide="rapports"]',
    name: 'Rapports',
    category: 'Analytics',
    purpose: 'Génération automatique de rapports hebdomadaires et mensuels. Plus besoin de compiler les stats à la main. Le rapport arrive dans votre boîte chaque lundi matin.',
    interpretation: [
      '**Rapport hebdo** : KPIs de la semaine, comparaison semaine précédente, alertes importantes.',
      '**Rapport mensuel** : Vue complète du mois, tendances, recommandations IA.',
      '**Téléchargement** : PDF prêt à partager avec la direction.',
    ],
    roiMetrics: {
      value: '4h/semaine économisées sur le reporting',
      description: 'Compiler un rapport hebdo prenait 4h. Maintenant c\'est automatique. 4h × 52 semaines × coût horaire = économie annuelle significative.',
      calculation: '4h × 52 semaines × 5,000 XPF/h = 1,040,000 XPF/an',
    },
    keyFeatures: [
      'Génération automatique sans intervention',
      'Export PDF professionnel',
      'Envoi programmé par email',
      'Personnalisation contenu par destinataire',
    ],
    useCases: [
      'Reporting direction hebdomadaire',
      'Suivi KPIs équipe marketing',
      'Analyse tendances mensuelles',
      'Justification investissements',
    ],
    dataSource: 'Workflow Build 7 + Supabase storage',
    updateFrequency: 'Hebdomadaire (lundi 8h) + Mensuel (1er du mois)',
  },
  {
    selector: '[data-sidebar-guide="attribution"]',
    name: 'Attribution',
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
      'Multi-touch attribution complète',
      'Comparaison modèles côte à côte',
      'ROI par canal détaillé',
      'Recommandations budget automatiques',
    ],
    useCases: [
      'Allocation budget marketing optimal',
      'Justification investissements par canal',
      'Optimisation canaux sous-performants',
      'Reporting CMO avec données fiables',
    ],
    dataSource: 'Google Analytics + CRM',
    updateFrequency: 'Quotidien',
    dependencies: ['Accès Google Analytics'],
  },
  {
    selector: '[data-sidebar-guide="a/b-tests"]',
    name: 'A/B Tests',
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
      'Tests automatisés sans intervention',
      'Calcul confiance statistique en temps réel',
      'Application automatique du gagnant',
      'Historique complet des tests',
    ],
    useCases: [
      'Optimisation objets email',
      'Test messages chatbot',
      'Comparaison visuels marketing',
      'Landing pages conversion',
    ],
    dataSource: 'Workflow A/B + Stats',
    updateFrequency: 'Continu',
  },
  {
    selector: '[data-sidebar-guide="roi-dashboard"]',
    name: 'ROI Dashboard',
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
      'Calcul ROI automatique en temps réel',
      'Détail par agent/workflow',
      'Projections sur 12 mois',
      'Comparaison périodes',
    ],
    useCases: [
      'Justification investissement à la direction',
      'Reporting board mensuel',
      'Optimisation ressources',
      'Benchmark interne entre agents',
    ],
    dataSource: 'Agrégation de tous les gains mesurables',
    updateFrequency: 'Temps réel',
  },
  // ============ CONFIGURATION ============
  {
    selector: '[data-sidebar-guide="upsell-engine"]',
    name: 'Upsell Engine',
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
      'Règles conditionnelles flexibles',
      'Personnalisation par segment client',
      'Timing optimisé (post-résa, J-7, etc.)',
      'Analytics détaillés par offre',
    ],
    useCases: [
      'Surclassement classe (Eco → Business)',
      'Bagages additionnels',
      'Assurance voyage',
      'Services lounge aéroport',
    ],
    dataSource: 'Configuration locale + API réservation',
    updateFrequency: 'Selon modifications',
    dependencies: ['Catalogue offres upsell', 'Règles métier ATN'],
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

    const element = document.querySelector(step.selector) as HTMLElement
    if (!element) {
      console.warn(`Element not found: ${step.selector}`)
      return
    }

    // Scroll the element into view in the sidebar
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Wait for scroll to complete then update positions
    setTimeout(() => {
      const rect = element.getBoundingClientRect()
      const padding = 8

      // Highlight position (with padding)
      setHighlightPosition({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      })

      // Tooltip position (to the right of the element)
      const tooltipWidth = 400
      const viewportHeight = window.innerHeight
      const maxTooltipHeight = Math.min(viewportHeight - 80, 600) // Max 600px or viewport - 80px

      let tooltipLeft = rect.right + 24

      // Center tooltip vertically around the highlighted element, but keep within bounds
      const tooltipTop = Math.max(40, Math.min(rect.top + rect.height / 2 - maxTooltipHeight / 2, viewportHeight - maxTooltipHeight - 40))

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft })
    }, 300)
  }, [step])

  // Update positions when step changes or window resizes
  useEffect(() => {
    if (!isOpen) return

    updatePositions()

    const handleResize = () => updatePositions()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
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
    }, 12000)

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
          fill="rgba(0, 0, 0, 0.8)"
          mask="url(#spotlight-mask)"
          style={{ pointerEvents: 'all' }}
          onClick={onClose}
        />
      </svg>

      {/* Highlight border around element */}
      <div
        className="absolute border-2 border-sky-400 rounded-xl pointer-events-none transition-all duration-500 shadow-[0_0_0_4px_rgba(56,189,248,0.3),0_0_20px_rgba(56,189,248,0.4)]"
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
        className="absolute bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 flex flex-col"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: 400,
          maxHeight: 'min(600px, calc(100vh - 80px))',
        }}
      >
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
          <div>
            <p className="text-[10px] text-sky-600 uppercase tracking-wider font-semibold">{step.category}</p>
            <h3 className="font-bold text-lg text-slate-900">{step.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title={isPlaying ? 'Pause' : 'Lecture auto'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-slate-600" />
              ) : (
                <Play className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content - scrollable area */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Purpose */}
          <p className="text-xs text-slate-700 leading-relaxed">{step.purpose}</p>

          {/* ROI Highlight */}
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-emerald-800">{step.roiMetrics.value}</p>
                <p className="text-xs text-emerald-700 mt-0.5">{step.roiMetrics.description}</p>
                {step.roiMetrics.calculation && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-600 bg-emerald-100/50 px-2 py-1 rounded">
                    <Lightbulb className="w-3 h-3 flex-shrink-0" />
                    <span><strong>Calcul :</strong> {step.roiMetrics.calculation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div>
            <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Comment interpréter les données
            </p>
            <div className="space-y-1.5">
              {step.interpretation.map((item, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                  <div className="w-4 h-4 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-sky-600">{index + 1}</span>
                  </div>
                  <p
                    className="text-xs text-slate-700 flex-1"
                    dangerouslySetInnerHTML={{
                      __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Features & Use Cases */}
          <div className="grid grid-cols-2 gap-2">
            {/* Key Features */}
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-1.5 flex items-center gap-1 text-xs">
                <CheckCircle className="w-3 h-3" />
                Fonctionnalités
              </h4>
              <ul className="space-y-1">
                {step.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-1.5 text-[10px] text-blue-700">
                    <ArrowRight className="w-2.5 h-2.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-purple-800 mb-1.5 flex items-center gap-1 text-xs">
                <Target className="w-3 h-3" />
                Cas d'usage
              </h4>
              <ul className="space-y-1">
                {step.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-1.5 text-[10px] text-purple-700">
                    <ArrowRight className="w-2.5 h-2.5 text-purple-400 flex-shrink-0 mt-0.5" />
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technical info */}
          <div className="flex flex-wrap gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-[10px]">
              <Database className="w-3 h-3 text-slate-500" />
              <span className="text-slate-600">{step.dataSource}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-[10px]">
              <Clock className="w-3 h-3 text-slate-500" />
              <span className="text-slate-600">{step.updateFrequency}</span>
            </div>
          </div>

          {/* Dependencies */}
          {step.dependencies && step.dependencies.length > 0 && (
            <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-1.5 flex items-center gap-1 text-xs">
                <AlertTriangle className="w-3 h-3" />
                Prérequis ATN
              </h4>
              <ul className="space-y-0.5">
                {step.dependencies.map((dep, index) => (
                  <li key={index} className="text-[10px] text-amber-700 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    {dep}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 hover:bg-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Précédent
            </button>

            <span className="text-xs text-slate-500 font-medium">
              {currentStep + 1} / {guideSteps.length}
            </span>

            {currentStep < guideSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg hover:opacity-90 transition-colors shadow-md"
              >
                Suivant
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
              >
                <CheckCircle className="w-3.5 h-3.5" />
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
