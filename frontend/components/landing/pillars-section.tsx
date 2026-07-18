import Link from "next/link";
import {
  Boxes,
  Sparkles,
  ArrowLeftRight,
  ShieldAlert,
  Clock3,
  Coins,
  BrainCircuit,
  ArrowUpRight,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";

const PILLARS = [
  { icon: Boxes, tint: "text-info", href: "/product/cloud-playground", title: "Cloud Playground", tag: "Design", body: "Infinite canvas · animated infrastructure · smart validation · multi-cloud. The graph's visual editor.", chip: "AWS · Azure · GCP" },
  { icon: Sparkles, tint: "text-ai", href: "/product/ai-architect", title: "AI Architect", tag: "Generate", body: "\"Build a SaaS for 100k users with Postgres, Redis, CDN, and DR.\" One sentence → a complete diagram, cost, and Terraform.", chip: "OpenAI · Claude · Gemini" },
  { icon: ArrowLeftRight, tint: "text-aws", href: "/product/migration-ground", title: "Migration Ground", tag: "Transform", body: "EC2 morphs into Compute Engine. Lambda dissolves into Cloud Run. Watch your infrastructure translate itself.", chip: "AWS · Azure · GCP · Terraform" },
  { icon: ShieldAlert, tint: "text-danger", href: "/product/failure-simulator", title: "Failure Simulator", tag: "Break", body: "Kill a subnet, an AZ, a whole region. Traffic reroutes, dependencies flash red, blast radius illuminates.", chip: "Game Day ready" },
  { icon: Clock3, tint: "text-warn", href: "/product/time-machine", title: "Time Machine", tag: "Replay", body: "Every diff, every decision, timestamped. Scrub through 18 months of your infrastructure as if it were a film.", chip: "Git-style diffs" },
  { icon: Coins, tint: "text-success", href: "/product/cost-simulator", title: "Cost Simulator", tag: "Estimate", body: "Drag a node, watch the monthly bill mutate live. Compare instance families, spot vs. on-demand, region vs. region.", chip: "Live pricing" },
  { icon: BrainCircuit, tint: "text-gcp", href: "/product/architecture-intelligence", title: "Architecture Intelligence", tag: "Score", body: "One number blends security, resilience, cost efficiency and drift. Trackable over time. Legible on a slide.", chip: "Health Score™" },
];

export function PillarsSection() {
  return (
    <Section
      id="pillars"
      eyebrow="Seven lenses · one graph"
      title={
        <>
          Every pillar reads and writes the{" "}
          <span className="text-gradient-nebula">same infrastructure graph.</span>
        </>
      }
      intro="Diagramming tools, cost dashboards, migration scripts and disaster runbooks are seven separate systems today. BlackCloud collapses them into one — every change reflects everywhere, instantly, because it was never separate to begin with."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal key={p.title} delay={i * 0.06}>
              <ClayCard
                as={Link}
                {...({ href: p.href } as { href: string })}
                interactive
                className="group flex h-full flex-col gap-6 p-7"
              >
                <div className="flex items-start justify-between">
                  <div className={`clay-sm inline-flex h-12 w-12 items-center justify-center rounded-2xl ${p.tint}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-mono-caps text-ink-mute">{p.tag}</div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-dim">{p.body}</p>
                </div>
                <div className="mt-auto pt-2 text-mono-caps text-ink-mute">{p.chip}</div>
              </ClayCard>
            </Reveal>
          );
        })}

        <Reveal delay={PILLARS.length * 0.06}>
          <ClayCard variant="lg" glow="ai" className="group flex h-full flex-col justify-between gap-6 overflow-hidden p-7">
            <div className="flex items-center gap-2 text-mono-caps text-ai">
              <Sparkles className="h-3.5 w-3.5" /> New in Phase 3
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight">Live Twin</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                Bidirectional sync between the graph and your deployed infrastructure. The canvas is no longer a plan someone drew once. It is what is running, right now.
              </p>
            </div>
            <Link
              href="/product/live-twin"
              className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-ai"
            >
              Read the spec <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </ClayCard>
        </Reveal>
      </div>
    </Section>
  );
}
