"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Magnetic button — the CTA move Awwwards sites universally use.
 *
 * Pointer within ~120px pulls the button toward the cursor with a spring,
 * scale bumps 3%, and an inner label lags behind for the classic "elastic"
 * feel. Optional gradient-sweep overlay on hover.
 *
 * Renders as <Link> when `href` is given, otherwise <button>.
 */

interface Props {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  onClick?: () => void;
  /** Max px the button can drift from its rest position. */
  strength?: number;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  href,
  variant = "primary",
  className,
  onClick,
  strength = 18,
  ariaLabel,
}: Props) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 300, damping: 20, mass: 0.35 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  // Inner label drifts LESS than the button — the "lag" that reads as physical.
  const lx = useSpring(x, { stiffness: 240, damping: 20, mass: 0.5 });
  const ly = useSpring(y, { stiffness: 240, damping: 20, mass: 0.5 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const midY = rect.top + rect.height / 2;
    const dx = e.clientX - midX;
    const dy = e.clientY - midY;
    // Clamp to strength radius — beyond that, the pull is capped.
    const dist = Math.hypot(dx, dy);
    const max = strength * 1.5;
    const factor = Math.min(1, max / (dist || 1));
    x.set(dx * factor * 0.35);
    y.set(dy * factor * 0.35);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-7 font-medium transition-[transform,opacity] active:scale-[0.98]";
  const styles: Record<NonNullable<Props["variant"]>, string> = {
    primary: "bg-primary text-primary-foreground",
    outline:
      "border border-border/60 bg-graphite/40 text-foreground backdrop-blur hover:bg-graphite",
    ghost: "text-foreground hover:bg-graphite/40",
  };

  const inner = (
    <motion.span
      style={{ x: reduce ? 0 : lx, y: reduce ? 0 : ly }}
      className="pointer-events-none relative z-10 flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  // Sweep + noise decoration for primary variant.
  const decoration = variant === "primary" && (
    <>
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-ai via-gcp to-aws opacity-90 transition-transform duration-700 group-hover:translate-x-0"
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-md ring-1 ring-inset ring-white/10"
      />
    </>
  );

  const button = (
    <motion.div
      ref={wrapRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x: reduce ? 0 : sx, y: reduce ? 0 : sy }}
      className={cn("group relative inline-block", className)}
      data-magnetic
    >
      {href ? (
        <Link
          href={href}
          onClick={onClick}
          aria-label={ariaLabel}
          className={cn(base, styles[variant])}
        >
          {decoration}
          {inner}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          className={cn(base, styles[variant])}
        >
          {decoration}
          {inner}
        </button>
      )}
    </motion.div>
  );

  return button;
}
