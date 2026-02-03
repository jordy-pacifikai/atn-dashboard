'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  ChevronRight,
} from 'lucide-react'

type ViewportSize = 'desktop' | 'tablet' | 'mobile'

const viewportSizes: Record<ViewportSize, { width: string; label: string }> = {
  desktop: { width: '100%', label: 'Desktop' },
  tablet: { width: '768px', label: 'Tablet' },
  mobile: { width: '375px', label: 'Mobile' },
}

// Questions suggérées à tester
const suggestedQuestions = [
  "Quels sont les bagages autorisés en cabine ?",
  "What flights go to Los Angeles?",
  "Je veux réserver un vol pour Bora Bora",
  "東京へのフライトはありますか？",
]

export default function DemoSitePage() {
  const [viewport, setViewport] = useState<ViewportSize>('desktop')
  const [key, setKey] = useState(0)

  const demoUrl = '/demo-site-content/index.html'

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Guidance Banner - Étape 2 */}
      <div className="card p-4 bg-gradient-to-r from-[--atn-primary]/5 to-[--atn-secondary]/5 border-[--atn-primary]/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[--atn-primary] text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-[--atn-primary]/30">
            <span className="text-lg font-bold">2</span>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-[--text-primary]">Testez le chatbot IA en live</h2>
            <p className="text-sm text-[--text-secondary]">
              Cliquez sur la bulle bleue en bas à droite du site et posez vos questions
            </p>
          </div>
          <Link
            href="/guide"
            className="flex items-center gap-2 px-4 py-2 bg-[--bg-secondary] text-[--text-secondary] hover:text-[--atn-primary] rounded-lg text-sm font-medium transition-colors"
          >
            Étape suivante
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tips - Questions à tester */}
      <div className="card p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[--text-primary] mb-2">
              Essayez ces questions pour tester l'IA :
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 bg-[--bg-secondary] text-[--text-secondary] text-xs rounded-lg"
                >
                  "{q}"
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card p-3">
        <div className="flex items-center justify-between">
          {/* Viewport Switcher */}
          <div className="flex items-center gap-1 bg-[--bg-secondary] rounded-lg p-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewport === 'desktop'
                  ? 'bg-[--atn-primary] text-white'
                  : 'text-[--text-secondary] hover:text-[--text-primary]'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewport === 'tablet'
                  ? 'bg-[--atn-primary] text-white'
                  : 'text-[--text-secondary] hover:text-[--text-primary]'
              }`}
            >
              <Tablet className="w-4 h-4" />
              Tablet
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewport === 'mobile'
                  ? 'bg-[--atn-primary] text-white'
                  : 'text-[--text-secondary] hover:text-[--text-primary]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setKey(k => k + 1)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[--bg-secondary] hover:bg-[--bg-tertiary] rounded-lg text-sm font-medium transition-colors text-[--text-secondary]"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-[--bg-secondary] hover:bg-[--bg-tertiary] rounded-lg text-sm font-medium transition-colors text-[--text-secondary]"
            >
              <ExternalLink className="w-4 h-4" />
              Plein écran
            </a>
          </div>
        </div>
      </div>

      {/* iframe Container */}
      <div className="card p-0 overflow-hidden">
        <div
          className="mx-auto transition-all duration-300 bg-white"
          style={{
            width: viewportSizes[viewport].width,
            maxWidth: '100%',
          }}
        >
          <iframe
            id="demo-iframe"
            key={key}
            src={demoUrl}
            className="w-full border-0"
            style={{ height: 'calc(100vh - 180px)', minHeight: '700px' }}
            title="Site démo Air Tahiti Nui"
          />
        </div>
      </div>

      {/* Rappel chatbot */}
      <div className="flex items-center justify-center gap-2 text-sm text-[--text-tertiary]">
        <MessageCircle className="w-4 h-4 text-[--atn-primary]" />
        <span>Le chatbot est la bulle bleue en bas à droite du site ↗</span>
      </div>

      {/* Navigation vers étape suivante */}
      <div className="card p-6 text-center">
        <p className="text-[--text-secondary] mb-4">
          Vous avez testé le chatbot ? Passez à l'étape suivante.
        </p>
        <Link
          href="/guide"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[--atn-primary] text-white font-semibold rounded-xl hover:bg-[--atn-primary]/90 transition-all shadow-lg shadow-[--atn-primary]/20"
        >
          Voir les tarifs & ROI
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
