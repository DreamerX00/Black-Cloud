"use client";

import {
  History,
  GitBranch,
  Diff,
  RotateCcw,
  Clock,
  Eye,
  Layers,
  ArrowLeftRight,
} from "lucide-react";
import {
  FeatureGrid,
  HowItWorks,
  MockupFrame,
  ProductCTA,
} from "../_product-page-client";
import { SectionReveal } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";

const FEATURES = [
  {
    icon: <History className="h-5 w-5" />,
    title: "Automatic Snapshots",
    description:
      "Every change creates a timestamped snapshot. Your architecture history is preserved automatically — no manual saves needed.",
  },
  {
    icon: <Diff className="h-5 w-5" />,
    title: "Visual Diffing",
    description:
      "Compare any two versions side-by-side. Added, removed, and modified services are highlighted with clear visual indicators.",
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    title: "Branch & Experiment",
    description:
      "Fork your architecture at any point in time. Experiment with changes safely and merge when you're satisfied.",
  },
  {
    icon: <RotateCcw className="h-5 w-5" />,
    title: "Instant Rollback",
    description:
      "Roll back to any previous version with a single click. Undo mistakes or restore a known-good configuration instantly.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Make changes naturally",
    description:
      "Design in Cloud Playground as usual. Every node addition, connection change, and configuration update is automatically versioned in the background.",
  },
  {
    step: "02",
    title: "Browse and compare",
    description:
      "Open Time Machine to scrub through your architecture's history. Select any two snapshots for a side-by-side visual diff with change annotations.",
  },
  {
    step: "03",
    title: "Rollback or branch",
    description:
      "Found the version you need? Restore it instantly. Want to experiment? Branch from any snapshot and merge changes back when you're done.",
  },
];

const TIMELINE_ENTRIES = [
  { version: "v12", time: "2 min ago", changes: "+2 nodes, +3 edges", author: "You", type: "modify" as const },
  { version: "v11", time: "15 min ago", changes: "Removed CloudWatch", author: "You", type: "delete" as const },
  { version: "v10", time: "1 hour ago", changes: "Added ElastiCache", author: "Sarah", type: "add" as const },
  { version: "v9", time: "3 hours ago", changes: "Multi-AZ RDS config", author: "You", type: "modify" as const },
  { version: "v8", time: "Yesterday", changes: "Initial architecture", author: "You", type: "add" as const },
];

function TimelineMockup() {
  return (
    <div className="relative min-h-[360px]">
      {/* Timeline slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-mono">v1 · Jul 10</span>
          <span className="text-xs text-violet-400 font-mono font-semibold">v12 · Now</span>
        </div>
        <div className="relative h-2 rounded-full bg-graphite/50 border border-white/5">
          <div className="absolute inset-y-0 left-0 w-[92%] rounded-full bg-gradient-to-r from-violet-500/40 to-violet-500" />
          <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-violet-500 border-2 border-void shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
        </div>
        {/* Version dots */}
        <div className="flex justify-between mt-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i === 11 ? "bg-violet-500" : i >= 9 ? "bg-violet-500/40" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Version list */}
      <div className="space-y-2">
        {TIMELINE_ENTRIES.map((entry, i) => (
          <div
            key={entry.version}
            className={`clay-card flex items-center gap-3 p-3 rounded-xl transition-all ${
              i === 0 ? "border-violet-500/30 ring-1 ring-violet-500/10" : ""
            }`}
          >
            <div className="relative">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                  entry.type === "add"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : entry.type === "delete"
                      ? "bg-red-500/15 text-red-400"
                      : "bg-violet-500/15 text-violet-400"
                }`}
              >
                {entry.version}
              </div>
              {i < TIMELINE_ENTRIES.length - 1 && (
                <div className="absolute left-1/2 top-full w-px h-2 bg-white/10" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground">{entry.changes}</div>
              <div className="text-[10px] text-muted-foreground">
                {entry.author} · {entry.time}
              </div>
            </div>

            <div className="flex gap-1">
              <div className="h-6 w-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                <Eye className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="h-6 w-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom controls */}
      <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-4 text-xs text-muted-foreground">
        <span>12 versions</span>
        <span className="text-white/10">·</span>
        <span>3 contributors</span>
        <span className="text-white/10">·</span>
        <span>Created Jul 10, 2026</span>
      </div>
    </div>
  );
}

export function TimeMachineClient() {
  return (
    <>
      <FeatureGrid features={FEATURES} glowColor="#F59E0B" />

      <SectionReveal className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4">
          {[
            { v: "∞", l: "Version history" },
            { v: "Visual", l: "Diff engine" },
            { v: "1-click", l: "Rollback" },
            { v: "Git-style", l: "Branching" },
          ].map((s) => (
            <ClayPanel key={s.l} className="p-4 text-center">
              <div className="font-display text-2xl font-bold text-amber-400">
                {s.v}
              </div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </ClayPanel>
          ))}
        </div>
      </SectionReveal>

      <HowItWorks steps={STEPS} accentColor="#F59E0B" />

      <MockupFrame>
        <TimelineMockup />
      </MockupFrame>

      <ProductCTA
        title="Never lose an architecture decision"
        description="Every change is preserved. Compare versions, understand decisions, and roll back instantly. Your infrastructure's history, always accessible."
        primaryHref="/signup"
        primaryLabel="Try Time Machine"
        secondaryHref="/time-machine"
        secondaryLabel="Open Time Machine"
        glowColor="#F59E0B"
      />
    </>
  );
}
