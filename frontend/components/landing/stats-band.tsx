import { Section } from "@/components/ui/section";
import { Stat } from "@/components/ui/stat";

export function StatsBand() {
  return (
    <Section className="!pt-16 md:!pt-24">
      <div className="clay-lg mx-auto grid w-full max-w-5xl grid-cols-2 items-center justify-items-center gap-y-10 p-8 md:grid-cols-4 md:gap-y-0 md:p-12">
        <Stat value={640} label="Nodes rendered @ 60fps" tone="ai" />
        <Stat value={300} suffix="+" label="Connections live" tone="info" />
        <Stat value={7} label="Product lenses · one graph" tone="aws" />
        <Stat value={100} suffix="%" label="Multi-cloud coverage" tone="success" hint="AWS · Azure · GCP · Terraform" />
      </div>
    </Section>
  );
}
