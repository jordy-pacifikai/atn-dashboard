'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, MousePointer, Mail, Share2, Search, Globe, Filter, RefreshCw, Loader2 } from 'lucide-react'

interface TouchpointData {
  channel: string
  icon: typeof Globe
  firstTouch: number
  lastTouch: number
  linear: number
  timeDecay: number
  positionBased: number
  conversions: number
  revenue: number
}

const channelIcons: Record<string, typeof Globe> = {
  'Google Ads': Search,
  'Email Marketing': Mail,
  'Organic Search': Globe,
  'Social Media': Share2,
  'Direct': MousePointer,
}

const fallbackData: TouchpointData[] = [
  {
    channel: 'Google Ads',
    icon: Search,
    firstTouch: 35.2,
    lastTouch: 18.5,
    linear: 24.8,
    timeDecay: 22.1,
    positionBased: 28.5,
    conversions: 245,
    revenue: 44100000,
  },
  {
    channel: 'Email Marketing',
    icon: Mail,
    firstTouch: 12.4,
    lastTouch: 28.6,
    linear: 22.5,
    timeDecay: 26.3,
    positionBased: 19.8,
    conversions: 312,
    revenue: 56160000,
  },
  {
    channel: 'Organic Search',
    icon: Globe,
    firstTouch: 28.5,
    lastTouch: 15.2,
    linear: 20.1,
    timeDecay: 18.4,
    positionBased: 22.3,
    conversions: 189,
    revenue: 34020000,
  },
  {
    channel: 'Social Media',
    icon: Share2,
    firstTouch: 15.3,
    lastTouch: 8.2,
    linear: 10.8,
    timeDecay: 9.5,
    positionBased: 12.1,
    conversions: 98,
    revenue: 17640000,
  },
  {
    channel: 'Direct',
    icon: MousePointer,
    firstTouch: 8.6,
    lastTouch: 29.5,
    linear: 21.8,
    timeDecay: 23.7,
    positionBased: 17.3,
    conversions: 156,
    revenue: 28080000,
  },
]

type ModelType = 'firstTouch' | 'lastTouch' | 'linear' | 'timeDecay' | 'positionBased'

const modelDescriptions: Record<ModelType, string> = {
  firstTouch: 'Attribue 100% du crédit au premier point de contact',
  lastTouch: 'Attribue 100% du crédit au dernier point de contact avant conversion',
  linear: 'Distribue le crédit équitablement entre tous les touchpoints',
  timeDecay: 'Donne plus de poids aux touchpoints récents',
  positionBased: 'Attribue 40% au premier, 40% au dernier, 20% répartis entre les autres',
}

const modelLabels: Record<ModelType, string> = {
  firstTouch: 'First Touch',
  lastTouch: 'Last Touch',
  linear: 'Linéaire',
  timeDecay: 'Time Decay',
  positionBased: 'Position-Based',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' XPF'
}

function AttributionBar({ value, maxValue, color }: { value: number; maxValue: number; color: string }) {
  const width = (value / maxValue) * 100

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-sm font-medium w-12 text-right">{value.toFixed(1)}%</span>
    </div>
  )
}

function ChannelCard({ data, model }: { data: TouchpointData; model: ModelType }) {
  const Icon = data.icon
  const value = data[model]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-atn-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-atn-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{data.channel}</h3>
            <p className="text-sm text-slate-500">{data.conversions} conversions</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-atn-primary">{value.toFixed(1)}%</p>
          <p className="text-sm text-slate-500">Attribution</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Revenue attribué</span>
          <span className="font-medium">{formatCurrency(Math.round(data.revenue * value / 100))}</span>
        </div>
        <AttributionBar value={value} maxValue={40} color="bg-atn-primary" />
      </div>
    </div>
  )
}

