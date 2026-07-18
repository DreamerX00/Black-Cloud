import type { Metadata } from "next";
import { ProductShell } from "@/components/product/product-shell";
import { MiniCanvas } from "@/components/product/mini-canvas";
import { MousePointer2, Move3d, Layers3, Network, ShieldCheck, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Cloud Playground — Design cloud worlds on an infinite canvas",
  description: "The graph's visual editor. Infinite canvas, multi-cloud node library, animated infrastructure, smart validation.",
};

export default function Page() {
  return (
    <ProductShell
      eyebrow="Product · Cloud Playground"
      accent="ai"
      title={<>Design cloud worlds <span className="text-gradient-nebula">on an infinite canvas.</span></>}
      intro="Drag any service onto a canvas that never ends. Validation is inline. Every connection glows valid, warning, or invalid before you drop. Multi-cloud from the first click."
      bullets={[
        "AWS · Azure · GCP nodes with the exact same graph model",
        "Traffic packets that visibly move through active paths",
        "Snap-to-grid, minimap, undo/redo, keyboard shortcuts",
        "60 FPS on 300+ nodes and 500+ connections",
      ]}
      heroPreview={<MiniCanvas />}
      capabilities={[
        { icon: MousePointer2, title: "Infinite canvas", body: "Pan, zoom, drag, multi-select — the surface never runs out." },
        { icon: Layers3, title: "Multi-cloud native", body: "AWS, Azure, GCP live side by side in the same architecture." },
        { icon: Network, title: "Live traffic", body: "Animated packets illustrate which paths carry load right now." },
        { icon: ShieldCheck, title: "Smart validation", body: "ALB → RDS? Rejected inline with the exact fix suggested." },
        { icon: Move3d, title: "Layers & groups", body: "VPC, subnet, and account groupings that fold on demand." },
        { icon: Search, title: "Command search", body: "Every service, template, and setting one ⌘K away." },
      ]}
      workflow={[
        { step: "01", title: "Pick a template", body: "Or start from a blank canvas — 40+ verified blueprints included." },
        { step: "02", title: "Drag services", body: "Every provider, every node. Snap, connect, group." },
        { step: "03", title: "Watch it validate", body: "Green, yellow, red — inline, before you drop." },
        { step: "04", title: "Export or deploy", body: "PNG, SVG, JSON today. Terraform on Phase 2." },
      ]}
      proof={[
        { metric: "60fps", label: "on 300+ nodes" },
        { metric: "3", label: "clouds · one model" },
        { metric: "<100ms", label: "interaction latency" },
        { metric: "40+", label: "starter blueprints" },
      ]}
      faqs={[
        { q: "Is this just React Flow with a coat of paint?", a: "React Flow is the substrate. On top: our own cloud nodes, validation engine, traffic simulator, snapshot store, and custom edge renderer — all reading a shared graph model that also feeds cost, security, and migration." },
        { q: "Does it support offline?", a: "Yes. Everything the canvas needs runs locally. Sync happens when you reconnect." },
        { q: "How does it stay fast at 500 nodes?", a: "PixiJS renders traffic particles; nodes virtualize off-screen; edges culled at zoom < 0.3. Reduced-motion mode disables particle systems entirely." },
        { q: "Can I bring my own components?", a: "Community node packs land in Phase 4 via the Blueprint Exchange." },
      ]}
      related={[
        { href: "/product/ai-architect", title: "AI Architect", body: "Generate a starting canvas from a sentence." },
        { href: "/product/cost-simulator", title: "Cost Simulator", body: "Watch the bill mutate as you drag." },
        { href: "/product/failure-simulator", title: "Failure Simulator", body: "Pull a plug — see what flexes." },
      ]}
    />
  );
}
