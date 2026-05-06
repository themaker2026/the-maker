'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import s from './BellBrandSection.module.css'

const BellCanvasBackground = dynamic(
  () => import('./BellCanvasBackground'),
  {
    ssr: false,
    loading: () => <div className={s.canvas_placeholder} />,
  }
)

export default function BellBrandSection() {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' })

  return (
    <section className={s.section} ref={ref}>

      {/* 3D bell canvas — full section background */}
      <div className={s.canvas_wrap} aria-hidden="true">
        {inView && <BellCanvasBackground />}
      </div>

      {/* Teal tint overlay */}
      <div className={s.tint} aria-hidden="true" />

      {/* "The Maker" text centred on top */}
      <motion.div
        className={s.content}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className={s.brand_text}>
          <span className={s.brand_the}>The</span>
          <span className={s.brand_maker}>Maker</span>
        </h2>
        <p className={s.tagline}>
          India &nbsp;·&nbsp; Est. 2023
        </p>
      </motion.div>

      {/* Scroll hint */}
      <div className={s.scroll_hint}>
        <motion.div
          className={s.scroll_icon}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke="rgba(245,245,245,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

    </section>
  )
}