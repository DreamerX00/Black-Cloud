"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * Horizontal scroll gallery — the Awwwards "pin & pan" signature.
 *
 * Outer <section> is 4× viewport tall. Inner sticky container holds a
 * horizontal strip of panels. As the user scrolls vertically, the strip
 * translates horizontally, giving the impression of a curated art walk.
 *
 * Motion pauses if reduced-motion is set — panels stack normally instead.
 */

const PANELS = [
  {
    tag: "01 · Canvas",
    title: "An infinite plane.",
    body: "Pan for kilometres. Zoom to a chip's serial number. The canvas never asks you to save.",
    color: "#8B5CF6",
    stat: "∞",
    unit: "meters",
  },
  {
    tag: "02 · Palette",
    title: "23 services, sub-100ms search.",
    body: "Every service across three providers, indexed by tag, capability, and shape.",
    color: "#4285F4",
    stat: "23",
    unit: "services",
  },
  {
    tag: "03 · Rules",
    title: "12 years of incidents, encoded.",
    body: "Validators trained on the ways real production breaks. If your graph would break, we catch it.",
    color: "#22C55E",
    stat: "180+",
    unit: "rules",
  },
  {
    tag: "04 · Copilot",
    title: "Ask, don't hunt.",
    body: "Natural-language edits: “move this behind an ALB,” “add a NAT for the private subnet.”",
    color: "#FF9900",
    stat: "3s",
    unit: "avg reply",
  },
  {
    tag: "05 · Export",
    title: "Terraform out. Terraform in.",
    body: "Round-trip HCL, CloudFormation, or portable JSON. No lock-in, ever.",
    color: "#F59E0B",
    stat: "0%",
    unit: "lock-in",
  },
];

export function HorizontalGallery() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Translate 0 → -80% across scroll progress. -80% not -100% so the last
  // card doesn't slam past the right edge.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  if (reduce) {
    return (
      <section className="mx-auto w-full max-w-6xl space-y-6 px-6 py-24 tablet:px-10">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act VI · Gallery
          </div>
        </Reveal>
        {PANELS.map((p) => (
          <Panel key={p.tag} panel={p} />
        ))}
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 tablet:px-10">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <Reveal>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Act VI · Gallery
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
                  Five moves.{" "}
                  <span className="italic text-muted-foreground">One canvas.</span>
                </h2>
              </Reveal>
            </div>
            <div className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground tablet:block">
              scroll ↓ · pan →
            </div>
          </div>
        </div>

        <motion.div style={{ x }} className="flex gap-6 pl-6 tablet:pl-10">
          {PANELS.map((p) => (
            <Panel key={p.tag} panel={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Panel({ panel }: { panel: (typeof PANELS)[number] }) {
  return (
    <article
      className="relative flex h-[70vh] w-[85vw] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-graphite/50 p-8 backdrop-blur tablet:w-[65vw] desktop:w-[52vw]"
      style={{
        boxShadow: `0 40px 120px -30px ${panel.color}55`,
      }}
    >
      {/* Number wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-6 font-display text-[24rem] font-semibold leading-none tracking-tighter"
        style={{ color: `${panel.color}12` }}
      >
        {panel.stat}
      </div>

      {/* Accent orb */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: panel.color }}
        animate={{ rotate: 360, y: [0, 8, 0] }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity },
        }}
      />

      <header className="relative z-10 flex items-center justify-between">
        <div
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: panel.color }}
        >
          {panel.tag}
        </div>
        <span className="rounded-full border border-border/50 bg-void/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {panel.unit}
        </span>
      </header>

      <div className="relative z-10 max-w-xl">
        <h3 className="font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl desktop:text-7xl">
          {panel.title}
        </h3>
        <p className="mt-6 text-lg text-muted-foreground tablet:text-xl">
          {panel.body}
        </p>
      </div>
    </article>
  );
}
