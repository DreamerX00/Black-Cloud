"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Globe,
  Server,
  Database,
  HardDrive,
  Cloud,
  Network,
  Shield,
  Play,
  Square,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Gauge,
  Flame,
  ServerCrash,
  CloudOff,
  DatabaseZap,
  Unplug,
  Workflow,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AppFrame } from "@/components/layout/app-frame";
import { ClayPanel } from "@/components/layout/clay-panel";
import { GlowOrb } from "@/components/effects/glow-orb";
import { ScanLine } from "@/components/effects/scan-line";
import { NumberTicker } from "@/components/effects/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

// ponytail: all mock data inline, single-file page

/* ──────────────────────── Types ──────────────────────── */

type SimPhase = "idle" | "running" | "recovering" | "complete";
type Severity = "warning" | "destructive" | "default";
type ScenarioId = "az" | "region" | "database" | "loadbalancer" | "cascade";

interface Scenario {
  id: ScenarioId;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  severity: Severity;
  severityLabel: string;
  affectedCount: number;
  failedNodes: string[];
  brokenEdges: [string, string][];
  rerouteEdges: [string, string][];
}

interface HistoryEntry {
  id: string;
  scenario: string;
  score: number;
  timestamp: string;
  severity: Severity;
}

/* ──────────────────────── Scenarios ──────────────────────── */

const SCENARIOS: Scenario[] = [
  {
    id: "az",
    label: "AZ Failure",
    description: "Simulate a complete availability zone outage affecting EC2 instances and databases.",
    icon: CloudOff,
    severity: "destructive",
    severityLabel: "Critical",
    affectedCount: 4,
    failedNodes: ["ecs1", "rds"],
    brokenEdges: [["alb", "ecs1"], ["ecs1", "rds"]],
    rerouteEdges: [["alb", "ecs2"], ["alb", "ecs3"]],
  },
  {
    id: "region",
    label: "Region Outage",
    description: "Full region failure forcing traffic to failover region via Route53 health checks.",
    icon: Globe,
    severity: "destructive",
    severityLabel: "Critical",
    affectedCount: 7,
    failedNodes: ["cloudfront", "alb", "ecs1", "ecs2", "ecs3"],
    brokenEdges: [["route53", "cloudfront"], ["cloudfront", "alb"], ["alb", "ecs1"], ["alb", "ecs2"], ["alb", "ecs3"]],
    rerouteEdges: [],
  },
  {
    id: "database",
    label: "Database Crash",
    description: "Primary RDS instance failure with automatic failover to read replica.",
    icon: DatabaseZap,
    severity: "warning",
    severityLabel: "High",
    affectedCount: 3,
    failedNodes: ["rds"],
    brokenEdges: [["ecs1", "rds"], ["ecs2", "rds"], ["ecs3", "rds"]],
    rerouteEdges: [["ecs1", "cache"], ["ecs2", "cache"]],
  },
  {
    id: "loadbalancer",
    label: "Load Balancer Down",
    description: "Application load balancer becomes unreachable, triggering DNS failover.",
    icon: Unplug,
    severity: "warning",
    severityLabel: "High",
    affectedCount: 4,
    failedNodes: ["alb"],
    brokenEdges: [["cloudfront", "alb"], ["alb", "ecs1"], ["alb", "ecs2"], ["alb", "ecs3"]],
    rerouteEdges: [],
  },
  {
    id: "cascade",
    label: "Service Cascade",
    description: "Cascading failure starting from cache layer, overwhelming backend services.",
    icon: Flame,
    severity: "destructive",
    severityLabel: "Critical",
    affectedCount: 5,
    failedNodes: ["cache", "ecs2", "ecs3"],
    brokenEdges: [["ecs1", "cache"], ["ecs2", "cache"], ["alb", "ecs2"], ["alb", "ecs3"]],
    rerouteEdges: [["alb", "ecs1"]],
  },
];

/* ──────────────────────── Architecture ──────────────────────── */

