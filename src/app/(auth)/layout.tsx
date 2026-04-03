import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1B4332' }}>
            <Home size={20} style={{ color: '#D4A853' }} />
          </div>
          <span className="text-xl font-bold" style={{ color: '#1B4332' }}>
            Skoun<span style={{ color: '#D4A853' }}>.ma</span>
          </span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>

      {/* Footer note */}
      <div className="text-center pb-6 text-xs text-gray-400">
        © 2026 Skoun.ma · Annonces gratuites, sans frais d&apos;agence
      </div>
    </div>
  )
}
