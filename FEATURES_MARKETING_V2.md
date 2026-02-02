# Features Marketing V2 - Dashboard ATN

> Logiques métier, workflows marketing et fonctionnalités à ajouter pour un marketeur Air Tahiti Nui

---

## 1. SEGMENTATION CLIENT AVANCÉE

### Problème actuel
Les newsletters sont envoyées par "segments" génériques (tous, fidèles, nouveaux). Un vrai marketeur a besoin de micro-segmentation.

### Features à ajouter

#### 1.1 Segments dynamiques basés sur le comportement
```
- Clients qui ont ouvert 3+ newsletters sans réserver → "Intéressés non-convertis"
- Clients qui ont réservé il y a 6-12 mois → "Réactivation"
- Clients avec panier abandonné → "Relance abandon"
- Clients qui ont cliqué sur Bora Bora 2+ fois → "Intérêt Bora Bora"
- Clients Business qui voyagent 3+/an → "VIP Frequent Flyers"
```

#### 1.2 RFM Scoring (Recency, Frequency, Monetary)
| Score | Recency | Frequency | Monetary |
|-------|---------|-----------|----------|
| 5 | < 30 jours | 5+ vols/an | > 2M XPF |
| 4 | 30-90 jours | 3-4 vols | 1-2M XPF |
| 3 | 90-180 jours | 2 vols | 500K-1M XPF |
| 2 | 180-365 jours | 1 vol | 200-500K XPF |
| 1 | > 365 jours | 0 vol | < 200K XPF |

→ Permet de créer des campagnes ciblées: "Champions (555)", "À risque (115)", "Perdus (111)"

#### 1.3 Lookalike Audiences
- Identifier les caractéristiques des meilleurs clients
- Trouver des prospects similaires dans la base
- "Clients qui ressemblent à nos Business Class réguliers"

---

## 2. AUTOMATION MARKETING (CUSTOMER JOURNEYS)

### Problème actuel
Les emails sont ponctuels. Il manque des séquences automatisées basées sur le parcours client.

### Journeys à implémenter

#### 2.1 Post-Booking Journey
```
J+0: Confirmation de réservation
J+1: Guide destination (généré par IA selon la destination)
J-14: Checklist voyage + offre upgrade
J-7: Rappel enregistrement en ligne
J-3: Météo + suggestions activités
J-1: Rappel horaires + info terminal
J+1 (retour): Demande d'avis + offre fidélité
J+30 (retour): "Prêt pour une nouvelle aventure?"
```

#### 2.2 Abandon Journey
```
H+1: "Vous avez oublié quelque chose?"
H+24: "Votre vol est encore disponible" + prix
H+72: "Dernière chance" + incentive (-5% ou miles bonus)
J+7: "Les prix ont baissé sur votre recherche"
```

#### 2.3 Re-engagement Journey
```
Inactif 3 mois: "Vous nous manquez" + offre personnalisée
Inactif 6 mois: "Que s'est-il passé?" + sondage
Inactif 12 mois: "Dernière chance avant suppression" + grosse offre
```

#### 2.4 Birthday/Anniversary Journey
```
J-7: "Votre anniversaire approche, offrez-vous la Polynésie"
Jour J: "Joyeux anniversaire!" + code promo personnel
Anniversaire 1er vol: "Il y a X ans, vous découvriez la Polynésie"
```

---

## 3. A/B TESTING & OPTIMISATION

### Features à ajouter

#### 3.1 A/B Test Newsletters
- Tester 2-3 versions de sujet (subject line)
- Tester différents CTAs
- Tester heures d'envoi
- Automatiquement envoyer la version gagnante au reste de la liste

#### 3.2 Heatmaps Emails
- Voir où les gens cliquent dans les newsletters
- Identifier les zones chaudes/froides
- Optimiser le placement des CTAs

#### 3.3 Predictive Send Time
- Analyser l'historique d'ouverture par client
- Envoyer à chaque client à SON meilleur moment
- "Marie ouvre ses emails à 7h, Jean à 21h"

---

## 4. CONTENU DYNAMIQUE

