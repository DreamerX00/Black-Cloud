"use client";

import { useState } from "react";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { motion } from "motion/react";
import { ProviderChip } from "@/components/ui/provider-chip";
import { ArrowRight, Upload, GitBranch, Play, Coins, Timer, ShieldQuestion } from "lucide-react";

type Cloud = "aws" | "azure" | "gcp";

const SAMPLE = [
  { src: "EC2", tgt: "Compute Engine", note: "Exact-1 mapping; instance-family selection auto." },
  { src: "Lambda", tgt: "Cloud Run", note: "Cold-start behavior different; adjust timeouts." },
  { src: "S3", tgt: "Cloud Storage", note: "Life-cycle rules preserved; object-versioning translated." },
  { src: "RDS Postgres", tgt: "Cloud SQL Postgres", note: "Version match; downtime window recommended." },
  { src: "DynamoDB", tgt: "Firestore", note: "Adjacent — schema translation required." },
  { src: "SQS", tgt: "Pub/Sub", note: "Queue semantics translate to pull subscriptions." },
];

export default function MigrationPage() {
  const [source, setSource] = useState<Cloud>("aws");
  const [target, setTarget] = useState<Cloud>("gcp");
  const [progress, setProgress] = useState(0);

  const run = async () => {
    setProgress(1);
    for (let i = 1; i <= 100; i++) {
      await new Promise(r => setTimeout(r, 15));
      setProgress(i);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <ClayCard variant="lg" glow="aws" className="relative overflow-hidden p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-30" />
        <div className="relative">
          <div className="text-mono-caps text-aws">Migration Ground</div>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Watch it translate itself.</h1>
          <p className="mt-3 max-w-xl text-ink-dim">Choose a source and target cloud. We’ll morph every node, score every risk, and honestly show you the cost delta.</p>

          <div className="mt-8 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            <ClayCard variant="sm" className="p-4">
              <div className="text-mono-caps text-ink-mute mb-2">Source</div>
              <div className="flex gap-2">
                {(["aws", "azure", "gcp"] as Cloud[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setSource(c)}
                    className={source === c ? "clay rounded-xl px-3 py-1.5 text-mono-caps" : "rounded-xl border border-white/10 px-3 py-1.5 text-mono-caps text-ink-mute"}
                  >
                    <ProviderChip provider={c} />
                  </button>
                ))}
              </div>
            </ClayCard>
            <ArrowRight className="mx-auto h-8 w-8 text-ai animate-pulse-slow" />
            <ClayCard variant="sm" className="p-4">
              <div className="text-mono-caps text-ink-mute mb-2">Target</div>
              <div className="flex gap-2">
                {(["aws", "azure", "gcp"] as Cloud[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setTarget(c)}
                    className={target === c ? "clay rounded-xl px-3 py-1.5 text-mono-caps" : "rounded-xl border border-white/10 px-3 py-1.5 text-mono-caps text-ink-mute"}
                  >
                    <ProviderChip provider={c} />
                  </button>
                ))}
              </div>
            </ClayCard>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PillButton icon={<Upload className="h-4 w-4" />} variant="ghost">Import Terraform</PillButton>
            <PillButton icon={<GitBranch className="h-4 w-4" />} variant="ghost">Import CloudFormation</PillButton>
            <PillButton icon={<Play className="h-4 w-4" />} onClick={run}>Run migration analysis</PillButton>
          </div>
        </div>
      </ClayCard>

      {/* Progress + scores */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { icon: Timer, l: "Timeline", v: "6-8 wks", t: "text-warn" },
          { icon: ShieldQuestion, l: "Risk", v: "Medium", t: "text-danger" },
          { icon: Coins, l: "Δ Cost", v: "−$1.4k/mo", t: "text-success" },
          { icon: GitBranch, l: "Nodes touched", v: "47 · 42✔ · 3⚠ · 2⛔", t: "text-ai" },
        ].map(k => {
          const Icon = k.icon;
          return (
            <ClayCard key={k.l} className="p-5">
              <div className={`clay-sm inline-flex h-10 w-10 items-center justify-center rounded-xl ${k.t}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-mono-caps text-ink-mute">{k.l}</div>
              <div className="mt-1 font-display text-2xl font-semibold">{k.v}</div>
            </ClayCard>
          );
        })}
      </div>

      {progress > 0 && (
        <ClayCard className="p-6">
          <div className="mb-2 flex items-center justify-between text-mono-caps">
            <span className="text-ai">Morphing graph</span>
            <span className="text-ink-mute">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
            <motion.div
              className="h-full bg-gradient-to-r from-ai to-info"
              animate={{ width: `${progress}%` }}
            />
          </div>
        </ClayCard>
      )}

      {/* Mapping table */}
      <ClayCard variant="lg" className="overflow-hidden">
        <div className="border-b border-white/8 p-6">
          <div className="text-mono-caps text-ink-mute">Service mapping · {source.toUpperCase()} → {target.toUpperCase()}</div>
        </div>
        <table className="w-full">
          <thead className="border-b border-white/8">
            <tr className="text-mono-caps text-ink-mute">
              <th className="p-4 text-left">Source</th>
              <th className="p-4 text-left">Target</th>
              <th className="p-4 text-left">Notes</th>
              <th className="p-4 text-left">Compat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {SAMPLE.map((m, i) => (
              <tr key={i} className="hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <ProviderChip provider={source} />
                    <span className="font-medium">{m.src}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <ProviderChip provider={target} />
                    <span className="font-medium">{m.tgt}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-ink-dim">{m.note}</td>
                <td className="p-4">
                  <span className={i < 4 ? "text-success" : i < 5 ? "text-warn" : "text-danger"}>
                    {i < 4 ? "Exact" : i < 5 ? "Adjacent" : "Manual"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ClayCard>
    </div>
  );
}
