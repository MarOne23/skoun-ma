import Link from 'next/link'
import { PlusCircle, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ListingGrid from '@/components/listings/ListingGrid'
import FilterBar from '@/components/listings/FilterBar'
import type { Category, Listing } from '@/types'
import { Suspense } from 'react'

const SEED_LISTINGS = [
  {
    title: 'Appartement 3 pièces lumineux — Maarif',
    description:
      'Bel appartement de 3 pièces au cœur du Maarif. Lumineux, bien agencé, proche de toutes commodités. Idéal pour une famille ou des professionnels.',
    category: 'vente' as Category,
    transaction_type: 'vente',
    price: 1_450_000,
    city: 'Casablanca',
    neighborhood: 'Maarif',
    surface_m2: 115,
    rooms: 3,
    photos: [],
    status: 'active',
    user_id: '00000000-0000-0000-0000-000000000001',
  },
  {
    title: 'Villa moderne avec piscine — Hivernage',
    description:
      'Splendide villa de standing avec piscine privée dans le quartier prisé de l\'Hivernage. Prestations haut de gamme, jardin paysager, garage.',
    category: 'location' as Category,
    transaction_type: 'location',
    price: 28_000,
    city: 'Marrakech',
    neighborhood: 'Hivernage',
    surface_m2: 320,
    rooms: 5,
    photos: [],
    status: 'active',
    user_id: '00000000-0000-0000-0000-000000000001',
  },
  {
    title: 'Studio meublé tout équipé — Agdal',
    description:
      'Studio moderne entièrement meublé et équipé dans le quartier calme de l\'Agdal. Parfait pour étudiant ou jeune actif. Charges comprises.',
    category: 'location' as Category,
    transaction_type: 'location',
    price: 4_500,
    city: 'Rabat',
    neighborhood: 'Agdal',
    surface_m2: 38,
    rooms: 1,
    photos: [],
    status: 'active',
    user_id: '00000000-0000-0000-0000-000000000001',
  },
]

async function seedIfEmpty(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const { count } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })

    if (count === 0) {
      await supabase.from('listings').insert(SEED_LISTINGS)
    }
  } catch {
    // Table may not exist yet — silently skip
  }
}

async function getListings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  filters: { ville?: string; category?: string; type?: string }
): Promise<Listing[]> {
  try {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (filters.ville) {
      query = query.ilike('city', `%${filters.ville}%`)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.type) {
      query = query.eq('transaction_type', filters.type)
    }

    const { data, error } = await query
    if (error) return []
    return (data as Listing[]) ?? []
  } catch {
    return []
  }
}

// Async wrapper to allow Suspense boundary around FilterBar
function FilterBarWrapper() {
  return <FilterBar />
}

export default async function AnnoncesPage({
  searchParams,
}: {
  searchParams: Promise<{ ville?: string; category?: string; type?: string }>
}) {
  const filters = await searchParams
  const supabase = await createClient()

  await seedIfEmpty(supabase)
  const listings = await getListings(supabase, filters)

  const hasFilters = !!(filters.ville || filters.category || filters.type)

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-primary">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-12">
          <h1 className="text-3xl font-bold text-white mb-1">
            Annonces immobilières
          </h1>
          <p className="text-white/60 text-sm mb-6">
            {listings.length > 0
              ? `${listings.length} annonce${listings.length > 1 ? 's' : ''} disponible${listings.length > 1 ? 's' : ''}`
              : 'Trouvez votre bien au Maroc'}
          </p>

          {/* Filter bar — needs Suspense because useSearchParams inside */}
          <Suspense fallback={<div className="h-16 bg-white/10 rounded-2xl animate-pulse" />}>
            <FilterBarWrapper />
          </Suspense>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {listings.length > 0 ? (
          <ListingGrid listings={listings} />
        ) : (
          <EmptyState hasFilters={hasFilters} />
        )}
      </div>
    </div>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary/8 flex items-center justify-center mb-6">
        <Home className="w-9 h-9 text-primary/40" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">
        {hasFilters ? 'Aucune annonce trouvée' : 'Aucune annonce disponible pour le moment'}
      </h2>
      <p className="text-gray-400 text-sm max-w-sm mb-8">
        {hasFilters
          ? 'Essayez de modifier vos filtres pour voir plus de résultats.'
          : 'Soyez le premier à publier une annonce sur Skoun.ma.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {hasFilters && (
          <Link
            href="/annonces"
            className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-primary/30 hover:text-primary transition-colors"
          >
            Effacer les filtres
          </Link>
        )}
        <Link
          href="/publier"
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-sm shadow-accent/20"
        >
          <PlusCircle className="w-4 h-4" />
          Publier une annonce
        </Link>
      </div>
    </div>
  )
}
