'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import s from './About.module.css'

const STEPS = [
  {
    num: '01',
    title: 'Raw Brass Sourcing',
    desc: 'Premium-grade brass sourced from certified Moradabad suppliers — the same foundries supplying global markets for decades.',
    filled: false,
  },
  {
    num: '02',
    title: 'Handcasting & Shaping',
    desc: 'Master artisans cast and shape each piece by hand using traditional techniques passed down through generations.',
    filled: false,
  },
  {
    num: '03',
    title: 'Finishing & Polishing',
    desc: 'Every item is hand-polished to a mirror or matte finish — inspected before it leaves the workshop floor.',
    filled: false,
  },
  {
    num: '04',
    title: 'Quality Check & Export',
    desc: 'QC certified, export-packed, and dispatched with full documentation — delivered reliably to your door.',
    filled: true,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.12 } },
}

export default function CraftProcess() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className={s.process} ref={ref}>
      <div className={s.process_inner}>

        <motion.div
          className={s.process_header}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={stagger}
        >
          <motion.p className={s.section_eyebrow} variants={fadeUp}>
            How We Make It
          </motion.p>
          <motion.h2 className={s.section_headline} variants={fadeUp}>
            From Raw Brass
            <span className={s.italic}> to Your Door.</span>
          </motion.h2>
          <motion.p className={s.process_sub} variants={fadeUp}>
            Every product follows the same four-step journey — quality
            controlled at each stage before it leaves Moradabad.
          </motion.p>
        </motion.div>

        <motion.div
          className={s.steps}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={stagger}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className={s.step}
              variants={fadeUp}
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className={s.step_connector} />
              )}

              <div className={`${s.step_num} ${step.filled ? s.step_num_filled : ''}`}>
                {step.num}
              </div>
              <h3 className={s.step_title}>{step.title}</h3>
              <p className={s.step_desc}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}