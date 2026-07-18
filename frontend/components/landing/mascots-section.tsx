import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const MASCOTS = [
  { name: "Aria the Raven", role: "AWS Architect", body: "Watches over your VPCs and IAM. Will call out an over-permissive role three commits before it becomes a headline.", tint: "from-aws/40 via-warn/10 to-transparent", glyph: "◉", accent: "text-aws" },
  { name: "Kaz the Fox", role: "Azure Optimizer", body: "Sees the shortest path between where you are and where you meant to be. Reroutes traffic in her head faster than your ALB.", tint: "from-azure/40 via-info/10 to-transparent", glyph: "▲", accent: "text-azure" },
  { name: "Elm the Owl", role: "GCP Frugalist", body: "Refuses to sleep while a preemptible instance could carry the load. Will argue with Aria about IAM in every architecture review.", tint: "from-gcp/40 via-info/10 to-transparent", glyph: "◈", accent: "text-gcp" },
  { name: "Terra the Robot", role: "Infrastructure Judge", body: "Reads every Terraform diff, then explains it in one sentence. Marks the risky lines in a color you cannot miss.", tint: "from-success/40 via-success/10 to-transparent", glyph: "⬢", accent: "text-success" },
  { name: "Vex the Dragon", role: "Kubernetes Wrangler", body: "Herds pods, sniffs out CrashLoopBackoffs before they page you. Occasionally breathes fire on a Deployment that forgot its liveness probe.", tint: "from-danger/40 via-ai/10 to-transparent", glyph: "✷", accent: "text-danger" },
];

export function MascotsSection() {
  return (
    <Section
      id="council"
      eyebrow="The Council"
      title={
        <>
          Not a chatbot. <span className="text-gradient-nebula">A council of five agents</span> that argue in front of you.
        </>
      }
      intro="Five opinionated mascots watching your graph. They disagree on purpose — the negotiation is the value. You watch it happen and pick the direction that fits your team. No black-box verdicts."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MASCOTS.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.08}>
            <ClayCard interactive className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden p-7">
              <div
                aria-hidden
                className={`pointer-events-none absolute -inset-24 bg-gradient-to-br ${m.tint} opacity-60 blur-3xl`}
              />
              <div className="relative flex items-start justify-between">
                <span className={`font-display text-5xl ${m.accent} animate-float`}>{m.glyph}</span>
                <span className="text-mono-caps text-ink-mute">Agent 0{i + 1}</span>
              </div>
              <div className="relative">
                <div className="text-mono-caps text-ink-mute">{m.role}</div>
                <h3 className="mt-1 font-display text-2xl font-semibold">{m.name}</h3>
                <p className="mt-3 text-sm text-ink-dim">{m.body}</p>
              </div>
            </ClayCard>
          </Reveal>
        ))}

        <Reveal delay={MASCOTS.length * 0.08}>
          <ClayCard interactive className="flex h-full flex-col justify-between p-7">
            <div>
              <div className="text-mono-caps text-ai">Meet all five</div>
              <h3 className="mt-2 font-display text-3xl font-semibold leading-tight">
                A universe you can talk to.
              </h3>
              <p className="mt-3 text-sm text-ink-dim">
                Every mascot has its own model card, disagreement log, and confidence trace. Public.
              </p>
            </div>
            <Link
              href="/mascots"
              data-cursor="magnet"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ai"
            >
              Visit the Council <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </ClayCard>
        </Reveal>
      </div>
    </Section>
  );
}
