"use client";

import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";
import { motion } from "motion/react";
import { Terminal, Wand2, Radar, Rocket } from "lucide-react";

const STEPS = [
  {
    n: "01", icon: Terminal, title: "Import or invent",
    body: "Bring in Terraform, CloudFormation, or Pulumi — or open the AI Architect and start with a sentence.",
    code: `> bc import ./terraform
✓ 47 resources · 3 modules
✓ graph rebuilt in 1.4s`,
  },
  {
    n: "02", icon: Wand2, title: "Design with the graph",
    body: "Drag services onto an infinite canvas. Validation is inline; every connection glows valid, warning, or invalid before you drop it.",
    code: `alb.connect(rds)   // ✗ needs a compute layer
alb.connect(ecs)   // ✓
ecs.connect(rds)   // ✓`,
  },
  {
    n: "03", icon: Radar, title: "Simulate and score",
    body: "Kill a region and watch traffic reroute. Nudge an instance family and watch monthly cost respond. Health Score updates on every change.",
    code: `chaos.pull("us-east-1")
› 5 services degrade
› 3 rerouted in <45s
› Health 87 → 79 (recoverable)`,
  },
  {
    n: "04", icon: Rocket, title: "Review and ship",
    body: "Diff-style PR review with cost and risk delta. Blast radius illuminated before merge. Terraform emitted on approval.",
    code: `bc pr open
+ 2 nodes  Δcost +$340/mo
⚠ blast radius: 14 downstream
approved by 2 of 3 → merged`,
  },
];

export function HowItWorksSection() {
  return (
    <Section
      eyebrow="The full workflow"
      title={<>From <span className="text-gradient-aurora">nothing</span> to <span className="text-gradient-nebula">reviewed & merged</span></>}
      intro="Same graph the whole way. Nothing to import into a second tool, nothing to sync manually. The diagram, the cost model, the security scan, the Terraform — one artifact."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.n} delay={i * 0.08}>
              <ClayCard interactive className="flex h-full flex-col gap-6 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-4xl font-semibold text-ai/50">{s.n}</span>
                    <div className="clay-sm inline-flex h-10 w-10 items-center justify-center rounded-xl">
                      <Icon className="h-4 w-4 text-ai" />
                    </div>
                  </div>
                  <motion.span
                    className="h-2 w-2 rounded-full bg-ai"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                  />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-dim">{s.body}</p>
                </div>
                <pre className="clay-inset mt-auto overflow-x-auto rounded-xl p-4 font-mono text-[11px] leading-relaxed text-ink-dim">
                  {s.code}
                </pre>
              </ClayCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
