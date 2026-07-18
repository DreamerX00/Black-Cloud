"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Big number that counts up when it scrolls into view.
 */
export function Stat({
  value,
  suffix,
  label,
  hint,
  tone = "ink",
  className,
}: {
  value: number;
  suffix?: string;
  label: string;
  hint?: string;
  tone?: "ink" | "ai" | "aws" | "azure" | "gcp" | "info" | "success" | "danger";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, value, count]);

  const toneClass = {
    ink: "text-ink",
    ai: "text-ai",
    aws: "text-aws",
    azure: "text-azure",
    gcp: "text-gcp",
    info: "text-info",
    success: "text-success",
    danger: "text-danger",
  }[tone];

  return (
    <div ref={ref} className={cn("flex flex-col items-center gap-1 text-center", className)}>
      <div className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
        <motion.span className={toneClass}>{rounded}</motion.span>
        {suffix && <span className="ml-1 text-ink-mute">{suffix}</span>}
      </div>
      <div className="text-mono-caps text-ink-mute">{label}</div>
      {hint && <div className="text-xs text-ink-mute/80">{hint}</div>}
    </div>
  );
}
