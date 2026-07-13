"use client";

import { motion, useReducedMotion } from "motion/react";
import { SplitText } from "@/components/motion/split-text";
import { MagneticButton } from "@/components/motion/magnetic";
import { TryDemoButton } from "./try-demo-button";
import { HeroScene } from "./hero-scene";

/**
 * Cinematic hero.
 * Layers, back to front:
 *   1. CSS radial-gradient universe (works always, prints too)
 *   2. WebGL scene (dynamic, opt-out under reduced-motion)
 *   3. Grain / vignette overlay
 *   4. Typographic centerpiece + CTAs
 *   5. Scroll cue (Lando Norris "vertical drive" nod)
 */
export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden">
      {/* CSS universe — always on */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_60%_40%_at_50%_35%,rgba(139,92,246,0.22),transparent_60%),radial-gradient(ellipse_50%_35%_at_20%_75%,rgba(66,133,244,0.14),transparent_60%),radial-gradient(ellipse_50%_35%_at_80%_75%,rgba(255,153,0,0.10),transparent_60%)]"
      />

      {/* WebGL scene */}
      <HeroScene />

      {/* Subtle noise / grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-32 text-center tablet:px-10">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur"
        >
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ai">
            {/* Ping renders unconditionally — the globals.css reduced-motion
                rule already neutralizes `animate-ping`'s duration, so no
                additional gate is needed and SSR/CSR stay identical. */}
            <span className="absolute inset-0 animate-ping rounded-full bg-ai motion-reduce:animate-none" />
          </span>
          Cloud Decision Intelligence · v0.1
        </motion.span>

        <h1 className="max-w-5xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.02em] tablet:text-7xl desktop:text-[8rem]">
          <SplitText text="Design cloud" />
          <br />
          <SplitText
            text="infrastructure alive."
            delay={0.35}
            className="bg-gradient-to-r from-ai via-gcp to-aws bg-clip-text text-transparent"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.2, 0, 0, 1] }}
          className="mt-8 max-w-2xl text-balance text-lg text-muted-foreground tablet:text-xl"
        >
          Drag AWS, Azure, and GCP services onto an infinite canvas. Watch
          architecture validate itself in real time. Export production-ready
          diagrams — without leaving the browser.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: [0.2, 0, 0, 1] }}
          className="mt-10 flex flex-col gap-3 tablet:flex-row"
        >
          <MagneticButton href="/signup" variant="primary">
            Start designing free
          </MagneticButton>
          <TryDemoButton />
          <MagneticButton href="/login" variant="ghost">
            Sign in
          </MagneticButton>
        </motion.div>

        {/* Scroll cue — Lando Norris "vertical drive" homage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span>Scroll to explore</span>
          <motion.div
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-muted-foreground to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