### Problème actuel
Les newsletters sont statiques. Un vrai marketeur veut de la personnalisation 1:1.

### Features à ajouter

#### 4.1 Blocs conditionnels
```
SI client.derniere_destination == "Bora Bora":
    Afficher: "Retournez à Bora Bora avec -15%"
SINON SI client.recherches_recentes CONTIENT "Tokyo":
    Afficher: "Tokyo vous attend!"
SINON:
    Afficher: bloc générique
```

#### 4.2 Recommandations personnalisées
- "Destinations similaires à vos précédents voyages"
- "Les clients comme vous ont aussi visité..."
- "Basé sur votre recherche de hier"

#### 4.3 Countdown timers dynamiques
- "Plus que 48h pour profiter de cette offre"
- Timer qui se met à jour à chaque ouverture
- Urgence personnalisée par client

---

## 5. CALENDRIER MARKETING INTELLIGENT

### Problème actuel
Le calendrier montre les contenus, mais pas la stratégie marketing globale.

### Features à ajouter

#### 5.1 Vue Campagne (pas juste contenu)
```
Campagne "Black Friday Polynésie"
├── Newsletter teaser (J-7)
├── Post Facebook (J-5)
├── Newsletter lancement (J-0)
├── Relance non-ouvreurs (J+2)
├── SMS dernière chance (J+6)
└── Bilan campagne (J+8)
```

#### 5.2 Saisonnalité automatique
- Suggestions de contenus basées sur le calendrier touristique
- "Juillet = vacances FR → campagne famille"
- "Février = St Valentin → campagne romantique"
- "Novembre = Heiva → campagne culturelle"

#### 5.3 Coordination multi-canal
- Visualiser newsletter + social + SMS sur le même calendrier
- Éviter les doublons ou les silences
- Gap analysis: "Aucun contenu prévu semaine 15"

---

## 6. ATTRIBUTION & ROI MARKETING

### Problème actuel
On voit les KPIs par route, mais pas l'attribution des ventes au marketing.

### Features à ajouter

#### 6.1 Attribution multi-touch
```
Client achète un billet:
- 30% attribué à la newsletter du 15/01 (premier contact)
- 20% attribué au retargeting Facebook
- 50% attribué au SMS promo (dernier clic)
```

#### 6.2 ROI par campagne
| Campagne | Coût | Revenus attribués | ROI |
|----------|------|-------------------|-----|
| Newsletter Bora Bora | 0 XPF | 2.5M XPF | ∞ |
| Facebook Ads Janvier | 150K XPF | 890K XPF | 493% |
| SMS Black Friday | 45K XPF | 320K XPF | 611% |

#### 6.3 Customer Lifetime Value (CLV)
- Valeur moyenne d'un client sur 3 ans
- Coût d'acquisition acceptable
- Clients à forte valeur vs clients à risque

---

## 7. LEAD SCORING & NURTURING

### Problème actuel
Pas de distinction entre un visiteur curieux et un prospect chaud.

### Features à ajouter

#### 7.1 Scoring comportemental
| Action | Points |
|--------|--------|
| Visite page tarifs | +10 |
| Simulation de prix | +25 |
| Ajout panier | +40 |
| Ouverture newsletter | +5 |
| Clic newsletter | +15 |
| Téléchargement brochure | +20 |
| Chat avec concierge | +30 |

#### 7.2 Seuils d'action
- Score < 30: Nurturing automatique (contenu inspirationnel)
- Score 30-70: Offres personnalisées
- Score > 70: Alerte commerciale (appel ou offre premium)

---

## 8. SOCIAL MEDIA AVANCÉ

### Problème actuel
Le Social Monitor surveille, mais ne propose pas de stratégie.

### Features à ajouter

#### 8.1 Calendrier Social intégré
- Planifier posts Facebook, Instagram, LinkedIn
- Preview des posts avant publication
- Meilleurs horaires par plateforme

#### 8.2 UGC (User Generated Content) Curation
- Détecter les photos de clients tagguées @AirTahitiNui
- Demander permission de republier
- Intégrer dans les newsletters ("Nos voyageurs partagent")

