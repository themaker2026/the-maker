"use client";

import { useRef, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import s from "./Hero.module.css";

const BellCanvas = dynamic(() => import("./BellCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 120,
          height: 140,
          borderRadius: "50% 50% 45% 45%",
          background: "linear-gradient(160deg, #E8EDED 0%, #CBE0E0 100%)",
          opacity: 0.6,
        }}
      />
    </div>
  ),
});

const STATS = [
  { value: "500+", label: "Products" },
  { value: "30+", label: "Countries" },
  { value: "15+", label: "Years of Craft" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function Hero() {
  return (
    <section className={s.hero}>
      {/* Soft teal glow — right side only */}
      <div className={s.glow} aria-hidden="true" />

      <div className={s.inner}>
        {/* ── LEFT — Copy ── */}
        <motion.div
          className={s.left}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow */}
          <motion.div className={s.eyebrow} variants={fadeUp}>
            <span className={s.eyebrow_line} />
            Handcrafted · Exported Worldwide
          </motion.div>

          {/* Headline */}
          <motion.h1 className={s.headline} variants={fadeUp}>
            Brass Crafted
            <span className={s.headline_italic}>with Purpose.</span>
          </motion.h1>

          {/* Divider */}
          <motion.div className={s.divider} variants={fadeUp} />

          {/* Body */}
          <motion.p className={s.body} variants={fadeUp}>
            Premium brass handicrafts — bells, key rings, and decorative items —
            made by skilled artisans and exported to discerning buyers across
            the world.
          </motion.p>

          {/* CTAs */}
          <motion.div className={s.cta_row} variants={fadeUp}>
            <Link href="/products" className={s.cta_primary}>
              Explore Collection
            </Link>
            <Link href="/contact" className={s.cta_secondary}>
              Get a Quote
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.div className={s.stats} variants={fadeUp}>
            {STATS.map((stat) => (
              <div key={stat.label} className={s.stat}>
                <span className={s.stat_value}>{stat.value}</span>
                <span className={s.stat_label}>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT — 3D Bell ── */}
        <div className={s.right}>
          <div className={s.canvas_wrap}>
            <BellCanvas />
          </div>

          {/* Scroll hint */}
          <div className={s.scroll_hint}>
            <div className={s.scroll_dot}>
              <motion.div
                className={s.scroll_dot_inner}
                animate={{ y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  ease: "easeInOut",
                }}
              />
            </div>
            Scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}
