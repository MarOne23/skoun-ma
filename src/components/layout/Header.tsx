import Link from 'next/link'
import { Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import HeaderClient from './HeaderClient'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userDisplay = user
    ? {
        id: user.id,
        name: (user.user_metadata?.full_name as string | undefined)
          ?? user.email?.split('@')[0]
          ?? 'Mon compte',
        email: user.email ?? '',
        avatarLetter: (
          (user.user_metadata?.full_name as string | undefined)?.[0]
          ?? user.email?.[0]
          ?? '?'
        ).toUpperCase(),
      }
    : null

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1B4332' }}>
              <Home size={20} style={{ color: '#D4A853' }} />
            </div>
            <span className="text-xl font-bold" style={{ color: '#1B4332' }}>
              Skoun<span style={{ color: '#D4A853' }}>.ma</span>
            </span>
          </Link>

          {/* Nav + auth — client island for interactivity */}
          <HeaderClient user={userDisplay} />
        </div>
      </div>
    </header>
  )
}
