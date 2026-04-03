'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, LogOut, LayoutList, UserCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type UserDisplay = {
  id: string
  name: string
  email: string
  avatarLetter: string
} | null

const NAV_LINKS = [
  { label: 'Parcourir', href: '/annonces' },
  { label: 'Vendre / Louer', href: '/publier' },
]

export default function HeaderClient({ user }: { user: UserDisplay }) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setDropdownOpen(false)
    setMobileOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-primary/5 transition-all"
          >
            {link.label}
          </Link>
        ))}
        {!user && (
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-primary/5 transition-all"
          >
            S&apos;identifier
          </Link>
        )}
      </nav>

      {/* Desktop right side */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          /* Authenticated — user menu */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.avatarLetter}
              </div>
              <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                {user.name}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl py-1.5 z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>

                <Link
                  href="/mes-annonces"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  <LayoutList className="w-4 h-4" />
                  Mes annonces
                </Link>
                <Link
                  href="/profil"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  Mon profil
                </Link>

                <div className="border-t border-gray-50 mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Guest — CTA */
          <Link
            href="/publier"
            className="bg-accent hover:bg-accent-dark text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-accent/20"
          >
            Publier une annonce
          </Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-white border-t border-gray-100 px-4 pb-5 pt-3 shadow-xl z-40">
          <nav className="flex flex-col gap-1 mb-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="space-y-1 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-3 px-4 py-2 mb-1">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {user.avatarLetter}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <Link
                href="/mes-annonces"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 rounded-xl transition-all"
              >
                <LayoutList className="w-4 h-4" />
                Mes annonces
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center border border-gray-200 text-sm font-medium text-gray-700 px-5 py-3 rounded-xl hover:border-primary/30 hover:text-primary transition-colors"
              >
                S&apos;identifier
              </Link>
              <Link
                href="/publier"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-accent hover:bg-accent-dark text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors"
              >
                Publier une annonce
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}
