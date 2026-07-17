"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { Check, Minus } from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/layout/section-reveal";
import { SiteFooter } from "@/components/layout/site-footer";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { BeamBorder } from "@/components/effects/beam-border";
import { Magnetic } from "@/components/effects/magnetic";
import { ShimmerButton } from "@/components/effects/shimmer-button";
import { TextReveal } from "@/components/effects/text-reveal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const PricingScene = dynamic(() => import("./scene"), { ssr: false });

type Tier = {
  name: string;
  price: string;
  period?: string;
  blurb: string;
  perks: string[];
  cta: string;
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Explorer",
    price: "$0",
    period: "forever",
    blurb: "Kick the tires on a single cloud, no card required.",
    perks: ["1 cloud provider", "5 deploys / day", "Community support", "Read-only imports"],
    cta: "Start free",
  },
  {
    name: "Pilot",
    price: "$49",
    period: "/mo",
    blurb: "For teams shipping across every provider at once.",
    perks: [
      "3 cloud providers",
      "Unlimited deploys",
      "Priority support",
      "Cost dashboards",
      "Zero-downtime cutovers",
    ],
    cta: "Start Pilot",
    featured: true,
  },
  {
    name: "Fleet",
    price: "Custom",
    blurb: "Every cloud, dedicated humans, and hard SLAs.",
    perks: ["All clouds", "Dedicated SRE", "SLA 99.99%", "SOC 2 + audit logs", "SSO / SAML"],
    cta: "Talk to sales",
  },
];

// Feature comparison matrix. `true`/`false` render a check/dash; strings render as-is.
const FEATURE_ROWS: { label: string; explorer: string | boolean; pilot: string | boolean; fleet: string | boolean }[] = [
  { label: "Cloud providers", explorer: "1", pilot: "3", fleet: "Unlimited" },
  { label: "Deploys per day", explorer: "5", pilot: "Unlimited", fleet: "Unlimited" },
  { label: "Team seats", explorer: "1", pilot: "10", fleet: "Custom" },
  { label: "Cost dashboards", explorer: false, pilot: true, fleet: true },
  { label: "Zero-downtime cutovers", explorer: false, pilot: true, fleet: true },
  { label: "Audit logging", explorer: false, pilot: false, fleet: true },
  { label: "SSO / SAML", explorer: false, pilot: false, fleet: true },
  { label: "Dedicated SRE", explorer: false, pilot: false, fleet: true },
  { label: "Support", explorer: "Community", pilot: "Priority", fleet: "Dedicated + SLA" },
];

