'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Mail, FileText, GripVertical, Clock, Edit3, Trash2, Plus, X, Eye, ExternalLink, BarChart3, Globe, Target, Tag, Send, Users } from 'lucide-react'

interface ScheduledContent {
  id: string
  type: 'newsletter' | 'article'
  title: string
  status: 'draft' | 'scheduled' | 'sent' | 'published'
  date: string
  time: string
  category?: string
  // Full content for newsletters
  subject?: string
  headline?: string
  fullContent?: string
  imageUrl?: string
  ctaText?: string
  ctaUrl?: string
  segment?: string
  // Full content for articles
  excerpt?: string
  seoScore?: number
  geoScore?: number
  wordCount?: number
  metaDescription?: string
  keywords?: string[]
  readingTime?: number
}

// Full newsletter templates
const newsletterTemplates = {
  'Offres spéciales Bora Bora': {
    subject: '🌴 -30% sur votre séjour à Bora Bora - Offre exclusive',
    headline: 'Votre paradis vous attend à prix réduit',
    fullContent: `Cher voyageur,

Nous avons une offre exceptionnelle pour vous : **-30% sur tous les vols vers Bora Bora** jusqu'au 15 mars.

**Ce qui vous attend :**
• Vol direct depuis Paris en classe Poerava Business
• Accueil traditionnel avec collier de fleurs
• Service à bord primé 5 étoiles

**L'offre inclut :**
- Billet aller-retour Paris-Bora Bora
- 1 bagage en soute de 23kg
- Repas gastronomiques à bord
- Divertissement à la demande

Ne manquez pas cette opportunité unique de découvrir le plus beau lagon du monde.

À très bientôt dans le ciel polynésien !`,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
    ctaText: 'Réserver maintenant',
    ctaUrl: 'https://www.airtahitinui.com/fr-fr',
    segment: 'Voyageurs Loisirs'
  },
  'Nouveaux vols Tokyo': {
    subject: '✈️ Nouvelle liaison Tokyo-Papeete - Réservez en avant-première',
    headline: 'Le Japon à portée de Polynésie',
    fullContent: `Konnichiwa !

Air Tahiti Nui a le plaisir de vous annoncer l'ouverture de sa **nouvelle ligne Tokyo-Papeete**.

**Détails de la liaison :**
• 3 vols hebdomadaires
• Départ : Narita International Airport
• Arrivée : Faa'a International Airport
• Durée : 11h30

**Avantages exclusifs :**
- Menu fusion franco-japonais à bord
- Films japonais sous-titrés
- Personnel navigant bilingue

**Tarifs de lancement :**
À partir de 89 000 XPF l'aller simple

Soyez parmi les premiers à vivre cette nouvelle aventure !`,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
    ctaText: 'Découvrir les vols',
    ctaUrl: 'https://www.airtahitinui.com/fr-fr',
    segment: 'Marché Asiatique'
  },
  'Programme fidélité': {
    subject: '⭐ Club Tiare - Vos nouveaux avantages 2026',
    headline: 'Encore plus de récompenses pour votre fidélité',
    fullContent: `Cher membre Club Tiare,

Votre fidélité mérite d'être récompensée. Découvrez les **nouveaux avantages 2026** de votre programme.

**Nouveautés Gold & Platinum :**
• Accès prioritaire à l'embarquement
• Lounge exclusif avec vue piste
• +50% de miles bonus sur tous les vols
• Surclassement gratuit selon disponibilité

**Votre solde actuel :**
12 450 miles Tiare

**Prochain palier :**
Plus que 2 550 miles pour atteindre le statut Gold !

Continuez à voler avec nous pour profiter de ces avantages exclusifs.`,
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600',
    ctaText: 'Voir mes miles',
    ctaUrl: 'https://www.airtahitinui.com/fr-fr',
    segment: 'Membres Fidélité'
  },
  'Escapade Moorea': {
    subject: '🏝️ Weekend à Moorea - Package tout inclus',
    headline: 'L\'île sœur de Tahiti vous attend',
    fullContent: `Envie d'évasion ?

Découvrez notre **package escapade Moorea** :

**Le forfait comprend :**
• Vol domestique Tahiti-Moorea (15 min)
• 2 nuits en bungalow sur pilotis
• Petit-déjeuner tropical inclus
• Location de vélo électrique

**Activités incluses :**
- Tour de l'île en 4x4
- Snorkeling avec les raies
- Coucher de soleil au Belvédère

**Prix spécial couple :**
À partir de 145 000 XPF pour 2 personnes

Réservez avant le 28 février !`,
    imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600',
    ctaText: 'Réserver le package',
    ctaUrl: 'https://www.airtahitinui.com/fr-fr',
    segment: 'Voyageurs Domestiques'
  },
  'Promo Business Class': {
    subject: '🥂 Classe Poerava Business - Offre limitée -25%',
    headline: 'Le luxe polynésien à prix doux',
    fullContent: `Voyageur exigeant,

Profitez de **-25% sur la classe Poerava Business** pour vos prochains vols.

**L'expérience Poerava :**
• Siège-lit 180° full flat
• Champagne Ruinart à volonté
• Menu signé par un chef étoilé
• Trousse de confort Hermès
• Accès Lounge international

**Destinations concernées :**
- Paris CDG
- Los Angeles LAX
- Tokyo NRT
- Auckland AKL

**Conditions :**
Réservation avant le 10 mars
Voyage jusqu'au 30 juin 2026

L'excellence du voyage vous attend.`,
    imageUrl: 'https://images.unsplash.com/photo-1540339832862-474599807836?w=600',
    ctaText: 'Surclasser mon vol',
    ctaUrl: 'https://www.airtahitinui.com/fr-fr',
    segment: 'Voyageurs Premium'
  },
  'Guide voyageur': {
    subject: '📖 Votre guide complet - Préparez votre voyage en Polynésie',
    headline: 'Tout ce qu\'il faut savoir avant de partir',
    fullContent: `Futur voyageur polynésien,

Votre voyage approche ! Voici notre **guide complet** pour bien préparer votre séjour.

**Avant le départ :**
□ Passeport valide 6 mois
□ Aucun visa requis (séjour < 90 jours)
□ Enregistrement en ligne 48h avant

**À bord :**
• Franchise bagage : 23kg soute + 12kg cabine
• Repas inclus sur tous les vols
• Wi-Fi disponible (payant)

**À l'arrivée :**
- Décalage horaire : -11h vs Paris
- Monnaie : Franc Pacifique (XPF)
- Prise électrique : Type A/B (adaptateur recommandé)

**Conseil santé :**
Aucune vaccination obligatoire
Protection solaire indice 50+ recommandée

Bon voyage !`,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    ctaText: 'Télécharger le guide PDF',
    ctaUrl: 'https://www.airtahitinui.com/fr-fr',
    segment: 'Nouveaux Clients'
  }
}

