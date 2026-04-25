'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import s from './Hero.module.css'

const STATS = [
  { value: '500+', label: 'Products' },
  { value: '30+',  label: 'Countries' },
  { value: '15+',  label: 'Years of Craft' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
}

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export default function Hero() {
  return (
    <section className={s.hero}>

      {/* Background photo */}
      <div className={s.bg_image_wrap}>
        <Image
          src="/NewHomeBell.webp"
          alt="Handcrafted brass bell — The Maker"
          fill
          priority
          className={s.bg_image}
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay — dark left, clear right */}
      <div className={s.overlay} aria-hidden="true" />

      {/* Content — vertically centred */}
      <div className={s.inner}>
        <motion.div
          className={s.left}
          variants={stagger}
          initial="hidden"
          animate="show"
        >

          {/* Eyebrow */}
          <motion.div className={s.eyebrow} variants={fadeUp}>
            <span className={s.eyebrow_line} />
            Handcrafted · Exported Worldwide
          </motion.div>

          {/* Headline */}
          <motion.h1 className={s.headline} variants={fadeUp}>
            Brass Crafted
            <span className={s.headline_italic}>with Purpose.</span>
          </motion.h1>

          {/* Divider */}
          <motion.div className={s.divider} variants={fadeUp} />

          {/* Body */}
          <motion.p className={s.body} variants={fadeUp}>
            Premium brass handicrafts — bells, key rings, and decorative
            items — made by skilled artisans and exported to discerning
            buyers across the world.
          </motion.p>

          {/* CTAs */}
          <motion.div className={s.cta_row} variants={fadeUp}>
            <Link href="/products" className={s.cta_primary}>
              Explore Collection
            </Link>
            <Link href="/contact" className={s.cta_secondary}>
              Get a Quote
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.div className={s.stats} variants={fadeUp}>
            {STATS.map((stat) => (
              <div key={stat.label} className={s.stat}>
                <span className={s.stat_value}>{stat.value}</span>
                <span className={s.stat_label}>{stat.label}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll hint */}
      <div className={s.scroll_hint}>
        <div className={s.scroll_dot}>
          <motion.div
            className={s.scroll_dot_inner}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        </div>
        Scroll to explore
      </div>

    </section>
  )
}