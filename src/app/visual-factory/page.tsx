'use client'

import { useState, useEffect } from 'react'
import { Image, Sparkles, Download, RefreshCw, Palette, Type, LayoutGrid, Wand2, Loader2 } from 'lucide-react'

interface VisualAsset {
  id: string
  type: 'banner' | 'social' | 'email' | 'story'
  prompt: string
  imageUrl: string
  status: 'generating' | 'ready' | 'approved'
  campaign: string
  format: string
  createdAt: string
}

const fallbackAssets: VisualAsset[] = [
  {
    id: '1',
    type: 'banner',
    prompt: 'Plage paradisiaque de Bora Bora avec lagon turquoise, style épuré et luxueux',
    imageUrl: 'https://placehold.co/1200x628/0ea5e9/ffffff?text=Bora+Bora+Banner',
    status: 'ready',
    campaign: 'Promo Été 2026',
    format: '1200x628',
    createdAt: '2026-01-29T09:00:00',
  },
  {
    id: '2',
    type: 'social',
    prompt: 'Boeing 787 Dreamliner survolant Moorea au coucher du soleil',
    imageUrl: 'https://placehold.co/1080x1080/ec4899/ffffff?text=787+Sunset',
    status: 'approved',
    campaign: 'Brand Awareness',
    format: '1080x1080',
    createdAt: '2026-01-29T08:30:00',
  },
  {
    id: '3',
    type: 'story',
    prompt: 'Classe Poerava Business avec service champagne et vue hublot',
    imageUrl: 'https://placehold.co/1080x1920/8b5cf6/ffffff?text=Poerava+Story',
    status: 'generating',
    campaign: 'Business Class',
    format: '1080x1920',
    createdAt: '2026-01-29T10:00:00',
  },
  {
    id: '4',
    type: 'email',
    prompt: 'Header email avec fleur de tiare et texte "Ia Ora Na"',
    imageUrl: 'https://placehold.co/600x200/f59e0b/ffffff?text=Ia+Ora+Na+Header',
    status: 'ready',
    campaign: 'Newsletter Janvier',
    format: '600x200',
    createdAt: '2026-01-28T16:00:00',
  },
]

const assetTypes = [
  { id: 'banner', label: 'Bannière Web', format: '1200x628', icon: LayoutGrid },
  { id: 'social', label: 'Post Social', format: '1080x1080', icon: Image },
  { id: 'story', label: 'Story/Reel', format: '1080x1920', icon: Sparkles },
  { id: 'email', label: 'Header Email', format: '600x200', icon: Type },
]

function AssetCard({ asset }: { asset: VisualAsset }) {
  const statusColors = {
    generating: 'bg-amber-100 text-amber-700',
    ready: 'bg-blue-100 text-blue-700',
    approved: 'bg-emerald-100 text-emerald-700',
  }

  const statusLabels = {
    generating: 'Génération...',
    ready: 'Prêt',
    approved: 'Approuvé',
  }

  return (
    <div className="card">
      <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4">
        {asset.status === 'generating' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : (
          <img src={asset.imageUrl} alt={asset.prompt} className="w-full h-full object-cover" />
        )}
        <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${statusColors[asset.status]}`}>
          {statusLabels[asset.status]}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{asset.format}</span>
          <span className="text-xs text-slate-500">{asset.campaign}</span>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2">{asset.prompt}</p>

        <div className="flex gap-2 pt-2">
          {asset.status !== 'generating' && (
            <>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">
                <RefreshCw className="w-4 h-4" />
                Régénérer
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-atn-primary text-white rounded-lg text-sm hover:bg-opacity-90">
                <Download className="w-4 h-4" />
                Download
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VisualFactoryPage() {
  const [assets, setAssets] = useState<VisualAsset[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  // Fetch assets from Airtable
  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/airtable?table=Visual_Assets&sortField=Created_At&sortDir=desc&limit=50')
      const data = await response.json()

      if (data.records && data.records.length > 0) {
        const mapped: VisualAsset[] = data.records.map((record: { id: string; fields: Record<string, unknown> }) => ({
          id: record.id,
          type: ((record.fields.Type as string)?.toLowerCase() || 'banner') as VisualAsset['type'],
          prompt: (record.fields.Prompt as string) || '',
          imageUrl: (record.fields.Image_URL as string) || 'https://placehold.co/1200x628/0ea5e9/ffffff?text=Asset',
          status: ((record.fields.Status as string)?.toLowerCase() || 'ready') as VisualAsset['status'],
          campaign: (record.fields.Campaign as string) || 'General',
          format: (record.fields.Format as string) || '1200x628',
          createdAt: (record.fields.Created_At as string) || new Date().toISOString(),
        }))
        setAssets(mapped)
      } else {
        setAssets(fallbackAssets)
      }
    } catch (error) {
      console.error('Error fetching visual assets:', error)
      setAssets(fallbackAssets)
    } finally {
      setLoading(false)
    }
  }

  // Generate new visual (trigger n8n workflow)
  const generateVisual = async () => {
    if (!selectedType || !prompt) return

    setGenerating(true)
    try {
      await fetch('https://n8n.srv1140766.hstgr.cloud/webhook/atn-visual-factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          type: selectedType,
          prompt: prompt,
          format: assetTypes.find(t => t.id === selectedType)?.format
        })
      })
      setPrompt('')
      await fetchAssets()
    } catch (error) {
      console.error('Error generating visual:', error)
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const stats = {
    total: assets.length,
    ready: assets.filter(a => a.status === 'ready').length,
    approved: assets.filter(a => a.status === 'approved').length,
    generating: assets.filter(a => a.status === 'generating').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Image className="w-7 h-7 text-fuchsia-500" />
            Smart Visual Factory
          </h1>
          <p className="text-slate-500">Build 17: Génération assets marketing avec Fal.ai</p>
        </div>
      </div>

      <div data-guide="visual-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Total générés</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Prêts</p>
          <p className="text-2xl font-bold text-blue-600">{stats.ready}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Approuvés</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">En cours</p>
          <p className="text-2xl font-bold text-amber-600">{stats.generating}</p>
        </div>
      </div>

      {/* Générateur */}
      <div data-guide="visual-generator" className="card">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-fuchsia-500" />
          Nouveau visuel
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {assetTypes.map(type => (
            <button
              key={type.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedType === type.id
                  ? 'border-atn-primary bg-atn-primary/5'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <type.icon className={`w-6 h-6 mb-2 ${selectedType === type.id ? 'text-atn-primary' : 'text-slate-400'}`} />
              <p className="text-sm font-medium">{type.label}</p>
              <p className="text-xs text-slate-500">{type.format}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Décrivez le visuel souhaité..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-atn-primary"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
            disabled={!selectedType || !prompt || generating}
            onClick={generateVisual}
          >
            {generating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {generating ? 'Génération...' : 'Générer'}
          </button>
        </div>

        <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
          <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
            <Palette className="w-4 h-4" />
            Brand colors
          </button>
          <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
            <Type className="w-4 h-4" />
            Ajouter texte
          </button>
        </div>
      </div>

      {/* Galerie */}
      <div>
        <h2 className="font-semibold mb-4">Assets récents</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atn-primary" />
            <span className="ml-3 text-slate-500">Chargement des assets...</span>
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Aucun asset généré
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {assets.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
