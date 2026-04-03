'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Category } from '@/types'

const CATEGORY_ICONS: Record<Category, string> = {
  appartement: '🏢',
  villa: '🏡',
  studio: '🛏️',
  commercial: '🏪',
  terrain: '🌿',
  autre: '🏠',
}

const CATEGORY_LABELS: Record<Category, string> = {
  appartement: 'Appartement',
  villa: 'Villa',
  studio: 'Studio',
  commercial: 'Local Commercial',
  terrain: 'Terrain',
  autre: 'Autre',
}

interface Props {
  photos: string[]
  title: string
  category: Category
}

export default function PhotoGallery({ photos, title, category }: Props) {
  const [active, setActive] = useState(0)

  function prev() {
    setActive((i) => (i === 0 ? photos.length - 1 : i - 1))
  }

  function next() {
    setActive((i) => (i === photos.length - 1 ? 0 : i + 1))
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary/8 to-primary/15 border border-primary/10 flex flex-col items-center justify-center gap-4 py-20">
        <span className="text-7xl select-none">{CATEGORY_ICONS[category] ?? '🏠'}</span>
        <div className="text-center">
          <p className="text-primary font-semibold text-lg">{CATEGORY_LABELS[category] ?? 'Bien immobilier'}</p>
          <p className="text-primary/40 text-sm mt-1">Aucune photo disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main photo */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 group">
        <img
          key={active}
          src={photos[active]}
          alt={`${title} — photo ${active + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Nav arrows — only when multiple photos */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Counter pill */}
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
              {active + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {photos.map((photo, i) => (
            <button
              key={photo}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === active
                  ? 'border-primary scale-[1.03] shadow-md'
                  : 'border-transparent opacity-60 hover:opacity-90'
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
