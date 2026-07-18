"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Download,
  Rocket,
  ChevronRight,
} from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { NumberTicker } from "@/components/effects/number-ticker";
import { ServiceIcon } from "@/lib/brand-icons";
import { PROVIDER_ICON, PROVIDER_COLOR } from "@/lib/brand-icons";
import { MIGRATION_MAP } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { Provider } from "@/lib/mock";

// ponytail: inline constants, no separate file
const PROVIDERS: Provider[] = ["aws", "azure", "gcp"];

const COMPLEXITY_COLOR: Record<string, string> = {
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
};

const COMPAT_BAR_COLOR: Record<string, string> = {
  low: "from-red-500 to-red-400",
  medium: "from-amber-500 to-yellow-400",
  high: "from-emerald-500 to-cyan-400",
};

function compatGradient(v: number) {
  if (v >= 85) return "from-emerald-500 to-cyan-400";
  if (v >= 70) return "from-amber-500 to-yellow-400";
  return "from-red-500 to-red-400";
}

// ponytail: mock migration step details, inline
const MIGRATION_STEPS: Record<string, { steps: string[]; gotchas: string[] }> = {
  "Amazon EC2 → Compute Engine": {
    steps: [
      "Export AMI / create machine image",
      "Upload image to Cloud Storage",
      "Import as Compute Engine custom image",
      "Create instance from imported image",
      "Reconfigure networking (VPC, firewall rules)",
      "Validate application and update DNS",
    ],
    gotchas: [
      "Instance type mapping is not 1:1 — benchmark before committing",
      "User-data scripts may need rewriting for GCP metadata server",
    ],
  },
  "AWS Lambda → Cloud Functions": {
    steps: [
      "Audit runtime and dependencies",
      "Refactor handler signature to Cloud Functions format",
      "Migrate environment variables and secrets",
      "Deploy with gcloud CLI or Terraform",
      "Update API Gateway / event triggers",
    ],
    gotchas: ["Cold start behavior differs", "Max execution time limits vary"],
  },
  "Amazon S3 → Cloud Storage": {
    steps: [
      "Create target bucket with matching storage class",
      "Use gsutil rsync or Storage Transfer Service",
      "Migrate bucket policies to IAM conditions",
      "Update application SDKs and endpoints",
    ],
    gotchas: ["Object ACLs don't map directly — use IAM instead", "Event notification schemas differ"],
  },
};

function getSteps(from: string, to: string) {
  const key = `${from} → ${to}`;
  return (
    MIGRATION_STEPS[key] ?? {
      steps: [
        "Audit source service configuration and dependencies",
        "Provision equivalent target service",
        "Migrate data and configuration",
        "Update application references",
        "Test end-to-end and cut over",
      ],
      gotchas: ["API surface differences may require code changes", "Monitor for performance regressions post-migration"],
    }
  );
}

