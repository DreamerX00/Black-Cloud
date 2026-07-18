import type { Metadata } from "next";
import { ProductShell } from "@/components/product/product-shell";
import { MiniCanvas } from "@/components/product/mini-canvas";
import { ShieldAlert, MapPin, RadioTower, Trophy, Radar, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Failure Simulator — Rehearse your worst hour",
  description: "Pull a plug, kill a region, crash a database. Traffic reroutes, dependencies flash red, blast radius illuminates — before the real 2am page.",
};

export default function Page() {
  return (
    <ProductShell
      eyebrow="Product · Failure Simulator"
      accent="danger"
      title={<>Rehearse the <span className="text-gradient-aurora">worst hour</span> your on-call ever has.</>}
      intro="Pull a subnet. Kill a region. Crash a database. Watch traffic reroute, dependencies flash red, blast radius illuminate. Every scenario scored — you find the silent single points of failure before the real 2am page does."
      bullets={[
        "AZ, region, database, load balancer, service-level chaos",
        "Blast radius previewed on every hypothetical change",
        "Game Day mode with leaderboard and scoring",
        "Detection-latency, blast-radius, and recovery metrics",
      ]}
      heroPreview={<MiniCanvas />}
      capabilities={[
        { icon: ShieldAlert, title: "Scenario library", body: "AZ, region, DB, load balancer, service crash. Custom scenarios welcome." },
        { icon: MapPin, title: "Blast radius map", body: "The affected subgraph glows red; unaffected fades. Instant legibility." },
        { icon: RadioTower, title: "Reroute animation", body: "Traffic packets reroute in real time; if they can't, you see the dead-end." },
        { icon: Trophy, title: "Game Day mode", body: "Team races to detect, isolate, reroute. Leaderboard included." },
        { icon: Radar, title: "Detection-latency scoring", body: "How long between failure and your team acting? BlackCloud times it." },
        { icon: Activity, title: "Recovery playbook", body: "What worked in the drill becomes the runbook. Auto-linked to Incident War Room." },
      ]}
      workflow={[
        { step: "01", title: "Pick a scenario", body: "Or upload your last real incident to replay it." },
        { step: "02", title: "Fire the chaos", body: "Traffic diverges. Nodes fail. Alerts fire (or don't)." },
        { step: "03", title: "Score the response", body: "Detection latency · blast radius · recovery time · human errors." },
        { step: "04", title: "Fix the graph", body: "Findings become architecture PRs. Runbooks become permanent." },
      ]}
      proof={[
        { metric: "0", label: "real infra harmed · sandbox by design" },
        { metric: "40+", label: "canned scenarios" },
        { metric: "Δs", label: "detection latency measured" },
        { metric: "1", label: "runbook per drill · automated" },
      ]}
      faqs={[
        { q: "Does this touch real infrastructure?", a: "Never. The simulator operates entirely on the graph. If Live Twin is connected, we mirror deployed state read-only." },
        { q: "How is this different from Chaos Monkey?", a: "Chaos Monkey randomly kills real things. This rehearses the response entirely against your architecture graph — no production impact, but far more scenarios explored." },
        { q: "Can we run drills across teams?", a: "Yes — Game Day mode has team assignments, scoring, and a shared leaderboard." },
        { q: "What integrations exist?", a: "PagerDuty and Opsgenie today. When an incident opens in the drill, the same webhook path fires as production." },
      ]}
      related={[
        { href: "/product/architecture-intelligence", title: "Architecture Intelligence", body: "Health score responds to every failure drill." },
        { href: "/product/time-machine", title: "Time Machine", body: "Replay past incidents in the sim." },
        { href: "/product/cloud-playground", title: "Cloud Playground", body: "Fix the graph after the drill." },
      ]}
    />
  );
}
