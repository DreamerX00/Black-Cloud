"use client";

/**
 * Client-only motion wrappers used by the /docs page.
 *
 * The docs page itself is a Server Component (exports `metadata`), so it
 * cannot render `motion.*` directly. These tiny wrappers isolate the
 * client boundary to just the animated leaves.
 */

import { motion, SPRING, DURATION } from "@/components/motion/primitives";
import type { ReactNode } from "react";

export function HoverScale({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      transition={SPRING.snappy}
    >
      {children}
    </motion.div>
  );
}

export function PulseHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.h2
      className={className}
      whileInView={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.h2>
  );
}

export function HoverLift({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.li
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: DURATION.interaction }}
    >
      {children}
    </motion.li>
  );
}
