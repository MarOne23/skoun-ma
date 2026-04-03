import Link from 'next/link'
import { MapPin, BedDouble, Maximize2, Sparkles } from 'lucide-react'
import type { Listing, Category, TransactionType } from '@/types'

const CATEGORY_LABELS: Record<Category, string> = {
  appartement: 'Appartement',
  villa: 'Villa',
  studio: 'Studio',
  commercial: 'Local Commercial',
  terrain: 'Terrain',
  autre: 'Autre',
}

const CATEGORY_STYLES: Record<Category, string> = {
  appartement: 'bg-blue-600 text-white',
  villa: 'bg-primary text-white',
  studio: 'bg-violet-600 text-white',
  commercial: 'bg-slate-700 text-white',
  terrain: 'bg-amber-600 text-white',
  autre: 'bg-gray-500 text-white',
}

const TRANSACTION_LABELS: Record<TransactionType, string> = {
  vente: 'Vente',
  location: 'Location',
}

function formatPrice(price: number | null, transactionType: TransactionType): string {
  if (price === null) return 'Prix à convenir'
  const formatted = price.toLocaleString('fr-MA')
  if (transactionType === 'location') return `${formatted} DH/mois`
  return `${formatted} DH`
}

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos?.[0] ?? null
  const catStyle = CATEGORY_STYLES[listing.category] ?? 'bg-gray-500 text-white'
  const catLabel = CATEGORY_LABELS[listing.category] ?? listing.category
  const txLabel = TRANSACTION_LABELS[listing.transaction_type] ?? listing.transaction_type
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

        {/* Category + transaction badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catStyle}`}>
            {catLabel}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm">
            {txLabel}
          </span>
        </div>

        {fresh && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            <Sparkles className="w-3 h-3" />
            Nouveau
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-primary font-bold text-lg leading-none mb-2">
          {formatPrice(listing.price, listing.transaction_type)}
        </p>

        <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">
            {listing.neighborhood ? `${listing.neighborhood}, ` : ''}
            {listing.city}
          </span>
        </div>

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
