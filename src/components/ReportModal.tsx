'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Download, Printer, TrendingUp, TrendingDown, Minus, Plane, Star, Users, Mail, FileText, ShoppingCart, BarChart3, Globe } from 'lucide-react'

// =====================================================
// Types
// =====================================================

interface ReportMetric {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: 'up' | 'down' | 'neutral'
}

interface ReportSection {
  title: string
  content: string | string[]
}

interface ReportData {
  id: string
  title: string
  subtitle: string
  period: string
  generatedAt: string
  category: 'performance' | 'content' | 'revenue' | 'operations'
  summary: string
  metrics: ReportMetric[]
  breakdown: {
    title: string
    items: { label: string; value: string | number; percentage?: number }[]
  }
  recommendations: string[]
  highlights?: string[]
}

interface ReportModalProps {
  reportId: string
  onClose: () => void
}

// =====================================================
// Mock Data Generator
// =====================================================

const generateMockReportData = (reportId: string): ReportData => {
  const today = new Date()
  const dateStr = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const reports: Record<string, ReportData> = {
    'daily-summary': {
      id: 'daily-summary',
      title: 'Résumé Quotidien',
      subtitle: 'Vue d\'ensemble des opérations IA',
      period: dateStr,
      generatedAt: today.toISOString(),
      category: 'performance',
      summary: 'Journée excellente avec une hausse significative des interactions automatisées. Le chatbot a géré 847 conversations avec un taux de résolution de 94%. Les workflows de notification ont traité 2,340 alertes passagers sans intervention humaine.',
      metrics: [
        { label: 'Conversations IA', value: '847', change: 12.3, icon: 'up' },
        { label: 'Taux de résolution', value: '94%', change: 2.1, icon: 'up' },
        { label: 'Temps moyen réponse', value: '1.2s', change: -15, icon: 'up' },
        { label: 'Escalades humaines', value: '51', change: -8.5, icon: 'up' },
      ],
      breakdown: {
        title: 'Répartition par workflow',
        items: [
          { label: 'Chatbot Concierge', value: '347 interactions', percentage: 41 },
          { label: 'Notifications Vol', value: '234 envois', percentage: 28 },
          { label: 'FAQ Automatique', value: '156 réponses', percentage: 18 },
          { label: 'Upsell Engine', value: '110 offres', percentage: 13 },
        ]
      },
      recommendations: [
        'Augmenter la capacité du chatbot pendant les créneaux 10h-12h (pic identifié)',
        'Ajouter 3 nouvelles réponses FAQ sur les bagages spéciaux (surfboards)',
        'Activer le workflow de rappel J-3 pour les vols vers Tokyo'
      ],
      highlights: [
        '🎯 Record de conversations traitées sans escalade',
        '⚡ Temps de réponse moyen sous les 2 secondes',
        '📈 +15% d\'économies vs même jour semaine dernière'
      ]
    },

    'weekly-marketing': {
      id: 'weekly-marketing',
      title: 'Performance Marketing',
      subtitle: 'Analyse des campagnes et contenus',
      period: 'Semaine du 27 Jan - 2 Fév 2026',
      generatedAt: today.toISOString(),
      category: 'content',
      summary: 'Semaine remarquable pour les newsletters avec un taux d\'ouverture record de 42.8%. La campagne "Escapade Bora Bora" a généré 89 réservations directes. Le contenu SEO a atteint 12,400 vues organiques.',
      metrics: [
        { label: 'Newsletters envoyées', value: '24,500', change: 8.2, icon: 'up' },
        { label: 'Taux d\'ouverture', value: '42.8%', change: 5.4, icon: 'up' },
        { label: 'Clics totaux', value: '3,127', change: 18.9, icon: 'up' },
        { label: 'Conversions', value: '89', change: 23.1, icon: 'up' },
      ],
      breakdown: {
        title: 'Performance par campagne',
        items: [
          { label: 'Escapade Bora Bora', value: '45% CTR', percentage: 45 },
          { label: 'Promo Papeete-Paris', value: '38% CTR', percentage: 38 },
          { label: 'Newsletter hebdo', value: '31% CTR', percentage: 31 },
          { label: 'Offre dernière minute', value: '28% CTR', percentage: 28 },
        ]
      },
      recommendations: [
        'Dupliquer le template "Escapade Bora Bora" pour les Marquises',
        'Optimiser l\'heure d\'envoi : 9h30 Tahiti = meilleur taux',
        'Ajouter un segment "Voyageurs fréquents" pour offres VIP'
      ]
    },

    'roi-analysis': {
      id: 'roi-analysis',
      title: 'Analyse ROI par Route',
      subtitle: 'Performance commerciale détaillée',
      period: 'Janvier 2026',
      generatedAt: today.toISOString(),
      category: 'revenue',
      summary: 'Le ROI global des automatisations atteint 847% ce mois. La route PPT-CDG reste la plus performante avec 2.4M XPF de revenus additionnels générés par l\'upsell IA. Opportunité identifiée sur PPT-NRT.',
      metrics: [
        { label: 'ROI Global', value: '847%', change: 34, icon: 'up' },
        { label: 'Revenus additionnels', value: '8.2M XPF', change: 18.5, icon: 'up' },
        { label: 'Coût par conversion', value: '1,250 XPF', change: -12, icon: 'up' },
        { label: 'Marge contribution', value: '67%', change: 4.2, icon: 'up' },
      ],
      breakdown: {
        title: 'ROI par destination',
        items: [
          { label: 'PPT → Paris CDG', value: '2.4M XPF', percentage: 29 },
          { label: 'PPT → Los Angeles', value: '1.9M XPF', percentage: 23 },
          { label: 'PPT → Auckland', value: '1.6M XPF', percentage: 20 },
          { label: 'PPT → Tokyo NRT', value: '1.2M XPF', percentage: 15 },
          { label: 'Autres routes', value: '1.1M XPF', percentage: 13 },
        ]
      },
      recommendations: [
        'Intensifier les campagnes upsell sur PPT-NRT (potentiel +40%)',
        'Tester le bundle "Classe Affaires + Lounge" sur PPT-CDG',
        'Activer le dynamic pricing sur les vols Auckland weekend'
      ]
    },

    'customer-satisfaction': {
      id: 'customer-satisfaction',
      title: 'Satisfaction Client',
      subtitle: 'Analyse NPS et retours passagers',
      period: 'Janvier 2026',
      generatedAt: today.toISOString(),
      category: 'operations',
      summary: 'NPS en hausse à 72 (+5 points). Les avis positifs mentionnent principalement la réactivité du service client IA. Le chatbot concierge reçoit 4.6/5 en moyenne. Points d\'amélioration : gestion des réclamations bagages.',
      metrics: [
        { label: 'Score NPS', value: '72', change: 5, icon: 'up' },
        { label: 'Avis positifs', value: '89%', change: 3.2, icon: 'up' },
        { label: 'Note Chatbot', value: '4.6/5', change: 0.3, icon: 'up' },
        { label: 'Temps résolution', value: '4.2h', change: -18, icon: 'up' },
      ],
      breakdown: {
        title: 'Répartition des sentiments',
        items: [
          { label: 'Très satisfait', value: '847 avis', percentage: 52 },
          { label: 'Satisfait', value: '602 avis', percentage: 37 },
          { label: 'Neutre', value: '114 avis', percentage: 7 },
          { label: 'Insatisfait', value: '65 avis', percentage: 4 },
        ]
      },
      recommendations: [
        'Créer un workflow dédié "Réclamation Bagage" avec suivi automatique',
        'Ajouter un feedback loop post-résolution pour le chatbot',
        'Envoyer une survey automatique 48h après chaque vol'
      ]
    },

    'upsell-performance': {
      id: 'upsell-performance',
      title: 'Performance Upsell',
      subtitle: 'Revenus additionnels et conversions',
      period: 'Janvier 2026',
      generatedAt: today.toISOString(),
      category: 'revenue',
      summary: 'L\'engine upsell IA a généré 12.4M XPF de revenus additionnels ce mois, soit +28% vs décembre. Les upgrades classe affaires représentent 45% du total. Le timing optimal identifié : J-7 avant départ.',
      metrics: [
        { label: 'Revenus upsell', value: '12.4M XPF', change: 28, icon: 'up' },
        { label: 'Offres envoyées', value: '8,420', change: 15, icon: 'up' },
        { label: 'Taux conversion', value: '8.7%', change: 2.1, icon: 'up' },
        { label: 'Panier moyen', value: '18,500 XPF', change: 12, icon: 'up' },
      ],
      breakdown: {
        title: 'Revenus par type d\'offre',
        items: [
          { label: 'Upgrade Classe Affaires', value: '5.6M XPF', percentage: 45 },
          { label: 'Bagages supplémentaires', value: '2.8M XPF', percentage: 23 },
          { label: 'Sièges premium', value: '2.1M XPF', percentage: 17 },
          { label: 'Assurance voyage', value: '1.2M XPF', percentage: 10 },
          { label: 'Services lounge', value: '0.7M XPF', percentage: 5 },
        ]
      },
      recommendations: [
        'Tester les offres bundle "Siège + Bagage" à J-14',
        'Personnaliser les offres upgrade selon l\'historique voyageur',
        'Activer les push notifications mobiles pour les offres flash'
      ]
    },

    'competitor-intel': {
      id: 'competitor-intel',
      title: 'Veille Concurrentielle',
      subtitle: 'Mouvements du marché et alertes',
      period: 'Semaine 5 - 2026',
      generatedAt: today.toISOString(),
      category: 'operations',
      summary: 'Air France a baissé ses tarifs PPT-CDG de 8% cette semaine. Hawaiian Airlines lance une nouvelle route Honolulu-Papeete en mai. Opportunité : créer une offre package pour contrer.',
      metrics: [
        { label: 'Alertes prix', value: '23', change: 15, icon: 'up' },
        { label: 'Écart tarifaire moyen', value: '-4.2%', change: -2, icon: 'down' },
        { label: 'Nouvelles routes détectées', value: '2', change: 100, icon: 'up' },
        { label: 'Parts de voix digitale', value: '34%', change: 1.5, icon: 'up' },
      ],
      breakdown: {
        title: 'Mouvements tarifaires concurrents',
        items: [
          { label: 'Air France (PPT-CDG)', value: '-8% vs S-1', percentage: 8 },
          { label: 'LATAM (PPT-SCL)', value: '+3% vs S-1', percentage: 3 },
          { label: 'Air New Zealand (PPT-AKL)', value: '= stable', percentage: 0 },
          { label: 'United (PPT-SFO)', value: '-2% vs S-1', percentage: 2 },
        ]
      },
      recommendations: [
        'Répondre à Air France avec une promo "Early Bird" PPT-CDG',
        'Préparer campagne défensive avant lancement Hawaiian Airlines',
        'Monitorer LATAM pour opportunité code-share Santiago'
      ],
      highlights: [
        '⚠️ Alerte : Air France promo flash détectée',
        '🆕 Hawaiian Airlines annonce Honolulu-Papeete',
        '📊 ATN maintient leadership sur segment premium'
      ]
    },

    'flight-ops': {
      id: 'flight-ops',
      title: 'Opérations Vols',
      subtitle: 'Perturbations et notifications',
      period: dateStr,
      generatedAt: today.toISOString(),
      category: 'operations',
      summary: 'Journée opérationnelle excellente avec 98.2% de ponctualité. 3 retards mineurs gérés automatiquement avec notifications proactives. Satisfaction post-perturbation : 4.2/5.',
      metrics: [
        { label: 'Ponctualité', value: '98.2%', change: 1.8, icon: 'up' },
        { label: 'Vols opérés', value: '24', change: 0, icon: 'neutral' },
        { label: 'Notifications envoyées', value: '1,847', change: 5, icon: 'up' },
        { label: 'Satisfaction perturbation', value: '4.2/5', change: 0.4, icon: 'up' },
      ],
      breakdown: {
        title: 'État des vols du jour',
        items: [
          { label: 'À l\'heure', value: '21 vols', percentage: 87 },
          { label: 'Retard < 30min', value: '2 vols', percentage: 8 },
          { label: 'Retard > 30min', value: '1 vol', percentage: 4 },
          { label: 'Annulé', value: '0 vol', percentage: 0 },
        ]
      },
      recommendations: [
        'TN1 retard récurrent : analyser causes opérationnelles',
        'Pré-positionner équipage backup pour créneaux critiques',
        'Améliorer script notification pour retards > 2h'
      ]
    },

    'content-seo': {
      id: 'content-seo',
      title: 'Performance SEO',
      subtitle: 'Contenu et positionnement',
      period: 'Janvier 2026',
      generatedAt: today.toISOString(),
      category: 'content',
      summary: 'Le blog IA a généré 45,200 visites organiques ce mois (+32%). 8 nouveaux articles publiés avec un score SEO moyen de 87/100. Le mot-clé "vol Tahiti Paris" atteint la position 3 sur Google.',
      metrics: [
        { label: 'Trafic organique', value: '45,200', change: 32, icon: 'up' },
        { label: 'Articles publiés', value: '8', change: 60, icon: 'up' },
        { label: 'Score SEO moyen', value: '87/100', change: 4, icon: 'up' },
        { label: 'Backlinks acquis', value: '23', change: 45, icon: 'up' },
      ],
      breakdown: {
        title: 'Top articles du mois',
        items: [
          { label: 'Guide complet Bora Bora 2026', value: '12,400 vues', percentage: 27 },
          { label: 'Que faire à Tahiti en 7 jours', value: '8,900 vues', percentage: 20 },
          { label: 'Meilleures plages Polynésie', value: '7,200 vues', percentage: 16 },
          { label: 'Vol Paris-Tahiti : conseils', value: '6,100 vues', percentage: 14 },
          { label: 'Autres articles', value: '10,600 vues', percentage: 23 },
        ]
      },
      recommendations: [
        'Créer cluster de contenu "Lune de miel Polynésie" (volume recherche élevé)',
        'Optimiser article "Vol Tahiti Paris" pour featured snippet',
        'Ajouter FAQ schema sur les 5 articles principaux'
      ]
    }
  }

  return reports[reportId] || reports['daily-summary']
}

