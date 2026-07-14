"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { PROVIDER_META } from "@/lib/nodes/registry";

const GlobeScene = dynamic(
  () => import("./scene/globe").then((m) => m.GlobeScene),
  { ssr: false, loading: () => null },
);

const MQ = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getSnapshot() {
  return window.matchMedia(MQ).matches;
}
function getServerSnapshot() {
  return false;
}

/**
 * Globe Section — Act IIa · "The Network".
 *
 * Full-bleed WebGL globe with orbiting service chips. Sits between Hero
 * and the marquee — its job is to make the "one graph, three clouds"
 * claim feel *literal*. Overlays: a headline centered, provider legend
 * bottom-left, orbit stats bottom-right.
 */
export function GlobeSection() {
  const reduce = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <section className="relative h-[110vh] overflow-hidden bg-void">
      {/* Radial glow behind the canvas so the sphere sits on ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.18),transparent_60%)]"
      />

      {/* WebGL canvas */}
      <div className="absolute inset-0">{!reduce && <GlobeScene />}</div>

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--bc-void)_95%)]"
      />

      {/* Content overlays */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-between px-6 py-16 tablet:px-10 tablet:py-24">
        <header className="max-w-2xl">
          <Reveal>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Act II · The network
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.02em] tablet:text-6xl desktop:text-7xl">
              One graph.{" "}
              <span className="bg-gradient-to-r from-ai via-gcp to-aws bg-clip-text text-transparent">
                Three clouds.
              </span>
              <br />
              In orbit.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Every service you drop into BlackCloud joins the same living
              network. AWS, Azure, and GCP as concentric orbits — one topology,
              zero context switches.
            </p>
          </Reveal>
        </header>

        <div className="flex flex-col gap-6 tablet:flex-row tablet:items-end tablet:justify-between">
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-wrap gap-3 rounded-2xl border border-border/40 bg-space/60 p-3 backdrop-blur"
          >
            {(["aws", "azure", "gcp"] as const).map((p) => {
              const meta = PROVIDER_META[p];
              return (
                <li key={p} className="flex items-center gap-2 rounded-lg bg-void/40 px-3 py-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: meta.accent,
                      boxShadow: `0 0 12px ${meta.accent}`,
                    }}
                  />
                  <span className="font-mono text-xs text-ink">{meta.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {meta.count} orbiting
                  </span>
                </li>
              );
            })}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid grid-cols-3 gap-4 rounded-2xl border border-border/40 bg-space/60 p-4 font-mono text-[10px] uppercase tracking-widest backdrop-blur"
          >
            <div>
              <div className="text-muted-foreground">orbit</div>
              <div className="text-ink">stable</div>
            </div>
            <div>
              <div className="text-muted-foreground">latency</div>
              <div className="text-success">4 ms</div>
            </div>
            <div>
              <div className="text-muted-foreground">fps</div>
              <div className="text-ai">60</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
