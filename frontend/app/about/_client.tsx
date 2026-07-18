"use client";

import { motion } from "motion/react";
import { Users, Lightbulb, Shield, Heart, Sparkles, Globe, Zap, Building2, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ClayPanel } from "@/components/layout/clay-panel";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { NumberTicker } from "@/components/effects/number-ticker";
import { GsapTextReveal } from "@/components/effects/gsap-text-reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TeamMember } from "@/lib/mock";

/* ── Mission ── */
export function MissionSection() {
  return (
    <SectionReveal className="mx-auto max-w-4xl px-6 py-24 text-center">
      <Badge className="mb-6 border-violet-500/30 bg-violet-500/10 text-violet-300">
        Our Mission
      </Badge>
      <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
        We believe cloud infrastructure should be{" "}
        <span className="bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
          visual, intuitive, and delightful
        </span>
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
        The cloud is the backbone of modern software, yet designing and managing
        infrastructure remains painfully complex. BlackCloud exists to change
        that — giving every engineer a canvas to think in systems, not YAML
        files. We are building the Figma for cloud architecture: drag, connect,
        deploy.
      </p>
      <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-3">
        {[
          { icon: Sparkles, label: "AI-Powered Design", desc: "Generate production-ready architectures from a single prompt" },
          { icon: Globe, label: "Multi-Cloud Native", desc: "AWS, Azure, GCP — design once, deploy anywhere" },
          { icon: Zap, label: "Real-Time Collaboration", desc: "Your whole team on one canvas, live" },
        ].map((item) => (
          <ClayPanel key={item.label} hoverable className="p-5 text-center">
            <item.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
            <p className="font-display text-sm font-semibold text-white">{item.label}</p>
            <p className="mt-1 text-xs text-white/50">{item.desc}</p>
          </ClayPanel>
        ))}
      </div>
    </SectionReveal>
  );
}

/* ── Story / Timeline ── */
const TIMELINE = [
  { year: "2023", title: "The Spark", description: "Akash sketches the first prototype on a napkin after yet another 3am incident caused by misconfigured VPCs. The idea: what if infrastructure diagrams could deploy themselves?" },
  { year: "2024", title: "First Canvas", description: "A small team of four ships the first visual canvas with AWS support. Early adopters start designing real production systems on BlackCloud, validating the core thesis." },
  { year: "2025", title: "Multi-Cloud & AI", description: "Azure and GCP support lands alongside the AI Architecture Advisor. The platform crosses 5,000 active users and processes its 10,000th architecture design." },
  { year: "2026", title: "The Platform Era", description: "Real-time collaboration, infrastructure-as-code export, cost optimization, and security scoring transform BlackCloud from a design tool into a full infrastructure platform." },
] as const;

export function StorySection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <SectionReveal className="mb-16 text-center">
        <Badge className="mb-4 border-cyan-500/30 bg-cyan-500/10 text-cyan-300">Our Story</Badge>
        <GsapTextReveal
          text="From napkin sketch to platform"
          tag="h2"
          className="font-display text-3xl font-bold text-white md:text-4xl"
          stagger={0.04}
        />
        <p className="mx-auto mt-4 max-w-xl text-white/50">
          Every great product starts with a frustrating problem. Ours started at 3am.
        </p>
      </SectionReveal>

      <SectionReveal stagger={0.15} className="relative">
        {/* vertical line */}
        <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-primary/60 via-accent/40 to-transparent md:left-1/2 md:block" />

        {TIMELINE.map((item, i) => (
          <RevealItem key={item.year} variant={i % 2 === 0 ? "fade-left" : "fade-right"}>
            <div className={cn(
              "relative mb-12 flex flex-col md:flex-row md:items-start",
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
            )}>
              {/* dot on line */}
              <div className="absolute left-6 top-2 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary bg-void md:left-1/2 md:block" />

              <div className={cn("flex-1", i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16")}>
                <ClayPanel className="p-6">
                  <span className="font-mono text-xs text-primary">{item.year}</span>
                  <h3 className="mt-1 font-display text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
                </ClayPanel>
              </div>

              {/* spacer for opposite side */}
              <div className="hidden flex-1 md:block" />
            </div>
          </RevealItem>
        ))}
      </SectionReveal>
    </section>
  );
}

