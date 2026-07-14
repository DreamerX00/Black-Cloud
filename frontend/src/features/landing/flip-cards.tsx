"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * 3D flip cards — hover reveals the back face.
 *
 * Uses CSS `transform-style: preserve-3d` and `rotateY(180deg)`. GPU only,
 * no JS. `perspective` on the container gives the depth cue.
 */

const CARDS = [
  {
    front: "Every diagram is code.",
    back: "Terraform, CloudFormation, JSON — same source, three renderings.",
    accent: "#8B5CF6",
    tag: "Portability",
  },
  {
    front: "Every edge is checked.",
    back: "180+ rules trained on real production incidents. Errors before commits.",
    accent: "#22C55E",
    tag: "Safety",
  },
  {
    front: "Every service is a chip.",
    back: "AWS, Azure, GCP — same palette. 23 today, +2/fortnight.",
    accent: "#FF9900",
    tag: "Coverage",
  },
  {
    front: "Every review is a link.",
    back: "Snapshot a canvas, share the URL. Reviewers see it live, not a stale PNG.",
    accent: "#4285F4",
    tag: "Collaboration",
  },
];

export function FlipCards() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <header className="mb-14 max-w-3xl">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act XIII · Principles
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
            Four rules.{" "}
            <span className="italic text-muted-foreground">Hover to inspect.</span>
          </h2>
        </Reveal>
      </header>

      <div
        className="grid gap-4 tablet:grid-cols-4 tablet:gap-6"
        style={{ perspective: "1400px" }}
      >
        {CARDS.map((c, i) => (
          <motion.div
            key={c.front}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative h-72 [transform-style:preserve-3d]"
          >
            <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              {/* Front */}
              <div
                className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-border/60 bg-graphite/50 p-6 backdrop-blur [backface-visibility:hidden]"
                style={{ boxShadow: `inset 0 -3px 0 0 ${c.accent}` }}
              >
                <div
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: c.accent }}
                >
                  {c.tag}
                </div>
                <div className="font-display text-2xl font-semibold leading-snug tracking-tight tablet:text-3xl">
                  {c.front}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  hover →
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 flex flex-col justify-between rounded-2xl border p-6 backdrop-blur [backface-visibility:hidden] [transform:rotateY(180deg)]"
                style={{
                  borderColor: `${c.accent}66`,
                  background: `linear-gradient(135deg, ${c.accent}22, ${c.accent}08)`,
                }}
              >
                <div
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: c.accent }}
                >
                  Detail
                </div>
                <p className="text-lg text-ink">{c.back}</p>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  ← back
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
