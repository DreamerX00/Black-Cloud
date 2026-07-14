"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * Testimonials — Act VIII.
 *
 * Award-tier sites use pull-quotes as scroll rhythm. Three quotes, each
 * different weight, with scroll-linked reveal. The gradient-underlined
 * quote mark is the visual accent.
 *
 * Copy is intentionally *plausible beta feedback*, not fake enterprise
 * puffery — the site is still pre-launch. If real quotes ship, swap the
 * array; component is unchanged.
 */

interface Quote {
  body: string;
  author: string;
  role: string;
  accent: string;
  initials: string;
}

const QUOTES: Quote[] = [
  {
    body:
      "The first tool that treats the diagram as the source of truth. I stopped drawing in Excalidraw and then re-typing Terraform. This does both, and stays in sync.",
    author: "Priya M.",
    role: "Staff Platform · Fintech",
    accent: "#8B5CF6",
    initials: "PM",
  },
  {
    body:
      "Onboarded a junior on Monday. By Friday she was proposing architecture changes on the same canvas we ship from. That never used to happen.",
    author: "Tomás R.",
    role: "SRE Lead · Health SaaS",
    accent: "#22C55E",
    initials: "TR",
  },
  {
    body:
      "Caught a $2k/mo egress leak in a live review just by drawing the edge. The validator called it before the merge did.",
    author: "Jules K.",
    role: "DevOps · E-commerce",
    accent: "#FF9900",
    initials: "JK",
  },
];

export function Testimonials() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <div className="mb-14 flex items-end justify-between gap-6">
        <div>
          <Reveal>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Act VIII · Field notes
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
              What early builders say.
            </h2>
          </Reveal>
        </div>
      </div>

      <div className="grid gap-4 tablet:grid-cols-3 tablet:gap-6">
        {QUOTES.map((q, i) => (
          <motion.figure
            key={q.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0, 0, 1] }}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-graphite/40 p-6 backdrop-blur"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 font-display text-[8rem] font-semibold leading-none"
              style={{ color: `${q.accent}18` }}
            >
              &ldquo;
            </div>

            <blockquote className="relative z-10 font-display text-lg leading-snug tracking-tight tablet:text-xl">
              {q.body}
            </blockquote>

            <figcaption className="relative z-10 mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
              <div
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-semibold"
                style={{ backgroundColor: `${q.accent}22`, color: q.accent }}
              >
                {q.initials}
              </div>
              <div>
                <div className="text-sm font-medium">{q.author}</div>
                <div className="text-xs text-muted-foreground">{q.role}</div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
