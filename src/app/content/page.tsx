'use client'

import { useState } from 'react'
import { FileText, Image, TrendingUp, Globe, ExternalLink, X, Clock, Tag } from 'lucide-react'

interface ContentArticle {
  id: string
  topic: string
  title: string
  excerpt: string
  seoScore: number
  geoScore: number
  wordCount: number
  imageUrl: string | null
  status: 'draft' | 'published' | 'scheduled'
  date: string
  // Full content
  fullContent: string
  metaDescription: string
  keywords: string[]
  readingTime: number
}

const demoArticles: ContentArticle[] = [
  {
    id: '1',
    topic: 'Bora Bora',
    title: 'Les 10 meilleures activités à Bora Bora pour un séjour inoubliable',
    excerpt: 'Découvrez les expériences incontournables de l\'île paradisiaque : snorkeling avec les raies mantas, dîner romantique sur pilotis...',
    seoScore: 94,
    geoScore: 88,
    wordCount: 1856,
    imageUrl: 'https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=1200',
    status: 'published',
    date: '2026-01-28T08:00:00',
    metaDescription: 'Guide complet des 10 meilleures activités à Bora Bora : snorkeling, excursions, spas, gastronomie. Conseils d\'experts pour un séjour parfait.',
    keywords: ['Bora Bora', 'activités', 'snorkeling', 'lune de miel', 'Polynésie française', 'voyage'],
    readingTime: 8,
    fullContent: `# Les 10 meilleures activités à Bora Bora pour un séjour inoubliable

Bora Bora, surnommée "la perle du Pacifique", est sans conteste l'une des destinations les plus prisées au monde. Avec son lagon aux nuances infinies de bleu et son emblématique Mont Otemanu, cette île de Polynésie française offre un cadre idyllique pour des vacances de rêve.

## 1. Snorkeling avec les raies mantas et requins

Le lagon de Bora Bora abrite une faune marine exceptionnelle. Les excursions de snorkeling vous permettent de nager aux côtés des majestueuses raies mantas et des requins à pointe noire, dans une eau cristalline à 28°C.

**Conseil d'expert** : Privilégiez les sorties tôt le matin pour une meilleure visibilité et moins de monde.

## 2. Tour de l'île en pirogue traditionnelle

Découvrez l'île comme les Polynésiens d'autrefois, à bord d'une pirogue à balancier. Cette excursion vous fait découvrir les motus (îlots) et les villages traditionnels.

## 3. Randonnée au Mont Pahia

Pour les plus sportifs, l'ascension du Mont Pahia offre des panoramas à couper le souffle sur le lagon et les îles environnantes. Comptez 3 à 4 heures aller-retour.

## 4. Dîner romantique sur pilotis

Les restaurants des hôtels de luxe proposent des dîners gastronomiques les pieds dans l'eau, avec vue sur le coucher de soleil. Une expérience incontournable pour les couples.

## 5. Journée sur un motu privé

Louez un motu (îlot) pour la journée et profitez d'une plage paradisiaque en toute intimité. Certains hôtels proposent des pique-niques gastronomiques livrés en pirogue.

## 6. Plongée sous-marine

Les sites de plongée de Bora Bora sont réputés mondialement : Tapu, Muri Muri, et le célèbre "Anau" où résident des raies mantas.

## 7. Spa polynésien traditionnel

Offrez-vous un soin au monoï et aux fleurs de tiaré dans l'un des spas surplombant le lagon. Le massage aux pierres chaudes volcaniques est particulièrement relaxant.

## 8. Tour en hélicoptère

Pour une vue imprenable sur le lagon aux 50 nuances de bleu, rien ne vaut un survol en hélicoptère. Les photos sont spectaculaires !

## 9. Cours de cuisine polynésienne

Apprenez à préparer le poisson cru au lait de coco, le po'e (dessert local) et d'autres spécialités avec un chef local.

## 10. Croisière au coucher du soleil

Terminez vos journées en beauté avec une croisière champagne au coucher du soleil. Les couleurs du ciel polynésien sont inoubliables.

---

## Informations pratiques

**Meilleure période** : De mai à octobre (saison sèche)
**Température moyenne** : 27°C
**Vol depuis Paris** : Environ 22h avec escale

**Comment s'y rendre ?**
Air Tahiti Nui propose des vols directs Paris-Papeete. De Tahiti, un court vol de 50 minutes vous dépose à Bora Bora.

*Article généré par IA PACIFIK'AI - Optimisé SEO + GEO*`,
  },
  {
    id: '2',
    topic: 'Moorea',
    title: 'Moorea vs Bora Bora : quelle île choisir pour vos vacances ?',
    excerpt: 'Comparatif complet des deux perles de Polynésie : budget, activités, hébergements, et conseils pour faire le bon choix...',
    seoScore: 91,
    geoScore: 85,
    wordCount: 2134,
    imageUrl: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=1200',
    status: 'published',
    date: '2026-01-27T10:00:00',
    metaDescription: 'Comparatif détaillé Moorea vs Bora Bora : prix, activités, hébergements. Guide pour choisir votre destination en Polynésie française.',
    keywords: ['Moorea', 'Bora Bora', 'comparatif', 'Polynésie française', 'voyage', 'budget'],
    readingTime: 10,
    fullContent: `# Moorea vs Bora Bora : quelle île choisir pour vos vacances ?

C'est LA question que se posent tous les voyageurs préparant leur séjour en Polynésie française. Moorea et Bora Bora sont deux joyaux du Pacifique, mais chacune a sa personnalité. Voici notre comparatif détaillé.

## Accessibilité et budget

### Moorea : l'île accessible
- **Depuis Tahiti** : 30 minutes de ferry ou 10 minutes d'avion
- **Budget moyen** : 150-300€/nuit en hôtel de charme
- **Avantage** : Idéale pour un premier voyage ou un budget maîtrisé

### Bora Bora : le luxe absolu
- **Depuis Tahiti** : 50 minutes d'avion uniquement
- **Budget moyen** : 500-2000€/nuit en resort
- **Avantage** : Expérience ultra-premium, bungalows sur pilotis iconiques

## Paysages et ambiance

### Moorea : la nature sauvage
Moorea séduit par ses montagnes vertigineuses, ses vallées luxuriantes et son authenticité préservée. L'île offre un mélange parfait entre plages paradisiaques et randonnées en montagne.

### Bora Bora : le lagon parfait
Bora Bora est célèbre pour son lagon aux eaux turquoise et son Mont Otemanu emblématique. C'est l'archétype de l'île paradisiaque, un décor de carte postale.

## Activités

| Activité | Moorea | Bora Bora |
|----------|--------|-----------|
| Snorkeling | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Randonnée | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Plongée | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Culture locale | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Luxe/Spa | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## Notre verdict

**Choisissez Moorea si** :
- Vous voyagez en famille
- Vous aimez les activités terrestres
- Vous avez un budget modéré
- Vous recherchez l'authenticité

**Choisissez Bora Bora si** :
- C'est votre lune de miel
- Vous rêvez d'un bungalow sur pilotis
- Le budget n'est pas une contrainte
- Vous voulez un séjour 100% farniente

**Notre conseil** : Si possible, combinez les deux ! 3 jours à Moorea + 4 jours à Bora Bora = le voyage parfait.

*Article généré par IA PACIFIK'AI - Optimisé SEO + GEO*`,
  },
  {
    id: '3',
    topic: 'Plongée',
    title: 'Guide de la plongée à Rangiroa : rencontrez les dauphins et requins',
    excerpt: 'Tout ce qu\'il faut savoir pour plonger dans l\'un des plus grands atolls du monde : meilleure saison, sites, clubs...',
    seoScore: 89,
    geoScore: 92,
    wordCount: 1678,
    imageUrl: null,
    status: 'draft',
    date: '2026-01-28T14:00:00',
    metaDescription: 'Guide plongée Rangiroa : meilleurs sites, saison idéale, rencontre requins et dauphins. Conseils pour plongeurs de tous niveaux.',
    keywords: ['Rangiroa', 'plongée', 'requins', 'dauphins', 'Tuamotu', 'Polynésie'],
    readingTime: 7,
    fullContent: `# Guide de la plongée à Rangiroa : rencontrez les dauphins et requins

Rangiroa, le "ciel infini" en paumotu, est le deuxième plus grand atoll du monde. Pour les plongeurs, c'est tout simplement le paradis. Jacques Cousteau l'avait surnommé "l'un des plus beaux aquariums naturels de la planète".

## Pourquoi plonger à Rangiroa ?

L'atoll de Rangiroa offre des conditions de plongée exceptionnelles :
- **Visibilité** : 30 à 50 mètres
- **Température** : 26-29°C toute l'année
- **Faune** : Requins gris, requins marteaux, raies mantas, dauphins, napoléons, barracudas...

## Les sites incontournables

### La Passe de Tiputa
Le site le plus célèbre de Rangiroa. La passe est traversée par des courants puissants qui attirent une faune exceptionnelle.

**À voir** :
- Dauphins résidents (ils jouent avec les plongeurs !)
- Requins gris par dizaines
- Requins marteaux (de décembre à mars)
- Raies mantas

### La Passe d'Avatoru
Moins fréquentée que Tiputa, cette passe offre des plongées plus calmes mais tout aussi riches en biodiversité.

### L'Aquarium
Site idéal pour les débutants. Coraux colorés et poissons tropicaux dans une eau peu profonde.

## Meilleure période

- **Novembre à Mars** : Requins marteaux (bancs de 100+ individus)
- **Avril à Octobre** : Conditions optimales, eau plus fraîche
- **Toute l'année** : Dauphins et requins gris

## Niveau requis

La plupart des plongées à Rangiroa sont accessibles aux plongeurs certifiés (niveau 1/Open Water). Les plongées dans les passes nécessitent une bonne maîtrise de la stabilisation en raison des courants.

## Centres de plongée recommandés

Les centres de Rangiroa sont tous de qualité, avec du matériel récent et des moniteurs expérimentés. Comptez environ 80-100€ la plongée avec équipement.

*Article en cours de rédaction - IA PACIFIK'AI*`,
  },
  {
    id: '4',
    topic: 'Business Class',
    title: 'Poerava Business Class : le luxe polynésien à 10 000 mètres',
    excerpt: 'Test complet de la classe affaires d\'Air Tahiti Nui : siège, repas, service, et tous nos conseils pour en profiter...',
    seoScore: 87,
    geoScore: 78,
    wordCount: 1423,
    imageUrl: 'https://images.unsplash.com/photo-1540339832862-474599807836?w=1200',
    status: 'scheduled',
    date: '2026-01-29T09:00:00',
    metaDescription: 'Test complet Poerava Business Class Air Tahiti Nui : siège full-flat, repas gastronomique, service 5 étoiles. Notre avis détaillé.',
    keywords: ['Poerava', 'Business Class', 'Air Tahiti Nui', 'vol', 'luxe', 'Tahiti'],
    readingTime: 6,
    fullContent: `# Poerava Business Class : le luxe polynésien à 10 000 mètres

La classe Poerava d'Air Tahiti Nui promet une expérience de voyage exceptionnelle. Nous l'avons testée sur le vol Paris-Papeete. Verdict ?

## Le siège : un vrai lit à 35 000 pieds

Le siège Poerava se transforme en lit full-flat de 2 mètres. Disposition en 1-2-1, donc accès direct couloir pour tous les passagers.

**Points forts** :
- Inclinaison 180° pour un sommeil réparateur
- Couette et oreiller haut de gamme
- Rangements nombreux
- Prise USB et électrique

## La gastronomie : un voyage culinaire

Le repas est signé par un chef polynésien. Au menu :
- **Entrée** : Tartare de thon rouge au citron vert et lait de coco
- **Plat** : Mahi-mahi grillé, riz coco et légumes du fenua
- **Dessert** : Po'e banane et glace vanille Tahiti

Le tout accompagné de champagne Billecart-Salmon à volonté.

## Le service : l'hospitalité polynésienne

L'équipage en tenue traditionnelle vous accueille avec un collier de fleurs. Le service est attentionné sans être intrusif. Le personnel parle français, anglais et tahitien.

## Le salon à l'aéroport

Accès au salon Air Tahiti Nui à CDG et à Faa'a :
- Douches
- Buffet chaud et froid
- Bar premium
- Espace travail

## Notre verdict

**Note globale : 9/10**

La Poerava Business Class est à la hauteur de sa réputation. Le rapport qualité-prix est excellent comparé aux autres compagnies long-courrier. Seul petit bémol : le wifi payant (mais qui dort 15h...).

**Prix** : À partir de 5500€ A/R Paris-Papeete

*Article programmé - Publication le 29/01/2026 - IA PACIFIK'AI*`,
  },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'bg-slate-100 text-slate-700' },
  published: { label: 'Publié', color: 'bg-emerald-100 text-emerald-700' },
  scheduled: { label: 'Programmé', color: 'bg-blue-100 text-blue-700' },
}

