"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

/**
 * Pricing preview — Act IX.
 *
 * Three tiers, with the middle "Pro" tier as the emphasized card (gradient
 * conic border sweep, elevated shadow). Bottom-line reads "free during
 * beta" — the MVP is genuinely free right now.
 */

interface Tier {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  cta: { label: string; href: string };
  features: string[];
  highlight?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Everything you need to design a personal or hobby project.",
    cta: { label: "Start free", href: "/signup" },
    features: [
      "1 workspace",
      "50 nodes per canvas",
      "PNG · SVG · JSON export",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$18",
    cadence: "per user / mo",
    blurb: "For teams shipping real architectures.",
    cta: { label: "Try Pro free", href: "/signup?plan=pro" },
    features: [
      "Unlimited workspaces",
      "100 nodes per canvas",
      "Terraform + CloudFormation export",
      "Realtime validation rules",
      "AI copilot · limited",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Team",
    price: "Custom",
    cadence: "annual",
    blurb: "SSO, audit logs, private rules — for architecture teams at scale.",
    cta: { label: "Contact us", href: "/signup?plan=team" },
    features: [
      "SSO / SAML",
      "SOC 2 audit trail",
      "Custom validation rules",
      "Dedicated Slack channel",
      "AI copilot · unlimited",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <div className="mb-14 text-center">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act IX · Pricing
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
            Free during beta.{" "}
            <span className="bg-gradient-to-r from-ai via-gcp to-aws bg-clip-text text-transparent">
              Fair after.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            The plans below take effect at v1.0. Every account created today
            is grandfathered onto the beta rate.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-4 tablet:grid-cols-3 tablet:gap-6">
        {TIERS.map((t, i) => (
          <PricingCard key={t.name} tier={t} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}

function PricingCard({ tier, delay }: { tier: Tier; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0, 0, 1] }}
      className={`relative flex flex-col rounded-2xl border p-8 backdrop-blur ${
        tier.highlight
          ? "border-ai/60 bg-graphite/70 shadow-[0_40px_120px_-30px_rgba(139,92,246,0.5)]"
          : "border-border/60 bg-graphite/40"
      }`}
    >
      {tier.highlight && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-70"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, rgba(139,92,246,0.4), rgba(66,133,244,0.3), rgba(255,153,0,0.25), rgba(139,92,246,0.4))",
              filter: "blur(24px)",
              zIndex: -1,
            }}
          />
        </>
      )}

      {tier.highlight && (
        <span className="mb-2 self-start rounded-full border border-ai/50 bg-ai/20 px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-ai">
          Most popular
        </span>
      )}

      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {tier.name}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-5xl font-semibold tracking-tight">{tier.price}</span>
        <span className="text-sm text-muted-foreground">{tier.cadence}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{tier.blurb}</p>

      <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <svg
              className="mt-0.5 shrink-0 text-ai"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={tier.cta.href}
        className={`mt-8 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium transition-colors ${
          tier.highlight
            ? "bg-primary text-primary-foreground hover:opacity-90"
            : "border border-border/60 text-foreground hover:bg-graphite/60"
        }`}
      >
        {tier.cta.label}
      </Link>
    </motion.div>
  );
}
