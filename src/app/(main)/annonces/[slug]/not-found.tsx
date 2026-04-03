import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary/8 flex items-center justify-center mb-6">
        <Home className="w-9 h-9 text-primary/40" />
      </div>
      <h1 className="text-2xl font-extrabold text-foreground mb-2">Annonce introuvable</h1>
      <p className="text-gray-400 text-sm max-w-sm mb-8">
        Cette annonce n&apos;existe plus ou a été supprimée par son auteur.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/annonces"
          className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          <Search className="w-4 h-4" />
          Parcourir les annonces
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-primary/30 hover:text-primary font-medium px-6 py-3 rounded-xl transition-colors text-sm"
        >
          <Home className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
