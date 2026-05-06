'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import s from './StoryTeaser.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
}

const STATS = [
  { value: '400+', label: 'Years of craft tradition' },
  { value: '2023', label: 'Founded' },
  { value: '30+',  label: 'Countries reached' },
]

export default function StoryTeaser() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className={s.section} ref={ref}>
      <div className={s.inner}>

        {/* ── Left — photo placeholder ── */}
        <motion.div
          className={s.photo_side}
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className={s.photo_wrap}>
            <Image
              src="/HomeWorkShop.webp"
              alt="Brass handicraft workshop in Moradabad India — The Maker"              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={s.photo_accent} />
        </motion.div>

        {/* ── Right — copy ── */}
        <motion.div
          className={s.copy_side}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          <motion.div className={s.eyebrow} variants={fadeUp}>
            <span className={s.eyebrow_line} />
            Our Heritage
          </motion.div>

          <motion.h2 className={s.headline} variants={fadeUp}>
            Made in India.
            <span className={s.headline_italic}>Sold to the World.</span>
          </motion.h2>

          <motion.div className={s.divider} variants={fadeUp} />

          <motion.p className={s.body} variants={fadeUp}>
            Moradabad has been{' '}
            <span className={s.highlight}>India's brass capital</span>{' '}
            for over four centuries — home to the craftsmen whose work
            fills the world's finest markets. The Maker was built in 2023
            to connect those artisans directly with global buyers, cutting
            out the middlemen and bringing you authentic craft at honest prices.
          </motion.p>

          {/* Stats row */}
          <motion.div className={s.stats} variants={fadeUp}>
            {STATS.map((stat) => (
              <div key={stat.label} className={s.stat}>
                <span className={s.stat_value}>{stat.value}</span>
                <span className={s.stat_label}>{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={fadeUp}>
            <Link href="/about" className={s.btn}>
              Our Story
              <svg
                className={s.btn_arrow}
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
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}