'use client'

import { useState } from 'react'
import { ShoppingCart, TrendingUp, DollarSign, Target, Send } from 'lucide-react'

interface UpsellOffer {
  id: string
  customerEmail: string
  customerSegment: string
  bookingValue: number
  offerType: string
  offerValue: number
  personalizationScore: number
  offerText: string
  status: 'sent' | 'opened' | 'clicked' | 'converted' | 'ignored'
  revenueGenerated: number
  date: string
}

const demoOffers: UpsellOffer[] = [
  {
    id: '1',
    customerEmail: 'marie.dupont@email.com',
    customerSegment: 'Lune de miel',
    bookingValue: 650000,
    offerType: 'Upgrade classe',
    offerValue: 180000,
    personalizationScore: 94,
    offerText: 'Pour votre voyage de noces, profitez de notre offre exclusive: Upgrade en Poerava Business à -30%. Siège lit, champagne, et service personnalisé pour un vol inoubliable vers votre paradis...',
    status: 'converted',
    revenueGenerated: 180000,
    date: '2026-01-28T10:30:00',
  },
  {
    id: '2',
    customerEmail: 'jean.martin@email.com',
    customerSegment: 'Famille',
    bookingValue: 890000,
    offerType: 'Pack excursion',
    offerValue: 120000,
    personalizationScore: 88,
    offerText: 'Rendez vos vacances en famille encore plus magiques ! Pack "Découverte Moorea" inclus: snorkeling avec les raies, visite de la vallée de Opunohu, et déjeuner au bord du lagon...',
    status: 'clicked',
    revenueGenerated: 0,
    date: '2026-01-28T09:45:00',
  },
  {
    id: '3',
    customerEmail: 'pierre.lefevre@email.com',
    customerSegment: 'Plongeurs',
    bookingValue: 520000,
    offerType: 'Bagage supplémentaire',
    offerValue: 25000,
    personalizationScore: 92,
    offerText: 'Plongeur passionné ? Ajoutez un bagage spécial équipement de plongée (20kg) à votre réservation pour seulement 25,000 XPF. Votre matériel voyage en sécurité...',
    status: 'sent',
    revenueGenerated: 0,
    date: '2026-01-28T09:15:00',
  },
  {
    id: '4',
    customerEmail: 'sophie.bernard@business.com',
    customerSegment: 'Business',
    bookingValue: 380000,
    offerType: 'Lounge accès',
    offerValue: 15000,
    personalizationScore: 78,
    offerText: 'Optimisez votre temps avant le vol ! Accès au salon Air Tahiti Nui: wifi haut débit, espace de travail, rafraîchissements et douches. Idéal pour préparer votre réunion...',
    status: 'opened',
    revenueGenerated: 0,
    date: '2026-01-28T08:30:00',
  },
  {
    id: '5',
    customerEmail: 'antoine.roux@email.com',
    customerSegment: 'General',
    bookingValue: 420000,
    offerType: 'Siège premium',
    offerValue: 35000,
    personalizationScore: 82,
    offerText: 'Vol long-courrier vers LA ? Réservez votre siège avec plus d\'espace aux jambes (XL Seat) pour seulement 35,000 XPF. +10cm d\'espace pour un confort optimal...',
    status: 'ignored',
    revenueGenerated: 0,
    date: '2026-01-28T08:00:00',
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
  sent: { label: 'Envoyé', color: 'bg-blue-100 text-blue-700' },
  opened: { label: 'Ouvert', color: 'bg-amber-100 text-amber-700' },
  clicked: { label: 'Cliqué', color: 'bg-orange-100 text-orange-700' },
  converted: { label: 'Converti', color: 'bg-emerald-100 text-emerald-700' },
  ignored: { label: 'Ignoré', color: 'bg-slate-100 text-slate-700' },
}

const offerTypeColors: Record<string, string> = {
  'Upgrade classe': 'bg-purple-100 text-purple-700',
  'Pack excursion': 'bg-emerald-100 text-emerald-700',
  'Bagage supplémentaire': 'bg-blue-100 text-blue-700',
  'Lounge accès': 'bg-amber-100 text-amber-700',
  'Siège premium': 'bg-cyan-100 text-cyan-700',
  'Assurance': 'bg-red-100 text-red-700',
}

function OfferCard({ offer }: { offer: UpsellOffer }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`card ${offer.status === 'converted' ? 'border-l-4 border-emerald-500' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-atn-primary/10 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-atn-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{offer.customerEmail}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-2 py-0.5 rounded text-xs ${segmentColors[offer.customerSegment]}`}>
                {offer.customerSegment}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs ${offerTypeColors[offer.offerType] || 'bg-slate-100'}`}>
                {offer.offerType}
              </span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig[offer.status].color}`}>
          {statusConfig[offer.status].label}
        </span>
      </div>

      <div
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <p className={`text-sm text-slate-600 ${expanded ? '' : 'line-clamp-2'}`}>
          {offer.offerText}
        </p>
      </div>

      <div className="flex items-center gap-6 mt-4 text-sm">
        <div>
          <span className="text-slate-500">Réservation:</span>
          <span className="font-medium ml-1">{(offer.bookingValue / 1000).toFixed(0)}k XPF</span>
        </div>
        <div>
          <span className="text-slate-500">Offre:</span>
          <span className="font-medium ml-1 text-atn-primary">{(offer.offerValue / 1000).toFixed(0)}k XPF</span>
        </div>
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4 text-slate-400" />
          <span>Score: <strong className="text-emerald-600">{offer.personalizationScore}%</strong></span>
        </div>
        {offer.revenueGenerated > 0 && (
          <div className="flex items-center gap-1 text-emerald-600 font-medium ml-auto">
            <DollarSign className="w-4 h-4" />
            +{(offer.revenueGenerated / 1000).toFixed(0)}k XPF
          </div>
        )}
      </div>

      <div className="text-xs text-slate-400 mt-3">
        {new Date(offer.date).toLocaleString('fr-FR')}
      </div>
    </div>
  )
}

export default function UpsellPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filteredOffers = filterStatus
    ? demoOffers.filter(o => o.status === filterStatus)
    : demoOffers

  // Stats
  const totalOffers = demoOffers.length
  const convertedCount = demoOffers.filter(o => o.status === 'converted').length
  const conversionRate = Math.round((convertedCount / totalOffers) * 100)
  const totalRevenue = demoOffers.reduce((acc, o) => acc + o.revenueGenerated, 0)
  const avgScore = Math.round(demoOffers.reduce((acc, o) => acc + o.personalizationScore, 0) / totalOffers)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-orange-500" />
            Upsell Engine
          </h1>
          <p className="text-slate-500">Build 10: Offres personnalisées intelligentes</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Send className="w-4 h-4" />
          Nouvelle campagne
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Offres envoyées</p>
          <p className="text-2xl font-bold">{totalOffers}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Taux de conversion</p>
          <p className="text-2xl font-bold text-emerald-600">{conversionRate}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Revenu généré</p>
          <p className="text-2xl font-bold text-emerald-600">{(totalRevenue / 1000).toFixed(0)}k XPF</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Score perso. moyen</p>
          <p className="text-2xl font-bold">{avgScore}%</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm ${!filterStatus ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilterStatus(null)}
        >
          Tous
        </button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg text-sm ${filterStatus === status ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setFilterStatus(status)}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOffers.map(offer => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  )
}
