import type { Metadata } from "next";
import { ProductShell } from "@/components/product/product-shell";
import { MiniCanvas } from "@/components/product/mini-canvas";
import { ArrowLeftRight, Import, GitFork, Timer, Coins, ShieldQuestion } from "lucide-react";

export const metadata: Metadata = {
  title: "Migration Ground — Watch your infrastructure translate itself",
  description: "Import Terraform. Map across clouds. See EC2 morph into Compute Engine, Lambda dissolve into Cloud Run — with risk, cost, and timeline honestly scored.",
};

export default function Page() {
  return (
    <ProductShell
      eyebrow="Product · Migration Ground"
      accent="aws"
      title={<>Watch your infrastructure <span className="text-gradient-aurora">translate itself.</span></>}
      intro="Import Terraform, CloudFormation, or Pulumi. Pick a target cloud. Watch EC2 morph into Compute Engine, Lambda dissolve into Cloud Run, S3 slide into Cloud Storage. Every mapping ships with risk, timeline, and cost delta."
      bullets={[
        "Six migration modes: AWS ↔ Azure ↔ GCP",
        "Complexity, risk, timeline, cost — honestly scored",
        "Visual transformation — you see the morph, not just a table",
        "Multi-cloud neutral — no hyperscaler will ever build this",
      ]}
      heroPreview={<MiniCanvas />}
      capabilities={[
        { icon: Import, title: "Universal import", body: "Terraform, CloudFormation, Pulumi, or an existing BlackCloud project." },
        { icon: ArrowLeftRight, title: "Six-way mapping", body: "AWS ↔ Azure ↔ GCP — bidirectional, honest, service-by-service." },
        { icon: GitFork, title: "Compatibility matrix", body: "Every service scored against the target: exact, adjacent, incompatible." },
        { icon: Timer, title: "Timeline estimator", body: "Rough migration duration, weighted by dependency depth." },
        { icon: Coins, title: "Cost delta", body: "Monthly bill on source vs. target, itemized." },
        { icon: ShieldQuestion, title: "Risk score", body: "Data movement, downtime windows, credential rotation — surfaced early." },
      ]}
      workflow={[
        { step: "01", title: "Import", body: "Drag a folder or paste a repo URL." },
        { step: "02", title: "Choose a target", body: "Any of the three hyperscalers." },
        { step: "03", title: "Read the plan", body: "Complexity · risk · cost · timeline — one page." },
        { step: "04", title: "Watch the morph", body: "Every node transforms visually before you commit." },
      ]}
      proof={[
        { metric: "6", label: "migration directions" },
        { metric: "100+", label: "service mappings" },
        { metric: "0", label: "hyperscaler bias" },
        { metric: "∞", label: "dry runs · no billing surprises" },
      ]}
      faqs={[
        { q: "Isn't AWS's own migration copilot enough?", a: "It plans migrations into Azure — from Microsoft's perspective. And it can't execute cutover. A hyperscaler will never honestly recommend leaving itself. Multi-cloud neutrality is a moat only a third party can hold." },
        { q: "What about state files?", a: "We never touch remote state without explicit write-access approval and a snapshot. Import is read-only by default." },
        { q: "How accurate is the cost delta?", a: "We use published on-demand pricing and your existing utilization patterns. Reserved-instance/committed-use discounts require you to attach your billing account." },
        { q: "Can I migrate partial architectures?", a: "Yes. Select a subgraph in the canvas — only that slice enters the migration plan." },
      ]}
      related={[
        { href: "/product/architecture-intelligence", title: "Architecture Intelligence", body: "Score the target before you commit." },
        { href: "/product/cost-simulator", title: "Cost Simulator", body: "Compare bills side-by-side." },
        { href: "/product/time-machine", title: "Time Machine", body: "Snapshot before, snapshot after — replay the change." },
      ]}
    />
  );
}
