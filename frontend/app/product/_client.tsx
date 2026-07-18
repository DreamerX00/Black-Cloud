"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Workflow,
  Brain,
  ArrowRightLeft,
  Zap,
  History,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { Button } from "@/components/ui/button";
import { GlowOrb } from "@/components/effects/glow-orb";

/* ─── Product data ─── */
const PRODUCTS = [
  {
    slug: "playground",
    name: "Cloud Playground",
    tagline: "Visual infrastructure design",
    description:
      "Drag-and-drop cloud architecture builder with real-time validation, cost estimation, and IaC export. Design your entire infrastructure visually.",
    icon: Workflow,
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-600",
    features: ["Drag & drop canvas", "Real-time validation", "IaC export", "Cost estimation"],
  },
  {
    slug: "ai-architect",
    name: "AI Architect",
    tagline: "AI-powered infrastructure design",
    description:
      "Describe your requirements in plain English and let AI generate production-ready cloud architectures. Optimized for cost, performance, and security.",
    icon: Brain,
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-600",
    features: ["Natural language input", "Multi-cloud support", "Best practices built-in", "Instant generation"],
  },
  {
    slug: "migration",
    name: "Migration Ground",
    tagline: "Seamless cloud migration",
    description:
      "Map, plan, and execute migrations between cloud providers with automated compatibility analysis and step-by-step migration playbooks.",
    icon: ArrowRightLeft,
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-600",
    features: ["Provider mapping", "Compatibility scores", "Migration playbooks", "Zero-downtime paths"],
  },
  {
    slug: "simulator",
    name: "Failure Simulator",
    tagline: "Chaos engineering for the cloud",
    description:
      "Inject failures into your architecture to test resilience before production. Simulate outages, latency spikes, and cascading failures safely.",
    icon: Zap,
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-600",
    features: ["Fault injection", "Blast radius analysis", "Recovery scoring", "Resilience reports"],
  },
  {
    slug: "time-machine",
    name: "Time Machine",
    tagline: "Infrastructure version control",
    description:
      "Track every change to your infrastructure over time. Roll back to any snapshot, compare versions, and audit your architecture history.",
    icon: History,
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-600",
    features: ["Version history", "Instant rollbacks", "Diff comparison", "Audit trails"],
  },
] as const;

/* ─── Bento grid card ─── */
function ProductCard({
  product,
  index,
}: {
  product: (typeof PRODUCTS)[number];
  index: number;
}) {
  const Icon = product.icon;
  // ponytail: first two cards span 2 cols on large screens for bento look
  const isLarge = index < 2;

  return (
    <RevealItem
      className={cn(isLarge ? "md:col-span-2 lg:col-span-1 xl:col-span-2" : "")}
    >
      <Link href={`/product/${product.slug}`} className="group block h-full">
        <ClayPanel
          hoverable
          glowColor={product.color}
          className="relative h-full overflow-hidden p-6 md:p-8 transition-all duration-300"
        >
          {/* background gradient */}
          <div
            className={cn(
              "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-25",
              `bg-gradient-to-br ${product.gradient}`
            )}
          />

          <div className="relative z-10">
            {/* Icon */}
            <div
              className={cn(
                "mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 shadow-[var(--shadow-clay-sm)]",
                `bg-gradient-to-br ${product.gradient}`
              )}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>

            {/* Title & tagline */}
            <h3 className="font-display text-xl font-bold text-foreground mb-1">
              {product.name}
            </h3>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              {product.tagline}
            </p>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {product.features.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-white/5 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {f}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
              Learn more <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </ClayPanel>
      </Link>
    </RevealItem>
  );
}

/* ─── Stats row ─── */
function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <RevealItem>
      <div className="text-center">
        <div className="font-display text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent md:text-4xl">
          {value}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
      </div>
    </RevealItem>
  );
}

/* ─── Main export ─── */
export function ProductOverviewClient() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* ── Stats ── */}
      <SectionReveal
        stagger={0.1}
        className="grid grid-cols-2 gap-8 py-16 md:grid-cols-4"
      >
        <StatBlock value="50K+" label="Architectures designed" />
        <StatBlock value="3" label="Cloud providers" />
        <StatBlock value="99.9%" label="Uptime SLA" />
        <StatBlock value="<2s" label="AI generation time" />
      </SectionReveal>

      {/* ── Bento grid ── */}
      <SectionReveal
        stagger={0.12}
        className="grid gap-5 pb-16 md:grid-cols-2 xl:grid-cols-3"
      >
        {PRODUCTS.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </SectionReveal>

      {/* ── Platform highlights ── */}
      <SectionReveal className="relative pb-20">
        <ClayPanel className="relative overflow-hidden p-8 md:p-12 text-center">
          <GlowOrb
            color="#8b5cf6"
            size={300}
            className="absolute -left-20 -top-20 opacity-20"
          />
          <GlowOrb
            color="#06b6d4"
            size={250}
            className="absolute -right-16 -bottom-16 opacity-15"
          />
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold md:text-4xl mb-4">
              One platform. Every cloud.
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground mb-8">
              BlackCloud unifies design, migration, testing, and versioning into a single
              immersive experience. Stop context-switching between tools and start building
              infrastructure that scales.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Start free trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/docs">Read the docs</Link>
              </Button>
            </div>
          </div>
        </ClayPanel>
      </SectionReveal>
    </div>
  );
}
