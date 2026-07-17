"use client";

import {
  motion,
  MotionConfig,
  useReducedMotion,
  type Transition,
  type Variants,
  type HTMLMotionProps,
} from "motion/react";
import type { ReactNode } from "react";

/**
 * BlackCloud Motion primitives.
 * All animated components in the app MUST import from here, not raw
 * `motion/react`. This gives us one place to:
 *   1. Enforce DESIGN_SYSTEM.md motion durations
 *   2. Respect `prefers-reduced-motion` uniformly
 *   3. Swap `motion` for something else without touching consumers
 */

// ── Durations (seconds — motion/react convention) ──────────────────────────
export const DURATION = {
  interaction: 0.2,   // 150–250ms
  structural: 0.45,   // 300–600ms
  navigation: 0.8,    // 500–1200ms
  cinematic: 1.4,     // 1000ms+
} as const;

// ── Easing curves (match globals.css) ──────────────────────────────────────
export const EASE = {
  emphasized: [0.2, 0, 0, 1] as const,
  standard: [0.4, 0, 0.2, 1] as const,
} as const;

// ── Spring presets ─────────────────────────────────────────────────────────
export const SPRING = {
  snappy: { type: "spring", stiffness: 500, damping: 40 } as Transition,
  gentle: { type: "spring", stiffness: 260, damping: 26 } as Transition,
  floppy: { type: "spring", stiffness: 140, damping: 18 } as Transition,
} as const;

// ── Common variants ────────────────────────────────────────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.structural, ease: EASE.emphasized },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.interaction, ease: EASE.standard },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: SPRING.gentle,
  },
};

export const staggerChildren = (delay = 0.06): Variants => ({
  visible: { transition: { staggerChildren: delay } },
});

/**
 * App-wide MotionConfig — sets a default reduced-motion policy.
 * Wrap children (usually the RootLayout body) so any nested `motion.*`
 * inherits reduced-motion behavior without opting-in per component.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE.standard }}>
      {children}
    </MotionConfig>
  );
}

// ── `<Motion.*>` wrappers that already know DESIGN_SYSTEM defaults ─────────
type DivProps = HTMLMotionProps<"div">;

/**
 * Standard page-in transition. Use on route root elements.
 * Falls back to plain div when the user prefers reduced motion.
 */
export function FadeInUp({ children, ...props }: DivProps & { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered list container — pair with <motion.li variants={fadeInUp}>.
 */
export function Stagger({
  children,
  delay = 0.06,
  ...props
}: DivProps & { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerChildren(delay)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem — child slot for <Stagger>. Uses fadeInUp variants by default.
 * A no-op passthrough when reduced motion is on, so semantics stay identical.
 */
export function StaggerItem({
  children,
  ...props
}: DivProps & { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  return (
    <motion.div variants={fadeInUp} {...props}>
      {children}
    </motion.div>
  );
}

// Re-export `motion` for one-off cases where the primitives above don't fit.
// Consumers should still respect `useReducedMotion` themselves.
export { motion, useReducedMotion };