// Full article templates
const articleTemplates = {
  'Top 10 activités Tahiti': {
    excerpt: 'Découvrez les meilleures activités à faire lors de votre séjour à Tahiti, de la plongée aux randonnées.',
    fullContent: `# Top 10 des activités incontournables à Tahiti

Tahiti, la perle du Pacifique, offre bien plus que ses plages paradisiaques. Voici notre sélection des 10 activités à ne pas manquer.

## 1. Plongée à la Vallée Blanche

La Vallée Blanche, située au large de Tahiti, est l'un des spots de plongée les plus réputés au monde. Vous y croiserez requins citrons, raies mantas et dauphins dans une eau cristalline.

## 2. Randonnée au Mont Aorai

Deuxième plus haut sommet de Tahiti (2066m), le Mont Aorai offre une vue imprenable sur l'île. Comptez 8 heures aller-retour pour les randonneurs confirmés.

## 3. Surf à Teahupo'o

Ce spot légendaire accueille chaque année une étape du Championship Tour. Même si vous ne surfez pas les vagues géantes, le spectacle depuis le chenal est époustouflant.

## 4. Visite du marché de Papeete

Le marché municipal est le cœur battant de la capitale. Fruits tropicaux, poisson cru à la tahitienne, artisanat local : une immersion sensorielle totale.

## 5. Excursion aux Trois Cascades de Faarumai

Ces trois chutes d'eau majestueuses sont accessibles par une courte marche en forêt tropicale. La plus haute atteint 100 mètres.

## 6. Tour de l'île en 4x4

Explorez l'intérieur sauvage de Tahiti Nui, ses vallées luxuriantes et ses sites archéologiques polynésiens.

## 7. Observation des baleines (juillet-octobre)

Les baleines à bosse migrent chaque année vers les eaux chaudes polynésiennes pour mettre bas. Une rencontre inoubliable.

## 8. Cours de cuisine tahitienne

Apprenez à préparer le poisson cru au lait de coco, le poulet fafa et le po'e banane avec un chef local.

## 9. Coucher de soleil à la Pointe Vénus

Ce cap historique, où James Cook observa le transit de Vénus en 1769, offre les plus beaux couchers de soleil de l'île.

## 10. Spectacle de danse traditionnelle

Les soirées polynésiennes avec otea, aparima et fire dance vous transportent au cœur de la culture ma'ohi.

---

**Conseil pratique** : Réservez vos activités 2-3 jours à l'avance en haute saison (juin-août).`,
    seoScore: 94,
    geoScore: 89,
    wordCount: 2847,
    metaDescription: 'Guide complet des 10 meilleures activités à Tahiti : plongée, randonnée, surf, culture. Conseils pratiques pour votre séjour en Polynésie française.',
    keywords: ['Tahiti', 'activités', 'plongée', 'randonnée', 'surf', 'Polynésie française', 'voyage'],
    readingTime: 12
  },
  'Guide plongée Rangiroa': {
    excerpt: 'Rangiroa, le paradis des plongeurs. Notre guide complet pour explorer les passes mythiques de cet atoll.',
    fullContent: `# Guide complet de la plongée à Rangiroa

Rangiroa, le "ciel immense" en paumotu, est considéré comme l'un des plus beaux sites de plongée au monde. Voici tout ce qu'il faut savoir.

## Les passes mythiques

### Passe de Tiputa
La plus célèbre. Courants puissants, requins marteaux, dauphins et raies mantas. Niveau confirmé requis.

### Passe d'Avatoru
Plus accessible, idéale pour les plongeurs intermédiaires. Bancs de barracudas et napoléons.

## La faune sous-marine

- **Requins** : gris de récif, pointes noires, marteaux (décembre-mars)
- **Raies** : mantas, pastenagues, aigles
- **Dauphins** : tursiops, présents toute l'année
- **Pélagiques** : thons, carangues, barracudas

## Meilleure période

**Octobre à avril** : eaux plus chaudes (28-29°C), meilleures conditions
**Mai à septembre** : eau plus fraîche (26°C), visibilité exceptionnelle

## Centres de plongée recommandés

1. **Raie Manta Club** - Le plus ancien, excellente réputation
2. **Blue Dolphins** - Petits groupes, encadrement personnalisé
3. **Top Dive** - Moderne, matériel récent

## Tarifs indicatifs

- Plongée exploration : 8 500 XPF
- Pack 10 plongées : 75 000 XPF
- Baptême : 12 000 XPF

## Conseils pratiques

- Réservez 2-3 jours à l'avance minimum
- Prévoyez une combinaison 3mm
- Assurance plongée obligatoire
- Intervalle surface avant vol : 24h minimum`,
    seoScore: 91,
    geoScore: 96,
    wordCount: 1823,
    metaDescription: 'Guide plongée Rangiroa : passes de Tiputa et Avatoru, faune marine, meilleure saison, centres de plongée et tarifs. Tout pour plonger en Polynésie.',
    keywords: ['Rangiroa', 'plongée', 'Tiputa', 'requins', 'raies mantas', 'Polynésie', 'atoll'],
    readingTime: 8
  },
  'Meilleure saison voyage': {
    excerpt: 'Quelle est la meilleure période pour visiter la Polynésie française ? Notre analyse mois par mois.',
    fullContent: `# Quand partir en Polynésie française ? Guide saison par saison

Le climat polynésien est tropical, mais certaines périodes sont plus favorables que d'autres. Voici notre analyse complète.

## Les deux saisons

### Saison sèche (mai-octobre)
- Températures : 24-28°C
- Précipitations : faibles
- Alizés : réguliers et rafraîchissants
- **Idéal pour** : randonnée, plongée, navigation

### Saison humide (novembre-avril)
- Températures : 27-32°C
- Précipitations : averses tropicales (surtout en soirée)
- Humidité : élevée
- **Idéal pour** : surf (grosses houles), observation baleines (juillet-novembre)

## Mois par mois

| Mois | Temp. | Pluie | Note |
|------|-------|-------|------|
| Janvier | 30°C | ⛈️⛈️⛈️ | Basse saison, prix attractifs |
| Février | 30°C | ⛈️⛈️⛈️ | Carnaval de Tahiti |
| Mars | 30°C | ⛈️⛈️ | Début accalmie |
| Avril | 29°C | ⛈️⛈️ | Pâques = haute saison |
| Mai | 28°C | ⛈️ | Excellent rapport qualité/prix |
| Juin | 27°C | ☀️ | Début haute saison |
| Juillet | 26°C | ☀️ | Heiva, fête nationale |
| Août | 26°C | ☀️ | Très demandé, réservez tôt |
| Septembre | 26°C | ☀️ | Idéal, moins de monde |
| Octobre | 27°C | ⛈️ | Fin haute saison |
| Novembre | 28°C | ⛈️⛈️ | Baleines + tarifs réduits |
| Décembre | 29°C | ⛈️⛈️ | Fêtes = haute saison |

## Notre recommandation

**Mai-juin et septembre-octobre** offrent le meilleur compromis : beau temps, prix raisonnables, moins de touristes.

## Événements à ne pas manquer

- **Heiva i Tahiti** (juillet) : plus grand festival culturel polynésien
- **Hawaiki Nui Va'a** (novembre) : course de pirogues mythique
- **Tahiti Pro** (août) : compétition de surf à Teahupo'o`,
    seoScore: 88,
    geoScore: 92,
    wordCount: 2156,
    metaDescription: 'Meilleure période pour voyager en Polynésie française : climat, températures, événements. Guide saison par saison pour planifier votre séjour.',
    keywords: ['Polynésie', 'quand partir', 'saison', 'climat', 'météo', 'Tahiti', 'voyage'],
    readingTime: 9
  },
  'Poerava Business review': {
    excerpt: 'Test complet de la classe Poerava Business d\'Air Tahiti Nui sur un vol Paris-Papeete.',
    fullContent: `# Test : Classe Poerava Business Air Tahiti Nui

Nous avons testé la classe affaires d'Air Tahiti Nui sur le vol TN065 Paris CDG - Papeete via Los Angeles. Verdict complet.

## Le siège

**Note : 4.5/5**

- Configuration 2-2-2 sur Boeing 787-9
- Siège-lit full flat 180°
- Largeur : 53 cm
- Pitch : 198 cm
- Accès direct couloir pour tous

Le siège Zodiac Cirrus est spacieux et confortable. La literie (couette, oreiller moelleux) est de qualité hôtelière.

## Le service

**Note : 5/5**

Le personnel naviguant polynésien apporte une touche de chaleur unique. Accueil avec collier de fleurs (tiare), sourire permanent, attention discrète mais efficace.

## La restauration

**Note : 4/5**

- Champagne Ruinart à l'embarquement
- Menu signé par un chef local
- Produits frais polynésiens
- Poisson cru au lait de coco excellent
- Cave de vins française bien fournie

Seul bémol : le choix limité sur le second service (vol de 22h).

## Le divertissement

**Note : 4/5**

- Écran 16" tactile
- Large sélection de films récents
- Documentaires sur la Polynésie
- Casque antibruit fourni
- Wi-Fi payant (15€/vol)

## Le lounge Los Angeles

Escale de 2h30 à LAX. Accès au Star Alliance Lounge : correct sans être exceptionnel.

## Verdict final

**Note globale : 4.5/5**

La classe Poerava offre une expérience premium authentique avec une touche polynésienne unique. Le rapport qualité-prix est excellent comparé aux concurrents.

**Prix moyen** : à partir de 450 000 XPF AR Paris-Papeete

**On aime** : le service, le siège, l'ambiance
**À améliorer** : le lounge à LAX, le Wi-Fi payant`,
    seoScore: 86,
    geoScore: 78,
    wordCount: 1654,
    metaDescription: 'Test complet classe Poerava Business Air Tahiti Nui : siège, service, restauration, divertissement. Notre avis sur la classe affaires polynésienne.',
    keywords: ['Air Tahiti Nui', 'Poerava Business', 'classe affaires', 'test', 'avis', 'Boeing 787'],
    readingTime: 7
  },
  'Îles Marquises secrets': {
    excerpt: 'Les Marquises, terres des hommes : découvrez les secrets de cet archipel mystérieux au bout du monde.',
    fullContent: `# Les secrets des Îles Marquises

À 1500 km au nord-est de Tahiti, les Marquises sont la Polynésie authentique, sauvage et mystérieuse. Découverte.

## Pourquoi les Marquises ?

Oubliez les lagons turquoise et les plages de sable blanc. Ici, la beauté est brute : falaises vertigineuses, vallées luxuriantes, culture ancestrale préservée.

## Les îles à visiter

### Nuku Hiva (chef-lieu)
- Vallée de Taipivai, décrite par Melville
- Baie de Hakatea et ses tikis géants
- Cascades de Vaipo (350m de haut)

### Hiva Oa
- Tombe de Jacques Brel et Paul Gauguin
- Site archéologique de Lipona
- Village d'Atuona

### Ua Pou
- Pics basaltiques spectaculaires
- Artisanat (sculpture sur bois, tapa)

### Fatu Hiva
- La plus sauvage
- Accessible uniquement par bateau
- Tapa traditionnel

## La culture marquisienne

Les Marquises ont conservé leurs traditions :
- **Tatouage** : art sacré, motifs géométriques complexes
- **Danse** : haka (différent du haka maori)
- **Artisanat** : sculpture sur os, pierre et bois
- **Cuisine** : porc au four enterré (umu), fruit de l'arbre à pain

## Comment s'y rendre

**Par avion** (recommandé) :
- Air Tahiti : Papeete → Nuku Hiva (3h30)
- Vols inter-îles entre Nuku Hiva, Hiva Oa, Ua Pou

**Par bateau** (aventuriers) :
- Cargo mixte Aranui 5 : croisière 14 jours
- Expérience unique, réservation 6 mois à l'avance

## Meilleure période

**Mars à août** : saison sèche, températures agréables (24-28°C)

## Conseil essentiel

Les Marquises ne sont pas une destination "resort". Préparez-vous à :
- Routes de terre
- Hébergements simples (pensions familiales)
- Déconnexion (peu de réseau)
- Rencontres authentiques`,
    seoScore: 92,
    geoScore: 94,
    wordCount: 2234,
    metaDescription: 'Guide complet des Îles Marquises : Nuku Hiva, Hiva Oa, culture, comment s\'y rendre. Découvrez la Polynésie authentique et sauvage.',
    keywords: ['Marquises', 'Nuku Hiva', 'Hiva Oa', 'Polynésie', 'Gauguin', 'Brel', 'voyage'],
    readingTime: 10
  },
  'Cuisine polynésienne': {
    excerpt: 'De la mer à l\'assiette : découvrez les saveurs authentiques de la gastronomie polynésienne.',
    fullContent: `# La cuisine polynésienne : guide gourmand

La gastronomie polynésienne est un métissage unique de saveurs locales et d'influences françaises, chinoises et américaines.

## Les plats incontournables

### Poisson cru à la tahitienne
Le plat emblématique : thon rouge mariné au citron vert, baigné de lait de coco frais. Simple et divin.

**Recette authentique :**
1. 500g de thon rouge frais (sashimi quality)
2. Jus de 6 citrons verts
3. 200ml de lait de coco frais
4. Concombre, tomate, oignon
5. Sel, poivre

### Poulet fafa
Poulet mijoté avec des feuilles de taro (fafa) dans du lait de coco. Onctueux et parfumé.

### Po'e
Dessert traditionnel : fruit (banane, papaye, courge) cuit avec de l'amidon de manioc, servi avec du lait de coco.

### Ma'a Tahiti
Le festin du dimanche : cochon, poulet, poisson, fafa, uru (fruit de l'arbre à pain) cuits dans le four tahitien enterré.

## Les produits locaux

### Fruits de mer
- Thon rouge (local, pêché quotidiennement)
- Mahi mahi (dorade coryphène)
- Chevrettes (crevettes d'eau douce)
- Bénitier

### Fruits tropicaux
- Pamplemousse de Tahiti
- Mangue
- Papaye
- Ananas (Moorea)
- Banane fe'i (orange, se cuit)

### La vanille de Tahiti
AOC, la plus parfumée au monde. Notes florales et fruitées uniques.

## Où manger à Tahiti

### Les roulottes
Food trucks locaux sur le front de mer de Papeete. Le soir, ambiance populaire, prix doux (1500-2500 XPF).

### Restaurants gastronomiques
- **Le Coco's** : vue lagon, chef étoilé
- **Le Lotus** : cuisine fusion, InterContinental
- **Hei** : nouvelle cuisine tahitienne

## Vocabulaire utile

- **Mā'a** : nourriture
- **Pota** : légumes
- **Fa'a'apu** : potager
- **Tāmā'ara'a** : festin

Ia ora na e maeva ! (Bienvenue et bon appétit !)`,
    seoScore: 89,
    geoScore: 91,
    wordCount: 1987,
    metaDescription: 'Gastronomie polynésienne : poisson cru, poulet fafa, po\'e, ma\'a tahiti. Recettes, produits locaux et bonnes adresses à Tahiti.',
    keywords: ['cuisine polynésienne', 'poisson cru', 'Tahiti', 'recettes', 'gastronomie', 'vanille'],
    readingTime: 8
  }
}

