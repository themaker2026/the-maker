'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import s from '../dashboard.module.css'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/dashboard/reset-password`,
      }
    )

    if (resetError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className={s.login_page}>
      <div className={s.login_card}>
        <h1 className={s.login_logo}>
          The <span>Maker</span>
        </h1>

        {sent ? (
          <>
            <p className={s.login_sub}>
              Reset link sent to <strong>{email}</strong>.
              Check your inbox and click the link to set a new password.
            </p>
            <Link
              href="/dashboard/login"
              className={s.btn_primary}
              style={{ display: 'block', textAlign: 'center', marginTop: '16px' }}
            >
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <p className={s.login_sub}>
              Enter your email and we'll send you a reset link.
            </p>
            <form className={s.login_form} onSubmit={handleSubmit}>
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
                />
              </div>

              <button
                type="submit"
                className={s.btn_primary}
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <Link
                href="/dashboard/login"
                style={{
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--color-sage)',
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                Back to Login
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  )
}