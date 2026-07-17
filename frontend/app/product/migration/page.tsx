"use client";

// Marketing page for Migration Ground (/product/migration). Cinematic hero with a
// bespoke morph-bridge R3F scene, then: supported migration modes matrix, visual
// morph showcase (ServiceIcon before/after via MIGRATION_MAP), animated migration
// insights (number-ticker ClayPanels), import sources row, and CTA to /migration.
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ArrowLeftRight, ShieldCheck, Clock, Coins, Layers } from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NumberTicker } from "@/components/effects/number-ticker";
import { ServiceIcon, TECH_ICON, PROVIDER_COLOR } from "@/lib/brand-icons";
import { MIGRATION_MAP } from "@/lib/mock";

const MigrationScene = dynamic(() => import("./scene"), { ssr: false });

// Static fallback for reduced-motion / no-webgl (claymorphism + gradients). Passed
// into the scene, which forwards it to SceneShell for non-full tiers.
function SceneFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,153,0,0.18),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(66,133,244,0.2),transparent_45%),radial-gradient(circle_at_50%_60%,rgba(34,211,238,0.16),transparent_55%)]" />
      <div className="absolute left-1/2 top-[38%] hidden h-px w-[42%] -translate-x-1/2 bg-gradient-to-r from-provider-aws via-accent-cyan to-provider-gcp sm:block" />
    </div>
  );
}

// Migration-mode matrix: which source clouds map onto which targets.
const MODES: { from: string; to: string; tone: "aws" | "azure" | "gcp"; note: string }[] = [
  { from: "AWS", to: "Google Cloud", tone: "gcp", note: "EC2 → Compute Engine, Lambda → Cloud Run" },
  { from: "AWS", to: "Azure", tone: "azure", note: "EC2 → Virtual Machines, S3 → Blob Storage" },
  { from: "Azure", to: "Google Cloud", tone: "gcp", note: "VMs → Compute Engine, Cosmos → Firestore" },
  { from: "Azure", to: "AWS", tone: "aws", note: "Blob → S3, Functions → Lambda" },
  { from: "Google Cloud", to: "AWS", tone: "aws", note: "GCS → S3, Cloud Run → Lambda" },
  { from: "Google Cloud", to: "Azure", tone: "azure", note: "BigQuery → Synapse, GKE → AKS" },
];

// Animated migration insights (deterministic mock values).
const INSIGHTS: { icon: typeof ShieldCheck; label: string; value: number; suffix?: string; prefix?: string; tint: string }[] = [
  { icon: Layers, label: "Complexity score", value: 42, suffix: "/100", tint: "text-accent-violet" },
  { icon: ShieldCheck, label: "Migration risk", value: 18, suffix: "%", tint: "text-status-success" },
  { icon: Clock, label: "Est. timeline", value: 6, suffix: " wks", tint: "text-accent-cyan" },
  { icon: Coins, label: "Projected savings", value: 31, prefix: "-", suffix: "% /mo", tint: "text-status-success" },
];

// Source→target catalog ids so ServiceIcon renders the real marks in the showcase.
const MORPH_ICONS: Record<string, { fromId: string; toId: string }> = {
  EC2: { fromId: "ec2", toId: "gce" },
  Lambda: { fromId: "lambda", toId: "run" },
  S3: { fromId: "s3", toId: "gcs" },
  DynamoDB: { fromId: "dynamodb", toId: "spanner" },
  RDS: { fromId: "rds", toId: "cloudsql" },
  CloudFront: { fromId: "cloudfront", toId: "cdn" },
};

const RISK_VARIANT = { low: "success", medium: "warning", high: "danger" } as const;

const IMPORT_SOURCES = ["Terraform", "Pulumi", "Docker"] as const;

