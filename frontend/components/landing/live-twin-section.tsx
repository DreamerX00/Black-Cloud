"use client";

import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";
import { Radio, Activity, AlertTriangle, GitBranch } from "lucide-react";

const FEATURES = [
  { icon: Radio, title: "Bi-directional sync", body: "The canvas becomes what is deployed. Drift is not a warning email; it is a visible tremor in the graph.", tone: "text-ai" },
  { icon: Activity, title: "Blast radius, previewed", body: "Delete a subnet. Fourteen downstream services glow red before you confirm — never after.", tone: "text-danger" },
  { icon: AlertTriangle, title: "Incident War Room", body: "PagerDuty fires, the diagram opens centered on the failing node with blast radius lit. Your worst hour becomes your most valuable one.", tone: "text-warn" },
  { icon: GitBranch, title: "PR-style architecture review", body: "\"Added 2 nodes · cost delta +$340/mo.\" Reviewable diffs before anything touches real infrastructure.", tone: "text-success" },
];

export function LiveTwinSection() {
  return (
    <Section
      eyebrow="The moment BlackCloud becomes un-removable"
      title={
        <>
          <span className="text-gradient-aurora">Live Twin.</span> Your graph, your infra — in the same frame.
        </>
      }
      intro="Diagramming tools open once and go stale by Friday. Live Twin makes the diagram what is running. From the second it connects, disconnecting BlackCloud becomes a decision a VP signs off on — not a preference one engineer acts on alone."
    >
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <ClayCard variant="lg" className="relative overflow-hidden p-2">
            <div className="clay-inset relative aspect-[16/10] w-full overflow-hidden rounded-[24px] p-6">
              <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
              {/* Fake infra diagram */}
              <div className="relative h-full w-full">
                {/* Nodes */}
                {[
                  { x: "10%", y: "20%", label: "Route53", color: "aws" },
                  { x: "30%", y: "35%", label: "CloudFront", color: "aws" },
                  { x: "50%", y: "20%", label: "ALB", color: "aws" },
                  { x: "70%", y: "40%", label: "ECS", color: "aws" },
                  { x: "50%", y: "70%", label: "RDS", color: "aws", pulse: true },
                  { x: "20%", y: "70%", label: "S3", color: "gcp" },
                  { x: "85%", y: "70%", label: "SQS", color: "azure" },
                ].map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className={`clay-sm absolute -translate-x-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-[10px] font-mono uppercase text-ink ${n.pulse ? "animate-pulse-slow" : ""}`}
                    style={{ left: n.x, top: n.y }}
                  >
                    <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-${n.color}`} />
                    {n.label}
                  </motion.div>
                ))}
                {/* SVG connections — viewBox 0..100, preserveAspectRatio none so units read as %. */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="ltc" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.7" />
                      <stop offset="1" stopColor="#38bdf8" stopOpacity="0.7" />
                    </linearGradient>
                  </defs>
                  {[
                    "M 10 20 Q 20 30 30 35",
                    "M 30 35 Q 40 30 50 20",
                    "M 50 20 Q 60 30 70 40",
                    "M 70 40 Q 60 55 50 70",
                    "M 50 70 Q 35 70 20 70",
                    "M 70 40 Q 78 55 85 70",
                  ].map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      stroke="url(#ltc)"
                      strokeWidth="0.4"
                      vectorEffect="non-scaling-stroke"
                      fill="none"
                      strokeDasharray="1 1"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.4 + i * 0.1 }}
                    />
                  ))}
                </svg>
                {/* Status badges */}
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <span className="clay-sm inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
                    Live · synced 2s ago
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 font-mono text-[10px] text-ink-mute">
                  prod-us-east-1 · v423 · drift 0
                </div>
              </div>
            </div>
          </ClayCard>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:col-span-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.08}>
                <ClayCard variant="sm" interactive className="flex items-start gap-4 p-5">
                  <div className={`clay-sm inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${f.tone}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-semibold">{f.title}</div>
                    <p className="mt-1 text-sm text-ink-dim">{f.body}</p>
                  </div>
                </ClayCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
