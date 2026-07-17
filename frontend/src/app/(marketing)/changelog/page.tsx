import type { Metadata } from "next";
import Link from "next/link";
import { FadeInUp, Stagger, StaggerItem } from "@/components/motion/primitives";
import {
  ClayPanel,
  ClayBadge,
  ClayDivider,
} from "@/components/ui/clay";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Rocket,
  Zap,
  ShieldCheck,
  ProviderMark,
  ArrowRight,
  History,
} from "@/components/icons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "What&apos;s shipping in BlackCloud — every release, every improvement, in the open.",
};

type EntryKind = "release" | "feature" | "fix" | "security";
interface Entry {
  version: string;
  date: string;
  headline: string;
  kind: EntryKind;
  tone: "ai" | "aws" | "azure" | "gcp" | "default";
  Icon: React.ComponentType<{ className?: string }>;
  bullets: string[];
  linkedProviders?: ("aws" | "azure" | "gcp")[];
}

// Data is inline for MVP; a real changelog would live in MDX under /content.
// ponytail: static array, promote to MDX when marketing needs self-serve edits.
const ENTRIES: Entry[] = [
  {
    version: "v1.7.0",
    date: "Jul 15, 2026",
    headline: "AI Copilot upgrade · deeper reasoning, half the latency.",
    kind: "release",
    tone: "ai",
    Icon: Sparkles,
    bullets: [
      "Copilot now reads your entire graph as context in a single pass — no chunking, no lost edges.",
      "Median suggestion latency down from 3.4s → 1.6s on typical stacks.",
      "New /copilot commands: /cost-estimate, /security-audit, /migrate-to-multi-az.",
    ],
    linkedProviders: ["aws", "azure", "gcp"],
  },
  {
    version: "v1.6.2",
    date: "Jul 08, 2026",
    headline: "Azure service catalogue: 8 new nodes.",
    kind: "feature",
    tone: "azure",
    Icon: Rocket,
    bullets: [
      "Added Container Apps, Front Door, API Management, Service Bus, Cognitive Search, Redis Enterprise, Bicep Registry, Managed Grafana.",
      "Bicep export now supports the new resources natively.",
    ],
  },
  {
    version: "v1.6.1",
    date: "Jul 02, 2026",
    headline: "Security · SCIM 2.0 general availability.",
    kind: "security",
    tone: "default",
    Icon: ShieldCheck,
    bullets: [
      "SCIM 2.0 provisioning is now GA for Nebula workspaces.",
      "Okta, Entra ID, Google Workspace, JumpCloud verified.",
      "Fixed: audit log export truncated at 10k rows on Enterprise.",
    ],
  },
  {
    version: "v1.6.0",
    date: "Jun 24, 2026",
    headline: "Terraform export · CDK stacks, module-level splits.",
    kind: "feature",
    tone: "aws",
    Icon: Zap,
    bullets: [
      "Emit Terraform as split modules per service group instead of a single main.tf.",
      "Optional AWS CDK (TypeScript) target — same graph, same plan, TypeScript scaffolding.",
      "New: `terraform-cloud` integration — one-click plan into your workspace.",
    ],
    linkedProviders: ["aws"],
  },
  {
    version: "v1.5.4",
    date: "Jun 12, 2026",
    headline: "Playground · undo history extended to 200 steps.",
    kind: "fix",
    tone: "default",
    Icon: History,
    bullets: [
      "Undo/redo history extended from 50 → 200 operations.",
      "Fixed: pinch-zoom on trackpad occasionally jumped the viewport on Firefox.",
      "Fixed: node label text-align regressed after v1.5.0 in Safari 17.",
    ],
  },
];

const KIND_STYLES: Record<EntryKind, string> = {
  release: "bg-ai/10 text-ai border-ai/20",
  feature: "bg-azure/10 text-azure border-azure/20",
  fix: "bg-white/[0.05] text-ink-muted border-white/[0.08]",
  security: "bg-warning/10 text-warning border-warning/20",
};

