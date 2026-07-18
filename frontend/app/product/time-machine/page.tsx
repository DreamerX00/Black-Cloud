import type { Metadata } from "next";
import { ProductShell } from "@/components/product/product-shell";
import { MiniCanvas } from "@/components/product/mini-canvas";
import { Clock3, GitCommit, Rewind, Diff, MessageSquareQuote, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Time Machine — Replay infrastructure over months",
  description: "Every diff, every decision, timestamped. Scrub through 18 months of your infrastructure as if it were a film.",
};

export default function Page() {
  return (
    <ProductShell
      eyebrow="Product · Time Machine"
      accent="gcp"
      title={<><span className="text-gradient-nebula">Every diff.</span> Every decision. Every reason.</>}
      intro="Nudge a slider — watch your infrastructure move backwards through months of changes. Every diff is timestamped, every decision carries the rationale the Why Engine captured at the time. Cancel BlackCloud and this archive is unrepeatable."
      bullets={[
        "Git-style diff on every architecture change",
        "Why Engine rationale attached to every node",
        "Time-slider scrubs through months in seconds",
        "Author, reviewer, and approval trail preserved",
      ]}
      heroPreview={<MiniCanvas />}
      capabilities={[
        { icon: Clock3, title: "Time slider", body: "Drag through 18 months of your architecture in a single gesture." },
        { icon: GitCommit, title: "Commit anatomy", body: "Every change carries author, reviewer, blast radius, cost delta." },
        { icon: Diff, title: "Visual diff", body: "Added, removed, reconfigured — highlighted node-by-node." },
        { icon: MessageSquareQuote, title: "The Why Engine", body: "Every node explains itself. \"Why db.r6g.xlarge?\" gets an answer that survives the person who chose it." },
        { icon: Rewind, title: "Restore points", body: "Roll back a slice of the architecture with a click — the rest stays." },
        { icon: User, title: "Blame view", body: "Which decision preceded this failure? Traceable in seconds, not a war room." },
      ]}
      workflow={[
        { step: "01", title: "Every save = snapshot", body: "No opt-in. Every graph mutation is captured automatically." },
        { step: "02", title: "Every node = rationale", body: "AI Architect and manual edits both prompt for the why." },
        { step: "03", title: "Scrub the timeline", body: "Compare October to today with a slider." },
        { step: "04", title: "Restore or fork", body: "A single point in time becomes a new branch you can review." },
      ]}
      proof={[
        { metric: "18mo", label: "default retention" },
        { metric: "0s", label: "opt-in — automatic" },
        { metric: "100%", label: "reason coverage · Why Engine" },
        { metric: "1-click", label: "restore any snapshot" },
      ]}
      faqs={[
        { q: "Is the archive exportable if we leave?", a: "Yes. Value-based lock-in only — you can export every snapshot as JSON at any time. See Terms." },
        { q: "Does the Why Engine slow us down?", a: "The prompt is one sentence at node creation. You can defer, but deferred nodes surface a badge until they're annotated." },
        { q: "Can we bring in existing history from git?", a: "Yes — /docs/importing-git-history walks through parsing Terraform commits into snapshots." },
        { q: "What about compliance retention?", a: "Enterprise tier extends retention to 7 years for SOC2/HIPAA workflows." },
      ]}
      related={[
        { href: "/product/architecture-intelligence", title: "Architecture Intelligence", body: "Score every snapshot; watch trend over time." },
        { href: "/product/failure-simulator", title: "Failure Simulator", body: "Replay any historical incident in the sim." },
        { href: "/product/cloud-playground", title: "Cloud Playground", body: "Restore a snapshot to a new canvas." },
      ]}
    />
  );
}
