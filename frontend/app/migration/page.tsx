"use client";

// Migration planner: pick a source + target cloud, watch each service category
// morph from one provider's mark to the other's with a risk badge, and read a
// derived insights row (complexity / risk / timeline / cost). All data is mock —
// service ids come from CATALOG, risk seeds from MIGRATION_MAP + category weights
// so SSR and client render identically (no Date/random in render).
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { ArrowRight, Rocket, ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { ClayPanel } from "@/components/layout/clay-panel";
import { NumberTicker } from "@/components/effects/number-ticker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceIcon, PROVIDER_COLOR } from "@/lib/brand-icons";
import { PROVIDER_META, type Provider } from "@/lib/catalog/nodes";
import { MIGRATION_MAP } from "@/lib/mock";
import { cn } from "@/lib/utils";

const PROVIDERS: Provider[] = ["aws", "azure", "gcp"];

type Risk = "low" | "medium" | "high";

// Each row is a portable service category with the concrete service (id+name)
// per provider. `weight` is the category's baseline migration difficulty.
interface Category {
  label: string;
  weight: number; // 1 (trivial) .. 5 (gnarly)
  svc: Record<Provider, { id: string; name: string }>;
}

const CATEGORIES: Category[] = [
  {
    label: "Compute",
    weight: 1,
    svc: {
      aws: { id: "ec2", name: "EC2" },
      azure: { id: "vm", name: "Virtual Machines" },
      gcp: { id: "gce", name: "Compute Engine" },
    },
  },
  {
    label: "Serverless",
    weight: 3,
    svc: {
      aws: { id: "lambda", name: "Lambda" },
      azure: { id: "functions", name: "Functions" },
      gcp: { id: "run", name: "Cloud Run" },
    },
  },
  {
    label: "Object storage",
    weight: 1,
    svc: {
      aws: { id: "s3", name: "S3" },
      azure: { id: "blob", name: "Blob Storage" },
      gcp: { id: "gcs", name: "Cloud Storage" },
    },
  },
  {
    label: "NoSQL",
    weight: 5,
    svc: {
      aws: { id: "dynamodb", name: "DynamoDB" },
      azure: { id: "cosmos", name: "Cosmos DB" },
      gcp: { id: "spanner", name: "Spanner" },
    },
  },
  {
    label: "Relational SQL",
    weight: 3,
    svc: {
      aws: { id: "rds", name: "RDS" },
      azure: { id: "cosmos", name: "Azure SQL" },
      gcp: { id: "cloudsql", name: "Cloud SQL" },
    },
  },
  {
    label: "CDN",
    weight: 1,
    svc: {
      aws: { id: "cloudfront", name: "CloudFront" },
      azure: { id: "cdn", name: "Azure CDN" },
      gcp: { id: "run", name: "Cloud CDN" },
    },
  },
  {
    label: "Kubernetes",
    weight: 2,
    svc: {
      aws: { id: "eks", name: "EKS" },
      azure: { id: "aks", name: "AKS" },
      gcp: { id: "gke", name: "GKE" },
    },
  },
  {
    label: "Messaging",
    weight: 3,
    svc: {
      aws: { id: "sqs", name: "SQS" },
      azure: { id: "servicebus", name: "Service Bus" },
      gcp: { id: "pubsub", name: "Pub/Sub" },
    },
  },
];

// MIGRATION_MAP gives us a few authored risk overrides keyed by target label.
const RISK_OVERRIDE = new Map(MIGRATION_MAP.map((m) => [m.to, m.risk] as const));

// Deterministic risk: authored override wins, else derived from category weight
// plus a cross-cloud penalty (Azure legs are pricier to move).
function riskFor(cat: Category, source: Provider, target: Provider): Risk {
  const override = RISK_OVERRIDE.get(cat.svc[target].name);
  if (override) return override;
  const crossPenalty = source === "azure" || target === "azure" ? 1 : 0;
  const score = cat.weight + crossPenalty;
  if (score >= 5) return "high";
  if (score >= 3) return "medium";
  return "low";
}

const RISK_META: Record<Risk, { label: string; className: string; Icon: typeof Shield }> = {
  low: { label: "Low risk", className: "text-status-success", Icon: ShieldCheck },
  medium: { label: "Medium risk", className: "text-status-warning", Icon: Shield },
  high: { label: "High risk", className: "text-status-danger", Icon: ShieldAlert },
};

const RISK_SCORE: Record<Risk, number> = { low: 1, medium: 2, high: 3 };

function ProviderPicker({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: Provider;
  onChange: (p: Provider) => void;
  disabled?: Provider;
}) {
  return (
    <div className="flex-1">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="clay-inset flex gap-1 rounded-2xl p-1.5" role="radiogroup" aria-label={label}>
        {PROVIDERS.map((p) => {
          const active = p === value;
          const isDisabled = p === disabled;
          return (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={isDisabled}
              onClick={() => onChange(p)}
              className={cn(
                "relative flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan",
                isDisabled && "cursor-not-allowed opacity-30",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              style={active ? { color: PROVIDER_COLOR[p] } : undefined}
            >
              {active && (
                <motion.span
                  layoutId="provider-pill"
                  className="clay absolute inset-0 -z-10 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {PROVIDER_META[p].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MorphRow({
  cat,
  source,
  target,
  index,
  reduced,
}: {
  cat: Category;
  source: Provider;
  target: Provider;
  index: number;
  reduced: boolean;
}) {
  const risk = riskFor(cat, source, target);
  const { label: riskLabel, className: riskClass, Icon: RiskIcon } = RISK_META[risk];
  const from = cat.svc[source];
  const to = cat.svc[target];

  return (
    <motion.li
      layout
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduced ? 0 : index * 0.05, type: "spring", stiffness: 260, damping: 26 }}
      className="clay flex items-center gap-4 rounded-2xl p-4"
    >
      <span className="w-28 shrink-0 text-sm font-medium text-muted-foreground">{cat.label}</span>

      <div className="flex flex-1 items-center gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="clay-inset grid size-11 shrink-0 place-items-center rounded-xl">
            <ServiceIcon provider={source} id={from.id} name={from.name} size={26} />
          </span>
          <span className="truncate text-sm font-semibold">{from.name}</span>
        </div>

        <motion.span
          aria-hidden
          animate={reduced ? undefined : { x: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="shrink-0 text-muted-foreground"
        >
          <ArrowRight className="size-4" />
        </motion.span>

        <div className="flex min-w-0 items-center gap-2.5">
          <span className="clay-inset grid size-11 shrink-0 place-items-center rounded-xl">
            <ServiceIcon provider={target} id={to.id} name={to.name} size={26} />
          </span>
          <span className="truncate text-sm font-semibold">{to.name}</span>
        </div>
      </div>

      <Badge variant="outline" className={cn("shrink-0 gap-1.5", riskClass)}>
        <RiskIcon className="size-3.5" />
        {riskLabel}
      </Badge>
    </motion.li>
  );
}

function InsightCard({
  label,
  value,
  prefix,
  suffix,
  accent,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  accent: string;
}) {
  return (
    <ClayPanel className="p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-2 font-display text-3xl font-bold", accent)}>
        {prefix}
        <NumberTicker value={value} suffix={suffix} />
      </p>
    </ClayPanel>
  );
}

export default function MigrationPage() {
  const reduced = useReducedMotion() ?? false;
  const [source, setSource] = useState<Provider>("aws");
  const [target, setTarget] = useState<Provider>("gcp");

  // Derived insights — pure function of the selected pair, so no effects needed.
  const insights = useMemo(() => {
    const risks = CATEGORIES.map((c) => riskFor(c, source, target));
    const totalRisk = risks.reduce((s, r) => s + RISK_SCORE[r], 0);
    const complexity = CATEGORIES.reduce((s, c) => s + c.weight, 0) + totalRisk;
    const riskScore = Math.round((totalRisk / (CATEGORIES.length * 3)) * 100);
    const timeline = Math.max(2, Math.round(complexity / 4));
    const estCost = complexity * 1400 + (source === "azure" || target === "azure" ? 6000 : 0);
    return { complexity, riskScore, timeline, estCost };
  }, [source, target]);

  const swapDisabled = source === target;

  const handleStart = () => {
    toast.success("Migration queued", {
      description: `${PROVIDER_META[source].label} → ${PROVIDER_META[target].label} · ${CATEGORIES.length} services · ~${insights.timeline} weeks`,
    });
  };

  return (
    <AppFrame
      title="Migration"
      actions={
        <Button onClick={handleStart} className="gap-2">
          <Rocket className="size-4" />
          Start migration
        </Button>
      }
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* Provider selectors */}
        <ClayPanel className="flex flex-col gap-5 sm:flex-row sm:items-end">
          <ProviderPicker label="Source cloud" value={source} onChange={setSource} disabled={target} />
          <span aria-hidden className="hidden pb-3 text-muted-foreground sm:block">
            <ArrowRight className="size-5" />
          </span>
          <ProviderPicker label="Target cloud" value={target} onChange={setTarget} disabled={source} />
        </ClayPanel>

        {swapDisabled && (
          <p className="text-sm text-status-warning">Pick two different clouds to plan a migration.</p>
        )}

        {/* Insights row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <InsightCard label="Complexity score" value={insights.complexity} accent="text-accent-violet" />
          <InsightCard label="Risk score" value={insights.riskScore} suffix="%" accent="text-status-warning" />
          <InsightCard label="Timeline" value={insights.timeline} suffix=" wk" accent="text-accent-cyan" />
          <InsightCard label="Est. cost" value={insights.estCost} prefix="$" accent="text-status-success" />
        </div>

        {/* Morph panel */}
        <section aria-label="Service migration plan">
          <h2 className="mb-3 font-display text-lg font-semibold">Service morph plan</h2>
          <motion.ul layout className="flex flex-col gap-3">
            {CATEGORIES.map((cat, i) => (
              <MorphRow
                key={cat.label}
                cat={cat}
                source={source}
                target={target}
                index={i}
                reduced={reduced}
              />
            ))}
          </motion.ul>
        </section>

        {/* Primary CTA (also in topbar actions) */}
        <div className="flex justify-end pb-2">
          <Button size="lg" onClick={handleStart} className="gap-2">
            <Rocket className="size-4" />
            Start migration
          </Button>
        </div>
      </div>
    </AppFrame>
  );
}
