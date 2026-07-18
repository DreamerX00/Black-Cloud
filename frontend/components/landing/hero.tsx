"use client";

import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { LandingScene } from "@/components/scenes/landing-scene";
import { ScrambleText } from "@/components/ui/scramble-text";

const CAPTIONS = [
  { at: 0.02, label: "SCENE 01", title: "A single packet arrives", body: "The universe is dark. Something ships." },
  { at: 0.22, label: "SCENE 02", title: "The path expands", body: "Route53 → CloudFront → ALB → ECS → RDS." },
  { at: 0.46, label: "SCENE 03", title: "A network is born", body: "One diagram becomes a living, interconnected ecosystem." },
  { at: 0.68, label: "SCENE 04", title: "Camera pulls back", body: "You are inside the BlackCloud universe." },
  { at: 0.88, label: "SCENE 05", title: "Enter the platform", body: "This is not a dashboard. It is a place." },
];

function CaptionCard({ progress, at, label, title, body }: {
  progress: MotionValue<number>;
  at: number;
  label: string;
  title: string;
  body: string;
}) {
  const opacity = useTransform(progress, [at - 0.05, at, at + 0.15, at + 0.22], [0, 1, 1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-16 mx-auto flex max-w-md flex-col items-start px-8 md:bottom-24 md:max-w-lg"
    >
      <div className="clay-sm w-full p-5">
        <div className="text-mono-caps text-ai">{label}</div>
        <div className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">{title}</div>
        <div className="mt-2 text-sm text-ink-dim">{body}</div>
      </div>
    </motion.div>
  );
}

function RailPip({ progress, at }: { progress: MotionValue<number>; at: number }) {
  const opacity = useTransform(progress, [at - 0.05, at, at + 0.15, at + 0.22], [0.15, 1, 1, 0.15]);
  return <motion.span style={{ opacity }} className="block h-8 w-[3px] rounded-full bg-ai" />;
}

export function LandingHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [numeric, setNumeric] = useState(0);

  useEffect(() => {
    const unsub = progress.on("change", v => setNumeric(v));
    return () => unsub();
  }, [progress]);

  const heroCopyOpacity = useTransform(progress, [0, 0.05, 0.15], [1, 1, 0]);
  const heroCopyY = useTransform(progress, [0, 0.15], [0, -40]);
  const hintOpacity = useTransform(progress, [0, 0.03, 0.08], [1, 1, 0]);

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full">
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden">
        <LandingScene progress={numeric} />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-70"
          style={{
            background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(139,92,246,0.35), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
          style={{ background: "linear-gradient(to top, rgba(5,5,5,0.85), transparent)" }}
        />

        <motion.div
          style={{ opacity: heroCopyOpacity, y: heroCopyY }}
          className="pointer-events-none relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center"
        >
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-ai" />
            <ScrambleText
              text="NEW · AI ARCHITECT · GENERATE FROM A SENTENCE"
              className="tracking-[0.25em]"
            />
          </div>

          <h1 className="font-display text-[clamp(2.75rem,7vw,7.5rem)] font-semibold leading-[0.95] tracking-tight">
            <span className="block">The living universe</span>
            <span className="block text-gradient-nebula">of cloud infrastructure.</span>
          </h1>

          <p className="max-w-2xl text-balance text-lg text-ink-dim md:text-xl">
            BlackCloud is one graph, seven lenses. Design, simulate, migrate, and
            understand cloud architecture as a place your team can walk through
            together — not a diagram nobody updates.
          </p>

          <div className="pointer-events-auto flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              data-cursor="grow"
              className="clay group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-base font-medium"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Enter the universe
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/product/cloud-playground"
              data-cursor="magnet"
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-ink-dim hover:text-ink"
            >
              <Zap className="h-4 w-4 text-ai" />
              Watch a 60s tour
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-6 text-[11px] font-mono uppercase tracking-widest text-ink-mute">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-aws animate-pulse-slow" />AWS</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-azure animate-pulse-slow" />AZURE</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-gcp animate-pulse-slow" />GCP</span>
            <span className="opacity-40">·</span>
            <span>SOC2 · TYPE II</span>
          </div>
        </motion.div>

        {CAPTIONS.map(c => (
          <CaptionCard key={c.at} progress={progress} at={c.at} label={c.label} title={c.title} body={c.body} />
        ))}

        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {CAPTIONS.map(c => (
            <RailPip key={c.at} progress={progress} at={c.at} />
          ))}
          <span className="mt-2 rotate-90 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
            SCROLL · {Math.round(numeric * 100).toString().padStart(2, "0")}%
          </span>
        </div>

        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-mono-caps text-ink-mute"
        >
          scroll to begin ↓
        </motion.div>
      </div>
    </div>
  );
}
