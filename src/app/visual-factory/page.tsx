'use client'

import { useState, useEffect, useCallback } from 'react'
import { Image, Sparkles, Download, RefreshCw, Palette, Type, LayoutGrid, Wand2, Loader2, CheckCircle2, AlertCircle, Clock, Eye, Trash2, X } from 'lucide-react'

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

// Demo assets avec vraies images Unsplash haute qualité (thème ATN)
const fallbackAssets: VisualAsset[] = [
  {
    id: '1',
    type: 'banner',
    prompt: 'Plage paradisiaque de Bora Bora avec lagon turquoise et bungalows sur pilotis',
    imageUrl: 'https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=1200&h=628&fit=crop',
    status: 'approved',
    campaign: 'Promo Été 2026',
    format: '1200x628',
    createdAt: '2026-02-01T09:00:00',
  },
  {
    id: '2',
    type: 'social',
    prompt: 'Vue aérienne de Moorea avec lagons turquoise et montagnes verdoyantes',
    imageUrl: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=1080&h=1080&fit=crop',
    status: 'approved',
    campaign: 'Brand Awareness',
    format: '1080x1080',
    createdAt: '2026-02-01T08:30:00',
  },
  {
    id: '3',
    type: 'story',
    prompt: 'Coucher de soleil tropical sur Tahiti avec palmiers et plage de sable blanc',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&h=1920&fit=crop',
    status: 'ready',
    campaign: 'Destination Tahiti',
    format: '1080x1920',
    createdAt: '2026-02-02T10:00:00',
  },
  {
    id: '4',
    type: 'email',
    prompt: 'Header email élégant avec fleur de tiare et dégradé bleu polynésien',
    imageUrl: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&h=200&fit=crop',
    status: 'ready',
    campaign: 'Newsletter Février',
    format: '600x200',
    createdAt: '2026-02-02T16:00:00',
  },
  {
    id: '5',
    type: 'banner',
    prompt: 'Intérieur luxueux classe business avec sièges cuir et champagne',
    imageUrl: 'https://images.unsplash.com/photo-1540339832862-474599807836?w=1200&h=628&fit=crop',
    status: 'approved',
    campaign: 'Classe Poerava',
    format: '1200x628',
    createdAt: '2026-01-30T14:00:00',
  },
  {
    id: '6',
    type: 'social',
    prompt: 'Plongée avec raies manta dans les eaux cristallines de Rangiroa',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1080&h=1080&fit=crop',
    status: 'ready',
    campaign: 'Aventures Polynésiennes',
    format: '1080x1080',
    createdAt: '2026-01-29T11:00:00',
  },
]

