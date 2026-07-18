"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Thin nebula bar pinned to the top — reflects vertical scroll progress.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scale = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[100] h-[2px] w-full origin-left bg-gradient-to-r from-ai via-info to-aws"
      style={{ scaleX: scale }}
    />
  );
}
