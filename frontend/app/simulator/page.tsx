"use client";

// Chaos simulator: trigger infra failures against a fixed multi-cloud topology
// and watch the architecture react. A small reducer state machine marks affected
// nodes down/dimmed, reroutes animated traffic packets to survivors, and streams
// a warnings feed. Reset restores health. Reduced-motion users get the end state
// (dimmed nodes + highlighted survivor paths) without packet animation.
import { useReducer } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import {
  Zap,
  Globe,
  Database,
  Network,
  ServerCrash,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { ServiceIcon, PROVIDER_COLOR } from "@/lib/brand-icons";
import { CATALOG, type Provider } from "@/lib/catalog/nodes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Topology ───────────────────────────────────────────────────────────────
// Fixed graph laid out on a 0-100 viewBox so we can draw SVG edges + packets.
// Each node borrows a real CATALOG service for its icon/provider tint.
type Role = "edge" | "lb" | "service" | "db";
interface SimNode {
  id: string;
  label: string;
  role: Role;
  az: "a" | "b" | "edge"; // which availability zone (for AZ failures)
  region: "us-east" | "us-west" | "global";
  catalogId: string;
  provider: Provider;
  x: number; // 0-100
  y: number;
}

function svc(id: string) {
  const s = CATALOG.find((c) => c.id === id);
  return { catalogId: id, provider: (s?.provider ?? "aws") as Provider };
}

const NODES: SimNode[] = [
  { id: "cdn", label: "Edge CDN", role: "edge", az: "edge", region: "global", ...svc("cloudfront"), x: 50, y: 8 },
  { id: "lb", label: "Load Balancer", role: "lb", az: "edge", region: "global", ...svc("run"), x: 50, y: 28 },
  { id: "svc-a1", label: "API · AZ-a", role: "service", az: "a", region: "us-east", ...svc("ec2"), x: 20, y: 52 },
  { id: "svc-a2", label: "Workers · AZ-a", role: "service", az: "a", region: "us-east", ...svc("lambda"), x: 40, y: 52 },
  { id: "svc-b1", label: "API · AZ-b", role: "service", az: "b", region: "us-west", ...svc("gce"), x: 60, y: 52 },
  { id: "svc-b2", label: "Workers · AZ-b", role: "service", az: "b", region: "us-west", ...svc("functions"), x: 80, y: 52 },
  { id: "db-a", label: "Primary DB", role: "db", az: "a", region: "us-east", ...svc("rds"), x: 32, y: 82 },
  { id: "db-b", label: "Replica DB", role: "db", az: "b", region: "us-west", ...svc("spanner"), x: 68, y: 82 },
];

// Directed traffic edges (source → target).
const EDGES: [string, string][] = [
  ["cdn", "lb"],
  ["lb", "svc-a1"],
  ["lb", "svc-a2"],
  ["lb", "svc-b1"],
  ["lb", "svc-b2"],
  ["svc-a1", "db-a"],
  ["svc-a2", "db-a"],
  ["svc-b1", "db-b"],
  ["svc-b2", "db-b"],
  ["db-a", "db-b"], // replication
];

const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

// ── Failure scenarios ────────────────────────────────────────────────────────
type Kind = "az" | "region" | "db" | "lb" | "crash";

interface Scenario {
  kind: Kind;
  label: string;
  icon: LucideIcon;
  down: (n: SimNode) => boolean;
  warnings: string[];
}

const SCENARIOS: Scenario[] = [
  {
    kind: "az",
    label: "AZ failure",
    icon: Zap,
    down: (n) => n.az === "a",
    warnings: [
      "Availability Zone us-east-1a lost power — instances unreachable.",
      "Health checks failing for API · AZ-a, Workers · AZ-a.",
      "Primary DB unreachable — promoting Replica DB in AZ-b.",
      "Load balancer draining AZ-a targets, rerouting to AZ-b.",
      "Traffic stabilized on surviving zone. Capacity at 92%.",
    ],
  },
  {
    kind: "region",
    label: "Region failure",
    icon: Globe,
    down: (n) => n.region === "us-east",
    warnings: [
      "Region us-east-1 unreachable — control plane timeout.",
      "All us-east compute and data services marked unhealthy.",
      "Failing over to us-west-2 disaster-recovery region.",
      "Cross-region replica promoted to primary.",
      "Global CDN steering all traffic to us-west-2.",
    ],
  },
  {
    kind: "db",
    label: "DB failure",
    icon: Database,
    down: (n) => n.id === "db-a",
    warnings: [
      "Primary DB connection pool exhausted — write errors spiking.",
      "Primary DB failed liveness probe 3× — marking down.",
      "Automatic failover to Replica DB initiated.",
      "Replica DB promoted to primary, accepting writes.",
      "Write latency recovered to 14ms p99.",
    ],
  },
  {
    kind: "lb",
    label: "LB failure",
    icon: Network,
    down: (n) => n.id === "lb",
    warnings: [
      "Load Balancer node unresponsive — 502s at the edge.",
      "Edge CDN detecting origin failure.",
      "Spinning up standby load balancer from warm pool.",
      "CDN origin shield absorbing requests during cutover.",
      "New load balancer healthy — request path restored.",
    ],
  },
  {
    kind: "crash",
    label: "Service crash",
    icon: ServerCrash,
    down: (n) => n.id === "svc-a1",
    warnings: [
      "API · AZ-a crashed — SIGSEGV in request handler.",
      "Container restart backoff engaged (attempt 3).",
      "Load balancer ejecting crashed target from rotation.",
      "Requests rebalanced across remaining API workers.",
      "Error rate back under SLO. Auto-heal scheduled.",
    ],
  },
];

// ── State machine ────────────────────────────────────────────────────────────
interface State {
  active: Kind | null;
  downIds: Set<string>;
  warnings: string[]; // newest first
}
type Action = { type: "trigger"; kind: Kind } | { type: "reset" };

const INITIAL: State = { active: null, downIds: new Set(), warnings: [] };

function reducer(state: State, action: Action): State {
  if (action.type === "reset") return INITIAL;
  const scenario = SCENARIOS.find((s) => s.kind === action.kind)!;
  const downIds = new Set(NODES.filter(scenario.down).map((n) => n.id));
  return {
    active: action.kind,
    downIds,
    // Feed newest-first; prefixed with the scenario key so keys stay unique
    // even if the same scenario is triggered twice.
    warnings: scenario.warnings.map((w, i) => `${action.kind}-${i}::${w}`).reverse(),
  };
}

const ROLE_ICON: Record<Role, LucideIcon> = {
  edge: Globe,
  lb: Network,
  service: Activity,
  db: Database,
};

export default function SimulatorPage() {
  const reduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const failing = state.active !== null;

  // An edge is "dead" if either endpoint is down. Live edges that carry traffic
  // to a survivor are highlighted as reroute paths once a failure is active.
  const edgeState = (from: string, to: string) => {
    const dead = state.downIds.has(from) || state.downIds.has(to);
    return { dead, reroute: failing && !dead };
  };

  return (
    <AppFrame
      title="Simulator"
      actions={
        <Button
          variant="outline"
          size="lg"
          className="gap-1.5"
          onClick={() => dispatch({ type: "reset" })}
          disabled={!failing}
        >
          <RotateCcw className="size-4" /> Reset
        </Button>
      }
    >
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr_300px]">
        {/* ── Control panel ─────────────────────────────────────────────── */}
        <section aria-label="Failure controls" className="clay flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-status-danger" />
            <h2 className="font-display text-lg font-semibold">Chaos controls</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Inject a failure and watch the topology self-heal.
          </p>
          <div className="mt-2 flex flex-col gap-2.5">
            {SCENARIOS.map((s) => {
              const Icon = s.icon;
              const isActive = state.active === s.kind;
              return (
                <button
                  key={s.kind}
                  onClick={() => dispatch({ type: "trigger", kind: s.kind })}
                  aria-pressed={isActive}
                  className={cn(
                    "clay-pressable group flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors",
                    isActive && "clay-inset text-status-danger",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
                      isActive
                        ? "bg-status-danger/15 text-status-danger"
                        : "bg-muted/60 text-muted-foreground group-hover:text-status-danger",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1">{s.label}</span>
                  {isActive && (
                    <span className="size-2 animate-pulse rounded-full bg-status-danger" aria-hidden />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4">
            <Button
              variant="secondary"
              className="w-full gap-1.5"
              onClick={() => dispatch({ type: "reset" })}
              disabled={!failing}
            >
              <RotateCcw className="size-4" /> Restore health
            </Button>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={cn(
                  "size-2 rounded-full",
                  failing ? "bg-status-danger animate-pulse" : "bg-status-success",
                )}
                aria-hidden
              />
              System {failing ? "degraded" : "healthy"}
            </p>
          </div>
        </section>

        {/* ── Architecture view ─────────────────────────────────────────── */}
        <section aria-label="Architecture" className="clay relative overflow-hidden p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Live topology</h2>
            <Badge variant={failing ? undefined : "cyan"} className={failing ? "bg-status-danger/15 text-status-danger" : undefined}>
              {failing ? "Rerouting traffic" : "All systems nominal"}
            </Badge>
          </div>

          <div className="relative aspect-[4/3] w-full">
            {/* Edges + packets live in one SVG behind the node cards. */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
              aria-hidden
            >
              {EDGES.map(([from, to]) => {
                const a = NODE_BY_ID[from];
                const b = NODE_BY_ID[to];
                const { dead, reroute } = edgeState(from, to);
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={
                      dead
                        ? "var(--status-danger)"
                        : reroute
                          ? "var(--status-success)"
                          : "var(--border)"
                    }
                    strokeWidth={reroute ? 0.6 : 0.4}
                    strokeDasharray={dead ? "1.6 1.6" : undefined}
                    strokeOpacity={dead ? 0.5 : reroute ? 0.9 : 0.5}
                    className="transition-all duration-500"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              {/* Animated traffic packets on live edges (skipped for reduced-motion). */}
              {!reduce &&
                EDGES.map(([from, to], i) => {
                  const { dead } = edgeState(from, to);
                  if (dead) return null;
                  const a = NODE_BY_ID[from];
                  const b = NODE_BY_ID[to];
                  return (
                    <motion.circle
                      key={`packet-${from}-${to}`}
                      r={0.9}
                      fill={failing ? "var(--status-success)" : "var(--accent-cyan)"}
                      initial={{ cx: a.x, cy: a.y }}
                      animate={{ cx: [a.x, b.x], cy: [a.y, b.y] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "linear",
                        delay: (i % 5) * 0.32,
                      }}
                    />
                  );
                })}
            </svg>

            {/* Node cards positioned over the SVG. */}
            {NODES.map((n) => {
              const down = state.downIds.has(n.id);
              const RoleIcon = ROLE_ICON[n.role];
              return (
                <motion.div
                  key={n.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  animate={
                    reduce
                      ? { opacity: down ? 0.4 : 1 }
                      : down
                        ? { opacity: 0.4, scale: [1, 1.06, 1], x: [0, -1, 1, 0] }
                        : { opacity: 1, scale: 1, x: 0 }
                  }
                  transition={down && !reduce ? { duration: 0.4 } : { duration: 0.35 }}
                >
                  <div
                    className={cn(
                      "clay flex w-[104px] flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-center transition-colors sm:w-[120px]",
                      down && "ring-2 ring-status-danger/70",
                    )}
                    style={
                      down
                        ? undefined
                        : { boxShadow: `0 0 0 1px ${PROVIDER_COLOR[n.provider]}22` }
                    }
                  >
                    <div className="relative grid size-8 place-items-center">
                      <ServiceIcon provider={n.provider} id={n.catalogId} name={n.label} size={28} />
                      {down && (
                        <span className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-status-danger text-white">
                          <AlertTriangle className="size-2.5" />
                        </span>
                      )}
                    </div>
                    <span className="line-clamp-1 text-[11px] font-semibold leading-tight text-foreground">
                      {n.label}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-[9px] font-medium uppercase tracking-wide",
                        down ? "text-status-danger" : "text-status-success",
                      )}
                    >
                      <RoleIcon className="size-2.5" />
                      {down ? "down" : "healthy"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Warnings feed ─────────────────────────────────────────────── */}
        <section
          aria-label="Warnings feed"
          aria-live="polite"
          className="clay flex flex-col p-5 xl:col-start-3 xl:row-start-1"
        >
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="size-5 text-status-warning" />
            <h2 className="font-display text-lg font-semibold">Warnings</h2>
          </div>
          <div className="min-h-[240px] flex-1">
            {state.warnings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No incidents. Trigger a failure to stream diagnostics here.
              </p>
            ) : (
              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {state.warnings.map((raw, i) => {
                    const [key, text] = raw.split("::");
                    // Recovery messages (last in each scenario) read as success.
                    const recovering = i === 0;
                    return (
                      <motion.li
                        key={key}
                        initial={reduce ? false : { opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.3, delay: reduce ? 0 : Math.min(i, 4) * 0.15 }}
                        className={cn(
                          "clay-inset flex gap-2 rounded-xl p-2.5 text-xs",
                          recovering ? "text-status-success" : "text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 size-1.5 shrink-0 rounded-full",
                            recovering ? "bg-status-success" : "bg-status-warning",
                          )}
                          aria-hidden
                        />
                        <span className="leading-snug">{text}</span>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
