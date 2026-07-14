"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * Case studies — three long-form cards.
 *
 * Bigger commitment than the pull-quote testimonials. Each card carries a
 * headline metric, a mini architecture snapshot (SVG), and a paragraph.
 * These read as *stories*, not blurbs.
 */

interface Study {
  company: string;
  logo: string;
  headline: string;
  metric: { value: string; label: string };
  body: string;
  accent: string;
}

const STUDIES: Study[] = [
  {
    company: "Latitude Health",
    logo: "LH",
    headline: "Cut architecture reviews from 3 days to 90 minutes.",
    metric: { value: "48×", label: "faster review" },
    body:
      "By replacing hand-drawn Miro boards with BlackCloud canvases, the platform team ran reviews inside the tool. Every reviewer opened the same live graph — comments landed on nodes, not screenshots.",
    accent: "#22C55E",
  },
  {
    company: "Meridian Retail",
    logo: "MR",
    headline: "Caught $28k/mo in cross-AZ traffic before it shipped.",
    metric: { value: "$28k", label: "saved / month" },
    body:
      "The validator flagged three RDS reads-from-cross-AZ paths during a routine canvas review. All three were merged bugs in staging — production would have made the bill visible only two weeks later.",
    accent: "#FF9900",
  },
  {
    company: "Northwind Data",
    logo: "ND",
    headline: "Onboarded 12 juniors on the same live canvas.",
    metric: { value: "12", label: "onboarded / week" },
    body:
      "The staff engineers open a real prod-shape canvas and walk through it. Everyone sees the same graph, the same colored capabilities, the same validator messages. First PR on day two.",
    accent: "#8B5CF6",
  },
];

export function CaseStudies() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <header className="mb-14 flex items-end justify-between gap-6">
        <div>
          <Reveal>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Act XVII · In the wild
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
              Real teams. Real diagrams. Real numbers.
            </h2>
          </Reveal>
        </div>
      </header>

      <div className="grid gap-4 tablet:grid-cols-3 tablet:gap-6">
        {STUDIES.map((s, i) => (
          <motion.article
            key={s.company}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-graphite/40 p-6 backdrop-blur"
            style={{ boxShadow: `0 40px 120px -30px ${s.accent}22` }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
              style={{ background: s.accent }}
            />

            <div className="relative z-10 flex items-center gap-3">
              <div
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-md font-mono text-xs font-semibold"
                style={{ backgroundColor: `${s.accent}22`, color: s.accent }}
              >
                {s.logo}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.company}
              </div>
            </div>

            <MiniArchViz accent={s.accent} />

            <div className="relative z-10">
              <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight tablet:text-3xl">
                {s.headline}
              </h3>
              <div className="mt-4 flex items-baseline gap-3 border-y border-border/40 py-3">
                <span
                  className="font-display text-4xl font-semibold"
                  style={{ color: s.accent }}
                >
                  {s.metric.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {s.metric.label}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function MiniArchViz({ accent }: { accent: string }) {
  return (
    <div className="relative my-6 h-24 overflow-hidden rounded-lg border border-border/40 bg-void/50">
      <svg viewBox="0 0 200 80" className="h-full w-full">
        <line x1="20" y1="40" x2="90" y2="40" stroke={accent} strokeWidth="1.5" opacity="0.7" />
        <line x1="90" y1="40" x2="160" y2="20" stroke={accent} strokeWidth="1.5" opacity="0.7" />
        <line x1="90" y1="40" x2="160" y2="60" stroke={accent} strokeWidth="1.5" opacity="0.5" />
        {[
          { x: 20, y: 40 },
          { x: 90, y: 40 },
          { x: 160, y: 20 },
          { x: 160, y: 60 },
        ].map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={8}
            fill="#161B22"
            stroke={accent}
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  );
}
