"use client";

// Time Machine marketing page: rewind + diff your architecture. Bespoke R3F
// "timeline rewind" scene in the hero (ghosted past versions receding into
// depth, scrub-driven light-plane), an interactive snapshot slider that scrubs
// both the copy and the 3D scene, a visual-diff explainer, a change-tracking
// feature grid, and a CTA into the app.
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  History,
  GitCompareArrows,
  Undo2,
  BellRing,
  ShieldCheck,
  Layers,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { NumberTicker } from "@/components/effects/number-ticker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SNAPSHOTS } from "@/lib/mock";
import { TimeMachineFallback } from "./scene";
import { useScrubStore } from "./scrub-store";

const TimeMachineScene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => <TimeMachineFallback />,
});

const LAST = SNAPSHOTS.length - 1;

// Deterministic node-name inventory per snapshot so the diff is stable (no random).
// A snapshot "contains" the first N names from a fixed pool; growth = adds, and
// a couple of curated removals give the diff both green and red rows.
const NODE_POOL = [
  "vpc-core", "rds-primary", "app-asg", "alb-public", "s3-assets", "route53",
  "rds-replica-a", "rds-replica-b", "nat-gw", "redis-cache", "sqs-jobs", "lambda-worker",
  "cloudfront-edge", "waf-edge", "s3-logs", "kinesis-stream", "elasticache", "cloudmap",
  "eks-cluster", "payments-vpc", "kms-payments", "waf-payments", "ddb-ledger", "sfn-settle",
];
const REMOVED_AT: Record<string, string[]> = {
  s2: ["single-nat"],
  s3: ["rds-replica-b"],
  s4: ["legacy-lambda"],
};

function inventory(nodes: number): string[] {
  return NODE_POOL.slice(0, nodes);
}

interface Diff {
  added: string[];
  removed: string[];
}
function diffFor(index: number): Diff {
  if (index === 0) return { added: inventory(SNAPSHOTS[0].nodes).slice(0, 6), removed: [] };
  const prev = new Set(inventory(SNAPSHOTS[index - 1].nodes));
  const curr = inventory(SNAPSHOTS[index].nodes);
  return {
    added: curr.filter((n) => !prev.has(n)),
    removed: REMOVED_AT[SNAPSHOTS[index].id] ?? [],
  };
}

const FEATURES = [
  {
    icon: History,
    title: "Immutable snapshots",
    body: "Every apply captures a full, immutable topology snapshot you can revisit forever.",
    color: "text-accent-violet",
  },
  {
    icon: GitCompareArrows,
    title: "Structural diffs",
    body: "Compare any two points in time — added, removed, and re-wired resources highlighted inline.",
    color: "text-accent-cyan",
  },
  {
    icon: Undo2,
    title: "One-click rewind",
    body: "Roll a service, a subgraph, or the whole estate back to a known-good moment in seconds.",
    color: "text-status-success",
  },
  {
    icon: BellRing,
    title: "Drift alerts",
    body: "Get notified the instant live infrastructure diverges from its last recorded snapshot.",
    color: "text-status-warning",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready history",
    body: "Signed, timestamped change log for every mutation — export for compliance on demand.",
    color: "text-status-info",
  },
  {
    icon: Layers,
    title: "Cross-cloud lineage",
    body: "Track how a topology evolved across AWS, Azure, and GCP as one continuous timeline.",
    color: "text-provider-gcp",
  },
] as const;

