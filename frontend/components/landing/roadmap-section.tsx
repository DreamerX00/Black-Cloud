import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";
import { Check, Sparkles, Rocket, Users, Building2, Layers } from "lucide-react";

const PHASES = [
  { icon: Check,       label: "Phase 0", title: "Foundation",   status: "shipped",   body: "Next 16 · React 19 · design system · monorepo · auth · Postgres." },
  { icon: Sparkles,    label: "Phase 1", title: "MVP",          status: "shipped",   body: "Cloud Playground · multi-cloud node library · smart validation · export." },
  { icon: Rocket,      label: "Phase 2", title: "Intelligence", status: "in-flight", body: "AI Architect · Cost Simulator · Architecture Scoring." },
  { icon: Users,       label: "Phase 3", title: "Alive",        status: "next",      body: "Live Twin · Blast Radius · Incident War Room · Time Machine." },
  { icon: Layers,      label: "Phase 4", title: "Wide",         status: "planned",   body: "Migration Ground · full multi-cloud · Benchmark Intelligence." },
  { icon: Building2,   label: "Phase 5", title: "Enterprise",   status: "planned",   body: "SSO/SAML/SCIM · Governance Center · Compliance packs · Cloud Academy." },
];

function statusTint(s: string) {
  return s === "shipped"
    ? "text-success border-success/30"
    : s === "in-flight"
    ? "text-ai border-ai/40"
    : s === "next"
    ? "text-info border-info/40"
    : "text-ink-mute border-white/10";
}

export function RoadmapSection() {
  return (
    <Section
      eyebrow="Build order · public roadmap"
      title={<>Ambition without sequencing is <span className="text-gradient-aurora">how platforms die.</span></>}
      intro="Six phases. Each ships something usable. No feature ever waits for another feature to become good."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PHASES.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal key={p.label} delay={i * 0.06}>
              <ClayCard interactive className="flex h-full flex-col gap-5 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-mono-caps text-ink-mute">{p.label}</div>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${statusTint(p.status)}`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="clay-sm inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="h-4 w-4 text-ai" />
                  </div>
                  <div>
                    <div className="font-display text-xl font-semibold">{p.title}</div>
                    <p className="mt-1 text-sm text-ink-dim">{p.body}</p>
                  </div>
                </div>
              </ClayCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
