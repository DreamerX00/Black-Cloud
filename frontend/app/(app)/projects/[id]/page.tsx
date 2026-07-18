import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectIds } from "@/content/projects";
import { ClayCard } from "@/components/ui/clay-card";
import { HealthRing } from "@/components/app/health-ring";
import { Sparkline } from "@/components/app/sparkline";
import { PillButton } from "@/components/ui/pill-button";
import { ProviderChip } from "@/components/ui/provider-chip";
import { MiniCanvas } from "@/components/product/mini-canvas";
import {
  Boxes,
  Sparkles,
  ShieldAlert,
  Clock3,
  Coins,
  BrainCircuit,
  MessagesSquare,
  ArrowUpRight,
  GitBranch,
  ArrowLeft,
} from "lucide-react";

export function generateStaticParams() {
  return getProjectIds().map(id => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = getProject(id);
  return p ? { title: p.name } : { title: "Project not found" };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProject(id);
  if (!p) notFound();

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <ClayCard variant="lg" className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-3">
            <ProviderChip provider={p.provider === "multi" ? "aws" : p.provider} label={p.provider === "multi" ? "multi-cloud" : p.provider} />
            <span className="text-mono-caps text-ink-mute">{p.environment}</span>
            <span className="text-mono-caps text-ink-mute">· owner {p.owner}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">{p.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-6 text-mono-caps text-ink-mute">
            <span>{p.nodes} nodes</span>
            <span>{p.edges} edges</span>
            <span>${(p.cost / 1000).toFixed(1)}k/mo</span>
            <span>updated {p.updated}</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PillButton href={`/playground/${p.id}`} icon={<Boxes className="h-4 w-4" />}>Open in Playground</PillButton>
            <PillButton href={`/ai-architect?project=${p.id}`} variant="ghost" icon={<Sparkles className="h-4 w-4 text-ai" />}>Ask the Council</PillButton>
            <PillButton href={`/simulator?project=${p.id}`} variant="ghost" icon={<ShieldAlert className="h-4 w-4 text-danger" />}>Chaos drill</PillButton>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <HealthRing value={p.health} />
          <div className="text-center">
            <div className="text-mono-caps text-ink-mute">14-day change velocity</div>
            <div className="mt-1 w-40"><Sparkline values={p.activity} tone={p.health >= 85 ? "success" : "ai"} height={40} /></div>
          </div>
        </div>
      </ClayCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ClayCard className="lg:col-span-2 p-3">
          <MiniCanvas />
        </ClayCard>
        <div className="space-y-4">
          {[
            { icon: BrainCircuit, label: "Intelligence", value: `${p.health}/100`, tint: "text-gcp" },
            { icon: Coins, label: "Monthly cost", value: `$${(p.cost / 1000).toFixed(1)}k`, tint: "text-success" },
            { icon: Clock3, label: "Last snapshot", value: p.updated, tint: "text-warn" },
            { icon: GitBranch, label: "Open review PRs", value: "1", tint: "text-ai" },
          ].map(k => {
            const Icon = k.icon;
            return (
              <ClayCard key={k.label} className="flex items-center gap-4 p-5">
                <div className={`clay-sm inline-flex h-11 w-11 items-center justify-center rounded-xl ${k.tint}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-mono-caps text-ink-mute">{k.label}</div>
                  <div className="font-display text-xl font-semibold">{k.value}</div>
                </div>
              </ClayCard>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ClayCard className="p-8">
          <div className="flex items-center gap-3">
            <MessagesSquare className="h-5 w-5 text-ai" />
            <h2 className="font-display text-xl font-semibold">Council notes</h2>
          </div>
          <ul className="mt-5 space-y-4">
            {[
              { who: "Aria", tint: "text-aws", body: "Two roles grant s3:*. Scoping prefix suggested." },
              { who: "Elm", tint: "text-gcp", body: "Storage class transition opportunity: $684/mo savings." },
              { who: "Vex", tint: "text-danger", body: "One Deployment missing liveness probe." },
            ].map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ai" />
                <div>
                  <div className={`text-mono-caps ${c.tint}`}>{c.who}</div>
                  <p className="text-sm text-ink-dim">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/mascots" className="mt-6 inline-flex items-center gap-1.5 text-sm text-ai">Convene the council <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </ClayCard>

        <ClayCard className="p-8">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-warn" />
            <h2 className="font-display text-xl font-semibold">Recent snapshots</h2>
          </div>
          <ol className="mt-5 space-y-3">
            {[
              { d: "Jul 17", body: "+2 nodes · CloudFront + WAF · Δcost +$120/mo", by: "Akash" },
              { d: "Jul 15", body: "Swapped Redis single-AZ → multi-AZ · resilience +7", by: "Priyanka" },
              { d: "Jul 12", body: "Extracted NAT module · code diff -140 lines", by: "Terra (AI)" },
              { d: "Jul 09", body: "Import from Terraform · initial commit", by: "System" },
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="text-mono-caps text-ink-mute w-12 shrink-0">{s.d}</span>
                <div>
                  <div className="text-sm text-ink-dim">{s.body}</div>
                  <div className="text-mono-caps text-ink-mute">{s.by}</div>
                </div>
              </li>
            ))}
          </ol>
          <Link href={`/time-machine?project=${p.id}`} className="mt-6 inline-flex items-center gap-1.5 text-sm text-ai">Open Time Machine <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </ClayCard>
      </div>
    </div>
  );
}
