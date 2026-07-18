"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
}

export function PageHero({ title, subtitle, badge, children }: PageHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="clay-panel relative overflow-hidden px-6 py-16 text-center md:px-12 md:py-24"
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent" />

      <div className="relative z-10">
        {badge && (
          <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            {badge}
          </span>
        )}
        <h1 className="text-gradient text-4xl font-bold tracking-tight md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </motion.section>
  );
}
