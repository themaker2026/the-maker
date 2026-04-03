'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import s from './CTABanner.module.css'

const TRUST_ITEMS = [
  'No commitment required',
  'Sample orders welcome',
  'Response within 24 hours',
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
}

export default function CTABanner() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section className={s.section} ref={ref}>
      <motion.div
        className={s.inner}
        variants={stagger}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
      >
        {/* Eyebrow */}
        <motion.div className={s.eyebrow} variants={fadeUp}>
          <span className={s.eyebrow_line} />
          Ready to Source?
          <span className={s.eyebrow_line} />
        </motion.div>

        {/* Headline */}
        <motion.h2 className={s.headline} variants={fadeUp}>
          Let's Build Something
          <span className={s.headline_italic}>Together.</span>
        </motion.h2>

        {/* Body */}
        <motion.p className={s.body} variants={fadeUp}>
          Whether you're sourcing for the first time or looking for a
          long-term supply partner — tell us what you need and we'll
          get back to you within 24 hours.
        </motion.p>

        {/* Actions */}
        <motion.div className={s.actions} variants={fadeUp}>
          <Link href="/contact" className={s.btn_primary}>
            Contact Us
            <svg
              className={s.arrow}
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Link href="/products" className={s.btn_secondary}>
            Browse the Catalogue
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div className={s.trust_row} variants={fadeUp}>
          {TRUST_ITEMS.map((item) => (
            <div key={item} className={s.trust_item}>
              <span className={s.trust_dot} />
              {item}
            </div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  )
}