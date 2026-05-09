'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import s from './Contact.module.css'

const STEPS = [
  'We review your enquiry carefully',
  'We send pricing, samples, or a catalogue',
  'You place your first order with confidence',
]

const CONTACT_ITEMS = [
  {
    label: 'Email',
    value: 'info@themaker-tm.com',
    href: 'mailto:info@themaker-tm.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          stroke="currentColor" strokeWidth="1.5"
        />
        <path
          d="M22 6l-10 7L2 6"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Phone',
    value: '+91 90274 32715',
    subtext: 'Mon–Sat, 9am–6pm IST',
    href: 'tel:+919027432715',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Address',
    value: 'BUILDING NO. 88, LAL MASJID ROAD',
    subtext: 'GULZARIMAL SARAI, MORADABAD, U.P. - 244001',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
          stroke="currentColor" strokeWidth="1.5"
        />
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function ContactSection() {
  const searchParams = useSearchParams()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    company: '',
    product_interest: '',
    message: '',
  })

  const [status, setStatus]   = useState('idle')
  const [error, setError]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const productName = searchParams.get('name')
    if (productName) {
      setForm((prev) => ({
        ...prev,
        product_interest: decodeURIComponent(productName),
      }))
    }
  }, [searchParams])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setError(data.error || 'Something went wrong.')
        return
      }

      setStatus('success')
      setSubmitted(true)
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }

  const isLoading = status === 'loading'

  return (
    <section className={s.section}>
      <div className={s.inner}>

        {/* ── Info Panel ── */}
        <div className={s.info_panel}>
          <h2 className={s.info_title}>Contact Information</h2>

          {CONTACT_ITEMS.map((item) => (
            <div key={item.label} className={s.contact_item}>
              <div className={s.contact_icon_wrap}>{item.icon}</div>
              <div className={s.contact_item_text}>
                <span className={s.contact_item_label}>{item.label}</span>
                {item.href ? (
                  <a href={item.href} className={s.contact_item_value}>
                    {item.value}
                  </a>
                ) : (
                  <span className={s.contact_item_value}>{item.value}</span>
                )}
                {item.subtext && (
                  <span className={s.contact_item_label}>{item.subtext}</span>
                )}
              </div>
            </div>
          ))}

          {/* WhatsApp */}
          <a
            href="https://wa.me/919027432715"
            target="_blank"
            rel="noopener noreferrer"
            className={s.whatsapp_btn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>

          {/* Response badge */}
          <div className={s.response_badge}>
            <div className={s.response_dot} />
            <div>
              <p className={s.response_text}>Responds within 24 hours</p>
              <p className={s.response_sub}>We reply to every enquiry</p>
            </div>
          </div>

          {/* What happens next */}
          <p className={s.steps_title}>What Happens Next</p>
          <div className={s.steps}>
            {STEPS.map((step, i) => (
              <div key={i} className={s.step}>
                <div className={s.step_num}>{i + 1}</div>
                <p className={s.step_text}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form Panel ── */}
        <div className={s.form_panel}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className={s.success_wrap}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className={s.success_icon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12l5 5L20 7"
                      stroke="#007677"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className={s.success_title}>Message Sent!</h2>
                <p className={s.success_body}>
                  Thank you for reaching out. We've received your message
                  and will get back to you within 24 hours.
                </p>
                <div className={s.success_actions}>
                  <Link href="/products" className={s.success_btn_primary}>
                    Browse Products
                  </Link>
                  <Link href="/" className={s.success_btn_secondary}>
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              >
                <motion.h2
                  className={s.form_title}
                  variants={fadeUp}
                >
                  Send us a Message
                </motion.h2>

                <form className={s.form} onSubmit={handleSubmit}>

                  {/* Name + Email */}
                  <motion.div className={s.form_row} variants={fadeUp}>
                    <div className={s.field}>
                      <label className={s.field_label}>
                        Full Name
                        <span className={s.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className={s.field_input}
                        placeholder="John Smith"
                        value={form.name}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className={s.field}>
                      <label className={s.field_label}>
                        Email Address
                        <span className={s.required}>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className={s.field_input}
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Phone + Country */}
                  <motion.div className={s.form_row} variants={fadeUp}>
                    <div className={s.field}>
                      <label className={s.field_label}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className={s.field_input}
                        placeholder="+1 555 000 0000"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div className={s.field}>
                      <label className={s.field_label}>Country</label>
                      <input
                        type="text"
                        name="country"
                        className={s.field_input}
                        placeholder="United States"
                        value={form.country}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>

                  {/* Product Interest */}
                  <motion.div className={s.field} variants={fadeUp}>
                    <label className={s.field_label}>Product Interest</label>
                    <input
                      type="text"
                      name="product_interest"
                      className={s.field_input}
                      placeholder="e.g. Temple Bell — Large, Elephant Key Ring"
                      value={form.product_interest}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {form.product_interest && (
                      <span className={s.field_hint}>
                        Auto-filled from your product selection
                      </span>
                    )}
                  </motion.div>

                  {/* Company */}
                  <motion.div className={s.field} variants={fadeUp}>
                    <label className={s.field_label}>
                      Company / Business Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      className={s.field_input}
                      placeholder="Acme Imports Ltd."
                      value={form.company}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </motion.div>

                  {/* Message */}
                  <motion.div className={s.field} variants={fadeUp}>
                    <label className={s.field_label}>
                      Message
                      <span className={s.required}>*</span>
                    </label>
                    <textarea
                      name="message"
                      className={`${s.field_input} ${s.field_textarea}`}
                      placeholder="Tell us what you're looking for — product types, quantities, delivery destination, or any questions you have."
                      value={form.message}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </motion.div>

                  {/* Error */}
                  {error && (
                    <motion.p
                      className={s.form_error}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Submit */}
                  <motion.div
                    className={s.form_footer}
                    variants={fadeUp}
                  >
                    <button
                      type="submit"
                      className={s.submit_btn}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Message'}
                      {!isLoading && (
                        <svg
                          className={s.submit_btn_arrow}
                          width="14" height="14"
                          viewBox="0 0 16 16" fill="none"
                        >
                          <path
                            d="M3 8h10M9 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <span className={s.required_note}>
                      * Required fields
                    </span>
                  </motion.div>

                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}