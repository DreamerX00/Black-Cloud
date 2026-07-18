"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BlackCloudMark } from "@/components/brand/mark";

const HIGHLIGHTS = [
  { title: "One graph", body: "Design, cost, migrate, simulate — same data model." },
  { title: "Council of five", body: "AI recommendations you can watch negotiate." },
  { title: "Value-based lock-in only", body: "Export everything, always. No hostage-holding." },
];

export function AuthShell({ eyebrow, title, subtitle, children, side = "right" }: {
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  children: ReactNode;
  side?: "left" | "right";
}) {
  return (
    <div className="relative min-h-[100dvh]">
      <div className="section-shell mx-auto grid min-h-[100dvh] max-w-[1400px] items-center gap-16 !pt-32 lg:grid-cols-2">
        <div className={side === "right" ? "" : "order-2"}>
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <BlackCloudMark className="h-8 w-8" />
            <span className="font-display text-2xl font-semibold tracking-tight">BlackCloud</span>
          </Link>
          <div className="text-mono-caps text-ai">{eyebrow}</div>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-lg text-lg text-ink-dim">{subtitle}</p>
          <div className="mt-10 flex flex-col gap-3">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="clay-sm flex items-start gap-3 p-4"
              >
                <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-ai animate-pulse-slow" />
                <div>
                  <div className="text-sm font-medium text-ink">{h.title}</div>
                  <div className="text-xs text-ink-mute">{h.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={side === "right" ? "" : "order-1"}
        >
          <div className="clay-lg relative overflow-hidden p-8 md:p-10">
            <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-30" />
            <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
            <div className="relative">{children}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
