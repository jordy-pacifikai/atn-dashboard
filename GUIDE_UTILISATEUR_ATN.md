# Guide Utilisateur - Dashboard Air Tahiti Nui

## Introduction

Bienvenue sur le Dashboard Air Tahiti Nui, votre centre de commande intelligent pour piloter toutes les opérations marketing, commerciales et service client de la compagnie.

**Ce que ce dashboard vous permet de faire:**
- Suivre la performance de toutes les routes en temps réel
- Gérer vos newsletters et contenus SEO
- Surveiller et répondre aux avis clients
- Analyser la concurrence
- Piloter les campagnes d'upsell
- Générer des rapports automatisés

---

## Accès au Dashboard

### Lancement
```
URL: http://localhost:3000
```

Pour démarrer le dashboard (si nécessaire):
```bash
cd "Air Tahiti Nui/dashboard-app"
npm run dev
```

### Structure des Pages

Le dashboard comporte **15 pages** accessibles via le menu latéral:

| Page | URL | Description |
|------|-----|-------------|
| Vue d'ensemble | `/` | KPIs globaux et alertes |
| Calendrier | `/calendar` | Planification éditoriale visuelle |
| Planner | `/planner` | Liste des contenus à venir |
| Newsletters | `/newsletters` | Performance des campagnes email |
| Contenu SEO | `/content` | Articles générés par l'IA |
| ROI | `/roi` | Analyse rentabilité par route |
| Conversations | `/conversations` | Historique chatbot concierge |
| Concurrents | `/competitors` | Veille tarifaire |
| Upsell | `/upsell` | Offres personnalisées |
| Avis | `/reviews` | Gestion des avis clients |
| Social | `/social` | Monitoring réseaux sociaux |
| Vols | `/flights` | Alertes retards/annulations |
| Réservations | `/bookings` | Assistant de réservation |
| Rapports | `/reports` | Génération de rapports |
| Paramètres | `/settings` | Configuration du système |

---

## Page par Page - Guide Complet

---

### 1. Vue d'ensemble (Accueil)

**URL:** `/`

**C'est quoi?**
La page d'accueil qui te donne une vision 360° de la performance ATN en un coup d'oeil.

**Ce que tu vois:**

#### KPIs Principaux (en haut)
- **Passagers transportés** - Nombre total sur 30 jours + évolution vs mois précédent
- **Chiffre d'affaires** - En XPF, avec tendance
- **Taux de remplissage** - Moyenne toutes routes
- **Note moyenne** - Agrégation TripAdvisor + Google
- **Alertes concurrence** - Nombre d'alertes actives nécessitant attention

#### Performance par Route
4 cartes pour les routes principales:
- **PPT-LAX** (Papeete → Los Angeles)
- **PPT-CDG** (Papeete → Paris)
- **PPT-NRT** (Papeete → Tokyo)
- **PPT-AKL** (Papeete → Auckland)

Chaque carte affiche:
- Nombre de passagers
- Revenu généré
- Taux de remplissage (avec barre de progression colorée)
- Comparaison prix vs concurrence

**Codes couleur:**
- 🟢 Vert = En hausse / Bon
- 🔴 Rouge = En baisse / Attention requise
- 🟡 Jaune/Orange = Stable ou warning

#### Performance Newsletters
- Statistiques globales: envoyés, taux d'ouverture, taux de clic, revenus générés
- Top 3 des dernières newsletters avec leurs métriques

#### Avis Récents
- Les 3 derniers avis avec note et sentiment
- Bouton "Répondre" pour les avis négatifs non traités

#### Veille Concurrentielle
- Alertes sur les mouvements tarifaires des concurrents
- Type d'alerte: prix bas, promo flash, nouvelle route

**Actions possibles:**
- Cliquer sur "Rapport complet" pour générer un rapport
- Cliquer sur "Voir toutes" pour accéder aux détails
- Changer la période (7j, 30j, 90j, année)

