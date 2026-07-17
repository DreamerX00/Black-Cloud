"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Wrench, Gauge } from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/layout/section-reveal";
import { SiteFooter } from "@/components/layout/site-footer";
import { TextReveal } from "@/components/effects/text-reveal";
import { Magnetic } from "@/components/effects/magnetic";
import { ShimmerButton } from "@/components/effects/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { CHANGELOG, type ChangelogEntry } from "@/lib/mock";
import { cn } from "@/lib/utils";

const ChangelogScene = dynamic(() => import("./scene"), { ssr: false });

// Map each changelog tag to a Badge variant + icon + label.
const TAG_META: Record<
  ChangelogEntry["tag"],
  { variant: "default" | "cyan" | "success"; label: string; icon: typeof Sparkles }
> = {
  feature: { variant: "default", label: "Feature", icon: Sparkles },
  perf: { variant: "cyan", label: "Performance", icon: Gauge },
  fix: { variant: "success", label: "Fix", icon: Wrench },
};

function TimelineEntry({ entry, index }: { entry: ChangelogEntry; index: number }) {
  const reduced = useReducedMotion();
  const meta = TAG_META[entry.tag];
  const Icon = meta.icon;

  return (
    <SectionReveal as="div" delay={0.05} className="relative pl-14 sm:pl-20">
      {/* Connector dot on the timeline line. */}
      <span
        aria-hidden
        className="absolute left-4 top-6 -translate-x-1/2 sm:left-8"
      >
        <span className="clay flex size-8 items-center justify-center rounded-full">
          <motion.span
            className="size-2.5 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan shadow-[0_0_12px_rgba(139,92,246,0.8)]"
            animate={reduced ? undefined : { scale: [1, 1.35, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
          />
        </span>
      </span>

      <article className="clay p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-lg font-bold text-gradient">{entry.version}</span>
          <Badge variant={meta.variant}>
            <Icon aria-hidden />
            {meta.label}
          </Badge>
          <span className="ml-auto text-xs uppercase tracking-widest text-muted-foreground">
            {entry.date}
          </span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground">
          {entry.title}
        </h3>

        <ul className="mt-5 space-y-2.5">
          {entry.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span
                aria-hidden
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-cyan/70"
              />
              {point}
            </li>
          ))}
        </ul>
      </article>
    </SectionReveal>
  );
}

export default function ChangelogPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <PageHero
          scene={<ChangelogScene />}
          eyebrow="Changelog"
          title={
            <>
              Every release, <span className="text-gradient">upstream</span>.
            </>
          }
          subtitle="A living river of shipped work — features, fixes, and speed, flowing from the whole BlackCloud fleet to yours."
          actions={
            <>
              <Magnetic>
                <ShimmerButton>Subscribe to updates</ShimmerButton>
              </Magnetic>
              <a
                href="#timeline"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Jump to timeline ↓
              </a>
            </>
          }
        />

        <span id="timeline" className="block" aria-hidden />
        <section className="relative z-10 px-6 pt-12 pb-32">
          <div className="mx-auto max-w-3xl">
            <TextReveal>
              <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                The release stream
              </h2>
            </TextReveal>

            <div className="relative">
              {/* Vertical connector line running through the dots. */}
              <span
                aria-hidden
                className={cn(
                  "absolute left-4 top-0 bottom-0 w-px -translate-x-1/2 sm:left-8",
                  "bg-gradient-to-b from-accent-violet/60 via-accent-cyan/40 to-transparent",
                )}
              />
              <div className="flex flex-col gap-8">
                {CHANGELOG.map((entry, i) => (
                  <TimelineEntry key={entry.version} entry={entry} index={i} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
