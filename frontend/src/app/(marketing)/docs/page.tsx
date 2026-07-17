import type { Metadata } from "next";
import Link from "next/link";
import { FadeInUp, Stagger, StaggerItem } from "@/components/motion/primitives";
import { HoverScale, PulseHeading, HoverLift } from "@/features/marketing/docs-motion";
import {
  ClayPanel,
  ClayBadge,
  ClayDivider,
  ClayOrb,
  ClayCard,
  ClayCardBody,
} from "@/components/ui/clay";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  BookText,
  Search,
  ArrowRight,
  Compass,
  Rocket,
  Cube,
  Zap,
  ShieldCheck,
  History,
  Terminal,
  KeyRound,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Everything you need to design, share, and export multi-cloud architectures with BlackCloud.",
};

interface DocSection {
  title: string;
  tone: "default" | "ai" | "aws" | "azure" | "gcp";
  Icon: React.ComponentType<{ className?: string }>;
  description: string;
  articles: { title: string; href: string; badge?: string }[];
}

const SECTIONS: DocSection[] = [
  {
    title: "Getting started",
    tone: "ai",
    Icon: Rocket,
    description: "From signup to your first shipped architecture in under 5 minutes.",
    articles: [
      { title: "Quickstart · Your first canvas", href: "/docs/quickstart", badge: "5 min" },
      { title: "Concepts · Nodes, edges, and layers", href: "/docs/concepts" },
      { title: "Import an existing AWS account", href: "/docs/import-aws" },
      { title: "Keyboard shortcuts", href: "/docs/shortcuts" },
    ],
  },
  {
    title: "AI Copilot",
    tone: "ai",
    Icon: Sparkles,
    description: "Prompt the graph. Watch it think. Ship the audit trail.",
    articles: [
      { title: "Copilot 101 · Prompting patterns", href: "/docs/copilot" },
      { title: "Cost + resilience critiques", href: "/docs/copilot/critique" },
      { title: "Bring-your-own model (Nebula)", href: "/docs/copilot/byo-model", badge: "Nebula" },
    ],
  },
  {
    title: "Providers",
    tone: "aws",
    Icon: Cube,
    description: "Every service across AWS, Azure, and GCP — with the metadata baked in.",
    articles: [
      { title: "AWS service catalogue", href: "/docs/providers/aws" },
      { title: "Azure service catalogue", href: "/docs/providers/azure" },
      { title: "GCP service catalogue", href: "/docs/providers/gcp" },
      { title: "Custom service registry (Enterprise)", href: "/docs/providers/custom", badge: "Nebula" },
    ],
  },
  {
    title: "Export & IaC",
    tone: "gcp",
    Icon: Terminal,
    description: "PNG for the slide. Terraform for the pipeline. JSON for the LLM.",
    articles: [
      { title: "PNG · SVG · PDF export", href: "/docs/export/images" },
      { title: "Terraform export", href: "/docs/export/terraform" },
      { title: "Pulumi export", href: "/docs/export/pulumi" },
      { title: "JSON graph schema", href: "/docs/export/json" },
    ],
  },
  {
    title: "Collaboration",
    tone: "azure",
    Icon: Compass,
    description: "Real-time editing, comments, and review flows for architecture teams.",
    articles: [
      { title: "Sharing & permissions", href: "/docs/collab/sharing" },
      { title: "Comments & mentions", href: "/docs/collab/comments" },
      { title: "Version history", href: "/docs/collab/history" },
    ],
  },
  {
    title: "Security & admin",
    tone: "default",
    Icon: ShieldCheck,
    description: "SSO, SCIM, audit logs, and everything your CISO will want to see.",
    articles: [
      { title: "SSO · SAML · OIDC", href: "/docs/admin/sso", badge: "Constellation+" },
      { title: "SCIM provisioning", href: "/docs/admin/scim", badge: "Nebula" },
      { title: "Audit logs", href: "/docs/admin/audit" },
      { title: "Data residency", href: "/docs/admin/residency" },
    ],
  },
  {
    title: "API & webhooks",
    tone: "gcp",
    Icon: KeyRound,
    description: "Programmatic control of projects, graphs, and export pipelines.",
    articles: [
      { title: "REST API reference", href: "/docs/api" },
      { title: "Webhook events", href: "/docs/api/webhooks" },
      { title: "GitHub Action", href: "/docs/api/github-action" },
    ],
  },
  {
    title: "Changelog & migration",
    tone: "default",
    Icon: History,
    description: "What's new, what's changing, what's leaving.",
    articles: [
      { title: "Changelog", href: "/changelog" },
      { title: "Migration guides", href: "/docs/migrate" },
      { title: "Deprecation policy", href: "/docs/policy" },
    ],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "What's the fastest way to get building?",
    a: "The Quickstart takes you from signup to a shipped three-tier AWS diagram — with Terraform export — in under 5 minutes.",
  },
  {
    q: "Do I need a subscription to export?",
    a: "Free accounts export PNG and JSON. Terraform, Pulumi, and PDF exports unlock on Constellation and above.",
  },
  {
    q: "Can I collaborate with others?",
    a: "Yes. Real-time editing, comments, mentions, and version history are available on team plans.",
  },
  {
    q: "Where do I find API docs?",
    a: "See the REST API reference under API & webhooks, plus GitHub Action and webhook events for pipeline integration.",
  },
  {
    q: "How do I import my existing AWS account?",
    a: "Use the Import an existing AWS account guide under Getting started — read-only credentials, no writes.",
  },
];