---

### 2. Calendrier Editorial

**URL:** `/calendar`

**C'est quoi?**
Un calendrier visuel drag & drop pour planifier tes newsletters et articles SEO.

**Comment l'utiliser:**

#### Vue Calendrier
- Vue mensuelle avec navigation ← →
- Les contenus apparaissent sur leur date de publication

**Codes couleur des contenus:**
- 🩷 Rose = Newsletter
- 💜 Violet = Article SEO

#### Interactions
- **Cliquer sur un contenu** → Ouvre le détail avec preview
- **Drag & Drop** → Déplacer un contenu à une autre date
- **Double-clic sur une date vide** → Créer nouveau contenu

#### Modal d'édition
Quand tu cliques sur un contenu:
- Voir le titre et l'extrait
- Modifier avec l'IA (bouton "Modifier avec IA")
- Changer le statut (Brouillon → Approuvé → Programmé)
- Reprogrammer la date

**Workflow typique:**
1. L'IA génère des suggestions de contenus
2. Tu les places dans le calendrier
3. Tu valides/modifies
4. Tu approuves pour publication

---

### 3. Content Planner

**URL:** `/planner`

**C'est quoi?**
La liste de tous les contenus à venir sur les 30 prochains jours, avec gestion des statuts.

**Ce que tu vois:**
- Liste chronologique des contenus programmés
- Badge "J-X" indiquant les jours avant publication
- Score SEO et score d'engagement prévu
- Badge "IA" si généré automatiquement

**Statuts disponibles:**
1. 💡 **Idée** - Suggestion non validée
2. 📝 **Brouillon** - En cours de rédaction
3. 👁️ **En revue** - À valider par un responsable
4. ✅ **Approuvé** - Prêt pour publication
5. 📅 **Programmé** - Date de publication fixée
6. ✔️ **Publié** - Déjà en ligne

**Actions:**
- Cliquer sur un contenu pour l'éditer
- Changer le statut via le dropdown
- Utiliser le prompt IA pour modifier le contenu

---

### 4. Newsletters

**URL:** `/newsletters`

**C'est quoi?**
L'historique complet de toutes tes campagnes email avec leurs performances.

**Métriques affichées pour chaque newsletter:**
- **Envoyés** - Nombre de destinataires
- **Taux d'ouverture** - % qui ont ouvert l'email
- **Taux de clic** - % qui ont cliqué sur un lien
- **Conversions** - Nombre de réservations générées
- **Revenus** - CA attribué à cette newsletter
- **Score personnalisation** - Niveau de personnalisation IA (0-100)

**Filtres disponibles:**
- Par statut: Envoyé / Brouillon / Programmé
- Par segment: Famille / Lune de miel / Plongeurs / Business
- Par période

**Statistiques globales (en haut):**
- Total emails envoyés
- Taux d'ouverture moyen
- Taux de clic moyen
- Revenus totaux générés

---

### 5. Content Factory SEO+GEO

**URL:** `/content`

**C'est quoi?**
Tous les articles de blog optimisés pour le référencement, générés par l'IA.

**Pour chaque article:**
- **Score SEO** (0-100) - Optimisation mots-clés, structure
- **Score GEO** (0-100) - Optimisation géographique pour les recherches locales
- **Compteur de mots** - Longueur de l'article
- **Image** - Générée par IA (Fal.ai)
- **Catégorie** - Destinations / Activités / Guides / Actualités

**Workflow de publication:**
1. L'IA génère l'article chaque lundi à 9h
2. Tu valides le contenu
3. Tu approuves pour publication
4. L'article est publié sur le blog ATN

**Exemple de sujets générés:**
- "Les 10 meilleures plongées de Rangiroa"
- "Guide complet: Escale à Los Angeles"
- "Pourquoi choisir la Business Class Poerava"

---

### 6. ROI Analyst

