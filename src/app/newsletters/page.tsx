'use client'

import { useState, useEffect } from 'react'
import { Mail, Send, Users, TrendingUp, Eye, X, ExternalLink, RefreshCw, Loader2 } from 'lucide-react'
import Modal from '@/components/Modal'

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

const fallbackNewsletters: NewsletterLog[] = [
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
  // Extract first name from email
  const firstName = newsletter.contact.split('@')[0].split('.')[0].charAt(0).toUpperCase() + newsletter.contact.split('@')[0].split('.')[0].slice(1)

  // Format content with line breaks
  const formattedContent = newsletter.fullContent.split('\n\n').map((paragraph, idx) => {
    // Check if it's a list (starts with •)
    if (paragraph.includes('•')) {
      const items = paragraph.split('•').filter(Boolean)
      return (
        <ul key={idx} className="my-4 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#2D3748]">
              <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-[#2CCCD4] to-[#C9A84C] flex-shrink-0"></span>
              <span>{item.trim()}</span>
            </li>
          ))}
        </ul>
      )
    }
    return <p key={idx} className="mb-4 text-[#2D3748] leading-relaxed">{paragraph}</p>
  })

  return (
    <Modal onClose={onClose}>
      <div className="bg-[#FBF9F7] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Email metadata bar */}
        <div className="p-4 bg-white border-b border-slate-100 text-sm space-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="text-slate-400 w-12">De:</span>
                <span className="text-slate-700">Air Tahiti Nui &lt;newsletter@airtahitinui.com&gt;</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 w-12">A:</span>
                <span className="text-slate-700">{newsletter.contact}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 w-12">Objet:</span>
                <span className="font-semibold text-[#0D2137]">{newsletter.subject}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Email Preview - Polynesian Theme */}
        <div className="flex-1 overflow-y-auto bg-[#FBF9F7] p-6">
          <div className="max-w-[600px] mx-auto bg-white rounded-3xl overflow-hidden shadow-xl">

            {/* ============================================
                HEADER with Wave Pattern
                ============================================ */}
            <div className="relative" style={{ background: 'linear-gradient(135deg, #0D2137 0%, #1a3a5c 50%, #1aa3aa 100%)' }}>
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-2 h-2 rounded-full bg-[#C9A84C] opacity-40 animate-pulse" style={{ left: '15%', top: '30%' }}></div>
                <div className="absolute w-1.5 h-1.5 rounded-full bg-[#C9A84C] opacity-30 animate-pulse" style={{ left: '75%', top: '40%', animationDelay: '1s' }}></div>
                <div className="absolute w-2 h-2 rounded-full bg-[#C9A84C] opacity-50 animate-pulse" style={{ left: '85%', top: '20%', animationDelay: '2s' }}></div>
              </div>

              {/* Header content */}
              <div className="relative z-10 text-center pt-10 pb-20 px-8">
                {/* Logo */}
                <img
                  src="/demo-site-content/images/logo_flower.svg"
                  alt="Air Tahiti Nui"
                  className="h-14 mx-auto mb-5"
                  onError={(e) => {
                    e.currentTarget.src = 'https://atn-demo-pacifikai.vercel.app/images/logo_flower.svg'
                  }}
                />

                {/* Headline */}
                <h1 className="text-white text-2xl font-serif mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  {newsletter.headline}
                </h1>

                {/* Subheadline */}
                <p className="text-white/80 text-sm">
                  Votre voyage de reve commence ici
                </p>
              </div>

              {/* Wave SVG divider */}
              <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
                  <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" fill="white"></path>
                </svg>
              </div>
            </div>

            {/* ============================================
                HERO IMAGE with Segment Badge
                ============================================ */}
            <div className="relative">
              <img
                src={newsletter.imageUrl}
                alt="Polynesie"
                className="w-full h-56 object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/60 to-transparent"></div>

              {/* Segment badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #E4C76B 100%)', color: '#0D2137' }}>
                  {newsletter.segment}
                </span>
              </div>
            </div>

            {/* ============================================
                EMAIL CONTENT
                ============================================ */}
            <div className="p-8">
              {/* Greeting */}
              <p className="text-[#2CCCD4] font-semibold text-lg mb-6">
                Ia Orana {firstName} !
              </p>

              {/* Main content */}
              <div className="text-base leading-relaxed">
                {formattedContent}
              </div>

              {/* Highlight box */}
              <div className="my-8 p-6 rounded-2xl border-l-4 border-[#2CCCD4]" style={{ background: 'linear-gradient(135deg, #F4F7F9 0%, #e8f4f5 100%)' }}>
                <p className="text-xs uppercase tracking-wider text-[#2CCCD4] font-bold mb-2">Points forts</p>
                <p className="text-[#0D2137] text-sm">Personnalisation {newsletter.personalizationScore}% • {newsletter.wordCount} mots • Segment {newsletter.segment}</p>
              </div>

              {/* CTA Button */}
              <div className="text-center mt-8">
                <a
                  href={newsletter.ctaUrl}
                  className="inline-block px-10 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:translate-y-[-2px] hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #C9A84C 0%, #E4C76B 100%)',
                    color: '#0D2137',
                    boxShadow: '0 8px 30px rgba(201, 168, 76, 0.4)'
                  }}
                >
                  {newsletter.ctaText}
                </a>
              </div>
            </div>

            {/* ============================================
                WAVE DIVIDER before Footer
                ============================================ */}
            <div className="relative h-12 bg-white overflow-hidden">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
                <path d="M0,40 C200,80 400,0 600,50 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="#0D2137"></path>
              </svg>
            </div>

            {/* ============================================
                FOOTER
                ============================================ */}
            <div className="p-8 text-center" style={{ background: 'linear-gradient(135deg, #0D2137 0%, #0a1929 100%)' }}>
              {/* Social icons placeholder */}
              <div className="flex justify-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs">f</span>
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs">in</span>
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs">X</span>
              </div>

              {/* Signature */}
              <p className="text-[#C9A84C] font-serif text-lg mb-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Mauruuru & Nana !
              </p>
              <p className="text-white/60 text-sm mb-6">
                L&apos;equipe Air Tahiti Nui
              </p>

              {/* Divider */}
              <div className="h-px bg-white/10 mb-6"></div>

              {/* Legal */}
              <p className="text-white/40 text-xs mb-2">
                Vous recevez cet email car vous etes inscrit a notre newsletter.
              </p>
              <p className="text-xs">
                <a href="#" className="text-[#2CCCD4] hover:underline">Se desinscrire</a>
                <span className="text-white/30 mx-2">|</span>
                <a href="#" className="text-[#2CCCD4] hover:underline">Preferences</a>
              </p>

              {/* PACIFIK'AI credit */}
              <p className="text-white/20 text-xs mt-6">
                Email personnalise par IA PACIFIK&apos;AI
              </p>
            </div>

          </div>
        </div>

        {/* Footer with stats */}
        <div className="p-4 border-t bg-white flex items-center justify-between">
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-slate-400">Perso:</span>
              <span className="ml-2 font-bold text-emerald-500">{newsletter.personalizationScore}%</span>
            </div>
            <div>
              <span className="text-slate-400">Engagement:</span>
              <span className="ml-2 font-bold text-[#2CCCD4]">{newsletter.engagementScore}%</span>
            </div>
            <div>
              <span className="text-slate-400">Mots:</span>
              <span className="ml-2 font-medium text-slate-600">{newsletter.wordCount}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[newsletter.status].color}`}>
            {statusConfig[newsletter.status].label}
          </span>
        </div>
      </div>
    </Modal>
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
  const [newsletters, setNewsletters] = useState<NewsletterLog[]>([])
  const [filterSegment, setFilterSegment] = useState<string | null>(null)
  const [selectedNewsletter, setSelectedNewsletter] = useState<NewsletterLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Fetch newsletters from Airtable
  const fetchNewsletters = async () => {
    try {
      const response = await fetch('/api/airtable?table=Newsletter_Logs&sortField=Date&sortDir=desc&limit=50')
      const data = await response.json()

      if (data.records && data.records.length > 0) {
        const mapped: NewsletterLog[] = data.records.map((record: { id: string; fields: Record<string, unknown> }) => {
          const segment = (record.fields.Segment as string) || 'General'
          // Find matching fallback for this segment to get rich content
          const fallback = fallbackNewsletters.find(f => f.segment === segment) || fallbackNewsletters[0]

          return {
            id: record.id,
            contact: (record.fields.Contact as string) || 'contact@email.com',
            segment,
            emailPreview: (record.fields.Email_Preview as string) || fallback.emailPreview,
            personalizationScore: (record.fields.Personalization_Score as number) || 80,
            engagementScore: (record.fields.Engagement_Score as number) || 70,
            wordCount: (record.fields.Word_Count as number) || fallback.wordCount,
            status: ((record.fields.Status as string)?.toLowerCase() || 'pending') as 'sent' | 'opened' | 'clicked' | 'pending',
            date: (record.fields.Date as string) || new Date().toISOString(),
            subject: (record.fields.Subject as string) || fallback.subject,
            headline: (record.fields.Headline as string) || fallback.headline,
            fullContent: (record.fields.Full_Content as string) || fallback.fullContent,
            imageUrl: (record.fields.Image_URL as string) || fallback.imageUrl,
            ctaText: (record.fields.CTA_Text as string) || fallback.ctaText,
            ctaUrl: (record.fields.CTA_URL as string) || fallback.ctaUrl,
          }
        })
        setNewsletters(mapped)
      } else {
        setNewsletters(fallbackNewsletters)
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
      setNewsletters(fallbackNewsletters)
    } finally {
      setLoading(false)
    }
  }

  // Sync newsletters (trigger n8n workflow)
  const syncNewsletters = async () => {
    setSyncing(true)
    try {
      await fetch('https://n8n.srv1140766.hstgr.cloud/webhook/atn-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' })
      })
      await fetchNewsletters()
    } catch (error) {
      console.error('Error syncing newsletters:', error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchNewsletters()
  }, [])

  const filteredNewsletters = filterSegment
    ? newsletters.filter(n => n.segment === filterSegment)
    : newsletters

  // Stats
  const totalSent = newsletters.filter(n => n.status !== 'pending').length
  const avgPersonalization = newsletters.length > 0 ? Math.round(newsletters.reduce((acc, n) => acc + n.personalizationScore, 0) / newsletters.length) : 0
  const openRate = totalSent > 0 ? Math.round((newsletters.filter(n => n.status === 'opened' || n.status === 'clicked').length / totalSent) * 100) : 0

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
        <button
          data-guide="news-btn-sync"
          onClick={syncNewsletters}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-atn-primary to-atn-secondary text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {syncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {syncing ? 'Sync...' : 'Synchroniser'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-guide="news-kpi-sent" className="card">
          <p className="text-sm text-slate-500">Emails envoyés</p>
          <p className="text-2xl font-bold">{totalSent}</p>
        </div>
        <div data-guide="news-kpi-perso" className="card">
          <p className="text-sm text-slate-500">Score perso. moyen</p>
          <p className="text-2xl font-bold text-emerald-600">{avgPersonalization}%</p>
        </div>
        <div data-guide="news-kpi-openrate" className="card">
          <p className="text-sm text-slate-500">Taux d'ouverture</p>
          <p className="text-2xl font-bold text-blue-600">{openRate}%</p>
        </div>
        <div data-guide="news-kpi-segments" className="card">
          <p className="text-sm text-slate-500">Segments actifs</p>
          <p className="text-2xl font-bold">5</p>
        </div>
      </div>

      <div data-guide="news-filters" className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm ${!filterSegment ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilterSegment(null)}
        >
          Tous
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm ${filterSegment === 'Lune de miel' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilterSegment('Lune de miel')}
        >
          Lune de miel
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm ${filterSegment === 'Famille' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilterSegment('Famille')}
        >
          Famille
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm ${filterSegment === 'Plongeurs' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilterSegment('Plongeurs')}
        >
          Plongeurs
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm ${filterSegment === 'Business' ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilterSegment('Business')}
        >
          Business
        </button>
      </div>

      <div data-guide="news-newsletters-list" className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atn-primary" />
            <span className="ml-3 text-slate-500">Chargement des newsletters...</span>
          </div>
        ) : filteredNewsletters.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Aucune newsletter trouvée
          </div>
        ) : (
          filteredNewsletters.map(newsletter => (
            <NewsletterCard
              key={newsletter.id}
              newsletter={newsletter}
              onClick={() => setSelectedNewsletter(newsletter)}
            />
          ))
        )}
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
