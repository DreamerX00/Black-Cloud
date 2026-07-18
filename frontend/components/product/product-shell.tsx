import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillButton } from "@/components/ui/pill-button";

export type ProductPageProps = {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  accent: "ai" | "aws" | "azure" | "gcp" | "success" | "danger";
  heroPreview: ReactNode;
  bullets: string[];
  capabilities: Array<{
    icon: ComponentType<{ className?: string }>;
    title: string;
    body: string;
  }>;
  workflow: Array<{ step: string; title: string; body: string }>;
  proof: Array<{ metric: string; label: string; hint?: string }>;
  faqs: Array<{ q: string; a: string }>;
  related: Array<{ href: string; title: string; body: string }>;
};

const accentClass: Record<ProductPageProps["accent"], string> = {
  ai: "text-ai",
  aws: "text-aws",
  azure: "text-azure",
  gcp: "text-gcp",
  success: "text-success",
  danger: "text-danger",
};

export function ProductShell(p: ProductPageProps) {
  const glow = p.accent;
  return (
    <>
      {/* Hero */}
      <Section className="!pt-40">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Eyebrow tone={p.accent}>{p.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tight">
              {p.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-dim">{p.intro}</p>
            <ul className="mt-8 space-y-2">
              {p.bullets.map(b => (
                <li key={b} className="flex items-start gap-3 text-sm text-ink-dim">
                  <Check className={`mt-1 h-4 w-4 shrink-0 ${accentClass[p.accent]}`} />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <PillButton href="/signup" size="lg">Try it free</PillButton>
              <PillButton href="/docs" variant="ghost">Read the docs</PillButton>
            </div>
          </div>
          <div className="lg:col-span-6">
            <ClayCard variant="lg" glow={glow} className="relative overflow-hidden">
              <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
              <div className="relative">{p.heroPreview}</div>
            </ClayCard>
          </div>
        </div>
      </Section>

      {/* Capabilities */}
      <Section
        eyebrow="Capabilities"
        title={<>What it actually does</>}
        intro="No marketing collages. These are the exact affordances shipping this quarter."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {p.capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.title} delay={i * 0.06}>
                <ClayCard interactive className="flex h-full flex-col gap-4 p-6">
                  <div className={`clay-sm inline-flex h-11 w-11 items-center justify-center rounded-2xl ${accentClass[p.accent]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-semibold">{c.title}</div>
                    <p className="mt-1 text-sm text-ink-dim">{c.body}</p>
                  </div>
                </ClayCard>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Workflow */}
      <Section eyebrow="Workflow" title={<>Ninety seconds, four steps</>}>
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {p.workflow.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.08}>
              <ClayCard variant="sm" className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <span className={`font-display text-4xl font-semibold ${accentClass[p.accent]}/60`}>{s.step}</span>
                  <div className="h-px flex-1 bg-white/8" />
                </div>
                <div className="font-display text-lg font-semibold">{s.title}</div>
                <p className="text-sm text-ink-dim">{s.body}</p>
              </ClayCard>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Proof */}
      <Section className="!pt-0">
        <ClayCard variant="lg" className="grid grid-cols-2 gap-y-10 p-10 md:grid-cols-4">
          {p.proof.map(pr => (
            <div key={pr.label}>
              <div className={`font-display text-4xl font-semibold ${accentClass[p.accent]}`}>{pr.metric}</div>
              <div className="mt-1 text-mono-caps text-ink-mute">{pr.label}</div>
              {pr.hint && <div className="mt-1 text-xs text-ink-mute/70">{pr.hint}</div>}
            </div>
          ))}
        </ClayCard>
      </Section>

      {/* FAQs */}
      <Section eyebrow="Questions we actually get asked" title={<>Honest answers</>}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {p.faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.06}>
              <ClayCard variant="sm" className="p-6">
                <div className="font-display text-lg font-semibold">{f.q}</div>
                <p className="mt-2 text-sm text-ink-dim">{f.a}</p>
              </ClayCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Related */}
      <Section eyebrow="Keep exploring" title={<>Adjacent lenses on the same graph</>}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {p.related.map(r => (
            <Link
              key={r.href}
              href={r.href}
              data-cursor="magnet"
              className="clay group flex flex-col justify-between p-6 transition-transform hover:-translate-y-0.5"
            >
              <div>
                <div className="font-display text-lg font-semibold">{r.title}</div>
                <p className="mt-1 text-sm text-ink-dim">{r.body}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-ai">
                Read <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Product CTA */}
      <Section className="!pb-40">
        <ClayCard variant="lg" glow={glow} className="relative overflow-hidden p-12 md:p-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-40" />
          <div className="relative flex flex-col items-center gap-6 text-center">
            <Sparkles className={`h-8 w-8 ${accentClass[p.accent]} animate-pulse-slow`} />
            <h2 className="font-display text-4xl font-semibold md:text-5xl">
              Ready to feel the difference?
            </h2>
            <PillButton href="/signup" size="lg">Enter the universe</PillButton>
          </div>
        </ClayCard>
      </Section>
    </>
  );
}
