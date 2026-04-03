import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  MapPin, BedDouble, Maximize2, Home,
  Phone, Mail, MessageCircle, ShieldAlert, Flag,
  ChevronRight, Calendar, Tag, ArrowLeft,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PhotoGallery from '@/components/listings/PhotoGallery'
import ListingCard from '@/components/listings/ListingCard'
import type { Listing, Category, TransactionType } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<Category, string> = {
  appartement: 'Appartement',
  villa: 'Villa',
  studio: 'Studio',
  commercial: 'Local Commercial',
  terrain: 'Terrain',
  autre: 'Autre',
}

const TRANSACTION_LABELS: Record<TransactionType, string> = {
  vente: 'Vente',
  location: 'Location',
}

function formatPrice(price: number | null, tx: TransactionType): string {
  if (price === null) return 'Prix à convenir'
  const n = price.toLocaleString('fr-MA')
  return tx === 'location' ? `${n} DH/mois` : `${n} DH`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-MA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('title, description, city')
    .eq('id', slug)
    .single()

  if (!data) return { title: 'Annonce introuvable — Skoun.ma' }

  return {
    title: `${data.title} — Skoun.ma`,
    description: data.description
      ? data.description.slice(0, 160)
      : `Annonce immobilière à ${data.city} sur Skoun.ma`,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch listing
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', slug)
    .single()

  if (!listing) notFound()

  const l = listing as Listing

  // Fetch related (same city, different id, max 3)
  const { data: related } = await supabase
    .from('listings')
    .select('*')
    .eq('city', l.city)
    .eq('status', 'active')
    .neq('id', l.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const relatedListings = (related ?? []) as Listing[]
  const catLabel = CATEGORY_LABELS[l.category] ?? l.category
  const txLabel = TRANSACTION_LABELS[l.transaction_type] ?? l.transaction_type

  const specs = [
    { label: 'Type de bien', value: catLabel },
    { label: 'Transaction', value: txLabel },
    { label: 'Surface', value: l.surface_m2 ? `${l.surface_m2} m²` : null },
    { label: 'Nombre de pièces', value: l.rooms ? `${l.rooms} pièce${l.rooms > 1 ? 's' : ''}` : null },
    { label: 'Ville', value: l.city },
    { label: 'Quartier', value: l.neighborhood },
    { label: 'Publié le', value: formatDate(l.created_at) },
    { label: 'Référence', value: l.id.split('-')[0].toUpperCase() },
  ].filter((s) => s.value !== null) as { label: string; value: string }[]

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/annonces" className="hover:text-primary transition-colors">Annonces</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link
              href={`/annonces?ville=${encodeURIComponent(l.city)}`}
              className="hover:text-primary transition-colors"
            >
              {l.city}
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{l.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/annonces"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux annonces
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left column (2/3) ── */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Photo gallery */}
            <PhotoGallery
              photos={l.photos ?? []}
              title={l.title}
              category={l.category}
            />

            {/* Title + price */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                <div className="min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-primary/8 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      {catLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {txLabel}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                    {l.title}
                  </h1>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-3xl font-extrabold text-primary">
                    {formatPrice(l.price, l.transaction_type)}
                  </p>
                  {l.transaction_type === 'location' && (
                    <p className="text-xs text-gray-400 mt-0.5">par mois, charges variables</p>
                  )}
                </div>
              </div>

              {/* Key info pills */}
              <div className="flex flex-wrap gap-2 py-4 border-t border-b border-gray-50">
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {l.neighborhood ? `${l.neighborhood}, ` : ''}{l.city}
                </span>
                {l.surface_m2 && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                    <Maximize2 className="w-3.5 h-3.5 text-primary" />
                    {l.surface_m2} m²
                  </span>
                )}
                {l.rooms && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                    <BedDouble className="w-3.5 h-3.5 text-primary" />
                    {l.rooms} pièce{l.rooms > 1 ? 's' : ''}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(l.created_at)}
                </span>
              </div>
            </div>

            {/* Description */}
            {l.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {l.description}
                </p>
              </div>
            )}

            {/* Characteristics */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                Caractéristiques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y divide-gray-50 sm:divide-y-0">
                {specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex items-center justify-between py-3 sm:py-3.5 ${
                      i % 2 === 0 ? 'sm:pr-6 sm:border-r sm:border-gray-50' : 'sm:pl-6'
                    }`}
                  >
                    <span className="text-sm text-gray-400">{spec.label}</span>
                    <span className="text-sm font-semibold text-foreground text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column — Contact sidebar (1/3) ── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-foreground mb-5">
                  Contacter le propriétaire
                </h2>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#20b958] text-white font-bold py-3.5 px-5 rounded-xl transition-colors mb-3 text-sm shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contacter sur WhatsApp
                </a>

                {/* Phone */}
                <button className="flex items-center justify-center gap-2.5 w-full bg-primary/8 hover:bg-primary/15 text-primary font-semibold py-3 px-5 rounded-xl transition-colors mb-3 text-sm border border-primary/20">
                  <Phone className="w-4 h-4" />
                  Voir le numéro
                </button>

                {/* Email */}
                <button className="flex items-center justify-center gap-2.5 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-5 rounded-xl transition-colors text-sm border border-gray-200">
                  <Mail className="w-4 h-4" />
                  Envoyer un message
                </button>

                {/* Safety notice */}
                <div className="mt-5 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Ne payez jamais d&apos;avance sans avoir visité le bien en personne.
                  </p>
                </div>

                {/* Reference */}
                <p className="text-center text-xs text-gray-300 mt-4">
                  Réf. {l.id.split('-')[0].toUpperCase()}
                </p>
              </div>

              {/* Report link */}
              <div className="text-center">
                <button className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
                  <Flag className="w-3.5 h-3.5" />
                  Signaler cette annonce
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related listings ── */}
        {relatedListings.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Annonces similaires à{' '}
                <span className="text-primary">{l.city}</span>
              </h2>
              <Link
                href={`/annonces?ville=${encodeURIComponent(l.city)}`}
                className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
              >
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedListings.map((r) => (
                <ListingCard key={r.id} listing={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