**URL:** `/roi`

**C'est quoi?**
L'analyse de rentabilité par route avec détection automatique des anomalies.

**Métriques par route:**
- Revenus (en XPF et tendance)
- Nombre de réservations
- Taux de remplissage
- Ticket moyen
- Comparaison vs période précédente

**Système d'alertes:**
- 🚨 **CRITIQUE** - Baisse > 20%
- ⚠️ **Baisse** - Entre 10% et 20%
- 🟡 **Légère baisse** - Entre 5% et 10%
- ➖ **Stable** - Variation < 5%
- 🟢 **Croissance** - Hausse 5-15%
- 🚀 **Forte croissance** - Hausse > 15%

**Détection d'anomalies:**
L'IA analyse les patterns et te prévient quand:
- Une route performe anormalement bas
- Un concurrent a lancé une promo agressive
- Un événement impacte la demande

**Actions suggérées:**
Pour chaque alerte, l'IA propose des actions:
- "Lancer une promo ciblée sur PPT-CDG"
- "Augmenter le budget pub sur ce segment"
- "Contacter les agences partenaires"

---

### 7. Concierge Conversations

**URL:** `/conversations`

**C'est quoi?**
L'historique de toutes les conversations du chatbot IA avec les clients.

**Informations par conversation:**
- **Session ID** - Identifiant unique
- **Langue** - FR, EN, ES, JP, etc. (chatbot multilingue)
- **Question du client** - Ce qu'il a demandé
- **Réponse de l'IA** - Ce que le bot a répondu
- **Temps de réponse** - En secondes
- **Tokens utilisés** - Consommation API
- **Score satisfaction** - Si le client a noté

**Catégories de conversations:**
- Réservation
- Information générale
- Réclamation
- Modification
- Annulation

**Utilité:**
- Identifier les questions fréquentes non couvertes
- Améliorer les réponses du bot
- Détecter les clients mécontents à recontacter

---

### 8. Competitor Intelligence

**URL:** `/competitors`

**C'est quoi?**
La veille concurrentielle automatisée sur les prix et promotions.

**Concurrents surveillés:**
- Air France (PPT-CDG)
- United Airlines (PPT-LAX)
- Hawaiian Airlines
- LATAM
- Qantas

**Types d'alertes:**
- 📉 **Prix inférieur** - Concurrent moins cher que nous
- 🔥 **Nouvelle promo** - Offre flash détectée
- ✈️ **Nouvelle route** - Concurrent lance une nouvelle liaison
- ⏰ **Changement horaire** - Modification de fréquence

**Pour chaque alerte:**
- Prix concurrent vs notre prix
- Écart en % et en XPF
- Route concernée
- Recommandation IA (ex: "Aligner les prix" ou "Lancer contre-promo")

**Priorités:**
- 🔴 Urgente - Action immédiate requise
- 🟠 Haute - Dans les 24h
- 🟡 Moyenne - Cette semaine
- ⚪ Basse - À surveiller

---

### 9. Upsell Engine

**URL:** `/upsell`

**C'est quoi?**
Le moteur d'upsell qui génère des offres personnalisées pour augmenter le panier moyen.

**Types d'offres générées:**
- 💺 Upgrade classe (Economy → Premium → Business)
- 🧳 Bagage supplémentaire
- 🛋️ Accès lounge
- 💎 Siège premium (hublot, espace jambes)
- 🛡️ Assurance voyage
- 🏝️ Pack excursion

**Métriques:**
- **Taux d'envoi** - % de clients contactés
- **Taux d'ouverture** - % qui ont vu l'offre
- **Taux de conversion** - % qui ont acheté
- **Revenu généré** - CA additionnel

**Statuts des offres:**
1. Envoyé - Email/SMS parti
2. Ouvert - Client a vu
3. Cliqué - Client intéressé
4. Converti - Achat effectué
5. Ignoré - Pas de réponse

