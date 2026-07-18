"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Animated circular Health Score dial. Ring stroke length animates
 * from 0 to `value` when it scrolls into view.
 */
export function HealthRing({
  value,
  label = "Health Score",
  size = 160,
  className,
}: {
  value: number;
  label?: string;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true });
  const progress = useMotionValue(0);
  const shown = useTransform(progress, l => Math.round(l));
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = useTransform(progress, p => `${(p / 100) * c} ${c}`);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(progress, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return () => ctrl.stop();
  }, [inView, value, progress]);

  const tone =
    value >= 85 ? "text-success" :
    value >= 70 ? "text-ai" :
    value >= 55 ? "text-warn" : "text-danger";

  return (
    <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="hr-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="0.5" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} stroke="rgba(255,255,255,0.06)" fill="none" />
        <motion.circle
          cx={size/2}
          cy={size/2}
          r={r}
          strokeWidth={stroke}
          stroke="url(#hr-g)"
          fill="none"
          strokeLinecap="round"
          style={{ strokeDasharray: dash }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className={cn("font-display text-4xl font-semibold", tone)}>{shown}</motion.span>
        <span className="text-mono-caps text-ink-mute">{label}</span>
      </div>
    </div>
  );
}