const ARCH_NODES = [
  { id: "route53", label: "Route 53", x: 50, y: 6, icon: Globe },
  { id: "cloudfront", label: "CloudFront", x: 50, y: 18, icon: Shield },
  { id: "alb", label: "ALB", x: 50, y: 32, icon: Network },
  { id: "ecs1", label: "ECS-1", x: 18, y: 48, icon: Server },
  { id: "ecs2", label: "ECS-2", x: 50, y: 48, icon: Server },
  { id: "ecs3", label: "ECS-3", x: 82, y: 48, icon: Server },
  { id: "rds", label: "RDS", x: 22, y: 68, icon: Database },
  { id: "cache", label: "ElastiCache", x: 50, y: 68, icon: HardDrive },
  { id: "s3", label: "S3", x: 78, y: 68, icon: Cloud },
];

const ARCH_EDGES: [string, string][] = [
  ["route53", "cloudfront"],
  ["cloudfront", "alb"],
  ["alb", "ecs1"],
  ["alb", "ecs2"],
  ["alb", "ecs3"],
  ["ecs1", "rds"],
  ["ecs1", "cache"],
  ["ecs2", "rds"],
  ["ecs2", "cache"],
  ["ecs3", "cache"],
  ["ecs3", "s3"],
];

function nodePos(id: string) {
  const n = ARCH_NODES.find((n) => n.id === id);
  return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
}

/* ──────────────────────── Results Data ──────────────────────── */

const RESULT_DATA: Record<ScenarioId, {
  score: number;
  detectTime: string;
  failoverTime: string;
  recoverTime: string;
  recommendations: string[];
  recoveryTimeline: { service: string; time: string; status: "recovered" | "degraded" | "healthy" }[];
}> = {
  az: {
    score: 72,
    detectTime: "12s",
    failoverTime: "34s",
    recoverTime: "2m 18s",
    recommendations: [
      "Add multi-AZ RDS read replica for faster failover",
      "Enable cross-zone load balancing on ALB",
      "Deploy ECS tasks across 3+ AZs minimum",
    ],
    recoveryTimeline: [
      { service: "ALB Health Check", time: "0:12", status: "recovered" },
      { service: "ECS Task Replacement", time: "0:34", status: "recovered" },
      { service: "RDS Failover", time: "1:45", status: "degraded" },
      { service: "Full Recovery", time: "2:18", status: "healthy" },
    ],
  },
  region: {
    score: 38,
    detectTime: "45s",
    failoverTime: "2m 10s",
    recoverTime: "8m 42s",
    recommendations: [
      "Implement Route53 active-active multi-region routing",
      "Deploy standby infrastructure in secondary region",
      "Use DynamoDB Global Tables for data replication",
      "Enable CloudFront failover origin group",
    ],
    recoveryTimeline: [
      { service: "Route53 Failover", time: "0:45", status: "recovered" },
      { service: "Secondary Region Boot", time: "2:10", status: "degraded" },
      { service: "Data Sync", time: "5:30", status: "degraded" },
      { service: "Full Recovery", time: "8:42", status: "healthy" },
    ],
  },
  database: {
    score: 81,
    detectTime: "8s",
    failoverTime: "22s",
    recoverTime: "1m 05s",
    recommendations: [
      "Enable RDS Multi-AZ deployment for automatic failover",
      "Add ElastiCache read-through caching for DB queries",
      "Configure connection pooling with PgBouncer",
    ],
    recoveryTimeline: [
      { service: "Health Check Fail", time: "0:08", status: "recovered" },
      { service: "Read Replica Promotion", time: "0:22", status: "recovered" },
      { service: "Connection Drain", time: "0:48", status: "degraded" },
      { service: "Full Recovery", time: "1:05", status: "healthy" },
    ],
  },
  loadbalancer: {
    score: 55,
    detectTime: "15s",
    failoverTime: "42s",
    recoverTime: "3m 20s",
    recommendations: [
      "Deploy redundant ALB in secondary AZ",
      "Configure Route53 health checks with failover routing",
      "Add CloudFront origin failover configuration",
    ],
    recoveryTimeline: [
      { service: "CloudFront Detection", time: "0:15", status: "recovered" },
      { service: "DNS Failover", time: "0:42", status: "degraded" },
      { service: "ALB Replacement", time: "2:30", status: "degraded" },
      { service: "Full Recovery", time: "3:20", status: "healthy" },
    ],
  },
  cascade: {
    score: 44,
    detectTime: "5s",
    failoverTime: "1m 15s",
    recoverTime: "5m 30s",
    recommendations: [
      "Implement circuit breaker pattern in service mesh",
      "Add rate limiting and bulkhead isolation",
      "Deploy ElastiCache with multi-AZ replication",
      "Configure ECS service auto-scaling policies",
    ],
    recoveryTimeline: [
      { service: "Cache Failure Detected", time: "0:05", status: "recovered" },
      { service: "Circuit Breakers Trip", time: "0:18", status: "degraded" },
      { service: "Service Restart", time: "1:15", status: "degraded" },
      { service: "Cache Warm-up", time: "3:45", status: "degraded" },
      { service: "Full Recovery", time: "5:30", status: "healthy" },
    ],
  },
};