// Demo data - 1 month of content with full templates
const generateDemoContent = (): ScheduledContent[] => {
  const content: ScheduledContent[] = []
  const now = new Date()
  const types: ('newsletter' | 'article')[] = ['newsletter', 'article']
  const newsletterTitles = Object.keys(newsletterTemplates)
  const articleTitles = Object.keys(articleTemplates)

  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + i - 5)

    // 60% chance of having content on a day
    if (Math.random() > 0.4) {
      const type = types[Math.floor(Math.random() * types.length)]

      if (type === 'newsletter') {
        const title = newsletterTitles[Math.floor(Math.random() * newsletterTitles.length)]
        const template = newsletterTemplates[title as keyof typeof newsletterTemplates]
        content.push({
          id: `content-${i}`,
          type,
          title,
          status: date < now ? 'sent' : 'scheduled',
          date: date.toISOString().split('T')[0],
          time: '09:00',
          ...template
        })
      } else {
        const title = articleTitles[Math.floor(Math.random() * articleTitles.length)]
        const template = articleTemplates[title as keyof typeof articleTemplates]
        content.push({
          id: `content-${i}`,
          type,
          title,
          status: date < now ? 'published' : 'scheduled',
          date: date.toISOString().split('T')[0],
          time: '14:00',
          category: ['Destinations', 'Services', 'Guides'][Math.floor(Math.random() * 3)],
          imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=600`,
          ...template
        })
      }
    }
  }
  return content
}

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  scheduled: { label: 'Programmé', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  sent: { label: 'Envoyé', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  published: { label: 'Publié', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
}

function ContentCard({
  item,
  onEdit,
  onDelete,
  onPreview,
  draggable = true
}: {
  item: ScheduledContent
  onEdit: () => void
  onDelete: () => void
  onPreview: () => void
  draggable?: boolean
}) {
  const isPast = new Date(item.date) < new Date()

  return (
    <div
      className={`group p-2 rounded-lg border ${
        item.type === 'newsletter'
          ? 'bg-pink-50 border-pink-200 hover:border-pink-400'
          : 'bg-purple-50 border-purple-200 hover:border-purple-400'
      } ${draggable && !isPast ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} ${isPast ? 'opacity-60' : ''} transition-colors`}
      draggable={draggable && !isPast}
      onDragStart={(e) => {
        e.dataTransfer.setData('content-id', item.id)
      }}
      onClick={(e) => {
        // Don't trigger preview if clicking on edit/delete buttons
        if ((e.target as HTMLElement).closest('button')) return
        onPreview()
      }}
    >
      <div className="flex items-start gap-2">
        {draggable && !isPast && (
          <GripVertical className="w-4 h-4 text-slate-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {item.type === 'newsletter' ? (
              <Mail className="w-3.5 h-3.5 text-pink-500" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-purple-500" />
            )}
            <span className="text-xs font-medium truncate">{item.title}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{item.time}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${statusConfig[item.status].color}`}>
              {statusConfig[item.status].label}
            </span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onPreview() }}
            className="p-1 hover:bg-white rounded"
            title="Aperçu"
          >
            <Eye className="w-3.5 h-3.5 text-blue-500" />
          </button>
          {!isPast && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit() }}
                className="p-1 hover:bg-white rounded"
                title="Modifier"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                className="p-1 hover:bg-white rounded"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Newsletter Email Preview Modal