// =====================================================
// SVG Wave Pattern Component
// =====================================================

const WavePattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.07]" preserveAspectRatio="none" viewBox="0 0 1200 120">
    <path
      d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
      fill="currentColor"
    />
    <path
      d="M0,80 C300,40 500,120 800,80 C1000,50 1100,90 1200,80 L1200,120 L0,120 Z"
      fill="currentColor"
      opacity="0.5"
    />
  </svg>
)

const TiareFlower = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor">
    <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(0, 50, 50)" opacity="0.6"/>
    <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(72, 50, 50)" opacity="0.6"/>
    <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(144, 50, 50)" opacity="0.6"/>
    <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(216, 50, 50)" opacity="0.6"/>
    <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(288, 50, 50)" opacity="0.6"/>
    <circle cx="50" cy="50" r="12" opacity="0.8"/>
  </svg>
)

// =====================================================
// Metric Card Component
// =====================================================

const MetricCard = ({ metric }: { metric: ReportMetric }) => {
  const getTrendIcon = () => {
    if (metric.icon === 'up') return <TrendingUp className="w-4 h-4" />
    if (metric.icon === 'down') return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (metric.change === undefined) return 'text-slate-500'
    // For metrics where lower is better (like response time), negative change is good
    const isPositive = metric.icon === 'up'
    return isPositive ? 'text-emerald-600' : metric.icon === 'down' ? 'text-rose-600' : 'text-slate-500'
  }

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-3 sm:p-5 border border-slate-200/60 shadow-sm">
      <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">{metric.label}</p>
      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{metric.value}</p>
      {metric.change !== undefined && (
        <div className={`flex items-center gap-1 mt-1 sm:mt-2 text-xs sm:text-sm font-medium ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>{metric.change > 0 ? '+' : ''}{metric.change}%</span>
          <span className="text-slate-400 font-normal">vs période préc.</span>
        </div>
      )}
    </div>
  )
}

// =====================================================
// Progress Bar Component
// =====================================================

const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
      style={{ width: `${percentage}%` }}
    />
  </div>
)

// =====================================================
// Category Icon Component
// =====================================================

const CategoryIcon = ({ category }: { category: string }) => {
  const icons = {
    performance: <BarChart3 className="w-5 h-5" />,
    content: <FileText className="w-5 h-5" />,
    revenue: <TrendingUp className="w-5 h-5" />,
    operations: <Plane className="w-5 h-5" />,
  }
  return icons[category as keyof typeof icons] || <BarChart3 className="w-5 h-5" />
}

// =====================================================
// Main Report Modal Component
// =====================================================

export default function ReportModal({ reportId, onClose }: ReportModalProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Mount portal
  useEffect(() => {
    setMounted(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    // Simulate loading
    setIsLoading(true)
    const timer = setTimeout(() => {
      setReportData(generateMockReportData(reportId))
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [reportId])

  const handlePrint = () => {
    if (reportRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${reportData?.title || 'Rapport'} - Air Tahiti Nui</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; }
              .header { background: linear-gradient(135deg, #0F4C81, #00A5B5); color: white; padding: 32px; margin: -40px -40px 32px; }
              .logo { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
              .title { font-size: 28px; font-weight: 600; }
              .period { opacity: 0.8; margin-top: 8px; }
              .section { margin-bottom: 32px; }
              .section-title { font-size: 18px; font-weight: 600; color: #0F4C81; margin-bottom: 16px; border-bottom: 2px solid #00A5B5; padding-bottom: 8px; }
              .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
              .metric { background: #f8fafc; padding: 16px; border-radius: 8px; }
              .metric-label { font-size: 12px; color: #64748b; }
              .metric-value { font-size: 24px; font-weight: 700; color: #0F4C81; }
              .item { padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
              .recommendation { padding: 12px; background: #f0fdfa; border-left: 3px solid #00A5B5; margin-bottom: 8px; }
              @media print { body { padding: 0; } .header { margin: 0 0 24px; } }
            </style>
          </head>
          <body>
            ${reportRef.current.innerHTML}
          </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleDownloadPDF = () => {
    // In production, this would generate a proper PDF
    alert('Téléchargement PDF... (En production: génération PDF avec jsPDF)')
  }

  const categoryColors = {
    performance: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
    content: { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50' },
    revenue: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50' },
    operations: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50' },
  }

  const progressColors = {
    0: 'bg-emerald-500',
    1: 'bg-cyan-500',
    2: 'bg-blue-500',
    3: 'bg-violet-500',
    4: 'bg-amber-500',
  }

  // Don't render until mounted (for portal)
  if (!mounted) return null

  const colors = reportData ? categoryColors[reportData.category] : categoryColors.performance

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      {isLoading ? (
        <div
          className="bg-white rounded-2xl w-full max-w-md mx-auto p-8 sm:p-12 flex flex-col items-center justify-center"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-atn-primary rounded-full animate-spin" />
            <Plane className="absolute inset-0 m-auto w-6 h-6 text-atn-primary" />
          </div>
          <p className="mt-6 text-lg font-medium text-slate-700">Génération du rapport...</p>
          <p className="text-sm text-slate-500 mt-1">Analyse des données en cours</p>
        </div>
      ) : !reportData ? null : (
        <div
          className="bg-white rounded-2xl w-full max-w-5xl mx-auto overflow-hidden shadow-2xl flex flex-col"
          style={{ maxHeight: 'calc(100vh - 4rem)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header with ATN Branding */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0F4C81] via-[#0D5C8C] to-[#00A5B5] text-white shrink-0">
            <WavePattern />
            <TiareFlower className="absolute -right-8 -top-8 w-40 h-40 text-white/10 rotate-12 hidden sm:block" />
            <TiareFlower className="absolute right-24 bottom-0 w-24 h-24 text-white/5 -rotate-12 hidden sm:block" />

            <div className="relative z-10 p-4 sm:p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/15 backdrop-blur-sm rounded-full">
                      <Plane className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-semibold tracking-wide">AIR TAHITI NUI</span>
                    </div>
                    <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}>
                      <CategoryIcon category={reportData.category} />
                    </div>
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1 sm:mb-2">{reportData.title}</h1>
                  <p className="text-white/80 text-sm sm:text-base md:text-lg">{reportData.subtitle}</p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">{reportData.period}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">Généré le {new Date(reportData.generatedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={reportRef} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          {/* Highlights Banner */}
          {reportData.highlights && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl p-3 sm:p-5">
              <h3 className="text-xs sm:text-sm font-semibold text-amber-800 mb-2 sm:mb-3 flex items-center gap-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                Points clés
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {reportData.highlights.map((highlight, i) => (
                  <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white rounded-lg text-xs sm:text-sm text-amber-900 shadow-sm">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Executive Summary */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-3 flex items-center gap-2">
              <div className={`w-1.5 h-5 sm:h-6 rounded-full ${colors.bg}`} />
              Résumé Exécutif
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{reportData.summary}</p>
          </div>

          {/* Key Metrics */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
              <div className={`w-1.5 h-5 sm:h-6 rounded-full ${colors.bg}`} />
              Métriques Clés
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {reportData.metrics.map((metric, i) => (
                <MetricCard key={i} metric={metric} />
              ))}
            </div>
          </div>

          {/* Performance Breakdown */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
              <div className={`w-1.5 h-5 sm:h-6 rounded-full ${colors.bg}`} />
              {reportData.breakdown.title}
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {reportData.breakdown.items.map((item, i) => (
                <div key={i} className="p-3 sm:p-4 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="text-sm sm:text-base font-medium text-slate-700 truncate">{item.label}</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-nowrap">{item.value}</span>
                  </div>
                  {item.percentage !== undefined && (
                    <ProgressBar
                      percentage={item.percentage}
                      color={progressColors[i % 5 as keyof typeof progressColors]}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
              <div className={`w-1.5 h-5 sm:h-6 rounded-full ${colors.bg}`} />
              Recommandations IA
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {reportData.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-cyan-50/50 to-teal-50/50 rounded-xl border border-cyan-100/50"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#00A5B5] text-white flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 text-center sm:text-left">
              Rapport généré automatiquement par PACIFIK'AI
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-white transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Imprimer</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2.5 bg-gradient-to-r from-[#0F4C81] to-[#00A5B5] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Télécharger PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Render in portal to escape sidebar layout
  return createPortal(modalContent, document.body)
}
