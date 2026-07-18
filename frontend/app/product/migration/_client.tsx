"use client";

import {
  ArrowRightLeft,
  Upload,
  MapPin,
  BarChart3,
  FileCode2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  FeatureGrid,
  HowItWorks,
  MockupFrame,
  ProductCTA,
} from "../_product-page-client";
import { SectionReveal } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";

const FEATURES = [
  {
    icon: <Upload className="h-5 w-5" />,
    title: "Import from Anywhere",
    description:
      "Upload Terraform, CloudFormation, Pulumi, or Bicep files. BlackCloud parses your infrastructure and builds the dependency graph automatically.",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Intelligent Mapping",
    description:
      "AI maps each service to its closest equivalent on the target provider, considering features, pricing, and regional availability.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Risk & Cost Analysis",
    description:
      "Get complexity scores, risk assessments, timeline estimates, and side-by-side cost comparisons before committing to a migration.",
  },
  {
    icon: <FileCode2 className="h-5 w-5" />,
    title: "Generated IaC Output",
    description:
      "Export the migrated architecture as production-ready IaC for the target provider. Review, adjust, and deploy with confidence.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Upload your infrastructure code",
    description:
      "Import your existing Terraform, CloudFormation, or Pulumi files. BlackCloud parses every resource, dependency, and configuration into a visual graph.",
  },
  {
    step: "02",
    title: "Choose your target provider",
    description:
      "Select where you're migrating to — AWS, Azure, or GCP. Our AI analyzes each service and finds the best matching equivalent on the target platform.",
  },
  {
    step: "03",
    title: "Review and export",
    description:
      "Review the migration plan with risk scores, cost deltas, and compatibility notes. Export the new architecture as IaC and open it in Cloud Playground for final adjustments.",
  },
];

const MIGRATION_PAIRS = [
  { from: "EC2", to: "Compute Engine", status: "compatible" as const },
  { from: "Lambda", to: "Cloud Functions", status: "compatible" as const },
  { from: "RDS", to: "Cloud SQL", status: "compatible" as const },
  { from: "S3", to: "Cloud Storage", status: "compatible" as const },
  { from: "DynamoDB", to: "Firestore", status: "warning" as const },
  { from: "SQS", to: "Pub/Sub", status: "compatible" as const },
];

function MigrationMockup() {
  return (
    <div className="relative min-h-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-aws/20 border border-aws/30 flex items-center justify-center text-xs font-bold text-aws">
            A
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="h-8 w-8 rounded-lg bg-gcp/20 border border-gcp/30 flex items-center justify-center text-xs font-bold text-gcp">
            G
          </div>
          <span className="text-sm font-display font-semibold text-foreground ml-2">
            AWS → GCP Migration
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
            5/6 compatible
          </span>
          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-amber-400">
            1 warning
          </span>
        </div>
      </div>

      {/* Service mapping table */}
      <div className="space-y-2">
        {MIGRATION_PAIRS.map((pair) => (
          <div
            key={pair.from}
            className="clay-card flex items-center gap-3 p-3 rounded-xl"
          >
            <div className="flex-1 text-sm font-mono text-aws">{pair.from}</div>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 text-sm font-mono text-gcp text-right">
              {pair.to}
            </div>
            {pair.status === "compatible" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Bottom stats */}
      <div className="mt-6 flex items-center gap-4 border-t border-white/5 pt-4 text-xs text-muted-foreground">
        <span>Complexity: <strong className="text-foreground">Medium</strong></span>
        <span className="text-white/10">·</span>
        <span>Risk: <strong className="text-amber-400">Low-Medium</strong></span>
        <span className="text-white/10">·</span>
        <span>Est. time: <strong className="text-foreground">2-3 weeks</strong></span>
        <span className="text-white/10">·</span>
        <span>Cost delta: <strong className="text-emerald-400">-12%</strong></span>
      </div>
    </div>
  );
}

export function MigrationClient() {
  return (
    <>
      <FeatureGrid features={FEATURES} glowColor="#06B6D4" />

      <SectionReveal className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4">
          {[
            { v: "6", l: "Migration paths" },
            { v: "35+", l: "Service mappings" },
            { v: "3", l: "IaC formats" },
            { v: "92%", l: "Mapping accuracy" },
          ].map((s) => (
            <ClayPanel key={s.l} className="p-4 text-center">
              <div className="font-display text-2xl font-bold text-cyan-400">
                {s.v}
              </div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </ClayPanel>
          ))}
        </div>
      </SectionReveal>

      <HowItWorks steps={STEPS} accentColor="#06B6D4" />

      <MockupFrame>
        <MigrationMockup />
      </MockupFrame>

      <ProductCTA
        title="Plan your migration with confidence"
        description="Stop guessing which services map where. Import your infrastructure, see the complete migration plan, and export production-ready IaC for your target provider."
        primaryHref="/signup"
        primaryLabel="Start migrating"
        secondaryHref="/migration"
        secondaryLabel="Open Migration Ground"
        glowColor="#06B6D4"
      />
    </>
  );
}
