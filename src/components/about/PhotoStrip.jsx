import Image from 'next/image'
import s from './About.module.css'

const SLOTS = [
  { label: 'Workshop interior', image: '/WorkShopInterior.webp' },
  { label: 'Artisan at work', image: '/ArtisanAtWork.webp' },
  { label: 'Finished products', image: '/FinishedProducts.webp' },
]

export default function PhotoStrip() {
  return (
    <section className={s.strip}>
      <div className={s.strip_inner}>
        {SLOTS.map((slot) => (
          <div key={slot.label} className={s.strip_slot} style={{ position: 'relative' }}>
            <Image
              src={slot.image}
              alt={slot.label}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}