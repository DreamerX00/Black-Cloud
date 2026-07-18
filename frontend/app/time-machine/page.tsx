"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  History,
  Plus,
  Minus,
  Pencil,
  RotateCcw,
  Download,
  GitCompare,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Server,
  Database,
  Globe,
  Shield,
} from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { ClayPanel } from "@/components/layout/clay-panel";
import { NumberTicker } from "@/components/effects/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { SNAPSHOTS } from "@/lib/mock";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock change data per snapshot
// ---------------------------------------------------------------------------
type ChangeType = "added" | "removed" | "modified";
interface Change {
  type: ChangeType;
  description: string;
  service: string;
}

const CHANGES_MAP: Record<string, Change[]> = {
  "snap-001": [
    { type: "added", description: "CloudFront distribution for CDN", service: "CloudFront" },
    { type: "added", description: "WAF web ACL with rate limiting", service: "WAF" },
    { type: "modified", description: "Updated ALB listener rules", service: "ALB" },
  ],
  "snap-002": [
    { type: "added", description: "Route 53 health checks (us-east-1)", service: "Route 53" },
    { type: "added", description: "Route 53 health checks (eu-west-1)", service: "Route 53" },
    { type: "added", description: "RDS read replica in eu-west-1", service: "RDS" },
    { type: "modified", description: "Updated DNS failover policy", service: "Route 53" },
    { type: "modified", description: "Adjusted auto-scaling thresholds", service: "EC2" },
    { type: "added", description: "CloudWatch alarms for failover", service: "CloudWatch" },
    { type: "modified", description: "Security group ingress rules", service: "VPC" },
    { type: "removed", description: "Deprecated single-region LB", service: "ELB" },
  ],
  "snap-003": [
    { type: "added", description: "API Gateway usage plans", service: "API Gateway" },
    { type: "added", description: "API Gateway throttling rules", service: "API Gateway" },
    { type: "modified", description: "Lambda concurrency limits", service: "Lambda" },
    { type: "added", description: "API key management", service: "API Gateway" },
    { type: "modified", description: "IAM roles for API access", service: "IAM" },
    { type: "added", description: "Request validation schemas", service: "API Gateway" },
  ],
  "snap-004": [
    { type: "added", description: "RDS read replica (us-west-2)", service: "RDS" },
    { type: "added", description: "RDS Proxy for connection pooling", service: "RDS Proxy" },
    { type: "modified", description: "Database parameter groups", service: "RDS" },
    { type: "modified", description: "Application connection strings", service: "ECS" },
    { type: "added", description: "Enhanced monitoring", service: "CloudWatch" },
    { type: "removed", description: "Legacy connection handler", service: "Lambda" },
  ],
  "snap-005": [
    { type: "added", description: "Public subnet (AZ-a)", service: "VPC" },
    { type: "added", description: "Public subnet (AZ-b)", service: "VPC" },
    { type: "added", description: "Private subnet (AZ-a)", service: "VPC" },
    { type: "added", description: "Private subnet (AZ-b)", service: "VPC" },
    { type: "added", description: "NAT Gateway", service: "VPC" },
    { type: "modified", description: "Route tables updated", service: "VPC" },
    { type: "modified", description: "Security groups refactored", service: "VPC" },
    { type: "removed", description: "Default VPC resources", service: "VPC" },
    { type: "added", description: "VPC Flow Logs", service: "VPC" },
    { type: "modified", description: "ECS tasks moved to private subnet", service: "ECS" },
    { type: "added", description: "Bastion host in public subnet", service: "EC2" },
    { type: "modified", description: "RDS subnet group updated", service: "RDS" },
    { type: "added", description: "VPC endpoints for S3", service: "VPC" },
    { type: "added", description: "VPC endpoints for DynamoDB", service: "VPC" },
    { type: "removed", description: "Public-facing DB endpoints", service: "RDS" },
  ],
  "snap-006": [
    { type: "added", description: "ECS Fargate cluster", service: "ECS" },
    { type: "added", description: "Application Load Balancer", service: "ALB" },
    { type: "added", description: "RDS PostgreSQL primary", service: "RDS" },
    { type: "added", description: "S3 bucket for assets", service: "S3" },
    { type: "added", description: "ElastiCache Redis cluster", service: "ElastiCache" },
    { type: "added", description: "SQS message queue", service: "SQS" },
    { type: "added", description: "Lambda async processors", service: "Lambda" },
    { type: "added", description: "CloudWatch log groups", service: "CloudWatch" },
    { type: "added", description: "IAM roles and policies", service: "IAM" },
    { type: "added", description: "Secrets Manager entries", service: "Secrets Manager" },
    { type: "added", description: "ECR repository", service: "ECR" },
    { type: "added", description: "CodePipeline CI/CD", service: "CodePipeline" },
    { type: "modified", description: "DNS records for production", service: "Route 53" },
    { type: "added", description: "SNS notification topics", service: "SNS" },
    { type: "added", description: "DynamoDB session table", service: "DynamoDB" },
    { type: "added", description: "KMS encryption keys", service: "KMS" },
    { type: "added", description: "WAF basic rules", service: "WAF" },
    { type: "added", description: "ACM SSL certificate", service: "ACM" },
    { type: "added", description: "VPC with default config", service: "VPC" },
    { type: "added", description: "Auto Scaling group", service: "EC2" },
    { type: "added", description: "Target group health checks", service: "ALB" },
    { type: "added", description: "Parameter Store entries", service: "SSM" },
  ],
};

