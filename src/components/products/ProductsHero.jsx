import s from './Products.module.css'

export default function ProductsHero() {
  return (
    <section className={s.hero}>
      <div className={s.hero_inner}>
        <p className={s.eyebrow}>Our Catalogue</p>
        <h1 className={s.hero_headline}>
          The Full{' '}
          <span className={s.hero_italic}>Collection.</span>
        </h1>
        <p className={s.hero_sub}>
          Handcrafted brass products from Moradabad — browse by
          category or search below.
        </p>
      </div>
    </section>
  )
}