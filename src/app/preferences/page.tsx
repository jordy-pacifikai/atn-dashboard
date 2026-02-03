'use client'

import { useState, useEffect } from 'react'
import { Shield, User, Mail, Bell, Plane, Settings, CheckCircle, XCircle, Clock, Search, Download, RefreshCw, Loader2 } from 'lucide-react'

interface CustomerPreferences {
  id: string
  email: string
  name: string
  lastUpdated: string
  consentStatus: 'full' | 'partial' | 'minimal'
  preferences: {
    category: string
    name: string
    enabled: boolean
    lastChanged: string
  }[]
  communicationChannels: {
    email: boolean
    sms: boolean
    push: boolean
    mail: boolean
  }
  interests: string[]
  language: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'never'
}

const fallbackCustomers: CustomerPreferences[] = [
  {
    id: '1',
    email: 'marie.dupont@email.com',
    name: 'Marie Dupont',
    lastUpdated: '2026-01-28T14:30:00',
    consentStatus: 'full',
    preferences: [
      { category: 'Marketing', name: 'Newsletters', enabled: true, lastChanged: '2026-01-28T14:30:00' },
      { category: 'Marketing', name: 'Offres promotionnelles', enabled: true, lastChanged: '2026-01-28T14:30:00' },
      { category: 'Marketing', name: 'Partenaires', enabled: false, lastChanged: '2026-01-28T14:30:00' },
      { category: 'Service', name: 'Alertes vol', enabled: true, lastChanged: '2026-01-15T10:00:00' },
      { category: 'Service', name: 'Rappels check-in', enabled: true, lastChanged: '2026-01-15T10:00:00' },
    ],
    communicationChannels: { email: true, sms: true, push: false, mail: false },
    interests: ['Polynésie', 'Business Class', 'Voyages en famille'],
    language: 'FR',
    frequency: 'weekly',
  },
  {
    id: '2',
    email: 'john.smith@company.com',
    name: 'John Smith',
    lastUpdated: '2026-01-25T09:00:00',
    consentStatus: 'partial',
    preferences: [
      { category: 'Marketing', name: 'Newsletters', enabled: true, lastChanged: '2026-01-25T09:00:00' },
      { category: 'Marketing', name: 'Offres promotionnelles', enabled: false, lastChanged: '2026-01-25T09:00:00' },
      { category: 'Marketing', name: 'Partenaires', enabled: false, lastChanged: '2026-01-25T09:00:00' },
      { category: 'Service', name: 'Alertes vol', enabled: true, lastChanged: '2026-01-10T16:00:00' },
      { category: 'Service', name: 'Rappels check-in', enabled: true, lastChanged: '2026-01-10T16:00:00' },
    ],
    communicationChannels: { email: true, sms: false, push: false, mail: false },
    interests: ['Los Angeles', 'Economy'],
    language: 'EN',
    frequency: 'monthly',
  },
  {
    id: '3',
    email: 'sophie.martin@email.fr',
    name: 'Sophie Martin',
    lastUpdated: '2026-01-20T11:00:00',
    consentStatus: 'minimal',
    preferences: [
      { category: 'Marketing', name: 'Newsletters', enabled: false, lastChanged: '2026-01-20T11:00:00' },
      { category: 'Marketing', name: 'Offres promotionnelles', enabled: false, lastChanged: '2026-01-20T11:00:00' },
      { category: 'Marketing', name: 'Partenaires', enabled: false, lastChanged: '2026-01-20T11:00:00' },
      { category: 'Service', name: 'Alertes vol', enabled: true, lastChanged: '2026-01-05T08:00:00' },
      { category: 'Service', name: 'Rappels check-in', enabled: false, lastChanged: '2026-01-20T11:00:00' },
    ],
    communicationChannels: { email: true, sms: false, push: false, mail: false },
    interests: [],
    language: 'FR',
    frequency: 'never',
  },
]

