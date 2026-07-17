"use client";

// AI Architect marketing page. Cinematic neural-bloom hero (bespoke R3F scene),
// prompt -> architecture explainer in animated tabbed ClayPanels, capability
// grid, a confidence-indicator visual, and a CTA into the /ai-architect app.
// Client page (hooks + motion) so no metadata export per the codebase brief.

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Boxes,
  DollarSign,
  FileCode2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { NumberTicker } from "@/components/effects/number-ticker";
import { TECH_ICON } from "@/lib/brand-icons";

const Scene = dynamic(() => import("./scene"), { ssr: false });

export default function AiArchitectPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <PageHero
          scene={<Scene />}
          eyebrow="AI Architect"
          title={
            <>
              Describe the system.{" "}
              <span className="text-gradient">Watch it take shape.</span>
            </>
          }
          subtitle="One prompt in, a production-grade cloud architecture out — diagram, cost projection, Terraform, and a security review, reasoned across AWS, Azure, and GCP."
          actions={
            <>
              <Button asChild size="lg" className="bg-ai text-white hover:bg-ai/85">
                <Link href="/ai-architect">
                  <Sparkles className="size-4" />
                  Open AI Architect
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#explainer">See how it works</Link>
              </Button>
            </>
          }
        >
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Badge>Multi-cloud reasoning</Badge>
            <Badge variant="cyan">Cost-aware</Badge>
            <Badge variant="success">Security-reviewed</Badge>
          </div>
        </PageHero>

        <Explainer />
        <Capabilities />
        <Confidence />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

// ─── prompt -> architecture explainer ──────────────────────────────────────
const EXAMPLE_PROMPT =
  "SaaS for 100k users with Postgres, Redis, CDN, DR";

type Output = {
  id: string;
  label: string;
  icon: typeof Boxes;
  headline: string;
  body: React.ReactNode;
};

const OUTPUTS: Output[] = [
  {
    id: "diagram",
    label: "Diagram",
    icon: Boxes,
    headline: "A topology that already accounts for scale",
    body: (
      <DiagramView />
    ),
  },
  {
    id: "cost",
    label: "Cost projection",
    icon: DollarSign,
    headline: "Line-item monthly cost before you provision a thing",
    body: <CostView />,
  },
  {
    id: "terraform",
    label: "Terraform",
    icon: FileCode2,
    headline: "Apply-ready IaC, not a starting point",
    body: <TerraformView />,
  },
  {
    id: "security",
    label: "Security review",
    icon: ShieldCheck,
    headline: "Findings triaged before the first deploy",
    body: <SecurityView />,
  },
];

