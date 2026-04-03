'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Home, Building2, BedSingle, Store, TreePine, HelpCircle,
  Upload, X, Check, ChevronRight, ChevronLeft, Loader2,
  ImagePlus, MapPin, Ruler, CheckCircle2,
} from 'lucide-react'
import type { Category, TransactionType } from '@/types'

const PROPERTY_TYPES: { value: Category; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'appartement', label: 'Appartement', icon: Building2, desc: 'F2, F3, duplex…' },
  { value: 'villa', label: 'Villa', icon: Home, desc: 'Avec ou sans piscine' },
  { value: 'studio', label: 'Studio', icon: BedSingle, desc: 'Meublé ou non' },
  { value: 'commercial', label: 'Local Commercial', icon: Store, desc: 'Bureau, boutique…' },
  { value: 'terrain', label: 'Terrain', icon: TreePine, desc: 'Nu ou viabilisé' },
  { value: 'autre', label: 'Autre', icon: HelpCircle, desc: 'Riad, ferme…' },
]

const CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir',
  'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'El Jadida', 'Salé',
  'Béni Mellal', 'Nador', 'Settat', 'Autre',
]

const ROOMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

type PhotoPreview = { file: File; url: string }

type FormData = {
  transactionType: TransactionType | ''
  category: Category | ''
  title: string
  description: string
  price: string
  city: string
  neighborhood: string
  surface: string
  rooms: number | null
}

