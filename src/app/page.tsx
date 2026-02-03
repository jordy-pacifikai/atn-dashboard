'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  Mail,
  Brain,
  Star,
  BarChart3,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Plane,
  Globe,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
  MousePointer,
  Send,
  RefreshCw,
  Play,
  Calendar,
  Target,
  Sparkles,
} from 'lucide-react'

// Agents IA actifs
const activeAgents = [
  {
    id: 'chatbot',
    name: 'Chatbot Tiare',
    icon: MessageSquare,
    status: 'active',
    description: 'Repond aux clients 24/7',
    stats: { today: 47, trend: +12 },
    href: '/conversations',
    color: 'blue',
  },
  {
    id: 'newsletter',
    name: 'Newsletter Engine',
    icon: Mail,
    status: 'active',
    description: 'Prochaine: dans 2 jours',
    stats: { sent: '2.4k', openRate: '32%' },
    href: '/newsletters',
    color: 'purple',
  },
  {
    id: 'competitor',
    name: 'Veille Concurrence',
    icon: Brain,
    status: 'active',
    description: '3 alertes cette semaine',
    stats: { alerts: 3, competitors: 5 },
    href: '/competitors',
    color: 'amber',
  },
  {
    id: 'reviews',
    name: 'Review Manager',
    icon: Star,
    status: 'active',
    description: '12 reponses generees',
    stats: { pending: 4, avgRating: 4.6 },
    href: '/reviews',
    color: 'yellow',
  },
  {
    id: 'content',
    name: 'Content Generator',
    icon: FileText,
    status: 'active',
    description: '8 articles ce mois',
    stats: { articles: 8, scheduled: 3 },
    href: '/content',
    color: 'green',
  },
  {
    id: 'reports',
    name: 'Auto Reports',
    icon: BarChart3,
    status: 'active',
    description: 'Prochain: lundi 8h',
    stats: { generated: 12, recipients: 5 },
    href: '/reports',
    color: 'indigo',
  },
]

// KPIs principaux
const kpis = [
  {
    label: 'Conversations',
    value: '1,247',
    change: '+18%',
    trend: 'up',
    period: 'ce mois',
    icon: MessageSquare,
  },
  {
    label: 'Temps economise',
    value: '42h',
    change: '+8h',
    trend: 'up',
    period: 'ce mois',
    icon: Clock,
  },
  {
    label: 'Satisfaction',
    value: '94%',
    change: '+3%',
    trend: 'up',
    period: 'vs mois dernier',
    icon: Star,
  },
  {
    label: 'Taux conversion',
    value: '12.4%',
    change: '+2.1%',
    trend: 'up',
    period: 'vs mois dernier',
    icon: Target,
  },
]

// Activites recentes
const recentActivities = [
  {
    id: 1,
    type: 'chat',
    icon: MessageSquare,
    title: 'Nouvelle conversation',
    description: 'Client interesse par Bora Bora (Japonais)',
    time: 'Il y a 5 min',
    color: 'blue',
  },
  {
    id: 2,
    type: 'alert',
    icon: Brain,
    title: 'Alerte prix concurrence',
    description: 'French Bee: -15% sur PPT-CDG',
    time: 'Il y a 23 min',
    color: 'amber',
  },
  {
    id: 3,
    type: 'review',
    icon: Star,
    title: 'Nouvel avis Google',
    description: '5 etoiles - "Service exceptionnel"',
    time: 'Il y a 1h',
    color: 'yellow',
  },
  {
    id: 4,
    type: 'content',
    icon: FileText,
    title: 'Article publie',
    description: '"10 raisons de visiter Tahiti en 2024"',
    time: 'Il y a 2h',
    color: 'green',
  },
  {
    id: 5,
    type: 'newsletter',
    icon: Send,
    title: 'Newsletter envoyee',
    description: '2,847 destinataires - 34% ouverture',
    time: 'Hier',
    color: 'purple',
  },
]

