"use client";
import { motion, useReducedMotion } from "motion/react";
import { Cloud, Zap, Globe, Server, Plug, Target, Cpu, Rocket } from "lucide-react";
import { NumberTicker } from "@/components/effects/number-ticker";
import { BeamBorder } from "@/components/effects/beam-border";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { TextReveal } from "@/components/effects/text-reveal";
import { Parallax } from "@/components/effects/parallax";
import { DotPattern } from "@/components/effects/dot-pattern";
import type { LucideIcon } from "lucide-react";

const STATS: { label: string; value: number; suffix: string; icon: LucideIcon }[] = [
  { label: "Deploys / day", value: 48000, suffix: "+", icon: Zap },
  { label: "Regions", value: 96, suffix: "", icon: Globe },
  { label: "Uptime", value: 99, suffix: ".99%", icon: Cloud },
  { label: "Services", value: 23, suffix: "", icon: Server },
];

const STEPS: { label: string; icon: LucideIcon }[] = [
  { label: "Connect clouds", icon: Plug },
  { label: "Define intent", icon: Target },
  { label: "BlackCloud orchestrates", icon: Cpu },
  { label: "Ship", icon: Rocket },
];

export default function Act3Core() {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* decorative dot grid — behind, non-interactive, partial opacity so galaxy shows */}
      <DotPattern className="opacity-20" />
      {/* reactor glow tying to the 3D core theme */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--accent-violet) 35%, transparent), transparent 70%)",
        }}
      />

      <TextReveal>
        <h2 className="mb-16 text-4xl font-bold sm:text-5xl">Straight into the core.</h2>
      </TextReveal>

      <Parallax speed={0.15} className="w-full max-w-5xl">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <BeamBorder key={s.label}>
                <SpotlightCard className="!rounded-[inherit]">
                  <div className="flex flex-col items-center gap-3 px-4 py-8">
                    <Icon className="size-6 text-accent-violet" aria-hidden />
                    <div className="text-4xl font-bold text-accent-cyan sm:text-5xl">
                      <NumberTicker value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                </SpotlightCard>
              </BeamBorder>
            );
          })}
        </div>
      </Parallax>

      {/* how-it-works flow: nodes + drawn connectors */}
      <div className="mt-24 w-full max-w-4xl">
        <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-center sm:justify-between">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex flex-1 items-center gap-4 sm:flex-col sm:gap-4">
                <motion.div
                  className="flex flex-col items-center gap-3"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="clay flex size-14 items-center justify-center rounded-full">
                    <Icon className="size-6 text-accent-cyan" aria-hidden />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground sm:text-sm">{step.label}</span>
                </motion.div>

                {i < STEPS.length - 1 && (
                  <div className="relative h-8 w-px flex-1 sm:h-px sm:w-auto">
                    <div className="absolute inset-0 bg-border" />
                    <motion.div
                      className="absolute inset-0 origin-top bg-gradient-to-b from-accent-violet to-accent-cyan sm:origin-left sm:bg-gradient-to-r"
                      initial={reduced ? false : { scaleX: 0, scaleY: 0 }}
                      whileInView={reduced ? undefined : { scaleX: 1, scaleY: 1 }}
                      viewport={{ once: true, margin: "-15%" }}
                      transition={{ duration: 0.6, delay: i * 0.15 + 0.3, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
