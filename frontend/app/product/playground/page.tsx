"use client";

// Marketing page for the Cloud Playground (/product/playground). Cinematic R3F
// hero (scene.tsx, ssr:false) with a claymorphism static fallback, then feature
// grid, an animated "connect services" showcase, a brutalist validation callout,
// and a CTA into the live /playground. Client component (motion + dynamic scene),
// so no metadata export per the brief.
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Infinity as InfinityIcon,
  MousePointerClick,
  ShieldCheck,
  Workflow,
  ArrowRight,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceIcon } from "@/lib/brand-icons";
import { CATALOG } from "@/lib/catalog/nodes";

const PlaygroundScene = dynamic(() => import("./scene"), { ssr: false });

const FEATURES = [
  {
    icon: InfinityIcon,
    title: "Infinite canvas",
    body: "Pan, zoom, and sprawl across an endless workspace. Your architecture grows without ever hitting a wall.",
    accent: "text-accent-cyan",
  },
  {
    icon: MousePointerClick,
    title: "Drag & drop services",
    body: "Grab any of 23 cloud services across AWS, Azure, and GCP and drop them straight onto the board.",
    accent: "text-accent-violet",
  },
  {
    icon: ShieldCheck,
    title: "Live validation",
    body: "Every connection is checked as you draw it. Invalid wiring lights up instantly with a fix suggestion.",
    accent: "text-status-success",
  },
  {
    icon: Workflow,
    title: "Animated infra",
    body: "Watch data flow along your edges in real time — a living diagram, not a static picture.",
    accent: "text-ai",
  },
] as const;

// Three services to animate a "connect" chain in the showcase.
const CHAIN = [
  CATALOG.find((s) => s.id === "cloudfront")!,
  CATALOG.find((s) => s.id === "ec2")!,
  CATALOG.find((s) => s.id === "rds")!,
];

export default function PlaygroundPage() {
  const reduced = useReducedMotion();

  return (
    <>
      <Navbar />
      <main className="relative">
        <PageHero
          scene={<PlaygroundScene />}
          eyebrow="Cloud Playground"
          title={
            <>
              Architect the cloud on an{" "}
              <span className="text-gradient">infinite canvas</span>
            </>
          }
          subtitle="Drag services from AWS, Azure, and Google Cloud onto a living board. Wire them together and watch your architecture bloom into being — validated as you build."
          actions={
            <>
              <Button asChild size="lg" className="h-11 px-6 text-base">
                <Link href="/playground">
                  Open the Playground
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6 text-base">
                <Link href="/product">Explore the platform</Link>
              </Button>
            </>
          }
        >
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="aws">AWS</Badge>
            <Badge variant="azure">Azure</Badge>
            <Badge variant="gcp">Google Cloud</Badge>
            <Badge variant="cyan">23 services</Badge>
          </div>
        </PageHero>

        {/* FEATURE GRID */}
        <SectionReveal className="mx-auto w-full max-w-6xl px-6 py-24">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              A canvas that thinks with you
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to sketch, wire, and validate multi-cloud
              architecture — with zero setup.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <ClayPanel key={f.title} className="flex flex-col gap-4">
                <span className="clay-inset inline-flex size-12 items-center justify-center rounded-xl">
                  <f.icon className={`size-6 ${f.accent}`} />
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </ClayPanel>
            ))}
          </div>
        </SectionReveal>

        {/* CONNECT SERVICES SHOWCASE */}
        <SectionReveal className="mx-auto w-full max-w-6xl px-6 py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="cyan" className="mb-4">
                Connect services
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Wire it up, watch it flow
              </h2>
              <p className="mt-4 text-muted-foreground">
                Draw an edge between any two nodes and the Playground animates the
                traffic across it. Build a CDN-to-compute-to-database chain in
                seconds and see the request path light up end to end.
              </p>
              <Button asChild variant="ghost" className="mt-6 px-0 text-accent-cyan">
                <Link href="/playground">
                  Try connecting services
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>

            {/* Animated chain: three clay nodes with a pulse travelling the edge. */}
            <ClayPanel variant="inset" className="relative overflow-hidden py-16">
              <div className="flex items-center justify-between gap-2">
                {CHAIN.map((svc, i) => (
                  <div key={svc.id} className="flex flex-1 flex-col items-center gap-3">
                    <motion.div
                      className="clay flex size-20 items-center justify-center rounded-2xl"
                      initial={reduced ? undefined : { scale: 0.9, opacity: 0 }}
                      whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, duration: 0.5 }}
                    >
                      <ServiceIcon
                        provider={svc.provider}
                        id={svc.id}
                        name={svc.name}
                        size={40}
                      />
                    </motion.div>
                    <span className="text-center text-xs font-medium text-muted-foreground">
                      {svc.name}
                    </span>
                  </div>
                ))}
              </div>
              {/* Travelling pulse over the connecting line. */}
              <div className="pointer-events-none absolute inset-x-10 top-[52px] h-px bg-gradient-to-r from-accent-cyan/40 via-accent-violet/40 to-status-success/40">
                {!reduced && (
                  <motion.span
                    className="absolute -top-1 size-2 rounded-full bg-accent-cyan shadow-[0_0_12px_var(--accent-cyan)]"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </div>
            </ClayPanel>
          </div>
        </SectionReveal>

        {/* BRUTALIST VALIDATION CALLOUT */}
        <SectionReveal className="mx-auto w-full max-w-4xl px-6 py-24">
          <div className="border-4 border-status-danger bg-status-danger/5 p-8 shadow-[8px_8px_0_0_var(--status-danger)]">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-7 text-status-danger" />
              <span className="font-display text-xl font-black uppercase tracking-tight text-status-danger">
                Invalid connection
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-sm">
              <span className="flex items-center gap-2 border-2 border-provider-aws px-3 py-1.5 text-provider-aws">
                <ServiceIcon provider="aws" id="ec2" name="ALB" size={18} /> ALB
              </span>
              <X className="size-5 text-status-danger" />
              <span className="flex items-center gap-2 border-2 border-provider-aws px-3 py-1.5 text-provider-aws">
                <ServiceIcon provider="aws" id="rds" name="RDS" size={18} /> RDS
              </span>
              <span className="ml-1 text-status-danger">
                — a load balancer can&apos;t target a database directly.
              </span>
            </div>

            <div className="mt-6 flex items-center gap-2 border-l-4 border-status-success bg-status-success/5 py-3 pl-4">
              <Check className="size-5 shrink-0 text-status-success" />
              <p className="font-mono text-sm text-foreground">
                Suggested fix:{" "}
                <span className="font-bold text-status-success">
                  ALB → ECS → RDS
                </span>{" "}
                — route through a compute tier.
              </p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              The Playground catches wiring mistakes the moment you draw them and
              hands you the correct topology, so you never ship a broken diagram.
            </p>
          </div>
        </SectionReveal>

        {/* CTA */}
        <SectionReveal className="mx-auto w-full max-w-5xl px-6 pb-28">
          <ClayPanel className="relative overflow-hidden px-8 py-16 text-center">
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent-violet/20 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-accent-cyan/20 blur-[90px]" />
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Start building. No sign-up, no setup.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Open a blank canvas and drop your first service. Your architecture is
              one drag away.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-11 px-6 text-base">
                <Link href="/playground">
                  Launch the Playground
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </ClayPanel>
        </SectionReveal>
      </main>
      <SiteFooter />
    </>
  );
}
