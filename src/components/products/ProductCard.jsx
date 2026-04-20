'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import s from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const router = useRouter()

  const handleEnquire = (e) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(
      `/contact?product=${product.slug}&name=${encodeURIComponent(product.name)}`
    )
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={s.card}
    >
      {/* Image */}
      <div className={s.image_wrap}>
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={s.image}
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <div className={s.image_placeholder}>
            <svg
              className={s.placeholder_icon}
              width="48" height="48"
              viewBox="0 0 48 48" fill="none"
            >
              <ellipse cx="24" cy="32" rx="14" ry="16" fill="#BFC6C4"/>
              <ellipse cx="24" cy="22" rx="10" ry="8" fill="#CBE0E0"/>
              <ellipse cx="24" cy="15" rx="6" ry="4.5" fill="#BFC6C4"/>
              <rect x="21" y="11" width="6" height="5" rx="1.5" fill="#9BB5B5"/>
              <circle cx="24" cy="44" r="3" fill="#9BB5B5"/>
            </svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={s.body}>
        <h3 className={s.name}>{product.name}</h3>
        {product.category_name && (
          <span className={s.tag}>{product.category_name}</span>
        )}
        <button
          className={s.enquire_btn}
          onClick={handleEnquire}
        >
          Enquire
        </button>
      </div>
    </Link>
  )
}