"use client";

import { useState } from "react";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { MiniCanvas } from "@/components/product/mini-canvas";
import { AlertOctagon, Zap, MapPin, Radar, Play, RotateCcw, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const SCENARIOS = [
  { id: "az", icon: MapPin, tint: "text-warn", title: "AZ outage", body: "Kill one availability zone in the primary region.", severity: "medium" },
  { id: "region", icon: Zap, tint: "text-danger", title: "Region failure", body: "Simulate total loss of us-east-1.", severity: "high" },
  { id: "db", icon: AlertOctagon, tint: "text-danger", title: "Database crash", body: "Primary Postgres down. Force failover.", severity: "high" },
  { id: "lb", icon: Radar, tint: "text-warn", title: "Load balancer failure", body: "ALB drops traffic; DNS reroute time recorded.", severity: "medium" },
  { id: "svc", icon: Zap, tint: "text-ai", title: "Service crash", body: "ECS task crash-loops.", severity: "low" },
];

export default function SimulatorPage() {
  const [running, setRunning] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const run = async (id: string) => {
    setRunning(id);
    setLogs([]);
    const push = (l: string) => setLogs(prev => [...prev, l]);
    push("chaos.fire()"); await new Promise(r => setTimeout(r, 400));
    push("→ 5 services impacted"); await new Promise(r => setTimeout(r, 500));
    push("→ blast radius mapped (14 downstream)"); await new Promise(r => setTimeout(r, 600));
    push("→ reroute path found: 3/5 recovered in <45s"); await new Promise(r => setTimeout(r, 700));
    push("→ 2 required manual action"); await new Promise(r => setTimeout(r, 500));
    push("Health 87 → 73 → 79 (partial recovery)");
    toast.success("Scenario complete");
    setRunning(null);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <ClayCard variant="lg" glow="danger" className="relative overflow-hidden p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-30" />
        <div className="relative flex items-start justify-between gap-6">
          <div>
            <div className="text-mono-caps text-danger">Failure Simulator</div>
            <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Rehearse the worst hour.</h1>
            <p className="mt-3 max-w-xl text-ink-dim">Every scenario is a pure graph traversal. No real infrastructure is touched.</p>
          </div>
          <PillButton icon={<Trophy className="h-4 w-4" />} variant="ghost">Schedule Game Day</PillButton>
        </div>
      </ClayCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          <ClayCard variant="lg" className="p-3">
            <MiniCanvas />
          </ClayCard>

          <ClayCard className="p-6">
            <div className="text-mono-caps text-ai mb-3">Live traces</div>
            <div className="clay-inset h-48 overflow-y-auto rounded-xl p-4 font-mono text-xs text-ink-dim">
              {logs.length === 0 ? (
                <div className="text-ink-mute">{`// waiting for scenario…`}</div>
              ) : (
                logs.map((l, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="mb-1">
                    <span className="text-ai">{String(i + 1).padStart(2, "0")}</span> · {l}
                  </motion.div>
                ))
              )}
            </div>
          </ClayCard>
        </div>

        <aside className="space-y-3">
          <div className="text-mono-caps text-ink-mute">Scenario library</div>
          {SCENARIOS.map(s => {
            const Icon = s.icon;
            return (
              <ClayCard key={s.id} interactive className="flex items-start gap-4 p-5">
                <div className={`clay-sm inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.tint}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-display text-lg font-semibold">{s.title}</div>
                    <span className={`text-mono-caps ${s.severity === "high" ? "text-danger" : s.severity === "medium" ? "text-warn" : "text-ink-mute"}`}>
                      {s.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-dim">{s.body}</p>
                  <div className="mt-3 flex gap-2">
                    <PillButton size="sm" onClick={() => run(s.id)} disabled={!!running} icon={<Play className="h-3 w-3" />}>
                      {running === s.id ? "Running…" : "Fire"}
                    </PillButton>
                    <PillButton size="sm" variant="ghost" icon={<RotateCcw className="h-3 w-3" />}>Reset</PillButton>
                  </div>
                </div>
              </ClayCard>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