function DiffRow({ label, kind }: { label: string; kind: "add" | "remove" }) {
  const reduced = useReducedMotion();
  const add = kind === "add";
  return (
    <motion.li
      initial={reduced ? undefined : { opacity: 0, x: add ? 12 : -12 }}
      whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-sm ${
        add
          ? "bg-status-success/10 text-status-success"
          : "bg-status-danger/10 text-status-danger"
      }`}
    >
      {add ? <Plus className="size-3.5 shrink-0" /> : <Minus className="size-3.5 shrink-0" />}
      <span className="truncate">{label}</span>
    </motion.li>
  );
}

export default function TimeMachinePage() {
  const [index, setIndex] = useState(LAST);
  const setScrub = useScrubStore((s) => s.setScrub);
  const snap = SNAPSHOTS[index];
  const diff = diffFor(index);

  function onScrub(next: number) {
    setIndex(next);
    setScrub(LAST === 0 ? 1 : next / LAST);
  }

  return (
    <main className="relative">
      <Navbar />

      <PageHero
        scene={<TimeMachineScene />}
        eyebrow="Time Machine"
        title={
          <>
            Rewind your <span className="text-gradient">architecture</span>
          </>
        }
        subtitle="Scrub through every version of your cloud estate. See what changed, when, and why — then roll any of it back with a single click."
        actions={
          <>
            <Button asChild size="lg" className="clay-pressable h-12 px-8 text-base">
              <Link href="/time-machine">Open the explorer</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
              <Link href="#timeline">See how it works</Link>
            </Button>
          </>
        }
      />

      {/* ── Interactive snapshot timeline ─────────────────────────────── */}
      <div id="timeline" className="scroll-mt-24" />
      <SectionReveal className="relative mx-auto max-w-5xl px-6 py-24">
        <div className="mb-10 text-center">
          <Badge variant="cyan" className="mb-4">
            <History className="size-3.5" /> Snapshot timeline
          </Badge>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Scrub through history
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Drag the slider to sweep the light-plane through your architecture&apos;s
            past. Older topologies fade back into the depth.
          </p>
        </div>

        <ClayPanel className="p-8 sm:p-10">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {snap.date}
              </p>
              <h3 className="font-display text-2xl font-bold text-gradient">{snap.label}</h3>
            </div>
            <div className="text-center sm:text-right">
              <div className="font-display text-4xl font-bold text-foreground">
                <NumberTicker value={snap.nodes} />
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                resources
              </p>
            </div>
          </div>

          <p className="mt-4 text-muted-foreground">{snap.note}</p>

          {/* Slider */}
          <div className="mt-8">
            <label htmlFor="tm-scrub" className="sr-only">
              Scrub through snapshots
            </label>
            <input
              id="tm-scrub"
              type="range"
              min={0}
              max={LAST}
              step={1}
              value={index}
              onChange={(e) => onScrub(Number(e.target.value))}
              aria-valuetext={`${snap.label}, ${snap.nodes} resources`}
              className="clay-inset h-3 w-full cursor-pointer appearance-none rounded-full accent-[var(--accent-violet)]"
            />
            <ol className="mt-4 flex justify-between">
              {SNAPSHOTS.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onScrub(i)}
                    aria-current={i === index ? "true" : undefined}
                    className={`flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors ${
                      i === index
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`size-2.5 rounded-full ${
                        i <= index ? "bg-[var(--accent-violet)]" : "bg-muted"
                      }`}
                    />
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </ClayPanel>
      </SectionReveal>

      {/* ── Visual diff explainer ─────────────────────────────────────── */}
      <SectionReveal className="relative mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-8 text-center">
          <Badge variant="cyan" className="mb-4">
            <GitCompareArrows className="size-3.5" /> Visual diff
          </Badge>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            What changed at <span className="text-gradient">{snap.label}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {index === 0
              ? "The genesis snapshot — everything here was created from scratch."
              : `Compared against ${SNAPSHOTS[index - 1].label} (${SNAPSHOTS[index - 1].date}).`}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ClayPanel variant="inset" className="p-6">
            <div className="mb-4 flex items-center gap-2 text-status-success">
              <Plus className="size-4" />
              <h3 className="font-semibold">Added ({diff.added.length})</h3>
            </div>
            {diff.added.length ? (
              <ul className="space-y-2">
                {diff.added.map((n) => (
                  <DiffRow key={n} label={n} kind="add" />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No resources added.</p>
            )}
          </ClayPanel>

          <ClayPanel variant="inset" className="p-6">
            <div className="mb-4 flex items-center gap-2 text-status-danger">
              <Minus className="size-4" />
              <h3 className="font-semibold">Removed ({diff.removed.length})</h3>
            </div>
            {diff.removed.length ? (
              <ul className="space-y-2">
                {diff.removed.map((n) => (
                  <DiffRow key={n} label={n} kind="remove" />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No resources removed.</p>
            )}
          </ClayPanel>
        </div>
      </SectionReveal>

      {/* ── Change-tracking features grid ─────────────────────────────── */}
      <SectionReveal className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Change tracking, <span className="text-gradient">built in</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Every mutation to your estate is recorded, diffable, and reversible.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <SpotlightCard key={f.title} className="clay h-full p-6">
              <f.icon className={`mb-4 size-8 ${f.color}`} />
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </SpotlightCard>
          ))}
        </div>
      </SectionReveal>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <SectionReveal className="relative mx-auto max-w-4xl px-6 pb-28">
        <ClayPanel className="relative overflow-hidden p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklch,var(--accent-violet),transparent_65%),transparent_60%)]" />
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Never lose a version again
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Open the Time Machine explorer and walk through your architecture&apos;s
            entire history — live.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="clay-pressable h-12 px-8 text-base">
              <Link href="/time-machine">
                Launch Time Machine <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </ClayPanel>
      </SectionReveal>

      <SiteFooter />
    </main>
  );
}
