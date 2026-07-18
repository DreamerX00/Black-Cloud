"use client";

import { useState } from "react";
import { ClayCard } from "@/components/ui/clay-card";
import { Sparkline } from "@/components/app/sparkline";
import { Coins, TrendingUp, LineChart, ArrowUpRight, Zap } from "lucide-react";

const LINE_ITEMS = [
  { s: "EC2 · t3.medium × 6", u: "us-east-1", m: 4820, i: -8 },
  { s: "RDS · db.r6g.xlarge · Multi-AZ", u: "us-east-1", m: 3620, i: 0 },
  { s: "S3 · 42TB Standard", u: "us-east-1", m: 1240, i: 4 },
  { s: "CloudFront · 32TB", u: "global", m: 890, i: 12 },
  { s: "Lambda · 24M invocations", u: "us-east-1", m: 210, i: 3 },
  { s: "Route 53 · 3 zones", u: "global", m: 60, i: 0 },
];

export default function CostPage() {
  const [scale, setScale] = useState(1);
  const total = LINE_ITEMS.reduce((a, x) => a + x.m, 0) * scale;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <ClayCard variant="lg" glow="success" className="relative overflow-hidden p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-30" />
        <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="text-mono-caps text-success">Cost Simulator</div>
            <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">${(total / 1000).toFixed(2)}k / mo</h1>
            <p className="mt-3 max-w-xl text-ink-dim">Every drag on the canvas recomputes this within 200ms. Explainable to a specific resource. Comparable region-to-region.</p>
          </div>
          <ClayCard className="p-4">
            <div className="text-mono-caps text-ink-mute mb-2">Scale multiplier</div>
            <input
              type="range"
              min={0.5}
              max={10}
              step={0.5}
              value={scale}
              onChange={e => setScale(Number(e.target.value))}
              className="w-52 accent-[var(--color-success)]"
            />
            <div className="mt-2 flex justify-between font-mono text-xs text-ink-mute">
              <span>0.5×</span>
              <span className="text-success">{scale}×</span>
              <span>10×</span>
            </div>
          </ClayCard>
        </div>
      </ClayCard>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: Coins, l: "Monthly", v: `$${(total / 1000).toFixed(1)}k`, t: "text-success" },
          { icon: TrendingUp, l: "Annual", v: `$${((total * 12) / 1000).toFixed(0)}k`, t: "text-ai" },
          { icon: LineChart, l: "vs. last mo", v: "-4.2%", t: "text-success" },
          { icon: Zap, l: "RI optimized", v: "$2.1k saved", t: "text-info" },
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ClayCard variant="lg" className="lg:col-span-2 overflow-hidden">
          <div className="border-b border-white/8 p-6">
            <div className="text-mono-caps text-ink-mute">Line items · every dollar explains itself</div>
          </div>
          <table className="w-full">
            <thead className="border-b border-white/8">
              <tr className="text-mono-caps text-ink-mute">
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Region</th>
                <th className="p-4 text-right">Monthly</th>
                <th className="p-4 text-right">Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {LINE_ITEMS.map((li, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="p-4 text-sm text-ink">{li.s}</td>
                  <td className="p-4 text-mono-caps text-ink-mute">{li.u}</td>
                  <td className="p-4 text-right font-display font-semibold">${(li.m * scale).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className={`p-4 text-right font-mono text-xs ${li.i > 0 ? "text-danger" : li.i < 0 ? "text-success" : "text-ink-mute"}`}>
                    {li.i > 0 ? "+" : ""}{li.i}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ClayCard>

        <ClayCard className="p-6">
          <div className="text-mono-caps text-success mb-3">Optimizations</div>
          <ul className="space-y-3">
            {[
              { t: "Move 12TB S3 cold data to Glacier IR", s: "-$620/mo" },
              { t: "Right-size 4 EC2 instances from m5 → t4g", s: "-$410/mo" },
              { t: "1-year Reserved on RDS r6g.xlarge", s: "-$1.1k/mo" },
              { t: "CloudFront reserved capacity tier", s: "-$180/mo" },
            ].map((o, i) => (
              <li key={i} className="clay-sm flex items-start justify-between gap-3 rounded-xl p-3">
                <div>
                  <div className="text-sm text-ink">{o.t}</div>
                  <div className="text-mono-caps text-success">apply · one-click</div>
                </div>
                <div className="font-display font-semibold text-success">{o.s}</div>
              </li>
            ))}
          </ul>
        </ClayCard>
      </div>

      <ClayCard className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-mono-caps text-ai">30-day trend</div>
          <ArrowUpRight className="h-3.5 w-3.5 text-danger rotate-180" />
        </div>
        <Sparkline
          values={[42, 44, 41, 43, 46, 45, 47, 46, 44, 43, 45, 43, 41, 42, 40, 41, 43, 42, 44, 41, 39, 38, 40, 38, 37, 39, 38, 36, 37, 35]}
          tone="success"
          height={120}
        />
      </ClayCard>
    </div>
  );
}