function NewsletterPreviewModal({ item, onClose }: { item: ScheduledContent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-slate-50">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-pink-500" />
            <div>
              <h2 className="font-semibold">Aperçu Newsletter</h2>
              <p className="text-sm text-slate-500">{item.date} à {item.time}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email client simulation */}
        <div className="flex-1 overflow-y-auto">
          {/* Email metadata */}
          <div className="p-4 bg-slate-100 border-b text-sm space-y-1">
            <div className="flex gap-2">
              <span className="text-slate-500 w-16">De:</span>
              <span className="font-medium">Air Tahiti Nui &lt;newsletter@airtahitinui.com&gt;</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500 w-16">À:</span>
              <span>{item.segment || 'Tous les abonnés'}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500 w-16">Objet:</span>
              <span className="font-medium">{item.subject || item.title}</span>
            </div>
          </div>

          {/* Email content */}
          <div className="bg-slate-200 p-4">
            <div className="bg-white max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden">
              {/* Email header */}
              <div className="bg-atn-primary p-6 text-center">
                <div className="text-white font-bold text-xl tracking-wide">AIR TAHITI NUI</div>
                <div className="text-white/80 text-sm mt-1">La compagnie du paradis</div>
              </div>

              {/* Hero image */}
              {item.imageUrl && (
                <div className="relative h-48 bg-slate-200">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'
                    }}
                  />
                </div>
              )}

              {/* Email body */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">
                  {item.headline || item.title}
                </h1>

                <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-line">
                  {item.fullContent || 'Contenu de la newsletter à venir...'}
                </div>

                {/* CTA Button */}
                {item.ctaText && (
                  <div className="mt-6 text-center">
                    <a
                      href={item.ctaUrl || '#'}
                      className="inline-block px-6 py-3 bg-atn-secondary text-white font-semibold rounded-lg hover:bg-atn-secondary/90 transition-colors"
                    >
                      {item.ctaText}
                    </a>
                  </div>
                )}
              </div>

              {/* Email footer */}
              <div className="bg-slate-50 p-6 text-center text-sm text-slate-500 border-t">
                <p className="mb-2">Air Tahiti Nui - La compagnie du paradis</p>
                <p className="text-xs">
                  Vous recevez cet email car vous êtes inscrit à notre newsletter.
                  <br />
                  <a href="#" className="text-atn-secondary hover:underline">Se désinscrire</a> |
                  <a href="#" className="text-atn-secondary hover:underline ml-1">Préférences</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats footer */}
        <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">Segment: <span className="font-medium">{item.segment || 'Tous'}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">Statut: <span className={`font-medium ${item.status === 'sent' ? 'text-emerald-600' : 'text-blue-600'}`}>
                {statusConfig[item.status].label}
              </span></span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

