"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { Button } from "@/components/ui/button";
import { GlowOrb } from "@/components/effects/glow-orb";
import { cn } from "@/lib/utils";

/* ─── Feature card grid ─── */
export function FeatureGrid({
  features,
  glowColor,
}: {
  features: {
    icon: ReactNode;
    title: string;
    description: string;
  }[];
  glowColor: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionReveal className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Key Features
        </h2>
        <p className="mt-3 text-muted-foreground">
          Everything you need, nothing you don&apos;t.
        </p>
      </SectionReveal>

      <SectionReveal
        stagger={0.1}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((f) => (
          <RevealItem key={f.title}>
            <ClayPanel
              hoverable
              glowColor={glowColor}
              className="h-full p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-primary">
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </ClayPanel>
          </RevealItem>
        ))}
      </SectionReveal>
    </section>
  );
}

/* ─── How It Works ─── */
export function HowItWorks({
  steps,
  accentColor,
}: {
  steps: { step: string; title: string; description: string }[];
  accentColor: string;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <SectionReveal className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          How It Works
        </h2>
        <p className="mt-3 text-muted-foreground">
          From zero to production in three simple steps.
        </p>
      </SectionReveal>

      <SectionReveal stagger={0.15} className="relative space-y-0">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />

        {steps.map((s, i) => (
          <RevealItem key={s.step} variant={i % 2 === 0 ? "fade-left" : "fade-right"}>
            <div className="flex gap-6 py-6 md:py-8">
              {/* Step number */}
              <div
                className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 font-display text-lg font-bold shadow-[var(--shadow-clay-sm)]"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                {s.step}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold mb-1">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  {s.description}
                </p>
              </div>
            </div>
          </RevealItem>
        ))}
      </SectionReveal>
    </section>
  );
}

/* ─── CSS Art mockup frame ─── */
export function MockupFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionReveal variant="scale">
        <ClayPanel className={cn("relative overflow-hidden", className)}>
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-amber-500/60" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="ml-4 flex-1 rounded-md bg-white/5 px-3 py-1 text-xs text-muted-foreground font-mono">
              app.blackcloud.dev
            </div>
          </div>
          {/* Content area */}
          <div className="p-6 md:p-8">{children}</div>
        </ClayPanel>
      </SectionReveal>
    </section>
  );
}

/* ─── CTA section ─── */
export function ProductCTA({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  glowColor,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  glowColor: string;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <SectionReveal>
        <ClayPanel className="relative overflow-hidden p-8 text-center md:p-14">
          <GlowOrb
            color={glowColor}
            size={350}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15"
          />
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold md:text-4xl mb-4">
              {title}
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground mb-8">
              {description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              {secondaryHref && secondaryLabel && (
                <Button variant="outline" size="lg" asChild>
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </Button>
              )}
            </div>
          </div>
        </ClayPanel>
      </SectionReveal>
    </section>
  );
}
