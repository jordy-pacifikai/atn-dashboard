'use client'

import { useState } from 'react'
import { Mail, Send, Users, TrendingUp, Eye, X, ExternalLink } from 'lucide-react'

interface NewsletterLog {
  id: string
  contact: string
  segment: string
  emailPreview: string
  personalizationScore: number
  engagementScore: number
  wordCount: number
  status: 'sent' | 'opened' | 'clicked' | 'pending'
  date: string
  // Full email content
  subject: string
  headline: string
  fullContent: string
  imageUrl: string
  ctaText: string
  ctaUrl: string
}

const demoNewsletters: NewsletterLog[] = [
  {
    id: '1',
    contact: 'marie.dupont@email.com',
    segment: 'Lune de miel',
    emailPreview: 'Votre escapade romantique à Bora Bora vous attend... Découvrez nos offres exclusives pour les couples...',
    personalizationScore: 92,
    engagementScore: 85,
    wordCount: 245,
    status: 'opened',
    date: '2026-01-28T10:30:00',
    subject: '🌺 Marie, votre lune de miel de rêve à Bora Bora vous attend',
    headline: 'Ia Orana Marie ! Vivez la magie polynésienne à deux',
    fullContent: `Nous sommes ravis de vous accompagner dans la préparation de votre voyage romantique ! En tant que future mariée, vous méritez une escapade exceptionnelle, teintée de la douceur de vivre polynésienne.

Imaginez-vous au réveil dans un bungalow sur pilotis, les pieds dans l'eau turquoise du lagon de Bora Bora. Le soleil se lève doucement sur le Mont Otemanu tandis que votre petit-déjeuner arrive en pirogue...

Nous avons sélectionné pour vous les expériences les plus romantiques :
• Dîner privé sur un motu désert sous les étoiles
• Massage en couple dans un spa avec vue sur le lagon
• Croisière au coucher du soleil avec champagne
• Excursion snorkeling avec les raies mantas

Notre offre spéciale "Lune de Miel" inclut un surclassement gratuit en Poerava Business Class pour votre vol, vous permettant d'arriver reposés et déjà dans l'ambiance polynésienne.`,
    imageUrl: 'https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=800',
    ctaText: 'Découvrir notre offre Lune de Miel',
    ctaUrl: 'https://www.airtahitinui.com/honeymoon',
  },
  {
    id: '2',
    contact: 'jean.martin@email.com',
    segment: 'Famille',
    emailPreview: 'Vacances en famille à Moorea : créez des souvenirs inoubliables avec vos enfants...',
    personalizationScore: 88,
    engagementScore: 72,
    wordCount: 312,
    status: 'clicked',
    date: '2026-01-28T09:15:00',
    subject: '👨‍👩‍👧‍👦 Jean, des vacances en famille inoubliables à Moorea',
    headline: 'Ia Orana Jean ! Créez des souvenirs magiques avec vos enfants',
    fullContent: `Bienvenue dans la famille Air Tahiti Nui ! Nous savons à quel point les vacances en famille sont précieuses, et nous avons tout prévu pour que petits et grands passent des moments inoubliables.

Moorea, l'île sœur de Tahiti, est la destination idéale pour les familles :
• Plages de sable blanc sécurisées pour les enfants
• Activités nautiques adaptées à tous les âges
• Rencontre avec les dauphins et tortues
• Randonnées faciles dans les vallées luxuriantes

Nos partenaires hôteliers proposent des clubs enfants et des activités supervisées, vous permettant aussi de profiter de moments en couple pendant que vos petits s'amusent.

Le plus pour les familles : les enfants de moins de 12 ans bénéficient de -50% sur leur billet d'avion, et les bagages supplémentaires pour le matériel bébé sont offerts !`,
    imageUrl: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=800',
    ctaText: 'Voir les offres Famille',
    ctaUrl: 'https://www.airtahitinui.com/family',
  },
  {
    id: '3',
    contact: 'pierre.lefevre@email.com',
    segment: 'Plongeurs',
    emailPreview: 'Rangiroa et Fakarava : les plus beaux sites de plongée du monde vous attendent...',
    personalizationScore: 95,
    engagementScore: 90,
    wordCount: 287,
    status: 'sent',
    date: '2026-01-28T08:45:00',
    subject: '🤿 Pierre, plongez dans les eaux mythiques de Rangiroa',
    headline: 'Ia Orana Pierre ! Les requins et dauphins vous attendent',
    fullContent: `Vous êtes passionné de plongée ? Alors préparez-vous à vivre l'expérience ultime dans les Tuamotu, considérés par Jacques Cousteau comme l'un des plus beaux aquariums naturels du monde.

Rangiroa et Fakarava offrent des conditions de plongée exceptionnelles :
• Passes mythiques avec courants et requins gris
• Mur de requins marteaux à Fakarava Sud
• Dauphins résidents dans le lagon
• Visibilité de 40m+ toute l'année

Notre programme "Plongeurs" inclut :
• 10 plongées avec les meilleurs centres certifiés
• Équipement haut de gamme fourni
• Hébergement en pension de plongeurs
• Transferts inter-îles inclus

Période idéale : de novembre à avril pour les requins marteaux. Mais Rangiroa offre des plongées exceptionnelles toute l'année avec ses résidents : requins gris, napoléons, et bancs de barracudas.`,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    ctaText: 'Réserver mon séjour plongée',
    ctaUrl: 'https://www.airtahitinui.com/diving',
  },
  {
    id: '4',
    contact: 'sophie.bernard@business.com',
    segment: 'Business',
    emailPreview: 'Voyagez en Poerava Business Class : productivité et confort pour vos déplacements professionnels...',
    personalizationScore: 78,
    engagementScore: 65,
    wordCount: 198,
    status: 'pending',
    date: '2026-01-28T08:00:00',
    subject: '✈️ Sophie, découvrez le confort Poerava Business Class',
    headline: 'Ia Orana Sophie ! Voyagez business avec l\'élégance polynésienne',
    fullContent: `En tant que professionnelle, votre temps est précieux. C'est pourquoi notre cabine Poerava Business Class a été conçue pour allier productivité et bien-être.

Nos services Business :
• Siège-lit full flat de 2m avec accès direct couloir
• WiFi haut débit pour rester connectée
• Repas gastronomique signé chef polynésien
• Salon exclusif à l'aéroport avec douches
• Fast Track pour vos correspondances

Votre bien-être en vol :
• Kit de confort Clarins exclusif
• Couette et oreiller premium
• Champagne Billecart-Salmon à volonté
• Écran 18" avec contenu business

Arrivez à destination reposée et prête pour vos rendez-vous importants. Le décalage horaire se fait à peine sentir grâce à notre programme anti-jet lag.`,
    imageUrl: 'https://images.unsplash.com/photo-1540339832862-474599807836?w=800',
    ctaText: 'Découvrir Poerava Business',
    ctaUrl: 'https://www.airtahitinui.com/business',
  },
]

