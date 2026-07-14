"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * Trust — enterprise compliance / security beat.
 *
 * Six badge tiles in a grid. Hover glows the border with the badge's accent
 * color. Each tile also shows a short "what it means to you" line, not just
 * the badge name.
 */

const BADGES = [
  {
    label: "SOC 2 Type II",
    body: "Independent audit of security controls. Report on request.",
    accent: "#8B5CF6",
    icon: "shield",
  },
  {
    label: "GDPR",
    body: "EU data-subject rights, DPA on file, EU-resident processing option.",
    accent: "#4285F4",
    icon: "globe",
  },
  {
    label: "ISO 27001",
    body: "Information-security management aligned to the ISO framework.",
    accent: "#22C55E",
    icon: "lock",
  },
  {
    label: "HIPAA",
    body: "BAA available on Team plans. PHI never leaves your workspace.",
    accent: "#FF9900",
    icon: "cross",
  },
  {
    label: "AES-256",
    body: "At-rest encryption on every canvas. TLS 1.3 in transit.",
    accent: "#F59E0B",
    icon: "key",
  },
  {
    label: "SSO / SAML",
    body: "Okta, Azure AD, Google Workspace. SCIM provisioning on Team.",
    accent: "#EDEDED",
    icon: "id",
  },
];

export function Trust() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <header className="mb-14 max-w-3xl">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act XVI · Trust
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
            Built for the review board.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            The checklist your security team hands you before you can even
            get started. We&rsquo;ve already ticked it.
          </p>
        </Reveal>
      </header>

      <div className="grid gap-3 tablet:grid-cols-3 tablet:gap-4">
        {BADGES.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-graphite/40 p-6 backdrop-blur transition-colors hover:border-border"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ boxShadow: `inset 0 0 0 1px ${b.accent}` }}
            />
            <TrustIcon icon={b.icon} color={b.accent} />
            <div className="mt-5 font-display text-2xl font-semibold tracking-tight">
              {b.label}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TrustIcon({ icon, color }: { icon: string; color: string }) {
  // Simple inline set — no extra icon dep needed.
  const paths: Record<string, string> = {
    shield: "M12 2 4 5v7c0 4.5 3 8.5 8 10 5-1.5 8-5.5 8-10V5l-8-3Z",
    globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 0v20M2 12h20M4 7h16M4 17h16",
    lock: "M6 10V7a6 6 0 0 1 12 0v3M4 10h16v11H4z",
    cross: "M12 4v16M4 12h16",
    key: "M15 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-3 4 8 8m-3-3 3-3",
    id: "M3 5h18v14H3zM7 9h10M7 13h6M7 17h4",
  };
  const d = paths[icon] ?? paths.shield;
  return (
    <div
      className="flex h-11 w-11 items-center justify-center rounded-lg"
      style={{ backgroundColor: `${color}22`, color }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