// ─── Progress Bar ────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const steps = ['Type de bien', 'Détails', 'Photos']
  return (
    <div className="mb-10">
      <div className="flex items-center gap-0">
        {steps.map((label, i) => {
          const idx = i + 1
          const done = step > idx
          const active = step === idx
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    done
                      ? 'bg-primary border-primary text-white'
                      : active
                      ? 'bg-white border-primary text-primary shadow-md'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}
                >
                  {done ? <Check className="w-4 h-4" /> : idx}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    active ? 'text-primary' : done ? 'text-primary/70' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${
                    step > idx ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 1 ─────────────────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
}: {
  data: Pick<FormData, 'transactionType' | 'category'>
  onChange: (patch: Partial<FormData>) => void
}) {
  return (
    <div className="space-y-8">
      {/* Transaction type */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Je souhaite…</h2>
        <p className="text-gray-400 text-sm mb-4">Choisissez le type de transaction</p>
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              { value: 'vente', label: 'Vendre', sub: 'Mettre en vente mon bien', emoji: '🏷️' },
              { value: 'location', label: 'Louer', sub: 'Proposer à la location', emoji: '🔑' },
            ] as { value: TransactionType; label: string; sub: string; emoji: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ transactionType: opt.value })}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                data.transactionType === opt.value
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
              }`}
            >
              {data.transactionType === opt.value && (
                <span className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}
              <span className="text-3xl mb-3 block">{opt.emoji}</span>
              <p className="font-bold text-foreground text-base">{opt.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Property category */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Type de bien</h2>
        <p className="text-gray-400 text-sm mb-4">Quel type de propriété proposez-vous ?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PROPERTY_TYPES.map((pt) => {
            const Icon = pt.icon
            const selected = data.category === pt.value
            return (
              <button
                key={pt.value}
                type="button"
                onClick={() => onChange({ category: pt.value })}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                  selected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
                }`}
              >
                {selected && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${selected ? 'bg-primary/15' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${selected ? 'text-primary' : 'text-gray-500'}`} />
                </div>
                <p className={`font-semibold text-sm ${selected ? 'text-primary' : 'text-foreground'}`}>
                  {pt.label}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{pt.desc}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Step 2 ─────────────────────────────────────────────────────────────────

function Step2({
  data,
  onChange,
}: {
  data: Omit<FormData, 'transactionType' | 'category'>
  onChange: (patch: Partial<FormData>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Détails du bien</h2>
        <p className="text-gray-400 text-sm">Décrivez votre propriété avec précision</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Titre de l&apos;annonce <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ex: Appartement 3 pièces, vue mer, Ain Diab"
          maxLength={120}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-foreground placeholder-gray-400 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{data.title.length}/120</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Décrivez les points forts : orientation, luminosité, état, équipements, proximités…"
          rows={5}
          maxLength={2000}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-foreground placeholder-gray-400 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{data.description.length}/2000</p>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Prix <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={data.price}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder="0"
            min={0}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-16 text-sm text-foreground placeholder-gray-400 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">DH</span>
        </div>
        {data.price && !isNaN(Number(data.price)) && Number(data.price) > 0 && (
          <p className="text-xs text-primary mt-1 font-medium">
            {Number(data.price).toLocaleString('fr-MA')} DH
          </p>
        )}
      </div>

      {/* City + Neighborhood */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Ville <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-700 bg-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer appearance-none"
            >
              <option value="">Sélectionnez une ville</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Quartier</label>
          <input
            type="text"
            value={data.neighborhood}
            onChange={(e) => onChange({ neighborhood: e.target.value })}
            placeholder="Ex: Maarif, Agdal…"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-foreground placeholder-gray-400 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      {/* Surface + Rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Surface</label>
          <div className="relative">
            <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={data.surface}
              onChange={(e) => onChange({ surface: e.target.value })}
              placeholder="0"
              min={0}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-14 py-3 text-sm text-foreground placeholder-gray-400 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">m²</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Nombre de pièces</label>
          <div className="flex flex-wrap gap-2">
            {ROOMS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ rooms: data.rooms === n ? null : n })}
                className={`w-10 h-10 rounded-xl text-sm font-semibold border-2 transition-all ${
                  data.rooms === n
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 text-gray-600 hover:border-primary/40'
                }`}
              >
                {n === 10 ? '10+' : n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Photo Upload ─────────────────────────────────────────────────────────────

function PhotoUpload({
  photos,
  onChange,
}: {
  photos: PhotoPreview[]
  onChange: (photos: PhotoPreview[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const remaining = 10 - photos.length
      const accepted = Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .slice(0, remaining)
        .map((file) => ({ file, url: URL.createObjectURL(file) }))
      onChange([...photos, ...accepted])
    },
    [photos, onChange]
  )

  const removePhoto = useCallback(
    (idx: number) => {
      URL.revokeObjectURL(photos[idx].url)
      onChange(photos.filter((_, i) => i !== idx))
    },
    [photos, onChange]
  )

  useEffect(() => {
    return () => photos.forEach((p) => URL.revokeObjectURL(p.url))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {/* Drop zone */}
      {photos.length < 10 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            dragging
              ? 'border-primary bg-primary/8 scale-[1.01]'
              : 'border-gray-200 hover:border-primary/50 hover:bg-primary/3'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-primary/20' : 'bg-gray-100'}`}>
            <ImagePlus className={`w-7 h-7 ${dragging ? 'text-primary' : 'text-gray-400'}`} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm">
              {dragging ? 'Déposez les photos ici' : 'Glissez vos photos ici'}
            </p>
            <p className="text-gray-400 text-xs mt-1">ou cliquez pour parcourir • JPG, PNG, WEBP • max 10 photos</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
      )}

      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
          {photos.map((p, i) => (
            <div key={p.url} className="relative group aspect-square">
              <img
                src={p.url}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover rounded-xl border border-gray-200"
              />
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  Principale
                </span>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removePhoto(i) }}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {photos.length < 10 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 flex items-center justify-center text-gray-300 hover:text-primary transition-all"
            >
              <Upload className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        {photos.length}/10 photos ajoutées
        {photos.length === 0 && ' · Les annonces avec photos reçoivent 5× plus de contacts'}
      </p>
    </div>
  )
}

// ─── Summary ─────────────────────────────────────────────────────────────────

