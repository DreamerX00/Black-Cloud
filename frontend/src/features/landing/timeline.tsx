"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * Timeline — scroll-driven "how it works" act.
 *
 * Sticky left rail with 5 numbered steps and a progress bar. Right column
 * is a stack of full-height panels; as the user scrolls, the active step
 * highlights in the rail via useScroll fractions.
 *
 * The pattern is Apple's product-page choreography: rail stays, content
 * rolls.
 */

const STEPS = [
  {
    n: 1,
    title: "Drag any service.",
    body: "Grab an AWS Lambda, an Azure Function, a GCP Cloud Run — from the same palette. Snap it onto the canvas.",
    accent: "#8B5CF6",
  },
  {
    n: 2,
    title: "Draw the edges.",
    body: "Connect what you need. Every edge is checked in real time — the wire lights up green when it's valid, red when it isn't.",
    accent: "#4285F4",
  },
  {
    n: 3,
    title: "Read the note.",
    body: "The validator explains why. \"EC2 → S3 leaves the VPC. Add a Gateway Endpoint.\" You learn as you draw.",
    accent: "#22C55E",
  },
  {
    n: 4,
    title: "Ask the copilot.",
    body: "\"Move this behind an ALB.\" The copilot redraws — and shows you what changed. You approve the diff.",
    accent: "#FF9900",
  },
  {
    n: 5,
    title: "Export or ship.",
    body: "Terraform. CloudFormation. JSON. PNG. SVG. One click — the diagram is the source.",
    accent: "#F59E0B",
  },
];

export function Timeline() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Rail progress bar height maps 0→100%.
  const railH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <header className="mb-16 max-w-3xl">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act XII · How it works
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
            Five steps.{" "}
            <span className="italic text-muted-foreground">Zero setup.</span>
          </h2>
        </Reveal>
      </header>

      <div className="grid gap-8 tablet:grid-cols-[220px_1fr] tablet:gap-14">
        {/* Sticky rail */}
        <aside className="relative tablet:sticky tablet:top-24 tablet:h-fit">
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border/40" />
            <motion.div
              style={{ height: railH }}
              className="absolute left-3 top-0 w-px bg-gradient-to-b from-ai via-gcp to-aws"
            />
            <ul className="flex flex-row gap-6 overflow-x-auto tablet:flex-col tablet:gap-8 tablet:overflow-visible">
              {STEPS.map((s, i) => (
                <RailItem key={s.n} step={s} index={i} total={STEPS.length} progress={scrollYProgress} />
              ))}
            </ul>
          </div>
        </aside>

        {/* Content panels */}
        <div className="flex flex-col gap-24 tablet:gap-40">
          {STEPS.map((s) => (
            <motion.article
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-graphite/40 p-8 backdrop-blur tablet:p-12"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
                style={{ background: s.accent }}
              />
              <div
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: s.accent }}
              >
                Step {s.n}
              </div>
              <h3 className="mt-3 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.02em] tablet:text-5xl">
                {s.title}
              </h3>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">{s.body}</p>

              {/* Big number wash */}
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -right-2 font-display text-[14rem] font-semibold leading-none tracking-tighter"
                style={{ color: `${s.accent}18` }}
              >
                {s.n}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RailItem({
  step,
  index,
  total,
  progress,
}: {
  step: (typeof STEPS)[number];
  index: number;
  total: number;
  progress: import("motion/react").MotionValue<number>;
}) {
  // Each step "activates" once scroll passes its threshold.
  // Web Animations' `animate()` requires monotonically non-decreasing
  // keyframe offsets in [0,1]; clamp both ends and nudge them apart so
  // even the first (threshold=0) and last (threshold=1) items produce a
  // valid range instead of `[-0.05, 0.05]` or `[0.95, 1.05]`.
  const threshold = index / total;
  const lo = Math.max(0, Math.min(1, threshold - 0.05));
  const hi = Math.max(lo + 0.001, Math.min(1, threshold + 0.05));
  const opacity = useTransform(progress, [lo, hi], [0.4, 1]);

  return (
    <motion.li style={{ opacity }} className="relative flex items-center gap-3 pl-8">
      <span
        className="absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 bg-void"
        style={{ borderColor: step.accent }}
      />
      <div>
        <div
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: step.accent }}
        >
          Step {step.n}
        </div>
        <div className="text-sm text-ink">{step.title}</div>
      </div>
    </motion.li>
  );
}
