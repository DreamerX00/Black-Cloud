import type { Metadata } from "next";
import Link from "next/link";
import { FadeInUp, Stagger, StaggerItem } from "@/components/motion/primitives";
import {
  ClayPanel,
  ClayBadge,
  ClayDivider,
  ClayOrb,
  ClayCard,
  ClayCardBody,
} from "@/components/ui/clay";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Compass,
  Rocket,
  Star,
  ShieldCheck,
  Zap,
  ArrowRight,
  ProviderMark,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "BlackCloud is the AI-native design surface for multi-cloud architectures — built by a small team who&apos;ve been paged at 3am one too many times.",
};

const PRINCIPLES = [
  {
    title: "The graph is the source of truth",
    body: "Whiteboards drift. Wikis rot. Terraform tells you *what* — not *why*. The living graph is the only artifact that survives the org chart.",
    tone: "ai" as const,
    Icon: Compass,
  },
  {
    title: "AI as an intern, not an oracle",
    body: "Copilot proposes; you commit. Every AI suggestion has a diff, a rationale, and a human on the button. No silent rewrites.",
    tone: "ai" as const,
    Icon: Sparkles,
  },
  {
    title: "Zero-config feels magical, and is a lie",
    body: "We chose deep configuration over 'it just works.' If you're going to run it in prod, you deserve to see every knob and every default.",
    tone: "default" as const,
    Icon: ShieldCheck,
  },
  {
    title: "Beauty is a security property",
    body: "Broken windows theory applies to infrastructure. A stack that renders like a museum piece gets reviewed more carefully than one that looks like a Visio dump.",
    tone: "aws" as const,
    Icon: Star,
  },
];

const TEAM = [
  {
    name: "Akash Singh",
    role: "Founder · Engineering",
    bio: "Ex-AWS Solutions Architect. Ran the platform team at three startups. Believes the diagram *is* the design doc.",
    initial: "A",
    tone: "aws" as const,
  },
  {
    name: "Nia Okonkwo",
    role: "Founder · Design",
    bio: "Design systems at Figma, then Vercel. Obsessed with how software *feels* under your hands.",
    initial: "N",
    tone: "ai" as const,
  },
  {
    name: "Renji Tanaka",
    role: "AI / Copilot",
    bio: "Research at Anthropic. Turned the graph-context-window problem into a paper, then a product.",
    initial: "R",
    tone: "gcp" as const,
  },
  {
    name: "Sofia Marchetti",
    role: "Infra & SRE",
    bio: "Kept a top-10 SaaS at four 9s for four years. Rebuilds Kubernetes clusters for fun.",
    initial: "S",
    tone: "azure" as const,
  },
];

const STATS = [
  { value: "23", label: "Services shipped" },
  { value: "3", label: "Clouds covered" },
  { value: "$0", label: "Free-forever tier" },
  { value: "60s", label: "First stack" },
];

const INVESTORS = [
  { name: "Lena Park", role: "Angel", company: "ex-Stripe Infra", initial: "LP", tone: "ai" as const },
  { name: "Marcus Vance", role: "Angel", company: "ex-HashiCorp", initial: "MV", tone: "aws" as const },
  { name: "Priya Rao", role: "Angel", company: "ex-Datadog SRE", initial: "PR", tone: "gcp" as const },
  { name: "Yusuf Adeyemi", role: "Angel", company: "ex-Cloudflare", initial: "YA", tone: "azure" as const },
  { name: "Hana Sato", role: "Angel", company: "ex-Vercel Platform", initial: "HS", tone: "ai" as const },
  { name: "Diego Ramirez", role: "Angel", company: "ex-Snowflake", initial: "DR", tone: "aws" as const },
];

