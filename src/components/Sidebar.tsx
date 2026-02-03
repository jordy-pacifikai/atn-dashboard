'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  MessageSquare,
  Mail,
  FileText,
  Star,
  BarChart3,
  Brain,
  Play,
  Users,
  Plane,
  Calendar,
  Target,
  TrendingUp,
  Zap,
  Settings,
  Sparkles,
  Image as ImageIcon,
  Route,
  CreditCard,
  Headphones,
  HelpCircle,
} from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'

// Types pour la navigation
interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  roi?: string
  badge?: string
  highlight?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

// Navigation complete avec toutes les fonctionnalites
const navigationGroups: NavGroup[] = [
  {
    label: 'Accueil',
    items: [
      {
        name: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        description: 'Vue d\'ensemble',
        roi: '+35% productivite',
      },
      {
        name: 'Demo Site',
        href: '/demo-site',
        icon: Play,
        description: 'Tester le chatbot',
        highlight: true,
      },
    ],
  },
  {
    label: 'Agents IA',
    items: [
      {
        name: 'Chatbot Tiare',
        href: '/conversations',
        icon: MessageSquare,
        description: 'Conversations clients',
        roi: '40h/mois economisees',
        badge: 'LIVE',
      },
      {
        name: 'Concierge Pro',
        href: '/concierge-pro',
        icon: Headphones,
        description: 'Support premium',
        roi: '+45% satisfaction',
      },
      {
        name: 'Staff Assistant',
        href: '/staff-assistant',
        icon: Users,
        description: 'Aide aux employes',
        roi: '-30% temps formation',
      },
    ],
  },
  {
    label: 'Marketing Automatise',
    items: [
      {
        name: 'Newsletters',
        href: '/newsletters',
        icon: Mail,
        description: 'Campagnes auto',
        roi: '+25% ouverture',
        badge: 'LIVE',
      },
      {
        name: 'Contenu SEO',
        href: '/content',
        icon: FileText,
        description: 'Articles de blog',
        roi: '+40% trafic organique',
      },
      {
        name: 'Social Media',
        href: '/social',
        icon: Sparkles,
        description: 'Posts automatiques',
        roi: '+50% engagement',
      },
      {
        name: 'Visual Factory',
        href: '/visual-factory',
        icon: ImageIcon,
        description: 'Creation visuels',
        roi: '10h/mois economisees',
      },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      {
        name: 'Veille Concurrence',
        href: '/competitors',
        icon: Brain,
        description: 'Alertes prix',
        roi: 'Reagir en 24h',
        badge: 'LIVE',
      },
      {
        name: 'Gestion Avis',
        href: '/reviews',
        icon: Star,
        description: 'Reponses auto',
        roi: '+0.5 etoile moyenne',
      },
      {
        name: 'Review Intelligence',
        href: '/review-intelligence',
        icon: TrendingUp,
        description: 'Analyse sentiments',
        roi: 'Detecter tendances',
      },
      {
        name: 'Lead Scoring',
        href: '/lead-scoring',
        icon: Target,
        description: 'Qualification auto',
        roi: '+30% conversion',
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        name: 'Vols',
        href: '/flights',
        icon: Plane,
        description: 'Monitoring vols',
        roi: 'Alertes temps reel',
      },
      {
        name: 'Reservations',
        href: '/bookings',
        icon: CreditCard,
        description: 'Suivi reservations',
        roi: '+15% upsell',
      },
      {
        name: 'Calendrier',
        href: '/calendar',
        icon: Calendar,
        description: 'Planning contenu',
        roi: 'Organisation auto',
      },
      {
        name: 'Parcours Client',
        href: '/journeys',
        icon: Route,
        description: 'Customer journeys',
        roi: '+20% retention',
      },
    ],
  },
  {
    label: 'Analytics',
    items: [
      {
        name: 'Rapports',
        href: '/reports',
        icon: BarChart3,
        description: 'KPIs automatises',
        roi: 'Chaque lundi matin',
        badge: 'LIVE',
      },
      {
        name: 'Attribution',
        href: '/attribution',
        icon: Zap,
        description: 'Source des ventes',
        roi: 'ROI par canal',
      },
      {
        name: 'A/B Tests',
        href: '/ab-tests',
        icon: Target,
        description: 'Optimisation continue',
        roi: '+15% conversion',
      },
      {
        name: 'ROI Dashboard',
        href: '/roi',
        icon: TrendingUp,
        description: 'Retour investissement',
        roi: 'Vue globale',
      },
    ],
  },
  {
    label: 'Configuration',
    items: [
      {
        name: 'Upsell Engine',
        href: '/upsell',
        icon: Sparkles,
        description: 'Recommandations',
        roi: '+25% panier moyen',
      },
      {
        name: 'Preferences',
        href: '/preferences',
        icon: Settings,
        description: 'Personnalisation',
      },
      {
        name: 'Prix Concurrents',
        href: '/pricing-monitor',
        icon: CreditCard,
        description: 'Monitoring tarifs',
      },
      {
        name: 'Planner',
        href: '/planner',
        icon: Calendar,
        description: 'Planification voyage',
      },
      {
        name: 'Guide',
        href: '/guide',
        icon: HelpCircle,
        description: 'Aide & tarifs',
      },
      {
        name: 'Parametres',
        href: '/settings',
        icon: Settings,
        description: 'Configuration',
      },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar, mounted } = useSidebar()

  // Use default width until mounted to prevent hydration mismatch
  const sidebarCollapsed = mounted ? isCollapsed : false

  return (
    <aside
      className={`fixed left-0 top-10 h-[calc(100vh-40px)] sidebar-glass flex flex-col z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-center h-[72px] ${
        sidebarCollapsed ? 'px-2' : 'px-4'
      }`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-atn.svg"
          alt="Air Tahiti Nui"
          className={`object-contain transition-all duration-300 ${
            sidebarCollapsed ? 'w-[48px] h-[32px]' : 'w-full max-w-[200px] h-[50px]'
          }`}
        />
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[--border-primary]" />

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-2 ${sidebarCollapsed ? 'px-2' : 'px-3'} scrollbar-thin`}>
        {navigationGroups.map((group, groupIndex) => (
          <div key={group.label} className={groupIndex > 0 ? 'mt-4' : ''}>
            {/* Group Label */}
            {!sidebarCollapsed && (
              <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[--text-tertiary]">
                {group.label}
              </p>
            )}
            {sidebarCollapsed && groupIndex > 0 && (
              <div className="mx-2 my-2 h-px bg-[--border-primary]" />
            )}

            {/* Group Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      item.highlight && !isActive
                        ? 'bg-[--atn-primary]/10 hover:bg-[--atn-primary]/15'
                        : isActive
                        ? 'bg-[--sidebar-active]'
                        : 'hover:bg-[--sidebar-hover]'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                    title={sidebarCollapsed ? `${item.name}${item.roi ? ` - ${item.roi}` : ''}` : undefined}
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      isActive
                        ? 'bg-[--atn-primary] text-white'
                        : item.highlight
                        ? 'bg-[--atn-primary]/20 text-[--atn-primary]'
                        : 'bg-[--bg-tertiary] text-[--text-secondary] group-hover:text-[--atn-primary] group-hover:bg-[--atn-primary]/10'
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>

                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[13px] font-medium ${
                            isActive
                              ? 'text-[--atn-primary]'
                              : 'text-[--text-primary]'
                          }`}>
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[--atn-green] text-white font-semibold">
                              {item.badge}
                            </span>
                          )}
                          {item.highlight && !isActive && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[--atn-primary] text-white font-semibold">
                              TESTER
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-[--text-tertiary]">
                            {item.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* ROI indicator on hover */}
                    {!sidebarCollapsed && item.roi && (
                      <span className="text-[10px] text-[--atn-green] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.roi}
                      </span>
                    )}

                    {/* Badge for collapsed */}
                    {sidebarCollapsed && item.badge && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-[--atn-green] rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle - Full height vertical bar on right edge */}
      <button
        onClick={toggleSidebar}
        className="absolute right-0 top-0 w-1 h-full group cursor-pointer z-50"
        title={sidebarCollapsed ? 'Agrandir' : 'Reduire'}
      >
        <div className="w-full h-full bg-[--border-primary] group-hover:bg-[--atn-primary] group-hover:w-1.5 transition-all duration-200" />
      </button>
    </aside>
  )
}
