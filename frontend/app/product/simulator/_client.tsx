"use client";

import {
  Zap,
  Shield,
  Activity,
  Clock,
  AlertTriangle,
  BarChart3,
  Server,
  Flame,
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
    icon: <Zap className="h-5 w-5" />,
    title: "Chaos Scenarios",
    description:
      "Pre-built scenarios for AZ failures, region outages, database crashes, load balancer downs, and cascading service failures.",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Live Traffic Visualization",
    description:
      "Watch animated traffic flow through your architecture. See requests reroute, services go red, and recovery propagate in real-time.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Resilience Scoring",
    description:
      "Get a 0-100 resilience score based on detection time, failover speed, recovery completeness, and architecture redundancy.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Actionable Recommendations",
    description:
      "After each simulation, receive specific recommendations to harden your architecture — from multi-AZ databases to circuit breakers.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Select a failure scenario",
    description:
      "Choose from pre-built chaos scenarios or create custom failures. Target specific services, availability zones, or entire regions.",
  },
  {
    step: "02",
    title: "Watch the simulation",
    description:
      "See your architecture respond to the failure in real-time. Traffic reroutes, services degrade, and recovery mechanisms activate — all visualized on the canvas.",
  },
  {
    step: "03",
    title: "Review your resilience",
    description:
      "Get a detailed report with resilience score, detection time, failover speed, and targeted recommendations to improve your architecture's fault tolerance.",
  },
];

function SimulatorMockup() {
  return (
    <div className="relative min-h-[320px]">
      {/* Scenario cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 mb-6">
        {[
          { name: "AZ Failure", severity: "High", icon: "🔴", active: true },
          { name: "Region Outage", severity: "Critical", icon: "💀", active: false },
          { name: "DB Crash", severity: "High", icon: "🔥", active: false },
          { name: "LB Down", severity: "Medium", icon: "⚡", active: false },
          { name: "Service Cascade", severity: "Critical", icon: "🌊", active: false },
          { name: "Network Split", severity: "High", icon: "✂️", active: false },
        ].map((s) => (
          <div
            key={s.name}
            className={`clay-card rounded-xl p-3 text-center cursor-pointer transition-all ${
              s.active
                ? "border-red-500/40 ring-1 ring-red-500/20 bg-red-500/5"
                : "hover:bg-white/5"
            }`}
          >
            <div className="text-lg mb-1">{s.icon}</div>
            <div className="text-xs font-semibold text-foreground">{s.name}</div>
            <div
              className={`text-[10px] mt-0.5 ${
                s.severity === "Critical"
                  ? "text-red-400"
                  : s.severity === "High"
                    ? "text-amber-400"
                    : "text-yellow-400"
              }`}
            >
              {s.severity}
            </div>
          </div>
        ))}
      </div>

      {/* Mini architecture with failure */}
      <div className="clay-card rounded-xl p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-display font-semibold text-foreground">
            Simulation: AZ Failure (us-east-1a)
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-red-400 animate-pulse">
            <Flame className="h-3 w-3" /> Running
          </span>
        </div>

        {/* Simple node layout */}
        <div className="flex items-center justify-between gap-2">
          {[
            { name: "ALB", status: "ok" },
            { name: "ECS-1", status: "failed" },
            { name: "ECS-2", status: "ok" },
            { name: "ECS-3", status: "recovering" },
            { name: "RDS", status: "ok" },
          ].map((node) => (
            <div
              key={node.name}
              className={`flex-1 rounded-lg py-2 text-center text-[10px] font-mono border ${
                node.status === "failed"
                  ? "bg-red-500/10 border-red-500/30 text-red-400 line-through"
                  : node.status === "recovering"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}
            >
              {node.name}
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-red-400">2.4s</div>
            <div className="text-[10px] text-muted-foreground">Latency</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-amber-400">12%</div>
            <div className="text-[10px] text-muted-foreground">Error Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-emerald-400">78</div>
            <div className="text-[10px] text-muted-foreground">Resilience</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SimulatorClient() {
  return (
    <>
      <FeatureGrid features={FEATURES} glowColor="#EF4444" />

      <SectionReveal className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4">
          {[
            { v: "6", l: "Chaos scenarios" },
            { v: "2x-5x", l: "Speed controls" },
            { v: "<30s", l: "Simulation time" },
            { v: "0-100", l: "Resilience score" },
          ].map((s) => (
            <ClayPanel key={s.l} className="p-4 text-center">
              <div className="font-display text-2xl font-bold text-red-400">
                {s.v}
              </div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </ClayPanel>
          ))}
        </div>
      </SectionReveal>

      <HowItWorks steps={STEPS} accentColor="#EF4444" />

      <MockupFrame>
        <SimulatorMockup />
      </MockupFrame>

      <ProductCTA
        title="Test your resilience before it matters"
        description="Don't wait for a real outage to discover your architecture's weaknesses. Run simulations, measure recovery, and harden your infrastructure proactively."
        primaryHref="/signup"
        primaryLabel="Start simulating"
        secondaryHref="/simulator"
        secondaryLabel="Open Simulator"
        glowColor="#EF4444"
      />
    </>
  );
}