// ponytail: mini arch nodes for comparison view, hardcoded mock
interface ArchNode {
  id: string;
  label: string;
  icon: typeof Server;
  x: number;
  y: number;
}

const BEFORE_NODES: ArchNode[] = [
  { id: "alb", label: "ALB", icon: Globe, x: 50, y: 20 },
  { id: "ecs", label: "ECS", icon: Server, x: 50, y: 50 },
  { id: "rds", label: "RDS", icon: Database, x: 25, y: 80 },
  { id: "s3", label: "S3", icon: Shield, x: 75, y: 80 },
];

const AFTER_NODES: ArchNode[] = [
  { id: "cdn", label: "CloudFront", icon: Globe, x: 50, y: 10, },
  { id: "alb", label: "ALB", icon: Globe, x: 50, y: 35 },
  { id: "ecs", label: "ECS", icon: Server, x: 50, y: 60 },
  { id: "rds", label: "RDS", icon: Database, x: 25, y: 85 },
  { id: "s3", label: "S3", icon: Shield, x: 75, y: 85 },
];

const CONNECTIONS_BEFORE = [
  ["alb", "ecs"],
  ["ecs", "rds"],
  ["ecs", "s3"],
];

const CONNECTIONS_AFTER = [
  ["cdn", "alb"],
  ["alb", "ecs"],
  ["ecs", "rds"],
  ["ecs", "s3"],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const changeColor: Record<ChangeType, string> = {
  added: "text-emerald-400",
  removed: "text-red-400",
  modified: "text-amber-400",
};
const changeBg: Record<ChangeType, string> = {
  added: "bg-emerald-500/10 border-emerald-500/20",
  removed: "bg-red-500/10 border-red-500/20",
  modified: "bg-amber-500/10 border-amber-500/20",
};
const ChangeIcon: Record<ChangeType, typeof Plus> = {
  added: Plus,
  removed: Minus,
  modified: Pencil,
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function TimeMachinePage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const selected = SNAPSHOTS[selectedIdx];
  const changes = CHANGES_MAP[selected.id] ?? [];

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  // Keyboard nav for timeline scrubber
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && selectedIdx > 0) {
        setSelectedIdx((i) => i - 1);
      } else if (e.key === "ArrowRight" && selectedIdx < SNAPSHOTS.length - 1) {
        setSelectedIdx((i) => i + 1);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIdx]);

  const added = changes.filter((c) => c.type === "added").length;
  const removed = changes.filter((c) => c.type === "removed").length;
  const modified = changes.filter((c) => c.type === "modified").length;

  return (
    <AppFrame title="Time Machine">
      <div className="space-y-8 pb-12">
        {/* ----------------------------------------------------------------- */}
        {/* 1. TIMELINE HEADER */}
        {/* ----------------------------------------------------------------- */}
        <section className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              <span className="text-gradient">Travel through your infrastructure history</span>
            </h1>
            <p className="mt-3 text-white/50 max-w-xl mx-auto">
              Explore, compare, and restore any version of your cloud architecture.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center justify-center gap-3"
          >
            <Badge variant="outline" className="border-violet-500/40 text-violet-300 px-3 py-1 text-sm font-mono">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              {selected.version}
            </Badge>
            <span className="text-white/40 text-sm">{fmtDate(selected.createdAt)}</span>
          </motion.div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 2. TIMELINE SCRUBBER */}
        {/* ----------------------------------------------------------------- */}
        <TooltipProvider delayDuration={100}>
          <ClayPanel className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Timeline</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={selectedIdx === SNAPSHOTS.length - 1}
                  onClick={() => setSelectedIdx((i) => Math.min(i + 1, SNAPSHOTS.length - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={selectedIdx === 0}
                  onClick={() => setSelectedIdx((i) => Math.max(i - 1, 0))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Track */}
            <div className="relative h-16 flex items-center">
              {/* Line */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 rounded-full" />

              {/* Dots */}
              {SNAPSHOTS.map((snap, idx) => {
                const pct = SNAPSHOTS.length === 1 ? 50 : (idx / (SNAPSHOTS.length - 1)) * 100;
                const isSelected = idx === selectedIdx;
                return (
                  <Tooltip key={snap.id}>
                    <TooltipTrigger asChild>
                      <motion.button
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                          isSelected
                            ? "h-5 w-5 bg-violet-500 border-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                            : "h-3.5 w-3.5 bg-white/20 border-white/10 hover:bg-white/30"
                        )}
                        style={{ left: `${pct}%` }}
                        onClick={() => setSelectedIdx(idx)}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={`Select snapshot ${snap.version}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="clay-panel border-white/10 bg-graphite text-white"
                    >
                      <p className="font-mono text-xs font-bold">{snap.version}</p>
                      <p className="text-[10px] text-white/50">{fmtDateShort(snap.createdAt)}</p>
                      <p className="text-[10px] text-white/40">{snap.changes} changes</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Date labels */}
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-white/30 font-mono">
                {fmtDateShort(SNAPSHOTS[SNAPSHOTS.length - 1].createdAt)}
              </span>
              <span className="text-[10px] text-white/30 font-mono">
                {fmtDateShort(SNAPSHOTS[0].createdAt)}
              </span>
            </div>
          </ClayPanel>
        </TooltipProvider>

        {/* ----------------------------------------------------------------- */}
        {/* 3. SNAPSHOT DETAIL */}
        {/* ----------------------------------------------------------------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <ClayPanel className="p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 font-mono text-sm">
                      {selected.version}
                    </Badge>
                    <span className="text-white/40 text-sm">{fmtDate(selected.createdAt)}</span>
                  </div>
                  <p className="text-white/70 text-sm max-w-lg">{selected.description}</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-white">
                      <NumberTicker value={selected.nodeCount} duration={800} />
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Nodes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-violet-400">
                      <NumberTicker value={selected.changes} duration={800} />
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Changes</p>
                  </div>
                </div>
              </div>

              {/* Changes list */}
              <div className="space-y-2">
                <h3 className="text-xs text-white/40 font-mono uppercase tracking-wider">Changes</h3>
                <div className="grid gap-2">
                  {changes.slice(0, 6).map((change, i) => {
                    const Icon = ChangeIcon[change.type];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.25 }}
                        className={cn(
                          "clay-card flex items-center gap-3 rounded-xl border px-4 py-3",
                          changeBg[change.type]
                        )}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", changeColor[change.type])} />
                        <span className="text-sm text-white/80 flex-1">{change.description}</span>
                        <Badge
                          variant="outline"
                          className="text-[10px] border-white/10 text-white/50 font-mono"
                        >
                          {change.service}
                        </Badge>
                      </motion.div>
                    );
                  })}
                  {changes.length > 6 && (
                    <p className="text-xs text-white/30 text-center pt-1">
                      +{changes.length - 6} more changes
                    </p>
                  )}
                </div>
              </div>
            </ClayPanel>
          </motion.div>
        </AnimatePresence>

        {/* ----------------------------------------------------------------- */}
        {/* 4. COMPARISON VIEW */}
        {/* ----------------------------------------------------------------- */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs text-white/40 font-mono uppercase tracking-wider">
              Architecture Diff
            </h2>
            <Badge variant="outline" className="border-white/10 text-white/50 font-mono text-[10px]">
              <span className="text-emerald-400">+1 node</span>
              <span className="mx-1.5 text-white/20">|</span>
              <span className="text-red-400">-0 node</span>
              <span className="mx-1.5 text-white/20">|</span>
              <span className="text-amber-400">~1 modified</span>
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Before */}
            <ClayPanel className="p-4 space-y-2">
              <Badge variant="outline" className="border-white/10 text-white/40 text-[10px]">
                Before
              </Badge>
              <div className="relative h-48">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {CONNECTIONS_BEFORE.map(([from, to], i) => {
                    const a = BEFORE_NODES.find((n) => n.id === from)!;
                    const b = BEFORE_NODES.find((n) => n.id === to)!;
                    return (
                      <line
                        key={i}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="0.5"
                      />
                    );
                  })}
                </svg>
                {BEFORE_NODES.map((node) => {
                  const Icon = node.icon;
                  return (
                    <motion.div
                      key={node.id}
                      className="absolute clay-card rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 flex items-center gap-1.5 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Icon className="h-3 w-3 text-white/50" />
                      <span className="text-[10px] font-mono text-white/60">{node.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </ClayPanel>

            {/* After */}
            <ClayPanel className="p-4 space-y-2">
              <Badge variant="outline" className="border-violet-500/30 text-violet-300 text-[10px]">
                After
              </Badge>
              <div className="relative h-48">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {CONNECTIONS_AFTER.map(([from, to], i) => {
                    const a = AFTER_NODES.find((n) => n.id === from)!;
                    const b = AFTER_NODES.find((n) => n.id === to)!;
                    const isNew = from === "cdn" || to === "cdn";
                    return (
                      <motion.line
                        key={i}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={isNew ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.1)"}
                        strokeWidth="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                      />
                    );
                  })}
                </svg>
                {AFTER_NODES.map((node) => {
                  const Icon = node.icon;
                  const isNew = node.id === "cdn";
                  const isMod = node.id === "alb";
                  return (
                    <motion.div
                      key={node.id}
                      className={cn(
                        "absolute clay-card rounded-lg border px-2 py-1.5 flex items-center gap-1.5 -translate-x-1/2 -translate-y-1/2",
                        isNew
                          ? "border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                          : isMod
                            ? "border-amber-500/40 bg-amber-500/5"
                            : "border-white/10 bg-white/5"
                      )}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: isNew ? 0.5 : 0.1, duration: 0.4 }}
                    >
                      <Icon className={cn("h-3 w-3", isNew ? "text-emerald-400" : isMod ? "text-amber-400" : "text-white/50")} />
                      <span className={cn("text-[10px] font-mono", isNew ? "text-emerald-300" : isMod ? "text-amber-300" : "text-white/60")}>
                        {node.label}
                      </span>
                      {isNew && (
                        <Sparkles className="h-2.5 w-2.5 text-emerald-400 animate-pulse" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </ClayPanel>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 5. VERSION LIST */}
        {/* ----------------------------------------------------------------- */}
        <section className="space-y-3">
          <h2 className="text-xs text-white/40 font-mono uppercase tracking-wider">All Versions</h2>
          <ScrollArea className="h-[320px] rounded-xl">
            <div className="space-y-2 pr-3">
              {SNAPSHOTS.map((snap, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <motion.button
                    key={snap.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={cn(
                      "clay-card w-full text-left rounded-xl border p-4 transition-all",
                      isSelected
                        ? "border-violet-500/40 bg-violet-500/5 shadow-[inset_3px_0_0_rgba(139,92,246,0.7)]"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                    )}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white/90">{snap.version}</span>
                          <span className="text-xs text-white/30">{fmtDate(snap.createdAt)}</span>
                        </div>
                        <p className="text-xs text-white/50 truncate">{snap.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-[10px] border-white/10 text-white/40 font-mono">
                          {snap.changes} changes
                        </Badge>
                        {isSelected && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <RotateCcw className="mr-1 h-3 w-3" />
                                Restore
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="clay-panel border-white/10 bg-deep-space text-white">
                              <DialogHeader>
                                <DialogTitle className="font-display">Restore {snap.version}?</DialogTitle>
                                <DialogDescription className="text-white/50">
                                  This will roll back your infrastructure to the state captured on{" "}
                                  {fmtDate(snap.createdAt)}. This action can be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="gap-2">
                                <Button
                                  variant="outline"
                                  className="border-white/10 text-white/60"
                                  onClick={() => showToast("Time Machine feature coming soon")}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="bg-violet-600 hover:bg-violet-500 text-white"
                                  onClick={() => showToast("Time Machine feature coming soon")}
                                >
                                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                                  Confirm Restore
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </ScrollArea>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 6. CONTROLS */}
        {/* ----------------------------------------------------------------- */}
        <ClayPanel className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="border-white/10 text-white/60 hover:bg-white/5"
              onClick={() => showToast("Time Machine feature coming soon")}
            >
              <GitCompare className="mr-2 h-4 w-4" />
              Compare Versions
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-white/60 hover:bg-white/5"
              onClick={() => showToast("Time Machine feature coming soon")}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Snapshot
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-violet-600 hover:bg-violet-500 text-white">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restore {selected.version}
                </Button>
              </DialogTrigger>
              <DialogContent className="clay-panel border-white/10 bg-deep-space text-white">
                <DialogHeader>
                  <DialogTitle className="font-display">Restore {selected.version}?</DialogTitle>
                  <DialogDescription className="text-white/50">
                    Roll back to {fmtDate(selected.createdAt)} — {selected.description}.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    className="border-white/10 text-white/60"
                    onClick={() => showToast("Time Machine feature coming soon")}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-violet-600 hover:bg-violet-500 text-white"
                    onClick={() => showToast("Time Machine feature coming soon")}
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Confirm Restore
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </ClayPanel>

        {/* ----------------------------------------------------------------- */}
        {/* Toast */}
        {/* ----------------------------------------------------------------- */}
        <AnimatePresence>
          {toastVisible && (
            <motion.div
              initial={{ opacity: 0, y: 40, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 40, x: "-50%" }}
              transition={{ duration: 0.25 }}
              className="fixed bottom-8 left-1/2 z-50 clay-panel rounded-xl border border-violet-500/30 bg-deep-space px-5 py-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-white/80">{toastMsg}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppFrame>
  );
}
