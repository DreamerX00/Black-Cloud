"use client";
import { NumberTicker } from "@/components/effects/number-ticker";

const STATS = [
  { label: "Deploys / day", value: 48000, suffix: "+" },
  { label: "Regions", value: 96, suffix: "" },
  { label: "Uptime", value: 99, suffix: ".99%" },
  { label: "Services", value: 23, suffix: "" },
];

export default function Act3Core() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center text-center">
      <h2 className="mb-16 text-4xl font-bold">Straight into the core.</h2>
      <div className="grid grid-cols-2 gap-12 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-5xl font-bold text-accent-cyan">
              <NumberTicker value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-sm text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
