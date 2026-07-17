"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Siren,
  Server,
  Globe,
  Database,
  Network,
  Zap,
  ArrowRight,
  ShieldCheck,
  Route,
  Activity,
  GaugeCircle,
  Play,
} from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Scene is client + WebGL only — never SSR it.
const SimulatorScene = dynamic(() => import("./scene"), { ssr: false });

// Static, deterministic claymorphism fallback for reduced-motion / no-webgl.
// A frozen "failure-storm" diagram: three AZ chips, the middle one downed in red,
// traffic arcs rerouting around it. No animation, pure gradients + clay.
function SceneFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,color-mix(in_oklch,var(--status-danger),transparent_78%),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_20%_70%,color-mix(in_oklch,var(--accent-cyan),transparent_82%),transparent_70%)]" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-6 sm:gap-12">
        {[
          { label: "AZ-a", ok: true },
          { label: "AZ-b", ok: false },
          { label: "AZ-c", ok: true },
        ].map((z) => (
          <div
            key={z.label}
            className="clay grid size-20 place-items-center rounded-2xl text-center sm:size-28"
            style={{
              boxShadow: z.ok
                ? "0 0 40px color-mix(in oklch, var(--accent-cyan), transparent 70%)"
                : "0 0 50px color-mix(in oklch, var(--status-danger), transparent 55%)",
            }}
          >
            <span
              className="font-display text-sm font-semibold sm:text-base"
              style={{ color: z.ok ? "var(--accent-cyan)" : "var(--status-danger)" }}
            >
              {z.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SIM_TYPES = [
  {
    icon: Server,
    label: "AZ failure",
    desc: "Down a single availability zone and confirm capacity holds across the survivors.",
    status: "danger" as const,
    tag: "Zonal",
  },
  {
    icon: Globe,
    label: "Region failure",
    desc: "Sever an entire region. Watch DNS + failover pull traffic to your standby region.",
    status: "danger" as const,
    tag: "Regional",
  },
  {
    icon: Database,
    label: "DB failure",
    desc: "Kill the primary and time the promotion. Measure replica lag and write recovery.",
    status: "warning" as const,
    tag: "Stateful",
  },
  {
    icon: Network,
    label: "LB failure",
    desc: "Drop a load balancer and verify health checks reroute to the remaining pools.",
    status: "warning" as const,
    tag: "Edge",
  },
  {
    icon: Zap,
    label: "Service crash",
    desc: "Crash a service mid-request and validate retries, circuit breakers, and backpressure.",
    status: "info" as const,
    tag: "Runtime",
  },
];

const STATUS_STYLE: Record<
  string,
  { text: string; dot: string; glow: string }
> = {
  danger: {
    text: "text-status-danger",
    dot: "bg-status-danger",
    glow: "0 0 34px color-mix(in oklch, var(--status-danger), transparent 62%)",
  },
  warning: {
    text: "text-status-warning",
    dot: "bg-status-warning",
    glow: "0 0 34px color-mix(in oklch, var(--status-warning), transparent 62%)",
  },
  info: {
    text: "text-status-info",
    dot: "bg-status-info",
    glow: "0 0 34px color-mix(in oklch, var(--status-info), transparent 62%)",
  },
};

const REROUTE_STEPS = [
  {
    n: "01",
    icon: Siren,
    title: "Inject the fault",
    body: "Pick a blast radius — a node, a zone, a whole region — and detonate it on a live copy of your topology.",
    accent: "text-status-danger",
  },
  {
    n: "02",
    icon: Route,
    title: "Traffic reroutes",
    body: "Packets that crossed the dead zone arc around it to healthy survivors. You see the new path in real time.",
    accent: "text-status-warning",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Survivors absorb",
    body: "Remaining zones take the load. If a survivor tips over, the storm cascades — and you catch it here, not in prod.",
    accent: "text-status-success",
  },
];

const INSIGHTS = [
  {
    icon: GaugeCircle,
    title: "Blast radius",
    body: "How far one failure actually spreads before your isolation boundaries stop it.",
  },
  {
    icon: Activity,
    title: "Recovery time",
    body: "Real RTO — the seconds between fault injection and traffic fully healed onto survivors.",
  },
  {
    icon: Route,
    title: "Reroute health",
    body: "Whether your failover paths exist, converge, and have the headroom to carry shifted load.",
  },
  {
    icon: ShieldCheck,
    title: "Single points of failure",
    body: "The one node, zone, or dependency that takes everything with it when it goes.",
  },
];

export default function SimulatorPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <PageHero
          scene={<SimulatorScene fallback={<SceneFallback />} />}
          eyebrow="Failure Simulator"
          title={
            <>
              Break it here.{" "}
              <span className="text-gradient">Not in production.</span>
            </>
          }
          subtitle="Inject real failures into a live copy of your architecture, watch traffic reroute around the wreckage, and learn exactly where your resilience ends — before an outage teaches you the hard way."
          actions={
            <>
              <Button asChild size="lg" className="h-11 px-6 text-base">
                <Link href="/simulator">
                  <Play className="size-4" />
                  Launch a simulation
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6 text-base">
                <Link href="#reroute">See how reroute works</Link>
              </Button>
            </>
          }
        >
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Badge variant="outline" className="gap-1.5 text-status-danger">
              <span className="size-1.5 rounded-full bg-status-danger" />
              AZ + region faults
            </Badge>
            <Badge variant="outline" className="gap-1.5 text-status-warning">
              <span className="size-1.5 rounded-full bg-status-warning" />
              Live traffic reroute
            </Badge>
            <Badge variant="outline" className="gap-1.5 text-status-success">
              <span className="size-1.5 rounded-full bg-status-success" />
              Zero prod impact
            </Badge>
          </div>
        </PageHero>

        {/* Simulation types */}
        <SectionReveal className="mx-auto w-full max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Five ways to break things
            </h2>
            <p className="mt-4 text-balance text-muted-foreground">
              Every layer fails differently. Simulate each one, with the status your
              runbook actually cares about.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SIM_TYPES.map((s) => {
              const st = STATUS_STYLE[s.status];
              const Icon = s.icon;
              return (
                <ClayPanel
                  key={s.label}
                  variant="raised"
                  className="group flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="clay-inset grid size-11 place-items-center rounded-xl"
                      style={{ boxShadow: st.glow }}
                    >
                      <Icon className={`size-5 ${st.text}`} />
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
                      <span className={`size-1.5 rounded-full ${st.dot}`} />
                      {s.tag}
                    </span>
                  </div>
                  <h3 className={`font-display text-xl font-semibold ${st.text}`}>
                    {s.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </ClayPanel>
              );
            })}

            {/* CTA tile to fill the grid */}
            <ClayPanel
              variant="inset"
              className="flex flex-col justify-center gap-3 text-center"
            >
              <Siren className="mx-auto size-7 text-status-danger" />
              <p className="text-sm text-muted-foreground">
                Chain them into a full chaos experiment.
              </p>
              <Button asChild variant="secondary" size="sm" className="mx-auto">
                <Link href="/simulator">
                  Open the simulator <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </ClayPanel>
          </div>
        </SectionReveal>

        {/* Reroute showcase */}
        <SectionReveal
          as="section"
          className="mx-auto w-full max-w-6xl px-6 py-24"
        >
          <div id="reroute" className="scroll-mt-24" />
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 text-status-warning">
              Live reroute
            </Badge>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Watch traffic route around the wreckage
            </h2>
            <p className="mt-4 text-balance text-muted-foreground">
              A zone goes dark. Packets that used to cross it bend around the
              failure toward survivors. Resilience you can actually see.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {REROUTE_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <ClayPanel key={step.n} variant="raised" className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-bold text-muted-foreground/40">
                      {step.n}
                    </span>
                    <Icon className={`size-6 ${step.accent}`} />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </ClayPanel>
              );
            })}
          </div>
        </SectionReveal>

        {/* What you learn */}
        <SectionReveal className="mx-auto w-full max-w-6xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-status-success">
                Resilience insights
              </Badge>
              <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                What every storm teaches you
              </h2>
              <p className="mt-4 text-muted-foreground">
                A simulation isn&apos;t a stunt. Each run returns hard numbers about how
                your architecture behaves under failure — the facts your incident
                review would have surfaced too late.
              </p>
              <Button asChild size="lg" className="mt-8 h-11 px-6 text-base">
                <Link href="/simulator">
                  Run your first storm <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {INSIGHTS.map((it) => {
                const Icon = it.icon;
                return (
                  <ClayPanel key={it.title} variant="raised" className="flex flex-col gap-3">
                    <span className="clay-inset grid size-10 place-items-center rounded-xl">
                      <Icon className="size-5 text-accent-cyan" />
                    </span>
                    <h3 className="font-display text-lg font-semibold">{it.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {it.body}
                    </p>
                  </ClayPanel>
                );
              })}
            </div>
          </div>
        </SectionReveal>

        {/* CTA */}
        <SectionReveal className="mx-auto w-full max-w-5xl px-6 pb-28">
          <ClayPanel
            variant="raised"
            className="relative overflow-hidden px-8 py-16 text-center sm:px-16"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--status-danger),transparent_82%),transparent_70%)]" />
            <div className="relative">
              <Siren className="mx-auto size-9 text-status-danger" />
              <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Find your breaking point{" "}
                <span className="text-gradient">on purpose.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
                Spin up a failure storm against a live copy of your infrastructure.
                No prod risk, no surprises left for 3am.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-11 px-6 text-base">
                  <Link href="/simulator">
                    <Play className="size-4" />
                    Launch the simulator
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-11 px-6 text-base">
                  <Link href="/product/playground">Explore the platform</Link>
                </Button>
              </div>
            </div>
          </ClayPanel>
        </SectionReveal>
      </main>
      <SiteFooter />
    </>
  );
}
