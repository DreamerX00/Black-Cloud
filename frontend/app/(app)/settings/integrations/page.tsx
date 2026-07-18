import type { Metadata } from "next";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { GitBranch, MessageSquare, AlertOctagon, Cloud, Radio, Building2 } from "lucide-react";

export const metadata: Metadata = { title: "Integrations" };

const INTS = [
  { icon: GitBranch, name: "GitHub", body: "PR comments on Terraform diffs. Optional auto-review.", state: "connected", tint: "text-success" },
  { icon: MessageSquare, name: "Slack", body: "Council debate transcripts and Health Score alerts to a channel.", state: "connected", tint: "text-success" },
  { icon: AlertOctagon, name: "PagerDuty", body: "Incident opens the diagram automatically, centered on the failing node.", state: "available", tint: "text-ai" },
  { icon: Radio, name: "Opsgenie", body: "Same behavior as PagerDuty · pick either.", state: "available", tint: "text-ai" },
  { icon: Cloud, name: "AWS · Live Twin", body: "Read-only role. SOC2-safe.", state: "connected · read-only", tint: "text-success" },
  { icon: Cloud, name: "Azure · Live Twin", body: "Read-only role.", state: "available", tint: "text-ai" },
  { icon: Cloud, name: "GCP · Live Twin", body: "Read-only role.", state: "available", tint: "text-ai" },
  { icon: Building2, name: "SAP LeanIX", body: "Bidirectional graph sync for governance.", state: "beta", tint: "text-warn" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <ClayCard variant="lg" className="p-8">
        <div className="text-mono-caps text-ai">Integrations</div>
        <h2 className="mt-2 font-display text-2xl font-semibold">Wire BlackCloud into the tools you already use.</h2>
      </ClayCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {INTS.map(i => {
          const Icon = i.icon;
          const isConnected = i.state.startsWith("connected");
          return (
            <ClayCard key={i.name} interactive className="flex items-start justify-between gap-4 p-6">
              <div className="flex items-start gap-4">
                <div className={`clay-sm inline-flex h-11 w-11 items-center justify-center rounded-xl ${i.tint}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">{i.name}</div>
                  <p className="mt-1 text-sm text-ink-dim">{i.body}</p>
                  <div className={`mt-2 text-mono-caps ${i.tint}`}>{i.state}</div>
                </div>
              </div>
              <PillButton variant={isConnected ? "ghost" : "primary"} size="sm">
                {isConnected ? "Manage" : "Connect"}
              </PillButton>
            </ClayCard>
          );
        })}
      </div>
    </div>
  );
}
