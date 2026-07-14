"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * FAQ — Act X.
 *
 * Uses native <details> so keyboard users, screen readers, and JS-off
 * visitors get correct behavior for free. Motion enhances only the *chevron*
 * rotation via CSS — the panel itself relies on browser open/close so no
 * animation-jank on the accordion body.
 */

const QUESTIONS = [
  {
    q: "Is my architecture private?",
    a: "Yes. Canvases are stored per account and never mined for training data. On Team, we add SSO, SOC 2 audit trails, and IP-scoped access. Full DPA available.",
  },
  {
    q: "Which services are supported?",
    a: "The MVP ships with 23 services — 13 AWS, 5 Azure, 5 GCP — covering compute, containers, serverless, networking, databases, storage, CDN, DNS, and load balancing. New services land every fortnight; the roadmap is public.",
  },
  {
    q: "Does the Terraform export actually run?",
    a: "Yes. The exporter emits real HCL wired to standard providers (hashicorp/aws, azurerm, google). Modules, variables, and outputs are named after your canvas. `terraform plan` runs unchanged.",
  },
  {
    q: "How is validation different from linting?",
    a: "Linting checks syntax. Validation checks *intent* — public egress paths, missing NAT gateways, DBs in public subnets, IAM over-scope. Rules are informed by real production incidents and updated as the community reports new patterns.",
  },
  {
    q: "Can I self-host?",
    a: "On Team. The self-hosted image ships as a single Docker container backed by Postgres. All AI features can be pointed at your own Bedrock / Azure OpenAI / Vertex endpoints.",
  },
  {
    q: "What about migrating existing Terraform?",
    a: "Paste your `.tf` and we render the graph, side-by-side with the source. Round-trip is preserved on Pro and Team.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative mx-auto w-full max-w-4xl px-6 py-24 tablet:px-10 tablet:py-32">
      <div className="mb-12 text-center">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act X · Questions
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
            The obvious ones, first.
          </h2>
        </Reveal>
      </div>

      <div className="divide-y divide-border/40 rounded-2xl border border-border/60 bg-graphite/30 backdrop-blur">
        {QUESTIONS.map((item, i) => (
          <motion.details
            key={item.q}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group px-5 py-5 tablet:px-7 tablet:py-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-ai/50">
              <h3 className="font-display text-lg font-medium leading-snug tracking-tight tablet:text-xl">
                {item.q}
              </h3>
              <svg
                aria-hidden
                className="shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </summary>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground tablet:text-base">
              {item.a}
            </p>
          </motion.details>
        ))}
      </div>
    </section>
  );
}
