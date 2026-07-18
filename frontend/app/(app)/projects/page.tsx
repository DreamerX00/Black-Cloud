import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS } from "@/content/projects";
import { ClayCard } from "@/components/ui/clay-card";
import { ProviderChip } from "@/components/ui/provider-chip";
import { Sparkline } from "@/components/app/sparkline";
import { PillButton } from "@/components/ui/pill-button";
import { Reveal } from "@/components/ui/reveal";
import { Plus, Search, Filter, Grid3x3, ListTree } from "lucide-react";

export const metadata: Metadata = { title: "Projects" };

const STATUS_TINT = {
  live: "text-success border-success/40",
  review: "text-ai border-ai/40",
  draft: "text-ink-mute border-white/10",
  chaos: "text-danger border-danger/40",
} as const;

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-4xl font-semibold">Projects</h1>
          <p className="mt-2 text-ink-dim">Every graph in your workspace, all reading from the same universe.</p>
        </div>
        <PillButton href="/projects/new" size="lg" icon={<Plus className="h-4 w-4" />}>New project</PillButton>
      </div>

      {/* Controls */}
      <ClayCard variant="sm" className="flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <div className="clay-inset flex flex-1 items-center gap-3 rounded-xl px-4 py-2">
          <Search className="h-4 w-4 text-ink-mute" />
          <input
            placeholder="Filter projects, tags, owners…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-faint"
          />
        </div>
        <div className="flex items-center gap-2">
          {["All", "Production", "Staging", "Drafts"].map((f, i) => (
            <button
              key={f}
              className={
                i === 0
                  ? "clay rounded-full px-3 py-1.5 text-xs font-mono uppercase tracking-widest"
                  : "rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-mono uppercase tracking-widest text-ink-mute hover:text-ink"
              }
            >
              {f}
            </button>
          ))}
          <button className="clay-sm inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-mute" aria-label="Filter">
            <Filter className="h-4 w-4" />
          </button>
          <div className="clay-sm ml-2 inline-flex overflow-hidden rounded-xl">
            <button className="inline-flex h-9 w-9 items-center justify-center bg-white/8 text-ai" aria-label="Grid view"><Grid3x3 className="h-4 w-4" /></button>
            <button className="inline-flex h-9 w-9 items-center justify-center text-ink-mute" aria-label="List view"><ListTree className="h-4 w-4" /></button>
          </div>
        </div>
      </ClayCard>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.05}>
            <Link href={`/projects/${p.id}`}>
              <ClayCard interactive className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-start justify-between">
                  <ProviderChip provider={p.provider === "multi" ? "aws" : p.provider} label={p.provider === "multi" ? "multi-cloud" : p.provider} />
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${STATUS_TINT[p.status]}`}>
                    {p.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold leading-tight">{p.name}</h3>
                  <div className="mt-2 flex items-center gap-3 text-mono-caps text-ink-mute">
                    <span>{p.nodes} nodes</span>
                    <span className="opacity-40">◆</span>
                    <span>{p.edges} edges</span>
                    <span className="opacity-40">◆</span>
                    <span>{p.environment}</span>
                  </div>
                </div>
                <Sparkline values={p.activity} tone={p.health >= 85 ? "success" : "ai"} />
                <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/6 pt-3">
                  <div>
                    <div className="text-mono-caps text-ink-mute">Health</div>
                    <div className={`font-display text-lg font-semibold ${p.health >= 85 ? "text-success" : p.health >= 70 ? "text-ai" : "text-warn"}`}>{p.health}</div>
                  </div>
                  <div>
                    <div className="text-mono-caps text-ink-mute">Cost</div>
                    <div className="font-display text-lg font-semibold">${(p.cost / 1000).toFixed(1)}k</div>
                  </div>
                  <div>
                    <div className="text-mono-caps text-ink-mute">Owner</div>
                    <div className="truncate text-sm">{p.owner}</div>
                  </div>
                </div>
              </ClayCard>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