// Galerie d'images de demo par THEME pour coherence prompt/image
// IMPORTANT: Les themes sont testes par nombre de matches, donc les keywords specifiques priment
const demoImagesByTheme: Record<string, { keywords: string[], images: string[], priority: number }> = {
  // Culture et danse - PRIORITE HAUTE car keywords tres specifiques
  culture: {
    keywords: ['danse', 'danseur', 'danseuse', 'tradition', 'costume', 'fete', 'vahine', 'tiare', 'polynes', 'ukulele', 'heiva', 'ori tahiti', 'tamure', 'folklore', 'spectacle'],
    images: [
      'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b', // Danse tahitienne
      'https://images.unsplash.com/photo-1601370690183-1c7796ecec61', // Fleur tiare
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86', // Ukulele hawaien
      'https://images.unsplash.com/photo-1590523278191-995cbcda646b', // Culture polynesienne
    ],
    priority: 10
  },
  // Plongée et océan - PRIORITE HAUTE
  plongee: {
    keywords: ['plong', 'raie', 'requin', 'manta', 'sous-marin', 'ocean', 'corail', 'fakarava', 'rangiroa', 'tortue', 'poisson', 'aqua'],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5', // Raie manta
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba', // Plongee requins
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19', // Tortue marine
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7', // Coraux
    ],
    priority: 10
  },
  // Paysages et lagons - PRIORITE MOYENNE (fallback pour "tahiti", "moorea", etc)
  lagon: {
    keywords: ['lagon', 'bora', 'moorea', 'ile', 'aerien', 'vue', 'turquoise', 'bungalow', 'overwater', 'plage', 'sable'],
    images: [
      'https://images.unsplash.com/photo-1589197331516-4d84b72ebde3', // Bora Bora lagon
      'https://images.unsplash.com/photo-1516815231560-8f41ec531527', // Moorea aerien
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // Plage tropicale
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8', // Lagon turquoise
    ],
    priority: 5
  },
  // Coucher de soleil
  sunset: {
    keywords: ['coucher', 'soleil', 'sunset', 'crepuscule', 'soir', 'romantique', 'catamaran', 'pirogue', 'golden'],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // Sunset plage
      'https://images.unsplash.com/photo-1476673160081-cf065f0c2b91', // Sunset palmiers
      'https://images.unsplash.com/photo-1519046904884-53103b34b206', // Sunset tropical
      'https://images.unsplash.com/photo-1499678329028-101435549a4e', // Golden hour plage
    ],
    priority: 8
  },
  // Avion et voyage
  avion: {
    keywords: ['avion', 'boeing', '787', 'dreamliner', 'vol', 'atterr', 'decoll', 'aeroport', 'cabine', 'classe', 'poerava', 'business', 'hublot'],
    images: [
      'https://images.unsplash.com/photo-1540339832862-474599807836', // Avion ciel
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05', // Avion voyage
      'https://images.unsplash.com/photo-1569629743817-70d8db6c323b', // Cabine business
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd', // Vue hublot
    ],
    priority: 10
  },
  // Montagne et nature
  montagne: {
    keywords: ['montagne', 'verdoy', 'cascade', 'jungle', 'foret', 'randonnee', 'nature', 'exploration', 'trek'],
    images: [
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0', // Montagne tropicale
      'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e', // Nature luxuriante
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b', // Cascade
      'https://images.unsplash.com/photo-1544735716-ea9ef790f501', // Jungle
    ],
    priority: 7
  },
  // Service et luxe
  luxe: {
    keywords: ['champagne', 'service', 'luxe', 'premium', 'fruit', 'cocktail', 'repas', 'gastronomie', 'spa', 'resort'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945', // Resort luxe
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d', // Petit dejeuner tropical
      'https://images.unsplash.com/photo-1559827291-72ee739d0d9a', // Fleurs tropicales
      'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c', // Ambiance luxe
    ],
    priority: 6
  },
}

