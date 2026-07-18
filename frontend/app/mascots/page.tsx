import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillButton } from "@/components/ui/pill-button";

export const metadata: Metadata = {
  title: "The Council — Five agents who argue in front of you",
  description: "Aria, Kaz, Elm, Terra, Vex. Five opinionated agents debating your architecture, in the open.",
};

const AGENTS = [
  {
    name: "Aria the Raven",
    role: "AWS Architect · security-first",
    glyph: "◉",
    accent: "text-aws",
    tint: "shadow-glow-aws",
    model: "Claude Opus · 4.8",
    strengths: ["IAM & identity boundaries", "Network segmentation", "Multi-region resilience"],
    quote: "The role you just wrote grants s3:*. Tomorrow that means production data. Tighten it now.",
    disagree: "Elm will call her paranoid about IAM. She'll be right roughly two months later.",
  },
  {
    name: "Kaz the Fox",
    role: "Azure Optimizer · latency detective",
    glyph: "▲",
    accent: "text-azure",
    tint: "shadow-glow-azure",
    model: "GPT-4 class · latest",
    strengths: ["Traffic routing", "Cache placement", "SLA vs. cost tradeoffs"],
    quote: "This ALB in eu-west-1 fronts users in Sydney. That's 320ms every request. Front Door + regional origin, or move the compute.",
    disagree: "Terra will remind him that latency isn't correctness. Kaz will remind Terra that users leave.",
  },
  {
    name: "Elm the Owl",
    role: "GCP Frugalist · cost-obsessed",
    glyph: "◈",
    accent: "text-gcp",
    tint: "shadow-glow-gcp",
    model: "Gemini · latest",
    strengths: ["Spot / preemptible", "Right-sizing", "Storage class transitions"],
    quote: "Half your Cloud Storage is Standard-tier objects nobody has read in 60 days. Nearline saves $1,240/mo. Zero ops cost.",
    disagree: "Vex will point out that preemptibles killed a training job last week. Elm will say: rearchitect for it.",
  },
  {
    name: "Terra the Robot",
    role: "Infrastructure Judge · Terraform native",
    glyph: "⬢",
    accent: "text-success",
    tint: "shadow-[0_0_40px_rgba(34,197,94,0.35)]",
    model: "Claude Sonnet · 4.6",
    strengths: ["IaC hygiene", "Module reuse", "State-file safety"],
    quote: "You've inlined the same NAT gateway config in seven modules. Extract, version, done. Blast radius shrinks.",
    disagree: "Aria will want a security review on the extracted module. Terra will schedule it and move on.",
  },
  {
    name: "Vex the Dragon",
    role: "Kubernetes Wrangler · chaos ready",
    glyph: "✷",
    accent: "text-danger",
    tint: "shadow-[0_0_40px_rgba(239,68,68,0.35)]",
    model: "GPT-4 class · latest",
    strengths: ["Pod scheduling", "PDBs & HPA", "Failure-mode simulation"],
    quote: "The Deployment has no liveness probe. Also no PDB. If a node reboots at 2am, this outage is 30 minutes long.",
    disagree: "Kaz will suggest a service mesh. Vex will breathe fire on service meshes for two paragraphs before conceding.",
  },
];

export default function MascotsPage() {
  return (
    <>
      <Section className="!pt-40" align="center">
        <Eyebrow>The Council</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-tight">
          Five agents. <br />
          <span className="text-gradient-nebula">One graph.</span> Zero consensus.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-dim">
          Every AI Architect recommendation passes through The Council. Five specialists with distinct temperaments and different foundation models. They disagree in front of you — the negotiation is the value. You watch, and you pick.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-mono-caps text-ink-mute">
          <span>3 foundation models</span>
          <span className="opacity-40">◆</span>
          <span>5 personalities</span>
          <span className="opacity-40">◆</span>
          <span>Public disagreement log</span>
          <span className="opacity-40">◆</span>
          <span>Never a black box</span>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {AGENTS.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.08}>
              <ClayCard variant="lg" interactive className={`relative overflow-hidden ${a.tint}`}>
                <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-[auto_1fr]">
                  <div className="flex flex-col items-center gap-3 md:items-start">
                    <div className={`font-display text-8xl ${a.accent} animate-float`}>{a.glyph}</div>
                    <div className="text-mono-caps text-ink-mute">Agent · {i + 1}/5</div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className={`font-display text-3xl font-semibold`}>{a.name}</h2>
                      <div className="mt-1 text-sm text-ink-dim">{a.role}</div>
                      <div className="mt-2 text-mono-caps text-ink-mute">{a.model}</div>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {a.strengths.map(s => (
                        <li key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest text-ink-dim">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <blockquote className="clay-inset rounded-xl p-4 text-sm italic text-ink">
                      “{a.quote}”
                    </blockquote>
                    <p className="text-xs text-ink-mute">
                      <span className="text-mono-caps text-danger">Where they clash · </span>
                      {a.disagree}
                    </p>
                  </div>
                </div>
              </ClayCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How the debate resolves"
        title={<>The <span className="text-gradient-aurora">negotiation</span> is the product.</>}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { n: "01", title: "Independent drafts", body: "Each agent produces a recommendation without seeing the others. Diversity of thought first." },
            { n: "02", title: "Cross-examination", body: "Every agent critiques every other agent's draft. Confidence scores update in real time." },
            { n: "03", title: "Human decides", body: "You see the whole log. You pick a lane, or a hybrid, or override entirely. Nothing auto-ships." },
          ].map(s => (
            <ClayCard key={s.n} className="p-8">
              <div className="font-display text-5xl font-semibold text-ai/60">{s.n}</div>
              <div className="mt-3 font-display text-xl font-semibold">{s.title}</div>
              <p className="mt-2 text-sm text-ink-dim">{s.body}</p>
            </ClayCard>
          ))}
        </div>
      </Section>

      <Section className="!pb-40">
        <ClayCard variant="lg" glow="ai" className="p-12 text-center md:p-16">
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            Ready to hear them argue about <em>your</em> graph?
          </h2>
          <div className="mt-8 flex justify-center">
            <PillButton href="/signup" size="lg">Convene the Council</PillButton>
          </div>
        </ClayCard>
      </Section>
    </>
  );
}