const FAQS = [
  {
    q: "Which clouds does BlackCloud support?",
    a: "AWS, Google Cloud, Azure, and a growing set of edge providers — all managed from one control plane, no per-cloud tooling required.",
  },
  {
    q: "Can I change plans at any time?",
    a: "Yes. Upgrade or downgrade whenever you like; changes prorate to the day and never interrupt running deploys.",
  },
  {
    q: "Is my infrastructure secure?",
    a: "We use least-privilege scoped credentials, encrypt secrets at rest and in transit, and never store your workloads. SOC 2 Type II and audit logging come standard on Fleet.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. Explorer is free forever with no card. You only add billing when you move to Pilot or Fleet.",
  },
  {
    q: "What does support look like?",
    a: "Community forums on Explorer, priority queues on Pilot, and a dedicated SRE with a shared channel and guaranteed response times on Fleet.",
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto size-4 text-accent-cyan" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto size-4 text-muted-foreground/40" aria-label="Not included" />;
  return <span className="text-sm text-foreground">{value}</span>;
}

function PricingCard({ tier, index }: { tier: Tier; index: number }) {
  const reduced = useReducedMotion();

  const inner = (
    <SpotlightCard className="flex h-full flex-col p-8 text-left">
      {tier.featured && (
        <span className="mb-4 inline-flex w-fit items-center rounded-full border border-accent-violet/40 bg-accent-violet/10 px-3 py-1 text-xs font-medium text-accent-violet">
          Most popular
        </span>
      )}
      <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-foreground">{tier.price}</span>
        {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{tier.blurb}</p>
      <ul className="mt-6 space-y-3 text-sm">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2.5 text-muted-foreground">
            <Check className="size-4 shrink-0 text-accent-cyan" aria-hidden />
            {perk}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <Magnetic>
          {tier.featured ? (
            <ShimmerButton className="w-full">{tier.cta}</ShimmerButton>
          ) : (
            <Button variant="outline" className="h-11 w-full rounded-full px-6">
              {tier.cta}
            </Button>
          )}
        </Magnetic>
      </div>
    </SpotlightCard>
  );

  const wrapped = tier.featured ? <BeamBorder className="h-full">{inner}</BeamBorder> : inner;

  return (
    <motion.div
      className={cn(tier.featured && "lg:-my-4 lg:scale-[1.04]")}
      initial={reduced ? undefined : { opacity: 0, y: 32 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {wrapped}
    </motion.div>
  );
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <PageHero
          scene={<PricingScene />}
          eyebrow="Pricing"
          title={
            <>
              Pick your <span className="text-gradient">monolith</span>.
            </>
          }
          subtitle="Three tiers, one control plane. Start free, scale to the fleet — every cloud from a single pane of glass."
          actions={
            <>
              <Magnetic>
                <ShimmerButton>Start free</ShimmerButton>
              </Magnetic>
              <a
                href="#tiers"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Compare plans ↓
              </a>
            </>
          }
        />

        {/* Pricing tiers */}
        <span id="tiers" className="block" aria-hidden />
        <SectionReveal as="section" className="relative z-10 px-6 pt-12 pb-24">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3 lg:items-center">
            {TIERS.map((tier, i) => (
              <PricingCard key={tier.name} tier={tier} index={i} />
            ))}
          </div>
        </SectionReveal>

        {/* Feature comparison table */}
        <SectionReveal as="section" className="relative z-10 px-6 pb-28">
          <div className="mx-auto max-w-5xl">
            <TextReveal>
              <h2 className="mb-10 text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Compare every feature
              </h2>
            </TextReveal>
            <div className="clay overflow-hidden rounded-3xl p-0">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-5 text-sm font-medium text-muted-foreground">Feature</th>
                    <th className="p-5 text-center text-sm font-semibold text-foreground">Explorer</th>
                    <th className="p-5 text-center text-sm font-semibold text-accent-violet">Pilot</th>
                    <th className="p-5 text-center text-sm font-semibold text-foreground">Fleet</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_ROWS.map((row, i) => (
                    <tr
                      key={row.label}
                      className={cn(
                        "border-b border-white/5 last:border-0",
                        i % 2 === 1 && "bg-white/[0.02]",
                      )}
                    >
                      <td className="p-5 text-sm text-muted-foreground">{row.label}</td>
                      <td className="p-5 text-center">
                        <Cell value={row.explorer} />
                      </td>
                      <td className="bg-accent-violet/[0.06] p-5 text-center">
                        <Cell value={row.pilot} />
                      </td>
                      <td className="p-5 text-center">
                        <Cell value={row.fleet} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionReveal>

        {/* FAQ */}
        <SectionReveal as="section" className="relative z-10 px-6 pb-28">
          <div className="mx-auto max-w-2xl">
            <TextReveal>
              <h2 className="mb-8 text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Questions, answered
              </h2>
            </TextReveal>
            <Accordion type="single" collapsible className="gap-3 text-muted-foreground">
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q} className="clay border-0 px-5">
                  <AccordionTrigger className="py-4 text-base text-foreground">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SectionReveal>

        {/* Final CTA */}
        <SectionReveal as="section" className="relative z-10 px-6 pb-32 text-center">
          <div className="mx-auto max-w-2xl">
            <TextReveal>
              <h2 className="text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Ready to launch your fleet?
              </h2>
            </TextReveal>
            <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
              Spin up your first cloud in minutes. No credit card required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnetic>
                <ShimmerButton>Start free</ShimmerButton>
              </Magnetic>
              <a
                href="#"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Book a demo →
              </a>
            </div>
          </div>
        </SectionReveal>
      </main>
      <SiteFooter />
    </>
  );
}