/* ──────────────────────── History ──────────────────────── */

const HISTORY: HistoryEntry[] = [
  { id: "h1", scenario: "AZ Failure", score: 72, timestamp: "2 hours ago", severity: "destructive" },
  { id: "h2", scenario: "Database Crash", score: 81, timestamp: "5 hours ago", severity: "warning" },
  { id: "h3", scenario: "Service Cascade", score: 44, timestamp: "1 day ago", severity: "destructive" },
  { id: "h4", scenario: "Load Balancer Down", score: 55, timestamp: "2 days ago", severity: "warning" },
  { id: "h5", scenario: "Region Outage", score: 38, timestamp: "3 days ago", severity: "destructive" },
];

/* ──────────────────────── Metrics during sim ──────────────────────── */

const IDLE_METRICS = { latency: 45, errorRate: 0.1, throughput: 12400, uptime: 99.99 };
const FAIL_METRICS = { latency: 2400, errorRate: 34.2, throughput: 3200, uptime: 94.1 };
const RECOVERED_METRICS = { latency: 68, errorRate: 0.3, throughput: 11800, uptime: 99.95 };

/* ──────────────────────── Page Component ──────────────────────── */

export default function FailureSimulatorPage() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("az");
  const [phase, setPhase] = useState<SimPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [autoRecover, setAutoRecover] = useState(true);
  const [metrics, setMetrics] = useState(IDLE_METRICS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === selectedScenario)!;
  const result = RESULT_DATA[selectedScenario];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleStart = useCallback(() => {
    setPhase("running");
    setProgress(0);
    setMetrics(FAIL_METRICS);

    const totalDuration = 5000 / speed; // 5s at 1x
    const interval = 50;
    let elapsed = 0;

    clearTimer();
    timerRef.current = setInterval(() => {
      elapsed += interval;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearTimer();
        if (autoRecover) {
          setPhase("recovering");
          setMetrics(RECOVERED_METRICS);
          // ponytail: recovery takes 2s then done
          setTimeout(() => {
            setPhase("complete");
          }, 2000 / speed);
        } else {
          setPhase("complete");
          setMetrics(RECOVERED_METRICS);
        }
      }
    }, interval);
  }, [speed, autoRecover, clearTimer]);

  const handleStop = useCallback(() => {
    clearTimer();
    setPhase("complete");
    setMetrics(RECOVERED_METRICS);
    setProgress(100);
  }, [clearTimer]);

  const handleReset = useCallback(() => {
    clearTimer();
    setPhase("idle");
    setProgress(0);
    setMetrics(IDLE_METRICS);
  }, [clearTimer]);

  // cleanup on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  const isActive = phase === "running" || phase === "recovering";
  const failedNodes = isActive ? scenario.failedNodes : [];
  const brokenEdges = isActive ? scenario.brokenEdges : [];
  const rerouteEdges = isActive ? scenario.rerouteEdges : [];

  return (
    <AppFrame title="Failure Simulator">
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* ===== LEFT COLUMN ===== */}
        <div className="w-full space-y-6 xl:w-[38%]">
          {/* Header */}
          <div className="relative">
            <GlowOrb color="rgba(239,68,68,0.2)" size={180} className="-left-10 -top-10" />
            <h1 className="font-display relative text-2xl font-bold text-foreground">
              Failure Simulator
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Simulate infrastructure failures and watch traffic reroute in real time.
            </p>
          </div>

          {/* Scenario Cards */}
          <div className="space-y-3">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Choose Scenario
            </label>
            <div className="space-y-2">
              {SCENARIOS.map((s) => {
                const Icon = s.icon;
                const active = selectedScenario === s.id;
                return (
                  <ClayPanel
                    key={s.id}
                    hoverable
                    className={cn(
                      "cursor-pointer p-3 transition-all",
                      active && "ring-1 ring-primary/40 border-primary/30"
                    )}
                    glowColor={active ? "rgba(139,92,246,0.3)" : undefined}
                  >
                    <button
                      onClick={() => { if (phase === "idle") setSelectedScenario(s.id); }}
                      className="flex w-full items-start gap-3 text-left"
                      disabled={phase !== "idle"}
                    >
                      <div className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        s.severity === "destructive" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{s.label}</span>
                          <Badge variant={s.severity}>{s.severityLabel}</Badge>
                          <span className="ml-auto text-xs text-muted-foreground font-mono">
                            {s.affectedCount} services
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                      </div>
                      {active && <ChevronRight className="h-4 w-4 mt-1 shrink-0 text-primary" />}
                    </button>
                  </ClayPanel>
                );
              })}
            </div>
          </div>

          {/* Simulation Controls */}
          <ClayPanel className="p-4 space-y-4">
            <h2 className="font-display text-sm font-semibold text-foreground">
              Simulation Controls
            </h2>

            {/* Buttons */}
            <div className="flex gap-2">
              {phase === "idle" ? (
                <motion.button
                  onClick={handleStart}
                  className="clay-button flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-foreground"
                  whileTap={{ scale: 0.97 }}
                >
                  <Play className="h-4 w-4" />
                  Start Simulation
                </motion.button>
              ) : phase === "running" || phase === "recovering" ? (
                <motion.button
                  onClick={handleStop}
                  className="clay-button flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-destructive"
                  whileTap={{ scale: 0.97 }}
                >
                  <Square className="h-4 w-4" />
                  Stop
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleReset}
                  className="clay-button flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-foreground"
                  whileTap={{ scale: 0.97 }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </motion.button>
              )}
            </div>

            {/* Speed selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Speed</span>
              <div className="flex gap-1">
                {[1, 2, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => { if (phase === "idle") setSpeed(s); }}
                    disabled={phase !== "idle"}
                    className={cn(
                      "clay-card px-2.5 py-1 text-xs font-mono transition-all",
                      speed === s
                        ? "ring-1 ring-primary/40 text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                      phase !== "idle" && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-recovery toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Auto-Recovery</span>
              <Switch
                checked={autoRecover}
                onCheckedChange={setAutoRecover}
                disabled={phase !== "idle"}
              />
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Timeline</span>
                <span className="font-mono">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Phase indicator */}
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 text-xs"
                >
                  <div className="relative h-3 w-3">
                    <div className="absolute inset-0 animate-ping rounded-full bg-destructive/50" />
                    <div className="absolute inset-0.5 rounded-full bg-destructive" />
                  </div>
                  <span className="text-destructive font-semibold">
                    {phase === "running" ? "FAILURE IN PROGRESS" : "RECOVERING..."}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </ClayPanel>

          {/* History */}
          <div className="space-y-3">
            <h2 className="font-display text-sm font-semibold text-foreground">
              Recent Simulations
            </h2>
            <div className="space-y-2">
              {HISTORY.map((h) => (
                <ClayPanel key={h.id} hoverable className="flex items-center gap-3 p-3">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-bold",
                    h.score >= 70 ? "bg-success/15 text-success" :
                    h.score >= 50 ? "bg-warning/15 text-warning" :
                    "bg-destructive/15 text-destructive"
                  )}>
                    {h.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">{h.scenario}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={h.severity} className="text-[10px] px-1.5 py-0">
                        {h.severity === "destructive" ? "Critical" : "High"}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        <Clock className="mr-0.5 inline h-3 w-3" />
                        {h.timestamp}
                      </span>
                    </div>
                  </div>
                </ClayPanel>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="w-full xl:w-[62%] space-y-6">
          {/* Architecture Diagram */}
          <ClayPanel className="relative overflow-hidden p-4">
            {isActive && <ScanLine speed={4} />}
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-foreground">
                Architecture Topology
              </h3>
              <Badge variant={isActive ? "destructive" : phase === "complete" ? "success" : "outline"}>
                {phase === "idle" ? "Standby" : phase === "running" ? "Failure Active" : phase === "recovering" ? "Recovering" : "Simulation Complete"}
              </Badge>
            </div>

            <div className="clay-card relative overflow-hidden p-2">
              <svg viewBox="0 0 100 80" className="h-auto w-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="node-glow">
                    <feGaussianBlur stdDeviation="0.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="fail-glow">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Normal edges */}
                {ARCH_EDGES.map(([fromId, toId]) => {
                  const from = nodePos(fromId);
                  const to = nodePos(toId);
                  const isBroken = brokenEdges.some(([a, b]) => a === fromId && b === toId);
                  const isReroute = rerouteEdges.some(([a, b]) => a === fromId && b === toId);
                  const pathId = `path-${fromId}-${toId}`;

                  return (
                    <g key={pathId}>
                      <line
                        x1={from.x}
                        y1={from.y + 3}
                        x2={to.x}
                        y2={to.y}
                        stroke={isBroken ? "rgba(239,68,68,0.5)" : isReroute ? "rgba(6,182,212,0.6)" : "rgba(139,92,246,0.3)"}
                        strokeWidth={isBroken ? "0.4" : "0.3"}
                        strokeDasharray={isBroken ? "0.8,0.8" : "1,0.5"}
                      />
                      {/* Animated traffic dot */}
                      {!isBroken && (
                        <circle
                          r="0.6"
                          fill={isReroute ? "#06B6D4" : isActive ? "#EF4444" : "#8B5CF6"}
                          opacity={0.8}
                        >
                          <animateMotion
                            dur={isActive ? "1.5s" : "3s"}
                            repeatCount="indefinite"
                            path={`M${from.x},${from.y + 3} L${to.x},${to.y}`}
                          />
                        </circle>
                      )}
                      {/* Broken edge X marker */}
                      {isBroken && (
                        <text
                          x={(from.x + to.x) / 2}
                          y={(from.y + 3 + to.y) / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#EF4444"
                          fontSize="3"
                          fontWeight="bold"
                        >
                          ✕
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {ARCH_NODES.map((node) => {
                  const isFailed = failedNodes.includes(node.id);
                  return (
                    <g key={node.id}>
                      {/* Pulse ring for failed nodes */}
                      {isFailed && (
                        <rect
                          x={node.x - 10}
                          y={node.y - 2.5}
                          width={20}
                          height={9}
                          rx={2}
                          fill="none"
                          stroke="rgba(239,68,68,0.4)"
                          strokeWidth="0.4"
                          filter="url(#fail-glow)"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.8;0.2;0.8"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        </rect>
                      )}
                      {/* Node box */}
                      <rect
                        x={node.x - 9}
                        y={node.y - 2}
                        width={18}
                        height={8}
                        rx={1.5}
                        fill={isFailed ? "rgba(239,68,68,0.15)" : "rgba(22,27,34,0.9)"}
                        stroke={isFailed ? "rgba(239,68,68,0.6)" : "rgba(139,92,246,0.25)"}
                        strokeWidth="0.3"
                      />
                      <rect
                        x={node.x - 9}
                        y={node.y - 2}
                        width={18}
                        height={8}
                        rx={1.5}
                        fill="none"
                        stroke={isFailed ? "rgba(239,68,68,0.2)" : "rgba(139,92,246,0.1)"}
                        strokeWidth="0.6"
                        filter="url(#node-glow)"
                      />
                      {/* Status dot */}
                      <circle
                        cx={node.x - 6.5}
                        cy={node.y + 2}
                        r="1"
                        fill={isFailed ? "#EF4444" : "#22C55E"}
                      >
                        {isFailed && (
                          <animate attributeName="opacity" values="1;0.3;1" dur="0.6s" repeatCount="indefinite" />
                        )}
                      </circle>
                      {/* Label */}
                      <text
                        x={node.x + 1}
                        y={node.y + 3}
                        textAnchor="middle"
                        fill={isFailed ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.85)"}
                        fontSize="1.8"
                        fontFamily="Space Grotesk, sans-serif"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}

                {/* Tier labels */}
                {["DNS", "CDN", "Load Balancer", "Compute", "Data Layer"].map(
                  (label, i) => {
                    const yPositions = [6, 18, 32, 48, 68];
                    return (
                      <text
                        key={label}
                        x={1}
                        y={yPositions[i] + 2}
                        fill="rgba(139,92,246,0.25)"
                        fontSize="1.4"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {label}
                      </text>
                    );
                  }
                )}
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" /> Healthy
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-[#EF4444]" /> Failed
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-1 w-4 bg-[#8B5CF6] rounded" /> Normal Traffic
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-1 w-4 bg-[#06B6D4] rounded" /> Rerouted
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-1 w-4 border border-dashed border-[#EF4444] rounded" /> Broken
              </span>
            </div>
          </ClayPanel>

          {/* Live Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              label="Latency"
              value={metrics.latency}
              suffix="ms"
              icon={Gauge}
              alert={metrics.latency > 200}
            />
            <MetricCard
              label="Error Rate"
              value={metrics.errorRate}
              suffix="%"
              icon={AlertTriangle}
              alert={metrics.errorRate > 1}
              decimals={1}
            />
            <MetricCard
              label="Throughput"
              value={metrics.throughput}
              suffix="/s"
              icon={Activity}
              alert={metrics.throughput < 5000}
            />
            <MetricCard
              label="Uptime"
              value={metrics.uptime}
              suffix="%"
              icon={TrendingUp}
              alert={metrics.uptime < 99.9}
              decimals={2}
            />
          </div>

          {/* Results Panel */}
          <AnimatePresence mode="wait">
            {phase === "complete" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Resilience Score */}
                <ClayPanel className="p-4" glowColor={result.score >= 70 ? "rgba(34,197,94,0.3)" : result.score >= 50 ? "rgba(234,179,8,0.3)" : "rgba(239,68,68,0.3)"}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      Resilience Score
                    </h3>
                    <span className={cn(
                      "font-mono text-3xl font-bold",
                      result.score >= 70 ? "text-success" : result.score >= 50 ? "text-warning" : "text-destructive"
                    )}>
                      <NumberTicker value={result.score} duration={1200} />
                      <span className="text-lg text-muted-foreground">/100</span>
                    </span>
                  </div>
                  <Progress value={result.score} className="h-2.5" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {result.score >= 70 ? "Good resilience. Minor improvements recommended." :
                     result.score >= 50 ? "Moderate resilience. Several improvements needed." :
                     "Poor resilience. Critical improvements required."}
                  </p>
                </ClayPanel>

                {/* Timing Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <ClayPanel className="p-3 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Detect</span>
                    <p className="font-mono text-lg font-bold text-foreground mt-1">{result.detectTime}</p>
                  </ClayPanel>
                  <ClayPanel className="p-3 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Failover</span>
                    <p className="font-mono text-lg font-bold text-foreground mt-1">{result.failoverTime}</p>
                  </ClayPanel>
                  <ClayPanel className="p-3 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Recovery</span>
                    <p className="font-mono text-lg font-bold text-foreground mt-1">{result.recoverTime}</p>
                  </ClayPanel>
                </div>

                {/* Recovery Timeline */}
                <ClayPanel className="p-4">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                    Recovery Timeline
                  </h3>
                  <div className="space-y-3">
                    {result.recoveryTimeline.map((step, i) => (
                      <motion.div
                        key={step.service}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.3 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                          {step.status === "healthy" ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : step.status === "recovered" ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-foreground">{step.service}</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{step.time}</span>
                        <Badge
                          variant={step.status === "healthy" ? "success" : step.status === "recovered" ? "default" : "warning"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {step.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </ClayPanel>

                {/* Recommendations */}
                <ClayPanel className="p-4">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                    Recommendations
                  </h3>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                        className="flex items-start gap-2"
                      >
                        <Zap className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                        <span className="text-xs text-muted-foreground">{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                </ClayPanel>

                {/* Affected Services */}
                <ClayPanel className="p-4">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                    Affected Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {scenario.failedNodes.map((nodeId) => {
                      const node = ARCH_NODES.find((n) => n.id === nodeId);
                      return node ? (
                        <motion.div
                          key={nodeId}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="clay-card flex items-center gap-2 px-3 py-1.5 text-xs"
                        >
                          <XCircle className="h-3 w-3 text-destructive" />
                          <span className="text-foreground font-medium">{node.label}</span>
                          <Badge variant="destructive" className="text-[9px] px-1 py-0">down</Badge>
                        </motion.div>
                      ) : null;
                    })}
                    {scenario.rerouteEdges.map(([, toId]) => {
                      const node = ARCH_NODES.find((n) => n.id === toId);
                      return node ? (
                        <motion.div
                          key={`reroute-${toId}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="clay-card flex items-center gap-2 px-3 py-1.5 text-xs"
                        >
                          <Workflow className="h-3 w-3 text-accent" />
                          <span className="text-foreground font-medium">{node.label}</span>
                          <Badge variant="default" className="text-[9px] px-1 py-0">rerouted</Badge>
                        </motion.div>
                      ) : null;
                    })}
                  </div>
                </ClayPanel>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state when idle and no results */}
          {phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="clay-card mb-4 rounded-2xl p-6">
                <ServerCrash className="mx-auto h-10 w-10 text-primary/40" />
              </div>
              <p className="text-sm text-muted-foreground">
                Select a failure scenario and click Start to begin the simulation.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}

/* ──────────────────────── Metric Card ──────────────────────── */

function MetricCard({
  label,
  value,
  suffix,
  icon: Icon,
  alert,
  decimals = 0,
}: {
  label: string;
  value: number;
  suffix: string;
  icon: React.ComponentType<{ className?: string }>;
  alert: boolean;
  decimals?: number;
}) {
  // ponytail: NumberTicker only does integers, format decimals manually
  const display = decimals > 0 ? value.toFixed(decimals) : undefined;

  return (
    <ClayPanel className="p-3" glowColor={alert ? "rgba(239,68,68,0.2)" : undefined}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("h-3.5 w-3.5", alert ? "text-destructive" : "text-muted-foreground")} />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className={cn(
          "font-mono text-xl font-bold",
          alert ? "text-destructive" : "text-foreground"
        )}>
          {decimals > 0 ? display : <NumberTicker value={value} duration={800} />}
        </span>
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </div>
    </ClayPanel>
  );
}
