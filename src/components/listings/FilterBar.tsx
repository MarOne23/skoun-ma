'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

const CATEGORIES = [
  { value: '', label: 'Toutes catégories' },
  { value: 'vente', label: 'Vente' },
  { value: 'location', label: 'Location' },
  { value: 'location-estivale', label: 'Location Estivale' },
  { value: 'colocation', label: 'Colocation' },
  { value: 'commercial', label: 'Locaux Commerciaux' },
  { value: 'projets-neufs', label: 'Projets Neufs' },
]

const TRANSACTION_TYPES = [
  { value: '', label: 'Vente & Location' },
  { value: 'vente', label: 'Vente uniquement' },
  { value: 'location', label: 'Location uniquement' },
]

export default function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [city, setCity] = useState(searchParams.get('ville') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [transactionType, setTransactionType] = useState(searchParams.get('type') ?? '')

  function applyFilters() {
    const params = new URLSearchParams()
    if (city.trim()) params.set('ville', city.trim())
    if (category) params.set('category', category)
    if (transactionType) params.set('type', transactionType)
    startTransition(() => {
      router.push(`/annonces${params.size ? `?${params}` : ''}`)
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* City search */}
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Ville, quartier..."
            className="flex-1 text-sm text-foreground placeholder-gray-400 outline-none bg-transparent"
          />
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 sm:w-52 focus-within:border-primary/50 transition-all">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Transaction type */}
        <div className="flex gap-1 border border-gray-200 rounded-xl p-1 bg-gray-50">
          {TRANSACTION_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTransactionType(t.value)}
              className={`flex-1 text-xs font-medium px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                transactionType === t.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search button */}
        <button
          onClick={applyFilters}
          disabled={isPending}
          className="bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap shadow-sm"
        >
          {isPending ? 'Recherche…' : 'Rechercher'}
        </button>
      </div>
    </div>
  )
}
