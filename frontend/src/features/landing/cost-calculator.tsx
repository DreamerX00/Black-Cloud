"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * Interactive cost calculator — a real widget.
 *
 * Sliders for instances / storage / traffic. Total re-computes on every
 * change. No fake numbers — the coefficients are calibrated to on-demand
 * AWS list pricing in a mid-tier region (rounded).
 */

const CFG = {
  instance: { unitCost: 30.4, min: 1, max: 40, unit: "t3.medium" },
  storage: { unitCost: 0.023, min: 10, max: 5000, unit: "GB · S3" },
  traffic: { unitCost: 0.09, min: 10, max: 5000, unit: "GB egress" },
};

export function CostCalculator() {
  const [instances, setInstances] = useState(4);
  const [storage, setStorage] = useState(500);
  const [traffic, setTraffic] = useState(300);

  const total = useMemo(() => {
    const instCost = instances * CFG.instance.unitCost;
    const storeCost = storage * CFG.storage.unitCost;
    const trafCost = traffic * CFG.traffic.unitCost;
    return {
      instCost,
      storeCost,
      trafCost,
      total: instCost + storeCost + trafCost,
    };
  }, [instances, storage, traffic]);

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <div className="grid gap-10 tablet:grid-cols-2 tablet:gap-16">
        <div className="flex flex-col justify-center">
          <Reveal>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Act XIV · Cost preview
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
              See the bill.{" "}
              <span className="italic text-muted-foreground">Before you build.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Drag the sliders. Every canvas in BlackCloud gets this same
              projection — updated as you drop nodes and traffic estimates.
            </p>
          </Reveal>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-graphite/40 p-6 backdrop-blur tablet:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-warning/30 opacity-40 blur-3xl"
          />

          {/* Total */}
          <div className="relative z-10 mb-8 border-b border-border/40 pb-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Estimated monthly
            </div>
            <motion.div
              key={total.total.toFixed(0)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 font-display text-6xl font-semibold text-warning tablet:text-7xl"
            >
              ${total.total.toFixed(0)}
            </motion.div>
            <div className="mt-2 text-xs text-muted-foreground">
              on-demand · us-east-1 · list price
            </div>
          </div>

          <div className="relative z-10 space-y-5">
            <Slider
              label="Compute instances"
              unit={CFG.instance.unit}
              value={instances}
              min={CFG.instance.min}
              max={CFG.instance.max}
              onChange={setInstances}
              cost={total.instCost}
              accent="#8B5CF6"
            />
            <Slider
              label="Object storage"
              unit={CFG.storage.unit}
              value={storage}
              min={CFG.storage.min}
              max={CFG.storage.max}
              onChange={setStorage}
              cost={total.storeCost}
              accent="#4285F4"
            />
            <Slider
              label="Egress traffic"
              unit={CFG.traffic.unit}
              value={traffic}
              min={CFG.traffic.min}
              max={CFG.traffic.max}
              onChange={setTraffic}
              cost={total.trafCost}
              accent="#FF9900"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  unit,
  value,
  min,
  max,
  onChange,
  cost,
  accent,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  cost: number;
  accent: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">
          {label}{" "}
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
            {unit}
          </span>
        </span>
        <span className="font-mono text-ink">
          {value.toLocaleString()}{" "}
          <span className="ml-2 text-muted-foreground">
            ${cost.toFixed(0)}
          </span>
        </span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-void/70">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${pct}%`, background: accent }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent opacity-0"
          aria-label={label}
        />
        <div
          aria-hidden
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 bg-void shadow-[0_0_12px_currentColor]"
          style={{ left: `${pct}%`, borderColor: accent, color: accent }}
        />
      </div>
    </div>
  );
}
