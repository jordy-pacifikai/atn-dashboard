'use client'

import { useState, useEffect } from 'react'
import { ListTodo, Mail, FileText, Eye, Edit3, Trash2, Send, Clock, CheckCircle, AlertCircle, Sparkles, Calendar, Filter, Plane, Hotel, Activity, Car, UtensilsCrossed, Loader2 } from 'lucide-react'
import Modal from '@/components/Modal'

interface PlannerItem {
  id: string
  type: 'Flight' | 'Hotel' | 'Activity' | 'Transfer' | 'Restaurant'
  title: string
  tripName: string
  location: string
  status: 'planned' | 'booked' | 'confirmed' | 'completed'
  startDate: string
  endDate: string
  notes: string
  price: number
  customerId: string
}

// Mapping statut Airtable vers affichage
const statusMapping: Record<string, 'planned' | 'booked' | 'confirmed' | 'completed'> = {
  'planned': 'planned',
  'booked': 'booked',
  'confirmed': 'confirmed',
  'completed': 'completed',
}

// Icons par type
const typeIcons: Record<string, any> = {
  'Flight': Plane,
  'Hotel': Hotel,
  'Activity': Activity,
  'Transfer': Car,
  'Restaurant': UtensilsCrossed,
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  planned: { label: 'Planifié', color: 'bg-slate-100 text-slate-600', icon: Clock },
  booked: { label: 'Réservé', color: 'bg-amber-100 text-amber-700', icon: CheckCircle },
  confirmed: { label: 'Confirmé', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  completed: { label: 'Terminé', color: 'bg-green-100 text-green-700', icon: Send },
}

function PlannerRow({
  item,
  onEdit,
  onPreview,
  onDelete,
  onStatusChange,
}: {
  item: PlannerItem
  onEdit: () => void
  onPreview: () => void
  onDelete: () => void
  onStatusChange: (status: PlannerItem['status']) => void
}) {
  const TypeIcon = typeIcons[item.type] || Activity
  const daysUntil = Math.ceil((new Date(item.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const typeColors: Record<string, string> = {
    'Flight': 'bg-blue-100 text-blue-600',
    'Hotel': 'bg-purple-100 text-purple-600',
    'Activity': 'bg-emerald-100 text-emerald-600',
    'Transfer': 'bg-amber-100 text-amber-600',
    'Restaurant': 'bg-pink-100 text-pink-600',
  }

  return (
    <div className="group flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
      {/* Type icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[item.type] || 'bg-slate-100'}`}>
        <TypeIcon className="w-5 h-5" />
      </div>

      {/* Content info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium truncate">{item.title}</h3>
          <span className="px-1.5 py-0.5 bg-atn-secondary/10 text-atn-secondary rounded text-xs">
            {item.type}
          </span>
        </div>
        <p className="text-sm text-slate-500 truncate">{item.tripName} • {item.location}</p>
      </div>

      {/* Customer */}
      <div className="hidden md:block">
        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
          {item.customerId}
        </span>
      </div>

      {/* Price */}
      <div className="hidden lg:flex items-center gap-3 text-xs">
        <span className="text-emerald-600 font-medium">
          {new Intl.NumberFormat('fr-FR').format(item.price)} XPF
        </span>
      </div>

      {/* Date */}
      <div className="text-right min-w-[100px]">
        <p className="text-sm font-medium">
          {new Date(item.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </p>
        <p className={`text-xs ${daysUntil <= 3 && daysUntil >= 0 ? 'text-red-500' : 'text-slate-500'}`}>
          {daysUntil === 0 ? 'Aujourd\'hui' : daysUntil < 0 ? 'Passé' : `J-${daysUntil}`}
        </p>
      </div>

      {/* Status dropdown */}
      <select
        value={item.status}
        onChange={(e) => onStatusChange(e.target.value as PlannerItem['status'])}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${statusConfig[item.status]?.color || 'bg-slate-100'}`}
      >
        {Object.entries(statusConfig).map(([value, config]) => (
          <option key={value} value={value}>{config.label}</option>
        ))}
      </select>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onPreview}
          className="p-2 hover:bg-slate-100 rounded-lg"
          title="Voir détails"
        >
          <Eye className="w-4 h-4 text-slate-500" />
        </button>
        <button
          onClick={onEdit}
          className="p-2 hover:bg-slate-100 rounded-lg"
          title="Modifier"
        >
          <Edit3 className="w-4 h-4 text-slate-500" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-50 rounded-lg"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  )
}

export default function PlannerPage() {
  const [items, setItems] = useState<PlannerItem[]>([])
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<PlannerItem | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlannerItems() {
      try {
        const res = await fetch('/api/airtable?table=Planner_Items&view=Grid%20view')
        if (res.ok) {
          const data = await res.json()
          const mapped: PlannerItem[] = data.records.map((r: any) => ({
            id: r.id,
            type: r.fields.Type || 'Activity',
            title: r.fields.Title || '',
            tripName: r.fields.Trip_Name || '',
            location: r.fields.Location || '',
            status: statusMapping[r.fields.Status] || 'planned',
            startDate: r.fields.Start_Date || new Date().toISOString(),
            endDate: r.fields.End_Date || new Date().toISOString(),
            notes: r.fields.Notes || '',
            price: r.fields.Price || 0,
            customerId: r.fields.Customer_ID || '',
          }))
          // Sort by start date
          mapped.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          setItems(mapped)
        }
      } catch (err) {
        console.error('Error fetching planner items:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlannerItems()
  }, [])

  const filteredItems = items.filter(c => {
    if (filterType && c.type !== filterType) return false
    if (filterStatus && c.status !== filterStatus) return false
    return true
  })

  const handleStatusChange = (id: string, status: PlannerItem['status']) => {
    setItems(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(c => c.id !== id))
  }

  // Stats
  const thisWeek = items.filter(c => {
    const days = Math.ceil((new Date(c.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 7
  })
  const booked = items.filter(c => c.status === 'booked').length
  const confirmed = items.filter(c => c.status === 'confirmed').length
  const totalValue = items.reduce((acc, item) => acc + item.price, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <ListTodo className="w-7 h-7 text-indigo-500" />
            Content Planner
          </h1>
          <p className="text-slate-500">Planification éditoriale sur 30 jours</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = '/calendar'}
            className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50"
          >
            <Calendar className="w-4 h-4" />
            Vue calendrier
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Cette semaine</p>
          <p className="text-2xl font-bold">{thisWeek.length}</p>
          <p className="text-xs text-slate-400">{thisWeek.filter(c => c.type === 'Flight').length} vols, {thisWeek.filter(c => c.type === 'Hotel').length} hôtels</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Réservés</p>
          <p className="text-2xl font-bold text-amber-600">{booked}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Confirmés</p>
          <p className="text-2xl font-bold text-emerald-600">{confirmed}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Valeur totale</p>
          <p className="text-2xl font-bold text-atn-secondary">{new Intl.NumberFormat('fr-FR').format(totalValue)} XPF</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600">Filtres:</span>
        </div>

        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${!filterType ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
            onClick={() => setFilterType(null)}
          >
            Tous
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${filterType === 'Flight' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
            onClick={() => setFilterType(filterType === 'Flight' ? null : 'Flight')}
          >
            <Plane className="w-3.5 h-3.5" />
            Vols
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${filterType === 'Hotel' ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}
            onClick={() => setFilterType(filterType === 'Hotel' ? null : 'Hotel')}
          >
            <Hotel className="w-3.5 h-3.5" />
            Hôtels
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${filterType === 'Activity' ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}
            onClick={() => setFilterType(filterType === 'Activity' ? null : 'Activity')}
          >
            <Activity className="w-3.5 h-3.5" />
            Activités
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        <select
          value={filterStatus || ''}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          className="px-3 py-1.5 rounded-lg text-sm border border-slate-200"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(statusConfig).map(([value, config]) => (
            <option key={value} value={value}>{config.label}</option>
          ))}
        </select>

        <div className="ml-auto text-sm text-slate-500">
          {filteredItems.length} éléments
        </div>
      </div>

      {/* Content list */}
      <div className="space-y-2">
        {filteredItems.map(item => (
          <PlannerRow
            key={item.id}
            item={item}
            onEdit={() => {
              setSelectedItem(item)
              setShowEditor(true)
            }}
            onPreview={() => {
              setSelectedItem(item)
              setShowPreview(true)
            }}
            onDelete={() => handleDelete(item.id)}
            onStatusChange={(status) => handleStatusChange(item.id, status)}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedItem && (
        <Modal onClose={() => { setShowPreview(false); setSelectedItem(null); }}>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const TypeIcon = typeIcons[selectedItem.type] || Activity
                  return <TypeIcon className="w-5 h-5 text-indigo-500" />
                })()}
                <span className="font-medium">{selectedItem.type} - {selectedItem.tripName}</span>
              </div>
              <button
                onClick={() => {
                  setShowPreview(false)
                  setSelectedItem(null)
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{selectedItem.title}</h1>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Lieu</p>
                  <p className="font-medium">{selectedItem.location}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Prix</p>
                  <p className="font-medium">{new Intl.NumberFormat('fr-FR').format(selectedItem.price)} XPF</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Début</p>
                  <p className="font-medium">{new Date(selectedItem.startDate).toLocaleString('fr-FR')}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Fin</p>
                  <p className="font-medium">{new Date(selectedItem.endDate).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-sm">
                <p className="text-slate-500 font-medium mb-2">Notes:</p>
                <p className="text-slate-700">{selectedItem.notes || 'Aucune note'}</p>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPreview(false)
                  setShowEditor(true)
                }}
                className="px-4 py-2 border border-slate-200 rounded-lg"
              >
                Modifier
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 transition-all">
                Confirmer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Editor Modal */}
      {showEditor && selectedItem && (
        <Modal onClose={() => { setShowEditor(false); setSelectedItem(null); }}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold">Modifier: {selectedItem.title}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  defaultValue={selectedItem.title}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lieu</label>
                <input
                  type="text"
                  defaultValue={selectedItem.location}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date début</label>
                  <input
                    type="datetime-local"
                    defaultValue={selectedItem.startDate.slice(0, 16)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date fin</label>
                  <input
                    type="datetime-local"
                    defaultValue={selectedItem.endDate.slice(0, 16)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg h-24"
                  defaultValue={selectedItem.notes}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowEditor(false)
                  setSelectedItem(null)
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-atn-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 transition-all">
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
