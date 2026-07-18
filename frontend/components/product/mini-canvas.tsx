"use client";

/**
 * Static mini-canvas preview used in product hero cards.
 * Real playground lives at /playground/[id]. This is a stylized loop.
 */
import { motion } from "motion/react";

export function MiniCanvas() {
  const nodes = [
    { x: 10, y: 25, l: "Route53", c: "bg-aws" },
    { x: 30, y: 18, l: "CloudFront", c: "bg-aws" },
    { x: 50, y: 30, l: "ALB", c: "bg-aws" },
    { x: 72, y: 22, l: "ECS", c: "bg-aws" },
    { x: 88, y: 55, l: "RDS", c: "bg-aws" },
    { x: 30, y: 65, l: "S3", c: "bg-gcp" },
    { x: 60, y: 70, l: "Redis", c: "bg-azure" },
  ];
  return (
    <div className="clay-inset relative aspect-[16/10] w-full overflow-hidden rounded-[24px] p-4">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mc-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.7" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {[
          "M 10 25 Q 20 20 30 18",
          "M 30 18 Q 40 22 50 30",
          "M 50 30 Q 60 24 72 22",
          "M 72 22 Q 80 40 88 55",
          "M 50 30 Q 40 50 30 65",
          "M 72 22 Q 65 45 60 70",
        ].map((d, i) => (
          <motion.path
            key={i} d={d} stroke="url(#mc-l)" strokeWidth="0.35" vectorEffect="non-scaling-stroke" fill="none"
            strokeDasharray="1 1"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.15 * i }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
          className="clay-sm absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-mono uppercase text-ink"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${n.c}`} />
          {n.l}
        </motion.div>
      ))}
      <div className="absolute right-3 top-3 clay-sm rounded-full px-2.5 py-1 text-[10px] font-mono uppercase text-success">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
        live · drift 0
      </div>
    </div>
  );
}
