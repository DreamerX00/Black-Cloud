"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { NODE_REGISTRY, PROVIDER_META, type Provider } from "@/lib/nodes/registry";

/**
 * Chapter visuals — the "drawer" reveals accompanying each headline.
 * Kept as declarative Motion compositions rather than R3F to keep bundle
 * & runtime cheap outside the hero. Each conveys the chapter's idea in one
 * animated tableau.
 */

// ── Chapter 1: DESIGN — floating cloud node cards
export function DesignVisual() {
  const featured = ["aws.ec2", "aws.rds", "gcp.cloud-run", "aws.s3"] as const;
  const nodes = NODE_REGISTRY.filter((n) => featured.includes(n.id as (typeof featured)[number]));

  return (
    <div className="relative aspect-square w-full max-w-md">
      {/* Radial glow */}
      <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.25),transparent_65%)] blur-2xl" />

      {nodes.map((n, i) => {
        const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
        const r = 130;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        return (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border border-border/60 bg-graphite/70 px-3 py-2 backdrop-blur"
            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, boxShadow: `inset 3px 0 0 0 ${n.accent}` }}
          >
            {n.iconPath && (
              <Image src={n.iconPath} width={22} height={22} alt="" aria-hidden unoptimized />
            )}
            <div className="text-xs font-medium">{n.label}</div>
          </motion.div>
        );
      })}

      {/* Center diamond */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
        className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-ai bg-ai/10 backdrop-blur"
        style={{ boxShadow: "0 0 40px rgba(139,92,246,0.6)" }}
      />
    </div>
  );
}

// ── Chapter 2: VALIDATE — the ALB → RDS invalid connection
export function ValidateVisual() {
  return (
    <div className="relative flex aspect-video w-full max-w-md items-center justify-between rounded-xl border border-border/60 bg-graphite/40 p-6 backdrop-blur tablet:aspect-square">
      <NodeChip label="ALB" accent="#FF9900" />

      <div className="relative flex-1 px-4">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          style={{ transformOrigin: "left" }}
          className="h-px w-full origin-left bg-gradient-to-r from-aws to-danger"
        />
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-danger/40 bg-danger/10 px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-danger"
        >
          ✕ Invalid
        </motion.div>
      </div>

      <NodeChip label="RDS" accent="#FF9900" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-success/40 bg-success/10 px-3 py-1.5 text-[11px] text-success"
      >
        Suggested: ALB → ECS → RDS
      </motion.div>
    </div>
  );
}

function NodeChip({ label, accent }: { label: string; accent: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm font-medium"
      style={{ boxShadow: `inset 3px 0 0 0 ${accent}` }}
    >
      {label}
    </div>
  );
}

// ── Chapter 3: EXPORT — file format tiles cascading out
export function ExportVisual() {
  const formats = [
    { label: "PNG", tint: "#8B5CF6" },
    { label: "SVG", tint: "#4285F4" },
    { label: "JSON", tint: "#22C55E" },
  ];
  return (
    <div className="relative flex aspect-square w-full max-w-md items-center justify-center">
      <div className="absolute inset-8 rounded-2xl border border-border/60 bg-graphite/30 backdrop-blur" />
      {formats.map((f, i) => (
        <motion.div
          key={f.label}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
          whileInView={{
            opacity: 1,
            x: [0, (i - 1) * 90],
            y: [0, i * 8 - 8],
            rotate: [0, (i - 1) * 8],
          }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.2 + i * 0.15, duration: 0.9 }}
          className="absolute flex h-32 w-24 flex-col items-center justify-center rounded-lg border border-border/60 bg-background/80 font-mono text-xs backdrop-blur"
          style={{ boxShadow: `0 20px 40px -10px ${f.tint}55` }}
        >
          <div
            className="mb-2 h-2 w-2 rounded-full"
            style={{ backgroundColor: f.tint }}
          />
          {f.label}
        </motion.div>
      ))}
    </div>
  );
}

// ── Chapter 4: MULTI-CLOUD — provider constellation
export function ProvidersVisual() {
  const providers: Provider[] = ["aws", "azure", "gcp"];
  return (
    <div className="relative flex aspect-square w-full max-w-md items-center justify-center">
      {providers.map((p, i) => {
        const meta = PROVIDER_META[p];
        const angle = (i / providers.length) * Math.PI * 2 - Math.PI / 2;
        const r = 120;
        return (
          <motion.div
            key={p}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
            className="absolute flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 backdrop-blur"
            style={{
              borderColor: meta.accent,
              backgroundColor: `${meta.accent}18`,
              transform: `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`,
              boxShadow: `0 0 40px ${meta.accent}44`,
            }}
          >
            <div className="text-lg font-bold" style={{ color: meta.accent }}>
              {meta.label}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {meta.count} services
            </div>
          </motion.div>
        );
      })}
      <div className="absolute h-6 w-6 rounded-full border-2 border-ai" style={{ boxShadow: "0 0 30px #8B5CF6" }} />
    </div>
  );
}
