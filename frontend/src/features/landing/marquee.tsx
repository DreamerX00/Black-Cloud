"use client";

import Image from "next/image";
import { NODE_REGISTRY } from "@/lib/nodes/registry";

/**
 * Infinite-loop provider marquee.
 * Two rows scroll opposite directions — Stripe/Linear pattern to signal
 * "we support everything." Pure CSS animation, no JS timers.
 */
export function ProviderMarquee() {
  // Two duplications per row so translate(-50%) leaves a seamless loop.
  const nodes = NODE_REGISTRY.filter((n) => n.iconPath);
  const rowA = [...nodes, ...nodes];
  const rowB = [...nodes.slice().reverse(), ...nodes.slice().reverse()];

  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-background/40 py-16 tablet:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-background to-transparent"
      />

      <div className="flex flex-col gap-6">
        <MarqueeRow items={rowA} direction="left" />
        <MarqueeRow items={rowB} direction="right" />
      </div>

      <div className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Every service. One canvas.
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: typeof NODE_REGISTRY;
  direction: "left" | "right";
}) {
  return (
    <div className="relative flex overflow-hidden">
      <div
        className={
          direction === "left"
            ? "flex shrink-0 items-center gap-8 will-change-transform animate-[marquee_45s_linear_infinite]"
            : "flex shrink-0 items-center gap-8 will-change-transform animate-[marquee-rev_50s_linear_infinite]"
        }
      >
        {items.map((n, i) => (
          <div
            key={`${n.id}-${i}`}
            className="flex shrink-0 items-center gap-3 rounded-lg border border-border/40 bg-graphite/40 px-4 py-3 backdrop-blur transition-colors hover:border-border"
          >
            {n.iconPath && (
              <Image
                src={n.iconPath}
                width={22}
                height={22}
                alt=""
                aria-hidden
                unoptimized
              />
            )}
            <div className="min-w-0 flex flex-col">
              <span className="text-sm font-medium leading-none">{n.label}</span>
              <span
                className="mt-1 text-[10px] uppercase tracking-widest"
                style={{ color: n.accent }}
              >
                {n.provider}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