function ConsentBadge({ status }: { status: CustomerPreferences['consentStatus'] }) {
  const config = {
    full: { label: 'Complet', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    partial: { label: 'Partiel', color: 'bg-amber-100 text-amber-700', icon: Clock },
    minimal: { label: 'Minimal', color: 'bg-red-100 text-red-700', icon: XCircle },
  }
  const { label, color, icon: Icon } = config[status]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

function ChannelBadge({ channel, enabled }: { channel: string; enabled: boolean }) {
  return (
    <span className={`px-2 py-1 rounded text-xs ${
      enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400 line-through'
    }`}>
      {channel}
    </span>
  )
}

function CustomerCard({ customer }: { customer: CustomerPreferences }) {
  const [expanded, setExpanded] = useState(false)

  const marketingPrefs = customer.preferences.filter(p => p.category === 'Marketing')
  const servicePrefs = customer.preferences.filter(p => p.category === 'Service')

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-atn-primary/10 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-atn-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{customer.name}</h3>
            <p className="text-sm text-slate-500">{customer.email}</p>
          </div>
        </div>
        <ConsentBadge status={customer.consentStatus} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Canaux autorisés</p>
          <div className="flex flex-wrap gap-1">
            <ChannelBadge channel="Email" enabled={customer.communicationChannels.email} />
            <ChannelBadge channel="SMS" enabled={customer.communicationChannels.sms} />
            <ChannelBadge channel="Push" enabled={customer.communicationChannels.push} />
            <ChannelBadge channel="Courrier" enabled={customer.communicationChannels.mail} />
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Fréquence</p>
          <p className="text-sm font-medium capitalize">{customer.frequency === 'never' ? 'Jamais' : customer.frequency}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Langue</p>
          <p className="text-sm font-medium">{customer.language}</p>
        </div>
      </div>

      {customer.interests.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-1">Centres d'intérêt</p>
          <div className="flex flex-wrap gap-1">
            {customer.interests.map(interest => (
              <span key={interest} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        className="text-sm text-atn-secondary hover:underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Masquer détails' : 'Voir tous les consentements'}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Marketing
            </h4>
            <div className="space-y-2">
              {marketingPrefs.map(pref => (
                <div key={pref.name} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm">{pref.name}</span>
                  <div className="flex items-center gap-2">
                    {pref.enabled ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(pref.lastChanged).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Service
            </h4>
            <div className="space-y-2">
              {servicePrefs.map(pref => (
                <div key={pref.name} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm">{pref.name}</span>
                  <div className="flex items-center gap-2">
                    {pref.enabled ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(pref.lastChanged).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
        Dernière mise à jour: {new Date(customer.lastUpdated).toLocaleString('fr-FR')}
      </div>
    </div>
  )
}

export default function PreferencesPage() {
  const [customers, setCustomers] = useState<CustomerPreferences[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Fetch preferences from Airtable
  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/airtable?table=Customer_Preferences&sortField=Last_Updated&sortDir=desc&limit=100')
      const data = await response.json()

      if (data.records && data.records.length > 0) {
        const mapped: CustomerPreferences[] = data.records.map((record: { id: string; fields: Record<string, unknown> }) => ({
          id: record.id,
          email: (record.fields.Email as string) || 'contact@email.com',
          name: (record.fields.Name as string) || 'Client',
          lastUpdated: (record.fields.Last_Updated as string) || new Date().toISOString(),
          consentStatus: ((record.fields.Consent_Status as string)?.toLowerCase() || 'partial') as CustomerPreferences['consentStatus'],
          preferences: (record.fields.Preferences as CustomerPreferences['preferences']) || [],
          communicationChannels: {
            email: (record.fields.Channel_Email as boolean) ?? true,
            sms: (record.fields.Channel_SMS as boolean) ?? false,
            push: (record.fields.Channel_Push as boolean) ?? false,
            mail: (record.fields.Channel_Mail as boolean) ?? false,
          },
          interests: (record.fields.Interests as string[]) || [],
          language: (record.fields.Language as string) || 'FR',
          frequency: ((record.fields.Frequency as string)?.toLowerCase() || 'weekly') as CustomerPreferences['frequency'],
        }))
        setCustomers(mapped)
      } else {
        setCustomers(fallbackCustomers)
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
      setCustomers(fallbackCustomers)
    } finally {
      setLoading(false)
    }
  }

  // Sync preferences (trigger n8n workflow)
  const syncPreferences = async () => {
    setSyncing(true)
    try {
      await fetch('https://n8n.srv1140766.hstgr.cloud/webhook/atn-preference-center', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' })
      })
      await fetchPreferences()
    } catch (error) {
      console.error('Error syncing preferences:', error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [])

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: customers.length,
    fullConsent: customers.filter(c => c.consentStatus === 'full').length,
    partialConsent: customers.filter(c => c.consentStatus === 'partial').length,
    optedOut: customers.filter(c => c.frequency === 'never').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Shield className="w-7 h-7 text-lime-500" />
            Preference Center
          </h1>
          <p className="text-slate-500">Build 25: Gestion préférences client RGPD</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={syncPreferences}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
          >
            {syncing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {syncing ? 'Sync...' : 'Actualiser'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
            <Download className="w-4 h-4" />
            Export RGPD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Total clients</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Consentement complet</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.fullConsent}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Consentement partiel</p>
          <p className="text-2xl font-bold text-amber-600">{stats.partialConsent}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Opt-out complet</p>
          <p className="text-2xl font-bold text-red-600">{stats.optedOut}</p>
        </div>
      </div>

      {/* RGPD Info */}
      <div className="p-4 bg-lime-50 border border-lime-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-lime-600" />
          <span className="font-medium text-lime-800">Conformité RGPD</span>
        </div>
        <p className="text-sm text-lime-700">
          Tous les consentements sont horodatés et vérifiables. Les clients peuvent modifier leurs préférences
          à tout moment via le lien de désinscription ou leur espace client.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-atn-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Liste des clients */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atn-primary" />
            <span className="ml-3 text-slate-500">Chargement des préférences...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Aucun client trouvé
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} />
          ))
        )}
      </div>
    </div>
  )
}
