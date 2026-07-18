import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS } from "@/content/projects";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";
import { PillButton } from "@/components/ui/pill-button";
import { ProviderChip } from "@/components/ui/provider-chip";
import { HealthRing } from "@/components/app/health-ring";
import { Sparkline } from "@/components/app/sparkline";
import {
  Sparkles,
  ArrowUpRight,
  Boxes,
  ShieldAlert,
  Coins,
  Clock3,
  Plus,
  Wand2,
  MessagesSquare,
  BrainCircuit,
  Activity,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

const QUICK_ACTIONS = [
  { icon: Plus, label: "New project", href: "/projects/new", tint: "text-ai" },
  { icon: Wand2, label: "Ask AI Architect", href: "/ai-architect", tint: "text-ai" },
  { icon: ShieldAlert, label: "Run a chaos drill", href: "/simulator", tint: "text-danger" },
  { icon: Coins, label: "Simulate cost", href: "/cost", tint: "text-success" },
];

const COUNCIL_FEED = [
  { who: "Aria the Raven", tint: "text-aws", msg: "Orion — s3:PutObject on 3 roles should be scoped by prefix. Draft PR ready.", when: "12m" },
  { who: "Elm the Owl", tint: "text-gcp", msg: "Andromeda — 41% of us-east-1 Cloud Storage is idle Standard tier. Nearline saves $684/mo.", when: "1h" },
  { who: "Vex the Dragon", tint: "text-danger", msg: "Callisto — Deployment `checkout-svc` still missing liveness probe. Recommendation attached.", when: "3h" },
  { who: "Kaz the Fox", tint: "text-azure", msg: "Sirius — cross-region latency to APAC is 320ms. Front Door + edge cache brings it to 90ms.", when: "5h" },
  { who: "Terra the Robot", tint: "text-success", msg: "Vega — Same NAT gateway inlined in 7 modules. Extraction diff ready for review.", when: "8h" },
];

export default function DashboardPage() {
  const avg = Math.round(PROJECTS.reduce((a, p) => a + p.health, 0) / PROJECTS.length);
  const cost = PROJECTS.reduce((a, p) => a + p.cost, 0);
  const nodes = PROJECTS.reduce((a, p) => a + p.nodes, 0);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      {/* Welcome band */}
      <Reveal>
        <ClayCard variant="lg" glow="ai" className="relative overflow-hidden p-8 md:p-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-30" />
          <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="text-mono-caps text-ai">Welcome back, Akash</div>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
                Your universe is <span className="text-gradient-nebula">calm.</span>
              </h1>
              <p className="mt-3 max-w-lg text-ink-dim">
                6 projects · 224 nodes · drift 0. Aria flagged 2 IAM policies overnight. Elm found $2.1k/mo of savings across three storage buckets. Everything else is nominal.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <PillButton href="/projects/new" icon={<Plus className="h-4 w-4" />}>New project</PillButton>
                <PillButton href="/ai-architect" variant="ghost" icon={<Sparkles className="h-4 w-4 text-ai" />}>Ask the Council</PillButton>
              </div>
            </div>
            <HealthRing value={avg} label="Portfolio Score" size={180} />
          </div>
        </ClayCard>
      </Reveal>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: Boxes, label: "Active projects", value: `${PROJECTS.length}`, hint: "3 prod · 2 staging · 1 dev", tint: "text-ai" },
          { icon: Activity, label: "Total nodes", value: `${nodes}`, hint: "across all environments", tint: "text-info" },
          { icon: Coins, label: "Monthly cost", value: `$${(cost / 1000).toFixed(1)}k`, hint: "on-demand, before discounts", tint: "text-success" },
          { icon: BrainCircuit, label: "Health score", value: `${avg}`, hint: "portfolio blended", tint: "text-ai" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Reveal key={kpi.label}>
              <ClayCard interactive className="p-6">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl clay-sm ${kpi.tint}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="mt-4 font-display text-3xl font-semibold">{kpi.value}</div>
                <div className="mt-1 text-mono-caps text-ink-mute">{kpi.label}</div>
                <div className="mt-1 text-xs text-ink-mute/70">{kpi.hint}</div>
              </ClayCard>
            </Reveal>
          );
        })}
      </div>

      {/* Two-column: recent projects + council feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Recent projects</h2>
            <Link href="/projects" className="text-sm text-ink-mute hover:text-ink">See all →</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {PROJECTS.slice(0, 4).map(p => (
              <Reveal key={p.id}>
                <Link href={`/projects/${p.id}`}>
                  <ClayCard interactive className="flex h-full flex-col gap-4 p-6">
                    <div className="flex items-start justify-between">
                      <ProviderChip provider={p.provider === "multi" ? "aws" : p.provider} label={p.provider === "multi" ? "multi-cloud" : p.provider} />
                      <span className="text-mono-caps text-ink-mute">{p.environment}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-tight">{p.name}</h3>
                      <div className="mt-1 text-mono-caps text-ink-mute">{p.nodes} nodes · {p.edges} edges</div>
                    </div>
                    <Sparkline values={p.activity} tone={p.health > 85 ? "success" : "ai"} />
                    <div className="mt-auto flex items-center justify-between">
                      <div className="text-mono-caps text-ink-mute">${(p.cost / 1000).toFixed(1)}k/mo</div>
                      <span className={`text-sm font-semibold ${p.health >= 85 ? "text-success" : p.health >= 70 ? "text-ai" : "text-warn"}`}>{p.health}</span>
                    </div>
                  </ClayCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-2xl font-semibold">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(q => {
              const Icon = q.icon;
              return (
                <Link key={q.label} href={q.href}>
                  <ClayCard interactive className="flex h-full flex-col justify-between gap-4 p-4">
                    <div className={`clay-sm inline-flex h-9 w-9 items-center justify-center rounded-xl ${q.tint}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-medium">{q.label}</div>
                  </ClayCard>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Council feed</h2>
            <MessagesSquare className="h-4 w-4 text-ink-mute" />
          </div>
          <ClayCard className="divide-y divide-white/6">
            {COUNCIL_FEED.map((m, i) => (
              <div key={i} className="flex gap-3 p-4">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ai animate-pulse-slow" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-mono-caps ${m.tint}`}>{m.who}</span>
                    <span className="font-mono text-[10px] text-ink-mute">{m.when} ago</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-dim">{m.msg}</p>
                </div>
              </div>
            ))}
          </ClayCard>

          <Link href="/mascots" className="inline-flex items-center gap-1.5 text-sm text-ai">
            Open the full council <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Activity band */}
      <ClayCard variant="lg" className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Last 14 days · portfolio activity</h2>
          <span className="text-mono-caps text-ink-mute">nodes changed / day</span>
        </div>
        <div className="grid grid-cols-7 gap-2 md:grid-cols-14">
          {Array.from({ length: 14 }).map((_, i) => {
            const v = PROJECTS.reduce((a, p) => a + (p.activity[i] ?? 0), 0);
            const max = 60;
            const opacity = Math.min(1, 0.15 + v / max);
            return (
              <div
                key={i}
                title={`Day ${i + 1}: ${v} changes`}
                className="clay-sm aspect-square rounded-xl"
                style={{ background: `rgba(139,92,246,${opacity})` }}
              />
            );
          })}
        </div>
      </ClayCard>

      {/* Alerts / roadmap */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ClayCard className="p-8">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-danger" />
            <h2 className="font-display text-xl font-semibold">Blast radius alerts</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {[
              { p: "Callisto", msg: "Deleting subnet `db-private-2` affects 8 downstream services" },
              { p: "Orion", msg: "IAM role `s3-writer` grants s3:*  · 12 buckets in scope" },
              { p: "Sirius", msg: "Single-AZ Redis · quarterly game day recommended" },
            ].map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                <span className="text-sm text-ink-dim"><span className="text-ink">{a.p}</span> — {a.msg}</span>
              </li>
            ))}
          </ul>
        </ClayCard>

        <ClayCard className="p-8">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-warn" />
            <h2 className="font-display text-xl font-semibold">Time machine highlights</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {[
              { d: "Jul 17", msg: "Orion — added CloudFront distribution · Δcost +$120/mo" },
              { d: "Jul 15", msg: "Andromeda — swapped Kinesis for MSK · resilience +6" },
              { d: "Jul 12", msg: "Vega — GKE cluster downsized · Δcost −$740/mo" },
            ].map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-mono-caps text-ink-mute w-14 shrink-0">{h.d}</span>
                <span className="text-sm text-ink-dim">{h.msg}</span>
              </li>
            ))}
          </ul>
        </ClayCard>
      </div>
    </div>
  );
}
