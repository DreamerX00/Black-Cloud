"use client";

import { motion } from "motion/react";
import { MousePointer2, ShieldCheck, Download, type LucideIcon } from "lucide-react";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS: { n: string; Icon: LucideIcon; title: string; desc: string }[] = [
  {
    n: "01",
    Icon: MousePointer2,
    title: "Draw",
    desc: "Drag any service from AWS, Azure, or GCP onto an infinite canvas and wire them together.",
  },
  {
    n: "02",
    Icon: ShieldCheck,
    title: "Validate",
    desc: "Edges are checked live. Invalid connections light up red with a concrete fix.",
  },
  {
    n: "03",
    Icon: Download,
    title: "Export",
    desc: "Ship the whole architecture as clean JSON with a single click.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">How it works</p>
        <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          Three steps to a validated cloud.
        </h2>
      </motion.div>

      <div className="relative mt-16 md:mt-20">
        {/* connecting line on md+ */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-8 hidden h-px bg-border md:block"
        />

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {STEPS.map(({ n, Icon, title, desc }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.12 }}
              className="relative flex flex-col"
            >
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "grid size-16 shrink-0 place-items-center rounded-2xl border border-border bg-deep-space",
                    "text-primary",
                  )}
                >
                  <Icon className="size-7" />
                </span>
                <span className="font-mono text-5xl font-bold text-fg-subtle">{n}</span>
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold">{title}</h3>

              <ScrollReveal
                baseOpacity={0.1}
                enableBlur
                blurStrength={4}
                containerClassName="mt-3"
                textClassName="text-base text-fg-muted"
              >
                {desc}
              </ScrollReveal>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
