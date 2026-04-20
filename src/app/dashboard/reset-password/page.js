'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import s from '../dashboard.module.css'

export default function ResetPasswordPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    setError('')

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('Could not update password. Please try again.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  return (
    <div className={s.login_page}>
      <div className={s.login_card}>
        <h1 className={s.login_logo}>The <span>Maker</span></h1>
        <p className={s.login_sub}>Set your new password</p>

        {success ? (
          <p style={{ textAlign: 'center', color: 'var(--color-teal)', fontSize: '14px' }}>
            Password updated. Redirecting to dashboard...
          </p>
        ) : (
          <form className={s.login_form} onSubmit={handleReset}>
            {error && <p className={s.login_error}>{error}</p>}

            <div className={s.field}>
              <label className={s.field_label}>New Password</label>
              <input
                type="password"
                className={s.field_input}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
            </div>

            <div className={s.field}>
              <label className={s.field_label}>Confirm Password</label>
              <input
                type="password"
                className={s.field_input}
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}