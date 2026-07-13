"use client";

import Link from "next/link";
import { motion } from "motion/react";
import SplitText from "@/components/reactbits/SplitText";
import ShinyText from "@/components/reactbits/ShinyText";
import GradientText from "@/components/reactbits/GradientText";
import RotatingText from "@/components/reactbits/RotatingText";
import ScrollVelocity from "@/components/reactbits/ScrollVelocity";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import Magnet from "@/components/reactbits/Magnet";
import StarBorder from "@/components/reactbits/StarBorder";

/**
 * Maximalist scroll-synced content over the WebGL layers.
 * Uses React Bits text/interaction effects (SplitText, RotatingText, ShinyText,
 * ScrollVelocity marquee, ScrollReveal, Magnet + StarBorder CTAs).
 */

const beats = [
  {
    kicker: "Validation engine",
    title: "Catch mistakes before they ship.",
    body: "Wire a load balancer straight into a database and BlackCloud flags it instantly — then shows you the fix. Architecture review, live, as you draw.",
  },
  {
    kicker: "Multi-cloud, one canvas",
    title: "AWS. Azure. GCP. One surface.",
    body: "Drag any service from any provider onto an infinite canvas. Connect them. Watch data flow. Export the whole thing as JSON in a click.",
  },
];

export function Overlay() {
  return (
    <div className="relative z-10">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6"
        >
          <ShinyText
            text="CLOUD ARCHITECTURE, REIMAGINED"
            speed={4}
            className="font-mono text-xs uppercase tracking-[0.5em]"
          />
        </motion.div>

        <SplitText
          text="BlackCloud"
          tag="h1"
          className="font-display text-7xl font-bold tracking-tight sm:text-9xl"
          delay={60}
          duration={1.2}
          ease="power4.out"
          splitType="chars"
          from={{ opacity: 0, y: 120, rotateX: -90 }}
          to={{ opacity: 1, y: 0, rotateX: 0 }}
        />

        <div className="mt-8 flex items-center justify-center gap-3 text-2xl text-fg-muted sm:text-3xl">
          <span>Design infrastructure that</span>
          <RotatingText
            texts={["validates itself", "flows", "scales", "just works"]}
            mainClassName="rounded-lg bg-primary/15 px-3 py-1 font-display font-semibold text-primary"
            rotationInterval={2200}
            staggerFrom="last"
            staggerDuration={0.02}
            splitLevelClassName="overflow-hidden"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-5"
        >
          <Magnet padding={120} magnetStrength={3}>
            <StarBorder
              as={Link}
              href="/dashboard"
              color="#8b5cf6"
              speed="4s"
              className="cursor-target"
            >
              <span className="font-medium">Launch the playground</span>
            </StarBorder>
          </Magnet>

          <Magnet padding={100} magnetStrength={4}>
            <Link
              href="/login"
              className="cursor-target rounded-full border border-border-strong bg-void/40 px-7 py-3 text-sm font-medium text-fg backdrop-blur transition-colors hover:bg-slate"
            >
              Sign in
            </Link>
          </Magnet>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 flex flex-col items-center gap-2 text-fg-subtle"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="block h-8 w-px bg-gradient-to-b from-primary to-transparent"
          />
        </motion.div>
      </section>

      {/* ── Velocity marquee divider ─────────────────────────── */}
      <div className="relative py-10">
        <ScrollVelocity
          texts={["Build · Validate · Export · ", "AWS · Azure · GCP · "]}
          velocity={60}
          className="font-display text-6xl font-bold text-fg/10 sm:text-8xl"
        />
      </div>

      {/* ── Story beats ──────────────────────────────────────── */}
      {beats.map((beat, i) => (
        <section
          key={i}
          className={`flex min-h-dvh items-center px-6 sm:px-20 ${
            i % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg rounded-3xl border border-border-strong bg-deep-space/50 p-10 backdrop-blur-2xl"
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {beat.kicker}
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight text-fg sm:text-5xl">
              {beat.title}
            </h2>
            <div className="mt-5 text-lg text-fg-muted">
              <ScrollReveal
                baseOpacity={0.1}
                enableBlur
                baseRotation={3}
                blurStrength={4}
                containerClassName="!my-0"
                textClassName="!text-lg !font-normal !leading-relaxed"
              >
                {beat.body}
              </ScrollReveal>
            </div>
          </motion.div>
        </section>
      ))}

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 1 }}
        >
          <GradientText
            colors={["#8b5cf6", "#4285f4", "#22c55e", "#8b5cf6"]}
            animationSpeed={6}
            className="font-display text-6xl font-bold tracking-tight sm:text-8xl"
          >
            Your cloud, visualized.
          </GradientText>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-12"
        >
          <Magnet padding={140} magnetStrength={3}>
            <StarBorder as={Link} href="/dashboard" color="#8b5cf6" speed="3s" className="cursor-target">
              <span className="text-base font-medium">Start building — free</span>
            </StarBorder>
          </Magnet>
        </motion.div>
      </section>
    </div>
  );
}
