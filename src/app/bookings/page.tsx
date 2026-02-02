'use client'

import { useState } from 'react'
import { Plane, Users, Calendar, CreditCard, MessageSquare } from 'lucide-react'

interface BookingRequest {
  id: string
  sessionId: string
  requestType: 'reservation' | 'modification' | 'cancellation' | 'information'
  route: string
  class: string
  passengers: number
  request: string
  response: string
  status: 'completed' | 'pending' | 'failed'
  date: string
}

const demoBookings: BookingRequest[] = [
  {
    id: '1',
    sessionId: 'ses_booking_001',
    requestType: 'reservation',
    route: 'PPT-LAX',
    class: 'Poerava Business',
    passengers: 2,
    request: 'Je souhaite réserver 2 billets en Business pour Los Angeles le 15 mars',
    response: 'J\'ai trouvé plusieurs options pour votre vol PPT-LAX le 15 mars en Poerava Business Class pour 2 passagers. Le vol TN1 décolle à 23h55 avec arrivée à 10h30 le lendemain. Prix total: 1,245,000 XPF. Souhaitez-vous que je procède à la réservation ?',
    status: 'completed',
    date: '2026-01-28T10:30:00',
  },
  {
    id: '2',
    sessionId: 'ses_booking_002',
    requestType: 'modification',
    route: 'PPT-CDG',
    class: 'Moana Economy',
    passengers: 1,
    request: 'Je dois changer ma date de retour du 20 au 25 avril',
    response: 'J\'ai vérifié votre réservation. Le changement de date du 20 au 25 avril est possible. Des frais de modification de 15,000 XPF s\'appliquent selon votre tarif. Le nouveau vol TN8 du 25 avril est disponible. Voulez-vous confirmer ce changement ?',
    status: 'completed',
    date: '2026-01-28T09:45:00',
  },
  {
    id: '3',
    sessionId: 'ses_booking_003',
    requestType: 'information',
    route: 'PPT-NRT',
    class: 'Moana Premium',
    passengers: 4,
    request: 'Quels sont les tarifs famille pour Tokyo en Premium ?',
    response: 'Pour une famille de 4 personnes en Moana Premium vers Tokyo, voici nos meilleures offres: Tarif Famille -10% sur le 2ème adulte et -25% sur les enfants. Pour un départ en avril, comptez environ 890,000 XPF pour 4 personnes. Je peux vous faire une simulation précise si vous me donnez vos dates.',
    status: 'pending',
    date: '2026-01-28T09:15:00',
  },
  {
    id: '4',
    sessionId: 'ses_booking_004',
    requestType: 'cancellation',
    route: 'PPT-AKL',
    class: 'Moana Economy',
    passengers: 1,
    request: 'Je dois annuler mon vol pour Auckland suite à une urgence',
    response: 'Je comprends et je suis désolé pour cette situation. J\'ai vérifié votre réservation TN7 du 10 février vers Auckland. Selon votre tarif Flex, l\'annulation est possible avec un remboursement de 85% sous forme d\'avoir. Voulez-vous que je procède à l\'annulation ?',
    status: 'completed',
    date: '2026-01-28T08:30:00',
  },
]

const requestTypeConfig: Record<string, { label: string; color: string; icon: any }> = {
  reservation: { label: 'Réservation', color: 'bg-emerald-100 text-emerald-700', icon: CreditCard },
  modification: { label: 'Modification', color: 'bg-amber-100 text-amber-700', icon: Calendar },
  cancellation: { label: 'Annulation', color: 'bg-red-100 text-red-700', icon: Plane },
  information: { label: 'Information', color: 'bg-blue-100 text-blue-700', icon: MessageSquare },
}

const classColors: Record<string, string> = {
  'Poerava Business': 'bg-purple-100 text-purple-700',
  'Moana Premium': 'bg-blue-100 text-blue-700',
  'Moana Economy': 'bg-slate-100 text-slate-700',
}

function BookingCard({ booking }: { booking: BookingRequest }) {
  const [expanded, setExpanded] = useState(false)
  const config = requestTypeConfig[booking.requestType]
  const Icon = config.icon

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
                {config.label}
              </span>
              <span className="text-sm font-bold">{booking.route}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <span className={`px-2 py-0.5 rounded text-xs ${classColors[booking.class]}`}>
                {booking.class}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {booking.passengers} pax
              </span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
          booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
          'bg-red-100 text-red-700'
        }`}>
          {booking.status === 'completed' ? 'Traité' : booking.status === 'pending' ? 'En cours' : 'Échec'}
        </span>
      </div>

      <div
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <p className="text-sm text-slate-600 mb-2">
          <strong>Demande:</strong> {booking.request}
        </p>

        {expanded && (
          <div className="p-3 bg-atn-secondary/10 rounded-lg mt-3">
            <p className="text-sm">
              <strong>Réponse IA:</strong> {booking.response}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
        <span>Session: {booking.sessionId}</span>
        <span>{new Date(booking.date).toLocaleString('fr-FR')}</span>
      </div>
    </div>
  )
}

export default function BookingsPage() {
  const [filterType, setFilterType] = useState<string | null>(null)

  const filteredBookings = filterType
    ? demoBookings.filter(b => b.requestType === filterType)
    : demoBookings

  // Stats
  const totalRequests = demoBookings.length
  const completedCount = demoBookings.filter(b => b.status === 'completed').length
  const reservationCount = demoBookings.filter(b => b.requestType === 'reservation').length
  const totalPassengers = demoBookings.reduce((acc, b) => acc + b.passengers, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Plane className="w-7 h-7 text-cyan-500" />
            Booking Assistant
          </h1>
          <p className="text-slate-500">Build 5: Assistant de réservation intelligent</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Demandes aujourd'hui</p>
          <p className="text-2xl font-bold">{totalRequests}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Traitées</p>
          <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Nouvelles réservations</p>
          <p className="text-2xl font-bold">{reservationCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Passagers concernés</p>
          <p className="text-2xl font-bold">{totalPassengers}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm ${!filterType ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilterType(null)}
        >
          Tous
        </button>
        {Object.entries(requestTypeConfig).map(([type, config]) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-lg text-sm ${filterType === type ? 'bg-atn-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setFilterType(type)}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredBookings.map(booking => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  )
}
