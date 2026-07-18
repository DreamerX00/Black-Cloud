import type { Metadata } from "next";
import { ProductShell } from "@/components/product/product-shell";
import { MiniCanvas } from "@/components/product/mini-canvas";
import { Coins, TrendingUp, GitCompare, PiggyBank, Calendar, Globe2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cost Simulator — Watch your bill mutate before you commit",
  description: "Drag a node, drop a region, swap an instance family. The monthly and annual bill respond live. Explainable, itemized, honest.",
};

export default function Page() {
  return (
    <ProductShell
      eyebrow="Product · Cost Simulator"
      accent="success"
      title={<>The bill mutates <span className="text-gradient-nebula">as you design.</span></>}
      intro="Nudge a node, swap an instance family, move a region — the monthly and annual bill respond in real time. Every number links back to the exact resource that produced it. Finance stops asking what changed."
      bullets={[
        "Live pricing across AWS, Azure, GCP",
        "Reserved instance, spot, savings-plan simulation",
        "Compare architectures side by side, dollar-for-dollar",
        "Every bill line explains itself down to the resource",
      ]}
      heroPreview={<MiniCanvas />}
      capabilities={[
        { icon: Coins, title: "Real-time recompute", body: "Every canvas action recomputes cost within 200ms." },
        { icon: TrendingUp, title: "Growth curves", body: "Model 10×, 100×, 1000× load without redrawing the diagram." },
        { icon: GitCompare, title: "A vs. B diff", body: "Compare two architectures line-by-line. Winner in green." },
        { icon: PiggyBank, title: "Discount modeling", body: "Reserved, spot, savings plans — all four hyperscaler mechanisms in one pane." },
        { icon: Calendar, title: "Monthly & annual", body: "Toggle any surface between month and year in one click." },
        { icon: Globe2, title: "Region deltas", body: "us-east-1 vs. eu-west-2 vs. asia-southeast1 — instantly." },
      ]}
      workflow={[
        { step: "01", title: "Draw or import", body: "Every architecture starts with a bill of $0. Adds compound." },
        { step: "02", title: "Attach billing (optional)", body: "Read-only cost-explorer link makes recommendations account-aware." },
        { step: "03", title: "Model discounts", body: "Reserved, savings, spot — configured once, applied everywhere." },
        { step: "04", title: "Ship the report", body: "One-page PDF for finance, JSON for procurement." },
      ]}
      proof={[
        { metric: "<200ms", label: "recompute on drag" },
        { metric: "3", label: "clouds · one pricing engine" },
        { metric: "22%", label: "median customer savings · YoY" },
        { metric: "1", label: "explainable line per resource" },
      ]}
      faqs={[
        { q: "How is this different from CloudZero or Vantage?", a: "They report what you already spent. We simulate what you're about to spend, before you deploy, against a graph the rest of your team is also editing." },
        { q: "Do you support committed-use discounts?", a: "Yes — CUDs, RIs, savings plans, spot, and Azure reservations. Model any mix." },
        { q: "How current is the pricing?", a: "Pulled from provider price lists daily. Custom enterprise contracts can be attached manually." },
        { q: "Can I export the model for procurement?", a: "One-page finance-friendly PDF, plus JSON. Both are line-explainable back to specific nodes." },
      ]}
      related={[
        { href: "/product/architecture-intelligence", title: "Architecture Intelligence", body: "Cost is one axis of the Health Score." },
        { href: "/product/ai-architect", title: "AI Architect", body: "Ask for the cheapest architecture that meets an SLA." },
        { href: "/product/migration-ground", title: "Migration Ground", body: "Compare bills between clouds." },
      ]}
    />
  );
}
