"use client";

import { Reveal } from "@/components/motion/reveal";

/**
 * Customers — horizontal marquee of recognizable brands that signal the
 * target market (cloud-native infra tooling). Placeholder wordmarks until
 * real logos are cleared for use.
 *
 * Uses a duplicated-track CSS marquee (no JS ticker) — motion respects
 * prefers-reduced-motion via a Tailwind arbitrary variant.
 */

const CUSTOMERS = [
  "Stripe",
  "Figma",
  "Vercel",
  "Linear",
  "Notion",
  "Ramp",
  "Retool",
  "Supabase",
  "PlanetScale",
  "Cloudflare",
];

export function Customers() {
  const track = [...CUSTOMERS, ...CUSTOMERS];
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-20 tablet:px-10 tablet:py-24">
      <header className="mb-10 text-center">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act XVII · Trusted by
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 font-display text-lg text-muted-foreground tablet:text-xl">
            Teams building on the same clouds you are.
          </p>
        </Reveal>
      </header>

      <div
        aria-label="Customer logos marquee"
        className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-14 motion-reduce:animate-none">
          {track.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex h-12 shrink-0 items-center px-2 font-display text-2xl font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground tablet:text-3xl"
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
