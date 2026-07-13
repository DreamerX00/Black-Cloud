"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import { NODE_BY_ID } from "@/lib/nodes/registry";
import { cn } from "@/lib/utils";

/**
 * Playground preview — the "startframe".
 *
 * A live, choreographed demo of what BlackCloud does. Real node icons from
 * the registry render at real positions; a scripted timeline draws an edge,
 * a validation warning surfaces, then the loop resets. This is the pattern
 * Apple Vision Pro / Stripe Sessions use to open the product story with a
 * moving frame instead of a screenshot.
 *
 * Not a React Flow instance — the interactions here are 100% fake. But the
 * nodes render from the same registry the real playground uses, so the
 * visual language is identical.
 */

interface DemoNode {
  id: string; // registry id (aws.alb, aws.ec2…)
  x: number; // percent — 0..100
  y: number; // percent — 0..100
}

interface DemoEdge {
  from: string;
  to: string;
  /** When the edge draws in the timeline (0..1 progress). */
  drawAt: number;
  /** Whether the validator flags this edge. */
  warn?: boolean;
}

// A canonical three-tier web app: ALB → EC2 → RDS, plus S3 for static assets.
const NODES: DemoNode[] = [
  { id: "aws.alb", x: 15, y: 50 },
  { id: "aws.ec2", x: 45, y: 30 },
  { id: "aws.rds", x: 80, y: 50 },
  { id: "aws.s3", x: 45, y: 78 },
];

const EDGES: DemoEdge[] = [
  { from: "aws.alb", to: "aws.ec2", drawAt: 0.1 },
  { from: "aws.ec2", to: "aws.rds", drawAt: 0.35 },
  { from: "aws.ec2", to: "aws.s3", drawAt: 0.6, warn: true },
];

const LOOP_MS = 8000;

