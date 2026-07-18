"use client";

import {
  Workflow,
  MousePointerClick,
  ShieldCheck,
  DollarSign,
  FileCode2,
  Layers,
  Cable,
  Box,
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
    icon: <MousePointerClick className="h-5 w-5" />,
    title: "Drag & Drop Canvas",
    description:
      "Intuitive infinite canvas with snap-to-grid, smart connectors, and multi-select. Design architectures as naturally as drawing on a whiteboard.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Real-time Validation",
    description:
      "Every connection and configuration is validated live against cloud provider rules. Catch misconfigurations before they cost you.",
  },
  {
    icon: <DollarSign className="h-5 w-5" />,
    title: "Cost Estimation",
    description:
      "See estimated monthly costs update in real-time as you add services. Compare pricing across AWS, Azure, and GCP side by side.",
  },
  {
    icon: <FileCode2 className="h-5 w-5" />,
    title: "IaC Export",
    description:
      "Export your visual design as Terraform, CloudFormation, Pulumi, or Bicep with a single click. Production-ready code, instantly.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Drop services onto the canvas",
    description:
      "Browse the service catalog with 200+ cloud services across AWS, Azure, and GCP. Drag any service onto the infinite canvas and position it freely.",
  },
  {
    step: "02",
    title: "Connect and configure",
    description:
      "Draw connections between services to define data flow, networking, and dependencies. Configure each node with a property panel that validates in real-time.",
  },
  {
    step: "03",
    title: "Validate and export",
    description:
      "Run validation to catch security issues, misconfigurations, and cost anomalies. Export as IaC or deploy directly through BlackCloud's pipeline.",
  },
];

/* CSS-art mockup of the canvas */
function CanvasMockup() {
  return (
    <div className="relative min-h-[320px]">
      {/* Grid dots background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Nodes */}
      <div className="relative flex flex-wrap items-start gap-6 p-4">
        {/* VPC */}
        <div className="clay-card rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 w-32">
          <div className="flex items-center gap-2 text-xs font-mono text-violet-300">
            <Layers className="h-4 w-4" /> VPC
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">10.0.0.0/16</div>
        </div>

        {/* Arrow */}
        <div className="flex items-center self-center text-white/20">
          <div className="h-px w-8 bg-white/20" />
          <div className="border-4 border-transparent border-l-white/20" />
        </div>

        {/* EC2 */}
        <div className="clay-card rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 w-32">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
            <Box className="h-4 w-4" /> EC2
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">t3.xlarge</div>
        </div>

        {/* Arrow */}
        <div className="flex items-center self-center text-white/20">
          <div className="h-px w-8 bg-white/20" />
          <div className="border-4 border-transparent border-l-white/20" />
        </div>

        {/* RDS */}
        <div className="clay-card rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 w-32">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
            <Cable className="h-4 w-4" /> RDS
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">db.r6g.large</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4 px-4">
        <div className="flex gap-1">
          {["Select", "Connect", "Group"].map((t) => (
            <span
              key={t}
              className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-mono text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          All validations passed
        </div>
      </div>
    </div>
  );
}

export function PlaygroundClient() {
  return (
    <>
      <FeatureGrid features={FEATURES} glowColor="#8b5cf6" />

      {/* Stats bar */}
      <SectionReveal className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4">
          {[
            { v: "200+", l: "Cloud services" },
            { v: "3", l: "Providers" },
            { v: "4", l: "IaC formats" },
            { v: "<1s", l: "Validation time" },
          ].map((s) => (
            <ClayPanel key={s.l} className="p-4 text-center">
              <div className="font-display text-2xl font-bold text-violet-400">
                {s.v}
              </div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </ClayPanel>
          ))}
        </div>
      </SectionReveal>

      <HowItWorks steps={STEPS} accentColor="#8b5cf6" />

      <MockupFrame>
        <CanvasMockup />
      </MockupFrame>

      <ProductCTA
        title="Start designing visually"
        description="Create your first cloud architecture in minutes. No credit card required for the free tier — design up to 5 projects with full export capabilities."
        primaryHref="/signup"
        primaryLabel="Try Playground free"
        secondaryHref="/docs"
        secondaryLabel="Read the docs"
        glowColor="#8b5cf6"
      />
    </>
  );
}
