"use client";

import { type ReactNode } from "react";
import { type TargetAndTransition, motion } from "motion/react";

type Variant = "fade-up" | "fade-left" | "fade-right" | "scale";

const variants: Record<Variant, { hidden: TargetAndTransition; visible: TargetAndTransition }> = {
  "fade-up":   { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
  "fade-left": { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  "fade-right":{ hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } },
  scale:       { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
};

interface SectionRevealProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  stagger?: number;
}

export function SectionReveal({
  children,
  variant = "fade-up",
  delay = 0,
  className,
  stagger,
}: SectionRevealProps) {
  const v = variants[variant];

  // ponytail: stagger handled via container variant + children wrapper
  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        variants={{ hidden: {}, visible: {} }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={v.hidden}
      whileInView={v.visible}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Wrap each child in a stagger container to inherit parent stagger timing */
export function RevealItem({
  children,
  className,
  variant = "fade-up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
}) {
  const v = variants[variant];
  return (
    <motion.div
      variants={{ hidden: v.hidden, visible: v.visible }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
