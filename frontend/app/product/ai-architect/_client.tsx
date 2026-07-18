"use client";

import {
  Sparkles,
  Brain,
  DollarSign,
  ShieldCheck,
  FileCode2,
  Cpu,
  Zap,
  MessageSquare,
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
    icon: <Brain className="h-5 w-5" />,
    title: "Natural Language Input",
    description:
      "Describe your infrastructure in plain English. Our AI understands requirements like user count, compliance needs, and performance targets.",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Multi-Provider Support",
    description:
      "Generate architectures for AWS, Azure, GCP, or multi-cloud setups. The AI selects the best services for your needs across providers.",
  },
  {
    icon: <DollarSign className="h-5 w-5" />,
    title: "Instant Cost Estimates",
    description:
      "Every generated architecture comes with a detailed cost breakdown. Compare monthly projections across different configurations.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Security Review",
    description:
      "Automated security analysis scores your architecture and flags vulnerabilities with actionable remediation steps.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Describe your requirements",
    description:
      "Tell the AI what you need in plain language — user capacity, compliance requirements, preferred database, caching strategy. Be as specific or as vague as you like.",
  },
  {
    step: "02",
    title: "AI generates your architecture",
    description:
      "Our models evaluate thousands of architecture patterns to find the optimal configuration. You get a visual diagram, cost estimate, security review, and production-ready Terraform.",
  },
  {
    step: "03",
    title: "Refine and deploy",
    description:
      "Open the generated architecture in Cloud Playground to fine-tune. Adjust services, connections, and configurations. Export when you're ready.",
  },
];

function AIChatMockup() {
  return (
    <div className="relative min-h-[360px] space-y-4">
      {/* User prompt */}
      <div className="flex gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
        <div className="clay-card rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
          <p className="text-sm text-foreground">
            I need a SaaS platform for 50k users with PostgreSQL, Redis caching,
            CDN, CI/CD pipeline, and multi-AZ deployment on AWS.
          </p>
        </div>
      </div>

      {/* AI response */}
      <div className="flex gap-3 flex-row-reverse">
        <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="clay-card rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] border-primary/20">
          <p className="text-sm text-foreground mb-3">
            Here&apos;s your architecture with 11 services across 6 tiers:
          </p>

          {/* Mini architecture preview */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { name: "CloudFront", color: "violet" },
              { name: "ALB", color: "violet" },
              { name: "ECS x3", color: "cyan" },
              { name: "RDS Multi-AZ", color: "emerald" },
              { name: "ElastiCache", color: "emerald" },
              { name: "S3", color: "amber" },
            ].map((s) => (
              <div
                key={s.name}
                className={`rounded-lg bg-${s.color}-500/10 border border-${s.color}-500/20 px-2 py-1.5 text-center text-[10px] font-mono text-${s.color}-300`}
              >
                {s.name}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 text-[10px]">
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-muted-foreground">
              Est. $733/mo
            </span>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
              Security: 87/100
            </span>
            <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-violet-400">
              Terraform ready
            </span>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-muted-foreground">
            Describe your infrastructure requirements...
          </div>
          <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIArchitectClient() {
  return (
    <>
      <FeatureGrid features={FEATURES} glowColor="#8b5cf6" />

      <SectionReveal className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4">
          {[
            { v: "50+", l: "Architecture patterns" },
            { v: "4", l: "Output formats" },
            { v: "<10s", l: "Generation time" },
            { v: "94%", l: "Avg. confidence" },
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
        <AIChatMockup />
      </MockupFrame>

      <ProductCTA
        title="Let AI design your infrastructure"
        description="Skip weeks of architecture planning. Describe what you need and get a production-ready design in seconds. Free tier includes 10 generations per month."
        primaryHref="/signup"
        primaryLabel="Try AI Architect"
        secondaryHref="/ai-architect"
        secondaryLabel="Open AI Architect"
        glowColor="#8b5cf6"
      />
    </>
  );
}
