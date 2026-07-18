import type { Metadata } from "next";
import { ClayCard } from "@/components/ui/clay-card";
import { HealthRing } from "@/components/app/health-ring";
import { Sparkline } from "@/components/app/sparkline";
import { PillButton } from "@/components/ui/pill-button";
import { ShieldCheck, HeartPulse, DollarSign, AlertOctagon, TrendingDown } from "lucide-react";

export const metadata: Metadata = { title: "Health Score" };

const AXES = [
  { icon: ShieldCheck, label: "Security", value: 84, tint: "text-aws", drags: ["s3-writer role scope", "1 role with s3:*"] },
  { icon: HeartPulse, label: "Resilience", value: 91, tint: "text-success", drags: ["1 single-AZ Redis"] },
  { icon: DollarSign, label: "Cost efficiency", value: 78, tint: "text-info", drags: ["12TB idle S3 Standard", "4 oversized EC2"] },
  { icon: AlertOctagon, label: "Drift", value: 96, tint: "text-ai", drags: ["0 real drift · Live Twin synced 2s ago"] },
];

export default function HealthScorePage() {
  const avg = Math.round(AXES.reduce((a, x) => a + x.value, 0) / AXES.length);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <ClayCard variant="lg" glow="gcp" className="relative overflow-hidden p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-30" />
        <div className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-[auto_1fr]">
          <HealthRing value={avg} label="Portfolio" size={200} />
          <div>
            <div className="text-mono-caps text-gcp">Health Score</div>
            <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{avg} — solid, room to breathe.</h1>
            <p className="mt-3 max-w-xl text-ink-dim">Security & Drift are healthy. Cost efficiency has the most room. Two IAM findings to address this week.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <PillButton icon={<TrendingDown className="h-4 w-4" />}>See top 3 improvements</PillButton>
              <PillButton variant="ghost">Export exec PDF</PillButton>
            </div>
          </div>
        </div>
      </ClayCard>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {AXES.map(a => {
          const Icon = a.icon;
          return (
            <ClayCard key={a.label} className="p-6">
              <div className={`clay-sm inline-flex h-11 w-11 items-center justify-center rounded-xl ${a.tint}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className={`font-display text-5xl font-semibold ${a.tint}`}>{a.value}</span>
                <span className="text-ink-mute">/100</span>
              </div>
              <div className="text-mono-caps text-ink-mute">{a.label}</div>
              <ul className="mt-4 space-y-2">
                {a.drags.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-ink-dim">
                    <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${a.tint.replace("text", "bg")}`} />
                    {d}
                  </li>
                ))}
              </ul>
            </ClayCard>
          );
        })}
      </div>

      <ClayCard variant="lg" className="p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Portfolio trend · 90 days</h2>
          <div className="text-mono-caps text-ink-mute">↑ +6 from Q2</div>
        </div>
        <Sparkline
          values={[72, 74, 71, 75, 78, 77, 76, 79, 82, 81, 84, 83, 82, 85, 87, 86, 85, 88, 87, 89, 87, 88, 87]}
          tone="success"
          height={180}
        />
      </ClayCard>

      <ClayCard className="p-8">
        <h2 className="font-display text-2xl font-semibold mb-4">Benchmark · opt-in peers</h2>
        <div className="clay-inset rounded-2xl p-5">
          <div className="text-mono-caps text-ai mb-3">Companies your size · fintech</div>
          <div className="relative h-3 rounded-full bg-white/6">
            <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-warn via-ai to-success" style={{ width: "88%" }} />
            <div className="absolute -top-1 h-5 w-1 rounded bg-ink shadow-clay" style={{ left: `${avg}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-mono-caps text-ink-mute">
            <span>p10 · 62</span>
            <span>median · 78</span>
            <span>you · <span className="text-success">{avg}</span></span>
            <span>p90 · 92</span>
          </div>
        </div>
      </ClayCard>
    </div>
  );
}
