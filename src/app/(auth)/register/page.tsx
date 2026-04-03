'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react'

type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string; color: string }

function getStrength(pw: string): Strength {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map: Strength[] = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Faible', color: 'bg-red-400' },
    { score: 2, label: 'Moyen', color: 'bg-amber-400' },
    { score: 3, label: 'Bon', color: 'bg-emerald-400' },
    { score: 4, label: 'Excellent', color: 'bg-primary' },
  ]
  return map[score as 0 | 1 | 2 | 3 | 4]
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const strength = getStrength(password)
  const passwordsMatch = confirm.length === 0 || password === confirm

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (strength.score < 2) {
      setError('Veuillez choisir un mot de passe plus sécurisé.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  async function handleGoogle() {
    setError(null)
    setGoogleLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (authError) {
      setError(authError.message)
      setGoogleLoading(false)
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Vérifiez votre email</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-1">
            Un lien de confirmation a été envoyé à
          </p>
          <p className="font-semibold text-primary text-sm mb-6">{email}</p>
          <p className="text-gray-400 text-xs">
            Cliquez sur le lien dans l&apos;email pour activer votre compte.
            <br />Vérifiez vos spams si vous ne le trouvez pas.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-foreground mb-1">Créer un compte</h1>
          <p className="text-gray-400 text-sm">Rejoignez Skoun.ma — c&apos;est gratuit</p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl py-3 text-sm font-medium text-foreground transition-all disabled:opacity-60 mb-5"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Inscription avec Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">ou par email</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Nom complet</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Mohammed Alami"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-foreground placeholder-gray-400 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="votre@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-foreground placeholder-gray-400 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Min. 8 caractères"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-foreground placeholder-gray-400 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength meter */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        i <= strength.score ? strength.color : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength.score >= 3 ? 'text-emerald-600' : strength.score === 2 ? 'text-amber-600' : 'text-red-500'}`}>
                  {strength.label}
                  {strength.score < 3 && ' · Ajoutez des majuscules, chiffres ou symboles'}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-foreground placeholder-gray-400 outline-none focus:ring-2 transition-all ${
                  !passwordsMatch
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : confirm && password === confirm
                    ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100'
                    : 'border-gray-200 focus:border-primary/50 focus:ring-primary/10'
                }`}
              />
              {confirm && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {password === confirm ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </span>
              )}
            </div>
            {!passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading || !fullName || !email || !password || !confirm || !passwordsMatch}
            className="w-full bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-1"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-5">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
