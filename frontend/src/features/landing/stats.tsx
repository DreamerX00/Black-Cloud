"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { PROVIDER_META } from "@/lib/nodes/registry";

/**
 * Stats strip — count-up numbers on scroll into view.
 * Numbers are cheap credibility markers; award sites use them as rhythm
 * beats between chapters. Count-up uses rAF and cancels correctly.
 */
export function Stats() {
  const totalNodes =
    PROVIDER_META.aws.count + PROVIDER_META.azure.count + PROVIDER_META.gcp.count;

  const items = [
    { value: totalNodes, suffix: "", label: "Cloud services" },
    { value: 3, suffix: "", label: "Providers" },
    { value: 100, suffix: "+", label: "Nodes per canvas" },
    { value: 60, suffix: "fps", label: "Interaction budget" },
  ];

  return (
    <section className="relative border-y border-border/40 bg-space/40">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-y-10 px-6 py-20 tablet:grid-cols-4 tablet:px-10 tablet:py-28">
        {items.map((item, i) => (
          <StatItem key={item.label} {...item} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}

function StatItem({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  // Initialize directly from `reduce` so we never setState-in-effect just to
  // "skip" the animation — the initial value IS the final value in that path.
  const [display, setDisplay] = useState(() => (reduce ? value : 0));

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutQuint
      const eased = 1 - Math.pow(1 - t, 5);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0, 0, 1] }}
      className="flex flex-col items-center text-center"
    >
      <div className="font-display text-5xl font-semibold tracking-tight tablet:text-6xl">
        <span className="bg-gradient-to-r from-ai via-gcp to-aws bg-clip-text text-transparent">
          {display}
        </span>
        <span className="text-muted-foreground/70">{suffix}</span>
      </div>
      <div className="mt-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
    </motion.div>
  );
}
