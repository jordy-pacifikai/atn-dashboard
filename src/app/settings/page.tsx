'use client'

import { useState } from 'react'
import { Settings, Database, Key, Bell, Globe, Save, Sparkles, Calendar, Loader2, Play } from 'lucide-react'
import { triggerSmartGeneration } from '@/lib/api'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<string | null>(null)

  // Content generation config state
  const [contentConfig, setContentConfig] = useState({
    generation_frequency: 'weekly',
    content_per_week: 7,
    newsletters_per_week: 3,
    articles_per_week: 4,
    advance_weeks: 4,
    auto_suggestions: true,
    suggestion_threshold: 20,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTriggerGeneration = async () => {
    setIsGenerating(true)
    setGenerationResult(null)
    try {
      const result = await triggerSmartGeneration()
      setGenerationResult(result.message || `${result.generated || 0} contenus générés`)
    } catch (error) {
      setGenerationResult('Erreur lors de la génération')
    }
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Settings className="w-7 h-7 text-slate-500" />
          Settings
        </h1>
        <p className="text-slate-500">Configuration du dashboard ATN</p>
      </div>

      {/* Smart Content Generation */}
      <div className="card bg-gradient-to-r from-atn-primary/5 to-atn-secondary/5 border-atn-secondary/20">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-atn-secondary" />
          Génération Intelligente de Contenu
          <span className="text-xs bg-atn-secondary text-white px-2 py-0.5 rounded-full ml-2">Build 15</span>
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fréquence de génération
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary"
              value={contentConfig.generation_frequency}
              onChange={(e) => setContentConfig({...contentConfig, generation_frequency: e.target.value})}
            >
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire (Lundi 8h)</option>
              <option value="biweekly">Bi-hebdomadaire</option>
              <option value="monthly">Mensuel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Semaines d'avance à maintenir
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary"
              value={contentConfig.advance_weeks}
              onChange={(e) => setContentConfig({...contentConfig, advance_weeks: parseInt(e.target.value)})}
            >
              <option value="2">2 semaines</option>
              <option value="3">3 semaines</option>
              <option value="4">4 semaines (1 mois)</option>
              <option value="6">6 semaines</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contenus / semaine
            </label>
            <input
              type="number"
              min="1"
              max="14"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary"
              value={contentConfig.content_per_week}
              onChange={(e) => setContentConfig({...contentConfig, content_per_week: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Newsletters / semaine
            </label>
            <input
              type="number"
              min="0"
              max="7"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary"
              value={contentConfig.newsletters_per_week}
              onChange={(e) => setContentConfig({...contentConfig, newsletters_per_week: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Articles SEO / semaine
            </label>
            <input
              type="number"
              min="0"
              max="7"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary"
              value={contentConfig.articles_per_week}
              onChange={(e) => setContentConfig({...contentConfig, articles_per_week: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 mb-4">
          <div>
            <p className="font-medium text-sm">Suggestions automatiques basées sur les KPIs</p>
            <p className="text-xs text-slate-500">L'IA suggère du contenu en cas d'anomalie (route en baisse, etc.)</p>
          </div>
          <input
            type="checkbox"
            checked={contentConfig.auto_suggestions}
            onChange={(e) => setContentConfig({...contentConfig, auto_suggestions: e.target.checked})}
            className="w-5 h-5 text-atn-secondary rounded focus:ring-atn-secondary"
          />
        </div>

        {contentConfig.auto_suggestions && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Seuil d'anomalie pour suggestion (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={contentConfig.suggestion_threshold}
                onChange={(e) => setContentConfig({...contentConfig, suggestion_threshold: parseInt(e.target.value)})}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12">{contentConfig.suggestion_threshold}%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ex: Si une route baisse de plus de {contentConfig.suggestion_threshold}%, l'IA suggère un contenu ciblé
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerGeneration}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-atn-secondary text-white rounded-lg hover:bg-atn-secondary/90 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Lancer génération maintenant
              </>
            )}
          </button>
          {generationResult && (
            <span className={`text-sm ${generationResult.includes('Erreur') ? 'text-red-600' : 'text-emerald-600'}`}>
              {generationResult}
            </span>
          )}
        </div>
      </div>

      {/* API Keys */}
      <div className="card">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-slate-400" />
          Clés API
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Airtable API Key
            </label>
            <input
              type="password"
              placeholder="pat..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary"
              defaultValue="••••••••••••••••"
            />
            <p className="text-xs text-slate-500 mt-1">Base ID: appWd0x5YZPHKL0VK</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Supabase Anon Key
            </label>
            <input
              type="password"
              placeholder="eyJ..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary"
              defaultValue="••••••••••••••••"
            />
            <p className="text-xs text-slate-500 mt-1">Project: ogsimsfqwibcmotaeevb</p>
          </div>
        </div>
      </div>

      {/* n8n Configuration */}
      <div className="card">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-slate-400" />
          n8n Webhooks
        </h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Base URL
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary"
            defaultValue="https://n8n.srv1140766.hstgr.cloud/webhook"
          />
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm font-medium mb-2">Workflows actifs:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Build 1-10: Agents IA Métier</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span>Build 11-14: Dashboard (à activer)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span>Build 15: Smart Generator (à activer)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-slate-400" />
          Notifications
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Alertes critiques (erreurs workflows)', default: true },
            { label: 'Alertes concurrentielles (prix)', default: true },
            { label: 'Retards/annulations de vols', default: true },
            { label: 'Nouveaux avis clients', default: false },
            { label: 'Rapports quotidiens', default: true },
          ].map((item, i) => (
            <label key={i} className="flex items-center justify-between">
              <span className="text-sm">{item.label}</span>
              <input
                type="checkbox"
                defaultChecked={item.default}
                className="w-4 h-4 text-atn-secondary rounded focus:ring-atn-secondary"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="card">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-slate-400" />
          Langue & Région
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Langue interface
            </label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary">
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fuseau horaire
            </label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-atn-secondary">
              <option value="Pacific/Tahiti">Pacific/Tahiti (UTC-10)</option>
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="America/Los_Angeles">Los Angeles (UTC-8)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          className="btn-primary flex items-center gap-2"
          onClick={handleSave}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Sauvegardé !' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  )
}
