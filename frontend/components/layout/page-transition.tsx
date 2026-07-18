"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Wraps page content with a smooth fade-up entrance animation.
 * Use in page components for consistent transitions across the site.
 */
export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
