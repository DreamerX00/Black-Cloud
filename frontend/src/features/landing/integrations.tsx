"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * Integrations constellation — 24 tool tiles arranged on two concentric
 * rings around a central BlackCloud node. Hover any tile → a line draws to
 * the center, showing the connection. Everything rotates slowly.
 */

const TOOLS = [
  "GitHub", "GitLab", "Bitbucket", "Slack", "Notion", "Linear",
  "Jira", "Datadog", "PagerDuty", "Sentry", "Vercel", "Netlify",
  "CircleCI", "GH Actions", "ArgoCD", "Flux", "Kubernetes", "Docker",
  "Vault", "Doppler", "1Password", "Auth0", "Clerk", "Stripe",
];

export function Integrations() {
  const [hover, setHover] = useState<number | null>(null);
  const outerCount = 16;
  const innerCount = TOOLS.length - outerCount;

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <header className="mb-14 max-w-3xl">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act XV · Integrations
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
            Plays well with{" "}
            <span className="italic text-muted-foreground">everything.</span>
          </h2>
        </Reveal>
      </header>

      {/* Extra padding keeps chip labels inside their orbit ring. */}
      <div className="relative mx-auto aspect-square w-full max-w-2xl px-8 tablet:px-12">
        {/* Rings */}
        <div className="absolute inset-12 rounded-full border border-border/30" />
        <div className="absolute inset-32 rounded-full border border-border/40" />
        <div className="absolute inset-56 rounded-full border border-border/50" />

        {/* Connection lines to hovered */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
          {hover !== null && (
            <motion.line
              key={hover}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.35 }}
              x1={200}
              y1={200}
              x2={200 + Math.cos(angleFor(hover, outerCount, innerCount)) * radiusFor(hover, outerCount)}
              y2={200 + Math.sin(angleFor(hover, outerCount, innerCount)) * radiusFor(hover, outerCount)}
              stroke="#8B5CF6"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Central node */}
        <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ai bg-void">
          <div className="text-center">
            <div aria-hidden className="text-2xl">⚫</div>
            <div className="font-display text-[10px] uppercase tracking-widest">Black</div>
          </div>
          <div
            aria-hidden
            className="absolute inset-[-12px] rounded-full border border-ai/30 [animation:ping_3s_ease-in-out_infinite]"
          />
        </div>

        {/* Tools */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 motion-reduce:!animate-none motion-reduce:![transform:none]"
        >
          {TOOLS.map((t, i) => {
            const isOuter = i < outerCount;
            const angle = angleFor(i, outerCount, innerCount);
            const r = radiusFor(i, outerCount);
            const x = 200 + Math.cos(angle) * r;
            const y = 200 + Math.sin(angle) * r;
            return (
              <motion.div
                key={t}
                onHoverStart={() => setHover(i)}
                onHoverEnd={() => setHover(null)}
                animate={{ rotate: -360 }}
                transition={{ duration: 120, ease: "linear", repeat: Infinity }}
                style={{
                  left: `${(x / 400) * 100}%`,
                  top: `${(y / 400) * 100}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs backdrop-blur transition-colors ${
                    hover === i
                      ? "border-ai bg-ai/20 text-ink"
                      : "border-border/50 bg-graphite/50 text-muted-foreground hover:text-foreground"
                  } ${isOuter ? "" : "text-[11px]"}`}
                >
                  {t}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-foreground">
        Plus every tool that speaks HCL, JSON, or REST. If it has an API, we
        talk to it.
      </div>
    </section>
  );
}

function angleFor(i: number, outer: number, _inner: number): number {
  const isOuter = i < outer;
  if (isOuter) return (i / outer) * Math.PI * 2 - Math.PI / 2;
  const j = i - outer;
  return (j / _inner) * Math.PI * 2 - Math.PI / 2;
}
function radiusFor(i: number, outer: number): number {
  // Tightened radii so chip labels sit within their orbit ring at all
  // container widths (was 175/115 → tiles overflowed the max-w-2xl).
  return i < outer ? 145 : 90;
}
