'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@/hooks/useSearch'
import { useCategories } from '@/hooks/useCategories'
import SearchDropdown from './SearchDropdown'
import CategoriesDropdown from './CategoriesDropdown'
import s from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'Products',   href: '/products' },
  { label: 'About',      href: '/about' },
  { label: 'Contact',    href: '/contact' },
]

export default function Navbar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const [scrolled, setScrolled]               = useState(false)
  const [mobileOpen, setMobileOpen]           = useState(false)
  const [searchFocused, setSearchFocused]     = useState(false)
  const [catOpen, setCatOpen]                 = useState(false)
  const [mobileCatOpen, setMobileCatOpen]     = useState(false)

  const searchRef   = useRef(null)
  const inputRef    = useRef(null)
  const catRef      = useRef(null)
  const closeTimer  = useRef(null)

  const { categories } = useCategories()

  const {
    query, setQuery, suggestions,
    isOpen, setIsOpen,
    handleSelect, handleSubmit, clear,
  } = useSearch()

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setMobileCatOpen(false)
  }, [pathname])

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setIsOpen])

  // 150ms delay close for categories dropdown
  const handleCatMouseEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setCatOpen(true)
  }, [])

  const handleCatMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setCatOpen(false), 150)
  }, [])

  const closeCatDropdown = useCallback(() => {
    setCatOpen(false)
  }, [])

  // Search submit
  const onSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      handleSubmit(e)
      router.push(`/products?q=${encodeURIComponent(query.trim())}`)
      setSearchFocused(false)
      inputRef.current?.blur()
    }
  }

  const onSelectSuggestion = (item) => {
    handleSelect(item)
    setSearchFocused(false)
  }

  if (pathname?.startsWith('/dashboard')) {
    return null
  }

  return (
    <>


      <motion.header
        className={s.navbar_root}
        animate={{
          height: scrolled ? 56 : 64,
          backgroundColor: scrolled
            ? 'rgba(245,245,245,0.92)'
            : 'rgba(245,245,245,1)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className={s.navbar_inner}>

          {/* Logo */}
          <Link href="/" className={s.navbar_logo}>
            <Image 
              src="/logo.png" 
              alt="The Maker" 
              width={40} 
              height={40} 
              className={s.logo_image} 
              priority
            />
            <div>The <span>Maker</span></div>
          </Link>

          {/* Desktop nav */}
          <nav className={s.navbar_links}>
            {/* Home */}
            <Link
              href="/"
              className={`${s.navbar_link} ${pathname === '/' ? s.navbar_link_active : ''}`}
            >
              Home
            </Link>

            {/* Products */}
            <Link
              href="/products"
              className={`${s.navbar_link} ${pathname.startsWith('/products') ? s.navbar_link_active : ''}`}
            >
              Products
            </Link>

            {/* Categories — with dropdown */}
            <div
              ref={catRef}
              className={s.cat_trigger_wrap}
              onMouseEnter={handleCatMouseEnter}
              onMouseLeave={handleCatMouseLeave}
            >
              <button
                className={`${s.navbar_link} ${s.cat_trigger} ${catOpen ? s.cat_trigger_open : ''}`}
                onClick={() => setCatOpen(!catOpen)}
                aria-expanded={catOpen}
                aria-haspopup="true"
              >
                Categories
                <motion.svg
                  width="12" height="12"
                  viewBox="0 0 12 12" fill="none"
                  animate={{ rotate: catOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    key="cat-dropdown"
                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 10, x: '-50%' }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    onMouseEnter={handleCatMouseEnter}
                    onMouseLeave={handleCatMouseLeave}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      paddingTop: '24px',
                      zIndex: 47,
                    }}
                  >
                    <CategoriesDropdown
                      categories={categories}
                      onClose={closeCatDropdown}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* About */}
            <Link
              href="/about"
              className={`${s.navbar_link} ${pathname === '/about' ? s.navbar_link_active : ''}`}
            >
              About
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className={`${s.navbar_link} ${pathname === '/contact' ? s.navbar_link_active : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop right */}
          <div className={s.navbar_right}>

            {/* Search */}
            <div ref={searchRef} className={s.search_wrapper}>
              <form onSubmit={onSearchSubmit} className={s.search_form}>
                <button
                  type="submit"
                  className={s.search_icon_btn}
                  aria-label="Search"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                <AnimatePresence>
                  {(!scrolled || searchFocused) && (
                    <motion.input
                      ref={inputRef}
                      key="search-input"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 160, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => {
                        setSearchFocused(true)
                        if (suggestions.length > 0) setIsOpen(true)
                      }}
                      placeholder="Search products..."
                      className={s.search_input}
                      autoComplete="off"
                    />
                  )}
                </AnimatePresence>

                {query && (
                  <button
                    type="button"
                    onClick={clear}
                    className={s.search_clear_btn}
                    aria-label="Clear search"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </form>

              {isOpen && searchFocused && (
                <SearchDropdown
                  suggestions={suggestions}
                  query={query}
                  onSelect={onSelectSuggestion}
                />
              )}
            </div>

            {/* CTA */}
            <Link href="/contact" className={s.navbar_cta}>
              Get a Quote
            </Link>

            {/* Hamburger */}
            <button
              className={s.mobile_menu_btn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={mobileOpen ? 'open' : 'closed'}
                className={s.hamburger}
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open:   { rotate: 45, y: 6 },
                  }}
                  transition={{ duration: 0.2 }}
                  className={s.hamburger_line}
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1, x: 0 },
                    open:   { opacity: 0, x: -8 },
                  }}
                  transition={{ duration: 0.15 }}
                  className={s.hamburger_line}
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open:   { rotate: -45, y: -6 },
                  }}
                  transition={{ duration: 0.2 }}
                  className={s.hamburger_line}
                />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={s.mobile_menu}
          >
            {/* Mobile search */}
            <form onSubmit={onSearchSubmit} className={s.mobile_search_form}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className={s.mobile_search_input}
                autoComplete="off"
              />
            </form>

            {/* Mobile nav links */}
            <nav className={s.mobile_nav}>

              {/* Home */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Link
                  href="/"
                  className={`${s.mobile_nav_link} ${pathname === '/' ? s.mobile_nav_link_active : ''}`}
                >
                  Home
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </Link>
              </motion.div>

              {/* Products */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  href="/products"
                  className={`${s.mobile_nav_link} ${pathname.startsWith('/products') ? s.mobile_nav_link_active : ''}`}
                >
                  Products
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </Link>
              </motion.div>

              {/* Categories — accordion */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <button
                  className={`${s.mobile_nav_link} ${s.mobile_cat_trigger}`}
                  onClick={() => setMobileCatOpen(!mobileCatOpen)}
                >
                  Categories
                  <motion.svg
                    width="14" height="14"
                    viewBox="0 0 16 16" fill="none"
                    animate={{ rotate: mobileCatOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {mobileCatOpen && (
                    <motion.div
                      key="mobile-cats"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          className={s.mobile_cat_item}
                          onClick={() => {
                            setMobileOpen(false)
                            router.push(`/products?category=${cat.slug}`)
                          }}
                        >
                          <div className={s.mobile_cat_icon_wrap}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <ellipse cx="12" cy="15" rx="8" ry="9" stroke="#007677" strokeWidth="1.4"/>
                              <ellipse cx="12" cy="10" rx="5.5" ry="4.5" stroke="#007677" strokeWidth="1.4"/>
                            </svg>
                          </div>
                          <div className={s.mobile_cat_text}>
                            <span className={s.mobile_cat_name}>{cat.name}</span>
                            <span className={s.mobile_cat_count}>
                              {cat.product_count > 0
                                ? `${cat.product_count} products`
                                : 'Coming soon'}
                            </span>
                          </div>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4l4 4-4 4" stroke="#007677" strokeWidth="1.3" strokeLinecap="round"/>
                          </svg>
                        </button>
                      ))}

                      {/* View all */}
                      <button
                        className={s.mobile_cat_view_all}
                        onClick={() => {
                          setMobileOpen(false)
                          router.push('/products')
                        }}
                      >
                        View all products →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* About */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/about"
                  className={`${s.mobile_nav_link} ${pathname === '/about' ? s.mobile_nav_link_active : ''}`}
                >
                  About
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </Link>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Link
                  href="/contact"
                  className={`${s.mobile_nav_link} ${pathname === '/contact' ? s.mobile_nav_link_active : ''}`}
                >
                  Contact
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </Link>
              </motion.div>

            </nav>

            <Link href="/contact" className={s.mobile_cta}>
              Get a Quote
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div
        className={s.spacer}
        style={{ height: scrolled ? 56 : 64, transition: 'height 0.25s ease' }}
      />
    </>
  )
}