// Stats rapides vols
const flightStats = [
  { route: 'PPT-LAX', flights: 4, status: 'on-time', occupancy: '87%' },
  { route: 'PPT-CDG', flights: 3, status: 'on-time', occupancy: '92%' },
  { route: 'PPT-NRT', flights: 2, status: 'delayed', occupancy: '78%' },
  { route: 'PPT-AKL', flights: 2, status: 'on-time', occupancy: '85%' },
]

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Set initial time only on client to avoid hydration mismatch
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[--text-primary]">Dashboard</h1>
          <p className="text-sm text-[--text-secondary]">
            Bienvenue ! Vos agents IA sont actifs et travaillent pour vous.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[--text-tertiary]">
            {currentTime?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) || ''}
          </span>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg bg-[--bg-secondary] hover:bg-[--bg-tertiary] transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4 text-[--text-secondary]" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div data-guide="kpis-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[--atn-primary]/10 flex items-center justify-center">
                <kpi.icon className="w-5 h-5 text-[--atn-primary]" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                kpi.trend === 'up' ? 'text-[--atn-green]' : 'text-red-500'
              }`}>
                {kpi.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {kpi.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-[--text-primary]">{kpi.value}</p>
            <p className="text-xs text-[--text-tertiary] mt-1">{kpi.label} · {kpi.period}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Agents IA - 2 colonnes */}
        <div data-guide="agents-grid" className="col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[--text-primary]">Agents IA Actifs</h2>
              <p className="text-sm text-[--text-secondary]">6 agents travaillent en ce moment</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[--atn-green] rounded-full animate-pulse" />
              <span className="text-sm text-[--atn-green] font-medium">Tous operationnels</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {activeAgents.map((agent) => (
              <Link
                key={agent.id}
                href={agent.href}
                className="group p-4 bg-[--bg-secondary] rounded-xl hover:bg-[--bg-tertiary] transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${agent.color}-500/10`}>
                    <agent.icon className={`w-5 h-5 text-${agent.color}-500`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[--text-primary] group-hover:text-[--atn-primary] transition-colors">
                        {agent.name}
                      </h3>
                      <span className="w-1.5 h-1.5 bg-[--atn-green] rounded-full" />
                    </div>
                    <p className="text-xs text-[--text-tertiary] mt-0.5">{agent.description}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[--text-tertiary] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-[--border-primary] flex items-center gap-3">
            <Link
              href="/demo-site"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[--atn-primary] text-white rounded-lg hover:bg-[--atn-primary]/90 transition-colors font-medium"
            >
              <Play className="w-4 h-4" />
              Tester le chatbot
            </Link>
            <Link
              href="/reports"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[--bg-tertiary] text-[--text-primary] rounded-lg hover:bg-[--border-primary] transition-colors font-medium"
            >
              <BarChart3 className="w-4 h-4" />
              Voir les rapports
            </Link>
          </div>
        </div>

        {/* Activite recente - 1 colonne */}
        <div data-guide="activity-feed" className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[--text-primary]">Activite recente</h2>
            <Activity className="w-4 h-4 text-[--text-tertiary]" />
          </div>

          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-[--bg-secondary] rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${activity.color}-500/10`}>
                  <activity.icon className={`w-4 h-4 text-${activity.color}-500`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[--text-primary]">{activity.title}</p>
                  <p className="text-xs text-[--text-tertiary] truncate">{activity.description}</p>
                </div>
                <span className="text-[10px] text-[--text-tertiary] whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-[--atn-primary] hover:bg-[--bg-secondary] rounded-lg transition-colors">
            Voir toute l'activite
          </button>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Vols aujourd'hui */}
        <div data-guide="flights-widget" className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-[--atn-primary]" />
              <h2 className="font-semibold text-[--text-primary]">Vols aujourd'hui</h2>
            </div>
            <Link href="/flights" className="text-sm text-[--atn-primary] hover:underline">
              Voir tout
            </Link>
          </div>

          <div className="space-y-2">
            {flightStats.map((flight, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-[--bg-secondary] rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[--text-primary]">{flight.route}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    flight.status === 'on-time'
                      ? 'bg-[--atn-green]/10 text-[--atn-green]'
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {flight.status === 'on-time' ? 'A l\'heure' : 'Retard'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[--text-tertiary]">
                  <span>{flight.flights} vols</span>
                  <span className="font-medium text-[--text-secondary]">{flight.occupancy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance chatbot */}
        <div data-guide="chatbot-widget" className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[--atn-primary]" />
              <h2 className="font-semibold text-[--text-primary]">Chatbot Tiare</h2>
            </div>
            <span className="badge status-success">
              <span className="w-1.5 h-1.5 bg-current rounded-full" />
              En ligne
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[--text-secondary]">Conversations aujourd'hui</span>
              <span className="text-lg font-bold text-[--text-primary]">47</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[--text-secondary]">Taux de resolution</span>
              <span className="text-lg font-bold text-[--atn-green]">89%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[--text-secondary]">Temps moyen reponse</span>
              <span className="text-lg font-bold text-[--text-primary]">1.2s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[--text-secondary]">Langues utilisees</span>
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-0.5 bg-[--bg-secondary] rounded">FR</span>
                <span className="text-xs px-2 py-0.5 bg-[--bg-secondary] rounded">EN</span>
                <span className="text-xs px-2 py-0.5 bg-[--bg-secondary] rounded">JP</span>
              </div>
            </div>
          </div>

          <Link
            href="/demo-site"
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-[--atn-primary]/10 text-[--atn-primary] rounded-lg hover:bg-[--atn-primary]/20 transition-colors text-sm font-medium"
          >
            <Play className="w-4 h-4" />
            Tester maintenant
          </Link>
        </div>

        {/* Prochaines actions */}
        <div data-guide="upcoming-widget" className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[--atn-primary]" />
              <h2 className="font-semibold text-[--text-primary]">A venir</h2>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[--bg-secondary] rounded-lg border-l-2 border-purple-500">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[--text-primary]">Newsletter</span>
                <span className="text-xs text-[--text-tertiary]">Dans 2 jours</span>
              </div>
              <p className="text-xs text-[--text-secondary]">Offres Lune de miel - 2,847 destinataires</p>
            </div>

            <div className="p-3 bg-[--bg-secondary] rounded-lg border-l-2 border-indigo-500">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[--text-primary]">Rapport hebdo</span>
                <span className="text-xs text-[--text-tertiary]">Lundi 8h</span>
              </div>
              <p className="text-xs text-[--text-secondary]">KPIs automatiques envoyes a 5 destinataires</p>
            </div>

            <div className="p-3 bg-[--bg-secondary] rounded-lg border-l-2 border-green-500">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[--text-primary]">Article SEO</span>
                <span className="text-xs text-[--text-tertiary]">Mercredi</span>
              </div>
              <p className="text-xs text-[--text-secondary]">"Les meilleures periodes pour voyager a Tahiti"</p>
            </div>
          </div>

          <Link
            href="/calendar"
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-[--text-secondary] hover:text-[--atn-primary] transition-colors"
          >
            Voir le calendrier complet
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* CTA Reserve */}
      <div className="card p-6 bg-gradient-to-r from-[--atn-primary]/5 to-[--atn-secondary]/5 border-[--atn-primary]/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[--text-primary]">Des questions sur ce prototype ?</h3>
            <p className="text-sm text-[--text-secondary] mt-1">
              Reservez un appel de 15 minutes pour discuter de vos besoins specifiques.
            </p>
          </div>
          <a
            href="https://cal.com/pacifikai/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[--atn-primary] text-white rounded-xl hover:bg-[--atn-primary]/90 transition-colors font-medium"
          >
            <Calendar className="w-5 h-5" />
            Reserver un appel
          </a>
        </div>
      </div>
    </div>
  )
}
