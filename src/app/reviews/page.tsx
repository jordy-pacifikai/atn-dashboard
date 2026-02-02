'use client'

import { useState } from 'react'
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Send, CheckCircle } from 'lucide-react'

// Types
interface Review {
  id: string
  platform: string
  author: string
  rating: number
  text: string
  sentiment: 'positive' | 'neutral' | 'negative'
  topics: string[]
  responseGenerated: string
  responseTone: string
  status: 'pending' | 'approved' | 'published' | 'rejected'
  date: string
}

// Données de démo
const demoReviews: Review[] = [
  {
    id: '1',
    platform: 'TripAdvisor',
    author: 'Jean-Pierre M.',
    rating: 5,
    text: 'Vol exceptionnel ! L\'équipage était aux petits soins et le repas à bord était délicieux. La classe Poerava Business est vraiment confortable pour un vol de nuit.',
    sentiment: 'positive',
    topics: ['Service', 'Repas', 'Confort'],
    responseGenerated: 'Cher Jean-Pierre, Toute l\'équipe d\'Air Tahiti Nui vous remercie chaleureusement pour ce magnifique retour ! Nous sommes ravis que votre expérience en classe Poerava Business ait été à la hauteur de vos attentes...',
    responseTone: 'Reconnaissant',
    status: 'approved',
    date: '2026-01-28T08:30:00',
  },
  {
    id: '2',
    platform: 'Google',
    author: 'Sarah L.',
    rating: 3,
    text: 'Le vol était correct mais 45 minutes de retard au départ. L\'équipage s\'est excusé mais aucune explication concrète n\'a été donnée.',
    sentiment: 'neutral',
    topics: ['Ponctualité', 'Service'],
    responseGenerated: 'Chère Sarah, Nous vous remercions pour votre retour et nous excusons sincèrement pour ce retard. Nous comprenons que cela puisse être frustrant...',
    responseTone: 'Empathique',
    status: 'pending',
    date: '2026-01-28T07:15:00',
  },
  {
    id: '3',
    platform: 'Skytrax',
    author: 'Michael T.',
    rating: 4,
    text: 'Great flight overall. The Dreamliner is a pleasure to fly in. Only small complaint is the entertainment system was a bit dated.',
    sentiment: 'positive',
    topics: ['Confort', 'Service'],
    responseGenerated: 'Dear Michael, Thank you for flying with Air Tahiti Nui and for your positive feedback about our Boeing 787-9 Dreamliner...',
    responseTone: 'Professionnel',
    status: 'published',
    date: '2026-01-27T22:00:00',
  },
  {
    id: '4',
    platform: 'TripAdvisor',
    author: 'Marie D.',
    rating: 2,
    text: 'Déçue par le service. Demande de siège spécial non prise en compte et bagages arrivés en retard.',
    sentiment: 'negative',
    topics: ['Service', 'Prix'],
    responseGenerated: 'Chère Marie, Nous sommes vraiment navrés d\'apprendre que votre expérience n\'a pas été satisfaisante. Nous prenons très au sérieux vos remarques concernant votre siège et vos bagages...',
    responseTone: 'Empathique',
    status: 'pending',
    date: '2026-01-27T18:30:00',
  },
]

// Composant étoiles
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
        />
      ))}
    </div>
  )
}

