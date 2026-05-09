'use client'

import { useState } from 'react'
import Link from 'next/link'
import s from './Footer.module.css'

const QUICK_LINKS = [
  { label: 'Home',        href: '/' },
  { label: 'Products',    href: '/products' },
  { label: 'About',       href: '/about' },
  { label: 'Contact',     href: '/contact' },
  { label: 'Get a Quote', href: '/contact' },
]

const CATEGORIES = [
  { label: 'Bells',             href: '/products?category=bells' },
  { label: 'Key Rings',         href: '/products?category=key-rings' },
  { label: 'Brass Handicrafts', href: '/products?category=brass-handicrafts' },
]

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/themaker',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/themaker',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/themaker',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5"
          stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="4"
          stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17.5" cy="6.5" r="1"
          fill="currentColor"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      } else {
        setStatus('success')
        setMessage('You\'re subscribed. Thank you!')
        setEmail('')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.grid}>

          {/* ── Brand + Newsletter ── */}
          <div className={s.brand_col}>
            <Link href="/" className={s.logo}>
              The <span>Maker</span>
            </Link>

            <p className={s.brand_desc}>
              Premium brass handicrafts from Moradabad,
              India. Exported worldwide since 2023.
            </p>

            {/* Socials */}
            <div className={s.socials}>
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={s.social_btn}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <p className={s.newsletter_label}>Stay Updated</p>
            <p className={s.newsletter_sub}>
              New collections and trade updates.
            </p>

            <form
              className={s.newsletter_form}
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                className={s.newsletter_input}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                required
              />
              <button
                type="submit"
                className={s.newsletter_btn}
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe →'}
              </button>

              {status === 'success' && (
                <p className={s.newsletter_success}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l4 4 6-6"
                      stroke="#007677" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                  {message}
                </p>
              )}

              {status === 'error' && (
                <p className={s.newsletter_error}>{message}</p>
              )}
            </form>
          </div>

          {/* ── Quick Links ── */}
          <div className={s.links_col}>
            <p className={s.col_heading}>Quick Links</p>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={s.footer_link}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Categories ── */}
          <div className={s.links_col}>
            <p className={s.col_heading}>Categories</p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={s.footer_link}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* ── Contact + Map ── */}
          <div className={s.contact_col}>
            <p className={s.col_heading}>Contact Us</p>

            <div className={s.contact_item}>
              <span className={s.contact_icon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor" strokeWidth="1.5"/>
                  <path
                    d="M22 6l-10 7L2 6"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round"/>
                </svg>
              </span>
              <a
                href="mailto:hello@themaker.in"
                className={s.contact_text}
              >
                hello@themaker.in
              </a>
            </div>

            <div className={s.contact_item}>
              <span className={s.contact_icon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <a
                href="tel:+919027432715"
                className={s.contact_text}
              >
                +91 90274 32715
              </a>
            </div>

            <div className={s.contact_item}>
              <span className={s.contact_icon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                    stroke="currentColor" strokeWidth="1.5"/>
                  <circle
                    cx="12" cy="10" r="3"
                    stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </span>
              <span className={s.contact_text}>
                BUILDING NO. 88, LAL MASJID ROAD,
                <br />GULZARIMAL SARAI, MORADABAD,
                <br />U.P. - 244001
              </span>
            </div>

            {/* Google Maps embed */}
            <div className={s.map_wrap}>
              <iframe
                className={s.map_iframe}
                src="https://maps.google.com/maps?q=Lal+Masjid+Road,+Gulzarimal+Sarai,+Moradabad,+Uttar+Pradesh+244001&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Maker — Moradabad, India"
              />
              <a
                href="https://maps.google.com/?q=Lal+Masjid+Road,+Gulzarimal+Sarai,+Moradabad,+Uttar+Pradesh+244001"
                target="_blank"
                rel="noopener noreferrer"
                className={s.map_link}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                    stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="10" r="3"
                    stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                View on Google Maps ↗
              </a>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className={s.bottom}>
  <p className={s.copyright}>
    © {new Date().getFullYear()} The Maker. All rights reserved.
  </p>
  <p className={s.made_in}>
    Made in Moradabad, India
  </p>
  <p className={s.credit}>
    Designed &amp; developed by{' '}
    <a href="https://github.com/Arham2004m"
      target="_blank"
      rel="noopener noreferrer"
      className={s.credit_link}
    >
      Arham
    </a>
  </p>
</div>
      </div>
    </footer>
  )
}