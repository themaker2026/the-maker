import s from './About.module.css'

export default function AboutHero() {
  return (
    <section className={s.hero}>
      <div className={s.hero_inner}>
        <p className={s.eyebrow}>Our Story</p>
        <h1 className={s.hero_headline}>
          The People Behind
          <span className={s.italic}> The Maker.</span>
        </h1>
        <p className={s.hero_sub}>
          Born in Moradabad — the Brass City of India — built for the world.
        </p>
      </div>
    </section>
  )
}