import Link from 'next/link'
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
          <Link href="/">
            <img src="/images/logo-skoun.png" alt="Skoun.ma" className="h-10 w-auto" />
          </Link>

          {/* Nav + auth — client island for interactivity */}
          <HeaderClient user={userDisplay} />
        </div>
      </div>
    </header>
  )
}