export default function MigrationPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Navbar />

      <PageHero
        scene={<MigrationScene fallback={<SceneFallback />} />}
        eyebrow="Migration Ground"
        title={
          <>
            Morph your infrastructure <span className="text-gradient">across clouds</span>
          </>
        }
        subtitle="Watch every service cross the bridge — EC2 becomes Compute Engine, Lambda becomes Cloud Run, S3 becomes Cloud Storage. One map, any provider, zero guesswork."
        actions={
          <>
            <Button asChild size="lg">
              <Link href="/migration">
                Start a migration <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#morph">See the morph</Link>
            </Button>
          </>
        }
      >
        <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="aws">AWS</Badge>
          <ArrowLeftRight className="size-4" aria-hidden />
          <Badge variant="azure">Azure</Badge>
          <ArrowLeftRight className="size-4" aria-hidden />
          <Badge variant="gcp">Google Cloud</Badge>
        </div>
      </PageHero>

      {/* Supported migration modes matrix */}
      <SectionReveal className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Every direction, <span className="text-gradient">supported</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Move between any two of the big three. Each mode maps services one-to-one and flags
            what needs a human eye.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.map((m) => (
            <ClayPanel key={`${m.from}-${m.to}`} className="group flex flex-col gap-4">
              <div className="flex items-center gap-3 text-lg font-semibold">
                <span>{m.from}</span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                <Badge variant={m.tone}>{m.to}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{m.note}</p>
            </ClayPanel>
          ))}
        </div>
      </SectionReveal>

      {/* Visual morph showcase — ServiceIcon before/after from MIGRATION_MAP */}
      <div id="morph" className="scroll-mt-24" />
      <SectionReveal as="div" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            The <span className="text-gradient">morph</span>, service by service
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each AWS resource crosses the bridge and re-materializes as its Google Cloud
            equivalent. Risk is scored per hop.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MIGRATION_MAP.map((mig) => {
            const ic = MORPH_ICONS[mig.from];
            return (
              <ClayPanel key={mig.from} className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {ic && <ServiceIcon provider="aws" id={ic.fromId} name={mig.from} size={36} />}
                    <ArrowRight className="size-5 text-accent-cyan" aria-hidden />
                    {ic && <ServiceIcon provider="gcp" id={ic.toId} name={mig.to} size={36} />}
                  </div>
                  <Badge variant={RISK_VARIANT[mig.risk]}>{mig.risk} risk</Badge>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-provider-aws">{mig.from}</span>
                  <span className="mx-2 text-muted-foreground">morphs to</span>
                  <span className="font-medium text-provider-gcp">{mig.to}</span>
                </div>
              </ClayPanel>
            );
          })}
        </div>
      </SectionReveal>

      {/* Migration insights — animated number-ticker ClayPanels */}
      <SectionReveal className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Know before you <span className="text-gradient">move</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every plan ships with a projected complexity, risk, timeline, and cost delta — modeled
            from your live topology.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INSIGHTS.map((ins) => {
            const Icon = ins.icon;
            return (
              <ClayPanel key={ins.label} variant="inset" className="flex flex-col gap-3">
                <Icon className={`size-6 ${ins.tint}`} aria-hidden />
                <div className={`font-display text-4xl font-bold ${ins.tint}`}>
                  {ins.prefix}
                  <NumberTicker value={ins.value} suffix={ins.suffix} />
                </div>
                <div className="text-sm text-muted-foreground">{ins.label}</div>
              </ClayPanel>
            );
          })}
        </div>
      </SectionReveal>

      {/* Import sources row */}
      <SectionReveal className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Bring your infrastructure as it is
          </h2>
          <p className="mt-4 text-muted-foreground">
            Import from your existing IaC — we parse it, map it, and morph it. No rewrite required.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {IMPORT_SOURCES.map((name) => {
            const Icon = TECH_ICON[name];
            return (
              <ClayPanel
                key={name}
                variant="pressable"
                className="flex items-center gap-3 px-6 py-4"
              >
                {Icon && <Icon className="size-6" aria-hidden />}
                <span className="font-medium">{name}</span>
              </ClayPanel>
            );
          })}
          <ClayPanel variant="pressable" className="flex items-center gap-3 px-6 py-4">
            <Layers className="size-6 text-provider-aws" aria-hidden style={{ color: PROVIDER_COLOR.aws }} />
            <span className="font-medium">CloudFormation</span>
          </ClayPanel>
        </div>
      </SectionReveal>

      {/* CTA to /migration */}
      <SectionReveal className="mx-auto max-w-4xl px-6 pb-28">
        <ClayPanel className="relative overflow-hidden text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,153,0,0.15),transparent_50%),radial-gradient(circle_at_85%_80%,rgba(66,133,244,0.18),transparent_50%)]" />
          <div className="relative z-10 flex flex-col items-center gap-6 py-8">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Cross the bridge
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Map your stack to a new cloud in minutes. Preview every morph, review the risks, and
              ship the migration when you&apos;re ready.
            </p>
            <Button asChild size="lg">
              <Link href="/migration">
                Open Migration Ground <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </ClayPanel>
      </SectionReveal>

      <SiteFooter />
    </main>
  );
}
