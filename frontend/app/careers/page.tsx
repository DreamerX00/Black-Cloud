"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Rocket, MapPin, Clock, ArrowRight, Sparkles, Code2, Palette, Shield } from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { ClayPanel } from "@/components/layout/clay-panel";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowOrb } from "@/components/effects/glow-orb";

const OPENINGS = [
  {
    title: "Senior Frontend Engineer",
    team: "Engineering",
    location: "Remote (Worldwide)",
    type: "Full-time",
    icon: Code2,
    color: "#8B5CF6",
    description: "Build the most immersive cloud infrastructure UI on the web. React, Three.js, and GSAP — make infrastructure feel alive.",
  },
  {
    title: "Backend Engineer — Graph Systems",
    team: "Engineering",
    location: "Remote (Worldwide)",
    type: "Full-time",
    icon: Code2,
    color: "#06B6D4",
    description: "Design and scale the unified infrastructure graph that powers every BlackCloud feature. Python, FastAPI, PostgreSQL.",
  },
  {
    title: "AI/ML Engineer",
    team: "AI",
    location: "Remote (Worldwide)",
    type: "Full-time",
    icon: Sparkles,
    color: "#F59E0B",
    description: "Build the AI Architect — generate production-ready cloud architectures from natural language prompts.",
  },
  {
    title: "Product Designer",
    team: "Design",
    location: "Remote (Worldwide)",
    type: "Full-time",
    icon: Palette,
    color: "#22C55E",
    description: "Design interfaces that make cloud infrastructure accessible and delightful. Figma, motion design, spatial UI.",
  },
  {
    title: "Security Engineer",
    team: "Security",
    location: "Remote (Worldwide)",
    type: "Full-time",
    icon: Shield,
    color: "#EF4444",
    description: "Ensure BlackCloud earns and keeps the trust of enterprises. SOC 2, IAM, credential management, threat modeling.",
  },
];

const VALUES = [
  { title: "Build in public", desc: "We share our roadmap, our mistakes, and our wins. Transparency builds trust." },
  { title: "Ship fast, learn faster", desc: "Weekly releases, daily deploys. Perfection is a direction, not a destination." },
  { title: "Engineer for engineers", desc: "We use what we build. Every feature solves a real problem we've felt ourselves." },
  { title: "Remote-first, async-first", desc: "Work from anywhere. Deep work hours are sacred. Meetings are the last resort." },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void pt-20">
        <PageHero
          title="Join the Universe"
          subtitle="Help us build the future of cloud infrastructure"
          badge="Careers"
        />

        {/* Values */}
        <SectionReveal stagger={0.1} className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-display text-2xl font-bold text-center mb-10">Our Values</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <RevealItem key={v.title}>
                <ClayPanel hoverable className="p-6">
                  <h3 className="font-display text-lg font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </ClayPanel>
              </RevealItem>
            ))}
          </div>
        </SectionReveal>

        {/* Open roles */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold">Open Positions</h2>
            <p className="mt-3 text-muted-foreground">All roles are remote-first. We hire globally.</p>
          </SectionReveal>

          <div className="space-y-4">
            {OPENINGS.map((role, i) => {
              const Icon = role.icon;
              return (
                <SectionReveal key={role.title} delay={i * 0.08}>
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <ClayPanel hoverable className="p-6" glowColor={role.color}>
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5"
                          style={{ color: role.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-lg font-semibold">{role.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Rocket className="h-3 w-3" /> {role.team}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {role.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {role.type}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="shrink-0 gap-1">
                          Apply <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </ClayPanel>
                  </motion.div>
                </SectionReveal>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <SectionReveal className="mx-auto max-w-4xl px-6 py-16">
          <ClayPanel className="relative overflow-hidden p-10 text-center">
            <GlowOrb color="rgba(139,92,246,0.2)" size={300} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <h2 className="font-display text-2xl font-bold mb-3">Don&apos;t see your role?</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                We&apos;re always looking for exceptional people. Send us your portfolio and tell us what you&apos;d build at BlackCloud.
              </p>
              <Button size="lg" asChild>
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
          </ClayPanel>
        </SectionReveal>
      </main>
      <SiteFooter />
    </>
  );
}
