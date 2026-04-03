import s from './Contact.module.css'

export default function ContactHero() {
  return (
    <section className={s.hero}>
      <div className={s.hero_inner}>
        <div className={s.eyebrow}>
          <span className={s.eyebrow_line} />
          Get in Touch
          <span className={s.eyebrow_line} />
        </div>
        <h1 className={s.hero_headline}>
          Let's Start a{' '}
          <span className={s.hero_italic}>Conversation.</span>
        </h1>
        <p className={s.hero_sub}>
          Fill in the form and we'll get back to you within 24 hours.
          Whether it's a first enquiry or a bulk order — we're ready.
        </p>
      </div>
    </section>
  )
}