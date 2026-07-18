import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Sparkles, Zap, Wrench, ShieldCheck, Bug } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog — What we shipped",
  description: "The public log of every meaningful BlackCloud release.",
};

const ENTRIES = [
  {
    version: "0.1.0",
    date: "2026-07-18",
    title: "Foundation",
    tag: "release",
    icon: Sparkles,
    tint: "text-ai",
    items: [
      { t: "new", body: "Next.js 16.2.10 + React 19.2.4 foundation shipped." },
      { t: "new", body: "Design system published: Void ladder, claymorphism, glass, aurora." },
      { t: "new", body: "Cloud Playground v0 with AWS/Azure/GCP nodes." },
      { t: "new", body: "AI Architect (private beta) — GPT-4 + Claude Opus routing." },
      { t: "docs", body: "Manifesto and Strategic Plan published." },
    ],
  },
  {
    version: "0.0.9",
    date: "2026-07-04",
    title: "Universe primitives",
    tag: "preview",
    icon: Zap,
    tint: "text-info",
    items: [
      { t: "new", body: "R3F 3D scene mount established, cinematic scroll linked to camera." },
      { t: "new", body: "Custom cursor + magnetic elements site-wide." },
      { t: "fix", body: "Reduced-motion mode now cancels all keyframe animations, not just Motion transitions." },
    ],
  },
  {
    version: "0.0.8",
    date: "2026-06-24",
    title: "Council spec",
    tag: "spec",
    icon: ShieldCheck,
    tint: "text-gcp",
    items: [
      { t: "new", body: "Five-agent Council contract shipped (Aria, Kaz, Elm, Terra, Vex)." },
      { t: "new", body: "Confidence trace + disagreement log format finalized." },
      { t: "sec", body: "Model routing keeps prompts encrypted in transit, redacted from logs." },
    ],
  },
  {
    version: "0.0.7",
    date: "2026-06-11",
    title: "Playground v0",
    tag: "preview",
    icon: Wrench,
    tint: "text-aws",
    items: [
      { t: "new", body: "Infinite canvas with pan/zoom and 100-node validation performance ceiling." },
      { t: "new", body: "Node library covers 40+ AWS, 20+ Azure, 20+ GCP services." },
      { t: "fix", body: "Edge routing now honors container groupings when computing curves." },
    ],
  },
  {
    version: "0.0.6",
    date: "2026-05-29",
    title: "Cost engine bones",
    tag: "internal",
    icon: Bug,
    tint: "text-success",
    items: [
      { t: "new", body: "Live pricing scraper for AWS/Azure/GCP wired up." },
      { t: "internal", body: "Graph mutation → cost recompute path budgeted to 200ms." },
    ],
  },
];

const tagStyle = (t: string) =>
  t === "release" ? "text-ai border-ai/40" :
  t === "preview" ? "text-info border-info/40" :
  t === "spec" ? "text-gcp border-gcp/40" :
  t === "internal" ? "text-ink-mute border-white/10" :
  "text-aws border-aws/40";

const itemTag = (t: string) =>
  t === "new" ? { c: "bg-ai/20 text-ai", l: "NEW" } :
  t === "fix" ? { c: "bg-success/20 text-success", l: "FIX" } :
  t === "sec" ? { c: "bg-warn/20 text-warn", l: "SEC" } :
  t === "docs" ? { c: "bg-info/20 text-info", l: "DOCS" } :
  { c: "bg-white/10 text-ink-mute", l: t.toUpperCase() };

export default function ChangelogPage() {
  return (
    <>
      <Section className="!pt-40">
        <Eyebrow>Changelog</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.95] tracking-tight">
          Every ship, <span className="text-gradient-nebula">in the open.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-dim">
          What we’ve shipped, when, and why. If it matters to you, you’ll find it here — usually the same day it merges.
        </p>
      </Section>

      <Section className="!pt-0">
        <div className="mx-auto max-w-4xl space-y-6">
          {ENTRIES.map((e, i) => {
            const Icon = e.icon;
            return (
              <Reveal key={e.version} delay={i * 0.06}>
                <ClayCard interactive className="grid grid-cols-1 gap-6 p-8 md:grid-cols-[auto_1fr]">
                  <div className="flex flex-col items-start gap-2 md:min-w-[180px]">
                    <div className={`clay-sm inline-flex h-10 w-10 items-center justify-center rounded-xl ${e.tint}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="font-display text-2xl font-semibold">v{e.version}</div>
                    <div className="text-mono-caps text-ink-mute">{e.date}</div>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${tagStyle(e.tag)}`}>
                      {e.tag}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold">{e.title}</h2>
                    <ul className="mt-4 space-y-2.5">
                      {e.items.map((it, k) => {
                        const t = itemTag(it.t);
                        return (
                          <li key={k} className="flex items-start gap-3 text-sm text-ink-dim">
                            <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${t.c}`}>{t.l}</span>
                            <span>{it.body}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </ClayCard>
              </Reveal>
            );
          })}
        </div>
      </Section>
    </>
  );
}
