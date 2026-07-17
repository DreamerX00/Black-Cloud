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
  Check,
  X as XIcon,
  ArrowRight,
  Rocket,
  Compass,
  Zap,
  ProviderMark,
} from "@/components/icons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for BlackCloud — free to start, scale when your architectures do.",
};

interface Tier {
  key: "free" | "team" | "enterprise";
  name: string;
  tagline: string;
  price: string;
  cadence?: string;
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  tone: "default" | "ai" | "aws";
  features: { label: string; included: boolean }[];
}

const TIERS: Tier[] = [
  {
    key: "free",
    name: "Explorer",
    tagline: "For solo builders sketching first architectures.",
    price: "$0",
    cadence: "forever",
    cta: "Launch free",
    ctaHref: "/signup",
    tone: "default",
    features: [
      { label: "3 projects", included: true },
      { label: "All 23 services", included: true },
      { label: "PNG + JSON export", included: true },
      { label: "Community support", included: true },
      { label: "AI Copilot", included: false },
      { label: "Terraform export", included: false },
      { label: "Team collaboration", included: false },
    ],
  },
  {
    key: "team",
    name: "Constellation",
    tagline: "For teams shipping real infrastructure together.",
    price: "$24",
    cadence: "per seat / month",
    cta: "Start 14-day trial",
    ctaHref: "/signup?plan=team",
    tone: "ai",
    highlighted: true,
    features: [
      { label: "Unlimited projects", included: true },
      { label: "All 23 services", included: true },
      { label: "All export formats", included: true },
      { label: "AI Copilot (500 msgs/mo)", included: true },
      { label: "Terraform / Pulumi export", included: true },
      { label: "Real-time collaboration", included: true },
      { label: "Priority support", included: true },
    ],
  },
  {
    key: "enterprise",
    name: "Nebula",
    tagline: "For platform teams operating at scale.",
    price: "Custom",
    cta: "Talk to us",
    ctaHref: "/contact",
    tone: "aws",
    features: [
      { label: "Everything in Constellation", included: true },
      { label: "SSO / SAML / SCIM", included: true },
      { label: "Unlimited AI Copilot", included: true },
      { label: "Private cloud deploy", included: true },
      { label: "Custom service registry", included: true },
      { label: "Dedicated CSM", included: true },
      { label: "99.99% SLA", included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="relative isolate min-h-screen pt-32 pb-24">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-40" />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-lines opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 tablet:px-8">
        {/* Hero */}
        <FadeInUp className="mx-auto max-w-3xl text-center space-y-6">
          <div className="mx-auto space-y-2 text-center">
            <ClayBadge tone="ai" pulse className="mx-auto block">
              <Sparkles className="size-3" /> Simple pricing
            </ClayBadge>
            <h1 className="font-display text-5xl tablet:text-6xl font-semibold tracking-[-0.03em] leading-[0.95]">
              Ship first.{" "}
              <span className="italic text-gradient-provider">Scale</span> when
              the diagram becomes a system.
            </h1>
          </div>
          <p className="text-lg text-ink-muted leading-relaxed max-w-xl mx-auto">
            No credit card required. No per-node fees. No enterprise-only
            escape hatches. Just the tool.
          </p>
        </FadeInUp>

        {/* Tier grid */}
        <Stagger className="mt-16 grid grid-cols-1 gap-6 tablet:grid-cols-3">
          {TIERS.map((tier) => (
            <StaggerItem key={tier.key}>
              <TierCard tier={tier} />
            </StaggerItem>
          ))}
        </Stagger>

        <ClayDivider className="my-24" />

        {/* Comparison strip */}
        <FadeInUp className="space-y-6">
          <div className="mx-auto space-y-2 text-center">
            <ClayBadge tone="default" className="mx-auto block">
              Compared to alternatives
            </ClayBadge>
            <h2 className="font-display text-3xl tablet:text-4xl font-semibold tracking-tight">
              A fraction of what enterprise tools cost.
            </h2>
          </div>
          <Stagger className="grid grid-cols-2 gap-4 tablet:grid-cols-4">
            {[
              { name: "Lucidchart", price: "$9-27/user", note: "Generic diagrams" },
              { name: "Cloudcraft", price: "$49-99/user", note: "AWS only" },
              { name: "Hava", price: "$49-129/user", note: "Read-only imports" },
              {
                name: "BlackCloud",
                price: "$24/user",
                note: "AI-native · Multi-cloud",
                highlight: true,
              },
            ].map((c) => (
              <StaggerItem key={c.name}>
                <ClayPanel
                  elevation={c.highlight ? 3 : 1}
                  tone={c.highlight ? "ai" : "raised"}
                  className={cn(
                    "p-6 text-center",
                    c.highlight && "clay-hover ring-1 ring-ai/30",
                  )}
                >
                  <ClayCardBody className="space-y-2 p-0">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                      {c.name}
                    </div>
                    <div className={cn(
                      "font-display text-2xl font-semibold",
                      c.highlight && "text-gradient-provider",
                    )}>
                      {c.price}
                    </div>
                    <div className="text-xs text-ink-muted">{c.note}</div>
                  </ClayCardBody>
                </ClayPanel>
              </StaggerItem>
            ))}
          </Stagger>
        </FadeInUp>

        <ClayDivider className="my-24" />

        {/* FAQ */}
        <FadeInUp className="mx-auto max-w-3xl space-y-8">
          <div className="mx-auto space-y-2 text-center">
            <ClayBadge tone="default" className="mx-auto block">FAQ</ClayBadge>
            <h2 className="font-display text-3xl tablet:text-4xl font-semibold tracking-tight">
              Answers, before you ask.
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <ClayPanel key={f.q} elevation={1} tone="raised" className="p-5">
                <h3 className="font-medium text-ink">{f.q}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{f.a}</p>
              </ClayPanel>
            ))}
          </div>
        </FadeInUp>

        {/* Bottom CTA */}
        <FadeInUp className="mt-24">
          <ClayPanel
            elevation={4}
            tone="raised"
            className="relative overflow-hidden isolate p-12 tablet:p-16 text-center"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 nebula opacity-60" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <ClayOrb size="xl" tone="ai" className="animate-[float-y_4s_ease-in-out_infinite]">
                <Rocket className="size-10" />
              </ClayOrb>
              <h2 className="font-display text-4xl tablet:text-5xl font-semibold tracking-tight max-w-2xl">
                Your first architecture takes{" "}
                <span className="italic text-gradient-provider">60 seconds</span>.
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button variant="clay-primary" size="hero" asChild data-magnetic>
                  <Link href="/signup">
                    Launch free <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="clay-ghost" size="hero" asChild>
                  <Link href="/">
                    <Compass className="size-4" /> See it in motion
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
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="size-3 text-ai" /> AI-native
                </span>
              </div>
            </div>
          </ClayPanel>
        </FadeInUp>
      </div>
    </main>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  return (
    <ClayPanel
      elevation={tier.highlighted ? 4 : 2}
      tone={tier.highlighted ? "ai" : "raised"}
      className={cn(
        "relative flex h-full flex-col p-8 transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.04]",
        tier.highlighted && "ring-1 ring-ai/40 shadow-clay-ai animate-[pulse-glow_1.4s_ease-in-out_infinite]",
      )}
    >
      {tier.highlighted && (
        <ClayBadge
          tone="ai"
          pulse
          className="absolute -top-3 left-1/2 -translate-x-1/2 animate-[pulse-glow_1.4s_ease-in-out_infinite]"
        >
          <Sparkles className="size-3" /> Most popular
        </ClayBadge>
      )}
      <div className="space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim leading-tight">
          {tier.name}
        </div>
        <p className="text-sm text-ink-muted leading-snug">{tier.tagline}</p>
      </div>
      <div className="mt-6 flex min-h-[3rem] items-baseline gap-2">
        <div
          className={cn(
            "font-display text-5xl font-semibold tracking-tight leading-none",
            tier.highlighted && "text-gradient-provider",
          )}
        >
          {tier.price}
        </div>
        {tier.cadence && (
          <div className="text-xs text-ink-dim leading-none">{tier.cadence}</div>
        )}
      </div>
      <ClayDivider className="my-6" />
      <ul className="space-y-3 flex-1">
        {tier.features.map((f) => (
          <li key={f.label} className="flex items-start gap-2.5 text-sm">
            {f.included ? (
              <Check className="mt-0.5 size-4 shrink-0 text-ai" />
            ) : (
              <XIcon className="mt-0.5 size-4 shrink-0 text-ink-dim" />
            )}
            <span className={f.included ? "text-ink" : "text-ink-dim"}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>
      <div className="pt-8">
        <Button
          asChild
          variant={tier.highlighted ? "clay-primary" : "clay"}
          size="lg"
          className="w-full"
          data-magnetic
        >
          <Link href={tier.ctaHref}>
            {tier.cta} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </ClayPanel>
  );
}

const FAQ = [
  {
    q: "Do I need a credit card to start?",
    a: "No. The Explorer plan is genuinely free forever — 3 projects, all 23 services, all core export formats. Team trial is card-optional too; we ask for a card only after the 14-day trial converts.",
  },
  {
    q: "What counts as a 'seat' on Constellation?",
    a: "Any user who can *edit* projects. Viewers, comment-only reviewers, and read-only stakeholders are free — invite the whole company to look, pay only for the people building.",
  },
  {
    q: "Can I self-host?",
    a: "Nebula tier includes a private-cloud deploy (BYO AWS, GCP, or Azure account). Full source is delivered per contract; upgrades are managed via a helm chart your team controls.",
  },
  {
    q: "How does AI Copilot billing work?",
    a: "Included messages cover ~90% of teams. Overage is metered at $0.02/message with soft caps you set per-workspace. We publish the exact model-cost passthrough — no mystery margin.",
  },
  {
    q: "Can I import an existing AWS/GCP/Azure account?",
    a: "Yes — read-only account scan is on all paid tiers. Terraform-state import and Pulumi-state import are on Constellation and Nebula.",
  },
];
