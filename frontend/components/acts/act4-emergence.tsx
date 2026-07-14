"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { BeamBorder } from "@/components/effects/beam-border";
import { Marquee } from "@/components/effects/marquee";
import { Magnetic } from "@/components/effects/magnetic";
import { ShimmerButton } from "@/components/effects/shimmer-button";
import { TextReveal } from "@/components/effects/text-reveal";
import { AuroraBackground } from "@/components/effects/aurora-background";
import { Meteors } from "@/components/effects/meteors";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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
    blurb: "Kick the tires on a single cloud.",
    perks: ["1 cloud", "Community support", "5 deploys/day"],
    cta: "Start free",
  },
  {
    name: "Pilot",
    price: "$49",
    period: "/mo",
    blurb: "For teams shipping across providers.",
    perks: ["3 clouds", "Priority support", "Unlimited deploys"],
    cta: "Start Pilot",
    featured: true,
  },
  {
    name: "Fleet",
    price: "Custom",
    blurb: "Every cloud, dedicated humans, hard SLAs.",
    perks: ["All clouds", "Dedicated SRE", "SLA 99.99%"],
    cta: "Talk to sales",
  },
];

const TESTIMONIALS = [
  {
    quote: "We cut our multi-cloud deploy time from an afternoon to a coffee break.",
    name: "Priya Nair",
    role: "Staff SRE",
    company: "Lumina Labs",
  },
  {
    quote: "The single control plane finally made AWS and GCP feel like one system.",
    name: "Marcus Feld",
    role: "Platform Lead",
    company: "Hearthly",
  },
  {
    quote: "Migrations that used to scare us are now a Tuesday.",
    name: "Sofia Alvarez",
    role: "VP Engineering",
    company: "Northwind",
  },
  {
    quote: "Rollback confidence is the feature we didn't know we were buying.",
    name: "Dane Osei",
    role: "DevOps Engineer",
    company: "Corvid",
  },
  {
    quote: "Onboarded three teams in a week. Support actually answered.",
    name: "Yuki Tanaka",
    role: "Eng Manager",
    company: "Sable",
  },
  {
    quote: "Our cloud spend dashboard paid for the whole plan in month one.",
    name: "Elena Rossi",
    role: "CTO",
    company: "Ferrovia",
  },
];

const LOGOS = [
  "AWS",
  "Google Cloud",
  "Azure",
  "Kubernetes",
  "Terraform",
  "Cloudflare",
  "Vercel",
  "Fly.io",
];

const FAQS = [
  {
    q: "Which clouds does BlackCloud support?",
    a: "AWS, Google Cloud, Azure, and a growing set of edge providers — all managed from one control plane, no per-cloud tooling required.",
  },
  {
    q: "How does pricing work?",
    a: "Start free on Explorer, upgrade to Pilot for team features at $49/mo, or contact us for Fleet with custom limits and SLAs. No credit card to begin.",
  },
  {
    q: "Is my infrastructure secure?",
    a: "We use least-privilege scoped credentials, encrypt secrets at rest and in transit, and never store your workloads. SOC 2 Type II and audit logging come standard on Fleet.",
  },
  {
    q: "Can I migrate an existing stack?",
    a: "Yes. Point BlackCloud at your current provider and we import resources read-only first, so you can plan a zero-downtime cutover before anything changes.",
  },
  {
    q: "What does support look like?",
    a: "Community forums on Explorer, priority queues on Pilot, and a dedicated SRE with a shared channel and guaranteed response times on Fleet.",
  },
];

function PricingCard({ tier, index }: { tier: Tier; index: number }) {
  const reduced = useReducedMotion();

  const inner = (
    <SpotlightCard
      className={cn(
        "flex h-full flex-col p-8 text-left",
        tier.featured ? "bg-background/70" : "bg-white/[0.03] backdrop-blur-sm",
      )}
    >
      {tier.featured && (
        <span className="mb-4 inline-flex w-fit items-center rounded-full border border-accent-violet/40 bg-accent-violet/10 px-3 py-1 text-xs font-medium text-accent-violet">
          Most popular
        </span>
      )}
      <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-white">{tier.price}</span>
        {tier.period && (
          <span className="text-sm text-zinc-500">{tier.period}</span>
        )}
      </div>
      <p className="mt-3 text-sm text-zinc-400">{tier.blurb}</p>
      <ul className="mt-6 space-y-3 text-sm">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2.5 text-zinc-300">
            <Check
              className="size-4 shrink-0 text-accent-cyan"
              aria-hidden
            />
            {perk}
          </li>
        ))}
      </ul>
      <div className="mt-8 pt-2">
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

  const wrapped = tier.featured ? (
    <BeamBorder className="h-full">{inner}</BeamBorder>
  ) : (
    inner
  );

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

