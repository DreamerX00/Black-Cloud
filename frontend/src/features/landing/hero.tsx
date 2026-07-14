"use client";

import { motion, useReducedMotion } from "motion/react";
import { SplitText } from "@/components/motion/split-text";
import { MagneticButton } from "@/components/motion/magnetic";
import { TryDemoButton } from "./try-demo-button";
import { HeroScene } from "./hero-scene";
import { PROVIDER_META } from "@/lib/nodes/registry";

/**
 * Cinematic hero — Act I.
 *
 * Layers, back to front:
 *   -30  Universe gradient (radial, works with print + reduced motion)
 *   -20  WebGL scene (R3F starfield + network — dynamic, gated on RM)
 *   -10  Grain / vignette overlay
 *    0   Content stack:
 *         · status pill with region rotation
 *         · display headline w/ SplitText per word
 *         · lede
 *         · triad of CTAs (primary / demo / ghost) + ⌘K hint
 *         · ticker ribbon of provider counts
 *         · scroll cue
 *
 * The ticker is a new addition — it makes the vertical space between the
 * headline and the fold feel intentional rather than empty, and doubles as
 * a hint about the marquee below.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const total =
    PROVIDER_META.aws.count + PROVIDER_META.azure.count + PROVIDER_META.gcp.count;

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden">
      {/* CSS universe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(ellipse_60%_40%_at_50%_35%,rgba(139,92,246,0.24),transparent_60%),radial-gradient(ellipse_50%_35%_at_20%_75%,rgba(66,133,244,0.16),transparent_60%),radial-gradient(ellipse_50%_35%_at_80%_75%,rgba(255,153,0,0.12),transparent_60%)]"
      />

      {/* Corner frame — reads as "you're looking through a viewport at the product" */}
      <div aria-hidden className="pointer-events-none absolute inset-6 -z-10 hidden tablet:block">
        <span className="absolute left-0 top-0 h-6 w-6 border-l border-t border-border/40" />
        <span className="absolute right-0 top-0 h-6 w-6 border-r border-t border-border/40" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-border/40" />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-border/40" />
      </div>

      {/* WebGL */}
      <HeroScene />

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-32 text-center tablet:px-10">
        {/* Status pill */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur"
        >
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success">
            <span className="absolute inset-0 animate-ping rounded-full bg-success motion-reduce:animate-none" />
          </span>
          Cloud Decision Intelligence · Beta live
        </motion.span>

        {/* Headline — sizes chosen so "infrastructure alive." always fits
             within the max-w-5xl column at every breakpoint. */}
        <h1 className="max-w-5xl font-display text-[3rem] font-semibold leading-[0.98] tracking-[-0.03em] tablet:text-7xl desktop:text-[6.5rem]">
          <SplitText text="Design cloud" />
          <br />
          <span className="relative inline-block">
            <SplitText
              text="infrastructure alive."
              delay={0.35}
              className="bg-gradient-to-r from-ai via-gcp to-aws bg-clip-text text-transparent"
            />
            {/* Sub-underline sweeps in after the split reveal completes. */}
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1.3, ease: [0.2, 0, 0, 1] }}
              className="absolute -bottom-2 left-0 right-0 h-px origin-left bg-gradient-to-r from-ai via-gcp to-aws"
            />
          </span>
        </h1>

        {/* Lede */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.2, 0, 0, 1] }}
          className="mt-10 max-w-2xl text-balance text-lg text-muted-foreground tablet:text-xl"
        >
          Drag AWS, Azure, and GCP services onto an infinite canvas. Watch
          architecture validate itself in real time. Export Terraform —
          without leaving the browser.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: [0.2, 0, 0, 1] }}
          className="mt-12 flex flex-col items-center gap-3 tablet:flex-row"
        >
          <MagneticButton href="/signup" variant="primary">
            Start designing free
          </MagneticButton>
          <TryDemoButton />
          <MagneticButton href="/login" variant="ghost">
            Sign in
          </MagneticButton>
        </motion.div>

        {/* ⌘K hint — draws the eye to the command palette showcase further down */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span>Or press</span>
          <kbd className="inline-flex h-6 items-center gap-1 rounded-md border border-border/60 bg-graphite/50 px-2 font-mono text-[10px] tracking-normal">
            ⌘K
          </kbd>
          <span>to search 23 services</span>
        </motion.div>

        {/* Ticker ribbon — provider counts as a live-looking data strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/50 bg-border/40 backdrop-blur tablet:grid-cols-4"
        >
          <TickerCell k={`${PROVIDER_META.aws.count}`} v="AWS" color="var(--bc-aws)" />
          <TickerCell k={`${PROVIDER_META.azure.count}`} v="Azure" color="var(--bc-azure)" />
          <TickerCell k={`${PROVIDER_META.gcp.count}`} v="GCP" color="var(--bc-gcp)" />
          <TickerCell k={`${total}`} v="Total services" color="var(--bc-ai)" highlight />
        </motion.div>

        {/* Scroll cue — hidden below desktop to avoid ticker collision */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground desktop:flex"
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

function TickerCell({
  k,
  v,
  color,
  highlight,
}: {
  k: string;
  v: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center bg-background/70 px-4 py-4 backdrop-blur"
      style={highlight ? { boxShadow: `inset 0 -2px 0 0 ${color}` } : undefined}
    >
      <div className="font-display text-3xl font-semibold tracking-tight" style={{ color }}>
        {k}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {v}
      </div>
    </div>
  );
}
