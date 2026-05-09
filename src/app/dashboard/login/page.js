'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import s from '../dashboard.module.css'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className={s.login_page}>
      <div className={s.login_card}>
        <h1 className={s.login_logo}>
          The <span>Maker</span>
        </h1>
        <p className={s.login_sub}>Admin Dashboard — sign in to continue</p>

        <form className={s.login_form} onSubmit={handleLogin}>
          {error && <p className={s.login_error}>{error}</p>}

          <div className={s.field}>
            <label className={s.field_label}>Email Address</label>
            <input
              type="email"
              className={s.field_input}
              placeholder="info@themaker-tm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className={s.field}>
            <label className={s.field_label}>Password</label>
            <input
              type="password"
              className={s.field_input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <Link href="/dashboard/forgot-password" className={s.login_forgot}>
            Forgot password?
          </Link>

          <button
            type="submit"
            className={s.btn_primary}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}