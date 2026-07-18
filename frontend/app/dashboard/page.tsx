"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Plus,
  Brain,
  Import,
  FolderKanban,
  Boxes,
  Sparkles,
  DollarSign,
  TrendingUp,
  Clock,
  Rocket,
  ArrowRightLeft,
  Zap,
  History,
  ArrowRight,
  CheckCircle2,
  Share2,
  FileCode2,
  PenLine,
  ShieldCheck,
} from "lucide-react";

import { AppFrame } from "@/components/layout/app-frame";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { NumberTicker } from "@/components/effects/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { STATS, PROJECTS, ACTIVITY, type ActivityType } from "@/lib/mock";
import { PROVIDER_ICON, PROVIDER_COLOR, ServiceIcon } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";

// ponytail: inline helpers, no separate file

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatCost(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ACTIVITY_ICON: Record<ActivityType, typeof Rocket> = {
  created: Plus,
  modified: PenLine,
  deployed: Rocket,
  shared: Share2,
  validated: ShieldCheck,
  exported: FileCode2,
};

const STAT_CARDS = [
  { label: "Total Projects", key: "totalProjects" as const, icon: FolderKanban, prefix: "", color: "text-violet-400", sparkColor: "#8B5CF6", spark: [3, 5, 4, 7, 6, 9, 8, 12, 11, 14] },
  { label: "Total Nodes", key: "totalNodes" as const, icon: Boxes, prefix: "", color: "text-cyan-400", sparkColor: "#06B6D4", spark: [20, 35, 28, 45, 52, 48, 63, 71, 68, 87] },
  { label: "AI Generations", key: "aiGenerations" as const, icon: Sparkles, prefix: "", color: "text-amber-400", sparkColor: "#F59E0B", spark: [1, 2, 1, 3, 5, 4, 6, 8, 7, 12] },
  { label: "Cost Saved", key: "costSaved" as const, icon: DollarSign, prefix: "$", color: "text-emerald-400", sparkColor: "#22C55E", spark: [100, 250, 320, 480, 520, 710, 890, 1100, 1350, 1800] },
] as const;

function Sparkline({ data, color }: { data: readonly number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 24;
  const w = 80;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / range) * h} r={2.5} fill={color} />
    </svg>
  );
}

const QUICK_ACCESS = [
  { name: "Playground", desc: "Visual infrastructure canvas", icon: Zap, href: "/playground", color: PROVIDER_COLOR.aws },
  { name: "AI Architect", desc: "AI-powered design assistant", icon: Brain, href: "/ai-architect", color: PROVIDER_COLOR.gcp },
  { name: "Migration", desc: "Cross-cloud migration maps", icon: ArrowRightLeft, href: "/migration", color: PROVIDER_COLOR.azure },
  { name: "Simulator", desc: "Cost & load simulation", icon: Rocket, href: "/simulator", color: PROVIDER_COLOR.multi },
  { name: "Time Machine", desc: "Version history & rollback", icon: History, href: "/time-machine", color: "#10B981" },
];

const PROVIDERS = [
  { key: "aws", services: 15, pct: 78 },
  { key: "azure", services: 10, pct: 52 },
  { key: "gcp", services: 12, pct: 65 },
] as const;