function ArticlePreviewModal({ article, onClose }: { article: ContentArticle; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-slate-50">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-atn-secondary/20 text-atn-secondary rounded-full text-sm font-medium">
              {article.topic}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[article.status].color}`}>
              {statusConfig[article.status].label}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Image */}
          {article.imageUrl && (
            <div className="relative h-64 bg-slate-200">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-white text-2xl font-bold">{article.title}</h1>
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="p-6 border-b bg-slate-50">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{article.readingTime} min de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>{article.wordCount} mots</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>SEO: <strong>{article.seoScore}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>GEO: <strong>{article.geoScore}%</strong></span>
              </div>
            </div>

            {/* Meta description */}
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <p className="text-xs text-slate-500 mb-1">Meta description</p>
              <p className="text-sm text-slate-700">{article.metaDescription}</p>
            </div>

            {/* Keywords */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-400" />
              {article.keywords.map(keyword => (
                <span key={keyword} className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Article body */}
          <div className="p-6">
            {!article.imageUrl && (
              <h1 className="text-2xl font-bold mb-6">{article.title}</h1>
            )}
            <div className="prose prose-slate max-w-none">
              {article.fullContent.split('\n').map((paragraph, i) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={i} className="text-2xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-atn-primary">{paragraph.slice(3)}</h2>
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{paragraph.slice(4)}</h3>
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <p key={i} className="font-semibold my-2">{paragraph.slice(2, -2)}</p>
                }
                if (paragraph.startsWith('- ')) {
                  return <li key={i} className="ml-4 my-1">{paragraph.slice(2)}</li>
                }
                if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                  return <p key={i} className="text-sm text-slate-500 italic my-4">{paragraph.slice(1, -1)}</p>
                }
                if (paragraph.startsWith('|')) {
                  return <p key={i} className="font-mono text-sm bg-slate-100 p-2 rounded my-2">{paragraph}</p>
                }
                if (paragraph === '---') {
                  return <hr key={i} className="my-6" />
                }
                if (paragraph.trim()) {
                  return <p key={i} className="my-3 leading-relaxed">{paragraph}</p>
                }
                return null
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gradient-to-r from-atn-primary to-[#0D1B2A] text-white">
            <p className="text-center text-sm opacity-80">
              Article généré par IA PACIFIK'AI • Optimisé SEO + GEO
            </p>
          </div>
        </div>

        {/* Action bar */}
        <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {article.status === 'scheduled' ? (
              <span>Publication prévue : {new Date(article.date).toLocaleString('fr-FR')}</span>
            ) : article.status === 'published' ? (
              <span>Publié le {new Date(article.date).toLocaleDateString('fr-FR')}</span>
            ) : (
              <span>Brouillon • Dernière modification {new Date(article.date).toLocaleDateString('fr-FR')}</span>
            )}
          </div>
          <div className="flex gap-2">
            {article.status === 'published' && (
              <button className="btn-primary flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Voir sur le site
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ article, onClick }: { article: ContentArticle; onClick: () => void }) {
  return (
    <div
      className="card cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex gap-4">
        {article.imageUrl ? (
          <div className="w-32 h-24 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Image className="w-8 h-8 text-slate-300" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="px-2 py-0.5 bg-atn-secondary/20 text-atn-secondary rounded text-xs">
                {article.topic}
              </span>
              <h3 className="font-semibold mt-1 line-clamp-1">{article.title}</h3>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig[article.status].color}`}>
              {statusConfig[article.status].label}
            </span>
          </div>

          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{article.excerpt}</p>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>SEO: <strong>{article.seoScore}%</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>GEO: <strong>{article.geoScore}%</strong></span>
            </div>
            <span className="text-slate-400">{article.wordCount} mots</span>
            <span className="text-slate-400 ml-auto text-xs">
              {new Date(article.date).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContentPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<ContentArticle | null>(null)

  const filteredArticles = filterStatus
    ? demoArticles.filter(a => a.status === filterStatus)
    : demoArticles

  // Stats
  const publishedCount = demoArticles.filter(a => a.status === 'published').length
  const avgSeoScore = Math.round(demoArticles.reduce((acc, a) => acc + a.seoScore, 0) / demoArticles.length)
  const totalWords = demoArticles.reduce((acc, a) => acc + a.wordCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FileText className="w-7 h-7 text-purple-500" />
            Content Factory SEO+GEO
          </h1>
          <p className="text-slate-500">Build 3: Génération d'articles optimisés • Cliquez pour lire l'article complet</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Nouvel article
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Articles publiés</p>
          <p className="text-2xl font-bold">{publishedCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Score SEO moyen</p>
          <p className="text-2xl font-bold text-emerald-600">{avgSeoScore}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Mots générés</p>
          <p className="text-2xl font-bold">{totalWords.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Images IA</p>
          <p className="text-2xl font-bold">{demoArticles.filter(a => a.imageUrl).length}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {[null, 'published', 'draft', 'scheduled'].map((status) => (
          <button
            key={status || 'all'}
            className={`px-4 py-2 rounded-lg text-sm ${filterStatus === status ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setFilterStatus(status)}
          >
            {status === null ? 'Tous' : statusConfig[status].label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredArticles.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => setSelectedArticle(article)}
          />
        ))}
      </div>

      {/* Article Preview Modal */}
      {selectedArticle && (
        <ArticlePreviewModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  )
}
