"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// easeOutCubic — decelerating so the count-up settles into the target.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animates 0 -> target over ~1.2s with rAF; clamps to target (never overshoots). */
function useCountUp(target: number, run: boolean, reduced: boolean | null) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Reduced motion / not yet in view → show final value, no animation.
    if (reduced || !run) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1); // clamp progress
      setValue(Math.min(Math.round(easeOut(progress) * target), target)); // never overshoot
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, reduced]);

  // Derive final value for reduced-motion instead of setState-in-effect.
  return reduced ? target : value;
}

type Stat = { target: number; display?: string; label: string };

const STATS: Stat[] = [
  { target: 23, label: "cloud services" },
  { target: 3, label: "cloud providers" },
  { target: 3, label: "live validation rules" },
  { target: 0, display: "1-click", label: "export" },
];

function StatItem({ stat, run, reduced }: { stat: Stat; run: boolean; reduced: boolean | null }) {
  const count = useCountUp(stat.target, run, reduced);
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-display text-5xl font-bold text-primary sm:text-6xl">
        {stat.display ?? count}
      </span>
      <span className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-muted">
        {stat.label}
      </span>
    </div>
  );
}

export function StatsBand() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-border bg-deep-space/40 py-20">
      <div
        ref={ref}
        className={cn(
          "mx-auto grid max-w-7xl grid-cols-2 gap-y-12 gap-x-6 px-6 lg:grid-cols-4"
        )}
      >
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} run={inView} reduced={reduced} />
        ))}
      </div>
    </section>
  );
}
