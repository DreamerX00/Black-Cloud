"use client";

import { motion } from "motion/react";

/**
 * Tiny inline sparkline for project cards. Pure SVG. Values 0..max.
 */
export function Sparkline({ values, tone = "ai", height = 32 }: {
  values: number[];
  tone?: "ai" | "success" | "aws" | "info";
  height?: number;
}) {
  const max = Math.max(1, ...values);
  const step = 100 / (values.length - 1);
  const points = values.map((v, i) => `${i * step},${100 - (v / max) * 100}`).join(" ");
  const stroke = { ai: "#8b5cf6", success: "#22c55e", aws: "#ff9900", info: "#38bdf8" }[tone];

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height={height} className="block">
      <defs>
        <linearGradient id={`spg-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stroke} stopOpacity="0.4" />
          <stop offset="1" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#spg-${tone})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />
    </svg>
  );
}
