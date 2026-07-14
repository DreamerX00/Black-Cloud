"use client";

// Constellation-lite architecture teaser: pure SVG + motion, no three.js.
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ProviderIcon } from "@/components/shared/provider-icon";

const EASE = [0.16, 1, 0.3, 1] as const;

// 6 nodes on a 400x320 viewBox. x/y = node top-left; float = drift amplitude.
const NODES = [
  { id: "aws-cloudfront", label: "CloudFront", x: 20, y: 24, float: 8 },
  { id: "aws-alb", label: "ALB", x: 232, y: 20, float: 6 },
  { id: "aws-ecs", label: "ECS", x: 232, y: 128, float: 10 },
  { id: "gcp-cloud-run", label: "Cloud Run", x: 24, y: 132, float: 7 },
  { id: "aws-rds", label: "RDS", x: 236, y: 236, float: 6 },
  { id: "aws-s3", label: "S3", x: 28, y: 240, float: 9 },
] as const;

const NODE_W = 148;
const NODE_H = 56;
const center = (n: (typeof NODES)[number]) => ({ cx: n.x + NODE_W / 2, cy: n.y + NODE_H / 2 });

// Flow edges: valid architecture path (LB -> compute -> DB, CDN -> LB, compute -> storage).
const EDGES: [string, string][] = [
  ["aws-cloudfront", "aws-alb"],
  ["aws-alb", "aws-ecs"],
  ["aws-ecs", "aws-rds"],
  ["gcp-cloud-run", "aws-ecs"],
  ["aws-cloudfront", "gcp-cloud-run"],
  ["gcp-cloud-run", "aws-s3"],
];

export function CanvasTeaser() {
  const reduced = useReducedMotion();
  const byId = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <section id="canvas" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">See it move</p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Watch your architecture come alive.
          </h2>
          <p className="mt-6 max-w-md text-fg-muted">
            Drag services onto an infinite canvas and watch data flow between them in real time.
            Every edge is validated live, so a broken path lights up the moment you draw it.
          </p>
          <div className="mt-8">
            <Button asChild variant="default" size="lg">
              <a href="/dashboard">Open the canvas</a>
            </Button>
          </div>
        </motion.div>

        {/* Node graph */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-graphite p-4"
        >
          <div className="relative aspect-[400/320] w-full">
            <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" aria-hidden>
              {EDGES.map(([from, to], i) => {
                const a = center(byId(from));
                const b = center(byId(to));
                return (
                  <motion.line
                    key={`${from}-${to}`}
                    x1={a.cx}
                    y1={a.cy}
                    x2={b.cx}
                    y2={b.cy}
                    stroke="currentColor"
                    className="text-primary/50"
                    strokeWidth={1.5}
                    strokeDasharray="6 8"
                    animate={reduced ? undefined : { strokeDashoffset: [0, -28] }}
                    transition={
                      reduced
                        ? undefined
                        : { duration: 1.2, repeat: Infinity, ease: "linear", delay: i * 0.15 }
                    }
                  />
                );
              })}
            </svg>

            {NODES.map((n, i) => (
              <motion.div
                key={n.id}
                className="absolute flex items-center gap-2 rounded-lg border border-border-strong bg-slate/80 px-3 py-2 backdrop-blur-sm"
                style={{
                  left: `${(n.x / 400) * 100}%`,
                  top: `${(n.y / 320) * 100}%`,
                  width: `${(NODE_W / 400) * 100}%`,
                }}
                animate={reduced ? undefined : { y: [0, -n.float, 0] }}
                transition={
                  reduced
                    ? undefined
                    : { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                }
              >
                <ProviderIcon serviceId={n.id} size={24} />
                <span className="truncate font-mono text-xs text-fg">{n.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
