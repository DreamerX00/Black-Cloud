"use client";

// Cinematic hero scaffold shared by marketing pages. Mounts a bespoke per-page
// 3D scene (passed in, already dynamic/ssr:false), layers headline + CTA content
// over it, and shows a scroll cue. Initializes the render tier so SceneShell can
// fall back for reduced-motion / no-webgl.
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useTierInit } from "@/lib/use-tier-init";
import { TextReveal } from "@/components/effects/text-reveal";
import { cn } from "@/lib/utils";

export interface PageHeroProps {
  /** The 3D scene layer (fixed/absolute positioned SceneShell). */
  scene?: ReactNode;
  /** Small uppercase eyebrow above the headline. */
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** CTA buttons / links row. */
  actions?: ReactNode;
  /** Extra content below actions (badges, stats). */
  children?: ReactNode;
  /** Hide the animated scroll cue (e.g. app shells). */
  hideScrollCue?: boolean;
  className?: string;
}

export function PageHero({
  scene,
  eyebrow,
  title,
  subtitle,
  actions,
  children,
  hideScrollCue = false,
  className,
}: PageHeroProps) {
  useTierInit();
  const reduced = useReducedMotion();

  return (
    <section
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center",
        className,
      )}
    >
      {scene}
      {/* Readability scrim over the scene. */}
      <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        {eyebrow && (
          <motion.span
            initial={reduced ? undefined : { opacity: 0, y: 12 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground"
          >
            {eyebrow}
          </motion.span>
        )}

        <TextReveal>
          <h1 className="font-display text-balance text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            {title}
          </h1>
        </TextReveal>

        {subtitle && (
          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        )}

        {actions && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {actions}
          </motion.div>
        )}

        {children}
      </div>

      {!hideScrollCue && !reduced && (
        <motion.div
          aria-hidden
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-6" />
        </motion.div>
      )}
    </section>
  );
}