export default function DocsPage() {
  return (
    <main className="relative isolate min-h-screen pt-32 pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-lines opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 tablet:px-8">
        {/* Hero */}
        <FadeInUp className="mx-auto max-w-3xl text-center space-y-6">
          <ClayBadge tone="ai" pulse className="mx-auto">
            <BookText className="size-3" /> Documentation
          </ClayBadge>
          <h1 className="font-display text-5xl tablet:text-6xl font-semibold tracking-[-0.03em] leading-[0.95]">
            Everything, <span className="italic text-gradient-provider">indexed</span>.
          </h1>
          <p className="text-lg text-ink-muted leading-relaxed max-w-xl mx-auto">
            Concepts, guides, service references, and API — searchable in one keystroke.
          </p>
          <HoverScale className="relative max-w-lg mx-auto tablet:pt-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-dim" />
            <Input
              placeholder="Search docs, services, or APIs…"
              className="clay-pressed rounded-clay-full border-white/5 bg-[--clay-bg-3] pl-11 h-12"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded bg-white/[0.05] px-2 py-0.5 text-[10px] font-mono text-ink-dim">
              ⌘K
            </kbd>
          </HoverScale>
        </FadeInUp>

        {/* Quick starts */}
        <FadeInUp className="mt-16">
          <ClayPanel elevation={3} tone="raised" className="relative overflow-hidden isolate p-8 tablet:p-10">
            <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-ai/20 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-8 tablet:flex-row tablet:items-center tablet:justify-between">
              <div className="space-y-3 max-w-lg">
                <ClayBadge tone="ai" pulse>
                  <Zap className="size-3" /> 5-minute start
                </ClayBadge>
                <PulseHeading className="font-display text-3xl font-semibold tracking-tight">
                  New here? Start with{" "}
                  <Link href="/docs/quickstart" className="italic underline underline-offset-4 decoration-ai/50 hover:decoration-ai transition-colors">
                    Quickstart
                  </Link>
                  .
                </PulseHeading>
                <p className="text-sm text-ink-muted leading-relaxed">
                  You&apos;ll build a three-tier AWS stack, add an AI critique,
                  and export Terraform — all before your coffee cools.
                </p>
              </div>
              <ClayOrb size="xl" tone="ai" className="animate-[float-y_5s_ease-in-out_infinite] mx-auto tablet:mx-0">
                <Rocket className="size-12" />
              </ClayOrb>
            </div>
          </ClayPanel>
        </FadeInUp>

        <ClayDivider className="my-16" />

        {/* Sections grid */}
        <Stagger className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
          {SECTIONS.map((section) => (
            <StaggerItem key={section.title}>
              <ClayPanel elevation={2} tone="raised" className="h-full clay-hover">
                <ClayCardBody className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <ClayOrb size="sm" tone={section.tone}>
                      <section.Icon className="size-5" />
                    </ClayOrb>
                    <div className="flex items-center">
                      <h3 className="font-medium text-ink">{section.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {section.description}
                  </p>
                  <ClayDivider />
                  <ul className="space-y-2.5 text-sm">
                    {section.articles.map((a) => (
                      <HoverLift key={a.title}>
                        <Link
                          href={a.href}
                          className="group flex items-center gap-2 text-ink-muted hover:text-ink transition-colors"
                        >
                          <span className="flex-1 truncate">{a.title}</span>
                          {a.badge && (
                            <ClayBadge tone="default">{a.badge}</ClayBadge>
                          )}
                          <ArrowRight className="size-3 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      </HoverLift>
                    ))}
                  </ul>
                </ClayCardBody>
              </ClayPanel>
            </StaggerItem>
          ))}
        </Stagger>

        <ClayDivider className="my-16" />

        {/* FAQ */}
        <FadeInUp className="mx-auto max-w-3xl space-y-6">
          <div className="text-center space-y-3">
            <ClayBadge tone="ai" className="mx-auto">
              FAQ
            </ClayBadge>
            <h2 className="font-display text-3xl tablet:text-4xl font-semibold tracking-tight">
              Answers, before you ask
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <ClayPanel key={item.q} elevation={2} tone="raised" className="p-6">
                <h3 className="font-medium text-ink">{item.q}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{item.a}</p>
              </ClayPanel>
            ))}
          </div>
        </FadeInUp>

        <ClayDivider className="my-16" />

        {/* Closing CTA */}
        <FadeInUp>
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
                Ready to ship your first diagram?
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
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
            </div>
          </ClayPanel>
        </FadeInUp>
      </div>
    </main>
  );
}