export default function AboutPage() {
  return (
    <main className="relative isolate min-h-screen pt-32 pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 nebula opacity-40" />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-lines opacity-15" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 tablet:px-8 space-y-24">
        {/* Hero */}
        <FadeInUp className="space-y-8 text-center">
          <ClayBadge tone="ai" pulse className="mx-auto">
            <Compass className="size-3" /> Our story
          </ClayBadge>
          <h1 className="font-display text-5xl tablet:text-7xl font-semibold tracking-[-0.03em] leading-[0.95] max-w-4xl mx-auto">
            We&apos;re building the{" "}
            <span className="italic text-gradient-provider">design surface</span>{" "}
            we always wished we had.
          </h1>
          <p className="text-lg tablet:text-xl text-ink-muted leading-relaxed max-w-2xl mx-auto">
            Every one of us has been paged at 3am for something that a five-minute
            architecture review would have caught. BlackCloud is our answer.
          </p>
        </FadeInUp>

        {/* Stats strip */}
        <Stagger className="grid grid-cols-2 gap-4 tablet:grid-cols-4">
          {STATS.map((s) => (
            <StaggerItem key={s.label}>
              <ClayPanel elevation={2} tone="raised" className="p-6 text-center">
                <div className="font-display text-4xl font-semibold text-gradient-provider">
                  {s.value}
                </div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                  {s.label}
                </div>
              </ClayPanel>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Story */}
        <FadeInUp>
          <ClayPanel elevation={3} tone="raised" className="p-8 tablet:p-12 space-y-6">
            <ClayBadge tone="default">The founding story</ClayBadge>
            <h2 className="font-display text-3xl tablet:text-4xl font-semibold tracking-tight max-w-3xl">
              A 3am page, a whiteboard, and a very expensive misconfigured NAT gateway.
            </h2>
            <div className="space-y-4 text-base text-ink-muted leading-relaxed max-w-3xl">
              <p>
                In March 2024, our co-founder Akash was on-call for a Series B
                SaaS. A cascading failure took the platform down for 47
                minutes. Root cause: a NAT gateway placed in the wrong
                availability zone, from a Terraform PR merged eight months
                earlier. Nobody caught it in review because the diagram in
                Confluence was two rewrites out of date.
              </p>
              <p>
                We started BlackCloud that weekend. The rule: the diagram and
                the deploy are the *same artifact*. You draw the architecture,
                the AI critiques it, the pipeline ships it. When something
                breaks at 3am, the graph tells you exactly which edge to look
                at — and the git blame goes back to the pull request that
                added it.
              </p>
              <p>
                We&apos;re a distributed team of five, funded by revenue and a
                small check from{" "}
                <Link href="#investors" className="text-ink hover:text-ai transition-colors underline underline-offset-4">
                  a handful of angels
                </Link>{" "}
                who&apos;ve shipped platforms we admire. We ship every week.
              </p>
            </div>
          </ClayPanel>
        </FadeInUp>

        {/* Investors */}
        <div id="investors" className="space-y-10 scroll-mt-32">
          <FadeInUp className="text-center space-y-3">
            <ClayBadge tone="ai" className="mx-auto">
              <Sparkles className="size-3" /> Backers
            </ClayBadge>
            <h2 className="font-display text-4xl tablet:text-5xl font-semibold tracking-tight max-w-3xl mx-auto">
              Backed by leaders in{" "}
              <span className="italic text-gradient-provider">cloud and infrastructure</span>.
            </h2>
            <p className="text-sm text-ink-muted max-w-xl mx-auto">
              Operators and engineers who&apos;ve built the platforms we run every day.
            </p>
          </FadeInUp>
          <Stagger className="grid grid-cols-2 gap-4 tablet:grid-cols-3 desktop:grid-cols-6">
            {INVESTORS.map((inv) => (
              <StaggerItem key={inv.name}>
                <ClayCard className="h-full">
                  <ClayCardBody className="p-4 flex flex-col items-center text-center gap-2">
                    <ClayOrb size="md" tone={inv.tone}>
                      <span className="font-display text-sm font-semibold text-white">
                        {inv.initial}
                      </span>
                    </ClayOrb>
                    <div className="text-sm font-medium text-ink">{inv.name}</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                      {inv.company}
                    </div>
                  </ClayCardBody>
                </ClayCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* Principles */}
        <div className="space-y-10">
          <FadeInUp className="text-center space-y-3">
            <ClayBadge tone="default" className="mx-auto">
              <Star className="size-3" /> Principles
            </ClayBadge>
            <h2 className="font-display text-4xl tablet:text-5xl font-semibold tracking-tight">
              How we <span className="italic text-gradient-provider">think</span>.
            </h2>
          </FadeInUp>
          <Stagger className="grid grid-cols-1 gap-5 tablet:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <StaggerItem key={p.title}>
                <ClayPanel elevation={2} tone="raised" className="h-full">
                  <ClayCardBody className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <ClayOrb size="sm" tone={p.tone}>
                        <p.Icon className="size-5" />
                      </ClayOrb>
                      <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                    </div>
                    <p className="text-sm text-ink-muted leading-relaxed">{p.body}</p>
                  </ClayCardBody>
                </ClayPanel>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* Team */}
        <div className="space-y-10">
          <FadeInUp className="text-center space-y-3">
            <ClayBadge tone="default" className="mx-auto">The crew</ClayBadge>
            <h2 className="font-display text-4xl tablet:text-5xl font-semibold tracking-tight">
              Five people. <span className="italic text-gradient-provider">Twenty-eight years</span> of on-call pages.
            </h2>
          </FadeInUp>
          <Stagger className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-4">
            {TEAM.map((m) => (
              <StaggerItem key={m.name}>
                <ClayPanel elevation={2} tone="raised" className="h-full text-center">
                  <ClayCardBody className="p-6 space-y-3">
                    <ClayOrb size="lg" tone={m.tone} className="mx-auto">
                      <span className="font-display text-2xl font-semibold text-white">
                        {m.initial}
                      </span>
                    </ClayOrb>
                    <div>
                      <h3 className="font-medium text-ink">{m.name}</h3>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-ink-dim mt-0.5">
                        {m.role}
                      </div>
                    </div>
                    <p className="text-sm text-ink-muted leading-relaxed">{m.bio}</p>
                  </ClayCardBody>
                </ClayPanel>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <ClayDivider />

        {/* Bottom CTA */}
        <FadeInUp>
          <ClayPanel elevation={4} tone="raised" className="relative overflow-hidden isolate p-12 tablet:p-16 text-center">
            <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-60" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <ClayOrb size="xl" tone="ai" className="animate-[float-y_4s_ease-in-out_infinite]">
                <Rocket className="size-10" />
              </ClayOrb>
              <h2 className="font-display text-4xl tablet:text-5xl font-semibold tracking-tight max-w-2xl">
                Come build the tool with us.
              </h2>
              <p className="text-base text-ink-muted max-w-md">
                We&apos;re hiring engineers, designers, and one very lucky first
                DevRel. Full remote. Async by default.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild variant="clay-primary" size="hero" data-magnetic>
                  <Link href="/careers">
                    See open roles <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="clay-ghost" size="hero">
                  <Link href="/">
                    <Zap className="size-4" /> Try the product
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-2 text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                {(["aws", "azure", "gcp"] as const).map((p) => (
                  <span key={p} className="flex items-center gap-1.5">
                    <ProviderMark provider={p} className="size-3" />
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </ClayPanel>
        </FadeInUp>
      </div>
    </main>
  );
}
