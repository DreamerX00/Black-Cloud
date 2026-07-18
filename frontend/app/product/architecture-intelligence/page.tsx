import type { Metadata } from "next";
import { ProductShell } from "@/components/product/product-shell";
import { MiniCanvas } from "@/components/product/mini-canvas";
import { BrainCircuit, ShieldCheck, HeartPulse, DollarSign, AlertOctagon, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Architecture Intelligence — The Health Score",
  description: "One number that blends security, resilience, cost efficiency, and drift. Trackable over time. Legible on a slide.",
};

export default function Page() {
  return (
    <ProductShell
      eyebrow="Product · Architecture Intelligence"
      accent="gcp"
      title={<>One number your <span className="text-gradient-aurora">CEO understands.</span></>}
      intro="Health Score blends security, resilience, cost efficiency, and drift into a single 0–100. Trackable over time. Legible on a slide. Auditable down to the exact node that dragged it down."
      bullets={[
        "Continuously scored — every change updates the number",
        "Four axes: Security · Resilience · Cost · Drift",
        "Executive-friendly, engineer-defensible",
        "Historical trend line — 18 months by default",
      ]}
      heroPreview={<MiniCanvas />}
      capabilities={[
        { icon: BrainCircuit, title: "Live scoring", body: "Every canvas change recomputes the score within 300ms." },
        { icon: ShieldCheck, title: "Security axis", body: "IAM sprawl, exposed surfaces, unencrypted data — surfaced with line-items." },
        { icon: HeartPulse, title: "Resilience axis", body: "AZ redundancy, retry paths, single-instance dependencies — each weighed." },
        { icon: DollarSign, title: "Cost axis", body: "Idle resources, over-provisioning, cheaper region availability." },
        { icon: AlertOctagon, title: "Drift detector", body: "Live Twin surfaces graph-vs-real divergence as a score penalty." },
        { icon: Award, title: "Benchmark", body: "Opt-in peer comparison: how your Score ranks against companies your size." },
      ]}
      workflow={[
        { step: "01", title: "Score everything", body: "First graph load produces a baseline Score in under a second." },
        { step: "02", title: "Watch it move", body: "Every design change nudges the number. Reviewers see the delta." },
        { step: "03", title: "Fix the drags", body: "Sorted list of every finding that lowered the number, ranked by impact." },
        { step: "04", title: "Ship the trend", body: "Executive PDF with 90-day trend line and top three improvements." },
      ]}
      proof={[
        { metric: "0-100", label: "single legible number" },
        { metric: "4", label: "axes · security, resilience, cost, drift" },
        { metric: "300ms", label: "recompute per change" },
        { metric: "18mo", label: "trend line · default" },
      ]}
      faqs={[
        { q: "Is the score gameable?", a: "Every axis is transparent and cited to specific nodes. Cheating the score requires actually fixing the underlying architecture — that's the point." },
        { q: "Can we customize weights?", a: "Enterprise plans allow per-org weightings. Default weights come from published SRE and cloud security frameworks." },
        { q: "How does drift factor in?", a: "If Live Twin is connected, real infrastructure that diverges from the graph subtracts from the Drift axis, weighted by blast radius." },
        { q: "Is benchmark data safe?", a: "Opt-in only, aggregated, k-anonymized to industry × size buckets. Never traceable to your organization." },
      ]}
      related={[
        { href: "/product/cost-simulator", title: "Cost Simulator", body: "Cost axis fed live from here." },
        { href: "/product/failure-simulator", title: "Failure Simulator", body: "Resilience axis validated by drills." },
        { href: "/product/time-machine", title: "Time Machine", body: "Score trend line for the last 18 months." },
      ]}
    />
  );
}
