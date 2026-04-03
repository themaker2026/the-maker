import s from './About.module.css'

const SLOTS = [
  { label: 'Workshop interior', hint: 'The casting floor or furnace area' },
  { label: 'Artisan at work', hint: 'A craftsman shaping or polishing brass' },
  { label: 'Finished products', hint: 'Bells, key rings, or packaged goods' },
]

export default function PhotoStrip() {
  return (
    <section className={s.strip}>
      <div className={s.strip_inner}>
        {SLOTS.map((slot) => (
          <div key={slot.label} className={s.strip_slot}>
            <div className={s.strip_placeholder}>
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <rect
                  x="4" y="8" width="40" height="32" rx="4"
                  stroke="#BFC6C4" strokeWidth="1.5"
                />
                <circle
                  cx="16" cy="20" r="4"
                  stroke="#BFC6C4" strokeWidth="1.5"
                />
                <path
                  d="M4 32l10-8 8 6 6-5 12 9"
                  stroke="#BFC6C4" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              <p className={s.strip_label}>{slot.label}</p>
              <p className={s.strip_hint}>{slot.hint}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}