function ModelComparison({ data }: { data: TouchpointData[] }) {
  const models: ModelType[] = ['firstTouch', 'lastTouch', 'linear', 'timeDecay', 'positionBased']

  return (
    <div className="card overflow-hidden">
      <h2 className="font-semibold mb-4">Comparaison des modèles</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium">Canal</th>
              {models.map(model => (
                <th key={model} className="text-right py-3 px-4 font-medium">{modelLabels[model]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.channel} className="border-b border-slate-100">
                <td className="py-3 px-4 font-medium">{row.channel}</td>
                {models.map(model => (
                  <td key={model} className="text-right py-3 px-4">
                    {row[model].toFixed(1)}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AttributionPage() {
  const [data, setData] = useState<TouchpointData[]>([])
  const [selectedModel, setSelectedModel] = useState<ModelType>('positionBased')
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Fetch attribution data from Airtable
  const fetchAttribution = async () => {
    try {
      const response = await fetch('/api/airtable?table=Attribution_Data&sortField=Channel&sortDir=asc&limit=50')
      const result = await response.json()

      if (result.records && result.records.length > 0) {
        const mapped: TouchpointData[] = result.records.map((record: { id: string; fields: Record<string, unknown> }) => ({
          channel: (record.fields.Channel as string) || 'Unknown',
          icon: channelIcons[(record.fields.Channel as string)] || Globe,
          firstTouch: (record.fields.First_Touch as number) || 0,
          lastTouch: (record.fields.Last_Touch as number) || 0,
          linear: (record.fields.Linear as number) || 0,
          timeDecay: (record.fields.Time_Decay as number) || 0,
          positionBased: (record.fields.Position_Based as number) || 0,
          conversions: (record.fields.Conversions as number) || 0,
          revenue: (record.fields.Revenue as number) || 0,
        }))
        setData(mapped)
      } else {
        setData(fallbackData)
      }
    } catch (error) {
      console.error('Error fetching attribution:', error)
      setData(fallbackData)
    } finally {
      setLoading(false)
    }
  }

  // Refresh attribution (trigger n8n workflow)
  const refreshAttribution = async () => {
    setSyncing(true)
    try {
      await fetch('https://n8n.srv1140766.hstgr.cloud/webhook/atn-attribution-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      })
      await fetchAttribution()
    } catch (error) {
      console.error('Error refreshing attribution:', error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchAttribution()
  }, [])

  const totalRevenue = data.reduce((acc, d) => acc + d.revenue, 0)
  const totalConversions = data.reduce((acc, d) => acc + d.conversions, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-orange-500" />
            Attribution Tracker
          </h1>
          <p className="text-slate-500">Build 24: Multi-touch attribution 5 modèles</p>
        </div>
        <button
          data-guide="attribution-btn-refresh"
          onClick={refreshAttribution}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
        >
          {syncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {syncing ? 'Calcul...' : 'Recalculer'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-guide="attribution-kpi-channels" className="card">
          <p className="text-sm text-slate-500">Canaux trackés</p>
          <p className="text-2xl font-bold">{data.length}</p>
        </div>
        <div data-guide="attribution-kpi-conversions" className="card">
          <p className="text-sm text-slate-500">Conversions totales</p>
          <p className="text-2xl font-bold text-emerald-600">{totalConversions}</p>
        </div>
        <div data-guide="attribution-kpi-revenue" className="card">
          <p className="text-sm text-slate-500">Revenue total</p>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div data-guide="attribution-kpi-touchpoints" className="card">
          <p className="text-sm text-slate-500">Avg touchpoints/conv</p>
          <p className="text-2xl font-bold text-atn-primary">3.2</p>
        </div>
      </div>

      {/* Sélection du modèle */}
      <div data-guide="attribution-models-section" className="card">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Modèle d'attribution
        </h2>
        <div className="grid grid-cols-5 gap-3">
          <button
            data-guide="attribution-model-firsttouch"
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedModel === 'firstTouch'
                ? 'border-atn-primary bg-atn-primary/5'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedModel('firstTouch')}
          >
            <p className="font-medium text-sm">{modelLabels.firstTouch}</p>
            <p className="text-xs text-slate-500 mt-1">{modelDescriptions.firstTouch}</p>
          </button>
          <button
            data-guide="attribution-model-lasttouch"
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedModel === 'lastTouch'
                ? 'border-atn-primary bg-atn-primary/5'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedModel('lastTouch')}
          >
            <p className="font-medium text-sm">{modelLabels.lastTouch}</p>
            <p className="text-xs text-slate-500 mt-1">{modelDescriptions.lastTouch}</p>
          </button>
          <button
            data-guide="attribution-model-linear"
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedModel === 'linear'
                ? 'border-atn-primary bg-atn-primary/5'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedModel('linear')}
          >
            <p className="font-medium text-sm">{modelLabels.linear}</p>
            <p className="text-xs text-slate-500 mt-1">{modelDescriptions.linear}</p>
          </button>
          <button
            data-guide="attribution-model-timedecay"
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedModel === 'timeDecay'
                ? 'border-atn-primary bg-atn-primary/5'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedModel('timeDecay')}
          >
            <p className="font-medium text-sm">{modelLabels.timeDecay}</p>
            <p className="text-xs text-slate-500 mt-1">{modelDescriptions.timeDecay}</p>
          </button>
          <button
            data-guide="attribution-model-positionbased"
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedModel === 'positionBased'
                ? 'border-atn-primary bg-atn-primary/5'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedModel('positionBased')}
          >
            <p className="font-medium text-sm">{modelLabels.positionBased}</p>
            <p className="text-xs text-slate-500 mt-1">{modelDescriptions.positionBased}</p>
          </button>
        </div>
      </div>

      {/* Attribution par canal */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-atn-primary" />
          <span className="ml-3 text-slate-500">Chargement des données d'attribution...</span>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          Aucune donnée d'attribution
        </div>
      ) : (
        <>
          <div>
            <h2 className="font-semibold mb-4">Attribution par canal - {modelLabels[selectedModel]}</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.map(d => (
                <ChannelCard key={d.channel} data={d} model={selectedModel} />
              ))}
            </div>
          </div>

          {/* Tableau comparatif */}
          <ModelComparison data={data} />
        </>
      )}
    </div>
  )
}
