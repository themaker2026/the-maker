'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import ProductCard from './ProductCard'
import s from './Products.module.css'

const PAGE_SIZE = 8

const CATEGORIES = [
  { label: 'All',               slug: null },
  { label: 'Bells',             slug: 'bells' },
  { label: 'Key Rings',         slug: 'key-rings' },
  { label: 'Brass Handicrafts', slug: 'brass-handicrafts' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

function SkeletonCard() {
  return (
    <div className={s.skeleton_card}>
      <div className={s.skeleton_image} />
      <div className={s.skeleton_body}>
        <div className={s.skeleton_line} />
        <div className={`${s.skeleton_line} ${s.skeleton_line_short}`} />
        <div className={s.skeleton_btn} />
      </div>
    </div>
  )
}

export default function ProductsCatalogue() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const supabase     = createClient()

  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [total, setTotal]             = useState(0)
  const [offset, setOffset]           = useState(0)

  const urlCategory = searchParams.get('category')
  const urlQuery    = searchParams.get('q')

  const [activeCategory, setActiveCategory] = useState(urlCategory || null)
  const [searchQuery, setSearchQuery]       = useState(urlQuery || '')

  const fetchProducts = useCallback(async ({
    category,
    query,
    currentOffset,
    append = false,
  }) => {
    if (!append) setLoading(true)
    else setLoadingMore(true)

    try {
      let q = supabase
        .from('products')
        .select(`
          id, name, slug, images,
          categories ( name, slug )
        `, { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + PAGE_SIZE - 1)

      if (category) {
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .single()

        if (catData) q = q.eq('category_id', catData.id)
      }

      if (query && query.trim()) {
        q = q.textSearch('fts', query.trim(), { type: 'websearch' })
      }

      const { data, count, error } = await q
      if (error) throw error

      const mapped = (data || []).map((p) => ({
        ...p,
        category_name: p.categories?.name || '',
      }))

      setProducts((prev) => append ? [...prev, ...mapped] : mapped)
      setTotal(count || 0)
    } catch (err) {
      console.error('Fetch products error:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [supabase])

  // Initial + filter change fetch
  useEffect(() => {
    setOffset(0)
    fetchProducts({
      category: activeCategory,
      query: searchQuery,
      currentOffset: 0,
      append: false,
    })
  }, [activeCategory, searchQuery, fetchProducts])

  // Sync URL params on mount
  useEffect(() => {
    if (urlCategory) setActiveCategory(urlCategory)
    if (urlQuery)    setSearchQuery(urlQuery)
  }, [])

  const handleCategoryClick = (slug) => {
    // If clicking the already active (non-All) category, reset it to null (All)
    const newSlug = slug === activeCategory ? null : slug

    setActiveCategory(newSlug)
    const params = new URLSearchParams()
    if (newSlug) params.set('category', newSlug)
    if (searchQuery) params.set('q', searchQuery)
    router.replace(`/products${params.toString() ? `?${params}` : ''}`,
      { scroll: false })
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const params = new URLSearchParams()
    if (activeCategory) params.set('category', activeCategory)
    router.replace(`/products${params.toString() ? `?${params}` : ''}`,
      { scroll: false })
  }

  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE
    setOffset(newOffset)
    fetchProducts({
      category: activeCategory,
      query: searchQuery,
      currentOffset: newOffset,
      append: true,
    })
  }

  const hasMore = products.length < total

  return (
    <section className={s.catalogue}>
      <div className={s.catalogue_inner}>

        {/* Search banner */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              className={s.search_banner}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className={s.search_banner_text}>
                Search results for{' '}
                <span>&ldquo;{searchQuery}&rdquo;</span>
                {' '}·{' '}
                {loading ? '...' : `${total} product${total !== 1 ? 's' : ''} found`}
              </p>
              <button
                className={s.search_clear}
                onClick={handleClearSearch}
              >
                Clear ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter bar */}
        <div className={s.filter_bar}>
          <div className={s.filter_hint_mobile}>&larr; swipe to filter &rarr;</div>
          <div className={s.filter_bar_inner}>
            <div className={s.filter_pills}>
              {CATEGORIES.map((cat) => {
                const isActive = cat.slug === activeCategory ||
                  (cat.slug === null && !activeCategory)
                return (
                  <button
                    key={cat.label}
                    className={`${s.pill} ${isActive ? s.pill_active : ''}`}
                    onClick={() => handleCategoryClick(cat.slug)}
                  >
                    {cat.label}
                    {isActive && cat.slug && (
                      <span className={s.pill_clear}>×</span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className={s.filter_right}>
              <span className={s.result_count}>
                {loading ? '...' : `${total} product${total !== 1 ? 's' : ''}`}
              </span>
              <span className={s.filter_divider}>|</span>
              <button className={s.sort_btn}>
                Sort: Newest &uarr;
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className={s.grid}>
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className={s.grid}>
            <div className={s.empty}>
              <div className={s.empty_icon}>
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <ellipse
                    cx="24" cy="30" rx="14" ry="16"
                    fill="#BFC6C4" opacity="0.5"
                  />
                  <ellipse
                    cx="24" cy="20" rx="10" ry="8"
                    fill="#BFC6C4" opacity="0.4"
                  />
                  <ellipse
                    cx="24" cy="13" rx="6" ry="4.5"
                    fill="#BFC6C4" opacity="0.3"
                  />
                </svg>
              </div>
              <h2 className={s.empty_title}>No products found</h2>
              <p className={s.empty_body}>
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search or browse all categories.`
                  : 'No products in this category yet. Check back soon.'}
              </p>
              <button
                className={s.empty_btn}
                onClick={() => {
                  setActiveCategory(null)
                  setSearchQuery('')
                  router.replace('/products', { scroll: false })
                }}
              >
                View All Products
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            className={s.grid}
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom section */}
        {!loading && products.length > 0 && (
          <div className={s.catalogue_footer}>
            {hasMore && (
              <button
                className={s.load_more_btn}
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More Products'}
              </button>
            )}

            {!activeCategory && !searchQuery ? (
              <div className={s.info_banner}>
                Showing all {total} product{total !== 1 ? 's' : ''} &middot; Click a category to filter
              </div>
            ) : (
              <div className={s.info_text}>
                Showing {products.length} of {total} result{total !== 1 ? 's' : ''} {activeCategory ? `in ${CATEGORIES.find(c => c.slug === activeCategory)?.label || 'Category'}` : `for "${searchQuery}"`}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}