'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import s from '@/app/dashboard/dashboard.module.css'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Products',
    href: '/dashboard/products',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M20 7H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Inquiries',
    href: '/dashboard/inquiries',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    badge: true,
  },
  {
    label: 'Categories',
    href: '/dashboard/categories',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
]

export default function Sidebar({ newInquiries = 0 }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const supabase  = createClient()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/dashboard/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile header */}
      <div className={s.mobile_header}>
        <Link href="/dashboard" className={s.mobile_logo}>
          The <span>Maker</span>
        </Link>
        <button
          className={s.hamburger_btn}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div className={s.overlay} onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${s.sidebar} ${open ? s.sidebar_open : ''}`}>
        <div className={s.sidebar_logo}>
          <Link href="/dashboard" className={s.sidebar_logo_text}>
            The <span>Maker</span>
          </Link>
          <span className={s.sidebar_sub}>Admin Panel</span>
        </div>

        <nav className={s.sidebar_nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${s.nav_link} ${isActive ? s.nav_link_active : ''}`}
              >
                {item.icon}
                {item.label}
                {item.badge && newInquiries > 0 && (
                  <span className={s.nav_badge}>{newInquiries}</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className={s.sidebar_footer}>
          <button className={s.signout_btn} onClick={handleSignOut}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}