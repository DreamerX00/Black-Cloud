"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { MiniCanvas } from "@/components/product/mini-canvas";
import { Sparkles, Send, Wand2, MessagesSquare, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const SEEDS = [
  "Multi-region SaaS for 100k users with Postgres and Redis, DR ready, us-east and eu-west.",
  "HIPAA patient portal, 30k concurrent, Azure, hard budget $18k/mo.",
  "Event-driven analytics on GCP with Pub/Sub, BigQuery, and Dataflow.",
  "AWS serverless API with Lambda + DynamoDB + Cognito.",
];

const COUNCIL = [
  { who: "Aria the Raven", tint: "text-aws", msg: "IAM: use scoped roles per service, not a shared power-user. Add a dedicated write-only role for the S3 exports bucket." },
  { who: "Kaz the Fox", tint: "text-azure", msg: "Add Front Door for eu-west users; ALB alone leaves 320ms on the table." },
  { who: "Elm the Owl", tint: "text-gcp", msg: "Postgres serverless (Aurora Serverless v2) saves ~$1.4k/mo at your utilization pattern; RDS is fine if you dislike cold starts." },
  { who: "Terra the Robot", tint: "text-success", msg: "Terraform is emitted with modules split by concern. Retry policy on Lambda uses exponential backoff." },
  { who: "Vex the Dragon", tint: "text-danger", msg: "If you go EKS instead of ECS, add a PDB per Deployment. Otherwise the node upgrade at 2am is a page." },
];

export default function AIArchitectPage() {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<"idle" | "drafting" | "arguing" | "done">("idle");

  const start = async () => {
    if (!prompt.trim()) return toast.error("Give the Council something to argue about.");
    setBusy(true);
    setPhase("drafting");
    await new Promise(r => setTimeout(r, 1200));
    setPhase("arguing");
    await new Promise(r => setTimeout(r, 1600));
    setPhase("done");
    setBusy(false);
    toast.success("Council reached a majority");
  };

  return (
    <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <ClayCard variant="lg" glow="ai" className="relative overflow-hidden p-8">
          <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-30" />
          <div className="relative">
            <div className="flex items-center gap-2 text-mono-caps text-ai">
              <Sparkles className="h-3.5 w-3.5 animate-pulse-slow" /> AI Architect · Council session
            </div>
            <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Describe what you want.</h1>
            <p className="mt-3 max-w-xl text-ink-dim">Compliance, scale, budget, regions — the tighter the prompt, the tighter the recommendation.</p>

            <div className="mt-6 clay-inset flex flex-col gap-3 rounded-2xl p-4">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={4}
                placeholder="Multi-region SaaS platform for 100k users, PostgreSQL primary + Redis cache, US + EU, hard cap $30k/mo, SOC2, RTO under 15 minutes."
                className="w-full resize-none bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                data-cursor="text"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {SEEDS.map(s => (
                    <button
                      key={s}
                      onClick={() => setPrompt(s)}
                      className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-ink-mute hover:text-ink"
                    >
                      {s.slice(0, 42)}…
                    </button>
                  ))}
                </div>
                <PillButton
                  size="md"
                  onClick={start}
                  disabled={busy}
                  icon={<Send className="h-4 w-4" />}
                >
                  {busy ? "Council is arguing…" : "Convene the Council"}
                </PillButton>
              </div>
            </div>
          </div>
        </ClayCard>

        <AnimatePresence>
          {phase !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <ClayCard variant="lg" className="p-3">
                <MiniCanvas />
              </ClayCard>

              <ClayCard variant="lg" className="flex flex-col gap-3 p-6">
                <div className="flex items-center gap-2 text-mono-caps text-ai">
                  <Wand2 className="h-3.5 w-3.5" /> Debate transcript
                </div>
                <div className="mt-2 flex-1 space-y-3 overflow-y-auto max-h-[440px]">
                  {COUNCIL.slice(0, phase === "done" ? 5 : phase === "arguing" ? 3 : 1).map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="clay-sm rounded-xl p-3"
                    >
                      <div className={`text-mono-caps ${c.tint}`}>{c.who}</div>
                      <p className="mt-1 text-sm text-ink-dim">{c.msg}</p>
                    </motion.div>
                  ))}
                </div>
                {phase === "done" && (
                  <div className="mt-4 flex items-center justify-between clay-inset rounded-xl p-3">
                    <div className="text-sm">
                      <div className="text-mono-caps text-success">Majority reached</div>
                      <div className="text-ink-dim">4 of 5 concur · Vex reserved on EKS/PDB</div>
                    </div>
                    <PillButton size="sm" trailing={<ArrowRight className="h-3.5 w-3.5" />}>Open in Playground</PillButton>
                  </div>
                )}
              </ClayCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <aside className="space-y-4">
        <ClayCard className="p-6">
          <div className="text-mono-caps text-ai mb-3">Confidence</div>
          <div className="space-y-3">
            {[
              { l: "Correctness", v: 92, t: "bg-success" },
              { l: "Cost fit", v: 84, t: "bg-ai" },
              { l: "Resilience", v: 79, t: "bg-info" },
              { l: "Security posture", v: 88, t: "bg-aws" },
            ].map(m => (
              <div key={m.l}>
                <div className="flex justify-between text-mono-caps text-ink-mute">
                  <span>{m.l}</span>
                  <span className="text-ink">{m.v}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/6">
                  <div className={`h-full rounded-full ${m.t}`} style={{ width: `${m.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ClayCard>

        <ClayCard className="p-6">
          <div className="text-mono-caps text-ai mb-3 flex items-center gap-2">
            <MessagesSquare className="h-3.5 w-3.5" /> Disagreement log
          </div>
          <ul className="space-y-3 text-xs text-ink-dim">
            <li><span className="text-aws">Aria</span> vs <span className="text-gcp">Elm</span>: IAM tightening vs. dependency breakage. <em>Aria won on production posture.</em></li>
            <li><span className="text-danger">Vex</span> vs <span className="text-azure">Kaz</span>: EKS vs ECS. <em>Kaz won on operational simplicity.</em></li>
            <li><span className="text-success">Terra</span> vs <span className="text-aws">Aria</span>: single module vs. seven. <em>Terra won; blast radius smaller.</em></li>
          </ul>
        </ClayCard>
      </aside>
    </div>
  );
}
