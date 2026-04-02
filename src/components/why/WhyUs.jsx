'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import s from './WhyUs.module.css'

const FEATURES = [
  {
    id: 'docs',
    title: 'Export-Ready Documentation',
    body: 'GST invoicing, HS codes, certificates of origin, and full customs paperwork — handled end-to-end so your shipment clears without delay.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 12l2 2 4-4"
          stroke="#007677"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 6a2 2 0 012-2h8l4 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
          stroke="#007677"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'moq',
    title: 'Flexible MOQ & Custom Orders',
    body: 'Low minimum order quantities with full customisation available — finishes, packaging, and engravings tailored to your market.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="8"
          height="8"
          rx="1.5"
          stroke="#007677"
          strokeWidth="1.5"
        />
        <rect
          x="13"
          y="3"
          width="8"
          height="8"
          rx="1.5"
          stroke="#007677"
          strokeWidth="1.5"
        />
        <rect
          x="3"
          y="13"
          width="8"
          height="8"
          rx="1.5"
          stroke="#007677"
          strokeWidth="1.5"
        />
        <rect
          x="13"
          y="13"
          width="8"
          height="8"
          rx="1.5"
          stroke="#007677"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    id: 'experience',
    title: '15+ Years of Expertise',
    body: 'A legacy of brass craftsmanship passed through generations — trusted by wholesale buyers across Europe, the Middle East, and North America.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#007677" strokeWidth="1.5" />
        <path
          d="M12 7v5l3.5 3.5"
          stroke="#007677"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'global',
    title: '30+ Countries Shipped',
    body: 'Proven global logistics with reliable delivery timelines — from warehouse to your door, we manage every step of the export process.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#007677" strokeWidth="1.5" />
        <path
          d="M3 12h18M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9"
          stroke="#007677"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
}

export default function WhyUs() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className={s.section} ref={ref}>
      <div className={s.inner}>

        {/* ── Left ── */}
        <motion.div
          className={s.left}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          <motion.div className={s.eyebrow} variants={fadeUp}>
            <span className={s.eyebrow_line} />
            Why Choose Us
          </motion.div>

          <motion.h2 className={s.headline} variants={fadeUp}>
            Why Buyers
            <span className={s.headline_italic}>Trust The Maker.</span>
          </motion.h2>

          <motion.p className={s.body} variants={fadeUp}>
            From first sample to full shipment — we handle every detail
            so you can focus on your business.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link href="/contact" className={s.cta}>
              Start an Enquiry
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Right — 2x2 grid ── */}
        <motion.div
          className={s.grid}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.id}
              className={s.card}
              variants={fadeUp}
            >
              <div className={s.icon_wrap}>{feature.icon}</div>
              <div className={s.card_text}>
                <h3 className={s.card_title}>{feature.title}</h3>
                <p className={s.card_body}>{feature.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}