const segmentColors: Record<string, string> = {
  'Lune de miel': 'bg-pink-100 text-pink-700',
  'Famille': 'bg-blue-100 text-blue-700',
  'Plongeurs': 'bg-cyan-100 text-cyan-700',
  'Business': 'bg-slate-100 text-slate-700',
  'General': 'bg-purple-100 text-purple-700',
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700' },
  sent: { label: 'Envoyé', color: 'bg-blue-100 text-blue-700' },
  opened: { label: 'Ouvert', color: 'bg-emerald-100 text-emerald-700' },
  clicked: { label: 'Cliqué', color: 'bg-purple-100 text-purple-700' },
}

function EmailPreviewModal({ newsletter, onClose }: { newsletter: NewsletterLog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-slate-50">
          <div>
            <h2 className="font-bold text-lg">Aperçu de l'email</h2>
            <p className="text-sm text-slate-500">Envoyé à {newsletter.contact}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Preview */}
        <div className="flex-1 overflow-y-auto">
          {/* Email metadata */}
          <div className="p-4 bg-slate-100 border-b text-sm space-y-1">
            <div className="flex gap-2">
              <span className="text-slate-500 w-16">De:</span>
              <span>Air Tahiti Nui &lt;newsletter@pacifikai.com&gt;</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500 w-16">À:</span>
              <span>{newsletter.contact}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500 w-16">Objet:</span>
              <span className="font-medium">{newsletter.subject}</span>
            </div>
          </div>

          {/* Rendered Email Template */}
          <div className="bg-[#f5f5f5] p-6">
            <div className="max-w-[600px] mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
              {/* Email Header */}
              <div className="bg-gradient-to-r from-[#1B365D] to-[#0D1B2A] p-8 text-center">
                <img
                  src="https://www.airtahitinui.com/sites/default/files/styles/logo/public/2021-08/logo-atn.png"
                  alt="Air Tahiti Nui"
                  className="h-12 mx-auto mb-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <h1 className="text-[#D4AF37] text-2xl font-light">{newsletter.headline}</h1>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <img
                  src={newsletter.imageUrl}
                  alt="Polynésie"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${segmentColors[newsletter.segment]}`}>
                    {newsletter.segment}
                  </span>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-8">
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {newsletter.fullContent}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-8">
                  <a
                    href={newsletter.ctaUrl}
                    className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-[#1B365D] px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
                  >
                    {newsletter.ctaText}
                  </a>
                </div>
              </div>

              {/* Email Footer */}
              <div className="bg-[#1B365D] p-6 text-center">
                <p className="text-[#D4AF37] text-sm mb-2">Équipe Air Tahiti Nui</p>
                <p className="text-slate-400 text-xs">Email généré par IA PACIFIK'AI</p>
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <p className="text-slate-500 text-xs">
                    Vous recevez cet email car vous êtes inscrit à notre newsletter.<br />
                    <a href="#" className="text-[#D4AF37] hover:underline">Se désinscrire</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with stats */}
        <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-slate-500">Score perso:</span>
              <span className="ml-2 font-bold text-emerald-600">{newsletter.personalizationScore}%</span>
            </div>
            <div>
              <span className="text-slate-500">Engagement:</span>
              <span className="ml-2 font-bold text-blue-600">{newsletter.engagementScore}%</span>
            </div>
            <div>
              <span className="text-slate-500">Mots:</span>
              <span className="ml-2 font-medium">{newsletter.wordCount}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[newsletter.status].color}`}>
            {statusConfig[newsletter.status].label}
          </span>
        </div>
      </div>
    </div>
  )
}

