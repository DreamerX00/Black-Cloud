"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

/**
 * Wraps children in a scroll-triggered reveal. Uses viewport once so
 * hard scrolling doesn't retrigger.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "li";
}) {
  const variants: Variants = {
    hidden: { y, opacity: 0, filter: "blur(6px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, delay, ease: ease.outExpo },
    },
  };
  const MotionTag =
    Tag === "span" ? motion.span : Tag === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
