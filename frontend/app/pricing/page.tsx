import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillButton } from "@/components/ui/pill-button";
import { Check, Sparkles, Building2, Rocket, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Fair, transparent, and future-value based",
  description: "Free during Phase 2. Pro, Team, and Enterprise plans with usage-metered AI and Live Twin.",
};

const TIERS = [
  {
    tier: "Solo",
    price: "$0",
    cadence: "forever",
    tagline: "Everything a solo engineer needs to design real infra.",
    icon: Rocket,
    features: [
      "Unlimited projects",
      "AWS · Azure · GCP nodes",
      "AI Architect · 20 generations/mo",
      "Cost Simulator",
      "PNG/SVG/JSON export",
      "Community support",
    ],
    cta: { label: "Start free", href: "/signup" },
    accent: "text-ink",
    highlight: false,
  },
  {
    tier: "Pro",
    price: "$29",
    cadence: "per seat / mo",
    tagline: "For engineers who own the graph.",
    icon: Sparkles,
    features: [
      "Everything in Solo",
      "AI Architect · 500 generations/mo",
      "Live Twin (read-only) · 50 resources",
      "Failure Simulator · full library",
      "Time Machine · 18-month retention",
      "Terraform emission",
      "Priority email support",
    ],
    cta: { label: "Start Pro trial", href: "/signup?plan=pro" },
    accent: "text-ai",
    highlight: true,
  },
  {
    tier: "Team",
    price: "$79",
    cadence: "per seat / mo",
    tagline: "For teams running architecture as a process.",
    icon: Users,
    features: [
      "Everything in Pro",
      "Shared workspaces · unlimited",
      "PR-style architecture review",
      "Health Score · exec dashboards",
      "Live Twin (read/write) · 500 resources",
      "Blueprint Exchange contributor",
      "SLA · 99.9%",
    ],
    cta: { label: "Talk to sales", href: "/contact?plan=team" },
    accent: "text-info",
    highlight: false,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    cadence: "annual · scoped",
    tagline: "SOC2, SSO, Governance, private deploy.",
    icon: Building2,
    features: [
      "Everything in Team",
      "SSO · SAML · SCIM",
      "SOC2 Type II · continuous evidence",
      "Governance Center · policy engine",
      "Live Twin · unlimited resources",
      "Custom retention (7yr+)",
      "Dedicated CSM · 24/7 pager",
    ],
    cta: { label: "Book a call", href: "/contact?plan=enterprise" },
    accent: "text-aws",
    highlight: false,
  },
];

const USAGE = [
  { k: "AI generation", v: "$0.20", u: "per run over quota" },
  { k: "Live Twin resource", v: "$0.05", u: "per synced resource/mo over quota" },
  { k: "Chaos scenario", v: "$0.10", u: "per simulation over quota" },
  { k: "Blueprint publish", v: "70/30 rev share", u: "authors keep 70%" },
];

const FAQ = [
  { q: "Is there a free plan forever?", a: "Yes. Solo stays free with generous limits. We monetize on scale (AI usage, Live Twin resources, teams), not by locking away the core experience." },
  { q: "Do you charge for viewers?", a: "No. Only editors count as seats. Read-only viewers are unlimited on every plan." },
  { q: "Do you refund unused seats?", a: "Prorated refunds on annual plans, no questions asked. Ethical lock-in only." },
  { q: "Can I self-host?", a: "Enterprise plan includes on-prem via Docker Compose or Kubernetes. Private-region cloud deploys available." },
  { q: "Is my data ever used to train AI?", a: "Never. Prompts and graphs are private per-org. Benchmark Intelligence uses opt-in anonymized aggregates only." },
  { q: "What happens if I cancel?", a: "Your data exports as JSON at any time. Value-based lock-in, not hostage-based." },
];

export default function PricingPage() {
  return (
    <>
      <Section className="!pt-40" align="center">
        <Eyebrow>Pricing</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-tight">
          Priced like a tool <br />
          <span className="text-gradient-nebula">you’d want to keep.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-dim">
          A free plan you can live in. A Pro plan an engineer pays for personally. A Team plan that pays for itself the first review meeting. An Enterprise plan a CISO can sign for.
        </p>
      </Section>

      <Section className="!pt-0">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t, i) => {
            const Icon = t.icon;
            return (
              <Reveal key={t.tier} delay={i * 0.06}>
                <ClayCard
                  variant={t.highlight ? "lg" : "md"}
                  glow={t.highlight ? "ai" : undefined}
                  className="relative flex h-full flex-col gap-6 p-8"
                >
                  {t.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ai px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-void">
                      Most popular
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`clay-sm inline-flex h-11 w-11 items-center justify-center rounded-2xl ${t.accent}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-display text-xl font-semibold">{t.tier}</div>
                      <div className="text-mono-caps text-ink-mute">{t.tagline}</div>
                    </div>
                  </div>
                  <div>
                    <span className="font-display text-5xl font-semibold">{t.price}</span>
                    <span className="ml-2 text-sm text-ink-mute">{t.cadence}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {t.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-ink-dim">
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${t.accent}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <PillButton
                    href={t.cta.href}
                    variant={t.highlight ? "primary" : "outline"}
                    className="mt-auto w-full justify-center"
                  >
                    {t.cta.label}
                  </PillButton>
                </ClayCard>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section
        eyebrow="Usage-metered add-ons"
        title={<>You pay for the <span className="text-gradient-aurora">heaviest engines</span>, not the seat.</>}
        intro="Everything under the seat floor. Overage is metered — cheap in, cheap up."
      >
        <ClayCard variant="lg" className="divide-y divide-white/8">
          {USAGE.map(u => (
            <div key={u.k} className="grid grid-cols-1 gap-2 p-6 md:grid-cols-4">
              <div className="font-display text-lg font-semibold">{u.k}</div>
              <div className="font-mono text-2xl text-ai md:col-span-1">{u.v}</div>
              <div className="text-sm text-ink-dim md:col-span-2">{u.u}</div>
            </div>
          ))}
        </ClayCard>
      </Section>

      <Section
        eyebrow="Everything in every plan"
        title={<>The floor is <span className="text-gradient-nebula">already high.</span></>}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Multi-cloud from day one",
            "Least-privilege by default",
            "Read-only Live Twin (Pro+)",
            "Unlimited viewers, always",
            "Full JSON export, any time",
            "Reduced-motion accessible mode",
            "Keyboard-first navigation",
            "Open protocols — no lock-in",
            "Community support forever",
          ].map(f => (
            <div key={f} className="clay-sm flex items-center gap-3 p-4">
              <Zap className="h-4 w-4 text-ai" />
              <span className="text-sm text-ink-dim">{f}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Frequently asked" title={<>What we get asked most</>}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FAQ.map(f => (
            <ClayCard key={f.q} variant="sm" className="p-6">
              <div className="font-display text-lg font-semibold">{f.q}</div>
              <p className="mt-2 text-sm text-ink-dim">{f.a}</p>
            </ClayCard>
          ))}
        </div>
      </Section>
    </>
  );
}
