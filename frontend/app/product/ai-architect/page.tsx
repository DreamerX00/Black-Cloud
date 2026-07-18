import type { Metadata } from "next";
import { ProductShell } from "@/components/product/product-shell";
import { MiniCanvas } from "@/components/product/mini-canvas";
import { MessagesSquare, ScanSearch, Wand2, FileCode2, ShieldCheck, GitCompare } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Architect — Cloud architecture from a sentence",
  description: "Describe what you want. Get a full architecture, cost projection, Terraform, and security review in one pass.",
};

export default function Page() {
  return (
    <ProductShell
      eyebrow="Product · AI Architect"
      accent="ai"
      title={<>Cloud architecture <span className="text-gradient-aurora">from a sentence.</span></>}
      intro='"Build a SaaS platform supporting 100k users with PostgreSQL, Redis, CI/CD, CDN, and disaster recovery." Get a diagram, a cost projection, a Terraform bundle, and a security review — in one pass.'
      bullets={[
        "Multi-model routing — OpenAI, Claude, Gemini per task",
        "Explains every decision inline via the Why Engine",
        "Agent Council: five mascots negotiate before recommending",
        "AI proposes · human approves — never auto-deploys",
      ]}
      heroPreview={<MiniCanvas />}
      capabilities={[
        { icon: MessagesSquare, title: "Prompt to graph", body: "Natural-language requirements produce a real, editable architecture." },
        { icon: Wand2, title: "Iterative refinement", body: "\"Make it HA across three AZs, drop the NAT gateway.\" — regenerates the affected slice, not the whole graph." },
        { icon: ScanSearch, title: "Why Engine", body: "Every node ships with the rationale it was created with — 8 months from now, still legible." },
        { icon: FileCode2, title: "Terraform emission", body: "Approved architectures compile straight to Terraform (Phase 2)." },
        { icon: ShieldCheck, title: "Security review", body: "IAM permissions, exposed surfaces, least-privilege audit — before you ship." },
        { icon: GitCompare, title: "Confidence trace", body: "Every recommendation has a score, sources, and a disagreement log." },
      ]}
      workflow={[
        { step: "01", title: "Describe", body: "Requirements in plain English. Compliance flags allowed." },
        { step: "02", title: "Watch council debate", body: "Aria, Kaz, Elm, Terra, Vex negotiate. You see it happen." },
        { step: "03", title: "Approve or edit", body: "Full canvas control — treat AI output as a first draft, not a lock-in." },
        { step: "04", title: "Ship", body: "Emit Terraform, snapshot to Time Machine, connect Live Twin." },
      ]}
      proof={[
        { metric: "5", label: "council agents · one recommendation" },
        { metric: "3", label: "models routed automatically" },
        { metric: "100%", label: "AI proposes · human approves" },
        { metric: "∞", label: "revisions before a single deploy" },
      ]}
      faqs={[
        { q: "Will the AI ever push to my cloud on its own?", a: "No. The trust bar for infrastructure is too high. AI always proposes, a human always approves before anything touches a real account." },
        { q: "What if the recommendation is wrong?", a: "The Council's disagreement log is public per generation. You can see exactly which agent flagged what, and why the majority disagreed." },
        { q: "Do you train on my prompts?", a: "No. Prompts and generated graphs are yours. Aggregated, anonymized outcomes may fuel Benchmark Intelligence — opt-in only." },
        { q: "Which models power it?", a: "OpenAI GPT class for reasoning, Claude class for review, Gemini for code emission. Routing is task-specific and versioned." },
      ]}
      related={[
        { href: "/product/cloud-playground", title: "Cloud Playground", body: "Edit the AI's draft on the canvas." },
        { href: "/product/architecture-intelligence", title: "Architecture Intelligence", body: "See the AI's diagram scored live." },
        { href: "/mascots", title: "The Council", body: "Meet the five agents debating your graph." },
      ]}
    />
  );
}