export default function MigrationPage() {
  const [source, setSource] = useState<Provider>("aws");
  const [target, setTarget] = useState<Provider>("gcp");
  const [toastVisible, setToastVisible] = useState(false);

  const filtered = MIGRATION_MAP.filter(
    (m) => m.from.provider === source && m.to.provider === target
  );

  const avgCompat =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, m) => s + m.compatibility, 0) / filtered.length)
      : 0;

  const riskCounts = {
    low: filtered.filter((m) => m.complexity === "low").length,
    medium: filtered.filter((m) => m.complexity === "medium").length,
    high: filtered.filter((m) => m.complexity === "high").length,
  };

  // ponytail: mock cost data
  const sourceCost = 12_480;
  const targetCost = 10_920;

  function showToast() {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }

  return (
    <AppFrame title="Migration Ground">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* ── 1. HERO BANNER ──────────────────────────────────── */}
        <SectionReveal>
          <div className="text-center space-y-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Migrate between clouds{" "}
              <span className="text-gradient">seamlessly</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select a source and destination provider to see service mapping,
              compatibility analysis, and a migration playbook.
            </p>

            {/* Provider pickers */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* Source picker */}
              <ProviderPicker
                label="Source"
                selected={source}
                onSelect={(p) => {
                  if (p !== target) setSource(p);
                }}
                disabledProvider={target}
              />

              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-primary"
              >
                <ArrowRight className="h-8 w-8" />
              </motion.div>

              {/* Target picker */}
              <ProviderPicker
                label="Destination"
                selected={target}
                onSelect={(p) => {
                  if (p !== source) setTarget(p);
                }}
                disabledProvider={source}
              />
            </div>
          </div>
        </SectionReveal>

        {/* ── 2. MIGRATION MAP TABLE ──────────────────────────── */}
        <SectionReveal delay={0.1}>
          <h2 className="font-display text-2xl font-semibold mb-6">
            Service Migration Map
          </h2>
          {filtered.length === 0 ? (
            <ClayPanel className="p-8 text-center text-muted-foreground">
              No migration paths found for{" "}
              {PROVIDER_ICON[source]?.label} → {PROVIDER_ICON[target]?.label}.
              Try a different combination.
            </ClayPanel>
          ) : (
            <ClayPanel className="overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_1fr_120px_100px] gap-4 px-6 py-3 border-b border-white/5 text-xs text-muted-foreground uppercase tracking-wider">
                <span>Source Service</span>
                <span />
                <span>Target Service</span>
                <span>Compatibility</span>
                <span>Complexity</span>
              </div>

              {/* Rows */}
              <SectionReveal stagger={0.06} className="divide-y divide-white/5">
                {filtered.map((m, i) => (
                  <RevealItem key={i}>
                    <div className="grid grid-cols-[1fr_auto_1fr_120px_100px] gap-4 items-center px-6 py-4 transition-colors hover:bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <ServiceIcon provider={m.from.provider} size={18} />
                        <span className="text-sm font-medium">{m.from.name}</span>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground" />

                      <div className="flex items-center gap-2">
                        <ServiceIcon provider={m.to.provider} size={18} />
                        <span className="text-sm font-medium">{m.to.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative h-2 flex-1 rounded-full bg-graphite/50 border border-white/5 overflow-hidden">
                          <motion.div
                            className={cn(
                              "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
                              compatGradient(m.compatibility)
                            )}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${m.compatibility}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
                          {m.compatibility}%
                        </span>
                      </div>

                      <Badge
                        className={cn(
                          "text-[11px] border",
                          COMPLEXITY_COLOR[m.complexity]
                        )}
                      >
                        {m.complexity}
                      </Badge>
                    </div>
                  </RevealItem>
                ))}
              </SectionReveal>
            </ClayPanel>
          )}
        </SectionReveal>

        {/* ── 3. MIGRATION ANALYSIS ──────────────────────────── */}
        {filtered.length > 0 && (
          <SectionReveal delay={0.15}>
            <h2 className="font-display text-2xl font-semibold mb-6">
              Migration Analysis
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Overall compatibility */}
              <ClayPanel className="p-6 text-center" glowColor={PROVIDER_COLOR[target]}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Overall Compatibility
                </p>
                <NumberTicker
                  value={avgCompat}
                  suffix="%"
                  className="font-display text-5xl font-bold text-gradient"
                />
              </ClayPanel>

              {/* Risk cards */}
              <ClayPanel className="p-6" glowColor="#10b981">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 uppercase tracking-wider">
                    Low Risk
                  </span>
                </div>
                <p className="font-display text-3xl font-bold">{riskCounts.low}</p>
                <p className="text-xs text-muted-foreground mt-1">services</p>
              </ClayPanel>

              <ClayPanel className="p-6" glowColor="#f59e0b">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-amber-400 uppercase tracking-wider">
                    Medium Risk
                  </span>
                </div>
                <p className="font-display text-3xl font-bold">{riskCounts.medium}</p>
                <p className="text-xs text-muted-foreground mt-1">services</p>
              </ClayPanel>

              <ClayPanel className="p-6" glowColor="#ef4444">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-red-400 uppercase tracking-wider">
                    High Risk
                  </span>
                </div>
                <p className="font-display text-3xl font-bold">{riskCounts.high}</p>
                <p className="text-xs text-muted-foreground mt-1">services</p>
              </ClayPanel>
            </div>

            {/* Estimated time + cost */}
            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <ClayPanel className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Estimated Migration Time
                  </p>
                  <p className="font-display text-2xl font-bold mt-1">2 – 4 weeks</p>
                </div>
              </ClayPanel>

              <ClayPanel className="p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                  Monthly Cost Comparison
                </p>
                <div className="space-y-3">
                  <CostBar
                    label={PROVIDER_ICON[source]?.label ?? source}
                    value={sourceCost}
                    max={sourceCost}
                    color={PROVIDER_COLOR[source]}
                  />
                  <CostBar
                    label={PROVIDER_ICON[target]?.label ?? target}
                    value={targetCost}
                    max={sourceCost}
                    color={PROVIDER_COLOR[target]}
                  />
                </div>
                <p className="text-xs text-emerald-400 mt-3">
                  Estimated savings: ${(sourceCost - targetCost).toLocaleString()}/mo (
                  {Math.round(((sourceCost - targetCost) / sourceCost) * 100)}%)
                </p>
              </ClayPanel>
            </div>
          </SectionReveal>
        )}

        {/* ── 4. SERVICE MAPPING DETAIL ──────────────────────── */}
        {filtered.length > 0 && (
          <SectionReveal delay={0.2}>
            <h2 className="font-display text-2xl font-semibold mb-6">
              Service Mapping Detail
            </h2>
            <ClayPanel className="p-2">
              <Accordion type="multiple">
                {filtered.map((m, i) => {
                  const { steps, gotchas } = getSteps(m.from.name, m.to.name);
                  return (
                    <AccordionItem
                      key={i}
                      value={`pair-${i}`}
                      className="clay-card rounded-lg mb-2 border border-white/5 px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <ServiceIcon provider={m.from.provider} size={16} />
                          <span className="font-medium text-sm">{m.from.name}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                          <ServiceIcon provider={m.to.provider} size={16} />
                          <span className="font-medium text-sm">{m.to.name}</span>
                          <Badge
                            className={cn(
                              "ml-2 text-[10px] border",
                              COMPLEXITY_COLOR[m.complexity]
                            )}
                          >
                            {m.complexity}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-6 md:grid-cols-2 pb-4">
                          {/* Migration steps */}
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                              Migration Steps
                            </p>
                            <ol className="space-y-2">
                              {steps.map((step, si) => (
                                <li
                                  key={si}
                                  className="flex items-start gap-3 text-sm"
                                >
                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[11px] font-bold text-violet-300">
                                    {si + 1}
                                  </span>
                                  <span className="text-muted-foreground">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Gotchas */}
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                              Gotchas & Warnings
                            </p>
                            <div className="space-y-2">
                              {gotchas.map((g, gi) => (
                                <div
                                  key={gi}
                                  className="flex items-start gap-2 rounded-lg bg-amber-500/5 border border-amber-500/10 p-3 text-sm text-amber-300/90"
                                >
                                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                  <span>{g}</span>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                Compatibility:{" "}
                                <span className="text-foreground font-medium">
                                  {m.compatibility}%
                                </span>
                              </span>
                              <span>
                                Complexity:{" "}
                                <span
                                  className={cn(
                                    "font-medium",
                                    m.complexity === "low" && "text-emerald-400",
                                    m.complexity === "medium" && "text-amber-400",
                                    m.complexity === "high" && "text-red-400"
                                  )}
                                >
                                  {m.complexity}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </ClayPanel>
          </SectionReveal>
        )}

        {/* ── 5. CTA ─────────────────────────────────────────── */}
        <SectionReveal delay={0.25}>
          <ClayPanel className="p-8 text-center space-y-4">
            <h3 className="font-display text-xl font-semibold">
              Ready to migrate?
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Our migration engine handles data transfer, service mapping,
              and rollback — all from one dashboard.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                size="lg"
                className="clay-button gap-2"
                onClick={showToast}
              >
                <Rocket className="h-4 w-4" />
                Start Migration
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={showToast}
              >
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </ClayPanel>
        </SectionReveal>
      </div>

      {/* Toast */}
      {toastVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-6 right-6 z-50 clay-panel rounded-lg border border-white/10 px-5 py-3 text-sm shadow-2xl"
        >
          Migration engine coming soon
        </motion.div>
      )}
    </AppFrame>
  );
}

/* ── Sub-components ────────────────────────────────────────── */

function ProviderPicker({
  label,
  selected,
  onSelect,
  disabledProvider,
}: {
  label: string;
  selected: Provider;
  onSelect: (p: Provider) => void;
  disabledProvider: Provider;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground uppercase tracking-wider text-center">
        {label}
      </p>
      <div className="flex gap-3">
        {PROVIDERS.map((p) => {
          const info = PROVIDER_ICON[p];
          const isActive = p === selected;
          const isDisabled = p === disabledProvider;
          return (
            <motion.button
              key={p}
              onClick={() => !isDisabled && onSelect(p)}
              whileHover={!isDisabled ? { scale: 1.05 } : undefined}
              whileTap={!isDisabled ? { scale: 0.97 } : undefined}
              className={cn(
                "clay-card flex flex-col items-center gap-2 rounded-xl px-6 py-4 transition-all border-2",
                isActive
                  ? "border-primary shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                  : "border-transparent",
                isDisabled && "opacity-30 cursor-not-allowed"
              )}
              style={
                isActive
                  ? { borderColor: PROVIDER_COLOR[p], boxShadow: `0 0 20px ${PROVIDER_COLOR[p]}25` }
                  : undefined
              }
            >
              <ServiceIcon provider={p} size={28} />
              <span className="text-xs font-medium">{info?.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function CostBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">${value.toLocaleString()}/mo</span>
      </div>
      <div className="relative h-3 rounded-full bg-graphite/50 border border-white/5 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  );
}
