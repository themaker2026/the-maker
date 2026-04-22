'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import s from './CategoriesDropdown.module.css'

const CATEGORY_ICONS = {
  'bells': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="15" rx="8" ry="9" stroke="#007677" strokeWidth="1.4"/>
      <ellipse cx="12" cy="10" rx="5.5" ry="4.5" stroke="#007677" strokeWidth="1.4"/>
      <ellipse cx="12" cy="6.5" rx="3" ry="2.5" stroke="#007677" strokeWidth="1.4"/>
      <rect x="10.5" y="4" width="3" height="3" rx="1" fill="#007677"/>
      <circle cx="12" cy="22" r="1.5" fill="#007677"/>
    </svg>
  ),
  'key-rings': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="10" r="7" stroke="#007677" strokeWidth="1.4"/>
      <circle cx="12" cy="10" r="3.5" stroke="#007677" strokeWidth="1.4"/>
      <path d="M12 17v5M10 20h4" stroke="#007677" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  'brass-handicrafts': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="8" width="16" height="12" rx="2" stroke="#007677" strokeWidth="1.4"/>
      <rect x="7" y="11" width="10" height="6" rx="1" stroke="#007677" strokeWidth="1.2"/>
      <path d="M8 8V6a4 4 0 018 0v2" stroke="#007677" strokeWidth="1.4"/>
    </svg>
  ),
}

function DefaultIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M20 7H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" stroke="#007677" strokeWidth="1.4"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#007677" strokeWidth="1.4"/>
    </svg>
  )
}

export default function CategoriesDropdown({ categories, onClose }) {
  const router = useRouter()

  const handleCategoryClick = (slug) => {
    onClose()
    router.push(`/products?category=${slug}`)
  }

  const handleViewAll = () => {
    onClose()
    router.push('/products')
  }

  return (
    <div className={s.panel}>
      <div className={s.inner}>

        {/* Left editorial panel */}
        <div className={s.left}>
          <div>
            <h3 className={s.left_heading}>
              Browse by
              <span className={s.left_heading_italic}>Category</span>
            </h3>
            <p className={s.left_sub}>
              Select a category to explore our handcrafted brass products.
            </p>
          </div>
          <button className={s.view_all_btn} onClick={handleViewAll}>
            View all products →
          </button>
        </div>

        {/* Divider */}
        <div className={s.divider} />

        {/* Right — category rows */}
        <div className={s.categories}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={s.cat_row}
              onClick={() => handleCategoryClick(cat.slug)}
            >
              <div className={s.cat_icon}>
                {CATEGORY_ICONS[cat.slug] || <DefaultIcon />}
              </div>
              <div className={s.cat_text}>
                <span className={s.cat_name}>{cat.name}</span>
                {cat.description && (
                  <span className={s.cat_desc}>{cat.description}</span>
                )}
              </div>
              <span className={s.cat_count}>
                {cat.product_count > 0
                  ? `${cat.product_count} products`
                  : 'Coming soon'}
              </span>
              <svg
                className={s.cat_chevron}
                width="14" height="14"
                viewBox="0 0 16 16" fill="none"
              >
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}

          {categories.length === 0 && (
            <div className={s.empty}>
              No categories yet — check back soon.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}