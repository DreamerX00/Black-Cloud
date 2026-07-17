"use client";

// Authenticated dashboard: stat cards (number-ticker + delta chips), a projects
// grid linking to /playground, and a recent-activity feed. All data is mock and
// deterministic (no Date.now/Math.random) so SSR and client render identically.
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Rocket,
  Pencil,
  AlertTriangle,
  Shuffle,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { NumberTicker } from "@/components/effects/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROJECTS, STATS, ACTIVITY, type Project, type Activity } from "@/lib/mock";
import { PROVIDER_COLOR } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";

const PROVIDER_BADGE: Record<Project["provider"], { label: string; variant: "aws" | "azure" | "gcp" | "cyan" }> = {
  aws: { label: "AWS", variant: "aws" },
  azure: { label: "Azure", variant: "azure" },
  gcp: { label: "GCP", variant: "gcp" },
  multi: { label: "Multi-cloud", variant: "cyan" },
};

const STATUS_DOT: Record<Project["status"], string> = {
  healthy: "bg-status-success",
  degraded: "bg-status-warning",
  draft: "bg-muted-foreground",
};

const ACTIVITY_ICON: Record<Activity["kind"], { icon: LucideIcon; className: string }> = {
  deploy: { icon: Rocket, className: "text-status-success" },
  edit: { icon: Pencil, className: "text-accent-cyan" },
  alert: { icon: AlertTriangle, className: "text-status-warning" },
  migrate: { icon: Shuffle, className: "text-accent-violet" },
};

export default function DashboardPage() {
  const reduce = useReducedMotion();

  // Stagger container: children fade+rise in sequence on mount. Reduced-motion
  // users get the final state instantly (no transition, no offset).
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 26 } },
      };

  return (
    <AppFrame
      title="Dashboard"
      actions={
        <Button asChild size="lg" className="gap-1.5">
          <Link href="/playground">
            <Plus className="size-4" /> New project
          </Link>
        </Button>
      }
    >
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Stat cards */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          aria-label="Overview stats"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((stat) => {
            const up = stat.delta >= 0;
            return (
              <motion.div key={stat.label} variants={item} className="clay p-5">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-2 font-display text-3xl font-bold tabular-nums text-foreground">
                  {stat.prefix}
                  <NumberTicker value={stat.value} suffix={stat.suffix} />
                </p>
                <span
                  className={cn(
                    "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                    up ? "bg-status-success/10 text-status-success" : "bg-status-danger/10 text-status-danger",
                  )}
                >
                  {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {up ? "+" : ""}
                  {stat.delta}%
                </span>
              </motion.div>
            );
          })}
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Projects grid */}
          <section aria-label="Projects" className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Projects</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/playground">
                  Open playground <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2"
            >
              {PROJECTS.map((p) => {
                const badge = PROVIDER_BADGE[p.provider];
                return (
                  <motion.div key={p.id} variants={item}>
                    <Link
                      href="/playground"
                      className="clay-pressable group flex h-full flex-col gap-3 p-5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="grid size-9 shrink-0 place-items-center rounded-xl"
                          style={{ backgroundColor: `${PROVIDER_COLOR[p.provider === "multi" ? "aws" : p.provider]}1a` }}
                        >
                          <Layers
                            className="size-4"
                            style={{ color: p.provider === "multi" ? undefined : PROVIDER_COLOR[p.provider] }}
                          />
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className={cn("size-2 rounded-full", STATUS_DOT[p.status])} aria-hidden />
                          <span className="capitalize">{p.status}</span>
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold text-foreground transition-colors group-hover:text-accent-cyan">
                          {p.name}
                        </h3>
                        <Badge variant={badge.variant} className="mt-1.5">
                          {badge.label}
                        </Badge>
                      </div>
                      <dl className="mt-auto flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                        <div className="flex gap-3">
                          <span>
                            <dt className="sr-only">Nodes</dt>
                            <dd className="font-semibold tabular-nums text-foreground">{p.nodes}</dd> nodes
                          </span>
                          <span>
                            <dt className="sr-only">Edges</dt>
                            <dd className="font-semibold tabular-nums text-foreground">{p.edges}</dd> edges
                          </span>
                        </div>
                        <span className="text-right">
                          <dt className="sr-only">Monthly cost</dt>
                          <dd className="font-semibold tabular-nums text-foreground">
                            ${p.cost.toLocaleString()}
                          </dd>
                          <span className="text-[10px]">{p.updated}</span>
                        </span>
                      </dl>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>

          {/* Recent activity */}
          <section aria-label="Recent activity">
            <h2 className="mb-4 font-display text-xl font-semibold">Recent activity</h2>
            <motion.ul
              variants={container}
              initial="hidden"
              animate="show"
              className="clay space-y-1 p-3"
            >
              {ACTIVITY.map((a) => {
                const { icon: Icon, className } = ACTIVITY_ICON[a.kind];
                return (
                  <motion.li
                    key={a.id}
                    variants={item}
                    className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
                  >
                    <span className={cn("clay-inset grid size-8 shrink-0 place-items-center rounded-lg", className)}>
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 text-sm">
                      <p className="text-foreground">
                        <span className="font-semibold">{a.who}</span>{" "}
                        <span className="text-muted-foreground">{a.action}</span>{" "}
                        <span className="font-medium">{a.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{a.when}</p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </section>
        </div>
      </div>
    </AppFrame>
  );
}
