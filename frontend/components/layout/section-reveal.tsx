"use client";

// Scroll-triggered section wrapper: fades + rises into view once. Reduced-motion
// safe. Used to stitch marketing sections together with consistent choreography.
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function SectionReveal({
  children,
  className,
  delay = 0,
  as = "section",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "section" | "div" | "article";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial={reduced ? undefined : { opacity: 0, y: 40 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
