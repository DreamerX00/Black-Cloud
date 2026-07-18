"use client";

import { useState } from "react";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { MiniCanvas } from "@/components/product/mini-canvas";
import { User, Rewind, PlayCircle, Diff } from "lucide-react";

const SNAPSHOTS = [
  { d: "Jul 17", by: "Akash", title: "+CloudFront + WAF · Δcost +$120", tint: "text-info", tag: "new" },
  { d: "Jul 15", by: "Priyanka", title: "Redis single-AZ → multi-AZ · resilience +7", tint: "text-success", tag: "fix" },
  { d: "Jul 12", by: "Terra (AI)", title: "NAT extraction · code diff -140 lines", tint: "text-ai", tag: "refactor" },
  { d: "Jul 09", by: "System", title: "Import from Terraform · initial commit", tint: "text-aws", tag: "import" },
  { d: "Jun 28", by: "Marcus", title: "Add DR runbook to prod graph", tint: "text-success", tag: "doc" },
  { d: "Jun 22", by: "Aria (AI)", title: "IAM tightening PR merged", tint: "text-aws", tag: "sec" },
  { d: "Jun 15", by: "Rin", title: "Chaos game day drill · 2 findings", tint: "text-danger", tag: "chaos" },
  { d: "Jun 08", by: "Ade", title: "GKE cluster downsized · Δcost -$740", tint: "text-success", tag: "cost" },
];

export default function TimeMachinePage() {
  const [pos, setPos] = useState(0);
  const active = SNAPSHOTS[pos];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <ClayCard variant="lg" className="relative overflow-hidden p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-25" />
        <div className="relative">
          <div className="text-mono-caps text-warn">Time Machine</div>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Every diff. Every reason.</h1>
          <p className="mt-3 max-w-xl text-ink-dim">Scrub through 18 months of your infrastructure history. Every node carries the rationale it was created with.</p>
        </div>
      </ClayCard>

      <ClayCard variant="lg" className="p-6">
        <div className="flex items-center justify-between text-mono-caps">
          <span className="text-warn">History · newest → oldest</span>
          <span className="text-ink-mute">{active.d} · by {active.by}</span>
        </div>
        <input
          type="range"
          min={0}
          max={SNAPSHOTS.length - 1}
          value={pos}
          onChange={e => setPos(Number(e.target.value))}
          className="mt-4 w-full accent-[var(--color-warn)]"
        />
        <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-mute">
          {SNAPSHOTS.map((s, i) => (
            <span key={i} className={i === pos ? "text-warn" : ""}>{s.d.split(" ")[1]}</span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <PillButton icon={<Rewind className="h-4 w-4" />} variant="ghost" onClick={() => setPos(SNAPSHOTS.length - 1)}>Rewind to origin</PillButton>
          <PillButton icon={<PlayCircle className="h-4 w-4" />}>Replay from here</PillButton>
          <PillButton icon={<Diff className="h-4 w-4" />} variant="ghost">Diff vs current</PillButton>
        </div>
      </ClayCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <ClayCard variant="lg" className="p-3">
          <MiniCanvas />
        </ClayCard>

        <ClayCard className="p-6">
          <div className="text-mono-caps text-ai mb-3">Snapshot log</div>
          <ol className="relative border-l border-white/8 pl-6">
            {SNAPSHOTS.map((s, i) => (
              <li key={i} className={`mb-4 ${i === pos ? "text-ink" : "text-ink-dim"}`}>
                <span className={`absolute -left-1.5 mt-1 h-3 w-3 rounded-full ${i === pos ? "bg-warn animate-pulse-slow" : "bg-white/20"}`} />
                <button onClick={() => setPos(i)} className="text-left w-full">
                  <div className="flex items-center justify-between">
                    <div className={`text-mono-caps ${s.tint}`}>{s.d}</div>
                    <div className="text-mono-caps text-ink-mute">{s.tag}</div>
                  </div>
                  <div className="mt-0.5 text-sm">{s.title}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-ink-mute">
                    <User className="h-3 w-3" /> {s.by}
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </ClayCard>
      </div>
    </div>
  );
}
