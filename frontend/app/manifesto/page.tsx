import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillButton } from "@/components/ui/pill-button";

export const metadata: Metadata = {
  title: "Manifesto — Why BlackCloud exists",
  description: "Six fears that break teams. One graph that retires them.",
};

const TENETS = [
  { n: "01", title: "The 2am question", body: "Something just broke. The only thing anyone wants is: what does this touch, and what happens if I restart it? Not a diagram. An answer, under thirty seconds." },
  { n: "02", title: "The receipt", body: "Every senior engineer has watched a decision they flagged as risky get overruled, then break in production a year later. The Why Engine is your receipt — permanent, timestamped." },
  { n: "03", title: "Translation exhaustion", body: "The same idea lives in an engineer's head, a diagram nobody updates, a Terraform module, a Jira ticket, and a Slack thread to a manager. BlackCloud kills the tax." },
  { n: "04", title: "Bus-factor dread", body: "If two people quit, does your org still understand a third of its own infrastructure? Wikis don't fix this. Living graphs do." },
  { n: "05", title: "The unexplainable bill", body: "Finance asks why AWS cost $40k more this month. If it takes more than a day to answer, the tool failed. Cost Simulator is line-explainable to a specific node." },
  { n: "06", title: "Review theatre", body: "Most architecture review meetings distribute blame after the decision was already made. PR-style review with cost/risk delta before merge makes review real, not theatre." },
];

export default function ManifestoPage() {
  return (
    <>
      <Section className="!pt-40" align="center">
        <Eyebrow>Manifesto</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.95] tracking-tight">
          <span className="text-gradient-nebula">Infrastructure</span> is not a diagram. <br />
          It is a <span className="text-gradient-aurora">place.</span>
        </h1>
        <p className="mt-8 max-w-3xl text-lg text-ink-dim md:text-xl">
          Most tools get opened once, at the start of a project, and forgotten the moment it ships. BlackCloud was built to break that pattern on purpose — so the thing an engineer opens on day one is the same thing they can’t picture working without on day one thousand.
        </p>
      </Section>

      <Section eyebrow="The six fears" title={<>What we design against</>}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {TENETS.map(t => (
            <ClayCard key={t.n} interactive className="flex flex-col gap-4 p-8">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-6xl font-semibold text-ai/50">{t.n}</span>
                <h3 className="font-display text-2xl font-semibold">{t.title}</h3>
              </div>
              <p className="text-base text-ink-dim">{t.body}</p>
            </ClayCard>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="The one idea underneath"
        title={<>Everything is <span className="text-gradient-nebula">one graph.</span></>}
        intro="Strip away the seven pillars and the four future ones and BlackCloud is one thing: a single, versioned, queryable graph of infrastructure. Nodes are resources. Edges are relationships. Every product is a different lens on the same graph."
      >
        <ClayCard variant="lg" className="p-10">
          <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-ink-dim">
{`Cloud Playground         ← the graph's visual editor
Architecture Intelligence ← rules and models scoring the graph
Cost Simulator            ← a cost function over the graph
Failure Simulator         ← a traversal that removes a node
Migration Ground          ← a transform across provider types
Time Machine              ← version history, git-style
AI Architect              ← natural-language graph generator

Live Twin                 ← the graph, mirroring real infrastructure`}
          </pre>
        </ClayCard>
        <p className="mt-8 max-w-3xl text-ink-dim">
          A competitor building a good cost tool, or a good diagramming tool, or a good migration mapper is building against a graph that doesn’t exist anywhere else in their product. Every time real infrastructure changes, their diagram, their cost model, and their security scan drift out of sync — because they were separate systems pretending to describe the same thing. BlackCloud’s actual moat isn’t any pillar. It’s that all seven read and write the same graph, in the same frame.
        </p>
      </Section>

      <Section
        eyebrow="What we refuse to do"
        title={<>Value-based lock-in. <span className="text-gradient-aurora">Nothing else.</span></>}
      >
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            "We will never auto-deploy to real infrastructure without human approval.",
            "We will never train on your prompts or graphs.",
            "We will never hold your data hostage on cancellation. JSON export, always.",
            "We will never charge for read-only viewers.",
            "We will never accept an integration that leaks BlackCloud data to a hyperscaler for training.",
            "We will never hide pricing behind sales calls at Pro tier or below.",
          ].map(v => (
            <li key={v} className="clay-sm flex items-start gap-3 p-5">
              <span className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded-sm bg-ai" />
              <span className="text-sm text-ink">{v}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="!pb-40">
        <ClayCard variant="lg" glow="ai" className="p-14 text-center md:p-20">
          <h2 className="font-display text-4xl font-semibold md:text-6xl">
            <span className="text-gradient-nebula">Own the graph.</span> Own the decision.
          </h2>
          <div className="mt-8 flex justify-center">
            <PillButton href="/signup" size="lg">Enter the universe</PillButton>
          </div>
        </ClayCard>
      </Section>
    </>
  );
}
