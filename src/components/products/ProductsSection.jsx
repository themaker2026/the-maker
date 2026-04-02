'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { createClient } from '@/lib/supabase/client'
import ProductCard from './ProductCard'
import s from './ProductsSection.module.css'

const CATEGORIES = [
  {
    slug: 'bells',
    name: 'Bells',
    subtitle: 'Handcast · 12 sizes · Custom tones',
    description:
      'Temple bells, wind chimes, and decorative brass bells — crafted for sound, built for export.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="15" rx="8" ry="9" stroke="#007677" strokeWidth="1.4"/>
        <ellipse cx="12" cy="10" rx="5.5" ry="4.5" stroke="#007677" strokeWidth="1.4"/>
        <ellipse cx="12" cy="6.5" rx="3" ry="2.5" stroke="#007677" strokeWidth="1.4"/>
        <rect x="10.5" y="4" width="3" height="3" rx="1" fill="#007677"/>
        <circle cx="12" cy="22" r="1.5" fill="#007677"/>
      </svg>
    ),
  },
  {
    slug: 'key-rings',
    name: 'Key Rings',
    subtitle: 'Decorative · 30+ designs · Bulk orders',
    description:
      'Elephant, mandala, and heritage motif brass key rings — intricate designs made for gifting and retail.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="10" r="7" stroke="#007677" strokeWidth="1.4"/>
        <circle cx="12" cy="10" r="3.5" stroke="#007677" strokeWidth="1.4"/>
        <path d="M12 17v5M10 20h4" stroke="#007677" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    slug: 'brass-handicrafts',
    name: 'Brass Handicrafts',
    subtitle: 'Decorative · Functional · Custom finish',
    description:
      'Diyas, figurines, and decorative items — each piece a reflection of traditional Indian craftsmanship.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="8" width="16" height="12" rx="2" stroke="#007677" strokeWidth="1.4"/>
        <rect x="7" y="11" width="10" height="6" rx="1" stroke="#007677" strokeWidth="1.2"/>
        <path d="M8 8V6a4 4 0 018 0v2" stroke="#007677" strokeWidth="1.4"/>
      </svg>
    ),
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
}

export default function ProductsSection() {
  const supabase = createClient()
  const [products, setProducts]     = useState([])
  const [counts, setCounts]         = useState({})
  const [loading, setLoading]       = useState(true)
  const [activeDot, setActiveDot]   = useState(0)
  const scrollRef                   = useRef(null)

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Featured products — is_featured = true, limit 4
      const { data: featuredData } = await supabase
        .from('products')
        .select(`
          id, name, slug, images,
          categories ( name )
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(4)

      // Category counts
      const { data: countData } = await supabase
        .from('products')
        .select('category_id, categories ( slug )')
        .eq('is_active', true)

      if (featuredData) {
        const mapped = featuredData.map((p) => ({
          ...p,
          category_name: p.categories?.name || '',
        }))
        setProducts(mapped)
      }

      if (countData) {
        const countMap = {}
        countData.forEach((row) => {
          const slug = row.categories?.slug
          if (slug) countMap[slug] = (countMap[slug] || 0) + 1
        })
        setCounts(countMap)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  // Scroll dot sync
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / 236)
      setActiveDot(index)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className={s.section} ref={ref}>
      <div className={s.inner}>

        {/* ── Header ── */}
        <motion.div
          className={s.header}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          <motion.div className={s.eyebrow} variants={fadeUp}>
            <span className={s.eyebrow_line} />
            What We Make
            <span className={s.eyebrow_line} />
          </motion.div>

          <motion.h2 className={s.headline} variants={fadeUp}>
            Crafted with Intention,
            <span className={s.headline_italic}>Built for the World.</span>
          </motion.h2>

          <motion.p className={s.subheading} variants={fadeUp}>
            Three categories. Countless variations. One standard of quality.
          </motion.p>

          <motion.div className={s.header_divider} variants={fadeUp} />
        </motion.div>

        {/* ── Category cards ── */}
        <motion.div
          className={s.categories}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.slug} variants={fadeUp}>
              <Link
                href={`/products?category=${cat.slug}`}
                className={s.cat_card}
              >
                <div className={s.cat_top}>
                  <div className={s.cat_icon}>{cat.icon}</div>
                  <div className={s.cat_title_wrap}>
                    <div className={s.cat_name}>{cat.name}</div>
                    <div className={s.cat_subtitle}>{cat.subtitle}</div>
                  </div>
                </div>

                <p className={s.cat_description}>{cat.description}</p>

                {/* Mobile full-width CTA */}
                <span className={s.cat_cta_full}>
                  Browse {cat.name} →
                </span>

                <div className={s.cat_footer}>
                  <div className={s.cat_count}>
                    <span>
                      {counts[cat.slug] !== undefined
                        ? counts[cat.slug]
                        : '—'}
                    </span>{' '}
                    products
                  </div>
                  <span className={s.cat_cta}>
                    Browse {cat.name}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Divider ── */}
        <div className={s.divider} />

        {/* ── Featured products ── */}
        <div className={s.featured_head}>
          <h3 className={s.featured_title}>Featured Products</h3>
          <Link href="/products" className={s.view_all}>
            View Full Catalogue →
          </Link>
        </div>

        {/* Desktop grid */}
        {loading ? (
          <div className={s.products_grid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${s.skeleton} ${s.skeleton_card}`} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            className={s.products_grid}
            variants={stagger}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className={s.products_grid}>
            <div className={s.empty}>
              Products coming soon — check back shortly.
            </div>
          </div>
        )}

        {/* Mobile horizontal scroll */}
        <div className={s.products_scroll} ref={scrollRef}>
          {loading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${s.skeleton} ${s.scroll_card}`}
                  style={{ height: 280 }}
                />
              ))
            : products.map((product) => (
                <div key={product.id} className={s.scroll_card}>
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

        {/* Scroll dots — mobile only */}
        {!loading && products.length > 0 && (
          <div className={s.scroll_dots}>
            {products.map((_, i) => (
              <div
                key={i}
                className={`${s.dot} ${i === activeDot ? s.dot_active : ''}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}