export default function DashboardPage() {
  const greeting = useMemo(getGreeting, []);

  return (
    <AppFrame title="Dashboard">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* ── 1. WELCOME HEADER ─────────────────────────────────────── */}
        <SectionReveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                {greeting},{" "}
                <span className="text-gradient">Engineer</span>
              </h1>
              <p className="mt-1 text-muted-foreground">
                Here&apos;s your cloud universe at a glance
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" /> New Project
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Brain className="h-4 w-4" /> AI Architect
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Import className="h-4 w-4" /> Import
              </Button>
            </div>
          </div>
        </SectionReveal>

        {/* ── 2. STATS GRID ─────────────────────────────────────────── */}
        <SectionReveal stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((s) => {
            const Icon = s.icon;
            const raw = STATS[s.key];
            // ponytail: for costSaved show compact label, ticker uses raw
            const isCost = s.key === "costSaved";
            return (
              <RevealItem key={s.key}>
                <div className="clay-card rounded-2xl border border-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-white/5", s.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="success" className="gap-1 text-[11px]">
                      <TrendingUp className="h-3 w-3" /> +12%
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <p className="mt-1 font-display text-2xl font-bold tracking-tight">
                        {isCost ? (
                          <NumberTicker value={raw} prefix="$" className={s.color} />
                        ) : (
                          <NumberTicker value={raw} className={s.color} />
                        )}
                      </p>
                    </div>
                    <Sparkline data={s.spark} color={s.sparkColor} />
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </SectionReveal>

        {/* ── 3. RECENT PROJECTS + 4. ACTIVITY FEED ─────────────────── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Projects — 2 cols */}
          <SectionReveal className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Recent Projects</h2>
              <Link href="/dashboard" className="flex items-center gap-1 text-sm text-primary hover:underline">
                View All Projects <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROJECTS.slice(0, 6).map((p) => {
                const prov = PROVIDER_ICON[p.provider];
                return (
                  <motion.div
                    key={p.id}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="clay-card group rounded-2xl border border-white/5 p-4 transition-colors hover:border-white/10">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-sm font-semibold leading-tight line-clamp-1">
                          {p.name}
                        </h3>
                        <Badge variant={p.provider === "multi" ? "default" : (p.provider as "aws" | "azure" | "gcp")}>
                          {prov?.label ?? p.provider}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Boxes className="h-3 w-3" /> {p.nodeCount} nodes
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {relativeTime(p.lastModified)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionReveal>

          {/* Activity feed — 1 col */}
          <SectionReveal variant="fade-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Activity Feed</h2>
            </div>
            <div className="clay-card rounded-2xl border border-white/5">
              <ScrollArea className="h-[420px]">
                <div className="divide-y divide-white/5 p-1">
                  {ACTIVITY.map((a) => {
                    const Icon = ACTIVITY_ICON[a.type] ?? CheckCircle2;
                    return (
                      <div key={a.id} className="flex gap-3 px-3 py-3 transition-colors hover:bg-white/[0.02]">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-snug line-clamp-2">{a.message}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/70">{a.user.name}</span>
                            <span>&middot;</span>
                            <span>{relativeTime(a.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </SectionReveal>
        </div>

        {/* ── 5. QUICK ACCESS PANEL ─────────────────────────────────── */}
        <SectionReveal>
          <h2 className="font-display text-lg font-semibold mb-4">Quick Access</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {QUICK_ACCESS.map((q) => {
              const Icon = q.icon;
              return (
                <motion.div
                  key={q.name}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link href={q.href} className="block">
                    <div
                      className="clay-card rounded-2xl border border-white/5 p-4 transition-colors hover:border-white/10"
                      style={{ borderLeftColor: q.color, borderLeftWidth: 3 }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5" style={{ color: q.color }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-3 font-display text-sm font-semibold">{q.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{q.desc}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                        Open <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </SectionReveal>

        {/* ── 6. PROVIDER OVERVIEW ──────────────────────────────────── */}
        <SectionReveal stagger={0.1} className="grid gap-4 sm:grid-cols-3">
          {PROVIDERS.map((prov) => {
            const info = PROVIDER_ICON[prov.key];
            const color = PROVIDER_COLOR[prov.key];
            return (
              <RevealItem key={prov.key}>
                <div className="clay-card rounded-2xl border border-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <ServiceIcon provider={prov.key} size={22} />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-semibold">{info?.label}</h3>
                      <p className="text-xs text-muted-foreground">{prov.services} services used</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Usage</span>
                      <span className="font-mono font-medium" style={{ color }}>{prov.pct}%</span>
                    </div>
                    <Progress
                      value={prov.pct}
                      className="h-2"
                      style={{ ["--tw-gradient-from" as string]: color, ["--tw-gradient-to" as string]: color } as React.CSSProperties}
                    />
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </SectionReveal>
      </div>
    </AppFrame>
  );
}
