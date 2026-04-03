import s from './About.module.css'

export default function FounderStory() {
  return (
    <section className={s.founder}>
      <div className={s.founder_inner}>

        {/* Left — copy */}
        <div className={s.founder_text}>
          <p className={s.section_eyebrow}>Who We Are</p>
          <h2 className={s.section_headline}>
            A City's Craft Legacy,
            <span className={s.italic}> A New Global Vision.</span>
          </h2>
          <div className={s.divider} />
          <p className={s.body_text}>
            Moradabad has been India's brass capital for over four centuries.
            Its artisans have supplied the world's finest markets with
            handcrafted brassware — and The Maker was founded in 2023 to
            bring that legacy directly to international wholesale buyers,
            without the middlemen.
          </p>
          <p className={s.body_text}>
            We work directly with master craftsmen in Moradabad's workshops,
            overseeing every step from raw brass to finished product. Our
            mission is simple — deliver world-class Indian craftsmanship
            with the reliability and transparency that global buyers expect.
          </p>
          <p className={s.body_text}>
            Today, The Maker exports bells, key rings, and brass handicrafts
            to buyers across 30+ countries — with every order backed by
            complete export documentation and quality assurance.
          </p>
        </div>

        {/* Right — photo placeholder */}
        <div className={s.founder_photo}>
          <div className={s.photo_placeholder}>
            <div className={s.placeholder_inner}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect
                  x="4" y="8" width="40" height="32" rx="4"
                  stroke="#BFC6C4" strokeWidth="1.5"
                />
                <circle cx="16" cy="20" r="4" stroke="#BFC6C4" strokeWidth="1.5" />
                <path
                  d="M4 32l10-8 8 6 6-5 12 9"
                  stroke="#BFC6C4" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              <p className={s.placeholder_label}>Workshop or founder photo</p>
              <p className={s.placeholder_hint}>Replace via Supabase Storage</p>
            </div>
          </div>
          <div className={s.photo_accent} />
        </div>

      </div>
    </section>
  )
}