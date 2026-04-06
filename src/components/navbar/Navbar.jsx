"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";
import SearchDropdown from "./SearchDropdown";
import s from "./Navbar.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    isOpen,
    setIsOpen,
    handleSelect,
    handleSubmit,
    clear,
  } = useSearch();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSubmit(e);
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setSearchFocused(false);
      inputRef.current?.blur();
    }
  };

  const onSelectSuggestion = (item) => {
    handleSelect(item);
    setSearchFocused(false);
  };

  return (
    <>
      <motion.header
        className={s.navbar_root}
        animate={{
          height: scrolled ? 56 : 64,
          backgroundColor: scrolled
            ? "rgba(245,245,245,0.92)"
            : "rgba(245,245,245,1)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className={s.navbar_inner}>
          {/* Logo */}
          <Link href="/" className={s.navbar_logo}>
            The <span>Maker</span>
          </Link>

          {/* Desktop nav links */}
          <nav className={s.navbar_links}>
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${s.navbar_link} ${isActive ? s.navbar_link_active : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
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
                    <circle
                      cx="6.5"
                      cy="6.5"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10.5 10.5L14 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
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
                        setSearchFocused(true);
                        if (suggestions.length > 0) setIsOpen(true);
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
                      <path
                        d="M1 1l10 10M11 1L1 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
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
                animate={mobileOpen ? "open" : "closed"}
                className={s.hamburger}
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 },
                  }}
                  transition={{ duration: 0.2 }}
                  className={s.hamburger_line}
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1, x: 0 },
                    open: { opacity: 0, x: -8 },
                  }}
                  transition={{ duration: 0.15 }}
                  className={s.hamburger_line}
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 },
                  }}
                  transition={{ duration: 0.2 }}
                  className={s.hamburger_line}
                />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
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
            <div className={s.mobile_search_wrapper}>
              <form onSubmit={onSearchSubmit} className={s.mobile_search_form}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="6.5"
                    cy="6.5"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10.5 10.5L14 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    setSearchFocused(true);
                    if (suggestions.length > 0) setIsOpen(true);
                  }}
                  placeholder="Search products..."
                  className={s.mobile_search_input}
                  autoComplete="off"
                />
              </form>

              {/* Show dropdown on mobile if open */}
              {isOpen && searchFocused && (
                <SearchDropdown
                  suggestions={suggestions}
                  query={query}
                  onSelect={(item) => {
                    onSelectSuggestion(item);
                    setMobileOpen(false); // Make sure menu closes on click
                  }}
                />
              )}
            </div>

            <nav className={s.mobile_nav}>
              {NAV_LINKS.map((link, i) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`${s.mobile_nav_link} ${isActive ? s.mobile_nav_link_active : ""}`}
                    >
                      {link.label}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M6 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <Link href="/contact" className={s.mobile_cta}>
              Get a Quote
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className={s.spacer} style={{ height: scrolled ? 56 : 64 }} />
    </>
  );
}