// Composant review card
function ReviewCard({ review, onApprove, onReject }: {
  review: Review
  onApprove: () => void
  onReject: () => void
}) {
  const [showResponse, setShowResponse] = useState(false)

  const platformColors: Record<string, string> = {
    TripAdvisor: 'bg-emerald-100 text-emerald-700',
    Google: 'bg-blue-100 text-blue-700',
    Skytrax: 'bg-purple-100 text-purple-700',
    Facebook: 'bg-indigo-100 text-indigo-700',
  }

  const sentimentIcons = {
    positive: <ThumbsUp className="w-4 h-4 text-emerald-600" />,
    neutral: <MessageCircle className="w-4 h-4 text-amber-600" />,
    negative: <ThumbsDown className="w-4 h-4 text-red-600" />,
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    published: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
  }

  const statusLabels: Record<string, string> = {
    pending: 'À valider',
    approved: 'Approuvé',
    published: 'Publié',
    rejected: 'Rejeté',
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${platformColors[review.platform]}`}>
            {review.platform}
          </span>
          <StarRating rating={review.rating} />
          {sentimentIcons[review.sentiment]}
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[review.status]}`}>
          {statusLabels[review.status]}
        </span>
      </div>

      {/* Avis */}
      <div className="mb-4">
        <p className="font-medium text-sm mb-1">{review.author}</p>
        <p className="text-slate-600 text-sm">{review.text}</p>
        <div className="flex gap-2 mt-2">
          {review.topics.map(topic => (
            <span key={topic} className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Réponse générée */}
      <div className="border-t border-slate-100 pt-4">
        <button
          className="flex items-center gap-2 text-sm text-atn-secondary hover:underline"
          onClick={() => setShowResponse(!showResponse)}
        >
          <MessageCircle className="w-4 h-4" />
          {showResponse ? 'Masquer la réponse' : 'Voir la réponse générée'}
        </button>

        {showResponse && (
          <div className="mt-3 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-slate-500">Ton:</span>
              <span className="px-2 py-0.5 bg-atn-secondary/20 text-atn-secondary rounded text-xs">
                {review.responseTone}
              </span>
            </div>
            <p className="text-sm text-slate-700">{review.responseGenerated}</p>

            {review.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                  onClick={onApprove}
                >
                  <CheckCircle className="w-4 h-4" />
                  Approuver
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300"
                  onClick={onReject}
                >
                  Rejeter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg text-sm hover:bg-opacity-90 ml-auto">
                  <Send className="w-4 h-4" />
                  Publier directement
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-400 mt-4">
        {new Date(review.date).toLocaleString('fr-FR')}
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(demoReviews)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const handleApprove = (id: string) => {
    setReviews(reviews.map(r =>
      r.id === id ? { ...r, status: 'approved' as const } : r
    ))
  }

  const handleReject = (id: string) => {
    setReviews(reviews.map(r =>
      r.id === id ? { ...r, status: 'rejected' as const } : r
    ))
  }

  const filteredReviews = filterStatus
    ? reviews.filter(r => r.status === filterStatus)
    : reviews

  // Stats
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
  const pendingCount = reviews.filter(r => r.status === 'pending').length
  const positiveCount = reviews.filter(r => r.sentiment === 'positive').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Star className="w-7 h-7 text-amber-400" />
            Avis Clients
          </h1>
          <p className="text-slate-500">Build 9: Review Responder</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Note moyenne</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold">{avgRating}</p>
            <StarRating rating={Math.round(parseFloat(avgRating))} />
          </div>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">À valider</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Avis positifs</p>
          <p className="text-2xl font-bold text-emerald-600">{positiveCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Total avis</p>
          <p className="text-2xl font-bold">{reviews.length}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {[null, 'pending', 'approved', 'published', 'rejected'].map((status) => (
          <button
            key={status || 'all'}
            className={`px-4 py-2 rounded-lg text-sm ${
              filterStatus === status ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'
            }`}
            onClick={() => setFilterStatus(status)}
          >
            {status === null ? 'Tous' :
             status === 'pending' ? 'À valider' :
             status === 'approved' ? 'Approuvés' :
             status === 'published' ? 'Publiés' : 'Rejetés'}
          </button>
        ))}
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {filteredReviews.map(review => (
          <ReviewCard
            key={review.id}
            review={review}
            onApprove={() => handleApprove(review.id)}
            onReject={() => handleReject(review.id)}
          />
        ))}
      </div>
    </div>
  )
}
