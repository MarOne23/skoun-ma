import Link from 'next/link'
import { MapPin, BedDouble, Maximize2, Sparkles } from 'lucide-react'
import type { Listing, Category } from '@/types'

const CATEGORY_LABELS: Record<Category, string> = {
  vente: 'Vente',
  location: 'Location',
  'location-estivale': 'Estivale',
  colocation: 'Colocation',
  commercial: 'Commercial',
  'projets-neufs': 'Projet Neuf',
}

const CATEGORY_STYLES: Record<Category, string> = {
  vente: 'bg-primary text-white',
  location: 'bg-blue-600 text-white',
  'location-estivale': 'bg-amber-500 text-white',
  colocation: 'bg-violet-600 text-white',
  commercial: 'bg-slate-700 text-white',
  'projets-neufs': 'bg-emerald-600 text-white',
}

function formatPrice(price: number | null, transactionType: string): string {
  if (price === null) return 'Prix à convenir'
  const formatted = price.toLocaleString('fr-MA')
  if (transactionType === 'location') return `${formatted} DH/mois`
  if (transactionType === 'location-estivale') return `${formatted} DH/sem.`
  return `${formatted} DH`
}

function isNew(createdAt: string): boolean {
  const diff = Date.now() - new Date(createdAt).getTime()
  return diff < 7 * 24 * 60 * 60 * 1000
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos?.[0] ?? null
  const badge = CATEGORY_STYLES[listing.category] ?? 'bg-gray-500 text-white'
  const label = CATEGORY_LABELS[listing.category] ?? listing.category
  const fresh = isNew(listing.created_at)

  return (
    <Link
      href={`/annonces/${listing.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-200 flex flex-col"
    >
      {/* Photo */}
      <div className="relative h-48 bg-gray-50 overflow-hidden flex-shrink-0">
        {photo ? (
          <img
            src={photo}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/5 to-primary/10">
            <span className="text-5xl select-none">🏠</span>
            <span className="text-xs text-primary/30 font-medium">Aucune photo</span>
          </div>
        )}

        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}>
          {label}
        </span>

        {/* "Nouveau" badge */}
        {fresh && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            <Sparkles className="w-3 h-3" />
            Nouveau
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Price */}
        <p className="text-primary font-bold text-lg leading-none mb-2">
          {formatPrice(listing.price, listing.transaction_type)}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
          {listing.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">
            {listing.neighborhood ? `${listing.neighborhood}, ` : ''}
            {listing.city}
          </span>
        </div>

        {/* Specs */}
        {(listing.rooms || listing.surface_m2) && (
          <div className="flex items-center gap-3 text-gray-400 text-xs border-t border-gray-50 pt-3">
            {listing.rooms && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                {listing.rooms} {listing.rooms > 1 ? 'pièces' : 'pièce'}
              </span>
            )}
            {listing.surface_m2 && (
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" />
                {listing.surface_m2} m²
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
