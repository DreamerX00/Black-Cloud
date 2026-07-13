"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE } from "./primitives";

/**
 * Scroll-reveal primitive.
 * Fires exactly once (viewport once:true) — Apple/Stripe pattern where sections
 * unfold as you scroll but don't re-animate on scroll back up.
 * Falls back to a plain block under prefers-reduced-motion.
 */
const V: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE.emphasized },
  },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof typeof motion;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const Component = motion[Tag] as typeof motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={V}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Component>
  );
}