/* ── Team ── */
const ROLE_COLORS: Record<string, string> = {
  "Founder & CEO": "#8b5cf6",
  CTO: "#06b6d4",
  "Head of Product": "#f59e0b",
  "Lead Engineer": "#10b981",
  "Head of Design": "#f472b6",
};

export function TeamSection({ members }: { members: TeamMember[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionReveal className="mb-16 text-center">
        <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">The Team</Badge>
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
          The humans behind the cloud
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/50">
          A small, senior team obsessed with making infrastructure beautiful and accessible.
        </p>
      </SectionReveal>

      <SectionReveal stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <RevealItem key={m.name} variant="scale">
            <ClayPanel
              hoverable
              glowColor={ROLE_COLORS[m.role] ?? "#8b5cf6"}
              className="group relative overflow-hidden p-6"
            >
              {/* avatar placeholder */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                {m.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="font-display text-lg font-bold text-white">{m.name}</h3>
              <p className="text-sm font-medium text-primary">{m.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{m.bio}</p>

              {/* hover glow */}
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ background: ROLE_COLORS[m.role] ?? "#8b5cf6" }}
              />
            </ClayPanel>
          </RevealItem>
        ))}
      </SectionReveal>
    </section>
  );
}

/* ── Values ── */
const VALUES = [
  { icon: Lightbulb, title: "Innovation", description: "We push boundaries relentlessly. AI-driven architecture, visual infrastructure, real-time collaboration — if it makes cloud easier, we build it.", color: "#f59e0b" },
  { icon: Zap, title: "Simplicity", description: "Complexity is the enemy. Every feature ships only when it makes the product simpler to use, never more complicated. Less UI, more capability.", color: "#06b6d4" },
  { icon: Shield, title: "Security", description: "Infrastructure security is non-negotiable. Every architecture gets a security score, every design is validated against best practices before export.", color: "#10b981" },
  { icon: Heart, title: "Community", description: "We build in the open. Shared architecture templates, community galleries, open-source modules — the best infrastructure knowledge should be free.", color: "#f472b6" },
] as const;

export function ValuesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionReveal className="mb-16 text-center">
        <Badge className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-300">Our Values</Badge>
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
          What drives us every day
        </h2>
      </SectionReveal>

      <SectionReveal stagger={0.12} className="grid gap-6 sm:grid-cols-2">
        {VALUES.map((v) => (
          <RevealItem key={v.title} variant="fade-up">
            <ClayPanel hoverable glowColor={v.color} className="group p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${v.color}15` }}
              >
                <v.icon className="h-6 w-6" style={{ color: v.color }} />
              </div>
              <h3 className="font-display text-xl font-bold text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{v.description}</p>
            </ClayPanel>
          </RevealItem>
        ))}
      </SectionReveal>
    </section>
  );
}

/* ── Stats ── */
const STAT_ITEMS = [
  { label: "Active Users", value: 8432, suffix: "+", icon: Users },
  { label: "Architectures Designed", value: 18432, suffix: "+", icon: Building2 },
  { label: "Cloud Providers", value: 3, suffix: "", icon: Globe },
  { label: "Countries", value: 47, suffix: "+", icon: Globe },
] as const;

export function StatsSection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* bg gradient band */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />

      <SectionReveal className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <Badge className="mb-4 border-green-500/30 bg-green-500/10 text-green-300">By the Numbers</Badge>
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Trusted by engineers worldwide
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_ITEMS.map((s) => (
            <ClayPanel key={s.label} hoverable className="p-6 text-center">
              <s.icon className="mx-auto mb-3 h-8 w-8 text-primary/60" />
              <div className="font-display text-4xl font-bold text-white">
                <NumberTicker value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm text-white/50">{s.label}</p>
            </ClayPanel>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}

/* ── Careers CTA ── */
export function CareersSection() {
  return (
    <SectionReveal className="mx-auto max-w-4xl px-6 py-24 text-center">
      <ClayPanel glowColor="#8b5cf6" className="relative overflow-hidden p-12 md:p-16">
        {/* decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10">
          <Briefcase className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Join the team
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/60">
            We are a remote-first, async-first team building the future of cloud
            infrastructure. If you are passionate about developer tools, visual
            design, or distributed systems — we want to hear from you.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/careers">
                View Open Positions <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </ClayPanel>
    </SectionReveal>
  );
}
