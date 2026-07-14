"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

function Pill({ label, tone }: { label: string; tone?: "danger" | "success" }) {
  return (
    <span
      className={cn(
        "rounded-lg border px-3 py-1.5 font-mono text-sm font-medium",
        tone === "danger" && "border-danger/50 text-danger",
        tone === "success" && "border-success/50 text-success",
        !tone && "border-border-strong text-fg",
      )}
    >
      {label}
    </span>
  );
}

export function ValidationShowcase() {
  // Spotlight follows the cursor via a CSS var on the card. ponytail: state-driven,
  // no motion value needed for a single background gradient.
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false });

  return (
    <section id="validation" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Prose */}
        <motion.div {...reveal}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Validation engine
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Catch mistakes before they ship.
          </h2>
          <p className="mt-6 max-w-md text-fg-muted">
            As you draw, every edge is checked live. Wire something that will not work in
            production and the connection turns red on the canvas the instant you drop it,
            with a plain-language reason and a concrete fix.
          </p>
        </motion.div>

        {/* Spotlight card */}
        <motion.div {...reveal}>
          <Card
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setSpot({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
                on: true,
              });
            }}
            onMouseLeave={() => setSpot((s) => ({ ...s, on: false }))}
            className="relative overflow-hidden"
            style={{
              backgroundImage: spot.on
                ? `radial-gradient(400px circle at ${spot.x}% ${spot.y}%, color-mix(in oklch, var(--color-primary) 18%, transparent), transparent 70%)`
                : undefined,
            }}
          >
            <CardContent className="space-y-8 p-6 sm:p-8">
              {/* Error case */}
              <div className="space-y-3">
                <Badge variant="danger">
                  <AlertTriangle className="mr-1 size-3.5" /> Invalid edge
                </Badge>
                <div className="flex items-center gap-3">
                  <Pill label="ALB" tone="danger" />
                  <span className="relative flex items-center text-danger">
                    <span className="h-px w-8 border-t border-dashed border-danger" />
                    <AlertTriangle className="mx-1 size-4" />
                    <ArrowRight className="size-4" />
                  </span>
                  <Pill label="RDS" tone="danger" />
                </div>
                <p className="text-sm text-fg-muted">
                  A load balancer should not connect directly to a database.
                </p>
              </div>

              <div className="h-px w-full bg-border" />

              {/* Suggested fix */}
              <div className="space-y-3">
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 size-3.5" /> Suggested fix
                </Badge>
                <div className="flex items-center gap-3">
                  <Pill label="ALB" tone="success" />
                  <ArrowRight className="size-4 text-success" />
                  <Pill label="ECS" tone="success" />
                  <ArrowRight className="size-4 text-success" />
                  <Pill label="RDS" tone="success" />
                </div>
                <p className="text-sm text-fg-muted">
                  Insert a compute tier: LB -&gt; ECS -&gt; DB.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
