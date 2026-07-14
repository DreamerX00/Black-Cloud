"use client";
import { motion, useReducedMotion } from "motion/react";
import { ParticleLogo } from "@/components/effects/particle-logo";
import { Meteors } from "@/components/effects/meteors";
import { SplitText } from "@/components/effects/split-text";

export default function Act0Boot() {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center text-center">
      {/* decorative meteor layer — low opacity so the 3D galaxy dominates */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Meteors count={14} />
      </div>

      <ParticleLogo text="BLACKCLOUD" />

      <SplitText
        text="A cinematic control plane for the multi-cloud era."
        as="p"
        className="mt-6 max-w-xl text-sm text-zinc-400 sm:text-base"
      />

      {/* animated scroll cue */}
      <motion.div
        className="mt-12 flex flex-col items-center gap-3"
        initial={reduced ? false : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p className="font-mono text-xs tracking-[0.3em] text-zinc-400">
          SCROLL TO DESCEND
        </p>
        <div className="flex h-9 w-6 justify-center rounded-full border border-white/25 pt-2">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-white/70"
            animate={reduced ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white/50"
          animate={reduced ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
