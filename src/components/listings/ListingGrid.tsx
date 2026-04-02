import ListingCard from './ListingCard'
import type { Listing } from '@/types'

export default function ListingGrid({ listings }: { listings: Listing[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">
          <span className="font-semibold text-foreground">{listings.length}</span>{' '}
          annonce{listings.length !== 1 ? 's' : ''} trouvée{listings.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
