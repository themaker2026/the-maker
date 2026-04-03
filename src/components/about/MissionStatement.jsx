import s from './About.module.css'
import Link from 'next/link'

export default function MissionStatement() {
  return (
    <section className={s.mission}>
      <div className={s.mission_inner}>
        <p className={s.mission_eyebrow}>Our Mission</p>
        <blockquote className={s.mission_quote}>
          "To carry the craftsmanship of Moradabad to every corner
          of the world — one piece at a time."
        </blockquote>
        <p className={s.mission_attr}>— The Maker, Est. 2023</p>
        <Link href="/contact" className={s.mission_cta}>
          Work With Us
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
      </div>
    </section>
  )
}