function NewsletterCard({ newsletter, onClick }: { newsletter: NewsletterLog; onClick: () => void }) {
  return (
    <div
      className="card cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-atn-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-atn-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{newsletter.contact}</p>
            <span className={`px-2 py-0.5 rounded text-xs ${segmentColors[newsletter.segment]}`}>
              {newsletter.segment}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig[newsletter.status].color}`}>
            {statusConfig[newsletter.status].label}
          </span>
          <Eye className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      <p className="text-sm font-medium text-slate-800 mb-1">{newsletter.subject}</p>
      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{newsletter.emailPreview}</p>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <span>Perso: <strong className="text-emerald-600">{newsletter.personalizationScore}%</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-slate-400" />
          <span>Engagement: <strong className="text-blue-600">{newsletter.engagementScore}%</strong></span>
        </div>
        <div className="text-slate-400">
          {newsletter.wordCount} mots
        </div>
        <div className="ml-auto text-xs text-slate-400">
          {new Date(newsletter.date).toLocaleString('fr-FR')}
        </div>
      </div>
    </div>
  )
}

export default function NewslettersPage() {
  const [filterSegment, setFilterSegment] = useState<string | null>(null)
  const [selectedNewsletter, setSelectedNewsletter] = useState<NewsletterLog | null>(null)

  const filteredNewsletters = filterSegment
    ? demoNewsletters.filter(n => n.segment === filterSegment)
    : demoNewsletters

  // Stats
  const totalSent = demoNewsletters.filter(n => n.status !== 'pending').length
  const avgPersonalization = Math.round(demoNewsletters.reduce((acc, n) => acc + n.personalizationScore, 0) / demoNewsletters.length)
  const openRate = Math.round((demoNewsletters.filter(n => n.status === 'opened' || n.status === 'clicked').length / totalSent) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Mail className="w-7 h-7 text-pink-500" />
            Newsletters Personnalisées
          </h1>
          <p className="text-slate-500">Build 2: Hyper-personnalisation par segment • Cliquez pour voir l'email complet</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Send className="w-4 h-4" />
          Nouvelle campagne
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Emails envoyés</p>
          <p className="text-2xl font-bold">{totalSent}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Score perso. moyen</p>
          <p className="text-2xl font-bold text-emerald-600">{avgPersonalization}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Taux d'ouverture</p>
          <p className="text-2xl font-bold text-blue-600">{openRate}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Segments actifs</p>
          <p className="text-2xl font-bold">5</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm ${!filterSegment ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilterSegment(null)}
        >
          Tous
        </button>
        {['Lune de miel', 'Famille', 'Plongeurs', 'Business'].map(segment => (
          <button
            key={segment}
            className={`px-4 py-2 rounded-lg text-sm ${filterSegment === segment ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setFilterSegment(segment)}
          >
            {segment}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNewsletters.map(newsletter => (
          <NewsletterCard
            key={newsletter.id}
            newsletter={newsletter}
            onClick={() => setSelectedNewsletter(newsletter)}
          />
        ))}
      </div>

      {/* Email Preview Modal */}
      {selectedNewsletter && (
        <EmailPreviewModal
          newsletter={selectedNewsletter}
          onClose={() => setSelectedNewsletter(null)}
        />
      )}
    </div>
  )
}