**Personnalisation:**
L'IA adapte l'offre selon:
- Segment client (Famille, Lune de miel, Business, Plongeurs)
- Valeur du booking initial
- Historique d'achats
- Route choisie

---

### 10. Avis Clients

**URL:** `/reviews`

**C'est quoi?**
La gestion centralisée de tous les avis clients avec réponses générées par IA.

**Plateformes agrégées:**
- TripAdvisor
- Google Reviews
- Trustpilot
- Facebook
- Skytrax

**Pour chaque avis:**
- **Note** - 1 à 5 étoiles
- **Auteur** - Nom du client
- **Texte** - Contenu de l'avis
- **Sentiment** - Positif / Neutre / Négatif (analysé par IA)
- **Sujets mentionnés** - Service, Confort, Repas, Ponctualité, etc.
- **Réponse suggérée** - Générée par l'IA

**Workflow de traitement:**
1. Avis reçu → Statut "À valider"
2. Tu lis l'avis et la réponse IA suggérée
3. Tu modifies si nécessaire
4. Tu approuves → Statut "Approuvé"
5. La réponse est publiée → Statut "Publié"

**Tons de réponse disponibles:**
- 💗 Empathique (pour réclamations)
- 💼 Professionnel (réponse standard)
- 🙏 Reconnaissant (pour avis positifs)

**Priorité automatique:**
- Avis négatifs (1-2 étoiles) = Haute priorité
- Avis neutres (3 étoiles) = Moyenne
- Avis positifs (4-5 étoiles) = Basse

---

### 11. Social Monitor

**URL:** `/social`

**C'est quoi?**
La surveillance en temps réel des mentions ATN sur les réseaux sociaux.

**Plateformes surveillées:**
- Twitter/X
- Instagram
- Facebook
- TikTok
- LinkedIn

