"use client";

import { motion, useScroll, useTransform, MotionConfig } from "motion/react";

/**
 * Aurora — the ambient weather layer of the landing.
 *
 * Three overlapping gradients drift with scroll. `mix-blend-mode: screen` so
 * the aurora ADDS light instead of flattening the darkness — the Stripe
 * Sessions trick. `aria-hidden`, fixed-position, one composited layer.
 *
 * Hydration note: we do NOT branch style values on `useReducedMotion()`
 * because that hook returns `null` on the server and the real bool on the
 * client → SSR-CSR opacity mismatch. Instead, we wrap in `<MotionConfig
 * reducedMotion="user">` so Motion itself neutralizes the transitions when
 * the OS pref says so, and the *initial* style values (opacity at scroll=0)
 * are computed from `useTransform`, which returns the same value on both
 * sides of the boundary.
 */
export function Aurora() {
  const { scrollYProgress } = useScroll();

  // Each blob has its own trajectory across the page's scroll.
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-10%", "60%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);

  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.55, 0.35, 0.15]);
  const opacity2 = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0.1, 0.55, 0.2]);
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.75, 1], [0.05, 0.4, 0.55]);

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [mix-blend-mode:screen]"
      >
        {/* AWS orange — top-right bloom */}
        <motion.div
          style={{ y: y1, opacity: opacity1 }}
          className="absolute -right-[15%] -top-[15%] size-[70vmax] rounded-full blur-3xl animate-[aurora-drift_18s_ease-in-out_infinite]"
        >
          <div
            className="size-full rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,153,0,0.55), rgba(255,153,0,0) 60%)",
            }}
          />
        </motion.div>

        {/* AI purple — center-left mid drift */}
        <motion.div
          style={{ y: y2, opacity: opacity2 }}
          className="absolute -left-[20%] top-[30%] size-[80vmax] rounded-full blur-3xl animate-[aurora-drift_24s_ease-in-out_infinite_reverse]"
        >
          <div
            className="size-full rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(139,92,246,0.5), rgba(139,92,246,0) 60%)",
            }}
          />
        </motion.div>

        {/* GCP blue — bottom bloom that rises as you scroll to the end */}
        <motion.div
          style={{ y: y3, opacity: opacity3 }}
          className="absolute -bottom-[20%] left-[25%] size-[70vmax] rounded-full blur-3xl animate-[aurora-drift_30s_ease-in-out_infinite]"
        >
          <div
            className="size-full rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(66,133,244,0.45), rgba(66,133,244,0) 60%)",
            }}
          />
        </motion.div>

        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.06] [mix-blend-mode:overlay]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
          }}
        />
      </div>
    </MotionConfig>
  );
}
