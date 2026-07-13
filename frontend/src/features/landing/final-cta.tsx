"use client";

import { motion } from "motion/react";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";
import { MagneticButton } from "@/components/motion/magnetic";

/**
 * Closing CTA — the "call to arms" section that award-tier sites use to
 * end the scroll with a moment of gravity. Big display type, animated
 * gradient sweep, magnetic CTA.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      {/* Aurora gradient sweep */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-x-0 top-1/2 h-[60vh] -translate-y-1/2 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(139,92,246,0.35),rgba(66,133,244,0.25),rgba(255,153,0,0.2),rgba(139,92,246,0.35))] opacity-40 blur-3xl" />
      </motion.div>

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-40 text-center tablet:px-10 tablet:py-56">
        <Reveal>
          <span className="rounded-full border border-border/60 bg-graphite/40 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur">
            Ready to design
          </span>
        </Reveal>

        <h2 className="max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.02em] tablet:text-7xl desktop:text-[7rem]">
          <SplitText text="Your architecture," />
          <br />
          <SplitText
            text="visualized."
            delay={0.3}
            className="bg-gradient-to-r from-ai via-gcp to-aws bg-clip-text text-transparent"
          />
        </h2>

        <Reveal delay={0.2}>
          <p className="max-w-xl text-balance text-lg text-muted-foreground tablet:text-xl">
            Free during beta. No credit card. Every AWS, Azure, and GCP service
            for the MVP is a drag away.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col gap-3 tablet:flex-row">
            <MagneticButton href="/signup" variant="primary" strength={24}>
              Start designing free
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
