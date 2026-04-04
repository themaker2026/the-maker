'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '@/components/products/ProductCard'
import s from './Product.module.css'

const TRUST_ITEMS = [
  'Export-ready documentation',
  'Sample orders welcome',
  'Ships from Moradabad, India',
]

const SPEC_FIELDS = [
  { label: 'Material',   key: 'material' },
  { label: 'Weight',     key: 'weight' },
  { label: 'Finish',     key: 'finish' },
  { label: 'Origin',     key: null, value: 'Moradabad, India' },
  { label: 'Dimensions', key: 'dimensions' },
  { label: 'MOQ',        key: 'moq', suffix: ' pcs' },
]

export default function ProductDetail({ product, related }) {
  const [activeImage, setActiveImage] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const images = product.images?.length > 0 ? product.images : []
  const hasImages = images.length > 0
  const categorySlug = product.categories?.slug || ''
  const categoryName = product.categories?.name || ''

  const whatsappText = encodeURIComponent(
    `Hi, I'm interested in: ${product.name}\n${currentUrl}`
  )

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 2500)
    } catch {
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 2500)
    }
  }

  const renderTitle = (name) => {
    if (!name) return null
    if (name.includes('—')) {
      const parts = name.split('—')
      return (
        <>
          {parts[0].trim()}
          <span className={s.product_title_italic}>— {parts.slice(1).join('—').trim()}</span>
        </>
      )
    }
    if (name.includes(' - ')) {
      const parts = name.split(' - ')
      return (
        <>
          {parts[0].trim()}
          <span className={s.product_title_italic}>— {parts.slice(1).join(' - ').trim()}</span>
        </>
      )
    }
    return name
  }

  return (
    <div className={s.page}>

      {/* ── Breadcrumb ── */}
      <nav className={s.breadcrumb} aria-label="Breadcrumb">
        <Link href="/" className={s.breadcrumb_link}>Home</Link>
        <span className={s.breadcrumb_sep}>/</span>
        <Link href="/products" className={s.breadcrumb_link}>Products</Link>
        {categoryName && (
          <>
            <span className={s.breadcrumb_sep}>/</span>
            <Link
              href={`/products?category=${categorySlug}`}
              className={s.breadcrumb_link}
            >
              {categoryName}
            </Link>
          </>
        )}
        <span className={s.breadcrumb_sep}>/</span>
        <span className={s.breadcrumb_current}>{product.name}</span>
      </nav>

      {/* ── Main grid ── */}
      <div className={s.main}>

        {/* ── Gallery ── */}
        <div className={s.gallery}>
          {/* Main image */}
          <div className={s.main_image_wrap}>
            {hasImages ? (
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className={s.main_image}
                sizes="(max-width: 900px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className={s.image_placeholder}>
                <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                  <ellipse cx="24" cy="32" rx="14" ry="16" fill="#BFC6C4"/>
                  <ellipse cx="24" cy="22" rx="10" ry="8" fill="#CBE0E0"/>
                  <ellipse cx="24" cy="15" rx="6" ry="4.5" fill="#BFC6C4"/>
                  <rect x="21" y="11" width="6" height="5" rx="1.5" fill="#9BB5B5"/>
                  <circle cx="24" cy="44" r="3" fill="#9BB5B5"/>
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className={s.thumbnails}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${s.thumb} ${i === activeImage ? s.thumb_active : ''}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <motion.div
          className={s.info}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {/* Category tag */}
          {categoryName && (
            <Link
              href={`/products?category=${categorySlug}`}
              className={s.category_tag}
            >
              {categoryName}
            </Link>
          )}

          {/* Title */}
          <h1 className={s.product_title}>
            {renderTitle(product.name)}
          </h1>

          <div className={s.divider} />

          {/* Description */}
          {product.description && (
            <p className={s.description}>{product.description}</p>
          )}

          {/* Specs */}
          <div className={s.specs}>
            <p className={s.specs_title}>Product Details</p>
            <div className={s.specs_grid}>
              {SPEC_FIELDS.map((field) => {
                const val = field.key
                  ? product[field.key]
                  : field.value
                return (
                  <div key={field.label} className={s.spec_item}>
                    <p className={s.spec_label}>{field.label}</p>
                    <p className={`${s.spec_value} ${!val ? s.spec_value_empty : ''}`}>
                      {val
                        ? `${val}${field.suffix || ''}`
                        : '—'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTAs */}
          <div className={s.cta_row}>
            <Link
              href={`/contact?product=${product.slug}&name=${encodeURIComponent(product.name)}`}
              className={s.btn_enquire}
            >
              Enquire About This Product
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor" strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </Link>

            <a
              href={`https://wa.me/91XXXXXXXXXX?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className={s.btn_whatsapp}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Trust signals */}
          <div className={s.trust_row}>
            {TRUST_ITEMS.map((item) => (
              <div key={item} className={s.trust_item}>
                <span className={s.trust_dot} />
                {item}
              </div>
            ))}
          </div>

          {/* Share */}
          <div className={s.share_row}>
            <span className={s.share_label}>Share:</span>
            <button
              className={s.share_btn}
              onClick={handleCopyLink}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
                <path
                  d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              Copy link
            </button>
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${s.share_btn} ${s.share_btn_whatsapp}`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>

        </motion.div>
      </div>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <div className={s.related}>
          <div className={s.related_head}>
            <h2 className={s.related_title}>
              {categoryName ? `More from ${categoryName}` : 'Related Products'}
            </h2>
            <Link
              href={categorySlug ? `/products?category=${categorySlug}` : '/products'}
              className={s.related_link}
            >
              View all →
            </Link>
          </div>
          <div className={s.related_grid}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            className={s.toast}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8l4 4 6-6"
                stroke="#fff" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            Link copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}