function TestimonialCard({
  quote,
  name,
  role,
  company,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <figure className="w-[320px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <blockquote className="text-sm leading-relaxed text-zinc-300">
        “{quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan text-xs font-semibold text-white">
          {name
            .split(" ")
            .map((w) => w[0])
            .join("")}
        </span>
        <span className="text-xs">
          <span className="block font-medium text-white">{name}</span>
          <span className="block text-zinc-500">
            {role} · {company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Act4Emergence() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-32">
      {/* Heading */}
      <div className="px-6 text-center">
        <TextReveal>
          <h2 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Emerge with control.
          </h2>
        </TextReveal>
        <p className="mx-auto mt-4 max-w-xl text-balance text-zinc-400">
          One control plane for every cloud. Pick a tier and descend.
        </p>
      </div>

      {/* Pricing */}
      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 px-6 lg:grid-cols-3 lg:items-center">
        {TIERS.map((tier, i) => (
          <PricingCard key={tier.name} tier={tier} index={i} />
        ))}
      </div>

      {/* Testimonials */}
      <div className="mt-32">
        <TextReveal>
          <h3 className="mb-10 text-center text-2xl font-semibold text-white">
            Teams that already descended
          </h3>
        </TextReveal>
        <div className="flex flex-col gap-6">
          <Marquee speed={48} className="[--gap:1.5rem]">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </Marquee>
          <Marquee reverse speed={56} className="[--gap:1.5rem]">
            {TESTIMONIALS.slice(3).map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </Marquee>
        </div>
      </div>

      {/* Logos */}
      <div className="mt-24">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-zinc-600">
          Deploys everywhere you already run
        </p>
        <Marquee reverse speed={38} className="[--gap:3rem]">
          {LOGOS.map((logo) => (
            <span
              key={logo}
              className="shrink-0 text-lg font-semibold tracking-tight text-zinc-500 transition-colors hover:text-white"
            >
              {logo}
            </span>
          ))}
        </Marquee>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-32 max-w-2xl px-6">
        <TextReveal>
          <h3 className="mb-8 text-center text-2xl font-semibold text-white">
            Questions, answered
          </h3>
        </TextReveal>
        <Accordion type="single" collapsible className="text-zinc-300">
          {FAQS.map((faq) => (
            <AccordionItem
              key={faq.q}
              value={faq.q}
              className="border-white/10"
            >
              <AccordionTrigger className="py-4 text-base text-white">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-zinc-400">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Final CTA */}
      <div className="mx-auto mt-32 max-w-2xl px-6 text-center">
        <TextReveal>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to descend?
          </h2>
        </TextReveal>
        <p className="mx-auto mt-4 max-w-md text-balance text-zinc-400">
          Spin up your first cloud in minutes. No credit card required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic>
            <ShimmerButton>Start free</ShimmerButton>
          </Magnetic>
          <a
            href="#"
            className="text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Book a demo →
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-32 border-t border-white/10 bg-gradient-to-b from-background/80 to-black">
        <AuroraBackground className="pointer-events-none absolute inset-0 -z-10 opacity-30" />
        <Meteors count={12} />
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
            <div className="col-span-2 md:col-span-1">
              <span className="text-lg font-bold tracking-tight text-white">
                BLACKCLOUD
              </span>
              <p className="mt-3 max-w-[16rem] text-sm text-zinc-500">
                Descend, deploy, dominate — one control plane for every cloud.
              </p>
            </div>
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-zinc-400 transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-zinc-600 sm:flex-row">
            {/* ponytail: static year — avoids new Date() (SSR hydration risk + blocked in this env); bump annually */}
            <span>© 2026 BlackCloud, Inc. All rights reserved.</span>
            <span>Made for teams that ship across clouds.</span>
          </div>
        </div>
      </footer>
    </section>
  );
}

const FOOTER_COLUMNS = [
  { title: "Product", links: ["Overview", "Pricing", "Integrations", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
  { title: "Resources", links: ["Docs", "API", "Status", "Community"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "DPA"] },
];
