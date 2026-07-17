"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * Comparison — competitive positioning matrix.
 *
 * Rows = differentiating capabilities. Columns = BlackCloud vs. the four
 * alternatives users usually weigh us against. BlackCloud's column is
 * highlighted; a filled dot = full support, a hollow dot = partial, empty
 * cell = missing.
 */

type Level = "yes" | "partial" | "no";

type Column = {
  key: string;
  label: string;
  accent: string;
  highlight?: boolean;
};

const COLUMNS: readonly Column[] = [
  { key: "blackcloud", label: "BlackCloud", accent: "#8B5CF6", highlight: true },
  { key: "tf", label: "Terraform / CFN", accent: "#7B42BC" },
  { key: "lucid", label: "Lucidchart", accent: "#F58220" },
  { key: "cloudcraft", label: "Cloudcraft", accent: "#4285F4" },
  { key: "hava", label: "Hava", accent: "#22C55E" },
] as const;

const ROWS: {
  feature: string;
  detail: string;
  values: Record<(typeof COLUMNS)[number]["key"], Level>;
}[] = [
  {
    feature: "Visual editor",
    detail: "Drag, snap, and pan an infinite canvas — no YAML first.",
    values: { blackcloud: "yes", tf: "no", lucid: "yes", cloudcraft: "yes", hava: "partial" },
  },
  {
    feature: "Multi-cloud (AWS · Azure · GCP)",
    detail: "One workspace, three providers, shared visual language.",
    values: { blackcloud: "yes", tf: "yes", lucid: "partial", cloudcraft: "partial", hava: "yes" },
  },
  {
    feature: "Real-time validation",
    detail: "Bad edges flagged the instant you draw them.",
    values: { blackcloud: "yes", tf: "partial", lucid: "no", cloudcraft: "no", hava: "partial" },
  },
  {
    feature: "Export to IaC (Terraform / CFN)",
    detail: "Ship the diagram, keep the source.",
    values: { blackcloud: "yes", tf: "yes", lucid: "no", cloudcraft: "no", hava: "partial" },
  },
  {
    feature: "AI assistance",
    detail: "Prompt the graph, refactor the topology.",
    values: { blackcloud: "yes", tf: "no", lucid: "no", cloudcraft: "no", hava: "no" },
  },
  {
    feature: "Live cost estimate",
    detail: "Sliders on the canvas, dollars on the tile.",
    values: { blackcloud: "yes", tf: "no", lucid: "no", cloudcraft: "yes", hava: "yes" },
  },
];

export function Comparison() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <header className="mb-14 max-w-3xl">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act XVI · Compare
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
            Why teams pick BlackCloud.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Every tool draws boxes. Only one draws the boxes, checks them,
            prices them, and hands you the Terraform.
          </p>
        </Reveal>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-graphite/40 backdrop-blur">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border/60">
              <th className="px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Capability
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className={`px-5 py-4 text-center text-[11px] uppercase tracking-[0.2em] ${
                    c.highlight ? "text-ink" : "text-muted-foreground"
                  }`}
                  style={c.highlight ? { color: c.accent } : undefined}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <motion.tr
                key={row.feature}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="border-b border-border/40 last:border-b-0"
              >
                <td className="px-5 py-4">
                  <div className="font-display text-base font-medium">
                    {row.feature}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {row.detail}
                  </div>
                </td>
                {COLUMNS.map((c) => {
                  const v = row.values[c.key];
                  return (
                    <td
                      key={c.key}
                      className={`px-5 py-4 text-center ${
                        c.highlight ? "bg-ai/5" : ""
                      }`}
                    >
                      <Mark level={v} color={c.highlight ? c.accent : "#EDEDED"} />
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Mark({ level, color }: { level: Level; color: string }) {
  if (level === "yes") {
    return (
      <span
        aria-label="Yes"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}22`, color }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="m5 12 5 5 9-11"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (level === "partial") {
    return (
      <span
        aria-label="Partial"
        className="inline-block h-2.5 w-2.5 rounded-full border"
        style={{ borderColor: color }}
      />
    );
  }
  return (
    <span aria-label="Not supported" className="text-muted-foreground/50">
      —
    </span>
  );
}