#### 8.3 Influencer Tracking
- Identifier les influenceurs qui parlent d'ATN
- Proposer des partenariats automatiquement
- Mesurer l'impact des collaborations

---

## 9. RAPPORTS MARKETING AVANCÉS

### Features à ajouter

#### 9.1 Dashboard CMO
- Vue exécutive: Budget, ROI global, tendances
- Comparaison période vs période
- Prévisions (forecast) basées sur l'historique

#### 9.2 Rapports automatisés par email
- Rapport quotidien au marketing manager
- Rapport hebdo au CMO
- Rapport mensuel à la direction

#### 9.3 Alertes intelligentes
- "Taux d'ouverture 30% sous la moyenne - investiguer"
- "Campagne X performe exceptionnellement - capitaliser"
- "Concurrent Y a baissé ses prix de 20% - réagir?"

---

## 10. INTÉGRATIONS MANQUANTES

### 10.1 CRM Sync
- Synchronisation bidirectionnelle avec Salesforce/HubSpot
- Historique client unifié
- Scoring partagé

### 10.2 Booking Engine Integration
- Données de recherche (pas juste réservation)
- Paniers abandonnés en temps réel
- Disponibilités pour offres dynamiques

### 10.3 Loyalty Program (Club Tiare)
- Points du client visible
- Offres basées sur le niveau de fidélité
- "Plus que 5000 miles pour le statut Gold"

### 10.4 Call Center Integration
- Historique des appels dans le profil client
- Raisons d'appel pour améliorer le self-service
- Scripts suggérés basés sur l'historique

---

## 11. OUTILS CRÉATIFS

### Features à ajouter

#### 11.1 Template Builder
- Drag & drop pour créer des templates email
- Bibliothèque de blocs réutilisables
- Preview responsive (desktop/mobile)

#### 11.2 Image Bank ATN
- Bibliothèque d'images approuvées par destination
- Recherche par tag (plage, couple, famille, business)
- Génération d'images IA avec style ATN

#### 11.3 Copy Assistant
- Suggestions de subject lines
- Variations de CTA
- Traduction automatique FR/EN/JP

---

## 12. COMPLIANCE & PREFERENCES

### Features à ajouter

#### 12.1 Preference Center
- Page où le client gère ses préférences
- Fréquence souhaitée (hebdo, mensuel, jamais)
- Types de contenus souhaités (promos, inspiration, infos)

#### 12.2 Consent Management
- Tracking des consentements RGPD
- Date et source du consentement
- Easy unsubscribe avec raison

#### 12.3 Deliverability Dashboard
- Taux de bounce
- Plaintes spam
- Réputation domaine
- Recommandations d'amélioration

---

## PRIORISATION RECOMMANDÉE

### Phase 1 (Quick Wins - 2 semaines)
1. ✅ Segments RFM basiques
2. ✅ Post-booking journey simple (5 emails)
3. ✅ A/B testing subject lines

### Phase 2 (Impact fort - 1 mois)
4. Attribution multi-touch
5. Lead scoring
6. Calendrier campagne (pas juste contenu)

### Phase 3 (Différenciation - 2 mois)
7. Contenu dynamique 1:1
8. Predictive send time
9. Dashboard CMO

### Phase 4 (Excellence - 3 mois)
10. Intégrations CRM/Booking
11. Customer journeys complets
12. CLV et prédictions

---

## MÉTRIQUES À TRACKER

| Métrique | Actuel (démo) | Cible |
|----------|---------------|-------|
| Taux d'ouverture | 32% | 40% |
| Taux de clic | 4.5% | 8% |
| Conversion newsletter | 0.8% | 2% |
| Revenue per email | 15 XPF | 50 XPF |
| Unsubscribe rate | 0.3% | < 0.2% |
| Customer acquisition cost | ? | < 5000 XPF |
| Email ROI | ? | > 4000% |

---

*Document créé le 28 janvier 2026*
*Pour: Équipe Marketing Air Tahiti Nui*
*Par: PACIFIK'AI*