export default function ChangelogPage() {
  return (
    <main className="relative isolate min-h-screen pt-24 pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-30" />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-lines opacity-20" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 tablet:px-8">
        {/* Hero */}
        <FadeInUp className="space-y-6 text-center">
          <ClayBadge tone="ai" pulse className="mx-auto">
            <History className="size-3" /> Changelog
          </ClayBadge>
          <h1 className="font-display text-5xl tablet:text-6xl font-semibold tracking-[-0.03em] leading-[0.95]">
            Shipping{" "}
            <span className="italic text-gradient-provider">in the open</span>.
          </h1>
          <p className="text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto">
            Every release, every improvement, every fix. Subscribe to RSS or
            follow us on the fediverse for real-time notifications.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button asChild variant="clay-ghost" size="sm">
              <Link href="/changelog/rss.xml">RSS</Link>
            </Button>
            <Button asChild variant="clay-ghost" size="sm">
              <Link href="https://mastodon.social/@blackcloud">Mastodon</Link>
            </Button>
          </div>
        </FadeInUp>

        <ClayDivider className="my-12" />

        {/* Timeline */}
        <div className="relative">
          {/* Rail */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent tablet:left-5"
          />

          <Stagger delay={0.08} className="space-y-8">
            {ENTRIES.map((entry) => (
              <StaggerItem key={entry.version} className="relative pl-10 tablet:pl-14">
                {/* Rail dot with glow */}
                <div
                  className={cn(
                    "absolute left-1 top-6 grid size-5 place-items-center rounded-full",
                    "clay bg-[--clay-bg-2] shadow-clay-2 border border-white/10 tablet:left-3",
                  )}
                >
                  <div
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor:
                        entry.tone === "ai"
                          ? "var(--bc-ai)"
                          : entry.tone === "aws"
                          ? "var(--bc-aws)"
                          : entry.tone === "azure"
                          ? "var(--bc-azure)"
                          : entry.tone === "gcp"
                          ? "var(--bc-gcp)"
                          : "var(--bc-graphite)",
                    }}
                  />
                </div>

                <ClayPanel elevation={2} tone="raised" className="p-6 space-y-4">
                  <header className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-ink font-semibold">
                      {entry.version}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                      {entry.date}
                    </span>
                    <span
                      className={cn(
                        "ml-auto rounded-full border px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest",
                        KIND_STYLES[entry.kind],
                      )}
                    >
                      {entry.kind}
                    </span>
                  </header>

                  <div className="flex items-center gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-clay-sm bg-[--clay-bg-3] border border-white/5 shadow-clay-1">
                      <entry.Icon className="size-4" />
                    </div>
                    <h2 className="font-display text-xl font-semibold tracking-tight leading-snug">
                      {entry.headline}
                    </h2>
                  </div>

                  <ul className="space-y-3 text-sm text-ink-muted leading-relaxed">
                    {entry.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-ink-dim">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {entry.linkedProviders && (
                    <div className="flex items-center gap-2 pt-4">
                      {entry.linkedProviders.map((p) => (
                        <ClayBadge key={p} tone={p} className="text-[9px]">
                          <ProviderMark provider={p} className="size-3" />
                          {p}
                        </ClayBadge>
                      ))}
                    </div>
                  )}
                </ClayPanel>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* Footer CTA */}
        <FadeInUp className="mt-20 text-center">
          <ClayPanel elevation={3} tone="raised" className="p-8 space-y-4">
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              Have a feature you&apos;d like to see?
            </h3>
            <p className="text-sm text-ink-muted max-w-md mx-auto">
              Our public roadmap is where every feature starts. Upvote what
              matters — we ship what our users tell us to.
            </p>
            <Button asChild variant="clay-primary" size="lg" data-magnetic>
              <Link href="/roadmap">
                See the roadmap <ArrowRight className="size-4" />
              </Link>
            </Button>
          </ClayPanel>
        </FadeInUp>
      </div>
    </main>
  );
}