// Article Preview Modal
function ArticlePreviewModal({ item, onClose }: { item: ScheduledContent; onClose: () => void }) {
  // Simple markdown-style parsing
  const parseContent = (content: string) => {
    if (!content) return []
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-bold mt-6 mb-4 text-slate-800">{line.slice(2)}</h1>
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-semibold mt-5 mb-3 text-slate-700">{line.slice(3)}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-slate-700">{line.slice(4)}</h3>
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={i} className="ml-4 text-slate-600">{line.slice(2)}</li>
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-slate-700 my-2">{line.slice(2, -2)}</p>
      }
      if (line.startsWith('|')) {
        // Simple table row handling
        return <p key={i} className="font-mono text-sm text-slate-600 my-1">{line}</p>
      }
      if (line.trim() === '') {
        return <div key={i} className="h-3" />
      }
      if (line.startsWith('---')) {
        return <hr key={i} className="my-6 border-slate-200" />
      }
      // Bold text within line
      const boldRegex = /\*\*(.*?)\*\*/g
      const parts = line.split(boldRegex)
      if (parts.length > 1) {
        return (
          <p key={i} className="text-slate-600 my-2">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
          </p>
        )
      }
      return <p key={i} className="text-slate-600 my-2">{line}</p>
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-slate-50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-purple-500" />
            <div>
              <h2 className="font-semibold">Aperçu Article SEO</h2>
              <p className="text-sm text-slate-500">Publication prévue: {item.date} à {item.time}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero image with title overlay */}
          <div className="relative h-64 bg-slate-200">
            <img
              src={item.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {item.category && (
                <span className="inline-block px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full mb-3">
                  {item.category}
                </span>
              )}
              <h1 className="text-3xl font-bold text-white">{item.title}</h1>
            </div>
          </div>

          {/* Meta info */}
          <div className="p-6 bg-slate-50 border-b">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{item.readingTime || 8} min de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{item.wordCount || 2000} mots</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-sm">SEO: <span className="font-semibold text-emerald-600">{item.seoScore || 85}/100</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm">GEO: <span className="font-semibold text-blue-600">{item.geoScore || 80}/100</span></span>
              </div>
            </div>
          </div>

          {/* Meta description */}
          {item.metaDescription && (
            <div className="px-6 pt-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-1">Meta Description (SEO)</p>
                <p className="text-sm text-amber-700">{item.metaDescription}</p>
              </div>
            </div>
          )}

          {/* Keywords */}
          {item.keywords && item.keywords.length > 0 && (
            <div className="px-6 pt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-slate-400" />
                {item.keywords.map((keyword, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Article body */}
          <div className="p-6">
            <div className="prose prose-slate max-w-none">
              {parseContent(item.fullContent || item.excerpt || 'Contenu de l\'article à venir...')}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.status === 'published'
                ? 'bg-emerald-100 text-emerald-700'
                : item.status === 'scheduled'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-700'
            }`}>
              {statusConfig[item.status].label}
            </span>
            {item.status === 'published' && (
              <a href="#" className="flex items-center gap-1 text-sm text-atn-secondary hover:underline">
                <ExternalLink className="w-3.5 h-3.5" />
                Voir sur le blog
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [content, setContent] = useState<ScheduledContent[]>(generateDemoContent())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedContent, setSelectedContent] = useState<ScheduledContent | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState<ScheduledContent | null>(null)
  const [dragOverDate, setDragOverDate] = useState<string | null>(null)

  const handlePreview = (item: ScheduledContent) => {
    setPreviewContent(item)
    setShowPreview(true)
  }

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: Date[] = []

    // Add days from previous month to fill the first week
    const startDay = firstDay.getDay()
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push(d)
    }

    // Add all days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // Add days from next month to complete the grid
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  const getContentForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return content.filter(c => c.date === dateStr)
  }

  const handleDrop = (date: Date, contentId: string) => {
    const dateStr = date.toISOString().split('T')[0]
    setContent(prev => prev.map(c =>
      c.id === contentId ? { ...c, date: dateStr } : c
    ))
    setDragOverDate(null)
  }

  const handleEdit = (item: ScheduledContent) => {
    setSelectedContent(item)
    setShowEditor(true)
  }

  const handleDelete = (id: string) => {
    setContent(prev => prev.filter(c => c.id !== id))
  }

  const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth.getMonth()
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-blue-500" />
            Calendrier Éditorial
          </h1>
          <p className="text-slate-500">Planifiez newsletters et articles - glissez-déposez pour réorganiser</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setSelectedContent(null)
            setShowEditor(true)
          }}
        >
          <Plus className="w-4 h-4" />
          Nouveau contenu
        </button>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold capitalize">{monthName}</h2>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-pink-200"></div>
          <span>Newsletter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-200"></div>
          <span>Article SEO</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-slate-600">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((date, i) => {
            const dateStr = date.toISOString().split('T')[0]
            const dayContent = getContentForDate(date)
            const isDragOver = dragOverDate === dateStr

            return (
              <div
                key={i}
                className={`min-h-[120px] p-2 border-b border-r border-slate-100 ${
                  !isCurrentMonth(date) ? 'bg-slate-50' : ''
                } ${isToday(date) ? 'bg-blue-50' : ''} ${isDragOver ? 'bg-blue-100' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverDate(dateStr)
                }}
                onDragLeave={() => setDragOverDate(null)}
                onDrop={(e) => {
                  e.preventDefault()
                  const contentId = e.dataTransfer.getData('content-id')
                  if (contentId) {
                    handleDrop(date, contentId)
                  }
                }}
              >
                <div className={`text-sm mb-2 ${
                  isToday(date)
                    ? 'font-bold text-blue-600'
                    : isCurrentMonth(date)
                      ? 'text-slate-700'
                      : 'text-slate-400'
                }`}>
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayContent.map(item => (
                    <ContentCard
                      key={item.id}
                      item={item}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item.id)}
                      onPreview={() => handlePreview(item)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Newsletters ce mois</p>
          <p className="text-2xl font-bold text-pink-600">
            {content.filter(c => c.type === 'newsletter' && c.date.startsWith(currentMonth.toISOString().slice(0, 7))).length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Articles ce mois</p>
          <p className="text-2xl font-bold text-purple-600">
            {content.filter(c => c.type === 'article' && c.date.startsWith(currentMonth.toISOString().slice(0, 7))).length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Programmés</p>
          <p className="text-2xl font-bold text-blue-600">
            {content.filter(c => c.status === 'scheduled').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Brouillons</p>
          <p className="text-2xl font-bold text-slate-600">
            {content.filter(c => c.status === 'draft').length}
          </p>
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <ContentEditorModal
          content={selectedContent}
          onClose={() => {
            setShowEditor(false)
            setSelectedContent(null)
          }}
          onSave={(updated) => {
            if (selectedContent) {
              setContent(prev => prev.map(c => c.id === updated.id ? updated : c))
            } else {
              setContent(prev => [...prev, { ...updated, id: `content-${Date.now()}` }])
            }
            setShowEditor(false)
            setSelectedContent(null)
          }}
        />
      )}

      {/* Preview Modals */}
      {showPreview && previewContent && (
        previewContent.type === 'newsletter' ? (
          <NewsletterPreviewModal
            item={previewContent}
            onClose={() => {
              setShowPreview(false)
              setPreviewContent(null)
            }}
          />
        ) : (
          <ArticlePreviewModal
            item={previewContent}
            onClose={() => {
              setShowPreview(false)
              setPreviewContent(null)
            }}
          />
        )
      )}
    </div>
  )
}

function ContentEditorModal({
  content,
  onClose,
  onSave,
}: {
  content: ScheduledContent | null
  onClose: () => void
  onSave: (content: ScheduledContent) => void
}) {
  const [formData, setFormData] = useState<Partial<ScheduledContent>>(
    content || {
      type: 'newsletter',
      title: '',
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
    }
  )
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePromptSubmit = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 2000))
    setFormData(prev => ({
      ...prev,
      title: prompt.includes('Bora') ? 'Découvrez Bora Bora - Offre exclusive' : 'Nouvelle offre Air Tahiti Nui',
    }))
    setIsGenerating(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-bold">
          {content ? 'Modifier le contenu' : 'Nouveau contenu'}
        </h2>

        <div className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'newsletter' | 'article' })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            >
              <option value="newsletter">Newsletter</option>
              <option value="article">Article SEO</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              placeholder="Titre du contenu"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date de publication</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Heure</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            >
              <option value="draft">Brouillon</option>
              <option value="scheduled">Programmé</option>
            </select>
          </div>

          {/* AI Prompt */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <span className="text-atn-secondary">✨</span>
              Prompt IA (modifier titre, contenu, date...)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                placeholder="Ex: Change le titre pour parler de Bora Bora..."
              />
              <button
                onClick={handlePromptSubmit}
                disabled={!prompt || isGenerating}
                className="px-4 py-2 bg-atn-secondary text-white rounded-lg disabled:opacity-50"
              >
                {isGenerating ? '...' : 'Appliquer'}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              L'IA peut modifier le titre, générer du contenu, ou ajuster la date de publication
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(formData as ScheduledContent)}
            className="btn-primary"
          >
            {content ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  )
}