**Pour chaque mention:**
- **Auteur** - Compte qui a posté
- **Contenu** - Texte du post
- **Sentiment** - Positif / Neutre / Négatif
- **Score sentiment** - De -100 à +100
- **Reach** - Portée estimée (followers de l'auteur)
- **Priorité** - Haute / Moyenne / Basse

**Détection automatique:**
L'IA détecte:
- Mentions directes (@AirTahitiNui)
- Hashtags (#AirTahitiNui, #ATN)
- Mentions indirectes ("vol Air Tahiti", "compagnie tahitienne")

**Actions:**
- Voir la suggestion de réponse IA
- Marquer comme traité
- Escalader (si crise)
- Ignorer (spam, non pertinent)

**Alertes critiques:**
Notification immédiate si:
- Sentiment très négatif + reach élevé
- Mot-clé sensible détecté (crash, arnaque, scandale)
- Volume anormal de mentions

---

### 12. Flight Notifier

**URL:** `/flights`

**C'est quoi?**
Le système d'alertes automatiques pour les retards et perturbations de vols.

**Types d'alertes:**
- ⏰ **Retard** - Vol décalé (avec durée)
- ❌ **Annulation** - Vol supprimé
- 🚪 **Changement de porte** - Nouvelle porte d'embarquement
- 📅 **Changement horaire** - Nouvel horaire

**Pour chaque alerte:**
- Numéro de vol
- Route concernée
- Type d'alerte
- Durée du retard (si applicable)
- Nombre de passagers impactés
- Nombre de notifications envoyées

**Canaux de notification:**
- 📱 SMS
- 📧 Email
- 🔔 Push notification app
- 💬 WhatsApp

**Statuts:**
- ✅ Envoyé - Tous les passagers notifiés
- 🔄 En cours - Envoi en progression
- ❌ Échec - Problème technique

**Tableau de bord temps réel:**
- Indicateur vert = Surveillance active
- Liste des vols du jour avec statut

---

### 13. Booking Assistant

**URL:** `/bookings`

**C'est quoi?**
L'historique des demandes de réservation traitées par l'IA.

**Types de demandes:**
- 🎫 Nouvelle réservation
- ✏️ Modification
- ❌ Annulation
- ℹ️ Demande d'information

**Pour chaque demande:**
- Session ID
- Route demandée
- Classe (Poerava Business / Moana Premium / Moana Economy)
- Nombre de passagers
- Demande originale (texte client)
- Réponse de l'IA
- Statut (Traité / En attente / Échec)

**Statistiques:**
- Taux de traitement automatique
- Temps moyen de réponse
- Taux de satisfaction

---

### 14. Reports

**URL:** `/reports`

**C'est quoi?**
La génération de rapports automatisés ou personnalisés.

**Templates de rapports prédéfinis:**
1. 📊 **Daily Summary** - Résumé quotidien
2. 📈 **Weekly Marketing** - Performance marketing hebdo
3. 💰 **ROI Analysis** - Analyse rentabilité
4. 😊 **Customer Satisfaction** - Satisfaction client
5. 🎁 **Upsell Performance** - Performance upsell
6. 🎯 **Competitor Intel** - Veille concurrentielle
7. ✈️ **Flight Operations** - Opérations vols
8. 📝 **Content SEO** - Performance SEO

**Rapport personnalisé:**
Tu peux demander un rapport sur mesure en écrivant un prompt:
> "Génère un rapport sur la performance de la route PPT-LAX comparée à l'année dernière, avec focus sur le segment Business"

**Options:**
- Période (jour, semaine, mois, custom)
- Format d'export (PDF, Excel)
- Programmation récurrente

**Historique:**
Tous les rapports générés sont conservés et téléchargeables.

---

### 15. Settings

**URL:** `/settings`

**C'est quoi?**
La configuration du dashboard et des systèmes automatisés.

**Sections:**

#### Smart Generator
- Fréquence de génération (quotidien, hebdo)
- Quantité de contenus par batch
- Avance de planification (combien de jours à l'avance)

#### Seuils d'anomalies
- À partir de quel % de baisse déclencher une alerte ROI
- Seuils de sentiment pour alertes social media
- Seuils de prix pour alertes concurrence

#### Clés API
- Airtable API Key
- Supabase credentials
- Configuration des webhooks n8n

#### Notifications
- Email de réception des alertes
- Activation/désactivation par type
- Fréquence des digests

#### Préférences
- Fuseau horaire (Pacific/Tahiti)
- Langue de l'interface
- Format des nombres et devises

---

## L'Assistant IA (Chat Widget)

En bas à droite de chaque page, tu as accès à l'assistant IA.

**Ce qu'il peut faire:**
- Répondre à tes questions sur les données
- Générer du contenu à la demande
- Expliquer les métriques
- Suggérer des actions

**Exemples de questions:**
- "Quelle route performe le mieux ce mois-ci?"
- "Génère un email de promo pour la Saint-Valentin"
- "Pourquoi le taux de remplissage PPT-CDG a baissé?"
- "Quels concurrents ont lancé des promos cette semaine?"

**Actions rapides disponibles:**
- Générer une newsletter
- Créer un rapport
- Analyser une route
- Vérifier les alertes

---

## Les 15 Workflows n8n

Le dashboard est alimenté par 15 workflows automatisés:

| # | Workflow | Ce qu'il fait | Fréquence |
|---|----------|---------------|-----------|
| 1 | Concierge IA | Répond aux clients en 7 langues | Temps réel |
| 2 | Newsletter Generator | Crée des newsletters personnalisées | Sur demande |
| 3 | SEO Content Factory | Génère des articles de blog | Lundi 9h |
| 4 | ROI Analyst | Analyse les KPIs et détecte anomalies | Tous les jours 8h |
| 5 | Booking Assistant | Traite les demandes de réservation | Temps réel |
| 6 | Social Monitor | Surveille les réseaux sociaux | Toutes les 15 min |
| 7 | Competitor Intel | Scrape les prix concurrents | Toutes les 6h |
| 8 | Flight Notifier | Envoie les alertes vols | Temps réel |
| 9 | Review Responder | Génère des réponses aux avis | Temps réel |
| 10 | Upsell Engine | Envoie des offres personnalisées | Après chaque réservation |
| 11 | Dashboard API | Alimente le dashboard en données | Continu |
| 12 | Content Scheduler | Publie les contenus programmés | Selon planning |
| 13 | AI Assistant | Répond aux questions dans le chat | Temps réel |
| 14 | Report Generator | Génère les rapports demandés | Sur demande |
| 15 | Smart Generator | Génère des suggestions de contenus | Selon config |

---

## Données Airtable

Toutes les données sont stockées dans Airtable (base `appWd0x5YZPHKL0VK`).

**Tables principales:**

| Table | Contenu |
|-------|---------|
| Contacts | Liste des abonnés newsletter |
| Newsletter_Logs | Historique des emails envoyés |
| Concierge_Logs | Conversations chatbot |
| SEO_Content | Articles générés |
| ROI_Alerts | Alertes performance |
| Dashboard | KPIs agrégés |
| Booking_Logs | Demandes de réservation |
| Flight_Alerts | Alertes vols |
| Upsell_Offers | Offres d'upsell |
| Social_Mentions | Mentions réseaux sociaux |
| Competitor_Intel | Veille concurrentielle |
| Reviews | Avis clients |
| Content_Calendar | Calendrier éditorial |
| Chat_Sessions | Sessions assistant IA |
| Reports_Queue | File d'attente rapports |
| Prompt_Templates | Templates de prompts IA |
| Content_Config | Configuration Smart Generator |
| Backlog | Tâches à faire |

---

## Bonnes Pratiques

### Routine quotidienne recommandée

**Matin (5 min):**
1. Ouvrir la Vue d'ensemble
2. Checker les alertes concurrence
3. Voir les avis négatifs à traiter
4. Vérifier les alertes vols du jour

**Hebdomadaire (30 min):**
1. Valider les contenus du calendrier éditorial
2. Approuver les newsletters programmées
3. Générer le rapport Weekly Marketing
4. Analyser les performances par route

**Mensuel (1h):**
1. Analyse ROI approfondie
2. Ajuster les seuils si nécessaire
3. Revoir les prompts IA
4. Planifier le mois suivant dans le calendrier

### Tips & Astuces

1. **Utilise les filtres** - Chaque page a des filtres pour affiner les données
2. **Fais confiance à l'IA** - Les suggestions sont généralement bonnes, modifie à la marge
3. **Traite les négatifs en priorité** - Un avis négatif non traité = mauvaise image
4. **Checke la concurrence** - Les alertes prix sont cruciales pour rester compétitif
5. **Personnalise les prompts** - Dans Settings, tu peux ajuster le ton des réponses IA

---

## Dépannage

### Le dashboard ne charge pas
```bash
# Relancer le serveur
cd "Air Tahiti Nui/dashboard-app"
npm run dev
```

### Les données ne s'affichent pas
- Vérifier que le fichier `.env.local` contient les bonnes clés API
- Vérifier la connexion internet
- Regarder la console du navigateur (F12) pour les erreurs

### L'assistant IA ne répond pas
- Vérifier que `ANTHROPIC_API_KEY` est configurée
- L'API Claude peut avoir des limites de rate

### Les workflows n8n ne fonctionnent pas
- Accéder à n8n: https://n8n.srv1140766.hstgr.cloud
- Vérifier que les workflows sont activés
- Checker les logs d'exécution

---

## Contacts Support

**Technique:** jordy@pacifikai.com
**Documentation:** Ce fichier + `DASHBOARD_PRESENTATION.html`

---

*Guide créé le 28 janvier 2026 - PACIFIK'AI*