export function PlaygroundPreview() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(reduce ? 1 : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = ((now - start) % LOOP_MS) / LOOP_MS;
      setProgress(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  const warnEdge = EDGES.find((e) => e.warn);
  const warnActive = !!(
    warnEdge && progress > warnEdge.drawAt + 0.05 && progress < 0.92
  );

  return (
    <section
      ref={rootRef}
      className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32"
    >
      {/* Section label — the "chapter marker" for the demo. */}
      <div className="mb-10 flex items-center justify-between gap-4 tablet:mb-14">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Startframe · Live
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] tablet:text-5xl">
            The canvas thinks with you.
          </h2>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-border/50 bg-graphite/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground tablet:flex">
          <span className="size-1.5 rounded-full bg-success" />
          Realtime validation
        </div>
      </div>

      {/* The frame — window chrome + canvas + inspector rail. */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-space/80 shadow-[0_40px_120px_-30px_rgba(139,92,246,0.35)] backdrop-blur-xl">
        {/* Chrome bar */}
        <div className="flex items-center gap-3 border-b border-border/50 bg-void/60 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-danger/70" />
            <span className="size-2.5 rounded-full bg-warning/70" />
            <span className="size-2.5 rounded-full bg-success/70" />
          </div>
          <div className="ml-3 flex items-center gap-2 rounded-md border border-border/40 bg-graphite/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-ai/70" />
            three-tier-web · <span className="text-ink">saved</span>
          </div>
          <div className="ml-auto font-mono text-[10px] tracking-widest text-muted-foreground">
            60fps
          </div>
        </div>

        <div className="grid grid-cols-[1fr] tablet:grid-cols-[1fr_260px]">
          {/* Canvas */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(circle_at_50%_60%,rgba(139,92,246,0.08),transparent_65%)]">
            {/* Grid */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* SVG layer for edges + packets */}
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1000 625"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4285F4" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="edgeWarn" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {EDGES.map((edge, i) => {
                const from = NODES.find((n) => n.id === edge.from)!;
                const to = NODES.find((n) => n.id === edge.to)!;
                const x1 = (from.x / 100) * 1000;
                const y1 = (from.y / 100) * 625;
                const x2 = (to.x / 100) * 1000;
                const y2 = (to.y / 100) * 625;
                const localT = Math.max(
                  0,
                  Math.min(1, (progress - edge.drawAt) * 6),
                );
                return (
                  <g key={i}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x1 + (x2 - x1) * localT}
                      y2={y1 + (y2 - y1) * localT}
                      stroke={
                        edge.warn && localT > 0.7
                          ? "url(#edgeWarn)"
                          : "url(#edgeGrad)"
                      }
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeDasharray={edge.warn && localT > 0.7 ? "6 6" : undefined}
                    />
                    {localT > 0 && localT < 1 && (
                      <circle
                        cx={x1 + (x2 - x1) * localT}
                        cy={y1 + (y2 - y1) * localT}
                        r={5}
                        fill="#EDEDED"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Node chips */}
            {NODES.map((n) => (
              <DemoNodeChip
                key={n.id}
                node={n}
                warn={warnActive && warnEdge?.to === n.id}
              />
            ))}

            {/* Fake cursor drawing the third edge. */}
            <FakeCursor progress={progress} />

            {/* Validation toast */}
            <AnimatePresence>
              {warnActive && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                  className="absolute bottom-4 left-4 flex max-w-sm items-start gap-3 rounded-lg border border-warning/50 bg-warning/10 px-4 py-3 backdrop-blur"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/20 text-warning">
                    !
                  </span>
                  <div className="text-xs leading-relaxed">
                    <div className="font-medium text-ink">
                      EC2 → S3 traffic exits the VPC
                    </div>
                    <div className="mt-0.5 text-muted-foreground">
                      Add a Gateway VPC Endpoint to keep it internal & save on
                      egress.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right rail — mock inspector */}
          <aside className="hidden border-l border-border/50 bg-void/40 p-5 tablet:block">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Selection
            </div>
            <div className="mt-2 font-display text-lg">Amazon EC2</div>
            <div className="mt-1 text-xs text-muted-foreground">
              stateless · vpc-scoped
            </div>

            <div className="mt-6 space-y-3 text-xs">
              <RailRow k="Instance" v="t3.medium" />
              <RailRow k="Subnet" v="private-a" />
              <RailRow k="Security group" v="web-sg" />
            </div>

            <div className="mt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Validation
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <RailStatus ok label="Reachable via ALB" />
              <RailStatus ok label="Egress to RDS allowed" />
              <RailStatus warn={warnActive} label="S3 access via VPC endpoint" />
            </div>
          </aside>
        </div>
      </div>

      {/* Caption */}
      <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
        Every edge is checked in real time. Misconfigurations surface as you
        draw — before they surface as your cloud bill.
      </p>
    </section>
  );
}

/* ── Bits ─────────────────────────────────────────────────────────────── */

function DemoNodeChip({ node, warn }: { node: DemoNode; warn: boolean }) {
  const def = NODE_BY_ID.get(node.id);
  if (!def) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-lg border bg-graphite/85 px-3 py-2 shadow-lg backdrop-blur",
        warn ? "border-warning ring-2 ring-warning/30" : "border-border/60",
      )}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      {def.iconPath && (
        <Image
          src={def.iconPath}
          width={20}
          height={20}
          alt=""
          aria-hidden
          unoptimized
        />
      )}
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="text-xs font-medium">{def.label}</span>
        <span
          className="text-[9px] uppercase tracking-widest"
          style={{ color: def.accent }}
        >
          {def.provider}
        </span>
      </div>
    </motion.div>
  );
}

function FakeCursor({ progress }: { progress: number }) {
  // Cursor traces the third (warning) edge as it draws — reinforces "you
  // drew this and BlackCloud flagged it."
  const edge = EDGES[2];
  const from = NODES.find((n) => n.id === edge.from)!;
  const to = NODES.find((n) => n.id === edge.to)!;
  const t = Math.max(0, Math.min(1, (progress - edge.drawAt) * 6));
  if (t <= 0 || t >= 1) return null;
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-4px, -4px)",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M2 2L18 8L10 10L8 18L2 2Z"
          fill="#EDEDED"
          stroke="#050505"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function RailRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/30 pb-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-mono text-[11px]">{v}</span>
    </div>
  );
}

function RailStatus({
  label,
  ok,
  warn,
}: {
  label: string;
  ok?: boolean;
  warn?: boolean;
}) {
  const color = warn ? "bg-warning" : ok ? "bg-success" : "bg-muted-foreground";
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-1.5 rounded-full", color)} />
      <span className={cn(warn && "text-warning")}>{label}</span>
    </div>
  );
}