// Fonction pour trouver l'image la plus pertinente selon le prompt
function findBestImageForPrompt(prompt: string, format: string): string {
  const promptLower = prompt.toLowerCase()
  const normalizedPrompt = promptLower
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enleve les accents

  // Chercher le meilleur theme avec scoring pondere (matches * priority)
  let bestTheme: string | null = null
  let maxScore = 0

  for (const [theme, data] of Object.entries(demoImagesByTheme)) {
    const matches = data.keywords.filter(kw =>
      normalizedPrompt.includes(kw.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    ).length

    // Score = nombre de matches * priorite du theme
    const score = matches * (data.priority || 5)

    if (score > maxScore) {
      maxScore = score
      bestTheme = theme
    }
  }

  // Si aucun match, utiliser lagon par defaut (theme ATN)
  const theme = bestTheme || 'lagon'
  const images = demoImagesByTheme[theme].images
  const matchedImage = images[Math.floor(Math.random() * images.length)]

  // Ajouter les parametres de dimension selon le format
  const dimensions: Record<string, string> = {
    '1200x628': 'w=1200&h=628',
    '1080x1080': 'w=1080&h=1080',
    '1080x1920': 'w=1080&h=1920',
    '600x200': 'w=600&h=200',
  }

  const dimParams = dimensions[format] || 'w=1200&h=628'
  return `${matchedImage}?${dimParams}&fit=crop`
}

const assetTypes = [
  { id: 'banner', label: 'Bannière Web', format: '1200x628', icon: LayoutGrid },
  { id: 'social', label: 'Post Social', format: '1080x1080', icon: Image },
  { id: 'story', label: 'Story/Reel', format: '1080x1920', icon: Sparkles },
  { id: 'email', label: 'Header Email', format: '600x200', icon: Type },
]

// Prompts suggérés par type
const suggestedPrompts: Record<string, string[]> = {
  banner: [
    'Vue aérienne du lagon de Bora Bora avec over-water bungalows',
    'Boeing 787 Dreamliner ATN atterrissant au coucher du soleil',
    'Intérieur classe Poerava Business avec service premium',
  ],
  social: [
    'Plongée avec requins et raies manta dans les eaux de Fakarava',
    'Danse tahitienne traditionnelle avec costumes de fête',
    'Couple admirant le coucher de soleil depuis un catamaran',
  ],
  story: [
    'Exploration des montagnes verdoyantes de Moorea',
    'Service champagne et fruits tropicaux en vol',
    'Vahiné avec fleur de tiare devant cascade',
  ],
  email: [
    'Header élégant avec motifs polynésiens et logo ATN',
    'Bandeau promotionnel Tahiti avec dégradé turquoise',
    'En-tête newsletter avec orchidée et palmiers',
  ],
}

function AssetCard({ asset, onPreview, onApprove, onDelete }: {
  asset: VisualAsset
  onPreview: (asset: VisualAsset) => void
  onApprove: (id: string) => void
  onDelete: (id: string) => void
}) {
  const statusConfig = {
    generating: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Génération...' },
    ready: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2, label: 'Prêt' },
    approved: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Approuvé' },
  }

  const config = statusConfig[asset.status]
  const StatusIcon = config.icon

  return (
    <div className="card group hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4">
        {asset.status === 'generating' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-fuchsia-200 rounded-full animate-pulse"></div>
              <Sparkles className="w-8 h-8 text-fuchsia-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <p className="mt-3 text-sm text-slate-600 font-medium">IA en cours de création...</p>
            <p className="text-xs text-slate-400 mt-1">Fal.ai Flux Pro</p>
          </div>
        ) : (
          <>
            <img src={asset.imageUrl} alt={asset.prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                onClick={() => onPreview(asset)}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-all"
              >
                <Eye className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </>
        )}
        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${config.color}`}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
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
              {asset.status === 'ready' && (
                <button
                  onClick={() => onApprove(asset.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm hover:bg-emerald-100 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approuver
                </button>
              )}
              <a
                href={asset.imageUrl}
                download={`atn-visual-${asset.id}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-atn-primary text-white rounded-lg text-sm hover:bg-opacity-90 transition-all"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </a>
              <button
                onClick={() => onDelete(asset.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Modal de preview
function PreviewModal({ asset, onClose }: { asset: VisualAsset | null, onClose: () => void }) {
  if (!asset) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={asset.imageUrl}
          alt={asset.prompt}
          className="w-full rounded-lg shadow-2xl"
        />
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
          <p className="font-medium">{asset.prompt}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
            <span>{asset.format}</span>
            <span>{asset.campaign}</span>
            <span>{new Date(asset.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
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
  const [useBrandColors, setUseBrandColors] = useState(false)
  const [addTextOverlay, setAddTextOverlay] = useState(false)
  const [overlayText, setOverlayText] = useState('')
  const [previewAsset, setPreviewAsset] = useState<VisualAsset | null>(null)
  const [demoMode, setDemoMode] = useState(true) // Mode demo activé par défaut
  const [generationProgress, setGenerationProgress] = useState(0)

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

  // Generate new visual - Demo mode ou n8n workflow
  const generateVisual = async () => {
    if (!selectedType || !prompt) return

    setGenerating(true)
    setGenerationProgress(0)

    // Build enhanced prompt with options
    let enhancedPrompt = prompt
    if (useBrandColors) {
      enhancedPrompt += '. Use Air Tahiti Nui brand colors: deep blue (#003366), turquoise (#0099CC), gold accents.'
    }
    if (addTextOverlay && overlayText) {
      enhancedPrompt += `. Add text overlay: "${overlayText}"`
    }

    const assetFormat = assetTypes.find(t => t.id === selectedType)?.format || '1200x628'

    // Créer un asset temporaire en cours de génération
    const tempId = `gen-${Date.now()}`
    const tempAsset: VisualAsset = {
      id: tempId,
      type: selectedType as VisualAsset['type'],
      prompt: prompt,
      imageUrl: '',
      status: 'generating',
      campaign: 'Visual Factory',
      format: assetFormat,
      createdAt: new Date().toISOString(),
    }

    setAssets(prev => [tempAsset, ...prev])

    try {
      if (demoMode) {
        // Mode demo: simulation avec vraies images
        const progressInterval = setInterval(() => {
          setGenerationProgress(prev => Math.min(prev + 10, 90))
        }, 300)

        await new Promise(resolve => setTimeout(resolve, 3000)) // Simule 3 secondes de génération

        clearInterval(progressInterval)
        setGenerationProgress(100)

        // Sélectionner une image cohérente avec le prompt
        const matchedImage = findBestImageForPrompt(prompt, assetFormat)

        // Sauvegarder dans Airtable
        try {
          const saveResponse = await fetch('/api/airtable?table=Visual_Assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Type: selectedType,
              Prompt: prompt,
              Image_URL: matchedImage,
              Status: 'ready',
              Campaign: 'Visual Factory',
              Format: assetFormat,
              Created_At: new Date().toISOString()
            })
          })

          const savedRecord = await saveResponse.json()

          // Mettre à jour avec le vrai ID Airtable
          setAssets(prev => prev.map(a =>
            a.id === tempId
              ? { ...a, id: savedRecord.id, status: 'ready' as const, imageUrl: matchedImage }
              : a
          ))

          // Rafraîchir la liste depuis Airtable pour voir la nouvelle image en premier
          await fetchAssets()
        } catch (saveError) {
          console.error('Error saving to Airtable:', saveError)
          // Fallback: juste mettre à jour localement
          setAssets(prev => prev.map(a =>
            a.id === tempId
              ? { ...a, status: 'ready' as const, imageUrl: matchedImage }
              : a
          ))
        }
      } else {
        // Mode production: appeler le workflow n8n
        const response = await fetch('https://n8n.srv1140766.hstgr.cloud/webhook/atn-visual-factory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate',
            type: selectedType,
            prompt: enhancedPrompt,
            format: assetFormat,
            useBrandColors,
            textOverlay: addTextOverlay ? overlayText : null
          })
        })

        const result = await response.json()

        if (result.success && result.imageUrl) {
          setAssets(prev => prev.map(a =>
            a.id === tempId
              ? { ...a, status: 'ready' as const, imageUrl: result.imageUrl }
              : a
          ))
        } else {
          // Erreur - supprimer l'asset temporaire
          setAssets(prev => prev.filter(a => a.id !== tempId))
        }
      }

      setPrompt('')
      setOverlayText('')
    } catch (error) {
      console.error('Error generating visual:', error)
      // Supprimer l'asset temporaire en cas d'erreur
      setAssets(prev => prev.filter(a => a.id !== tempId))
    } finally {
      setGenerating(false)
      setGenerationProgress(0)
    }
  }

  // Approuver un asset
  const approveAsset = useCallback((id: string) => {
    setAssets(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'approved' as const } : a
    ))
  }, [])

  // Supprimer un asset
  const deleteAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id))
  }, [])

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
      {/* Preview Modal */}
      <PreviewModal asset={previewAsset} onClose={() => setPreviewAsset(null)} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Image className="w-7 h-7 text-fuchsia-500" />
            Smart Visual Factory
          </h1>
          <p className="text-slate-500">Build 17: Génération assets marketing avec Fal.ai</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              demoMode
                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
          >
            {demoMode ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Mode Demo
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Mode Production
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-guide="visual-kpi-total" className="card">
          <p className="text-sm text-slate-500">Total générés</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div data-guide="visual-kpi-ready" className="card">
          <p className="text-sm text-slate-500">Prêts</p>
          <p className="text-2xl font-bold text-blue-600">{stats.ready}</p>
        </div>
        <div data-guide="visual-kpi-approved" className="card">
          <p className="text-sm text-slate-500">Approuvés</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
        </div>
        <div data-guide="visual-kpi-generating" className="card">
          <p className="text-sm text-slate-500">En cours</p>
          <p className="text-2xl font-bold text-amber-600">{stats.generating}</p>
        </div>
      </div>

      {/* Générateur */}
      <div data-guide="visual-generator-section" className="card">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-fuchsia-500" />
          Nouveau visuel
        </h2>

        <div data-guide="visual-type-selector" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedType === 'banner'
                ? 'border-atn-primary bg-atn-primary/5'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedType('banner')}
          >
            <LayoutGrid className={`w-6 h-6 mb-2 ${selectedType === 'banner' ? 'text-atn-primary' : 'text-slate-400'}`} />
            <p className="text-sm font-medium">Bannière Web</p>
            <p className="text-xs text-slate-500">1200x628</p>
          </button>
          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedType === 'social'
                ? 'border-atn-primary bg-atn-primary/5'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedType('social')}
          >
            <Image className={`w-6 h-6 mb-2 ${selectedType === 'social' ? 'text-atn-primary' : 'text-slate-400'}`} />
            <p className="text-sm font-medium">Post Social</p>
            <p className="text-xs text-slate-500">1080x1080</p>
          </button>
          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedType === 'story'
                ? 'border-atn-primary bg-atn-primary/5'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedType('story')}
          >
            <Sparkles className={`w-6 h-6 mb-2 ${selectedType === 'story' ? 'text-atn-primary' : 'text-slate-400'}`} />
            <p className="text-sm font-medium">Story/Reel</p>
            <p className="text-xs text-slate-500">1080x1920</p>
          </button>
          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedType === 'email'
                ? 'border-atn-primary bg-atn-primary/5'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedType('email')}
          >
            <Type className={`w-6 h-6 mb-2 ${selectedType === 'email' ? 'text-atn-primary' : 'text-slate-400'}`} />
            <p className="text-sm font-medium">Header Email</p>
            <p className="text-xs text-slate-500">600x200</p>
          </button>
        </div>

        {/* Prompts suggérés */}
        {selectedType && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2">Suggestions de prompts :</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts[selectedType]?.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-all"
                >
                  {suggestion.slice(0, 50)}...
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <input
            data-guide="visual-prompt-input"
            type="text"
            placeholder="Décrivez le visuel souhaité..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-atn-primary"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !generating && selectedType && prompt && generateVisual()}
          />
          <button
            data-guide="visual-btn-generate"
            className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
            disabled={!selectedType || !prompt || generating}
            onClick={generateVisual}
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">{generationProgress}%</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span className="hidden sm:inline">Générer</span>
              </>
            )}
          </button>
        </div>

        {/* Progress bar pendant la génération */}
        {generating && (
          <div className="mt-3">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 text-center">
              {demoMode ? 'Simulation en cours...' : 'Fal.ai Flux Pro génère votre image...'}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="flex gap-4">
            <button
              data-guide="visual-btn-brandcolors"
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all ${
                useBrandColors
                  ? 'bg-atn-primary text-white'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
              onClick={() => setUseBrandColors(!useBrandColors)}
            >
              <Palette className="w-4 h-4" />
              Brand colors {useBrandColors ? '✓' : ''}
            </button>
            <button
              data-guide="visual-btn-addtext"
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all ${
                addTextOverlay
                  ? 'bg-atn-primary text-white'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
              onClick={() => setAddTextOverlay(!addTextOverlay)}
            >
              <Type className="w-4 h-4" />
              Ajouter texte {addTextOverlay ? '✓' : ''}
            </button>
          </div>

          {addTextOverlay && (
            <input
              type="text"
              placeholder="Texte à afficher sur l'image..."
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-atn-primary text-sm"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
            />
          )}

          {useBrandColors && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-4 h-4 rounded-full bg-[#003366]" title="Deep Blue"></span>
              <span className="w-4 h-4 rounded-full bg-[#0099CC]" title="Turquoise"></span>
              <span className="w-4 h-4 rounded-full bg-[#FFD700]" title="Gold"></span>
              <span>Palette Air Tahiti Nui activée</span>
            </div>
          )}
        </div>
      </div>

      {/* Galerie */}
      <div data-guide="visual-gallery-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Assets récents</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {stats.approved} approuvés
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {stats.ready} prêts
            </span>
            {stats.generating > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                {stats.generating} en cours
              </span>
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atn-primary" />
            <span className="ml-3 text-slate-500">Chargement des assets...</span>
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Aucun asset généré</p>
            <p className="text-sm mt-1">Sélectionnez un type et décrivez votre visuel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map(asset => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onPreview={setPreviewAsset}
                onApprove={approveAsset}
                onDelete={deleteAsset}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info mode demo */}
      {demoMode && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Mode Démonstration actif</p>
              <p className="text-sm text-amber-700 mt-1">
                Les images générées sont sélectionnées depuis une bibliothèque d'images Unsplash haute qualité.
                En mode Production, les images seront créées par l'IA Fal.ai Flux Pro via le workflow n8n.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