function Explainer() {
  const reduced = useReducedMotion();
  return (
    <SectionReveal className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <span id="explainer" className="block -translate-y-24" aria-hidden />
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-ai">
          Prompt → Architecture
        </span>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          From a sentence to a blueprint
        </h2>
        <p className="mt-4 text-muted-foreground">
          Type intent in plain English. The Architect resolves it into four
          concrete artifacts you can review, edit, and ship.
        </p>
      </div>

      {/* the prompt */}
      <ClayPanel variant="inset" className="mx-auto mt-12 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <Sparkles className="size-3.5 text-ai" />
          Prompt
        </div>
        <p className="mt-3 font-mono text-base text-foreground sm:text-lg">
          &ldquo;{EXAMPLE_PROMPT}&rdquo;
        </p>
      </ClayPanel>

      {/* the outputs, tabbed */}
      <Tabs defaultValue="diagram" className="mx-auto mt-10 max-w-5xl">
        <TabsList className="mx-auto flex h-auto w-fit flex-wrap justify-center gap-1 rounded-2xl bg-muted/40 p-1.5 backdrop-blur">
          {OUTPUTS.map((o) => (
            <TabsTrigger
              key={o.id}
              value={o.id}
              className="gap-1.5 rounded-xl px-3.5 py-2 text-sm data-[state=active]:bg-ai/15 data-[state=active]:text-ai"
            >
              <o.icon className="size-4" />
              {o.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {OUTPUTS.map((o) => (
          <TabsContent key={o.id} value={o.id} className="mt-6">
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ClayPanel className="p-6 sm:p-8">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {o.headline}
                </h3>
                <div className="mt-5">{o.body}</div>
              </ClayPanel>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </SectionReveal>
  );
}

// ── output views ──
const DIAGRAM_TIERS: { tier: string; nodes: string[] }[] = [
  { tier: "Edge", nodes: ["Cloudflare", "Docker"] },
  { tier: "Application", nodes: ["Kubernetes", "Docker"] },
  { tier: "Data", nodes: ["PostgreSQL", "Redis"] },
  { tier: "Resilience", nodes: ["Terraform"] },
];

function DiagramView() {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {DIAGRAM_TIERS.map((t) => (
        <div key={t.tier} className="clay-inset rounded-2xl p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t.tier}
          </div>
          <ul className="mt-3 space-y-2">
            {t.nodes.map((n, i) => {
              const Icon = TECH_ICON[n];
              return (
                <li key={`${n}-${i}`} className="flex items-center gap-2 text-sm text-foreground">
                  {Icon ? <Icon className="size-4 text-ai" /> : <Boxes className="size-4 text-ai" />}
                  {n}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

const COST_LINES: { item: string; usd: number }[] = [
  { item: "Compute (autoscaled K8s)", usd: 2840 },
  { item: "Postgres (HA, multi-AZ)", usd: 1180 },
  { item: "Redis (cluster + replica)", usd: 420 },
  { item: "CDN + egress", usd: 640 },
  { item: "DR (warm standby)", usd: 910 },
];

function CostView() {
  const total = COST_LINES.reduce((s, l) => s + l.usd, 0);
  return (
    <div>
      <ul className="divide-y divide-border">
        {COST_LINES.map((l) => (
          <li key={l.item} className="flex items-center justify-between py-3 text-sm">
            <span className="text-muted-foreground">{l.item}</span>
            <span className="font-mono text-foreground">${l.usd.toLocaleString()}/mo</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-ai/10 px-4 py-3">
        <span className="text-sm font-medium text-foreground">Projected monthly</span>
        <span className="font-display text-xl font-bold text-ai">
          $<NumberTicker value={total} />
        </span>
      </div>
    </div>
  );
}

const TERRAFORM = `module "app" {
  source          = "./modules/eks"
  cluster_name    = "saas-prod"
  desired_size    = 6
  max_size        = 24            # 100k users, autoscaled
}

module "postgres" {
  source                  = "./modules/rds"
  engine                  = "postgres"
  multi_az                = true  # DR
  backup_retention_days   = 30
}

module "redis" {
  source            = "./modules/elasticache"
  node_type         = "cache.r6g.large"
  replicas          = 2
}`;

function TerraformView() {
  return (
    <pre className="clay-inset overflow-x-auto rounded-2xl p-5 text-xs leading-relaxed">
      <code className="font-mono text-muted-foreground">{TERRAFORM}</code>
    </pre>
  );
}

const FINDINGS: { level: "success" | "warning" | "danger"; text: string }[] = [
  { level: "success", text: "TLS enforced end-to-end at edge and mesh" },
  { level: "warning", text: "Redis endpoint reachable from app subnet — scope to SG" },
  { level: "success", text: "Postgres encrypted at rest, automated 30d backups" },
  { level: "danger", text: "DR region IAM role over-permissive — apply least privilege" },
];

const DOT: Record<string, string> = {
  success: "bg-status-success",
  warning: "bg-status-warning",
  danger: "bg-status-danger",
};

function SecurityView() {
  return (
    <ul className="space-y-3">
      {FINDINGS.map((f, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <span className={`mt-1.5 size-2 shrink-0 rounded-full ${DOT[f.level]}`} />
          <span className="text-foreground">{f.text}</span>
          <Badge variant={f.level} className="ml-auto shrink-0 capitalize">
            {f.level}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

// ─── capability grid ───────────────────────────────────────────────────────
const CAPS: { icon: typeof Boxes; title: string; body: string }[] = [
  { icon: Boxes, title: "Topology synthesis", body: "Resolves intent into a multi-tier diagram with the right primitives per cloud." },
  { icon: DollarSign, title: "Cost projection", body: "Line-item monthly estimates before provisioning, tuned to your scale target." },
  { icon: FileCode2, title: "Terraform generation", body: "Apply-ready modules — networking, data, autoscaling, and DR wired together." },
  { icon: ShieldCheck, title: "Security review", body: "Findings triaged by severity against least-privilege and encryption baselines." },
  { icon: Sparkles, title: "Multi-cloud reasoning", body: "Compares AWS, Azure, and GCP equivalents and picks per your constraints." },
  { icon: Boxes, title: "Editable & iterative", body: "Refine in plain English — every artifact regenerates in lockstep." },
];

function Capabilities() {
  return (
    <SectionReveal className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-ai">
          Capabilities
        </span>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          More than autocomplete for infrastructure
        </h2>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CAPS.map((c) => (
          <SpotlightCard key={c.title} className="clay h-full p-6">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-ai/12 text-ai">
              <c.icon className="size-5" />
            </div>
            <h3 className="font-display mt-4 text-lg font-semibold text-foreground">
              {c.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
          </SpotlightCard>
        ))}
      </div>
    </SectionReveal>
  );
}

// ─── confidence indicator ──────────────────────────────────────────────────
const CONFIDENCE: { label: string; pct: number }[] = [
  { label: "Scale & autoscaling fit", pct: 96 },
  { label: "Cost estimate accuracy", pct: 91 },
  { label: "Security posture", pct: 88 },
  { label: "DR / resilience coverage", pct: 94 },
];

function Confidence() {
  const reduced = useReducedMotion();
  return (
    <SectionReveal className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-ai">
            Confidence
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Every artifact ships with its confidence
          </h2>
          <p className="mt-4 text-muted-foreground">
            The Architect grades its own output so you know exactly where to
            review closely — and where it&rsquo;s already production-ready.
          </p>
        </div>
        <ClayPanel className="space-y-5">
          {CONFIDENCE.map((c) => (
            <div key={c.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">{c.label}</span>
                <span className="font-mono text-ai">{c.pct}%</span>
              </div>
              <div className="clay-inset h-2.5 overflow-hidden rounded-full">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-ai to-accent-cyan"
                  initial={reduced ? { width: `${c.pct}%` } : { width: 0 }}
                  whileInView={{ width: `${c.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
        </ClayPanel>
      </div>
    </SectionReveal>
  );
}

// ─── final CTA ─────────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <SectionReveal className="mx-auto max-w-4xl px-6 pb-32">
      <ClayPanel className="relative overflow-hidden p-10 text-center sm:p-16">
        <div
          className="pointer-events-none absolute inset-0 -z-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, color-mix(in oklch, var(--ai) 22%, transparent), transparent 70%)",
          }}
        />
        <div className="relative">
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bring your next system to the Architect
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Describe it once. Get the diagram, the cost, the Terraform, and the
            security review — reasoned across every cloud.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="bg-ai text-white hover:bg-ai/85">
              <Link href="/ai-architect">
                <Sparkles className="size-4" />
                Open AI Architect
              </Link>
            </Button>
          </div>
        </div>
      </ClayPanel>
    </SectionReveal>
  );
}
