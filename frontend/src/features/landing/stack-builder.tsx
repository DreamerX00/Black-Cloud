"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { NODE_BY_ID } from "@/lib/nodes/registry";

/**
 * Stack Builder — Act "your stack".
 *
 * Real interactivity, not a scripted loop. User clicks any subset of tier
 * chips (edge / compute / data / storage) to assemble a live SVG diagram.
 * Each click animates in a node + wires it to its neighbours. Empty state
 * shows a call-to-arms.
 */

interface Choice {
  id: string;      // registry id
  tier: Tier;
  x: number;       // % on the canvas
  y: number;       // % on the canvas
}
type Tier = "edge" | "compute" | "data" | "storage";

interface Option {
  id: string;
  tier: Tier;
  label: string;
  swatch: string;
}

const OPTIONS: Record<Tier, Option[]> = {
  edge: [
    { id: "aws.cloudfront", tier: "edge", label: "CloudFront", swatch: "#FF9900" },
    { id: "aws.route53", tier: "edge", label: "Route53", swatch: "#FF9900" },
    { id: "aws.alb", tier: "edge", label: "ALB", swatch: "#FF9900" },
  ],
  compute: [
    { id: "aws.ec2", tier: "compute", label: "EC2", swatch: "#FF9900" },
    { id: "aws.lambda", tier: "compute", label: "Lambda", swatch: "#FF9900" },
    { id: "gcp.cloud-run", tier: "compute", label: "Cloud Run", swatch: "#4285F4" },
    { id: "azure.functions", tier: "compute", label: "Az Functions", swatch: "#0078D4" },
  ],
  data: [
    { id: "aws.rds", tier: "data", label: "RDS", swatch: "#FF9900" },
    { id: "aws.dynamodb", tier: "data", label: "DynamoDB", swatch: "#FF9900" },
    { id: "gcp.cloud-sql", tier: "data", label: "Cloud SQL", swatch: "#4285F4" },
  ],
  storage: [
    { id: "aws.s3", tier: "storage", label: "S3", swatch: "#FF9900" },
    { id: "gcp.cloud-storage", tier: "storage", label: "Cloud Storage", swatch: "#4285F4" },
    { id: "azure.blob-storage", tier: "storage", label: "Blob", swatch: "#0078D4" },
  ],
};

const TIER_X: Record<Tier, number> = { edge: 15, compute: 45, data: 78, storage: 78 };
const TIER_Y_BASE: Record<Tier, number> = { edge: 50, compute: 50, data: 28, storage: 68 };
// Clamp node y so stacks never intrude on the bottom stats bar (~90%).
const Y_MAX = 82;

export function StackBuilder() {
  const [chosen, setChosen] = useState<Choice[]>([]);

  const toggle = (opt: Option) => {
    setChosen((cur) => {
      const idx = cur.findIndex((c) => c.id === opt.id);
      if (idx >= 0) {
        const copy = [...cur];
        copy.splice(idx, 1);
        return copy;
      }
      // Compute a slot within its tier column. Clamped to Y_MAX so nothing
      // stacks past the bottom stats bar.
      const tierCount = cur.filter((c) => c.tier === opt.tier).length;
      const rawY =
        opt.tier === "storage"
          ? TIER_Y_BASE.storage + tierCount * 7
          : TIER_Y_BASE[opt.tier] + (tierCount - 0.5) * 11;
      const y = Math.min(Y_MAX, Math.max(12, rawY));
      return [...cur, { id: opt.id, tier: opt.tier, x: TIER_X[opt.tier], y }];
    });
  };

  const isPicked = (id: string) => chosen.some((c) => c.id === id);

  // Edges: connect every edge-tier → compute → data/storage.
  const edges = buildEdges(chosen);

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <header className="mb-10 max-w-3xl">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act XI · Assemble
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
            Build your stack.{" "}
            <span className="italic text-muted-foreground">In this box.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Tap the chips below. Watch the graph assemble. This is a shrunken
            preview of the real canvas — no login, no wait.
          </p>
        </Reveal>
      </header>

      <div className="grid gap-6 tablet:grid-cols-[320px_1fr]">
        {/* Chip picker */}
        <aside className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-graphite/40 p-5 backdrop-blur">
          {(Object.keys(OPTIONS) as Tier[]).map((tier) => (
            <div key={tier}>
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span>{tier}</span>
                <span>{chosen.filter((c) => c.tier === tier).length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {OPTIONS[tier].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggle(opt)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                      isPicked(opt.id)
                        ? "border-ai/60 bg-ai/15 text-ink"
                        : "border-border/60 bg-void/40 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                    style={
                      isPicked(opt.id)
                        ? { boxShadow: `inset 3px 0 0 0 ${opt.swatch}` }
                        : undefined
                    }
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: opt.swatch }}
                    />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setChosen([])}
            className="mt-2 rounded-md border border-border/50 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear canvas
          </button>
        </aside>

        {/* Canvas */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/60 bg-space/70 backdrop-blur">
          {/* Grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <svg viewBox="0 0 1000 625" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="sb-edge" x1="0" x2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#4285F4" />
              </linearGradient>
            </defs>
            {edges.map((e, i) => (
              <motion.line
                key={`${e.from}-${e.to}-${i}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                x1={(e.fromX / 100) * 1000}
                y1={(e.fromY / 100) * 625}
                x2={(e.toX / 100) * 1000}
                y2={(e.toY / 100) * 625}
                stroke="url(#sb-edge)"
                strokeWidth={2}
                strokeLinecap="round"
              />
            ))}
          </svg>

          <AnimatePresence>
            {chosen.map((c) => {
              const def = NODE_BY_ID.get(c.id);
              if (!def) return null;
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-lg border border-border/60 bg-graphite/85 px-3 py-2 backdrop-blur"
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    boxShadow: `inset 3px 0 0 0 ${def.accent}`,
                  }}
                >
                  {def.iconPath && (
                    <Image src={def.iconPath} width={18} height={18} alt="" aria-hidden unoptimized />
                  )}
                  <div className="text-xs font-medium">{def.label}</div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {chosen.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">
              Pick chips on the left to start drawing your stack.
            </div>
          )}

          {/* Stats bar */}
          <div className="absolute inset-x-0 bottom-0 flex justify-between border-t border-border/40 bg-void/60 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>{chosen.length} nodes</span>
            <span>{edges.length} edges</span>
            <span>
              cost{" "}
              <span className="text-warning">
                ${Math.max(0, chosen.length * 47 - 12)}
              </span>
              /mo est
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function buildEdges(chosen: Choice[]) {
  const edges: Array<{
    from: string;
    to: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }> = [];
  const edgeNodes = chosen.filter((c) => c.tier === "edge");
  const computeNodes = chosen.filter((c) => c.tier === "compute");
  const dataNodes = chosen.filter((c) => c.tier === "data" || c.tier === "storage");

  edgeNodes.forEach((e) => {
    computeNodes.forEach((c) => {
      edges.push({ from: e.id, to: c.id, fromX: e.x, fromY: e.y, toX: c.x, toY: c.y });
    });
  });
  computeNodes.forEach((c) => {
    dataNodes.forEach((d) => {
      edges.push({ from: c.id, to: d.id, fromX: c.x, fromY: c.y, toX: d.x, toY: d.y });
    });
  });
  return edges;
}