function Summary({ data, photos }: { data: FormData; photos: PhotoPreview[] }) {
  const catLabel = PROPERTY_TYPES.find((p) => p.value === data.category)?.label ?? data.category
  const txLabel = data.transactionType === 'vente' ? 'Vente' : 'Location'

  const rows = [
    { label: 'Transaction', value: txLabel },
    { label: 'Catégorie', value: catLabel },
    { label: 'Titre', value: data.title || '—' },
    { label: 'Prix', value: data.price ? `${Number(data.price).toLocaleString('fr-MA')} DH` : '—' },
    { label: 'Ville', value: data.city || '—' },
    { label: 'Quartier', value: data.neighborhood || '—' },
    { label: 'Surface', value: data.surface ? `${data.surface} m²` : '—' },
    { label: 'Pièces', value: data.rooms ? `${data.rooms}` : '—' },
    { label: 'Photos', value: `${photos.length} photo${photos.length !== 1 ? 's' : ''}` },
  ]

  return (
    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
      <h3 className="font-bold text-foreground mb-3 text-sm flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-primary" />
        Récapitulatif de votre annonce
      </h3>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{row.label}</span>
            <span className="font-medium text-foreground text-right max-w-[60%] truncate">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Success Toast ────────────────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-primary text-white px-5 py-3.5 rounded-2xl shadow-xl animate-in slide-in-from-bottom-4 duration-300">
      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
      <span className="font-medium text-sm">{message}</span>
    </div>
  )
}

// ─── Main Form ────────────────────────────────────────────────────────────────

const INITIAL: FormData = {
  transactionType: '',
  category: '',
  title: '',
  description: '',
  price: '',
  city: '',
  neighborhood: '',
  surface: '',
  rooms: null,
}

export default function PublierForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState(false)

  function patch(update: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...update }))
  }

  function canGoNext(): boolean {
    if (step === 1) return !!(form.transactionType && form.category)
    if (step === 2) return !!(form.title.trim() && form.price && form.city)
    return true
  }

  async function uploadPhotos(userId: string): Promise<string[]> {
    if (photos.length === 0) return []
    const supabase = createClient()
    const urls: string[] = []

    for (const { file } of photos) {
      const path = `${userId}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
      const { data, error } = await supabase.storage
        .from('listings')
        .upload(path, file, { upsert: false })

      if (!error && data) {
        const { data: urlData } = supabase.storage.from('listings').getPublicUrl(data.path)
        urls.push(urlData.publicUrl)
      }
    }

    return urls
  }

  async function handleSubmit() {
    setError(null)
    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Vous devez être connecté pour publier une annonce.')
        setSubmitting(false)
        return
      }

      const photoUrls = await uploadPhotos(user.id)

      const { error: insertError } = await supabase.from('listings').insert({
        user_id: user.id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        transaction_type: form.transactionType,
        price: form.price ? Number(form.price) : null,
        city: form.city,
        neighborhood: form.neighborhood.trim() || null,
        surface_m2: form.surface ? Number(form.surface) : null,
        rooms: form.rooms,
        photos: photoUrls,
        status: 'active',
      })

      if (insertError) throw new Error(insertError.message)

      setToast(true)
      setTimeout(() => router.push('/annonces'), 1800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-1">
          Publier une annonce
        </h1>
        <p className="text-gray-400 text-sm">
          Gratuit · Sans frais d&apos;agence · En ligne en 3 minutes
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <ProgressBar step={step} />

        {step === 1 && (
          <Step1 data={{ transactionType: form.transactionType, category: form.category }} onChange={patch} />
        )}
        {step === 2 && (
          <Step2
            data={{
              title: form.title,
              description: form.description,
              price: form.price,
              city: form.city,
              neighborhood: form.neighborhood,
              surface: form.surface,
              rooms: form.rooms,
            }}
            onChange={patch}
          />
        )}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">Photos du bien</h2>
              <p className="text-gray-400 text-sm mb-5">
                Ajoutez jusqu&apos;à 10 photos · La première sera la photo principale
              </p>
              <PhotoUpload photos={photos} onChange={setPhotos} />
            </div>
            <Summary data={form} photos={photos} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={submitting}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-7 py-3 rounded-xl transition-colors text-sm shadow-sm"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-bold px-7 py-3 rounded-xl transition-colors text-sm shadow-md shadow-accent/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publication…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Publier mon annonce
                </>
              )}
            </button>
          )}
        </div>

        {/* Step hint */}
        {step < 3 && !canGoNext() && (
          <p className="text-center text-xs text-gray-400 mt-3">
            {step === 1
              ? 'Sélectionnez le type de transaction et de bien pour continuer'
              : 'Le titre, le prix et la ville sont obligatoires'}
          </p>
        )}
      </div>

      {toast && <Toast message="Annonce publiée avec succès ! Redirection…" />}
    </div>
  )
}
